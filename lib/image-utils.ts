import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/db';
import { images } from '@/lib/db/schema';
import type { NewImage } from '@/lib/db/schema';

const STORAGE_BASE_PATH = 'public/storage/image';
const PUBLIC_BASE_PATH = '/storage/image';

// Image size configurations
const IMAGE_SIZES = {
  small: { width: 150, height: 150 },
  medium: { width: 400, height: 400 },
  large: { width: 800, height: 800 },
} as const;

type ImageSize = keyof typeof IMAGE_SIZES;

/**
 * Ensures the storage directories exist
 */
async function ensureDirectoriesExist() {
  const dirs = [
    STORAGE_BASE_PATH,
    path.join(STORAGE_BASE_PATH, 'small'),
    path.join(STORAGE_BASE_PATH, 'medium'),
    path.join(STORAGE_BASE_PATH, 'large'),
    path.join(STORAGE_BASE_PATH, 'original'),
  ];

  for (const dir of dirs) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }
}

/**
 * Generates a unique filename
 */
function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const ext = path.extname(originalName);
  return `${timestamp}-${random}${ext}`;
}

/**
 * Processes an image to create different sizes
 */
async function processImage(
  buffer: Buffer,
  fileName: string
): Promise<{
  originalPath: string;
  smallPath: string;
  mediumPath: string;
  largePath: string;
  width: number;
  height: number;
}> {
  await ensureDirectoriesExist();

  // Get original image metadata
  const metadata = await sharp(buffer).metadata();
  const width = metadata.width || 0;
  const height = metadata.height || 0;

  // Save original
  const originalPath = path.join(STORAGE_BASE_PATH, 'original', fileName);
  await fs.writeFile(originalPath, buffer);

  // Process and save different sizes
  const sizes: Record<ImageSize, string> = {
    small: '',
    medium: '',
    large: '',
  };

  for (const [sizeName, config] of Object.entries(IMAGE_SIZES)) {
    const sizeFileName = `${sizeName}-${fileName}`;
    const sizePath = path.join(STORAGE_BASE_PATH, sizeName, sizeFileName);

    await sharp(buffer)
      .resize(config.width, config.height, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: 85 })
      .toFile(sizePath);

    sizes[sizeName as ImageSize] = path.join(PUBLIC_BASE_PATH, sizeName, sizeFileName);
  }

  return {
    originalPath: path.join(PUBLIC_BASE_PATH, 'original', fileName),
    smallPath: sizes.small,
    mediumPath: sizes.medium,
    largePath: sizes.large,
    width,
    height,
  };
}

/**
 * Stores an image and returns the database record
 */
export async function storeImage(
  file: File
): Promise<{ id: number; paths: ReturnType<typeof processImage> extends Promise<infer T> ? T : never }> {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Convert file to buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Generate unique filename
  const fileName = generateFileName(file.name);

  // Process image
  const paths = await processImage(buffer, fileName);

  // Save to database
  const imageData: NewImage = {
    originalName: file.name,
    fileName,
    mimeType: file.type,
    size: file.size,
    width: paths.width,
    height: paths.height,
    originalPath: paths.originalPath,
    smallPath: paths.smallPath,
    mediumPath: paths.mediumPath,
    largePath: paths.largePath,
  };

  const [result] = await db.insert(images).values(imageData).returning({ id: images.id });

  return {
    id: result.id,
    paths,
  };
}

/**
 * Gets an image by ID
 */
export async function getImage(id: number) {
  const [image] = await db.select().from(images).where(eq(images.id, id));
  return image;
}

/**
 * Deletes an image and its files
 */
export async function deleteImage(id: number): Promise<void> {
  const image = await getImage(id);
  if (!image) {
    throw new Error('Image not found');
  }

  // Delete files
  const filesToDelete = [
    path.join('public', image.originalPath),
    path.join('public', image.smallPath || ''),
    path.join('public', image.mediumPath || ''),
    path.join('public', image.largePath || ''),
  ].filter(Boolean);

  for (const filePath of filesToDelete) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.warn(`Failed to delete file: ${filePath}`, error);
    }
  }

  // Delete from database
  await db.delete(images).where(eq(images.id, id));
}

/**
 * Gets the public URL for an image size
 */
export function getImageUrl(image: { smallPath?: string | null; mediumPath?: string | null; largePath?: string | null; originalPath: string }, size: ImageSize | 'original' = 'small'): string {
  let imagePath: string;

  switch (size) {
    case 'small':
      imagePath = image.smallPath || image.originalPath;
      break;
    case 'medium':
      imagePath = image.mediumPath || image.originalPath;
      break;
    case 'large':
      imagePath = image.largePath || image.originalPath;
      break;
    case 'original':
      imagePath = image.originalPath;
      break;
    default:
      imagePath = image.originalPath;
  }

  // Convert the storage path to API endpoint path
  // Remove the leading '/storage/image/' and prepend '/api/images/'
  if (imagePath.startsWith('/storage/image/')) {
    return imagePath.replace('/storage/image/', '/api/images/');
  }

  return imagePath;
}

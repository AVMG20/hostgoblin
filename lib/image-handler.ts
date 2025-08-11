'use server'
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/db';
import { images } from '@/lib/db/schema';
import type { NewImage } from '@/lib/db/schema';

/**
 * Ensures the storage directories exist
 */
async function ensureDirectoriesExist() {
    const dirs = [
        'public/storage/image',
        path.join('public/storage/image', 'small'),
        path.join('public/storage/image', 'medium'),
        path.join('public/storage/image', 'large'),
        path.join('public/storage/image', 'original'),
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
    width: number;
    height: number;
}> {
    await ensureDirectoriesExist();

    // Get original image metadata
    const metadata = await sharp(buffer).metadata();
    const width = metadata.width || 0;
    const height = metadata.height || 0;

    // Save original
    const originalPath = path.join('public/storage/image', 'original', fileName);
    await fs.writeFile(originalPath, buffer);

    // Process and save different sizes
    for (const [sizeName, config] of Object.entries({
        small: { width: 150, height: 150 },
        medium: { width: 400, height: 400 },
        large: { width: 800, height: 800 },
    })) {
        const sizeFileName = `${sizeName}-${fileName}`;
        const sizePath = path.join('public/storage/image', sizeName, sizeFileName);

        await sharp(buffer)
            .resize(config.width, config.height, {
                fit: 'cover',
                position: 'center',
            })
            .jpeg({ quality: 85 })
            .toFile(sizePath);
    }

    return {
        width,
        height,
    };
}

/**
 * Stores an image and returns the database record
 */
export async function storeImage(
    file: File
): Promise<{ id: number; fileName: string }> {
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
    const { width, height } = await processImage(buffer, fileName);

    // Save to database
    const imageData: NewImage = {
        originalName: file.name,
        fileName,
        mimeType: file.type,
        size: file.size,
        width,
        height,
    };

    const [result] = await db.insert(images).values(imageData).returning({ id: images.id });

    return {
        id: result.id,
        fileName,
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

    // Delete files - construct paths from fileName
    const filesToDelete = [
        path.join('public/storage/image', 'original', image.fileName),
        path.join('public/storage/image', 'small', `small-${image.fileName}`),
        path.join('public/storage/image', 'medium', `medium-${image.fileName}`),
        path.join('public/storage/image', 'large', `large-${image.fileName}`),
    ];

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

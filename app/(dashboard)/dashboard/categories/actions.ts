'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { parseWithZod } from '@conform-to/zod';
import { categorySchema } from '@/app/(dashboard)/dashboard/categories/schema';
import {db} from "@/lib/db/db";
import {categories, images} from "@/lib/db/schema";
import {eq} from "drizzle-orm";
import { storeImage, deleteImage } from '@/lib/image-utils';

export async function createCategory(prevState: unknown, formData: FormData) {
    const submission = parseWithZod(formData, {
        schema: categorySchema.omit({ id: true }), // Remove id for create
    });

    if (submission.status !== 'success') {
        return submission.reply();
    }

    try {
        let imageId: number | null = null;

        // Handle image upload
        const imageFile = formData.get('image_file') as File;
        if (imageFile && imageFile.size > 0) {
            try {
                const result = await storeImage(imageFile);
                imageId = result.id;
            } catch (imageError) {
                console.error('Failed to store image:', imageError);
                return submission.reply({
                    formErrors: ['Failed to upload image. Please try again.'],
                });
            }
        }

        // Create category with imageId
        const categoryData = {
            ...submission.value,
            imageId,
        };

        await db.insert(categories).values(categoryData);

        revalidatePath('/');
        revalidatePath('/dashboard/categories');
    } catch (error) {
        console.log(error);
        return submission.reply({
            formErrors: ['Failed to create category. Please try again.'],
        });
    }

    redirect('/dashboard/categories');
}

export async function updateCategory(prevState: unknown, formData: FormData) {
    const submission = parseWithZod(formData, {
        schema: categorySchema.required({ id: true }), // Require id for update
    });

    if (submission.status !== 'success') {
        return submission.reply();
    }

    try {
        const id = submission.value.id;

        // Get current category to check for existing image
        const currentCategory = await db.select()
            .from(categories)
            .where(eq(categories.id, id));

        if (!currentCategory[0]) {
            return submission.reply({
                formErrors: ['Category not found.'],
            });
        }

        let imageId: number | null = currentCategory[0].imageId;

        // Handle image upload
        const imageFile = formData.get('image_file') as File;
        if (imageFile && imageFile.size > 0) {
            try {
                // Delete old image if exists
                if (imageId) {
                    await deleteImage(imageId);
                }

                // Store new image
                const result = await storeImage(imageFile);
                imageId = result.id;
            } catch (imageError) {
                console.error('Failed to store image:', imageError);
                return submission.reply({
                    formErrors: ['Failed to upload image. Please try again.'],
                });
            }
        }

        // Update category with imageId
        const categoryData = {
            ...submission.value,
            imageId,
            id: undefined,
        };

        const category = await db.update(categories)
            .set(categoryData)
            .where(eq(categories.id, id))
            .returning();

        const slug = category[0].slug;

        revalidatePath('/');
        revalidatePath('/dashboard/categories');
        revalidatePath(`/categories/${slug}`);
    } catch (error: any) {
        return submission.reply({
            formErrors: ['Failed to update category. Please try again.'],
        });
    }

    redirect('/dashboard/categories');
}

export async function deleteCategory(id: number) {
    try {
        // Get category to check for image
        const currentCategory = await db.select()
            .from(categories)
            .where(eq(categories.id, id));

        if (!currentCategory[0]) {
            throw new Error('Category not found');
        }

        // Delete associated image if exists
        if (currentCategory[0].imageId) {
            try {
                await deleteImage(currentCategory[0].imageId);
            } catch (imageError) {
                console.warn('Failed to delete category image:', imageError);
            }
        }

        const category = await db.delete(categories).where(eq(categories.id, id)).returning();

        const slug = category[0].slug;

        revalidatePath('/');
        revalidatePath('/dashboard/categories');
        revalidatePath(`/categories/${slug}`);

    } catch (error: any) {
        throw new Error('Failed to delete category');
    }
}

export async function getCategory(id: number) {
    try {
        const category = await db.select({
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
            description: categories.description,
            icon: categories.icon,
            imageId: categories.imageId,
            parentId: categories.parentId,
            sortOrder: categories.sortOrder,
            isActive: categories.isActive,
            createdAt: categories.createdAt,
            updatedAt: categories.updatedAt,
            image: {
                id: images.id,
                originalName: images.originalName,
                fileName: images.fileName,
                mimeType: images.mimeType,
                size: images.size,
                width: images.width,
                height: images.height,
                smallPath: images.smallPath,
                mediumPath: images.mediumPath,
                largePath: images.largePath,
                originalPath: images.originalPath,
                createdAt: images.createdAt,
            }
        })
        .from(categories)
        .leftJoin(images, eq(categories.imageId, images.id))
        .where(eq(categories.id, id));

        return category[0] || null;
    } catch (error: any) {
        throw new Error('Failed to get category');
    }
}

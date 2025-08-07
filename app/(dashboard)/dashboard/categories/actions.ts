'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { parseWithZod } from '@conform-to/zod';
import { categorySchema } from '@/app/(dashboard)/dashboard/categories/schema';
import {db} from "@/lib/db/db";
import {categories} from "@/lib/db/schema";
import {eq} from "drizzle-orm";

export async function createCategory(prevState: unknown, formData: FormData) {
    const submission = parseWithZod(formData, {
        schema: categorySchema.omit({ id: true }), // Remove id for create
    });

    if (submission.status !== 'success') {
        return submission.reply();
    }

    try {
        // @ts-ignore
        await db.insert(categories).values(submission.value)

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
        const category = await db.update(categories)
            .set({...submission.value, id: undefined})
            .where(eq(categories.id, id))
            .returning()

        const slug = category[0].slug

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
        const category = await db.delete(categories).where(eq(categories.id, id)).returning();

        const slug = category[0].slug

        revalidatePath('/');
        revalidatePath('/dashboard/categories');
        revalidatePath(`/categories/${slug}`);

    } catch (error: any) {
        throw new Error('Failed to delete category');
    }
}

export async function getCategory(id: number) {
    try {
        const category = await db.select()
            .from(categories)
            .where(eq(categories.id, id));
        return category[0] || null;
    } catch (error: any) {
        throw new Error('Failed to get category');
    }
}
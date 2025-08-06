'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { parseWithZod } from '@conform-to/zod';
import { postSchema } from '@/app/admin/posts/schema';
import {db} from "@/lib/db/db";
import {posts} from "@/lib/db/schema";
import {eq} from "drizzle-orm";

export async function createPost(prevState: unknown, formData: FormData) {
    const submission = parseWithZod(formData, {
        schema: postSchema.omit({ id: true }), // Remove id for create
    });

    if (submission.status !== 'success') {
        return submission.reply();
    }

    try {
        // @ts-ignore
        await db.insert(posts).values(submission.value)
        revalidatePath('/admin/posts');
    } catch (error) {
        console.log(error);
        return submission.reply({
            formErrors: ['Failed to create post. Please try again.'],
        });
    }

    revalidatePath('/admin/posts');
    redirect('/admin/posts');
}

export async function updatePost(prevState: unknown, formData: FormData) {
    const submission = parseWithZod(formData, {
        schema: postSchema.required({ id: true }), // Require id for update
    });

    if (submission.status !== 'success') {
        return submission.reply();
    }

    try {
        const id = submission.value.id;
        await db.update(posts)
            .set({...submission.value, id: undefined})
            .where(eq(posts.id, id));
        revalidatePath('/admin/posts');
    } catch (error: any) {
        return submission.reply({
            formErrors: ['Failed to update post. Please try again.'],
        });
    }

    revalidatePath('/admin/posts');
    redirect('/admin/posts');
}

export async function deletePost(id: number) {
    try {
        await db.delete(posts).where(eq(posts.id, id));
    } catch (error: any) {
        throw new Error('Failed to delete post');
    }

    revalidatePath('/admin/posts');
}

export async function getPost(id: number) {
    try {
        const post = await db.select()
            .from(posts)
            .where(eq(posts.id, id));
        return post[0] || null;
    } catch (error: any) {
        throw new Error('Failed to get post');
    }
}


// schema.ts
import { z } from 'zod';

export const postSchema = z.object({
    id: z.number()
        .optional(), // Optional for create, required for update
    title: z.string()
        .min(1, 'Title is required')
        .max(255, 'Title must be less than 255 characters'),
    content: z.string()
        .min(1, 'Content is required'),
    slug: z.string()
        .min(1, 'Slug is required')
        .max(255, 'Slug must be less than 255 characters'),
    published: z.boolean()
        .nullable()
        .default(false),
});

export type PostFormData = z.infer<typeof postSchema>;
// schema.ts
import { z } from 'zod';

export const categorySchema = z.object({
    id: z.number()
        .optional(), // Optional for create, required for update
    name: z.string()
        .min(1, 'Name is required')
        .max(255, 'Name must be less than 255 characters'),
    slug: z.string()
        .min(1, 'Slug is required')
        .max(255, 'Slug must be less than 255 characters'),
    description: z.string()
        .optional(),
    icon: z.string()
        .optional(),
    parentId: z.number()
        .nullable()
        .optional(),
    sortOrder: z.number()
        .default(0),
    isActive: z.boolean()
        .default(true),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
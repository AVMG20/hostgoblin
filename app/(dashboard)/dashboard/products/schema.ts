// schema.ts
import { z } from 'zod';

export const productSchema = z.object({
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
    categoryId: z.number()
        .min(1, 'Category is required'),
    ramMb: z.number()
        .min(0, 'RAM must be a positive number')
        .optional(),
    cpuCores: z.number()
        .min(0, 'CPU cores must be a positive number')
        .optional(),
    diskGb: z.number()
        .min(0, 'Disk space must be a positive number')
        .optional(),
    bandwidth: z.number()
        .min(0, 'Bandwidth must be a positive number')
        .optional(),
    customLimits: z.any()
        .optional(), // JSON field
    pricePerHour: z.number()
        .min(0, 'Price per hour must be a positive number'),
    isActive: z.boolean()
        .default(false),
    isPopular: z.boolean()
        .default(false),
    sortOrder: z.number()
        .default(0),
    integrationType: z.string()
        .optional(),
    integrationConfig: z.any()
        .optional(), // JSON field
});

export type ProductFormData = z.infer<typeof productSchema>;
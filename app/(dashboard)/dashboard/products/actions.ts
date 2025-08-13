'use server';

import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {parseWithZod} from '@conform-to/zod';
import {productSchema} from '@/app/(dashboard)/dashboard/products/schema';
import {db} from "@/lib/db/db";
import {categories, products} from "@/lib/db/schema";
import {eq} from "drizzle-orm";

export async function createProduct(prevState: unknown, formData: FormData) {
    const submission = parseWithZod(formData, {
        schema: productSchema.omit({ id: true }), // Remove id for create
    });

    if (submission.status !== 'success') {
        return submission.reply();
    }

    // Create product
    const productData = {
        ...submission.value,
    };

    const existingProduct = await db.select()
        .from(products)
        .where(eq(products.slug, productData.slug))
        .limit(1);

    if (existingProduct) {
        return submission.reply({
            fieldErrors: {
                slug: ['Product with this slug already exists.']
            },
        });
    }

    try {
        await db.insert(products).values(productData);

        revalidatePath('/');
        revalidatePath('/dashboard/products');
    } catch (error) {
        console.log(error);
        return submission.reply({
            formErrors: ['Failed to create product. Please try again.'],
        });
    }

    redirect('/dashboard/products');
}

export async function updateProduct(prevState: unknown, formData: FormData) {
    const submission = parseWithZod(formData, {
        schema: productSchema.required({ id: true }), // Require id for update
    });

    if (submission.status !== 'success') {
        return submission.reply();
    }

    try {
        const id = submission.value.id;

        // Get current product to verify it exists
        const currentProduct = await db.select()
            .from(products)
            .where(eq(products.id, id));

        if (!currentProduct[0]) {
            return submission.reply({
                formErrors: ['Product not found.'],
            });
        }

        // Update product
        const productData = {
            ...submission.value,
            id: undefined,
        };

        const product = await db.update(products)
            .set(productData)
            .where(eq(products.id, id))
            .returning();

        const slug = product[0].slug;

        revalidatePath('/');
        revalidatePath('/dashboard/products');
        revalidatePath(`/products/${slug}`);
    } catch (error: any) {
        return submission.reply({
            formErrors: ['Failed to update product. Please try again.'],
        });
    }

    redirect('/dashboard/products');
}

export async function deleteProduct(id: number) {
    try {
        // Get product to verify it exists
        const currentProduct = await db.select()
            .from(products)
            .where(eq(products.id, id));

        if (!currentProduct[0]) {
            throw new Error('Product not found');
        }

        const product = await db.delete(products).where(eq(products.id, id)).returning();

        const slug = product[0].slug;

        revalidatePath('/');
        revalidatePath('/dashboard/products');
        revalidatePath(`/products/${slug}`);

    } catch (error: any) {
        throw new Error('Failed to delete product');
    }
}

export async function getProduct(id: number) {
    try {
        const product = await db.select({
            id: products.id,
            name: products.name,
            slug: products.slug,
            description: products.description,
            categoryId: products.categoryId,
            ramMb: products.ramMb,
            cpuCores: products.cpuCores,
            diskGb: products.diskGb,
            bandwidth: products.bandwidth,
            customLimits: products.customLimits,
            pricePerHour: products.pricePerHour,
            isActive: products.isActive,
            isPopular: products.isPopular,
            sortOrder: products.sortOrder,
            integrationType: products.integrationType,
            integrationConfig: products.integrationConfig,
            createdAt: products.createdAt,
            updatedAt: products.updatedAt,
            category: {
                id: categories.id,
                name: categories.name,
                slug: categories.slug,
            }
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(eq(products.id, id));

        return product[0] || null;
    } catch (error: any) {
        throw new Error('Failed to get product');
    }
}

export async function getCategories() {
    try {
        return await db.select({
            id: categories.id,
            name: categories.name,
        })
            .from(categories)
            .where(eq(categories.isActive, true))
            .orderBy(categories.name);
    } catch (error: any) {
        throw new Error('Failed to get categories');
    }
}
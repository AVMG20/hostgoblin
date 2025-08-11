import { relations } from 'drizzle-orm';
import { pgTable, text, integer, serial, numeric, boolean, timestamp, json } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const posts = pgTable('posts', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    slug: text('slug').notNull().unique(),
    published: boolean('published').default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
});

export const images = pgTable('images', {
    id: serial('id').primaryKey(),
    originalName: text('original_name').notNull(),
    fileName: text('file_name').notNull(),
    mimeType: text('mime_type').notNull(),
    size: integer('size').notNull(),
    width: integer('width'),
    height: integer('height'),
    smallPath: text('small_path'),
    mediumPath: text('medium_path'),
    largePath: text('large_path'),
    originalPath: text('original_path').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const categories = pgTable('categories', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    icon: text('icon'),
    imageId: integer('image_id'),
    parentId: integer('parent_id'),
    sortOrder: integer('sort_order').default(0),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
});

export const products = pgTable('products', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    categoryId: integer('category_id').notNull(),
    ramMb: integer('ram_mb'),
    cpuCores: integer('cpu_cores'),
    diskGb: integer('disk_gb'),
    bandwidth: integer('bandwidth'),
    customLimits: json('custom_limits'),
    pricePerHour: numeric('price_per_hour').notNull(),
    isActive: boolean('is_active').default(true),
    isPopular: boolean('is_popular').default(false),
    sortOrder: integer('sort_order').default(0),
    integrationType: text('integration_type'),
    integrationConfig: json('integration_config'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
});

export const productFeatures = pgTable('product_features', {
    id: serial('id').primaryKey(),
    productId: integer('product_id').notNull(),
    feature: text('feature').notNull(),
    sortOrder: integer('sort_order').default(0),
});

export const imagesRelations = relations(images, ({ many }) => ({
    categories: many(categories),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
    parent: one(categories, {
        fields: [categories.parentId],
        references: [categories.id],
    }),
    children: many(categories),
    products: many(products),
    image: one(images, {
        fields: [categories.imageId],
        references: [images.id],
    }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
    category: one(categories, {
        fields: [products.categoryId],
        references: [categories.id],
    }),
    features: many(productFeatures),
}));

export const productFeaturesRelations = relations(productFeatures, ({ one }) => ({
    product: one(products, {
        fields: [productFeatures.productId],
        references: [products.id],
    }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Image = typeof images.$inferSelect;
export type NewImage = typeof images.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type ProductFeature = typeof productFeatures.$inferSelect;
export type NewProductFeature = typeof productFeatures.$inferInsert;

import { sql, relations } from 'drizzle-orm';
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const posts = sqliteTable('posts', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    content: text('content').notNull(),
    slug: text('slug').notNull().unique(),
    published: integer('published', { mode: 'boolean' }).default(false),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$onUpdate(() => new Date()),
});

export const images = sqliteTable('images', {
    id: integer('id').primaryKey({ autoIncrement: true }),
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
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
});

export const categories = sqliteTable('categories', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    icon: text('icon'),
    imageId: integer('image_id'),
    parentId: integer('parent_id'),
    sortOrder: integer('sort_order').default(0),
    isActive: integer('is_active', { mode: 'boolean' }).default(true),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$onUpdate(() => new Date()),
});

export const products = sqliteTable('products', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    categoryId: integer('category_id').notNull(),
    ramMb: integer('ram_mb'),
    cpuCores: integer('cpu_cores'),
    diskGb: integer('disk_gb'),
    bandwidth: integer('bandwidth'),
    customLimits: text('custom_limits', { mode: 'json' }),
    pricePerHour: real('price_per_hour').notNull(),
    isActive: integer('is_active', { mode: 'boolean' }).default(true),
    isPopular: integer('is_popular', { mode: 'boolean' }).default(false),
    sortOrder: integer('sort_order').default(0),
    integrationType: text('integration_type'),
    integrationConfig: text('integration_config', { mode: 'json' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$onUpdate(() => new Date()),
});

export const productFeatures = sqliteTable('product_features', {
    id: integer('id').primaryKey({ autoIncrement: true }),
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

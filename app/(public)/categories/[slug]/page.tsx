import { notFound } from 'next/navigation';
import { db } from '@/lib/db/db';
import { categories, products } from '@/lib/db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Star, Cpu, HardDrive, Zap, Server } from 'lucide-react';
import Link from 'next/link';
import Dinero from "dinero.js";

export const revalidate = 3600;

interface CategoryPageProps {
    params: Promise<{
        slug: string;
    }>;
}

async function getCategory(slug: string) {
    try {
        const category = await db.select()
            .from(categories)
            .where(and(
                eq(categories.slug, slug),
                eq(categories.isActive, true)
            ));
        return category[0] || null;
    } catch (error) {
        console.error('Failed to get category:', error);
        return null;
    }
}

async function getChildCategories(parentId: number) {
    try {
        return await db.select()
            .from(categories)
            .where(and(
                eq(categories.parentId, parentId),
                eq(categories.isActive, true)
            ));
    } catch (error) {
        console.error('Failed to get child categories:', error);
        return [];
    }
}

async function getCategoryProducts(categoryId: number) {
    try {
        // First, check if this category has child categories
        const childCategories = await getChildCategories(categoryId);

        if (childCategories.length > 0) {
            // If it's a parent category, get products from all child categories
            const childCategoryIds = childCategories.map(child => child.id);
            return await db.select()
                .from(products)
                .where(and(
                    eq(products.isActive, true),
                    // Use inArray to get products from all child categories
                    inArray(products.categoryId, childCategoryIds)
                ))
                .orderBy(products.sortOrder, products.name);
        } else {
            // If it's a child category (or has no children), get products only from this category
            return await db.select()
                .from(products)
                .where(and(
                    eq(products.categoryId, categoryId),
                    eq(products.isActive, true)
                ))
                .orderBy(products.sortOrder, products.name);
        }
    } catch (error) {
        console.error('Failed to get category products:', error);
        return [];
    }
}

async function getAllCategories() {
    try {
        return await db.select()
            .from(categories)
            .where(eq(categories.isActive, true));
    } catch (error) {
        console.error('Failed to get categories:', error);
        return [];
    }
}

export async function generateStaticParams() {
    const allCategories = await getAllCategories();
    return allCategories.map((category) => (
        {
            slug: category.slug,
        }
    ));
}

export async function generateMetadata({ params }: CategoryPageProps) {
    const param = await params;
    const category = await getCategory(param.slug);

    if (!category) {
        return {
            title: 'Category Not Found',
        };
    }

    return {
        title: category.name,
        description: category.description || `Browse ${category.name} products`,
    };
}



function formatSpecs(product: any) {
    const specs = [];
    if (product.ramMb) specs.push({ icon: Server, label: 'RAM', value: `${product.ramMb}MB` });
    if (product.cpuCores) specs.push({ icon: Cpu, label: 'CPU', value: `${product.cpuCores} cores` });
    if (product.diskGb) specs.push({ icon: HardDrive, label: 'Disk', value: `${product.diskGb}GB` });
    if (product.bandwidth) specs.push({ icon: Zap, label: 'Bandwidth', value: `${product.bandwidth}MB` });
    return specs;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const param = await params;
    const category = await getCategory(param.slug);

    if (!category) {
        notFound();
    }

    const categoryProducts = await getCategoryProducts(category.id);

    return (
        <div className="container mx-auto py-8 px-4 space-y-8">
            {/* Header Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <h1 className="text-4xl font-bold tracking-tight">{category.name}</h1>
                    {categoryProducts.length > 0 && (
                        <Badge variant="secondary" className="text-sm">
                            {categoryProducts.length} {categoryProducts.length === 1 ? 'product' : 'products'}
                        </Badge>
                    )}
                </div>
                {category.description && (
                    <p className="text-xl text-muted-foreground max-w-3xl">
                        {category.description}
                    </p>
                )}
                <Separator />
            </div>

            {/* Products Grid */}
            {categoryProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryProducts.map((product) => {
                        const specs = formatSpecs(product);

                        return (
                            <Card key={product.id} className="group hover:shadow-lg transition-all duration-200 hover:scale-105">
                                <CardHeader className="space-y-3">
                                    <div className="flex items-start justify-between">
                                        <CardTitle className="text-xl transition-colors">
                                            {product.name}
                                        </CardTitle>
                                        {product.isPopular && (
                                            <Badge variant="default" className="flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-current" />
                                                Popular
                                            </Badge>
                                        )}
                                    </div>
                                    {product.description && (
                                        <CardDescription className="text-sm leading-relaxed">
                                            {product.description}
                                        </CardDescription>
                                    )}
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    {/* Specifications */}
                                    {specs.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                                                Specifications
                                            </h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                {specs.map((spec, index) => (
                                                    <div key={index} className="flex items-center gap-2 text-sm">
                                                        <spec.icon className="w-4 h-4 text-muted-foreground" />
                                                        <span className="text-muted-foreground">{spec.label}:</span>
                                                        <span className="font-medium">{spec.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Pricing and Action */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-3xl font-bold text-primary">
                                                   {Dinero({amount: product.pricePerHour, currency: 'EUR'}).toFormat()}
                                                </div>
                                                <div className="text-sm text-muted-foreground">per hour</div>
                                            </div>
                                        </div>

                                        <Link href={`/checkout/${product.slug}`}>
                                            <Button className="w-full" size="lg">
                                                Get Started
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <Card className="text-center py-12">
                    <CardContent>
                        <div className="space-y-4">
                            <Server className="w-16 h-16 text-muted-foreground mx-auto" />
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold">No products available</h3>
                                <p className="text-muted-foreground">
                                    Products in this category will appear here once they're added.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

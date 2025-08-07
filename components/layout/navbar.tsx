import Link from 'next/link';
import { db } from '@/lib/db/db';
import { categories } from '@/lib/db/schema';
import { and, eq, isNull } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

async function getRootCategories() {
    try {
        return await db.select()
            .from(categories)
            .where(and(
                isNull(categories.parentId),
                eq(categories.isActive, true)
            ))
            .orderBy(categories.sortOrder, categories.name);
    } catch (error) {
        console.error('Failed to get root categories:', error);
        return [];
    }
}

export default async function Navbar() {
    const rootCategories = await getRootCategories();

    return (
        <nav className="border-b">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Home Link */}
                    <Link
                        href="/public"
                        className="text-xl font-bold hover:text-primary transition-colors"
                    >
                        Your Store
                    </Link>

                    {/* Desktop Categories Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {rootCategories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/app/(public)/categories/${category.slug}`}
                                className="text-muted-foreground hover:text-primary transition-colors font-medium"
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                                <div className="flex flex-col space-y-4 mt-4">
                                    {rootCategories.map((category) => (
                                        <Link
                                            key={category.id}
                                            href={`/app/(public)/categories/${category.slug}`}
                                            className="text-muted-foreground hover:text-primary transition-colors font-medium py-2"
                                        >
                                            {category.name}
                                        </Link>
                                    ))}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
}
import Link from 'next/link';
import { db } from '@/lib/db/db';
import { categories } from '@/lib/db/schema';
import { and, eq, isNull } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, ChevronDown } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    imageId: number | null;
    parentId: number | null;
    sortOrder: number | null;
    isActive: boolean | null;
    createdAt: Date;
    updatedAt: Date;
    children?: Category[];
}

async function getAllCategories(): Promise<Category[]> {
    try {
        return await db.select()
            .from(categories)
            .where(eq(categories.isActive, true))
            .orderBy(categories.sortOrder, categories.name);
    } catch (error) {
        console.error('Failed to get categories:', error);
        return [];
    }
}

function buildCategoryTree(categories: Category[]): Category[] {
    const categoryMap = new Map<number, Category>();
    const rootCategories: Category[] = [];

    // Create a map of all categories
    categories.forEach(category => {
        categoryMap.set(category.id, { ...category, children: [] });
    });

    // Build the tree structure
    categories.forEach(category => {
        const categoryWithChildren = categoryMap.get(category.id)!;

        if (category.parentId === null) {
            rootCategories.push(categoryWithChildren);
        } else {
            const parent = categoryMap.get(category.parentId);
            if (parent) {
                parent.children!.push(categoryWithChildren);
            }
        }
    });

    return rootCategories;
}

export default async function Navbar() {
    const allCategories = await getAllCategories();
    const rootCategories = buildCategoryTree(allCategories);

    const renderCategoryItem = (category: Category) => {
        const hasChildren = category.children && category.children.length > 0;

        if (hasChildren) {
            return (
                <DropdownMenu key={category.id}>
                    <DropdownMenuTrigger className="flex items-center text-muted-foreground hover:text-primary transition-colors font-medium cursor-pointer">
                        {category.name}
                        <ChevronDown className="ml-1 h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {category.children!.map((child) => (
                            <DropdownMenuItem key={child.id} asChild>
                                <Link href={`/categories/${child.slug}`} className="w-full">
                                    {child.name}
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }

        return (
            <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
            >
                {category.name}
            </Link>
        );
    };

    const renderMobileCategoryItem = (category: Category) => {
        const hasChildren = category.children && category.children.length > 0;

        if (hasChildren) {
            return (
                <div key={category.id} className="space-y-2">
                    <div className="text-muted-foreground font-medium py-2 block text-sm uppercase tracking-wide">
                        {category.name}
                    </div>
                    <div className="pl-4 space-y-2">
                        {category.children!.map((child) => (
                            <Link
                                key={child.id}
                                href={`/categories/${child.slug}`}
                                className="text-muted-foreground hover:text-primary transition-colors font-medium py-1 block text-sm"
                            >
                                {child.name}
                            </Link>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="text-muted-foreground hover:text-primary transition-colors font-medium py-2 block"
            >
                {category.name}
            </Link>
        );
    };

    return (
        <nav className="border-b">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Home Link */}
                    <Link
                        href="/"
                        className="text-xl font-bold hover:text-primary transition-colors"
                    >
                        HostGoblin
                    </Link>

                    {/* Desktop Categories Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {rootCategories.map(renderCategoryItem)}
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
                                    {rootCategories.map(renderMobileCategoryItem)}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
}

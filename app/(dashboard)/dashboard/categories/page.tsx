import {DataTable} from '@/components/form/data-table';
import {Button} from '@/components/ui/button';
import {Plus} from 'lucide-react';
import Link from 'next/link';
import {Category, categories as categoriesTable} from "@/lib/db/schema";
import {columns} from "@/app/(admin)/admin/categories/columns";
import {PageProps, parseSearchParams, queryIndex} from "@/lib/db/datatable";

export default async function CategoriesPage({searchParams}: PageProps) {
    const {page, search, sort, order} = await parseSearchParams(searchParams)

    const [categories, totalCount] = await queryIndex(categoriesTable, {
        page,
        search,
        sort,
        order,
        searchableColumns: [
            'id',
            'name',
            'slug',
            'description'
        ],
        defaultSort: 'createdAt'
    });

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Categories</h1>
                <Link href="/app/(admin)/admin/categories/create">
                    <Button>
                        <Plus className="w-4 h-4 mr-2"/>
                        Create New Category
                    </Button>
                </Link>
            </div>

            <DataTable
                data={categories as Category[]}
                columns={columns}
                totalCount={totalCount}
                currentPage={page}
                currentSearch={search}
                currentSort={sort}
                currentOrder={order}
            />
        </div>
    );
}
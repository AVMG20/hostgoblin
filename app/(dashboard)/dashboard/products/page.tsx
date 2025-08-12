import {DataTable} from '@/components/form/data-table';
import {Button} from '@/components/ui/button';
import {Plus} from 'lucide-react';
import Link from 'next/link';
import {Product, products as productsTable} from "@/lib/db/schema";
import {columns} from "@/app/(dashboard)/dashboard/products/columns";
import {PageProps, parseSearchParams, queryIndex} from "@/lib/db/datatable";

export default async function ProductsPage({searchParams}: PageProps) {
    const {page, search, sort, order} = await parseSearchParams(searchParams)

    const [products, totalCount] = await queryIndex(productsTable, {
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
                <h1 className="text-2xl font-bold">Products</h1>
                <Link href="/dashboard/products/create">
                    <Button>
                        <Plus className="w-4 h-4 mr-2"/>
                        Create New Product
                    </Button>
                </Link>
            </div>

            <DataTable
                data={products as Product[]}
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
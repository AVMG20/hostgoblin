'use client'

import {Edit, Eye} from 'lucide-react';
import Link from 'next/link';
import {Product} from "@/lib/db/schema";
import {DataTableColumn} from "@/components/form/data-table";
import { Button } from '@/components/ui/button';
import {deleteProduct} from "@/app/(dashboard)/dashboard/products/actions";
import {DeleteButton} from "@/components/form/form-components";

export const columns: DataTableColumn<Product>[] = [{
    key: 'id',
    label: 'ID',
    sortable: true
}, {
    key: 'name',
    label: 'Name',
    sortable: true
}, {
    key: 'slug',
    label: 'Slug',
    sortable: true
}, {
    key: 'description',
    label: 'Description',
    sortable: true,
    render: (row: Product) => (
        <span className="text-sm text-gray-600 max-w-xs truncate">
            {row.description || '-'}
        </span>
    )
}, {
    key: 'categoryId',
    label: 'Category',
    sortable: true,
    render: (row: Product) => (
        <span className="text-sm text-gray-600">
            {row.categoryId}
        </span>
    )
}, {
    key: 'pricePerHour',
    label: 'Price/Hour',
    sortable: true,
    render: (row: Product) => (
        <span className="text-sm font-medium">
            ${(row.pricePerHour / 100).toFixed(2)}
        </span>
    )
}, {
    key: 'ramMb',
    label: 'RAM (MB)',
    sortable: true,
    render: (row: Product) => (
        <span className="text-sm text-gray-600">
            {row.ramMb || '-'}
        </span>
    )
}, {
    key: 'cpuCores',
    label: 'CPU Cores',
    sortable: true,
    render: (row: Product) => (
        <span className="text-sm text-gray-600">
            {row.cpuCores || '-'}
        </span>
    )
}, {
    key: 'isActive',
    label: 'Status',
    sortable: true,
    render: (row: Product) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {row.isActive ? 'Active' : 'Inactive'}
        </span>
    )
}, {
    key: 'isPopular',
    label: 'Popular',
    sortable: true,
    render: (row: Product) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.isPopular ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
            {row.isPopular ? 'Yes' : 'No'}
        </span>
    )
}, {
    key: 'createdAt',
    label: 'Created',
    sortable: true,
    render: (row: Product) => (
        <span className="text-sm text-gray-600">{row.createdAt.toLocaleString('nl')}</span>
    )
}, {
    key: 'actions',
    label: 'Actions',
    sortable: false,
    render: (row: Product) => (
        <div className="flex space-x-2">
            <Link href={`/dashboard/products/edit/${row.id}`}>
                <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4"/>
                </Button>
            </Link>
            <DeleteButton action={deleteProduct} id={row.id} itemName={'Product'}/>
        </div>
    )
}]
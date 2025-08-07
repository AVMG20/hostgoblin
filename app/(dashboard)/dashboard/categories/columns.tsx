'use client'

import {Edit, Eye} from 'lucide-react';
import Link from 'next/link';
import {Category} from "@/lib/db/schema";
import {DataTableColumn} from "@/components/form/data-table";
import { Button } from '@/components/ui/button';
import {deleteCategory} from "@/app/(dashboard)/dashboard/categories/actions";
import {DeleteButton} from "@/components/form/form-components";

export const columns: DataTableColumn<Category>[] = [{
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
    render: (row: Category) => (
        <span className="text-sm text-gray-600 max-w-xs truncate">
            {row.description || '-'}
        </span>
    )
}, {
    key: 'isActive',
    label: 'Status',
    sortable: true,
    render: (row: Category) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {row.isActive ? 'Active' : 'Inactive'}
        </span>
    )
}, {
    key: 'sortOrder',
    label: 'Sort Order',
    sortable: true
},
    {
    key: 'createdAt',
    label: 'Created',
    sortable: true,
    render: (row: Category) => (
        <span className="text-sm text-gray-600">{row.createdAt.toLocaleString('nl')}</span>
    )
}, {
    key: 'actions',
    label: 'Actions',
    sortable: false,
    render: (row: Category) => (
        <div className="flex space-x-2">
            <Link href={`/dashboard/categories/edit/${row.id}`}>
                <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4"/>
                </Button>
            </Link>
            <DeleteButton action={deleteCategory} id={row.id} itemName={'Category'}/>
        </div>
    )
}]

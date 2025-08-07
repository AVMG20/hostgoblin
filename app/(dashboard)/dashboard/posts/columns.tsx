'use client'

import {Edit, Eye} from 'lucide-react';
import Link from 'next/link';
import {Post} from "@/lib/db/schema";
import {DataTableColumn} from "@/components/form/data-table";
import { Button } from '@/components/ui/button';
import {deletePost} from "@/app/(dashboard)/dashboard/posts/actions";
import {DeleteButton} from "@/components/form/form-components";

export const columns: DataTableColumn<Post>[] = [{
    key: 'id',
    label: 'ID',
    sortable: true
}, {
    key: 'title',
    label: 'Title',
    sortable: true
}, {
    key: 'slug',
    label: 'Slug',
    sortable: true
}, {
    key: 'published',
    label: 'Published',
    sortable: true,
    render: (row: Post) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {row.published ? 'Published' : 'Draft'}
        </span>
    )
}, {
    key: 'createdAt',
    label: 'Created',
    sortable: true,
    render: (row: Post) => (
        <span className="text-sm text-gray-600">{row.createdAt.toLocaleString('nl')}</span>
    )
}, {
    key: 'actions',
    label: 'Actions',
    sortable: false,
    render: (row: Post) => (
        <div className="flex space-x-2">
            {/*<Link href={`/dashboard/posts/${row.id}`}>*/}
            {/*    <Button variant="outline" size="sm">*/}
            {/*        <Eye className="w-4 h-4"/>*/}
            {/*    </Button>*/}
            {/*</Link>*/}
            <Link href={`/app/(dashboard)/dashboard/posts/edit/${row.id}`}>
                <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4"/>
                </Button>
            </Link>
            <DeleteButton action={deletePost} id={row.id} itemName={'Post'}/>
        </div>
    )
}]

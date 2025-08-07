import {DataTable} from '@/components/form/data-table';
import {Button} from '@/components/ui/button';
import {Plus} from 'lucide-react';
import Link from 'next/link';
import {Post, posts as postsTable} from "@/lib/db/schema";
import {columns} from "@/app/(dashboard)/dashboard/posts/columns";
import {PageProps, parseSearchParams, queryIndex} from "@/lib/db/datatable";

export default async function PostsPage({searchParams}: PageProps) {
    const {page, search, sort, order} = await parseSearchParams(searchParams)

    const [posts, totalCount] = await queryIndex(postsTable, {
        page,
        search,
        sort,
        order,
        searchableColumns: [
            'id',
            'title',
            'content',
            'slug'
        ],
        defaultSort: 'createdAt'
    });

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Posts</h1>
                <Link href="/app/(dashboard)/dashboard/posts/create">
                    <Button>
                        <Plus className="w-4 h-4 mr-2"/>
                        Create New Post
                    </Button>
                </Link>
            </div>

            <DataTable
                data={posts as Post[]}
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
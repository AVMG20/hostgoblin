import {updatePost, getPost} from '@/app/admin/posts/actions';
import {Form} from  '@/app/admin/posts/form';
import {notFound} from 'next/navigation';

interface EditPostPageProps {
    params: Promise<{
        id: string;
    }>;
}
export default async function EditPostPage({ params }: EditPostPageProps) {
    let {id} = await params
    const post = await getPost(parseInt(id));

    if (!post) {
        notFound();
    }
    return (
        <Form
            action={updatePost}
            defaultValue={{
                id: post.id,
                title: post.title,
                content: post.content,
                slug: post.slug,
                published: post.published,
            }}
            title="Edit Post"
            submitButtonText="Update Post"
        />
    );
}
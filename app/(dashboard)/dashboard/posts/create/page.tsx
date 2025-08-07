import {createPost} from '@/app/(dashboard)/dashboard/posts/actions';
import {Form} from '@/app/(dashboard)/dashboard/posts/form';
export default function CreatePostPage() {
    return (
        <Form
            action={createPost}
            title="Create Post"
            submitButtonText="Create Post"
        />
    );
}
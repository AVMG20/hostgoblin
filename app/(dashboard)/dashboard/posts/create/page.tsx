import {createPost} from '@/app/(admin)/admin/posts/actions';
import {Form} from '@/app/(admin)/admin/posts/form';
export default function CreatePostPage() {
    return (
        <Form
            action={createPost}
            title="Create Post"
            submitButtonText="Create Post"
        />
    );
}
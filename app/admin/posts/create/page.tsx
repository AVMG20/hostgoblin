import {createPost} from '@/app/admin/posts/actions';
import {Form} from  '@/app/admin/posts/form';
export default function CreatePostPage() {
    return (
        <Form
            action={createPost}
            title="Create Post"
            submitButtonText="Create Post"
        />
    );
}
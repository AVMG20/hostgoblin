import {createCategory} from '@/app/(admin)/admin/categories/actions';
import {Form} from '@/app/(admin)/admin/categories/form';
export default function CreateCategoryPage() {
    return (
        <Form
            action={createCategory}
            title="Create Category"
            submitButtonText="Create Category"
        />
    );
}
import {createCategory} from '@/app/(dashboard)/dashboard/categories/actions';
import {Form} from '@/app/(dashboard)/dashboard/categories/form';
export default function CreateCategoryPage() {
    return (
        <Form
            action={createCategory}
            title="Create Category"
            submitButtonText="Create Category"
        />
    );
}
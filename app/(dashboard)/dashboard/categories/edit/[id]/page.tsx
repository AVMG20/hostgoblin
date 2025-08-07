import {updateCategory, getCategory} from '@/app/(admin)/admin/categories/actions';
import {Form} from '@/app/(admin)/admin/categories/form';
import {notFound} from 'next/navigation';

interface EditCategoryPageProps {
    params: Promise<{
        id: string;
    }>;
}
export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
    let {id} = await params
    const category = await getCategory(parseInt(id));

    if (!category) {
        notFound();
    }
    return (
        <Form
            action={updateCategory}
            defaultValue={{
                id: category.id,
                name: category.name,
                slug: category.slug,
                description: category.description || undefined,
                icon: category.icon || undefined,
                parentId: category.parentId || undefined,
                sortOrder: category.sortOrder || 0,
                isActive: category.isActive || true,
            }}
            title="Edit Category"
            submitButtonText="Update Category"
        />
    );
}

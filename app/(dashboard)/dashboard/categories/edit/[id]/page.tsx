import {updateCategory, getCategory} from '@/app/(dashboard)/dashboard/categories/actions';
import {Form} from '@/app/(dashboard)/dashboard/categories/form';
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
                imageId: category.imageId || undefined,
                image: category.image ? JSON.stringify(category.image) : undefined,
                parentId: category.parentId || undefined,
                sortOrder: category.sortOrder || 0,
                isActive: category.isActive || false,
            }}
            title="Edit Category"
            submitButtonText="Update Category"
        />
    );
}

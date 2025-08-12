import { ProductForm } from '@/app/(dashboard)/dashboard/products/form';
import { getCategories } from '@/app/(dashboard)/dashboard/products/actions';

export default async function CreateProductPage() {
    const categories = await getCategories();

    return <ProductForm categories={categories} />;
}

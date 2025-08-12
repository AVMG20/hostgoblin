import { ProductForm } from '@/app/(dashboard)/dashboard/products/form';
import { getProduct, getCategories } from '@/app/(dashboard)/dashboard/products/actions';
import { notFound } from 'next/navigation';

interface EditProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const param = await params;
    const productId = parseInt(param.id);

    if (isNaN(productId)) {
        notFound();
    }

    const [product, categories] = await Promise.all([
        getProduct(productId),
        getCategories()
    ]);

    if (!product) {
        notFound();
    }

    return <ProductForm product={product} categories={categories} />;
}

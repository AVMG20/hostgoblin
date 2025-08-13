'use client';

import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { useFormState } from 'react-dom';
import { productSchema, ProductFormData } from '@/app/(dashboard)/dashboard/products/schema';
import { createProduct, updateProduct } from '@/app/(dashboard)/dashboard/products/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {ActionButtons, ComboBox, Field, FieldError} from '@/components/form/form-components';
import { Product } from '@/lib/db/schema';

interface ProductFormProps {
    product?: Product;
    categories: Array<{ id: number; name: string; }>;
}

export function ProductForm({ product, categories }: ProductFormProps) {
    const [lastResult, action] = useFormState(
        product ? updateProduct : createProduct,
        undefined
    );

    const [form, fields] = useForm({
        lastResult,
        onValidate({ formData }) {
            return parseWithZod(formData, { schema: productSchema });
        },
        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput',
        defaultValue: product ? {
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description || '',
            categoryId: product.categoryId,
            ramMb: product.ramMb || 0,
            cpuCores: product.cpuCores || 0,
            diskGb: product.diskGb || 0,
            bandwidth: product.bandwidth || 0,
            pricePerHour: product.pricePerHour,
            isActive: product.isActive,
            isPopular: product.isPopular,
            sortOrder: product.sortOrder,
            integrationType: product.integrationType || '',
        } : {
            isActive: true,
            isPopular: false,
            sortOrder: 0,
        },
    });

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            <Card>
                <CardHeader>
                    <CardTitle>{product ? 'Edit Product' : 'Create New Product'}</CardTitle>
                    <CardDescription>
                        {product ? 'Update the product information below.' : 'Fill in the details to create a new product.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate className="space-y-8">
                        {product && (
                            <input type="hidden" name={fields.id.name} value={product.id} />
                        )}

                        {/* Basic Information Section */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium">Basic Information</h3>
                                <p className="text-sm text-muted-foreground">Essential details about your product</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field>
                                    <Label htmlFor={fields.name.id}>Product Name *</Label>
                                    <Input
                                        id={fields.name.id}
                                        name={fields.name.name}
                                        defaultValue={fields.name.initialValue as string}
                                        placeholder="e.g., VPS Basic"
                                        aria-describedby={fields.name.errors ? `${fields.name.id}-error` : undefined}
                                    />
                                    {fields.name.errors && (
                                        <FieldError id={`${fields.name.id}-error`}>
                                            {fields.name.errors}
                                        </FieldError>
                                    )}
                                </Field>

                                <Field>
                                    <Label htmlFor={fields.slug.id}>Slug *</Label>
                                    <Input
                                        id={fields.slug.id}
                                        name={fields.slug.name}
                                        defaultValue={fields.slug.initialValue as string}
                                        placeholder="e.g., vps-basic"
                                        aria-describedby={fields.slug.errors ? `${fields.slug.id}-error` : undefined}
                                    />
                                    {fields.slug.errors && (
                                        <FieldError id={`${fields.slug.id}-error`}>
                                            {fields.slug.errors}
                                        </FieldError>
                                    )}
                                    <span className="text-muted-foreground">{fields.slug.value && (
                                        `${window.location.host}/checkout/${encodeURI(fields.slug.value)}`
                                    )}</span>
                                </Field>
                            </div>

                            <Field>
                                <Label htmlFor={fields.description.id}>Description</Label>
                                <Textarea
                                    id={fields.description.id}
                                    name={fields.description.name}
                                    defaultValue={fields.description.initialValue as string}
                                    placeholder="Describe what this product offers..."
                                    rows={3}
                                    aria-describedby={fields.description.errors ? `${fields.description.id}-error` : undefined}
                                />
                                {fields.description.errors && (
                                    <FieldError id={`${fields.description.id}-error`}>
                                        {fields.description.errors}
                                    </FieldError>
                                )}
                            </Field>

                            <div className={'grid grid-cols-1 lg:grid-cols-2 gap-4'}>
                                <Field>
                                    <Label htmlFor={fields.categoryId.id}>Category *</Label>
                                    <ComboBox
                                        id={fields.categoryId.id}
                                        name={fields.categoryId.name}
                                        defaultValue={fields.categoryId.initialValue?.toString()}
                                        items={categories.map(category => (
                                            {
                                                label: category.name,
                                                value: category.id.toString()
                                            }
                                        ))}
                                        placeholder="Select a category"
                                        aria-describedby={fields.categoryId.errors ? `${fields.categoryId.id}-error` : undefined}
                                    />
                                    {fields.categoryId.errors && (
                                        <FieldError id={`${fields.categoryId.id}-error`}>
                                            {fields.categoryId.errors}
                                        </FieldError>
                                    )}
                                </Field>
                            </div>
                        </div>

                        <Separator />

                        {/* Technical Specifications Section */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium">Technical Specifications</h3>
                                <p className="text-sm text-muted-foreground">Configure the technical specifications of your product</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field>
                                    <Label htmlFor={fields.ramMb.id}>RAM (MB)</Label>
                                    <Input
                                        id={fields.ramMb.id}
                                        name={fields.ramMb.name}
                                        type="number"
                                        defaultValue={fields.ramMb.initialValue as string}
                                        placeholder="e.g., 1024"
                                        aria-describedby={fields.ramMb.errors ? `${fields.ramMb.id}-error` : undefined}
                                    />
                                    {fields.ramMb.errors && (
                                        <FieldError id={`${fields.ramMb.id}-error`}>
                                            {fields.ramMb.errors}
                                        </FieldError>
                                    )}
                                </Field>

                                <Field>
                                    <Label htmlFor={fields.cpuCores.id}>CPU Cores</Label>
                                    <Input
                                        id={fields.cpuCores.id}
                                        name={fields.cpuCores.name}
                                        type="number"
                                        defaultValue={fields.cpuCores.initialValue as string}
                                        placeholder="e.g., 2"
                                        aria-describedby={fields.cpuCores.errors ? `${fields.cpuCores.id}-error` : undefined}
                                    />
                                    {fields.cpuCores.errors && (
                                        <FieldError id={`${fields.cpuCores.id}-error`}>
                                            {fields.cpuCores.errors}
                                        </FieldError>
                                    )}
                                </Field>

                                <Field>
                                    <Label htmlFor={fields.diskGb.id}>Disk Space (GB)</Label>
                                    <Input
                                        id={fields.diskGb.id}
                                        name={fields.diskGb.name}
                                        type="number"
                                        defaultValue={fields.diskGb.initialValue as string}
                                        placeholder="e.g., 50"
                                        aria-describedby={fields.diskGb.errors ? `${fields.diskGb.id}-error` : undefined}
                                    />
                                    {fields.diskGb.errors && (
                                        <FieldError id={`${fields.diskGb.id}-error`}>
                                            {fields.diskGb.errors}
                                        </FieldError>
                                    )}
                                </Field>

                                <Field>
                                    <Label htmlFor={fields.bandwidth.id}>Bandwidth (MB)</Label>
                                    <Input
                                        id={fields.bandwidth.id}
                                        name={fields.bandwidth.name}
                                        type="number"
                                        defaultValue={fields.bandwidth.initialValue as string}
                                        placeholder="e.g., 1000"
                                        aria-describedby={fields.bandwidth.errors ? `${fields.bandwidth.id}-error` : undefined}
                                    />
                                    {fields.bandwidth.errors && (
                                        <FieldError id={`${fields.bandwidth.id}-error`}>
                                            {fields.bandwidth.errors}
                                        </FieldError>
                                    )}
                                </Field>
                            </div>
                        </div>

                        <Separator />

                        {/* Pricing Section */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium">Pricing</h3>
                                <p className="text-sm text-muted-foreground">Set the pricing for your product</p>
                            </div>

                            <Field>
                                <Label htmlFor={fields.pricePerHour.id}>Price per Hour (cents) *</Label>
                                <Input
                                    id={fields.pricePerHour.id}
                                    name={fields.pricePerHour.name}
                                    type="number"
                                    defaultValue={fields.pricePerHour.initialValue as string}
                                    placeholder="e.g., 500 (for $5.00)"
                                    aria-describedby={fields.pricePerHour.errors ? `${fields.pricePerHour.id}-error` : undefined}
                                />
                                {fields.pricePerHour.errors && (
                                    <FieldError id={`${fields.pricePerHour.id}-error`}>
                                        {fields.pricePerHour.errors}
                                    </FieldError>
                                )}
                                <p className="text-sm text-muted-foreground">Enter price in cents (e.g., 500 for $5.00)</p>
                            </Field>
                        </div>

                        <Separator />

                        {/* Settings Section */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium">Settings</h3>
                                <p className="text-sm text-muted-foreground">Configure product settings and visibility</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field>
                                    <Label htmlFor={fields.sortOrder.id}>Sort Order</Label>
                                    <Input
                                        id={fields.sortOrder.id}
                                        name={fields.sortOrder.name}
                                        type="number"
                                        defaultValue={fields.sortOrder.initialValue as string}
                                        placeholder="0"
                                        aria-describedby={fields.sortOrder.errors ? `${fields.sortOrder.id}-error` : undefined}
                                    />
                                    {fields.sortOrder.errors && (
                                        <FieldError id={`${fields.sortOrder.id}-error`}>
                                            {fields.sortOrder.errors}
                                        </FieldError>
                                    )}
                                </Field>

                                <Field>
                                    <Label htmlFor={fields.integrationType.id}>Integration Type</Label>
                                    <Input
                                        id={fields.integrationType.id}
                                        name={fields.integrationType.name}
                                        defaultValue={fields.integrationType.initialValue as string}
                                        placeholder="e.g., docker, vm"
                                        aria-describedby={fields.integrationType.errors ? `${fields.integrationType.id}-error` : undefined}
                                    />
                                    {fields.integrationType.errors && (
                                        <FieldError id={`${fields.integrationType.id}-error`}>
                                            {fields.integrationType.errors}
                                        </FieldError>
                                    )}
                                </Field>
                            </div>

                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id={fields.isActive.id}
                                        name={fields.isActive.name}
                                        defaultChecked={fields.isActive.initialValue === 'on'}
                                    />
                                    <Label htmlFor={fields.isActive.id}>Active</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id={fields.isPopular.id}
                                        name={fields.isPopular.name}
                                        defaultChecked={fields.isPopular.initialValue === 'on'}
                                    />
                                    <Label htmlFor={fields.isPopular.id}>Popular</Label>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Form Actions */}
                        <ActionButtons> {product ? 'Update Product' : 'Create Product'}</ActionButtons>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

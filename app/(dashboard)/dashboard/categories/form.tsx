'use client'

import { SubmissionResult, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { CategoryFormData, categorySchema } from '@/app/(dashboard)/dashboard/categories/schema';
import { startTransition, useActionState } from "react";
import {
    Field,
    FieldError,
    Label,
    Input,
    Textarea,
    Checkbox,
    ActionButtons,
    FormErrors,
    ComboBox, ImageUpload
} from "@/components/form/form-components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Mock parent categories data - replace with your actual data
const parentCategories = [
    { label: 'Technology', value: '1' },
    { label: 'Business', value: '2' },
    { label: 'Health & Wellness', value: '3' },
    { label: 'Education', value: '4' },
    { label: 'Entertainment', value: '5' },
    { label: 'Sports', value: '6' },
    { label: 'Travel', value: '7' },
    { label: 'Food & Cooking', value: '8' },
];

interface CategoryFormProps {
    action: (prevState: unknown, formData: FormData) => Promise<SubmissionResult>;
    defaultValue?: CategoryFormData;
    submitButtonText?: string;
    title: string;
}

export function Form({
                         action,
                         defaultValue,
                         submitButtonText = "Create Category",
                         title
                     }: CategoryFormProps) {
    const [lastResult, formAction] = useActionState(action, undefined);

    const [form, fields] = useForm({
        lastResult,

        onSubmit(event, { formData }) {
            event.preventDefault();

            startTransition(async () => {
                await formAction(formData);
            });
        },

        // Reuse the validation logic on the client
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: categorySchema.omit({ id: true })
            });
        },

        // Validate the form on blur event triggered
        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput',

        // Set default values
        defaultValue: defaultValue
    });

    return (
        <div className="container mx-auto py-8 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <FormErrors errors={form.errors} className="mb-6" />

                    <form
                        id={form.id}
                        key={form.key}
                        onSubmit={form.onSubmit}
                        action={formAction}
                        noValidate
                        className="space-y-6"
                    >
                        {fields.id && (
                            <input
                                type="hidden"
                                id={fields.id.id}
                                name={fields.id.name}
                                value={fields.id.initialValue as string}
                            />
                        )}

                        {/* Basic Information Section */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium">Basic Information</h3>
                                <p className="text-sm text-muted-foreground">Essential details about your category</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field>
                                    <Label htmlFor={fields.name.id}>Category Name *</Label>
                                    <Input
                                        id={fields.name.id}
                                        name={fields.name.name}
                                        defaultValue={fields.name.initialValue as string}
                                        placeholder="e.g., Web Development"
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
                                        placeholder="e.g., web-development"
                                        aria-describedby={fields.slug.errors ? `${fields.slug.id}-error` : undefined}
                                    />
                                    {fields.slug.errors && (
                                        <FieldError id={`${fields.slug.id}-error`}>
                                            {fields.slug.errors}
                                        </FieldError>
                                    )}
                                </Field>
                            </div>

                            <Field>
                                <Label htmlFor={fields.description.id}>Description</Label>
                                <Textarea
                                    id={fields.description.id}
                                    name={fields.description.name}
                                    defaultValue={fields.description.initialValue as string}
                                    placeholder="Describe what this category is about..."
                                    rows={3}
                                    aria-describedby={fields.description.errors ? `${fields.description.id}-error` : undefined}
                                />
                                {fields.description.errors && (
                                    <FieldError id={`${fields.description.id}-error`}>
                                        {fields.description.errors}
                                    </FieldError>
                                )}
                            </Field>
                        </div>

                        <Separator />

                        {/* Display & Organization Section */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium">Display & Organization</h3>
                                <p className="text-sm text-muted-foreground">Configure how your category appears and is organized</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <Field>
                                    <Label htmlFor={fields.image.id}>Category Image</Label>
                                    <ImageUpload
                                        id={fields.image.id}
                                        name={fields.image.name}
                                        defaultValue={fields.image.initialValue as string}
                                        aria-describedby={fields.image.errors ? `${fields.image.id}-error` : undefined}
                                    />
                                    {fields.image.errors && (
                                        <FieldError id={`${fields.image.id}-error`}>
                                            {fields.image.errors}
                                        </FieldError>
                                    )}
                                    <p className="text-sm text-muted-foreground">
                                        Upload an image for this category. Supported formats: JPG, PNG, WebP
                                    </p>
                                </Field>

                                <Field>
                                    <Label htmlFor={fields.icon.id}>Icon (Fallback)</Label>
                                    <Input
                                        id={fields.icon.id}
                                        name={fields.icon.name}
                                        defaultValue={fields.icon.initialValue as string}
                                        placeholder="e.g., Code, 📱, or lucide icon name"
                                        aria-describedby={fields.icon.errors ? `${fields.icon.id}-error` : undefined}
                                    />
                                    {fields.icon.errors && (
                                        <FieldError id={`${fields.icon.id}-error`}>
                                            {fields.icon.errors}
                                        </FieldError>
                                    )}
                                    <p className="text-sm text-muted-foreground">
                                        Used as fallback when no image is uploaded
                                    </p>
                                </Field>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <Field>
                                    <Label htmlFor={fields.sortOrder.id}>Sort Order</Label>
                                    <Input
                                        id={fields.sortOrder.id}
                                        name={fields.sortOrder.name}
                                        type="number"
                                        min="0"
                                        defaultValue={fields.sortOrder.initialValue as string || '0'}
                                        placeholder="0"
                                        aria-describedby={fields.sortOrder.errors ? `${fields.sortOrder.id}-error` : undefined}
                                    />
                                    {fields.sortOrder.errors && (
                                        <FieldError id={`${fields.sortOrder.id}-error`}>
                                            {fields.sortOrder.errors}
                                        </FieldError>
                                    )}
                                </Field>
                            </div>

                            <Field>
                                <Label htmlFor={fields.parentId.id}>Parent Category</Label>
                                <ComboBox
                                    id={fields.parentId.id}
                                    name={fields.parentId.name}
                                    defaultValue={fields.parentId.initialValue as string}
                                    items={parentCategories}
                                    placeholder="Select a parent category (optional)"
                                    aria-describedby={fields.parentId.errors ? `${fields.parentId.id}-error` : undefined}
                                />
                                {fields.parentId.errors && (
                                    <FieldError id={`${fields.parentId.id}-error`}>
                                        {fields.parentId.errors}
                                    </FieldError>
                                )}
                            </Field>

                            <Field>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id={fields.isActive.id}
                                        name={fields.isActive.name}
                                        defaultChecked={fields.isActive.initialValue === 'on'}
                                        aria-describedby={fields.isActive.errors ? `${fields.isActive.id}-error` : undefined}
                                    />
                                    <Label htmlFor={fields.isActive.id} className="font-normal">
                                        Active category
                                    </Label>
                                </div>
                                <p className="text-sm text-muted-foreground ml-6">
                                    Inactive categories won't be visible to users
                                </p>
                                {fields.isActive.errors && (
                                    <FieldError id={`${fields.isActive.id}-error`}>
                                        {fields.isActive.errors}
                                    </FieldError>
                                )}
                            </Field>
                        </div>

                        <Separator />

                        <ActionButtons>{submitButtonText}</ActionButtons>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

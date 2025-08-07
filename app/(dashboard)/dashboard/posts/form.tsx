'use client'

import {SubmissionResult, useForm} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';
import {PostFormData, postSchema} from '@/app/(admin)/admin/posts/schema';
import {startTransition, useActionState} from "react";
import {
    Field,
    FieldError,
    Label,
    Input,
    Textarea,
    Checkbox,
    ActionButtons,
    FormErrors
} from "@/components/form/form-components";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import { AlertCircleIcon } from 'lucide-react';

interface PostFormProps {
    action: (prevState: unknown, formData: FormData) =>  Promise<SubmissionResult>;
    defaultValue?: PostFormData;
    submitButtonText?: string;
    title: string;
}

export function Form({action, defaultValue, submitButtonText = "Create Post", title}: PostFormProps) {
    const [lastResult, formAction] = useActionState(action, undefined);

    const [form, fields] = useForm({
        lastResult,

        onSubmit(event, { formData }) {
            event.preventDefault();

            startTransition(async () => {
                await formAction(formData);
            })
        },

        // Reuse the validation logic on the client
        onValidate({formData}) {
            return parseWithZod(formData, {
                schema: postSchema.omit({id: true})
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
            <h1 className="text-2xl font-bold mb-6">{title}</h1>

            <FormErrors errors={form.errors}/>

            <form id={form.id} key={form.key} onSubmit={form.onSubmit} action={formAction} noValidate className="space-y-4">
                {fields.id && (
                    <input
                        type="hidden"
                        id={fields.id.id}
                        name={fields.id.name}
                        value={fields.id.initialValue as string}
                    />
                )}

                <Field>
                    <Label htmlFor={fields.title.id}>Title</Label>
                    <Input
                        id={fields.title.id}
                        name={fields.title.name}
                        defaultValue={fields.title.initialValue as string}
                        aria-describedby={fields.title.errors ? `${fields.title.id}-error` : undefined}
                    />
                    {fields.title.errors && (
                        <FieldError id={`${fields.title.id}-error`}>
                            {fields.title.errors}
                        </FieldError>
                    )}
                </Field>

                <Field>
                    <Label htmlFor={fields.content.id}>Content</Label>
                    <Textarea
                        id={fields.content.id}
                        name={fields.content.name}
                        defaultValue={fields.content.initialValue as string}
                        rows={5}
                        aria-describedby={fields.content.errors ? `${fields.content.id}-error` : undefined}
                    />
                    {fields.content.errors && (
                        <FieldError id={`${fields.content.id}-error`}>
                            {fields.content.errors}
                        </FieldError>
                    )}
                </Field>

                <Field>
                    <Label htmlFor={fields.slug.id}>Slug</Label>
                    <Input
                        id={fields.slug.id}
                        name={fields.slug.name}
                        defaultValue={fields.slug.initialValue as string}
                        aria-describedby={fields.slug.errors ? `${fields.slug.id}-error` : undefined}
                    />
                    {fields.slug.errors && (
                        <FieldError id={`${fields.slug.id}-error`}>
                            {fields.slug.errors}
                        </FieldError>
                    )}
                </Field>

                <Field>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id={fields.published.id}
                            name={fields.published.name}
                            defaultChecked={fields.published.initialValue === 'on'}
                            aria-describedby={fields.published.errors ? `${fields.published.id}-error` : undefined}
                        />
                        <Label htmlFor={fields.published.id}>Published</Label>
                    </div>
                    {fields.published.errors && (
                        <FieldError id={`${fields.published.id}-error`}>
                            {fields.published.errors}
                        </FieldError>
                    )}
                </Field>

                <ActionButtons>{submitButtonText}</ActionButtons>
            </form>
        </div>
    );
}
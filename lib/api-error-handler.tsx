'use client'

import { UseFormReturn, FieldValues, Path } from 'react-hook-form'
import { toast } from 'sonner'

export interface ApiError {
    success: boolean
    message: string
    errors?: Record<string, string[]>
}

export function handleApiError<T extends FieldValues>(
    error: ApiError,
    form?: UseFormReturn<T>
) {
    // Toast the general error message
    toast.error('Error', {
        description: error.message || 'Please check the form for errors and try again.',
        duration: 5000,
    })

    // If form is provided, handle form-specific errors
    if (form) {
        // Clear any existing errors
        form.clearErrors()

        // Set field-specific errors
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                form.setError(field as Path<T>, {
                    type: 'manual',
                    message: messages[0] // Use the first error message for the field
                })
            })
        }
    }
}
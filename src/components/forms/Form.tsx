// Form.tsx
import React from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { AnySchema, InferType } from 'yup';

interface FormProps<T extends AnySchema> {
  methods: UseFormReturn<InferType<T>>;
  onFormSubmit: (data: InferType<T>) => Promise<void>;
  renderFormContent?: () => React.ReactNode;
  disabled: boolean;
  actions?: React.ReactNode;
}

export const Form = <T extends AnySchema>({
  methods,
  onFormSubmit,
  renderFormContent,
  disabled,
  actions,
}: FormProps<T>) => (
  <FormProvider {...methods}>
    <form onSubmit={methods.handleSubmit(onFormSubmit)}>
      <fieldset disabled={disabled} style={{ border: 'none', padding: 0 }}>
        {renderFormContent?.()}
        {actions}
      </fieldset>
    </form>
  </FormProvider>
);

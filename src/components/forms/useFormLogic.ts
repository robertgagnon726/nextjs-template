import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { InferType, ObjectSchema } from 'yup';
import { useCallback, useEffect, useRef, useState } from 'react';
import { isEqualWith } from 'lodash';
import { useAlert } from '@Components/Alert';

export type AnySchema = ObjectSchema<any>;

export type WatchField<T> = keyof T | Array<keyof T>;

type SingleFieldChangeEvent<T extends object, K extends keyof T> = {
  changedField: K;
  changedValue: T[K];
  watchedValues: Partial<T>;
};

type NoFieldChangeEvent<T extends object> = {
  changedField?: undefined;
  changedValue?: undefined;
  watchedValues: Partial<T>;
};

export type FieldChangeEvent<T extends object> =
  | {
      [K in keyof T]: SingleFieldChangeEvent<T, K>;
    }[keyof T]
  | NoFieldChangeEvent<T>;

export type OnFieldChange<T extends object> = (event: FieldChangeEvent<T>) => void;

export function useFormLogic<T extends AnySchema>({
  defaultValues,
  validationSchema,
  onSubmit,
  watchField,
  onFieldChange,
  reValidateMode,
  mode,
}: {
  defaultValues: InferType<T>;
  validationSchema: T;
  onSubmit: (data: InferType<T>) => Promise<void>;
  watchField?: WatchField<InferType<T>>;
  onFieldChange?: OnFieldChange<InferType<T>>;
  reValidateMode?: 'onChange' | 'onBlur' | 'onSubmit';
  mode?: 'onBlur' | 'onSubmit' | 'onChange' | 'all' | 'onTouched';
}) {
  const methods = useForm<InferType<T>>({
    resolver: yupResolver(validationSchema),
    defaultValues,
    reValidateMode,
    mode,
  });

  const alert = useAlert();
  const [submitLoading, setSubmitLoading] = useState(false);
  const prevDefaultValuesRef = useRef(defaultValues);
  const { reset, watch } = methods;

  const pickFields = useCallback(
    (allValues: InferType<T>, fields: Array<keyof InferType<T>>): Partial<InferType<T>> => {
      return fields.reduce(
        (acc, key) => {
          acc[key] = allValues[key];
          return acc;
        },
        {} as Partial<InferType<T>>,
      );
    },
    [],
  );

  useEffect(() => {
    if (!watchField || !onFieldChange) return;

    const fieldsToWatch = Array.isArray(watchField) ? watchField : [watchField];

    const subscription = watch((formValues, { name }) => {
      // If name is undefined or not one of the fields we watch,
      // we pass NoFieldChangeEvent
      if (!name || !fieldsToWatch.includes(name as keyof InferType<T>)) {
        onFieldChange({
          changedField: undefined,
          changedValue: undefined,
          watchedValues: pickFields(formValues, fieldsToWatch),
        });
        return;
      }

      // Otherwise, name is definitely a keyof InferType<T>
      const nameAsKey = name as keyof InferType<T>;

      onFieldChange({
        changedField: nameAsKey,
        changedValue: formValues[nameAsKey],
        watchedValues: pickFields(formValues, fieldsToWatch),
      });
    });

    return () => subscription.unsubscribe();
  }, [watch, watchField, onFieldChange, pickFields]);

  function compareDatesByDay(value: unknown, other: unknown) {
    if (value instanceof Date && other instanceof Date) {
      return (
        value.getFullYear() === other.getFullYear() &&
        value.getMonth() === other.getMonth() &&
        value.getDate() === other.getDate()
      );
    }
    return undefined;
  }

  useEffect(() => {
    if (!isEqualWith(defaultValues, prevDefaultValuesRef.current, compareDatesByDay)) {
      prevDefaultValuesRef.current = defaultValues;
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const onFormSubmit = useCallback(
    async (data: InferType<T>) => {
      try {
        setSubmitLoading(true);
        await onSubmit(data);
        setSubmitLoading(false);
        reset();
      } catch (e: any) {
        setSubmitLoading(false);
        alert.setAlert(e?.message ?? 'There was a problem with your request', 'error');
      }
    },
    [alert, onSubmit, reset],
  );

  return { methods, onFormSubmit, submitLoading, reset, setSubmitLoading };
}

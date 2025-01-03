import Autocomplete, { AutocompleteRenderInputParams } from '@mui/material/Autocomplete';
import { Controller, useFormContext, FieldValues, Path, ControllerRenderProps } from 'react-hook-form';
import { FormControl, TextField, CircularProgress, FormHelperText } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { get } from 'lodash';
import { SyntheticEvent, UIEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';

interface Option {
  value: number | string;
  label: string;
}

// Define the props for the component
export interface FormMultiSelectProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  options?: Option[];
  fetchOptions?: (
    searchQuery: string,
    page: number,
  ) => Promise<{
    data: Option[];
    totalPages: number;
  }>;
  fetchOptionsByIds?: (ids: number[]) => Promise<{ data: Option[] }>;
  label: string;
  required?: boolean;
  tooltip?: string;
  disabled?: boolean;
}

export function FormMultiSelect<TFieldValues extends FieldValues>({
  name,
  options,
  fetchOptions,
  fetchOptionsByIds,
  label,
  required,
  tooltip,
  disabled,
}: FormMultiSelectProps<TFieldValues>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<TFieldValues>();

  const errorMessage = get(errors, name)?.message;

  const renderTextFieldInput = useCallback(
    (params: AutocompleteRenderInputParams) => {
      return <TextField {...params} label={`${label}${required ? '*' : ''}`} disabled={disabled} />;
    },
    [label, required, disabled],
  );

  const onChange = useCallback(
    (field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>) =>
      (_event: SyntheticEvent, newValue: Option[]) => {
        field.onChange(newValue.map((option) => option.value));
      },
    [],
  );

  const getOptionLabel = useCallback((option: Option) => option.label, []);

  const controllerRenderer = useCallback(
    ({ field }: { field: ControllerRenderProps<TFieldValues, Path<TFieldValues>> }) => {
      if (fetchOptions && fetchOptionsByIds) {
        return (
          <AsyncField
            field={field}
            fetchOptions={fetchOptions}
            fetchOptionsByIds={fetchOptionsByIds}
            label={label}
            required={required}
            disabled={disabled}
          />
        );
      } else {
        const localOptions = options || [];
        const selectedOptions = localOptions.filter((option) => field.value.includes(option.value));

        return (
          <Autocomplete
            data-testid={`controlled-select-${name}`}
            multiple
            options={localOptions}
            getOptionLabel={getOptionLabel}
            onChange={onChange(field)}
            value={selectedOptions}
            renderInput={renderTextFieldInput}
            disabled={disabled}
          />
        );
      }
    },
    [
      fetchOptions,
      fetchOptionsByIds,
      label,
      required,
      options,
      name,
      getOptionLabel,
      onChange,
      renderTextFieldInput,
      disabled,
    ],
  );

  return (
    <FormControl sx={{ width: '100%' }} error={Boolean(errorMessage)}>
      <Tooltip title={tooltip || ''} arrow enterDelay={2000} leaveDelay={200} placement="top" enterNextDelay={2000}>
        <>
          <Controller control={control} name={name} render={controllerRenderer} />
          {Boolean(errorMessage) && (
            <FormHelperText>{typeof errorMessage === 'string' ? errorMessage : undefined}</FormHelperText>
          )}
        </>
      </Tooltip>
    </FormControl>
  );
}

interface AsyncFieldProps<TFieldValues extends FieldValues> {
  field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>;
  label: string;
  required?: boolean;
  fetchOptions: (
    searchQuery: string,
    page: number,
  ) => Promise<{
    data: Option[];
    totalPages: number;
  }>;
  fetchOptionsByIds: (ids: number[]) => Promise<{ data: Option[] }>;
  disabled?: boolean;
}

const AsyncField = <T extends FieldValues>({
  field,
  label,
  required,
  fetchOptions,
  fetchOptionsByIds,
  disabled,
}: AsyncFieldProps<T>) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  const [debouncedInputValue] = useDebounce(inputValue, 100);

  // Fetch options based on search query and page number
  const fetchOptionsData = useCallback(
    async (search: string, pageNumber: number) => {
      setLoading(true);
      try {
        const result = await fetchOptions(search, pageNumber);
        setOptions((prevOptions) => {
          const optionsMap = new Map(prevOptions.map((option) => [option.value, option]));
          result.data.forEach((option) => {
            optionsMap.set(option.value, option);
          });
          return Array.from(optionsMap.values());
        });
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [fetchOptions],
  );

  // Fetch selected options by IDs
  const fetchSelectedOptionsByIds = useCallback(async () => {
    if (field.value && field.value.length > 0) {
      setLoading(true);
      try {
        const result = await fetchOptionsByIds(field.value);
        setSelectedOptions(result.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  }, [field.value, fetchOptionsByIds]);

  // Effect to fetch options when debounced input value changes
  useEffect(() => {
    setPage(1);
    fetchOptionsData(debouncedInputValue, 1);
  }, [debouncedInputValue, fetchOptionsData]);

  // Effect to fetch selected options when field value changes
  useEffect(() => {
    fetchSelectedOptionsByIds();
  }, [fetchSelectedOptionsByIds]);

  // Handle infinite scrolling
  const handleScroll = useCallback(
    (event: UIEvent<HTMLUListElement>) => {
      const listboxNode = event.currentTarget;
      if (
        listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 1 &&
        !loading &&
        page < totalPages
      ) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchOptionsData(debouncedInputValue, nextPage);
      }
    },
    [debouncedInputValue, fetchOptionsData, loading, page, totalPages],
  );

  // Combine options and selected options to ensure all selected items are displayed
  const allOptionsMap = new Map<number | string, Option>();
  options.forEach((option) => {
    allOptionsMap.set(option.value, option);
  });
  selectedOptions.forEach((option) => {
    allOptionsMap.set(option.value, option);
  });
  const allOptions = Array.from(allOptionsMap.values());

  // Determine the selected options based on field value
  const value = useMemo(
    () => allOptions.filter((option) => field.value.includes(option.value)),
    [field.value, allOptions],
  );

  const renderInput = useCallback(
    (params: AutocompleteRenderInputParams) => (
      <TextField
        {...params}
        label={`${label}${required ? '*' : ''}`}
        disabled={disabled}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              {loading ? <CircularProgress color="inherit" size={20} /> : null}
              {params.InputProps.endAdornment}
            </>
          ),
        }}
      />
    ),
    [label, required, loading, disabled],
  );

  const onInputChange = useCallback(
    (event: SyntheticEvent, newInputValue: string) => {
      if (event && event.type === 'change') {
        setInputValue(newInputValue);
      }
    },
    [setInputValue],
  );

  const onChange = useCallback(
    (_event: SyntheticEvent, newValue: Option[]) => {
      field.onChange(newValue.map((option) => option.value));
    },
    [field],
  );

  const getOptionKey = useCallback((option: Option) => option.value, []);
  const getOptionLabel = useCallback((option: Option) => option.label, []);

  return (
    <Autocomplete
      data-testid={`controlled-select-${field.name}`}
      multiple
      options={allOptions}
      getOptionLabel={getOptionLabel}
      inputValue={inputValue}
      onInputChange={onInputChange}
      onChange={onChange}
      value={value}
      loading={loading}
      getOptionKey={getOptionKey}
      renderInput={renderInput}
      ListboxProps={{
        onScroll: handleScroll,
      }}
      disabled={disabled}
    />
  );
};

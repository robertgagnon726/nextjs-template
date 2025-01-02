import { UpdateAccountRequestDto } from '@/generated/api-client';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import { ChangeEvent, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { InferType, object, string } from 'yup';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { CurrencyTextField } from '@/components/Inputs/CurrencyTextField';
import { preventInvalidChars } from '@Components/Inputs/FormCurrencyTextField';

interface FieldEditorProps {
  label: string;
  fieldName: 'name' | 'slug' | 'minimumPricePerVisit';
  fieldValue: string;
  editField: 'name' | 'slug' | 'minimumPricePerVisit' | null;
  setEditField: React.Dispatch<React.SetStateAction<'name' | 'slug' | 'minimumPricePerVisit' | null>>;
  updateAccountSettings: (data: Partial<UpdateAccountRequestDto>) => Promise<void>;
  mutate: () => void;
  type?: 'currency';
  description?: string;
}

const validationMap = {
  name: string().required('Account name is required'),
  slug: string()
    .required('Account slug is required')
    .matches(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  minimumPricePerVisit: string().required('Minimum price per visit is required'),
};

export function FieldEditor({
  label,
  fieldName,
  fieldValue,
  editField,
  setEditField,
  updateAccountSettings,
  mutate,
  type,
  description,
}: FieldEditorProps) {
  const isEditing = editField === fieldName;

  const schema = object().shape({
    [fieldName]: validationMap[fieldName],
  });

  // Define the type for form values based on the schema
  type AccountSettingsFormValues = InferType<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<AccountSettingsFormValues>({
    resolver: yupResolver(schema),
    defaultValues: { [fieldName]: fieldValue },
  });

  useEffect(() => {
    reset({ [fieldName]: fieldValue });
  }, [fieldValue, fieldName, reset]);

  const onSubmit: SubmitHandler<AccountSettingsFormValues> = async (formData) => {
    try {
      await updateAccountSettings({ [fieldName]: formData[fieldName] });
      mutate(); // Refresh data
      setEditField(null);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error updating account settings:', error);
    }
  };

  const handleCancel = () => {
    reset({ [fieldName]: fieldValue });
    setEditField(null);
  };

  const handleCurrencyChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value.replace(/[^0-9.-]+/g, '');

    setValue(fieldName, value);
  };

  return (
    <Box sx={{ marginBottom: 2 }}>
      <Typography variant="h6">
        {label}
        {!isEditing && (
          <IconButton aria-label={`edit ${fieldName}`} onClick={() => setEditField(fieldName)}>
            <EditIcon />
          </IconButton>
        )}
      </Typography>
      {isEditing ? (
        <>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {type === 'currency' ? (
              <CurrencyTextField
                {...register(fieldName)}
                onChange={handleCurrencyChange}
                onKeyDown={preventInvalidChars}
                defaultValue={fieldValue}
                error={!!errors[fieldName]}
                helperText={errors[fieldName]?.message || description}
                size="small"
              />
            ) : (
              <TextField
                {...register(fieldName)}
                defaultValue={fieldValue}
                error={!!errors[fieldName]}
                size="small"
                // helperText={errors[fieldName]?.message || description}
                fullWidth
              />
            )}

            <Box sx={{ display: 'flex', align: 'center', gap: 1 }}>
              <Button type="submit" variant="contained" color="primary" startIcon={<SaveIcon />}>
                Save
              </Button>
              <Button variant="outlined" color="secondary" startIcon={<CancelIcon />} onClick={handleCancel}>
                Cancel
              </Button>
            </Box>
          </form>
          <Typography variant="body2" color="textSecondary">
            {description}
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="body1">
            {type === 'currency' && '$'}
            {fieldValue}
          </Typography>
          {description && (
            <Typography variant="body2" color="textSecondary">
              {description}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}

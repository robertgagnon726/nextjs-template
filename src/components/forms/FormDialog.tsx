import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  LinearProgress,
  Fade,
  Box,
  DialogContentText,
} from '@mui/material';
import { InferType } from 'yup';
import React, { useCallback } from 'react';
import { Form } from './Form';
import { AnySchema, OnFieldChange, useFormLogic, WatchField } from './useFormLogic';

interface FormDialogProps<T extends AnySchema> {
  open?: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
  defaultValues: InferType<T>;
  validationSchema: T;
  onSubmit: (data: InferType<T>) => Promise<void>;
  renderFormContent?: () => React.ReactNode;
  watchField?: WatchField<InferType<T>>;
  onFieldChange?: OnFieldChange<InferType<T>>;
  reValidateMode?: 'onChange' | 'onBlur' | 'onSubmit';
  mode?: 'onBlur' | 'onSubmit' | 'onChange' | 'all' | 'onTouched';
}

export const FormDialog = <T extends AnySchema>({
  open = true,
  onClose,
  title,
  description,
  renderFormContent,
  ...formProps
}: FormDialogProps<T>) => {
  const { methods, onFormSubmit, submitLoading, reset } = useFormLogic(formProps);

  const handleClose = useCallback(() => {
    if (!submitLoading) {
      reset();
      onClose?.();
    }
  }, [submitLoading, reset, onClose]);

  const formContent = (
    <>
      <Fade in={submitLoading} unmountOnExit>
        <LinearProgress sx={{ width: '100%' }} color="success" />
      </Fade>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>
        {description && (
          <Box mb={2}>
            <DialogContentText>{description}</DialogContentText>
          </Box>
        )}
        <Form
          disabled={submitLoading}
          methods={methods}
          onFormSubmit={onFormSubmit}
          renderFormContent={renderFormContent}
          actions={
            onClose && (
              <DialogActions>
                <Button onClick={handleClose} disabled={submitLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitLoading}>
                  Confirm
                </Button>
              </DialogActions>
            )
          }
        />
      </DialogContent>
    </>
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth data-testid={'form-dialog'}>
      {formContent}
    </Dialog>
  );
};

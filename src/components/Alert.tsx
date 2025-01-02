'use client';
import React, { createContext, useContext, ReactNode } from 'react';
import { SnackbarProvider, useSnackbar, VariantType } from 'notistack';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export type SetAlert = (message: string, variant: VariantType) => void;

type AlertContextType = {
  setAlert: SetAlert;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

/**
 * This will set up SnackbarProvider at the root,
 * and then create a child provider that exposes the
 * notistack functionality via `useAlert`.
 */
export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SnackbarProvider
      maxSnack={4} // how many snackbars to show at once
      autoHideDuration={4000} // default auto-hide time
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <AlertContextProvider>{children}</AlertContextProvider>
    </SnackbarProvider>
  );
};

/**
 * We separate this into AlertContextProvider so we can call
 * useSnackbar() inside of a component that is a child of SnackbarProvider.
 */
const AlertContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const setAlert: SetAlert = (message, variant) => {
    enqueueSnackbar(message, {
      variant,

      action: (key) => (
        <IconButton size="small" onClick={() => closeSnackbar(key)} sx={{ color: 'inherit' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      ),
    });
  };

  return <AlertContext.Provider value={{ setAlert }}>{children}</AlertContext.Provider>;
};

/**
 * Custom hook to access the Alert context.
 */
export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

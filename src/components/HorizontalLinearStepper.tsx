'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import { Dispatch, Fragment, ReactNode, SetStateAction, useCallback, useState } from 'react';

interface HorizontalLinearStepperProps {
  stepNames: string[];
  stepContent: ReactNode;
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
  stepperWidth?: number;
  nextDisabled?: boolean;
  primaryActionHandler: () => void;
  primaryActionLabel: string;
  secondaryActionHandler?: () => void;
  secondaryActionLabel?: string;
  nextButtonPreHandler?: () => Promise<void>;
}

/**
 * A component that renders a horizontal linear stepper with customizable steps and actions.
 */
export default function HorizontalLinearStepper({
  stepNames,
  stepContent,
  activeStep,
  setActiveStep,
  nextDisabled = false,
  stepperWidth = 800,
  primaryActionHandler,
  primaryActionLabel,
  secondaryActionHandler,
  secondaryActionLabel,
  nextButtonPreHandler,
}: HorizontalLinearStepperProps) {
  const [loading, setLoading] = useState(false);
  const handleNext = useCallback(async () => {
    try {
      setLoading(true);
      await nextButtonPreHandler?.();
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } catch {
      // Fail silently
    } finally {
      setLoading(false);
    }
  }, [nextButtonPreHandler, setActiveStep]);

  const handleBack = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, [setActiveStep]);

  const handleReset = useCallback(() => {
    setActiveStep(0);
  }, [setActiveStep]);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        maxWidth: 1200,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Stepper activeStep={activeStep} sx={{ width: stepperWidth }}>
          {stepNames.map((label) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: ReactNode;
            } = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>

      {activeStep === stepNames.length ? (
        <Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </Fragment>
      ) : (
        <Fragment>
          {stepContent}
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {activeStep !== stepNames.length - 1 ? (
              <Button onClick={handleNext} disabled={nextDisabled || loading}>
                Next
              </Button>
            ) : (
              <>
                {secondaryActionHandler && secondaryActionLabel && (
                  <Button onClick={secondaryActionHandler} disabled={nextDisabled}>
                    {secondaryActionLabel}
                  </Button>
                )}
                <Button onClick={primaryActionHandler} disabled={nextDisabled}>
                  {primaryActionLabel}
                </Button>
              </>
            )}
          </Box>
        </Fragment>
      )}
    </Box>
  );
}

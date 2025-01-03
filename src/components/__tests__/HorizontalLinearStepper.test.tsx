import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React, { ReactNode, useState } from 'react';
import HorizontalLinearStepper from '@Components/HorizontalLinearStepper';

// Utility wrapper to manage activeStep state
const Wrapper = ({
  children,
}: {
  children: (props: { activeStep: number; setActiveStep: React.Dispatch<React.SetStateAction<number>> }) => ReactNode;
}) => {
  const [activeStep, setActiveStep] = useState(0);
  return <>{children({ activeStep, setActiveStep })}</>;
};

describe('HorizontalLinearStepper', () => {
  it('renders stepper with step names', () => {
    const stepNames = ['Step 1', 'Step 2', 'Step 3'];

    render(
      <Wrapper>
        {({ activeStep, setActiveStep }) => (
          <HorizontalLinearStepper
            stepNames={stepNames}
            stepContent={<div>Step Content</div>}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            primaryActionHandler={vi.fn()}
            primaryActionLabel="Finish"
          />
        )}
      </Wrapper>,
    );

    stepNames.forEach((step) => {
      expect(screen.getByText(step)).toBeInTheDocument();
    });
  });

  it('renders step content', () => {
    render(
      <Wrapper>
        {({ activeStep, setActiveStep }) => (
          <HorizontalLinearStepper
            stepNames={['Step 1']}
            stepContent={<div>Step Content</div>}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            primaryActionHandler={vi.fn()}
            primaryActionLabel="Finish"
          />
        )}
      </Wrapper>,
    );

    expect(screen.getByText('Step Content')).toBeInTheDocument();
  });

  it('navigates to next step when Next button is clicked', async () => {
    const stepNames = ['Step 1', 'Step 2'];

    render(
      <Wrapper>
        {({ activeStep, setActiveStep }) => (
          <HorizontalLinearStepper
            stepNames={stepNames}
            stepContent={<div>Step Content</div>}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            primaryActionHandler={vi.fn()}
            primaryActionLabel="Finish"
          />
        )}
      </Wrapper>,
    );
    await act(async () => {
      await fireEvent.click(screen.getByText('Next'));
    });

    expect(screen.getByText('Step 2')).toBeInTheDocument();
  });

  it('disables Next button when nextDisabled is true', () => {
    render(
      <Wrapper>
        {({ activeStep, setActiveStep }) => (
          <HorizontalLinearStepper
            stepNames={['Step 1', 'Step 2']}
            stepContent={<div>Step Content</div>}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            primaryActionHandler={vi.fn()}
            primaryActionLabel="Finish"
            nextDisabled
          />
        )}
      </Wrapper>,
    );

    expect(screen.getByText('Next')).toBeDisabled();
  });

  it('executes primary action handler on Finish button click', async () => {
    const primaryActionHandler = vi.fn();

    render(
      <Wrapper>
        {({ setActiveStep }) => (
          <HorizontalLinearStepper
            stepNames={['Step 1']}
            stepContent={<div>Step Content</div>}
            activeStep={0}
            setActiveStep={setActiveStep}
            primaryActionHandler={primaryActionHandler}
            primaryActionLabel="Finish"
          />
        )}
      </Wrapper>,
    );

    await act(async () => {
      await fireEvent.click(screen.getByText('Finish'));
    });
    expect(primaryActionHandler).toHaveBeenCalled();
  });

  it('calls nextButtonPreHandler before navigating to next step', async () => {
    const nextButtonPreHandler = vi.fn().mockResolvedValueOnce(undefined);

    render(
      <Wrapper>
        {({ activeStep, setActiveStep }) => (
          <HorizontalLinearStepper
            stepNames={['Step 1', 'Step 2']}
            stepContent={<div>Step Content</div>}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            primaryActionHandler={vi.fn()}
            primaryActionLabel="Finish"
            nextButtonPreHandler={nextButtonPreHandler}
          />
        )}
      </Wrapper>,
    );

    await act(async () => {
      await fireEvent.click(screen.getByText('Next'));
    });
    expect(nextButtonPreHandler).toHaveBeenCalled();
  });
});

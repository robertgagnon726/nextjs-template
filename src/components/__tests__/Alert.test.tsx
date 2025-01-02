import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReactNode, useCallback } from 'react';
import { AlertProvider, useAlert } from '@Components/Alert';

// Mock MUI components
vi.mock('@mui/material/Snackbar', () => ({
  default: ({ children }: { children: ReactNode }) => <div data-testid="snackbar">{children}</div>,
}));

vi.mock('@mui/material/Alert', () => ({
  default: ({ children, severity }: { children: ReactNode; severity: string }) => (
    <div data-testid="alert" data-severity={severity}>
      {children}
    </div>
  ),
}));

// Create a helper component to trigger alerts using the context
const TestComponent = () => {
  const { setAlert } = useAlert();

  const onClick = useCallback(() => {
    setAlert('Test message', 'success');
  }, [setAlert]);

  return <button onClick={onClick}>Trigger Alert</button>;
};

describe('AlertProvider', () => {
  it('should render an alert with the correct message and severity when setAlert is called', async () => {
    // Render the AlertProvider with the test component inside
    render(
      <AlertProvider>
        <TestComponent />
      </AlertProvider>,
    );

    await act(async () => {
      // Click the button to trigger the alert
      await screen.getByText('Trigger Alert').click();
    });

    // Wait for the alert to appear and verify its content
    await waitFor(() => {
      const alertElement = screen.getByTestId('alert');
      expect(alertElement).toBeInTheDocument();
      expect(alertElement).toHaveTextContent('Test message');
      expect(alertElement).toHaveAttribute('data-severity', 'success');
    });

    // Verify that Snackbar is also rendered
    expect(screen.getByTestId('snackbar')).toBeInTheDocument();
  });
});

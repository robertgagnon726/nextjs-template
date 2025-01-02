import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Provider, useSelector } from 'react-redux';
import { store, RootState } from '@/redux/store';
import { usePathname, useRouter } from 'next/navigation';
import { appActions } from '@/redux/slices/app-slice';
import { GetUsersResponseDtoUser } from '@/generated/api-client';
import { AlertProvider } from '@Components/Alert';
import { PersistentDrawerLeft } from '@Connected-components/PersistentDrawerLeft';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(() => '/admin/home'),
}));
vi.mock('react-redux', async () => {
  const actualReactRedux = await vi.importActual('react-redux');
  return {
    ...actualReactRedux,
    useSelector: vi.fn(),
  };
});

vi.mock('@/hooks/useFirebaseAuth', () => ({
  useFirebaseAuth: vi.fn(() => ({
    logout: vi.fn(),
    redirectCheck: vi.fn(),
  })),
}));

const mockRouterPush = vi.fn();
vi.mocked(useRouter).mockReturnValue({
  push: mockRouterPush,
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
});
vi.mocked(usePathname).mockReturnValue('/admin/home');

const mockUseSelector = vi.mocked(useSelector);
mockUseSelector.mockImplementation((selector) => {
  const state: RootState = {
    ...store.getState(),
    app: {
      ...store.getState().app,
      user: {
        roles: ['Admin'],
      } as GetUsersResponseDtoUser,
    },
  };
  return selector(state);
});

describe('PersistentDrawerLeft', () => {
  it('renders header with drawer and main content', () => {
    render(
      <Provider store={store}>
        <AlertProvider>
          <PersistentDrawerLeft>
            <div>Main Content</div>
          </PersistentDrawerLeft>
        </AlertProvider>
      </Provider>,
    );

    expect(screen.getByText('Main Content')).toBeInTheDocument();
  });

  it('opens drawer when menu icon is clicked', () => {
    render(
      <Provider store={store}>
        <AlertProvider>
          <PersistentDrawerLeft>
            <div>Main Content</div>
          </PersistentDrawerLeft>
        </AlertProvider>
      </Provider>,
    );

    fireEvent.click(screen.getByLabelText('open drawer'));
    expect(store.getState().app.drawerOpen).toBe(true);
  });

  it('closes drawer when close icon is clicked', () => {
    store.dispatch(appActions.setDrawerOpen(true));

    render(
      <Provider store={store}>
        <AlertProvider>
          <PersistentDrawerLeft>
            <div>Main Content</div>
          </PersistentDrawerLeft>
        </AlertProvider>
      </Provider>,
    );

    fireEvent.click(screen.getByTestId('chevron-left'));
    expect(store.getState().app.drawerOpen).toBe(false);
  });

  it('navigates to the correct route when a navigation item is clicked', () => {
    render(
      <Provider store={store}>
        <AlertProvider>
          <PersistentDrawerLeft>
            <div>Main Content</div>
          </PersistentDrawerLeft>
        </AlertProvider>
      </Provider>,
    );

    fireEvent.click(screen.getByText('Products'));
    expect(mockRouterPush).toHaveBeenCalledWith('/admin/products');
  });
});

import { renderHook } from '@testing-library/react';
import { appActions } from '@/redux/slices/app-slice';
import { useDispatch } from 'react-redux';
import { vi, describe, it, beforeEach, afterEach, expect } from 'vitest';
import { useLoading } from '@Hooks/useLoading';

vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
}));

describe('useLoading', () => {
  let dispatchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    dispatchMock = vi.fn();
    vi.mocked(useDispatch).mockReturnValue(dispatchMock);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should dispatch incrementLoading when isLoading changes from false to true', () => {
    const { rerender } = renderHook((props) => useLoading(props.isLoading), {
      initialProps: { isLoading: false },
    });

    // Change isLoading to true
    rerender({ isLoading: true });

    expect(dispatchMock).toHaveBeenCalledWith(appActions.incrementLoading());
  });

  it('should dispatch decrementLoading when isLoading changes from true to false', () => {
    const { rerender } = renderHook((props) => useLoading(props.isLoading), {
      initialProps: { isLoading: true },
    });

    // Change isLoading to false
    rerender({ isLoading: false });

    expect(dispatchMock).toHaveBeenCalledWith(appActions.decrementLoading());
  });

  it('should dispatch decrementLoading on unmount if isLoading is true', () => {
    const { unmount } = renderHook(() => useLoading(true));

    // Unmount the component
    unmount();

    expect(dispatchMock).toHaveBeenCalledWith(appActions.decrementLoading());
  });

  it('should not dispatch decrementLoading on unmount if isLoading is false', () => {
    const { unmount } = renderHook(() => useLoading(false));

    // Unmount the component
    unmount();

    expect(dispatchMock).not.toHaveBeenCalledWith(appActions.decrementLoading());
  });
});

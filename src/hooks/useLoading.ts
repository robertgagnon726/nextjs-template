import { useDispatch } from 'react-redux';
import { useEffect, useRef } from 'react';
import { appActions } from '@/redux/slices/app-slice';

/**
 * Custom hook to manage global loading state with Redux.
 * It increments or decrements the global loading count based on the `isLoading` prop.
 */
export const useLoading = (isLoading: boolean) => {
  const dispatch = useDispatch();
  const wasLoading = useRef(false); // Track previous loading state to detect transitions

  useEffect(() => {
    if (isLoading && !wasLoading.current) {
      dispatch(appActions.incrementLoading());
    } else if (!isLoading && wasLoading.current) {
      dispatch(appActions.decrementLoading());
    }

    // Update the previous loading state
    wasLoading.current = isLoading;

    // Cleanup: If the component unmounts while loading, decrement the counter
    return () => {
      if (wasLoading.current) {
        dispatch(appActions.decrementLoading());
      }
    };
  }, [isLoading, dispatch]);
};

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export const useGlobalLoading = () => {
  const globalLoading = useSelector((state: RootState) => state.app.loadingCount > 0);
  return globalLoading;
};

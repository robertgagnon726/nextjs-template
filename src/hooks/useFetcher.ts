import { useAlert } from '@Components/Alert';

/**
 * Custom hook to fetch various data from the API.
 */
export const useFetcher = () => {
  const { setAlert } = useAlert();

  const fetchUsers = async () => {
    try {
      console.log('Implement me');
    } catch {
      setAlert('Failed to fetch', 'error');
      return undefined;
    }
  };
  return {
    fetchUsers,
  };
};

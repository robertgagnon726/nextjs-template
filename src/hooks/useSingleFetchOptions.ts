import { useCallback } from 'react';
// import { EFilterOperator } from '@/generated/api-client';

interface FetchOptionsParams {
  searchField: string;
  labelFormatter: (item: any) => string;
  getByIdEndpoint: (params: any) => Promise<any>;
  getAllEndpoint: (params: any) => Promise<any>;
}

export function useSingleFetchOptions({
  searchField,
  labelFormatter,
  getByIdEndpoint,
  getAllEndpoint,
}: FetchOptionsParams) {
  const fetchOptions = useCallback(
    async (searchQuery: string, page: number) => {
      const response = await getAllEndpoint({
        page,
        limit: 20,
        filters: [
          {
            field: searchField,
            // operator: EFilterOperator.Like, // TODO FIX ME
            value: searchQuery,
          },
        ],
      });
      return {
        data: response.data.data.map((item: any) => ({
          value: item.id,
          label: labelFormatter(item),
        })),
        totalPages: response.data.meta.totalPages,
      };
    },
    [getAllEndpoint, labelFormatter, searchField],
  );

  const fetchOptionById = useCallback(
    async (id: number) => {
      const response = await getByIdEndpoint({ id });
      return {
        data: {
          value: response.data.data.id,
          label: labelFormatter(response.data.data),
        },
      };
    },
    [getByIdEndpoint, labelFormatter],
  );

  return {
    fetchOptions,
    fetchOptionById,
  };
}

import { useCallback } from 'react';

interface FetchOptionsParams {
  searchField: string;
  labelFormatter: (item: any) => string;
  getByIdsEndpoint: (params: any) => Promise<any>;
  getAllEndpoint: (params: any) => Promise<any>;
}

export function useMultiFetchOptions({
  searchField,
  labelFormatter,
  getByIdsEndpoint,
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

  const fetchOptionsByIds = useCallback(
    async (ids: number[]) => {
      const response = await getByIdsEndpoint({ ids });
      return {
        data: response.data.data.map((item: any) => ({
          value: item.id,
          label: labelFormatter(item),
        })),
      };
    },
    [getByIdsEndpoint, labelFormatter],
  );

  return {
    fetchOptions,
    fetchOptionsByIds,
  };
}

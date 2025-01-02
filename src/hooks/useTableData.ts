import { useState, useEffect } from 'react';
import useSWR, { KeyedMutator } from 'swr';
import { Filter, ESortOrder, QueryParamsRequestDto } from '@/generated/api-client';

interface UseTableDataParams<T> {
  fetcher: (params: QueryParamsRequestDto) => Promise<T | undefined>;
  initialPage?: number;
  initialItemsPerPage?: number;
  initialFilters?: Filter[];
  initialSortBy?: string;
  initialSortOrder?: ESortOrder;
}

interface FetcherParams {
  page: number;
  limit: number;
  filters: Filter[];
  sortBy: string;
  sortOrder: ESortOrder;
}

interface UseTableDataReturn<T> {
  tableData: T | undefined;
  isLoading: boolean;
  isValidating: boolean;
  page: number;
  setPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (itemsPerPage: number) => void;
  appliedFilters: Filter[];
  setAppliedFilters: (filters: Filter[]) => void;
  appliedSortBy: string;
  setAppliedSortBy: (sortBy: string) => void;
  appliedSortOrder: ESortOrder;
  setAppliedSortOrder: (sortOrder: ESortOrder) => void;
  mutate: KeyedMutator<T | undefined>;
}

export function useTableData<T>({
  fetcher,
  initialPage = 1,
  initialItemsPerPage = 25,
  initialFilters = [],
  initialSortBy = '',
  initialSortOrder = ESortOrder.Asc,
}: UseTableDataParams<T>): UseTableDataReturn<T> {
  const [page, setPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [appliedFilters, setAppliedFilters] = useState<Filter[]>(initialFilters);
  const [appliedSortBy, setAppliedSortBy] = useState<string>(initialSortBy);
  const [appliedSortOrder, setAppliedSortOrder] = useState<ESortOrder>(initialSortOrder);

  const fetcherParams: FetcherParams = {
    page,
    limit: itemsPerPage,
    filters: appliedFilters,
    sortBy: appliedSortBy,
    sortOrder: appliedSortOrder,
  };

  const { data, error, isValidating, mutate } = useSWR([fetcher.name, fetcherParams], () => fetcher(fetcherParams), {
    keepPreviousData: true, // SWR v1 feature, keeps previous data during revalidation
  });

  const [tableData, setTableData] = useState<T | undefined>(data);

  useEffect(() => {
    if (data) {
      setTableData(data);
    }
  }, [data]);

  const isLoading = !data && !error;

  return {
    tableData,
    isLoading,
    isValidating,
    page,
    setPage,
    itemsPerPage,
    setItemsPerPage,
    appliedFilters,
    setAppliedFilters,
    appliedSortBy,
    setAppliedSortBy,
    appliedSortOrder,
    setAppliedSortOrder,
    mutate,
  };
}

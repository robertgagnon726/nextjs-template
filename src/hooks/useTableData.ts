import { useState, useEffect } from 'react';
import useSWR, { KeyedMutator } from 'swr';

interface UseTableDataParams<T> {
  // fetcher: (params: QueryParamsRequestDto) => Promise<T | undefined>; // TODO FIX ME
  fetcher: (params: FetcherParams) => Promise<T | undefined>;
  initialPage?: number;
  initialItemsPerPage?: number;
  // initialFilters?: Filter[]; // TODO FIX ME
  initialFilters?: unknown[];
  initialSortBy?: string;
  // initialSortOrder?: ESortOrder; // TODO FIX ME
  initialSortOrder?: unknown;
}

interface FetcherParams {
  page: number;
  limit: number;
  // filters: Filter[]; // TODO FIX ME
  filters: unknown[];
  sortBy: string;
  // sortOrder: ESortOrder; // TODO FIX ME
  sortOrder: unknown;
}

interface UseTableDataReturn<T> {
  tableData: T | undefined;
  isLoading: boolean;
  isValidating: boolean;
  page: number;
  setPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (itemsPerPage: number) => void;
  // appliedFilters: Filter[]; // TODO FIX ME
  appliedFilters: unknown[];
  // setAppliedFilters: (filters: Filter[]) => void; // TODO FIX ME
  setAppliedFilters: (filters: unknown[]) => void;
  appliedSortBy: string;
  setAppliedSortBy: (sortBy: string) => void;
  // appliedSortOrder: ESortOrder; // TODO FIX ME
  appliedSortOrder: unknown;
  // setAppliedSortOrder: (sortOrder: ESortOrder) => void; // TODO FIX ME
  setAppliedSortOrder: (sortOrder: unknown) => void;
  mutate: KeyedMutator<T | undefined>;
}

export function useTableData<T>({
  fetcher,
  initialPage = 1,
  initialItemsPerPage = 25,
  initialFilters = [],
  initialSortBy = '',
  // initialSortOrder = ESortOrder.Asc, // TODO FIX ME
  initialSortOrder = '',
}: UseTableDataParams<T>): UseTableDataReturn<T> {
  const [page, setPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  // const [appliedFilters, setAppliedFilters] = useState<Filter[]>(initialFilters); // TODO FIX ME
  const [appliedFilters, setAppliedFilters] = useState<unknown[]>(initialFilters);
  const [appliedSortBy, setAppliedSortBy] = useState<string>(initialSortBy);
  // const [appliedSortOrder, setAppliedSortOrder] = useState<ESortOrder>(initialSortOrder); // TODO FIX ME
  const [appliedSortOrder, setAppliedSortOrder] = useState<unknown>(initialSortOrder);

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

import { renderHook, act } from '@testing-library/react';
import useSWR from 'swr';
import { Filter, ESortOrder, QueryParamsRequestDto } from '@/generated/api-client';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import { useTableData } from '@Hooks/useTableData';

vi.mock('swr');

describe('useTableData', () => {
  const mockFetcher = vi.fn();
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSWR).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: false,
      isValidating: false,
      mutate: mockMutate,
    });
  });

  const setup = (initialProps = {}) =>
    renderHook(() =>
      useTableData({
        fetcher: mockFetcher,
        initialPage: 1,
        initialItemsPerPage: 25,
        initialFilters: [],
        initialSortBy: 'name',
        initialSortOrder: ESortOrder.Asc,
        ...initialProps,
      }),
    );

  it('should initialize with correct default state', () => {
    const { result } = setup();

    expect(result.current.page).toBe(1);
    expect(result.current.itemsPerPage).toBe(25);
    expect(result.current.appliedFilters).toEqual([]);
    expect(result.current.appliedSortBy).toBe('name');
    expect(result.current.appliedSortOrder).toBe(ESortOrder.Asc);
    expect(result.current.isLoading).toBe(true); // Since no data or error
    expect(result.current.isValidating).toBe(false);
  });

  it('should fetch data with correct parameters', async () => {
    const mockData = { rows: [{ id: 1, name: 'Item 1' }], total: 1 };
    (useSWR as Mock).mockReturnValue({
      data: mockData,
      error: undefined,
      isValidating: false,
      mutate: mockMutate,
    });

    const { result } = setup();

    expect(mockFetcher).not.toHaveBeenCalled();

    act(() => {
      result.current.setPage(2);
    });

    expect(result.current.page).toBe(2);

    const fetcherParams: QueryParamsRequestDto = {
      page: 2,
      limit: 25,
      filters: [],
      sortBy: 'name',
      sortOrder: ESortOrder.Asc,
    };

    expect(useSWR).toHaveBeenCalledWith([mockFetcher.name, fetcherParams], expect.any(Function), {
      keepPreviousData: true,
    });
  });

  it('should handle changes in itemsPerPage', async () => {
    const { result } = setup();

    act(() => {
      result.current.setItemsPerPage(50);
    });

    expect(result.current.itemsPerPage).toBe(50);

    const fetcherParams: QueryParamsRequestDto = {
      page: 1,
      limit: 50,
      filters: [],
      sortBy: 'name',
      sortOrder: ESortOrder.Asc,
    };

    expect(useSWR).toHaveBeenCalledWith([mockFetcher.name, fetcherParams], expect.any(Function), {
      keepPreviousData: true,
    });
  });

  it('should handle changes in appliedFilters', async () => {
    const { result } = setup();

    const newFilters: Filter[] = [{ field: 'status', operator: 'eq', value: 'active' }];

    act(() => {
      result.current.setAppliedFilters(newFilters);
    });

    expect(result.current.appliedFilters).toEqual(newFilters);

    const fetcherParams: QueryParamsRequestDto = {
      page: 1,
      limit: 25,
      filters: newFilters,
      sortBy: 'name',
      sortOrder: ESortOrder.Asc,
    };

    expect(useSWR).toHaveBeenCalledWith([mockFetcher.name, fetcherParams], expect.any(Function), {
      keepPreviousData: true,
    });
  });

  it('should handle changes in sortBy and sortOrder', async () => {
    const { result } = setup();

    act(() => {
      result.current.setAppliedSortBy('createdAt');
      result.current.setAppliedSortOrder(ESortOrder.Desc);
    });

    expect(result.current.appliedSortBy).toBe('createdAt');
    expect(result.current.appliedSortOrder).toBe(ESortOrder.Desc);

    const fetcherParams: QueryParamsRequestDto = {
      page: 1,
      limit: 25,
      filters: [],
      sortBy: 'createdAt',
      sortOrder: ESortOrder.Desc,
    };

    expect(useSWR).toHaveBeenCalledWith([mockFetcher.name, fetcherParams], expect.any(Function), {
      keepPreviousData: true,
    });
  });

  it('should return isLoading as false when data is available', async () => {
    const mockData = { rows: [{ id: 1, name: 'Item 1' }], total: 1 };
    (useSWR as Mock).mockReturnValue({
      data: mockData,
      error: undefined,
      isValidating: false,
      mutate: mockMutate,
    });

    const { result } = setup();

    expect(result.current.isLoading).toBe(false);
  });

  it('should handle errors gracefully', async () => {
    (useSWR as Mock).mockReturnValue({
      data: undefined,
      error: new Error('API Error'),
      isValidating: false,
      mutate: mockMutate,
    });

    const { result } = setup();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.tableData).toBeUndefined();
  });
});

import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useSingleFetchOptions } from '@Hooks/useSingleFetchOptions';

const mockGetAllEndpoint = vi.fn();
const mockGetByIdEndpoint = vi.fn();
const mockLabelFormatter = vi.fn((item) => `${item.name} (${item.id})`);

describe('useSingleFetchOptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setup = () =>
    renderHook(() =>
      useSingleFetchOptions({
        searchField: 'name',
        labelFormatter: mockLabelFormatter,
        getByIdEndpoint: mockGetByIdEndpoint,
        getAllEndpoint: mockGetAllEndpoint,
      }),
    );

  describe('fetchOptions', () => {
    it('should call getAllEndpoint with correct parameters and format response', async () => {
      const mockResponse = {
        data: {
          data: [
            { id: 1, name: 'Item 1' },
            { id: 2, name: 'Item 2' },
          ],
          meta: { totalPages: 3 },
        },
      };
      mockGetAllEndpoint.mockResolvedValue(mockResponse);

      const { result } = setup();

      let response;
      await act(async () => {
        response = await result.current.fetchOptions('searchQuery', 1);
      });

      expect(mockGetAllEndpoint).toHaveBeenCalledWith({
        page: 1,
        limit: 20,
        filters: [
          {
            field: 'name',
            // operator: EFilterOperator.Like, // TODO FIX ME
            value: 'searchQuery',
          },
        ],
      });
      expect(response).toEqual({
        data: [
          { value: 1, label: 'Item 1 (1)' },
          { value: 2, label: 'Item 2 (2)' },
        ],
        totalPages: 3,
      });
      expect(mockLabelFormatter).toHaveBeenCalledWith({ id: 1, name: 'Item 1' });
      expect(mockLabelFormatter).toHaveBeenCalledWith({ id: 2, name: 'Item 2' });
    });

    it('should handle errors gracefully when getAllEndpoint fails', async () => {
      mockGetAllEndpoint.mockRejectedValue(new Error('API Error'));

      const { result } = setup();

      await expect(
        act(async () => {
          await result.current.fetchOptions('searchQuery', 1);
        }),
      ).rejects.toThrow('API Error');
      expect(mockGetAllEndpoint).toHaveBeenCalledWith({
        page: 1,
        limit: 20,
        filters: [
          {
            field: 'name',
            // operator: EFilterOperator.Like, // TODO FIX ME
            value: 'searchQuery',
          },
        ],
      });
    });
  });

  describe('fetchOptionById', () => {
    it('should call getByIdEndpoint with correct parameters and format response', async () => {
      const mockResponse = {
        data: {
          data: { id: 5, name: 'Item 5' },
        },
      };
      mockGetByIdEndpoint.mockResolvedValue(mockResponse);

      const { result } = setup();

      let response;
      await act(async () => {
        response = await result.current.fetchOptionById(5);
      });

      expect(mockGetByIdEndpoint).toHaveBeenCalledWith({ id: 5 });
      expect(response).toEqual({
        data: {
          value: 5,
          label: 'Item 5 (5)',
        },
      });
      expect(mockLabelFormatter).toHaveBeenCalledWith({ id: 5, name: 'Item 5' });
    });

    it('should handle errors gracefully when getByIdEndpoint fails', async () => {
      mockGetByIdEndpoint.mockRejectedValue(new Error('API Error'));

      const { result } = setup();

      await expect(
        act(async () => {
          await result.current.fetchOptionById(5);
        }),
      ).rejects.toThrow('API Error');
      expect(mockGetByIdEndpoint).toHaveBeenCalledWith({ id: 5 });
    });
  });
});

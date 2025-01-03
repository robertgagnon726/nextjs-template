import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useMultiFetchOptions } from '@Hooks/useMultiFetchOptions';

const mockGetAllEndpoint = vi.fn();
const mockGetByIdsEndpoint = vi.fn();
const mockLabelFormatter = vi.fn((item) => `${item.name} (${item.id})`);

describe('useMultiFetchOptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setup = () =>
    renderHook(() =>
      useMultiFetchOptions({
        searchField: 'name',
        labelFormatter: mockLabelFormatter,
        getByIdsEndpoint: mockGetByIdsEndpoint,
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
          meta: { totalPages: 5 },
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
        totalPages: 5,
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

  describe('fetchOptionsByIds', () => {
    it('should call getByIdsEndpoint with correct parameters and format response', async () => {
      const mockResponse = {
        data: {
          data: [
            { id: 3, name: 'Item 3' },
            { id: 4, name: 'Item 4' },
          ],
        },
      };
      mockGetByIdsEndpoint.mockResolvedValue(mockResponse);

      const { result } = setup();

      let response;
      await act(async () => {
        response = await result.current.fetchOptionsByIds([3, 4]);
      });

      expect(mockGetByIdsEndpoint).toHaveBeenCalledWith({ ids: [3, 4] });
      expect(response).toEqual({
        data: [
          { value: 3, label: 'Item 3 (3)' },
          { value: 4, label: 'Item 4 (4)' },
        ],
      });
      expect(mockLabelFormatter).toHaveBeenCalledWith({ id: 3, name: 'Item 3' });
      expect(mockLabelFormatter).toHaveBeenCalledWith({ id: 4, name: 'Item 4' });
    });

    it('should handle errors gracefully when getByIdsEndpoint fails', async () => {
      mockGetByIdsEndpoint.mockRejectedValue(new Error('API Error'));

      const { result } = setup();

      await expect(
        act(async () => {
          await result.current.fetchOptionsByIds([3, 4]);
        }),
      ).rejects.toThrow('API Error');
      expect(mockGetByIdsEndpoint).toHaveBeenCalledWith({ ids: [3, 4] });
    });
  });
});

import { ApiClient } from '@/ApiClient';
import {
  ESubscriptionPlan,
  ESubscriptionStatus,
  GetAccountByIdResponseDto,
  GetAccountBySlugResponseDto,
  GetAccountBySlugResponseDtoAccountDto,
  GetAllProductsResponseDto,
  GetAllVisitsResponseDto,
  GetCustomerPortalDetailsResponseDto,
  GetSchedulingDetailsResponseDto,
  GetTechnicianVisitDetailsResponseDto,
  GetUsersResponseDto,
  GetVisitsByDateAndNearbyDatesResponseDto,
} from '@/generated/api-client';
import { AxiosResponse } from 'axios';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { useFetcher } from '@Hooks/useFetcher';

// Mock the useAlert hook
const setAlertMock = vi.fn();

vi.mock('../../components/Alert', () => ({
  useAlert: () => ({
    setAlert: setAlertMock,
  }),
  AlertProvider: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

// Mock the ApiClient methods
vi.mock('@/ApiClient', () => ({
  ApiClient: {
    user: {
      getUsers: vi.fn(),
    },
    product: {
      getAll: vi.fn(),
    },
    account: {
      getAll: vi.fn(),
      getBySlug: vi.fn(),
      getAccountSettings: vi.fn(),
      getDomainAuthenticationDetails: vi.fn(),
      fetchAccountSettings: vi.fn(),
    },
    storage: {
      getAccountSettingsBlobSasToken: vi.fn(),
    },
    service: {
      getAll: vi.fn(),
    },
    program: {
      getAll: vi.fn(),
    },
    customer: {
      getAll: vi.fn(),
      getCustomerPortalDetails: vi.fn(),
      getCustomerIdByEmail: vi.fn(),
    },
    property: {
      getAll: vi.fn(),
    },
    visit: {
      getAll: vi.fn(),
      getUnscheduledVisitsSummary: vi.fn(),
      getTechnicianToday: vi.fn(),
      getTechnicianVisitDetails: vi.fn(),
      getSchedulingDetails: vi.fn(),
      getGroupedByDateAndNearby: vi.fn(),
    },
  },
}));

describe('useFetcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchUsers', () => {
    it('should return data when ApiClient.user.getUsers succeeds', async () => {
      const mockData = { users: [{ id: 1, name: 'John Doe' }] } as unknown as GetUsersResponseDto;
      vi.mocked(ApiClient.user.getUsers).mockResolvedValue({ data: mockData } as AxiosResponse<GetUsersResponseDto>);

      const { result } = renderHook(() => useFetcher());

      const data = await act(async () => result.current.fetchUsers({}));

      expect(data).toEqual(mockData);
      expect(ApiClient.user.getUsers).toHaveBeenCalledWith({});
      expect(setAlertMock).not.toHaveBeenCalled();
    });

    it('should handle errors and call setAlert when ApiClient.user.getUsers fails', async () => {
      vi.mocked(ApiClient.user.getUsers).mockRejectedValue(new Error('API Error'));

      const { result } = renderHook(() => useFetcher());

      const data = await act(async () => result.current.fetchUsers({}));

      expect(data).toBeUndefined();
      expect(ApiClient.user.getUsers).toHaveBeenCalledWith({});
      expect(setAlertMock).toHaveBeenCalledWith('Failed to fetch users', 'error');
    });
  });

  describe('fetchAllProducts', () => {
    it('should return data when ApiClient.product.getAll succeeds', async () => {
      const mockData = { products: [{ id: 1, name: 'Product A' }] } as unknown as GetAllProductsResponseDto;
      vi.mocked(ApiClient.product.getAll).mockResolvedValue({
        data: mockData,
      } as AxiosResponse<GetAllProductsResponseDto>);

      const { result } = renderHook(() => useFetcher());

      const data = await act(async () => result.current.fetchAllProducts({}));

      expect(data).toEqual(mockData);
      expect(ApiClient.product.getAll).toHaveBeenCalledWith({});
      expect(setAlertMock).not.toHaveBeenCalled();
    });

    it('should handle errors and call setAlert when ApiClient.product.getAll fails', async () => {
      vi.mocked(ApiClient.product.getAll).mockRejectedValue(new Error('API Error'));

      const { result } = renderHook(() => useFetcher());

      const data = await act(async () => result.current.fetchAllProducts({}));

      expect(data).toBeUndefined();
      expect(ApiClient.product.getAll).toHaveBeenCalledWith({});
      expect(setAlertMock).toHaveBeenCalledWith('Failed to fetch all products', 'error');
    });
  });

  describe('fetchAccountBySlug', () => {
    it('should return data when ApiClient.account.getBySlug succeeds', async () => {
      const mockData = { id: 1, name: 'Account A' } as unknown as GetAccountBySlugResponseDtoAccountDto;
      vi.mocked(ApiClient.account.getBySlug).mockResolvedValue({
        data: mockData,
      } as unknown as AxiosResponse<GetAccountBySlugResponseDto>);

      const { result } = renderHook(() => useFetcher());

      const data = await act(async () => result.current.fetchAccountBySlug('valid-slug'));

      expect(data).toEqual(mockData);
      expect(ApiClient.account.getBySlug).toHaveBeenCalledWith({ slug: 'valid-slug' });
      expect(setAlertMock).not.toHaveBeenCalled();
    });

    it('should handle errors and call setAlert when slug is invalid', async () => {
      const { result } = renderHook(() => useFetcher());

      const data = await act(async () => result.current.fetchAccountBySlug('invalid-slug'));

      expect(data).toBeUndefined();
      expect(ApiClient.account.getBySlug).not.toHaveBeenCalled();
      expect(setAlertMock).toHaveBeenCalledWith('Failed to fetch account', 'error');
    });

    it('should handle API errors and call setAlert', async () => {
      vi.mocked(ApiClient.account.getBySlug).mockRejectedValue(new Error('API Error'));

      const { result } = renderHook(() => useFetcher());

      const data = await act(async () => result.current.fetchAccountBySlug('valid-slug'));

      expect(data).toBeUndefined();
      expect(ApiClient.account.getBySlug).toHaveBeenCalledWith({ slug: 'valid-slug' });
      expect(setAlertMock).toHaveBeenCalledWith('Failed to fetch account', 'error');
    });
  });

  describe('fetchCustomerPortalDetails', () => {
    it('should return data when ApiClient.customer.getCustomerPortalDetails succeeds', async () => {
      const mockData = { portalUrl: 'https://portal.example.com' } as unknown as GetCustomerPortalDetailsResponseDto;
      vi.mocked(ApiClient.customer.getCustomerPortalDetails).mockResolvedValue({
        data: mockData,
      } as AxiosResponse<GetCustomerPortalDetailsResponseDto>);

      const { result } = renderHook(() => useFetcher());

      const data = await act(async () => result.current.fetchCustomerPortalDetails('customer-id'));

      expect(data).toEqual(mockData);
      expect(ApiClient.customer.getCustomerPortalDetails).toHaveBeenCalledWith('customer-id');
      expect(setAlertMock).not.toHaveBeenCalled();
    });

    it('should return undefined and not call API when id is null', async () => {
      const { result } = renderHook(() => useFetcher());

      const data = await act(async () => result.current.fetchCustomerPortalDetails(null));

      expect(data).toBeUndefined();
      expect(ApiClient.customer.getCustomerPortalDetails).not.toHaveBeenCalled();
      expect(setAlertMock).not.toHaveBeenCalled();
    });

    it('should handle API errors and call setAlert', async () => {
      vi.mocked(ApiClient.customer.getCustomerPortalDetails).mockRejectedValue(new Error('API Error'));

      const { result } = renderHook(() => useFetcher());

      const data = await act(async () => result.current.fetchCustomerPortalDetails('customer-id'));

      expect(data).toBeUndefined();
      expect(ApiClient.customer.getCustomerPortalDetails).toHaveBeenCalledWith('customer-id');
      expect(setAlertMock).toHaveBeenCalledWith('Failed to get the customer portal details', 'error');
    });
  });

  describe('fetchTechnicianVisitDetails', () => {
    it('should return data when ApiClient.visit.getTechnicianVisitDetails succeeds', async () => {
      const mockData = {
        visitId: 'visit-123',
        details: 'Visit Details',
      } as unknown as GetTechnicianVisitDetailsResponseDto;
      vi.mocked(ApiClient.visit.getTechnicianVisitDetails).mockResolvedValue({
        data: mockData,
      } as AxiosResponse<GetTechnicianVisitDetailsResponseDto>);

      const { result } = renderHook(() => useFetcher());

      const data = await act(async () => result.current.fetchTechnicianVisitDetails('visit-123'));

      expect(data).toEqual(mockData);
      expect(ApiClient.visit.getTechnicianVisitDetails).toHaveBeenCalledWith('visit-123');
      expect(setAlertMock).not.toHaveBeenCalled();
    });

    it('should handle API errors and call setAlert', async () => {
      vi.mocked(ApiClient.visit.getTechnicianVisitDetails).mockRejectedValue(new Error('API Error'));

      const { result } = renderHook(() => useFetcher());

      const data = await act(async () => result.current.fetchTechnicianVisitDetails('visit-123'));

      expect(data).toBeUndefined();
      expect(ApiClient.visit.getTechnicianVisitDetails).toHaveBeenCalledWith('visit-123');
      expect(setAlertMock).toHaveBeenCalledWith('Failed to fetch visit details', 'error');
    });
  });

  describe('fetchVisitsGroupedByDateAndNearby', () => {
    it('should return data when ApiClient.visit.getGroupedByDateAndNearby succeeds', async () => {
      const mockData: GetVisitsByDateAndNearbyDatesResponseDto = {
        groupedVisits: [
          {
            properties: [],
            date: '2022-01-01',
          },
        ],
      };
      vi.mocked(ApiClient.visit.getGroupedByDateAndNearby).mockResolvedValue({
        data: mockData,
      } as AxiosResponse<GetVisitsByDateAndNearbyDatesResponseDto>);

      const { result } = renderHook(() => useFetcher());

      const data = await act(async () =>
        result.current.fetchVisitsGroupedByDateAndNearby({ date: '2022-01-01', technicianId: -1 }),
      );

      expect(data).toEqual(mockData);
      expect(ApiClient.visit.getGroupedByDateAndNearby).toHaveBeenCalledWith({ date: '2022-01-01' });
      expect(setAlertMock).not.toHaveBeenCalled();
    });

    it('should handle API errors and call setAlert', async () => {
      vi.mocked(ApiClient.visit.getGroupedByDateAndNearby).mockRejectedValue(new Error('API Error'));

      const { result } = renderHook(() => useFetcher());

      const data = await act(async () =>
        result.current.fetchVisitsGroupedByDateAndNearby({ date: '2022-01-01', technicianId: -1 }),
      );

      expect(data).toBeUndefined();
      expect(ApiClient.visit.getGroupedByDateAndNearby).toHaveBeenCalledWith({ date: '2022-01-01' });
      expect(setAlertMock).toHaveBeenCalledWith('Failed to fetch the grouped visits', 'error');
    });
  });

  describe('fetchSchedulingDetails', () => {
    it('should return data when ApiClient.visit.getSchedulingDetails succeeds', async () => {
      const mockData: GetSchedulingDetailsResponseDto = {
        propertyCount: 1,
        squareFootage: 1000,
        services: [],
        applicationTypes: [],
        productsNeeded: [],
      };
      vi.mocked(ApiClient.visit.getSchedulingDetails).mockResolvedValue({
        data: mockData,
      } as AxiosResponse<GetSchedulingDetailsResponseDto>);

      const { result } = renderHook(() => useFetcher());

      const data = await act(async () =>
        result.current.fetchSchedulingDetails({ date: '2022-01-01', technicianId: -1 }),
      );

      expect(data).toEqual(mockData);
      expect(ApiClient.visit.getSchedulingDetails).toHaveBeenCalledWith({ date: '2022-01-01' });
      expect(setAlertMock).not.toHaveBeenCalled();
    });

    it('should handle API errors and call setAlert', async () => {
      vi.mocked(ApiClient.visit.getSchedulingDetails).mockRejectedValue(new Error('API Error'));

      const { result } = renderHook(() => useFetcher());

      const data = await act(async () =>
        result.current.fetchSchedulingDetails({ date: '2022-01-01', technicianId: -1 }),
      );

      expect(data).toBeUndefined();
      expect(ApiClient.visit.getSchedulingDetails).toHaveBeenCalledWith({ date: '2022-01-01' });
      expect(setAlertMock).toHaveBeenCalledWith('Failed to fetch scheduling details', 'error');
    });
  });

  describe('fetchTechnicianTodayVisits', () => {
    it('should return data when ApiClient.visit.getTechnicianToday succeeds', async () => {
      const mockData: GetAllVisitsResponseDto = {
        data: [],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: 25,
          totalPages: 1,
          currentPage: 1,
        },
      };
      vi.mocked(ApiClient.visit.getTechnicianToday).mockResolvedValue({
        data: mockData,
      } as AxiosResponse<GetAllVisitsResponseDto>);

      const { result } = renderHook(() => useFetcher());

      const data = await act(async () => result.current.fetchTechnicianTodayVisits());

      expect(data).toEqual(mockData);
      expect(ApiClient.visit.getTechnicianToday).toHaveBeenCalledWith();
      expect(setAlertMock).not.toHaveBeenCalled();
    });

    it('should handle API errors and call setAlert', async () => {
      vi.mocked(ApiClient.visit.getTechnicianToday).mockRejectedValue(new Error('API Error'));

      const { result } = renderHook(() => useFetcher());

      const data = await act(async () => result.current.fetchTechnicianTodayVisits());

      expect(data).toBeUndefined();
      expect(ApiClient.visit.getTechnicianToday).toHaveBeenCalledWith();
      expect(setAlertMock).toHaveBeenCalledWith('Failed to fetch todays visits', 'error');
    });
  });

  describe('fetchAccountSettings', () => {
    it('should return data when ApiClient.visit.getAccountSettings succeeds', async () => {
      const mockData: GetAccountByIdResponseDto = {
        data: {
          id: 234,
          name: 'Account A',
          slug: 'account-a',
          logoUrl: 'https://logo.example.com',
          senderDomain: 'example.com',
          senderEmail: 'info@example.com',
          senderFromName: 'Example',
          senderDomainVerified: true,
          subscriptionPlan: ESubscriptionPlan.Starter,
          subscriptionStatus: ESubscriptionStatus.Active,
          minimumPricePerVisit: 50,
        },
      };
      vi.mocked(ApiClient.account.getAccountSettings).mockResolvedValue({
        data: mockData,
      } as AxiosResponse<GetAccountByIdResponseDto>);

      const { result } = renderHook(() => useFetcher());

      const data = await act(async () => result.current.fetchAccountSettings());

      expect(data).toEqual(mockData);
      expect(ApiClient.account.getAccountSettings).toHaveBeenCalledWith();
      expect(setAlertMock).not.toHaveBeenCalled();
    });

    it('should handle API errors and call setAlert', async () => {
      vi.mocked(ApiClient.account.getAccountSettings).mockRejectedValue(new Error('API Error'));

      const { result } = renderHook(() => useFetcher());

      const data = await act(async () => result.current.fetchAccountSettings());

      expect(data).toBeUndefined();
      expect(ApiClient.account.getAccountSettings).toHaveBeenCalledWith();
      expect(setAlertMock).toHaveBeenCalledWith('Failed to fetch account settings', 'error');
    });
  });
});

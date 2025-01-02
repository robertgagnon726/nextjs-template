import { ApiClient } from '@/ApiClient';
import { GetSchedulingDetailsRequestDto, QueryParamsRequestDto } from '@/generated/api-client';
import { usePathname } from 'next/navigation';
import { getAccountNameSlug } from '@/connected-components/PersistentDrawerLeft';
import { useAlert } from '@Components/Alert';

/**
 * Custom hook to fetch various data from the API.
 */
export const useFetcher = () => {
  const { setAlert } = useAlert();
  const pathname = usePathname();

  /**
   * Fetches users from the API
   */
  const fetchUsers = async (args: QueryParamsRequestDto) => {
    try {
      const response = await ApiClient.user.getUsers(args);

      return response.data;
    } catch (error) {
      setAlert('Failed to fetch users', 'error');
      return undefined;
    }
  };

  /**
   * Fetches all products from the API.
   */
  const fetchAllProducts = async (args: QueryParamsRequestDto) => {
    try {
      const response = await ApiClient.product.getAll(args);

      return response.data;
    } catch (error) {
      setAlert('Failed to fetch all products', 'error');
      return undefined;
    }
  };

  const fetchDomainAuthenticationDetails = async () => {
    try {
      const response = await ApiClient.account.getDomainAuthenticationDetails();

      return response.data;
    } catch (error) {
      setAlert('Failed to fetch the domain authentication details', 'error');
      return undefined;
    }
  };

  /**
   * Fetches all accounts from the API.
   */
  const fetchAllAccounts = async (args: QueryParamsRequestDto) => {
    try {
      const response = await ApiClient.account.getAll(args);

      return response.data;
    } catch (error) {
      setAlert('Failed to fetch all accounts', 'error');
      return undefined;
    }
  };

  /**
   * Fetches account by slug.
   */
  const fetchAccountBySlug = async (slug: string) => {
    try {
      if (typeof slug !== 'string') {
        throw new Error('Invalid slug');
      }
      const response = await ApiClient.account.getBySlug({ slug });

      return response.data;
    } catch (error) {
      setAlert('Failed to fetch account', 'error');
      return undefined;
    }
  };

  const fetchAccountSubscriptionDetails = async () => {
    try {
      const slug = getAccountNameSlug(pathname);
      if (slug === 'admin') return;
      const response = await ApiClient.billing.getAccountSubscriptionDetails();

      return response.data;
    } catch (error) {
      setAlert('Failed to fetch account subscription details', 'error');
      return undefined;
    }
  };

  const fetchAccountById = async (id: number) => {
    try {
      const response = await ApiClient.account.getById({ id });

      return response.data;
    } catch (error) {
      setAlert('Failed to fetch account', 'error');
      return undefined;
    }
  };

  const fetchAccountSettings = async () => {
    try {
      const response = await ApiClient.account.getAccountSettings();

      return response.data;
    } catch (error) {
      setAlert('Failed to fetch account settings', 'error');
      return undefined;
    }
  };

  const fetchAccountSettingsSasToken = async () => {
    try {
      const response = await ApiClient.storage.getAccountSettingsBlobSasToken();

      return response.data;
    } catch (error) {
      setAlert('Failed to fetch account settings', 'error');
      return undefined;
    }
  };

  /**
   * Fetches all services from the API.
   * @throws Will set an alert with an error message if the fetch operation fails.
   */
  const fetchAllServices = async (args: QueryParamsRequestDto) => {
    try {
      const response = await ApiClient.service.getAll(args);

      return response.data;
    } catch (error) {
      setAlert('Failed to fetch all services', 'error');
      return undefined;
    }
  };

  /**
   * Fetches all programs from the API.
   */
  const fetchAllPrograms = async (args: QueryParamsRequestDto) => {
    try {
      const response = await ApiClient.program.getAll(args);

      return response.data;
    } catch (error) {
      setAlert('Failed to fetch all programs', 'error');
      return undefined;
    }
  };

  /**
   * Fetches all customers from the API.
   */
  const fetchAllCustomers = async (args: QueryParamsRequestDto) => {
    try {
      const response = await ApiClient.customer.getAll(args);

      return response.data;
    } catch (error) {
      setAlert('Failed to fetch all customers', 'error');
      return undefined;
    }
  };

  /**
   * Fetches the customer portal details for a given customer ID.
   * @throws Will set an alert and return undefined if the API call fails.
   */
  const fetchCustomerPortalDetails = async (id: string | null | undefined) => {
    try {
      if (!id) {
        return undefined;
      }
      const response = await ApiClient.customer.getCustomerPortalDetails(id);

      return response.data;
    } catch (error) {
      setAlert('Failed to get the customer portal details', 'error');
      return undefined;
    }
  };

  /**
   * Fetches the customer ID associated with the given email.
   *
   * @throws Will set an alert with an error message if the fetch operation fails.
   */
  const fetchCustomerIdByEmail = async (email: string | null | undefined) => {
    try {
      if (!email) {
        return undefined;
      }
      const response = await ApiClient.customer.getCustomerIdByEmail({ email });

      return response.data;
    } catch (error) {
      setAlert('Failed to get your customer id', 'error');
      return undefined;
    }
  };

  /**
   * Fetches all properties from the API.
   *
   * @throws Will set an alert with an error message if the fetch operation fails.
   */
  const fetchAllProperties = async (args: QueryParamsRequestDto) => {
    try {
      const response = await ApiClient.property.getAll(args);

      return response.data;
    } catch (error) {
      setAlert('Failed to fetch all properties', 'error');
      return undefined;
    }
  };

  /**
   * Fetches prospects from the API.
   *
   * @throws Will set an alert with an error message if the fetch operation fails.
   */
  const fetchAllProspects = async (args: QueryParamsRequestDto) => {
    try {
      const response = await ApiClient.prospect.get(args);

      return response.data;
    } catch (error) {
      setAlert('Failed to fetch prospects', 'error');
      return undefined;
    }
  };

  const fetchAllQuotes = async (args: QueryParamsRequestDto) => {
    try {
      const response = await ApiClient.quote.get(args);

      return response.data;
    } catch (error) {
      setAlert('Failed to fetch quotes', 'error');
      return undefined;
    }
  };

  const fetchQuoteById = async (id: string) => {
    try {
      const numberId = Number(id);
      if (isNaN(numberId)) {
        throw new Error('Invalid quote ID');
      }
      const response = await ApiClient.quote.getById({ id: numberId });

      return response.data;
    } catch (error) {
      setAlert('Failed to fetch quote details', 'error');
      return undefined;
    }
  };

  const fetchQuotesForCustomerPortal = async (customerId?: number) => {
    try {
      if (!customerId) {
        throw new Error('Invalid customer ID');
      }
      const response = await ApiClient.quote.getCustomerPortalQuotes({ customerId });

      return response.data;
    } catch (error) {
      setAlert('Failed to fetch quotes', 'error');
      return undefined;
    }
  };

  const fetchInvoicesForCustomerPortal = async (customerId?: number) => {
    try {
      if (!customerId) {
        throw new Error('Invalid customer ID');
      }
      const response = await ApiClient.billing.getInvoices({ customerId });

      return response.data;
    } catch (error) {
      setAlert('Failed to fetch invoices', 'error');
      return undefined;
    }
  };

  /**
   * Fetches all visits based on the provided filters.
   *
   * @throws Will set an alert if the fetch operation fails.
   */
  const fetchAllVisits = async (args: QueryParamsRequestDto) => {
    try {
      const response = await ApiClient.visit.getAll(args);

      return response.data;
    } catch (error) {
      setAlert('Failed to fetch all visits', 'error');
      return undefined;
    }
  };

  /**
   * Fetches the metadata and visits for a property that currently has unscheduled visits.
   *
   * @throws Will set an alert if the fetch operation fails.
   */
  const fetchUnscheduledVisitsSummary = async () => {
    try {
      const response = await ApiClient.visit.getUnscheduledVisitsSummary();

      return response.data;
    } catch (error) {
      setAlert('Failed to fetch the unscheduled visits summary', 'error');
      return undefined;
    }
  };

  /**
   * Fetches the technician's visits for today.
   *
   * This function makes an asynchronous call to the API to retrieve the
   * technician's visits for the current day. If the call is successful,
   * it returns the data from the response. If the call fails, it sets an
   * alert with an error message and returns undefined.
   *
   */
  const fetchTechnicianTodayVisits = async () => {
    try {
      const response = await ApiClient.visit.getTechnicianToday();

      return response.data;
    } catch (error) {
      setAlert('Failed to fetch todays visits', 'error');
      return undefined;
    }
  };

  /**
   * Fetches the details of a technician visit by its ID.
   *
   * @throws Will set an alert with an error message if the fetch operation fails.
   */
  const fetchTechnicianVisitDetails = async (visitId: string) => {
    try {
      const response = await ApiClient.visit.getTechnicianVisitDetails(visitId);

      return response.data;
    } catch (error) {
      setAlert('Failed to fetch visit details', 'error');
      return undefined;
    }
  };

  /**
   * Fetches scheduling details using the provided request DTO.
   *
   * @throws Will set an alert with an error message if the fetch operation fails.
   */
  const fetchSchedulingDetails = async (dto: GetSchedulingDetailsRequestDto) => {
    try {
      if (dto.technicianId <= 0) {
        return undefined;
      }
      const response = await ApiClient.visit.getSchedulingDetails(dto);

      return response.data;
    } catch (error) {
      setAlert('Failed to fetch scheduling details', 'error');
      return undefined;
    }
  };

  /**
   * Fetches visits grouped by date and nearby locations.
   * @throws Will set an alert if the fetch operation fails.
   */
  const fetchVisitsGroupedByDateAndNearby = async (dto: GetSchedulingDetailsRequestDto) => {
    try {
      if (dto.technicianId <= 0) {
        return undefined;
      }
      const response = await ApiClient.visit.getGroupedByDateAndNearby(dto);

      return response.data;
    } catch (error) {
      setAlert('Failed to fetch the grouped visits', 'error');
      return undefined;
    }
  };

  return {
    fetchAllProducts,
    fetchAllServices,
    fetchAllAccounts,
    fetchAccountBySlug,
    fetchAllPrograms,
    fetchAllCustomers,
    fetchCustomerPortalDetails,
    fetchAllProperties,
    fetchAllVisits,
    fetchSchedulingDetails,
    fetchUsers,
    fetchTechnicianTodayVisits,
    fetchTechnicianVisitDetails,
    fetchCustomerIdByEmail,
    fetchUnscheduledVisitsSummary,
    fetchVisitsGroupedByDateAndNearby,
    fetchAccountSettings,
    fetchQuotesForCustomerPortal,
    fetchAccountSettingsSasToken,
    fetchDomainAuthenticationDetails,
    fetchAccountById,
    fetchAllProspects,
    fetchAllQuotes,
    fetchQuoteById,
    fetchAccountSubscriptionDetails,
    fetchInvoicesForCustomerPortal,
  };
};

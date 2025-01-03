import axios from 'axios';

import Cookies from 'js-cookie';

export const axiosInstance = axios.create();

// Interceptor to add the Authorization header to each request
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get('access_token');

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor to handle responses and retry on 401 errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the request failed with a 401 Unauthorized error
    if (error.response && error.response.status === 401) {
      const account = window.location.pathname.split('/')[1];
      try {
        Cookies.remove('access_token');
        window.location.href = `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/${account}/login`;
      } catch {
        window.location.href = `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/${account}/login`;
      }
    }

    // If the request failed with a 403 Unauthorized error
    // Note - duplicating this as 403 and 401 will be handled differently. 401 will invoke a token refresh if available
    if (error.response && error.response.status === 403) {
      const account = window.location.pathname.split('/')[1];
      try {
        Cookies.remove('access_token');
        window.location.href = `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/${account}/login`;
      } catch {
        window.location.href = `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/${account}/login`;
      }
    }

    return Promise.reject(error);
  },
);

// const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// export const ApiClientConfig = new Configuration({
//   basePath: baseUrl,
// });

export const ApiClient = {
  // account: AccountApiFactory(ApiClientConfig, baseUrl, axiosInstance),
  // auth: AuthApiFactory(ApiClientConfig, baseUrl, axiosInstance),
  // billing: BillingApiFactory(ApiClientConfig, baseUrl, axiosInstance),
  // customer: CustomerApiFactory(ApiClientConfig, baseUrl, axiosInstance),
  // product: ProductApiFactory(ApiClientConfig, baseUrl, axiosInstance),
  // program: ProgramApiFactory(ApiClientConfig, baseUrl, axiosInstance),
  // service: ServiceApiFactory(ApiClientConfig, baseUrl, axiosInstance),
  // storage: StorageApiFactory(ApiClientConfig, baseUrl, axiosInstance),
  // property: PropertyApiFactory(ApiClientConfig, baseUrl, axiosInstance),
  // prospect: ProspectApiFactory(ApiClientConfig, baseUrl, axiosInstance),
  // quote: QuoteApiFactory(ApiClientConfig, baseUrl, axiosInstance),
  // user: UserApiFactory(ApiClientConfig, baseUrl, axiosInstance),
  // validation: ValidationApiFactory(ApiClientConfig, baseUrl, axiosInstance),
  // visit: VisitApiFactory(ApiClientConfig, baseUrl, axiosInstance),
};

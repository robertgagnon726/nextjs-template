import { ApiClient } from '@/ApiClient';

/**
 * A helper type that extracts method names from an API factory.
 */
type ApiMethods<T> = T extends { [key: string]: (...args: unknown[]) => unknown }
  ? {
      [M in keyof T]?: (...args: unknown[]) => string;
    }
  : never;

/**
 * Map each controller in `ApiClient` to a set of endpoints (methods),
 * each represented by either a static key or a function.
 */
type StructuredStore = {
  [K in keyof typeof ApiClient]: ApiMethods<(typeof ApiClient)[K]>;
};

export const swrKeyStore: StructuredStore = {
  account: {
    getAll: () => 'account/getAll',
    getAccountSettings: () => 'account/getAccountSettings',
    update: () => 'account/update',
    add: () => 'account/add',
    getBySlug: (slug: string) => `account/getBySlug?slug=${encodeURIComponent(slug)}`,
  },
  auth: {},
  customer: {},
  product: {},
  program: {},
  service: {},
  storage: {},
  property: {},
  prospect: {},
  quote: {},
  user: {},
  visit: {},
  billing: {},
  validation: {},
};

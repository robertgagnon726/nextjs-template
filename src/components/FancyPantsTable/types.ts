// import { ESortOrder, Filter } from '@/generated/api-client';
import { AxiosPromise } from 'axios';
import { Dispatch, ReactNode, SetStateAction } from 'react';

export interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export interface FilterSortProps {
  filterEndpoint?: () => AxiosPromise<unknown>;
  // initialFilters?: Filter[]; // TODO FIX ME
  initialFilters?: unknown[];
  initialSortBy?: string;
  // initialSortOrder?: ESortOrder; // TODO FIX ME
  initialSortOrder?: unknown;
  // onFiltersApplied?: (filters: Filter[], sortBy: string, sortOrder: ESortOrder) => void;   // TODO FIX ME
  onFiltersApplied?: (filters: unknown[], sortBy: string, sortOrder: unknown) => void;
}

export interface SelectAction<T> {
  label: string;
  onClick: (rows: T[]) => void;
  icon: ReactNode;
}

export interface Identifiable {
  id: string | number;
}

export type FancyPantsTableColumn<T> = {
  [K in keyof T]: {
    label: string;
    key: K;
    align?: 'left' | 'right';
    tooltip?: string;
    render?: (value: T[K], row: T) => ReactNode | string;
  };
}[keyof T];

interface FancyPantsTablePropsBase<T extends Identifiable> {
  rows?: T[];
  columns: FancyPantsTableColumn<T>[];
  title?: string;
  renderActions?: (row: T) => ReactNode;
  renderExpandedContent?: (row: T) => ReactNode;
  size?: 'small';
  emptyStateMessage: string;
  selected?: T[];
  setSelected?: Dispatch<SetStateAction<T[]>>;
  filterSort?: FilterSortProps;
  pagination?: PaginationProps;
  onRowClick?: (row: T) => void;
}

// Variant without selection
interface FancyPantsTablePropsWithoutSelection<T extends Identifiable> extends FancyPantsTablePropsBase<T> {
  selectActions?: never;
  selectableGateFieldName?: never;
}

// Variant with selection
interface FancyPantsTablePropsWithSelection<T extends Identifiable> extends FancyPantsTablePropsBase<T> {
  selectActions: SelectAction<T>[];
  selectableGateFieldName: keyof T;
}

// Union type that combines both variants
export type FancyPantsTableProps<T extends Identifiable> =
  | FancyPantsTablePropsWithSelection<T>
  | FancyPantsTablePropsWithoutSelection<T>;

import { EFilterOperator } from '@/models/EFilterOperator';

export interface Filter {
  /**
   *
   * @type {string}
   * @memberof Filter
   */
  field: string;
  /**
   *
   * @type {EFilterOperator}
   * @memberof Filter
   */
  operator: EFilterOperator;
  /**
   *
   * @type {Any}
   * @memberof Filter
   */
  value: any;
}

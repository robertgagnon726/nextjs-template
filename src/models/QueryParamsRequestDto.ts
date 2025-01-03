import { ESortOrder } from '@/models/ESortOrder';
import { Filter } from '@/models/Filter';

export interface QueryParamsRequestDto {
  /**
   *
   * @type {number}
   * @memberof QueryParamsRequestDto
   */
  page?: number;
  /**
   *
   * @type {number}
   * @memberof QueryParamsRequestDto
   */
  limit?: number;
  /**
   *
   * @type {string}
   * @memberof QueryParamsRequestDto
   */
  sortBy?: string;
  /**
   *
   * @type {ESortOrder}
   * @memberof QueryParamsRequestDto
   */
  sortOrder?: ESortOrder;
  /**
   *
   * @type {Array<Filter>}
   * @memberof QueryParamsRequestDto
   */
  filters?: Array<Filter>;
}

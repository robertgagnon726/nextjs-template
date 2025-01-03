import { EFilterOperator } from '@/models/EFilterOperator';
import { EFilterType } from '@/models/EFilterType';

export interface FilterMetadataDto {
  /**
   *
   * @type {string}
   * @memberof FilterMetadataDto
   */
  field: string;
  /**
   *
   * @type {string}
   * @memberof FilterMetadataDto
   */
  label: string;
  /**
   *
   * @type {EFilterOperator}
   * @memberof FilterMetadataDto
   */
  operator: EFilterOperator;
  /**
   *
   * @type {EFilterType}
   * @memberof FilterMetadataDto
   */
  type: EFilterType;
  /**
   * Available options if filter type is SELECT
   * @type {Array<string>}
   * @memberof FilterMetadataDto
   */
  options?: Array<string>;
}

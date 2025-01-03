import { FilterMetadataDto } from '@/models/FilterMetaDataDto';
import { SortOptionDto } from '@/models/SortOptionDto';

export interface FilterSortOptionsResponseDto {
  /**
   * Metadata for available filters
   * @type {Array<FilterMetadataDto>}
   * @memberof FilterSortOptionsResponseDto
   */
  availableFilters?: Array<FilterMetadataDto>;
  /**
   * Sort options available for this entity
   * @type {Array<SortOptionDto>}
   * @memberof FilterSortOptionsResponseDto
   */
  availableSortOptions?: Array<SortOptionDto>;
}

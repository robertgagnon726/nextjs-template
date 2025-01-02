// import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
// import {
//   Drawer,
//   Button,
//   TextField,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Select,
//   Typography,
//   Box,
//   SelectChangeEvent,
// } from '@mui/material';
// // import {
// //   EFilterOperator,
// //   ESortOrder,
// //   Filter,
// //   FilterMetadataDto,
// //   FilterSortOptionsResponseDto,
// //   SortOptionDto,
// // } from '@/generated/api-client';
// import { AxiosPromise } from 'axios';
// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// interface FilterSortDrawerProps<T> {
//   isOpen: boolean;
//   onClose: () => void;
//   onApply: (filters: Filter[], sortBy: string, sortOrder: ESortOrder) => void;
//   endpoint: () => AxiosPromise<T>;
//   initialFilters: Filter[];
//   initialSortBy: string;
//   initialSortOrder: ESortOrder;
// }

// export const FilterSortDrawer = <T extends FilterSortOptionsResponseDto>({
//   isOpen,
//   onClose,
//   onApply,
//   endpoint,
//   initialFilters,
//   initialSortBy,
//   initialSortOrder,
// }: FilterSortDrawerProps<T>) => {
//   const [filtersMetadata, setFiltersMetadata] = useState<FilterMetadataDto[]>([]);
//   const [sortOptions, setSortOptions] = useState<SortOptionDto[]>([]);
//   const [selectedFilters, setSelectedFilters] = useState<Record<string, Filter>>({});
//   const [sortBy, setSortBy] = useState<string>('');
//   const [sortOrder, setSortOrder] = useState<ESortOrder>(ESortOrder.Asc);

//   useEffect(() => {
//     const fetchFilters = async () => {
//       const response = await endpoint();
//       if (response.data.availableFilters) setFiltersMetadata(response.data.availableFilters);
//       if (response.data.availableSortOptions) setSortOptions(response.data.availableSortOptions);
//     };
//     if (isOpen) {
//       fetchFilters();
//       // Initialize local state from initial values when the drawer is opened
//       const initialSelectedFilters: Record<string, Filter> = {};
//       initialFilters.forEach((filter) => {
//         initialSelectedFilters[filter.field] = filter;
//       });
//       setSelectedFilters(initialSelectedFilters);
//       setSortBy(initialSortBy);
//       setSortOrder(initialSortOrder);
//     }
//   }, [isOpen, endpoint, initialFilters, initialSortBy, initialSortOrder]);

//   const handleFilterChange = useCallback(
//     (field: string, operator: EFilterOperator) =>
//       (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<any>) => {
//         setSelectedFilters((prev) => ({
//           ...prev,
//           [field]: {
//             field,
//             operator,
//             value: e.target.value,
//           },
//         }));
//       },
//     [],
//   );

//   const handleDateFilterChange = useCallback(
//     (field: string, operator: EFilterOperator, time: 'dayStart' | 'dayEnd') => (date: Date | null) => {
//       let filterRange = [null, null];
//       const currentValues = selectedFilters[field]?.value || [null, null];
//       if (time === 'dayStart') {
//         date?.setHours(0, 0, 0, 0);
//         filterRange = [date, currentValues[1]];
//       }
//       if (time === 'dayEnd') {
//         date?.setHours(23, 59, 59, 999);
//         filterRange = [currentValues[0], date];
//       }

//       setSelectedFilters((prev) => ({
//         ...prev,
//         [field]: {
//           field,
//           operator,
//           value: filterRange,
//         },
//       }));
//     },
//     [selectedFilters],
//   );

//   const handleApply = useCallback(() => {
//     const filtersArray: Filter[] = Object.values(selectedFilters).map((value) => {
//       let formattedValue = value.value;

//       if (Array.isArray(value.value)) {
//         formattedValue = value.value.map((val) => {
//           if (val instanceof Date) {
//             return val.toISOString();
//           }
//           return val;
//         });
//       } else if (value.value instanceof Date) {
//         formattedValue = value.value.toISOString();
//       }

//       return {
//         field: value.field,
//         operator: value.operator,
//         value: formattedValue,
//       };
//     });
//     onApply(filtersArray, sortBy, sortOrder);
//   }, [onApply, selectedFilters, sortBy, sortOrder]);

//   const handleClear = useCallback(() => {
//     onApply([], '', ESortOrder.Asc);
//   }, [onApply]);

//   const handleSortOrderChange = useCallback((e: SelectChangeEvent<ESortOrder>) => {
//     setSortOrder(e.target.value as ESortOrder);
//   }, []);

//   const handleSortByChange = useCallback((e: SelectChangeEvent<string>) => {
//     setSortBy(e.target.value);
//   }, []);

//   return (
//     <Drawer anchor="right" open={isOpen} onClose={onClose} data-testid="filter-sort-drawer">
//       <Box sx={{ padding: '16px', width: '300px', display: 'flex', flexDirection: 'column', gap: 1 }}>
//         <Typography variant="h5" fontWeight={700} marginBottom={2}>
//           Filter & Sort
//         </Typography>
//         {filtersMetadata.map((filter, i) => (
//           <div key={filter.field}>
//             {filter.type === 'text' && (
//               <TextField
//                 data-testid={`filter-${filter.field}`}
//                 label={filter.label}
//                 onChange={handleFilterChange(filter.field, filter.operator)}
//                 fullWidth
//                 value={selectedFilters[filter.field]?.value || ''}
//               />
//             )}
//             {filter.type === 'number' && (
//               <TextField
//                 data-testid={`filter-${filter.field}`}
//                 label={filter.label}
//                 type="number"
//                 onChange={handleFilterChange(filter.field, filter.operator)}
//                 fullWidth
//                 value={selectedFilters[filter.field]?.value || ''}
//               />
//             )}
//             {filter.type === 'dateRange' && (
//               <LocalizationProvider dateAdapter={AdapterDateFns}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//                   <DatePicker
//                     data-testid={`filter-${filter.field}-start`}
//                     label={`${filter.label} Start`}
//                     value={
//                       selectedFilters[filter.field]?.value[0] ? new Date(selectedFilters[filter.field].value[0]) : null
//                     }
//                     onChange={handleDateFilterChange(filter.field, filter.operator, 'dayStart')}
//                   />
//                   <DatePicker
//                     data-testid={`filter-${filter.field}-end`}
//                     label={`${filter.label} End`}
//                     value={
//                       selectedFilters[filter.field]?.value[1] ? new Date(selectedFilters[filter.field].value[1]) : null
//                     }
//                     onChange={handleDateFilterChange(filter.field, filter.operator, 'dayEnd')}
//                   />
//                 </Box>
//               </LocalizationProvider>
//             )}
//             {filter.type === 'select' && (
//               <FormControl fullWidth>
//                 <InputLabel id={`${i}-${filter.field}-label`}>{filter.label}</InputLabel>
//                 <Select
//                   data-testid={`filter-${filter.field}`}
//                   labelId={`${i}-${filter.field}-label`}
//                   id={`${i}-${filter.field}`}
//                   label={filter.label}
//                   value={selectedFilters[filter.field]?.value || ''}
//                   onChange={handleFilterChange(filter.field, filter.operator)}
//                 >
//                   {filter.options?.map((option) => (
//                     <MenuItem key={option} value={option}>
//                       {option}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             )}
//           </div>
//         ))}
//         {sortOptions.length > 0 && (
//           <>
//             <FormControl fullWidth data-testid={'sort-by-dropdown'}>
//               <InputLabel id={'sort-by-label'}>Sort By</InputLabel>
//               <Select labelId={'sort-by-label'} label="Sort By" value={sortBy} onChange={handleSortByChange}>
//                 {sortOptions.map((sortOption, i) => (
//                   <MenuItem data-testid={`sort-by-option-${i}`} key={sortOption.field} value={sortOption.field}>
//                     {sortOption.label}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <FormControl fullWidth data-testid={'sort-order-dropdown'}>
//               <InputLabel id="sort-order-label">Sort Order</InputLabel>
//               <Select labelId="sort-order-label" label="Sort Order" value={sortOrder} onChange={handleSortOrderChange}>
//                 <MenuItem data-testid="sort-order-option-0" value={ESortOrder.Asc}>
//                   Ascending
//                 </MenuItem>
//                 <MenuItem data-testid="sort-order-option-1" value={ESortOrder.Desc}>
//                   Descending
//                 </MenuItem>
//               </Select>
//             </FormControl>
//           </>
//         )}

//         <Button variant="contained" color="primary" onClick={handleApply}>
//           Apply
//         </Button>
//         <Button variant="outlined" color="primary" onClick={handleClear}>
//           Clear
//         </Button>
//       </Box>
//     </Drawer>
//   );
// };

// TODO FIX ME

export {};

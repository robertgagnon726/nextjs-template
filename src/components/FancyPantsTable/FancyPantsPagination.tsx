import React, { useCallback } from 'react';
import { Pagination, Box } from '@mui/material';

interface FancyPantsPaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const FancyPantsPagination: React.FC<FancyPantsPaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleChange = useCallback(
    (_: React.ChangeEvent<unknown>, page: number) => {
      onPageChange(page);
    },
    [onPageChange],
  );

  return (
    <Box display="flex" justifyContent="center" my={2}>
      <Pagination count={totalPages} page={currentPage} onChange={handleChange} color="primary" />
    </Box>
  );
};

'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Collapse,
  Box,
  Checkbox,
  Toolbar,
  alpha,
  Tooltip,
  Pagination,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Fragment, useCallback, useState } from 'react';
import { v4 } from 'uuid';
import { Identifiable, SelectAction, FancyPantsTableColumn, FancyPantsTableProps } from './types';
// import { ESortOrder, Filter } from '@/generated/api-client';
// import { FilterSortDrawer } from './FilterSortDrawer';   // TODO FIX ME
import FilterListIcon from '@mui/icons-material/FilterList';

interface EnhancedTableToolbarProps<T> {
  selectedRows: T[];
  title?: string;
  selectActions: SelectAction<T>[];
  onOpenFilterDrawer?: () => void;
}

function EnhancedTableToolbar<T>({ selectedRows, title, selectActions }: EnhancedTableToolbarProps<T>) {
  const handleSelectActionClick = useCallback(
    (selectAction: SelectAction<T>) => () => {
      selectAction.onClick(selectedRows);
    },
    [selectedRows],
  );

  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        selectedRows.length > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {selectedRows.length > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
          {selectedRows.length} selected
        </Typography>
      ) : title ? (
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
          {title}
        </Typography>
      ) : null}
      {selectedRows.length > 0 &&
        selectActions.map((selectAction) => (
          <Tooltip key={selectAction.label} title={selectAction.label}>
            <IconButton onClick={handleSelectActionClick(selectAction)} data-testid="select-action">
              {selectAction.icon}
            </IconButton>
          </Tooltip>
        ))}
    </Toolbar>
  );
}

export function FancyPantsTable<T extends Identifiable>({
  rows,
  columns,
  title,
  renderActions,
  size,
  renderExpandedContent,
  emptyStateMessage,
  selectActions,
  selectableGateFieldName,
  selected,
  setSelected,
  filterSort,
  pagination,
  onRowClick,
}: FancyPantsTableProps<T>) {
  const [expandedRow, setExpandedRow] = useState<number | string | null>(null);
  const [internalSelected, internalSetSelected] = useState<T[]>([]);
  // TODO FIX ME
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [drawerOpen, setDrawerOpen] = useState(false);

  // TODO FIX ME
  // const handleApplyFilters = useCallback(
  //   // (filters: Filter[], sortBy: string, sortOrder: ESortOrder) => {   // TODO FIX ME
  //   (filters: unknown[], sortBy: string, sortOrder: unknown) => {
  //     if (filterSort?.onFiltersApplied) {
  //       filterSort.onFiltersApplied(filters, sortBy, sortOrder);
  //     }
  //     setDrawerOpen(false);
  //   },
  //   [filterSort],
  // );

  const _selected = selected ?? internalSelected;
  const _setSelected = setSelected ?? internalSetSelected;

  const toggleExpandRow = useCallback(
    (rowId: number | string) => {
      setExpandedRow(expandedRow === rowId ? null : rowId);
    },
    [expandedRow],
  );

  const handleToggleExpandRow = useCallback(
    (rowId: number | string) => () => {
      toggleExpandRow(rowId);
    },
    [toggleExpandRow],
  );

  const handleClick = useCallback(
    (row: T) => () => {
      const selectedIndex = _selected.indexOf(row);
      let newSelected: T[] = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(_selected, row);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(_selected.slice(1));
      } else if (selectedIndex === _selected.length - 1) {
        newSelected = newSelected.concat(_selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(_selected.slice(0, selectedIndex), _selected.slice(selectedIndex + 1));
      }
      _setSelected(newSelected);
    },
    [_selected, _setSelected],
  );

  const handleSelectAllClick = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked && selectableGateFieldName) {
        const newSelected = rows?.filter((r) => r[selectableGateFieldName]);
        if (newSelected) {
          _setSelected(newSelected);
        }

        return;
      }
      _setSelected([]);
    },
    [_setSelected, rows, selectableGateFieldName],
  );

  // Pagination change handler
  const handlePageChange = useCallback(
    (_: React.ChangeEvent<unknown>, page: number) => {
      if (pagination?.onPageChange) {
        pagination.onPageChange(page);
      }
    },
    [pagination],
  );

  // TODO FIX ME
  // const handleCloseDrawer = useCallback(() => {
  //   setDrawerOpen(false);
  // }, []);

  const handleOpenDrawer = useCallback(() => {
    setDrawerOpen(true);
  }, []);

  return (
    <TableContainer component={Paper} sx={{ padding: 1 }} elevation={0}>
      {selectActions ? (
        <EnhancedTableToolbar selectedRows={_selected} title={title} selectActions={selectActions} />
      ) : (
        <Box display="flex" justifyContent="space-between">
          <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
            {title}
          </Typography>
          {filterSort?.filterEndpoint && (
            <Tooltip title="Filter & Sort">
              <IconButton onClick={handleOpenDrawer} data-testid="open-filter-drawer">
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}

      {/*   // TODO FIX ME
      
      {filterSort?.filterEndpoint !== undefined &&
        filterSort?.initialFilters !== undefined &&
        filterSort?.initialSortBy !== undefined &&
        filterSort?.initialSortOrder !== undefined && (
          <FilterSortDrawer
            isOpen={drawerOpen}
            onClose={handleCloseDrawer}
            onApply={handleApplyFilters}
            endpoint={filterSort.filterEndpoint}
            initialFilters={filterSort.initialFilters}
            initialSortBy={filterSort.initialSortBy}
            initialSortOrder={filterSort.initialSortOrder}
          />
        )} */}
      <Table sx={{ minWidth: 650 }} aria-label="shared table" size={size}>
        <TableHead>
          <TableRow>
            {renderExpandedContent && <TableCell sx={{ maxWidth: '20px' }} />}
            {!!selectableGateFieldName && (
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={
                    _selected.length > 0 &&
                    rows &&
                    _selected.length < rows?.filter((r) => r[selectableGateFieldName])?.length
                  }
                  checked={
                    rows &&
                    rows?.filter((r) => r[selectableGateFieldName])?.length > 0 &&
                    _selected.length === rows?.filter((r) => r[selectableGateFieldName])?.length
                  }
                  onChange={handleSelectAllClick}
                  inputProps={{
                    'aria-label': 'select all',
                  }}
                  data-testid="select-all-checkbox"
                />
              </TableCell>
            )}

            {columns.map((column) => (
              <Tooltip
                key={v4()}
                arrow
                enterDelay={500}
                leaveDelay={200}
                placement="top"
                title={column.tooltip}
                disableHoverListener={!column.tooltip}
              >
                <TableCell align={column.align || 'left'}>{column.label}</TableCell>
              </Tooltip>
            ))}
            {renderActions && <TableCell align="right" />}
          </TableRow>
        </TableHead>
        {rows?.length === 0 ? (
          // Render empty state if no rows are available
          <TableBody>
            <EmptyMessageRow
              emptyStateMessage={emptyStateMessage}
              columns={columns}
              renderActions={renderActions !== undefined}
            />
          </TableBody>
        ) : (
          <TableBody>
            {rows?.map((row, index) => {
              const isItemSelected = _selected.includes(row);
              const labelId = `enhanced-table-checkbox-${index}`;
              return (
                <Fragment key={row.id}>
                  <TableRow
                    data-testid={'watable-row'}
                    hover={!!onRowClick}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    sx={{
                      cursor: onRowClick ? 'pointer' : 'default',
                    }}
                  >
                    {!!selectableGateFieldName && (
                      <TableCell padding="checkbox">
                        {!!row[selectableGateFieldName] && (
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClick(row)();
                            }}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                            data-testid={'select-checkbox'}
                          />
                        )}
                      </TableCell>
                    )}
                    {renderExpandedContent && (
                      <TableCell component="th" scope="row" sx={{ maxWidth: '20px' }}>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleExpandRow(row.id)();
                          }}
                          size="small"
                        >
                          {expandedRow === row.id ? (
                            <ExpandLessIcon data-testid="ExpandLessIcon" />
                          ) : (
                            <ExpandMoreIcon data-testid="ExpandMoreIcon" />
                          )}
                        </IconButton>
                      </TableCell>
                    )}
                    {columns.map((column) => {
                      const value = row[column.key];
                      return (
                        <Tooltip
                          key={v4()}
                          arrow
                          enterDelay={500}
                          leaveDelay={200}
                          placement="top"
                          title={column.tooltip}
                          disableHoverListener={!column.tooltip}
                        >
                          <TableCell key={`${column.label}-${v4()}`} align={column.align || 'left'}>
                            {column.render ? (
                              column.render(value, row)
                            ) : (
                              <Typography variant="body1" textAlign={column.align}>
                                {String(value)}
                              </Typography>
                            )}
                          </TableCell>
                        </Tooltip>
                      );
                    })}
                    {renderActions && <TableCell align="right">{renderActions(row)}</TableCell>}
                  </TableRow>
                  {renderExpandedContent && expandedRow === row.id && (
                    <TableRow>
                      <TableCell
                        colSpan={
                          columns.length + (renderActions ? 1 : 0) + (renderExpandedContent !== undefined ? 1 : 0)
                        }
                      >
                        <Collapse in={expandedRow === row.id} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1 }}>{renderExpandedContent(row)}</Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        )}
      </Table>
      {pagination && (
        <Box display="flex" justifyContent="center" my={2}>
          <Pagination
            count={Math.ceil(pagination.totalItems / pagination.itemsPerPage)}
            page={pagination.currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </TableContainer>
  );
}

interface EmptyMessageRowProps<T extends Identifiable> {
  emptyStateMessage: string;
  columns: FancyPantsTableColumn<T>[];
  renderActions: boolean;
}

/**
 * A functional component that renders a row in a table displaying an empty message.
 */
function EmptyMessageRow<T extends Identifiable>({
  emptyStateMessage,
  columns,
  renderActions,
}: EmptyMessageRowProps<T>) {
  return (
    <TableRow>
      <TableCell colSpan={columns.length + 1 + (renderActions ? 1 : 0)} align="center">
        {/* <Box sx={{ padding: 2 }}> */}
        <Typography variant="body1" color="textSecondary">
          {emptyStateMessage}
        </Typography>
        {/* </Box> */}
      </TableCell>
    </TableRow>
  );
}

import { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Download, FileSpreadsheet } from 'lucide-react';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  itemsPerPage?: number;
  onExportAll?: () => void;
  onExportSelected?: (selected: T[]) => void;
  getRowId: (row: T) => string;
  searchKeys?: string[];
}

export function DataTable<T>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = 'Search...',
  itemsPerPage = 10,
  onExportAll,
  onExportSelected,
  getRowId,
  searchKeys = [],
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((row) => {
      return searchKeys.some((key) => {
        const value = (row as any)[key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm, searchKeys]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = (a as any)[sortColumn];
      const bValue = (b as any)[sortColumn];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      let comparison = 0;
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(paginatedData.map((row) => getRowId(row)));
      setSelectedRows(allIds);
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (rowId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(rowId);
    } else {
      newSelected.delete(rowId);
    }
    setSelectedRows(newSelected);
  };

  const handleExportSelected = () => {
    if (onExportSelected) {
      const selected = data.filter((row) => selectedRows.has(getRowId(row)));
      onExportSelected(selected);
    }
  };

  const allSelected = paginatedData.length > 0 && paginatedData.every((row) => selectedRows.has(getRowId(row)));
  const someSelected = paginatedData.some((row) => selectedRows.has(getRowId(row))) && !allSelected;

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        {searchable && (
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        {/* Export Buttons */}
        <div className="flex gap-2">
          {onExportSelected && selectedRows.size > 0 && (
            <button
              onClick={handleExportSelected}
              className="flex items-center gap-2 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export Selected ({selectedRows.size})
            </button>
          )}
          {onExportAll && (
            <button
              onClick={onExportAll}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export All
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {(onExportAll || onExportSelected) && (
                  <th className="py-3 px-4 text-left w-12">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(input) => {
                        if (input) {
                          input.indeterminate = someSelected;
                        }
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`py-3 px-4 text-left text-gray-700 ${
                      column.sortable ? 'cursor-pointer hover:bg-gray-100 select-none' : ''
                    }`}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {column.sortable && (
                        <div className="flex flex-col">
                          {sortColumn === column.key ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="w-4 h-4 text-indigo-600" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-indigo-600" />
                            )
                          ) : (
                            <div className="w-4 h-4 text-gray-400">
                              <ChevronUp className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row) => {
                  const rowId = getRowId(row);
                  const isSelected = selectedRows.has(rowId);

                  return (
                    <tr
                      key={rowId}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        isSelected ? 'bg-indigo-50' : ''
                      }`}
                    >
                      {(onExportAll || onExportSelected) && (
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectRow(rowId, e.target.checked)}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                      )}
                      {columns.map((column) => (
                        <td key={column.key} className="py-3 px-4">
                          {column.render ? column.render(row) : String((row as any)[column.key] || '')}
                        </td>
                      ))}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + (onExportAll || onExportSelected ? 1 : 0)}
                    className="py-8 text-center text-gray-500"
                  >
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-gray-600 text-sm">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-indigo-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

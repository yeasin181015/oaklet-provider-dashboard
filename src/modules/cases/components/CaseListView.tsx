'use client';

import { useState, useCallback } from 'react';
import { SummaryCards } from './SummaryCards';
import { CaseFilters } from './CaseFilters';
import { CaseTable } from './CaseTable';
import { Pagination } from './Pagination';
import { useCases } from '../hooks/useCases';
import type { CaseFilters as CaseFiltersType } from '../types';

export function CaseListView() {
  const [filters, setFilters] = useState<CaseFiltersType>({
    sort_by: 'updated_at',
    sort_order: 'desc',
    per_page: 25,
    page: 1,
  });

  const { data, isLoading, isError } = useCases(filters);

  const handleFiltersChange = useCallback((next: CaseFiltersType) => {
    setFilters(next);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  return (
    <div className='space-y-5'>
      {/* Summary cards */}
      <SummaryCards practiceId={filters.practice_id} />

      {/* Section header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold text-slate-900'>
          Cases{' '}
          {data?.pagination?.total !== undefined && (
            <span className='ml-1 text-sm font-normal text-slate-400'>({data.pagination.total})</span>
          )}
        </h2>
      </div>

      {/* Filters */}
      <CaseFilters filters={filters} onChange={handleFiltersChange} />

      {/* Table */}
      <CaseTable cases={data?.data ?? []} isLoading={isLoading} isError={isError} />

      {/* Pagination */}
      {data?.pagination && (
        <Pagination pagination={data.pagination} onPageChange={handlePageChange} />
      )}
    </div>
  );
}

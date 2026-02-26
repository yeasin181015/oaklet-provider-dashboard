'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { usePractices } from '@/modules/practices/hooks/usePractices';
import type { CaseFilters as CaseFiltersType, CasePriority, CaseStatus } from '../types';

interface CaseFiltersProps {
  filters: CaseFiltersType;
  onChange: (filters: CaseFiltersType) => void;
}

const STATUS_OPTIONS: { label: string; value: CaseStatus }[] = [
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Pending Review', value: 'pending_review' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Closed', value: 'closed' },
];

const PRIORITY_OPTIONS: { label: string; value: CasePriority }[] = [
  { label: 'Urgent', value: 'urgent' },
  { label: 'High', value: 'high' },
  { label: 'Normal', value: 'normal' },
  { label: 'Low', value: 'low' },
];

const SORT_OPTIONS = [
  { label: 'Last Updated', value: 'updated_at' },
  { label: 'Due Date', value: 'due_date' },
  { label: 'Priority', value: 'priority' },
  { label: 'Created', value: 'created_at' },
];

export function CaseFilters({ filters, onChange }: CaseFiltersProps) {
  const { data: practicesData } = usePractices();
  const practices = practicesData?.data ?? [];

  const hasActiveFilters = !!(filters.practice_id || filters.status || filters.priority || filters.search);

  const set = (patch: Partial<CaseFiltersType>) => onChange({ ...filters, ...patch, page: 1 });

  const clearAll = () =>
    onChange({
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
      per_page: filters.per_page,
      page: 1,
    });

  return (
    <div className='space-y-3'>
      {/* Search */}
      <div className='relative'>
        <Search className='absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
        <Input
          placeholder='Search by patient name or case ID…'
          className='pl-8 pr-8'
          value={filters.search ?? ''}
          onChange={(e) => set({ search: e.target.value || undefined })}
        />
        {filters.search && (
          <button
            className='absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
            onClick={() => set({ search: undefined })}
            aria-label='Clear search'
          >
            <X className='h-4 w-4' />
          </button>
        )}
      </div>

      {/* Filter row */}
      <div className='flex flex-wrap items-center gap-2'>
        {/* Practice filter */}
        <Select value={filters.practice_id ?? 'all'} onValueChange={(v) => set({ practice_id: v === 'all' ? undefined : v })}>
          <SelectTrigger className='w-48'>
            <SelectValue placeholder='All practices' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All practices</SelectItem>
            {practices.map((p) => (
              <SelectItem key={p.practice_id} value={p.practice_id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status filter */}
        <Select value={filters.status ?? 'all'} onValueChange={(v) => set({ status: v === 'all' ? undefined : (v as CaseStatus) })}>
          <SelectTrigger className='w-40'>
            <SelectValue placeholder='All statuses' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All statuses</SelectItem>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Priority filter */}
        <Select value={filters.priority ?? 'all'} onValueChange={(v) => set({ priority: v === 'all' ? undefined : (v as CasePriority) })}>
          <SelectTrigger className='w-36'>
            <SelectValue placeholder='All priorities' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All priorities</SelectItem>
            {PRIORITY_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={filters.sort_by ?? 'updated_at'} onValueChange={(v) => set({ sort_by: v as CaseFiltersType['sort_by'] })}>
          <SelectTrigger className='w-40'>
            <SelectValue placeholder='Sort by' />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort order toggle */}
        <Button
          variant='outline'
          size='sm'
          onClick={() => set({ sort_order: filters.sort_order === 'asc' ? 'desc' : 'asc' })}
          className='shrink-0'
          title={`Sort ${filters.sort_order === 'asc' ? 'descending' : 'ascending'}`}
        >
          {filters.sort_order === 'asc' ? '↑ Asc' : '↓ Desc'}
        </Button>

        {/* Clear filters */}
        {hasActiveFilters && (
          <Button variant='ghost' size='sm' onClick={clearAll} className='gap-1 text-slate-500'>
            <X className='h-3.5 w-3.5' />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}

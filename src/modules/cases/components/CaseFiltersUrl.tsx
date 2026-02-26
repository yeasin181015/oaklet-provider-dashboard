'use client';

import { SearchInput, SearchInputSkeleton } from '@/components/table/search-input';
import { SearchSelect, SearchSelectSkeleton } from '@/components/table/search-select';
import { Button } from '@/components/ui/button';
import type { Practice } from '@/modules/practices/types';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { PRIORITY_OPTIONS, SORT_OPTIONS, SORT_ORDER_OPTIONS, STATUS_OPTIONS } from '../utils/constants';

interface CaseFiltersUrlProps {
  practices: Practice[];
}

function ClearFiltersButton() {
  const searchParams = useSearchParams();
  const filterKeys = ['practice_id', 'status', 'priority', 'search'];
  const hasActive = filterKeys.some((k) => searchParams.has(k));

  if (!hasActive) return null;

  // Build URL without filter params but keep sort params
  const keepParams = new URLSearchParams();
  ['sort_by', 'sort_order'].forEach((k) => {
    const v = searchParams.get(k);
    if (v) keepParams.set(k, v);
  });
  const href = `/dashboard${keepParams.toString() ? `?${keepParams.toString()}` : ''}`;

  return (
    <Button variant='ghost' size='sm' asChild className='gap-1 text-slate-500'>
      <Link href={href}>
        <X className='h-3.5 w-3.5' />
        Clear filters
      </Link>
    </Button>
  );
}

export function CaseFiltersUrl({ practices }: CaseFiltersUrlProps) {
  const practiceOptions = practices.map((p) => ({ value: p.practice_id, label: p.name }));

  return (
    <div className='space-y-3'>
      {/* Search */}
      <Suspense fallback={<SearchInputSkeleton />}>
        <SearchInput queryKey='search' placeholder='Search by patient name or case ID…' />
      </Suspense>

      {/* Filter + Sort row */}
      <div className='flex flex-wrap items-center gap-2'>
        <Suspense fallback={<SearchSelectSkeleton className='w-48' />}>
          <SearchSelect queryKey='practice_id' options={practiceOptions} placeholder='All practices' className='w-48' />
        </Suspense>

        <Suspense fallback={<SearchSelectSkeleton className='w-40' />}>
          <SearchSelect queryKey='status' options={STATUS_OPTIONS} placeholder='All statuses' className='w-40' />
        </Suspense>

        <Suspense fallback={<SearchSelectSkeleton className='w-36' />}>
          <SearchSelect queryKey='priority' options={PRIORITY_OPTIONS} placeholder='All priorities' className='w-36' />
        </Suspense>

        <Suspense fallback={<SearchSelectSkeleton className='w-40' />}>
          <SearchSelect queryKey='sort_by' options={SORT_OPTIONS} placeholder='Sort by' className='w-40' />
        </Suspense>

        <Suspense fallback={<SearchSelectSkeleton className='w-40' />}>
          <SearchSelect queryKey='sort_order' options={SORT_ORDER_OPTIONS} placeholder='Order' className='w-40' />
        </Suspense>

        <Suspense fallback={null}>
          <ClearFiltersButton />
        </Suspense>
      </div>
    </div>
  );
}

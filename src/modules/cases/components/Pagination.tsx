'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Pagination as PaginationType } from '@/types';

interface PaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, total_pages, total, per_page } = pagination;
  const start = (page - 1) * per_page + 1;
  const end = Math.min(page * per_page, total);

  if (total_pages <= 1) return null;

  return (
    <div className='flex items-center justify-between'>
      <p className='text-sm text-slate-500'>
        Showing <span className='font-medium text-slate-700'>{start}–{end}</span> of{' '}
        <span className='font-medium text-slate-700'>{total}</span> cases
      </p>

      <div className='flex items-center gap-1'>
        <Button variant='outline' size='sm' disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label='Previous page'>
          <ChevronLeft className='h-4 w-4' />
        </Button>

        {/* Page numbers (max 5 around current) */}
        {Array.from({ length: total_pages }, (_, i) => i + 1)
          .filter((p) => Math.abs(p - page) <= 2 || p === 1 || p === total_pages)
          .reduce<(number | '...')[]>((acc, p, i, arr) => {
            if (i > 0 && (arr[i - 1] as number) + 1 < p) acc.push('...');
            acc.push(p);
            return acc;
          }, [])
          .map((p, i) =>
            p === '...' ? (
              <span key={`ellipsis-${i}`} className='px-1 text-slate-400'>
                …
              </span>
            ) : (
              <Button
                key={p}
                variant={p === page ? 'default' : 'outline'}
                size='sm'
                onClick={() => onPageChange(p)}
                aria-label={`Page ${p}`}
                aria-current={p === page ? 'page' : undefined}
                className='min-w-[2rem]'
              >
                {p}
              </Button>
            ),
          )}

        <Button
          variant='outline'
          size='sm'
          disabled={page >= total_pages}
          onClick={() => onPageChange(page + 1)}
          aria-label='Next page'
        >
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}

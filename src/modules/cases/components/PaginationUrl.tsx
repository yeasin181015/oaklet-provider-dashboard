'use client';

import { Button } from '@/components/ui/button';
import type { Pagination } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

interface PaginationUrlProps {
  pagination: Pagination;
}

export function PaginationUrl({ pagination }: PaginationUrlProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { page, total_pages, total, per_page } = pagination;

  if (total_pages <= 1) return null;

  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  const start = (page - 1) * per_page + 1;
  const end = Math.min(page * per_page, total);

  const pageNumbers = Array.from({ length: total_pages }, (_, i) => i + 1)
    .filter((p) => Math.abs(p - page) <= 2 || p === 1 || p === total_pages)
    .reduce<(number | '...')[]>((acc, p, i, arr) => {
      if (i > 0 && (arr[i - 1] as number) + 1 < p) acc.push('...');
      acc.push(p);
      return acc;
    }, []);

  return (
    <div className='flex items-center justify-between' data-pending={isPending ? '' : undefined}>
      <p className='text-sm text-slate-500'>
        Showing <span className='font-medium text-slate-700'>{start}–{end}</span> of{' '}
        <span className='font-medium text-slate-700'>{total}</span> cases
      </p>

      <div className='flex items-center gap-1'>
        <Button variant='outline' size='sm' disabled={page <= 1 || isPending} onClick={() => goToPage(page - 1)} aria-label='Previous page'>
          <ChevronLeft className='h-4 w-4' />
        </Button>

        {pageNumbers.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className='px-1 text-slate-400'>…</span>
          ) : (
            <Button
              key={p}
              variant={p === page ? 'default' : 'outline'}
              size='sm'
              disabled={isPending}
              onClick={() => goToPage(p)}
              className='min-w-[2rem]'
            >
              {p}
            </Button>
          ),
        )}

        <Button variant='outline' size='sm' disabled={page >= total_pages || isPending} onClick={() => goToPage(page + 1)} aria-label='Next page'>
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}

import { CaseFiltersUrl } from '@/modules/cases/components/CaseFiltersUrl';
import { CaseSection } from '@/modules/cases/components/CaseSection';
import { CaseTableSkeleton } from '@/modules/cases/components/CaseTable';
import { SummaryCardsSkeleton } from '@/modules/cases/components/SummaryCards';
import { SummarySection } from '@/modules/cases/components/SummarySection';
import { casesService } from '@/modules/cases/services/service';
import type { CaseFilters, CasePriority, CaseStatus, SortField, SortOrder } from '@/modules/cases/types';
import { practicesService } from '@/modules/practices/services/service';
import { Suspense } from 'react';

export const metadata = { title: 'Dashboard — Oaklet Provider' };

interface SearchParams {
  practice_id?: string;
  status?: string;
  priority?: string;
  search?: string;
  sort_by?: string;
  sort_order?: string;
  page?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const filters: CaseFilters = {
    practice_id: params.practice_id || undefined,
    status: (params.status as CaseStatus) || undefined,
    priority: (params.priority as CasePriority) || undefined,
    search: params.search || undefined,
    sort_by: (params.sort_by as SortField) || 'updated_at',
    sort_order: (params.sort_order as SortOrder) || 'desc',
    page: params.page ? parseInt(params.page, 10) : 1,
    per_page: 25,
  };

  const casesPromise = casesService.list(filters);
  const summaryPromise = casesService.summary(filters.practice_id);

  const practicesData = await practicesService.list();

  return (
    <div className='space-y-5'>
      <Suspense fallback={<SummaryCardsSkeleton />}>
        <SummarySection summaryPromise={summaryPromise} />
      </Suspense>

      <div className='flex items-center justify-between'>
        <Suspense fallback={<h2 className='text-lg font-semibold text-slate-900'>Cases</h2>}>
          <CasesHeading casesPromise={casesPromise} />
        </Suspense>
      </div>

      <CaseFiltersUrl practices={practicesData.data} />

      <Suspense fallback={<CaseTableSkeleton />}>
        <CaseSection casesPromise={casesPromise} />
      </Suspense>
    </div>
  );
}

async function CasesHeading({ casesPromise }: { casesPromise: Promise<Awaited<ReturnType<typeof casesService.list>>> }) {
  const data = await casesPromise;
  return (
    <h2 className='text-lg font-semibold text-slate-900'>
      Cases <span className='text-sm font-normal text-slate-400'>({data.pagination.total})</span>
    </h2>
  );
}

import { MOCK_CASES } from '@/lib/mock/data';
import type { Case, CasePriority, CaseStatus, SortField, SortOrder } from '@/modules/cases/types';
import { NextRequest, NextResponse } from 'next/server';

function isAuthorized(request: NextRequest): boolean {
  const auth = request.headers.get('Authorization');
  return !!auth?.startsWith('Bearer ');
}

const PRIORITY_WEIGHT: Record<CasePriority, number> = { urgent: 4, high: 3, normal: 2, low: 1 };

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Invalid or expired access token.' } }, { status: 401 });
  }

  await new Promise((r) => setTimeout(r, 300));

  const { searchParams } = new URL(request.url);

  const practice_id = searchParams.get('practice_id') ?? undefined;
  const status = (searchParams.get('status') as CaseStatus) ?? undefined;
  const priority = (searchParams.get('priority') as CasePriority) ?? undefined;
  const search = searchParams.get('search')?.toLowerCase() ?? undefined;
  const sort_by: SortField = (searchParams.get('sort_by') as SortField) ?? 'updated_at';
  const sort_order: SortOrder = (searchParams.get('sort_order') as SortOrder) ?? 'desc';
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const per_page = Math.min(50, Math.max(1, parseInt(searchParams.get('per_page') ?? '25', 10)));

  let results: Case[] = [...MOCK_CASES];

  if (practice_id) results = results.filter((c) => c.practice_id === practice_id);
  if (status) results = results.filter((c) => c.status === status);
  if (priority) results = results.filter((c) => c.priority === priority);
  if (search) {
    results = results.filter(
      (c) =>
        `${c.patient.first_name} ${c.patient.last_name}`.toLowerCase().includes(search) ||
        c.id.toLowerCase().includes(search) ||
        c.patient.mrn.toLowerCase().includes(search),
    );
  }

  // Sorting
  results.sort((a, b) => {
    let cmp = 0;
    switch (sort_by) {
      case 'priority':
        cmp = PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
        break;
      case 'due_date':
        cmp = (a.due_date ?? '').localeCompare(b.due_date ?? '');
        break;
      case 'created_at':
        cmp = a.created_at.localeCompare(b.created_at);
        break;
      case 'updated_at':
      default:
        cmp = a.updated_at.localeCompare(b.updated_at);
    }
    return sort_order === 'asc' ? cmp : -cmp;
  });

  const total = results.length;
  const total_pages = Math.max(1, Math.ceil(total / per_page));
  const paginated = results.slice((page - 1) * per_page, page * per_page);

  return NextResponse.json({ data: paginated, pagination: { page, per_page, total, total_pages } });
}

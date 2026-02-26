import type { BadgeProps } from '@/components/ui/badge';
import { Badge } from '@/components/ui/badge';
import { APP_ROUTES } from '@/lib/routes/app-routes';
import { format, isPast, isToday, parseISO } from 'date-fns';
import { ChevronRight, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import type { Case, CaseStatus } from '../types';
import { PRIORITY_LABELS, STATUS_LABELS, TYPE_LABELS } from '../utils/constants';

function DueDateCell({ dueDate, status }: { dueDate: string | null; status: CaseStatus }) {
  if (!dueDate) return <span className='text-slate-400'>—</span>;

  const date = parseISO(dueDate);
  const isResolved = status === 'resolved' || status === 'closed';
  const overdue = !isResolved && isPast(date) && !isToday(date);
  const dueToday = !isResolved && isToday(date);

  return (
    <span className={`text-sm ${overdue ? 'font-semibold text-red-600' : dueToday ? 'font-semibold text-orange-600' : 'text-slate-600'}`}>
      {overdue && <span className='mr-1'>⚠</span>}
      {format(date, 'MMM d, yyyy')}
    </span>
  );
}

function CaseRow({ c }: { c: Case }) {
  const patientName = `${c.patient.first_name} ${c.patient.last_name}`;
  const isResolved = c.status === 'resolved' || c.status === 'closed';

  return (
    <tr className='group border-b border-slate-100 transition-colors hover:bg-slate-50'>
      <td className='py-3 pl-4 pr-3'>
        <div className='font-medium text-slate-900'>{patientName}</div>
        <div className='text-xs text-slate-400'>{c.patient.mrn}</div>
      </td>
      <td className='hidden px-3 py-3 text-sm text-slate-600 md:table-cell'>{c.practice_name}</td>
      <td className='hidden px-3 py-3 text-sm text-slate-600 lg:table-cell'>{TYPE_LABELS[c.type] ?? c.type}</td>
      <td className='px-3 py-3'>
        <Badge variant={c.status as BadgeProps['variant']}>{STATUS_LABELS[c.status]}</Badge>
      </td>
      <td className='hidden px-3 py-3 sm:table-cell'>
        <Badge variant={c.priority as BadgeProps['variant']}>{PRIORITY_LABELS[c.priority]}</Badge>
      </td>
      <td className='hidden px-3 py-3 md:table-cell'>
        <DueDateCell dueDate={c.due_date} status={c.status} />
      </td>
      <td className='px-3 py-3 text-center'>
        {c.unread_messages > 0 && !isResolved ? (
          <span className='inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700'>
            <MessageSquare className='h-3 w-3' />
            {c.unread_messages}
          </span>
        ) : (
          <span className='text-slate-300'>—</span>
        )}
      </td>
      <td className='py-3 pl-3 pr-4 text-right'>
        <Link
          href={APP_ROUTES.cases.detail(c.id)}
          className='inline-flex items-center gap-1 text-sm text-blue-600 opacity-0 transition-opacity group-hover:opacity-100 hover:text-blue-800'
          aria-label={`View case for ${patientName}`}
        >
          View <ChevronRight className='h-3.5 w-3.5' />
        </Link>
      </td>
    </tr>
  );
}

export function CaseTable({ cases }: { cases: Case[] }) {
  if (cases.length === 0) {
    return (
      <div className='flex h-48 flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-500'>
        <p className='font-medium'>No cases found</p>
        <p className='text-sm'>Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className='overflow-x-auto rounded-xl border border-slate-200 bg-white'>
      <table className='min-w-full text-sm'>
        <thead>
          <tr className='border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500'>
            <th className='py-3 pl-4 pr-3'>Patient</th>
            <th className='hidden px-3 py-3 md:table-cell'>Practice</th>
            <th className='hidden px-3 py-3 lg:table-cell'>Type</th>
            <th className='px-3 py-3'>Status</th>
            <th className='hidden px-3 py-3 sm:table-cell'>Priority</th>
            <th className='hidden px-3 py-3 md:table-cell'>Due Date</th>
            <th className='px-3 py-3 text-center'>Msgs</th>
            <th className='py-3 pl-3 pr-4' />
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => (
            <CaseRow key={c.id} c={c} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CaseTableSkeleton() {
  return (
    <div className='space-y-2'>
      <div className='h-10 animate-pulse rounded-lg bg-slate-100' />
      {[...Array(8)].map((_, i) => (
        <div key={i} className='h-14 animate-pulse rounded-lg bg-slate-50' />
      ))}
    </div>
  );
}

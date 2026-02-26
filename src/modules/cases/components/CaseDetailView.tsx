'use client';

import { format, parseISO } from 'date-fns';
import { ArrowLeft, MessageSquare, Calendar, User, Building2 } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { APP_ROUTES } from '@/lib/routes/app-routes';
import { useCaseDetail } from '../hooks/useCases';
import type { BadgeProps } from '@/components/ui/badge';
import type { CasePriority, CaseStatus } from '../types';

const STATUS_LABELS: Record<CaseStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  pending_review: 'Pending Review',
  resolved: 'Resolved',
  closed: 'Closed',
};

const PRIORITY_LABELS: Record<CasePriority, string> = {
  urgent: 'Urgent',
  high: 'High',
  normal: 'Normal',
  low: 'Low',
};

const TYPE_LABELS: Record<string, string> = {
  initial_consult: 'Initial Consult',
  follow_up: 'Follow-Up',
  lab_review: 'Lab Review',
  prescription_refill: 'Prescription Refill',
  referral: 'Referral',
  general: 'General',
};

function TimelineEventIcon({ type }: { type: string }) {
  const base = 'h-2 w-2 rounded-full mt-1.5 shrink-0';
  switch (type) {
    case 'case_created': return <span className={`${base} bg-blue-500`} />;
    case 'message': return <span className={`${base} bg-purple-500`} />;
    case 'note_added': return <span className={`${base} bg-green-500`} />;
    case 'status_changed': return <span className={`${base} bg-yellow-500`} />;
    default: return <span className={`${base} bg-slate-400`} />;
  }
}

interface CaseDetailViewProps {
  caseId: string;
}

export function CaseDetailView({ caseId }: CaseDetailViewProps) {
  const { data: caseDetail, isLoading, isError } = useCaseDetail(caseId);

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <Spinner size='lg' />
      </div>
    );
  }

  if (isError || !caseDetail) {
    return (
      <div className='flex h-64 flex-col items-center justify-center gap-2 text-slate-500'>
        <p className='font-medium'>Case not found</p>
        <Link href={APP_ROUTES.dashboard} className='text-sm text-blue-600 hover:underline'>
          Back to dashboard
        </Link>
      </div>
    );
  }

  const patientName = `${caseDetail.patient.first_name} ${caseDetail.patient.last_name}`;

  return (
    <div className='space-y-6'>
      {/* Back link */}
      <Link
        href={APP_ROUTES.dashboard}
        className='inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900'
      >
        <ArrowLeft className='h-4 w-4' />
        Back to cases
      </Link>

      {/* Header */}
      <div className='rounded-xl border border-slate-200 bg-white p-6'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
          <div className='space-y-1'>
            <h1 className='text-xl font-semibold text-slate-900'>{caseDetail.subject}</h1>
            <p className='text-sm text-slate-500'>Case ID: {caseDetail.id}</p>
          </div>
          <div className='flex gap-2'>
            <Badge variant={caseDetail.status as BadgeProps['variant']}>{STATUS_LABELS[caseDetail.status]}</Badge>
            <Badge variant={caseDetail.priority as BadgeProps['variant']}>{PRIORITY_LABELS[caseDetail.priority]}</Badge>
          </div>
        </div>

        {caseDetail.description && (
          <p className='mt-4 text-sm leading-relaxed text-slate-700'>{caseDetail.description}</p>
        )}

        {/* Metadata grid */}
        <div className='mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-4'>
          <div className='space-y-1'>
            <p className='text-xs font-medium uppercase tracking-wide text-slate-400'>Patient</p>
            <div className='flex items-center gap-1.5 text-sm text-slate-700'>
              <User className='h-3.5 w-3.5 text-slate-400' />
              {patientName}
            </div>
            <p className='text-xs text-slate-400'>{caseDetail.patient.mrn}</p>
          </div>
          <div className='space-y-1'>
            <p className='text-xs font-medium uppercase tracking-wide text-slate-400'>Practice</p>
            <div className='flex items-center gap-1.5 text-sm text-slate-700'>
              <Building2 className='h-3.5 w-3.5 text-slate-400' />
              {caseDetail.practice_name}
            </div>
          </div>
          <div className='space-y-1'>
            <p className='text-xs font-medium uppercase tracking-wide text-slate-400'>Type</p>
            <p className='text-sm text-slate-700'>{TYPE_LABELS[caseDetail.type] ?? caseDetail.type}</p>
          </div>
          <div className='space-y-1'>
            <p className='text-xs font-medium uppercase tracking-wide text-slate-400'>Due Date</p>
            <div className='flex items-center gap-1.5 text-sm text-slate-700'>
              <Calendar className='h-3.5 w-3.5 text-slate-400' />
              {caseDetail.due_date ? format(parseISO(caseDetail.due_date), 'MMM d, yyyy') : '—'}
            </div>
          </div>
        </div>

        {caseDetail.unread_messages > 0 && (
          <div className='mt-4 inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700'>
            <MessageSquare className='h-3.5 w-3.5' />
            {caseDetail.unread_messages} unread {caseDetail.unread_messages === 1 ? 'message' : 'messages'}
          </div>
        )}
      </div>

      {/* Timeline */}
      {caseDetail.timeline && caseDetail.timeline.length > 0 && (
        <div className='rounded-xl border border-slate-200 bg-white p-6'>
          <h2 className='mb-4 font-semibold text-slate-900'>Timeline</h2>
          <div className='space-y-4'>
            {caseDetail.timeline.map((event) => (
              <div key={event.id} className='flex gap-3'>
                <TimelineEventIcon type={event.type} />
                <div className='flex-1 space-y-0.5'>
                  <p className='text-sm text-slate-700'>{event.details}</p>
                  <p className='text-xs text-slate-400'>
                    {format(parseISO(event.timestamp), 'MMM d, yyyy, h:mm a')} · {event.actor}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { Activity, AlertTriangle, Clock, MessageSquare } from 'lucide-react';
import type { CaseSummary } from '../types';

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className='rounded-xl border border-slate-200 bg-white p-4'>
      <div className='flex items-start justify-between'>
        <div>
          <p className='text-xs font-medium uppercase tracking-wide text-slate-500'>{label}</p>
          <p className='mt-1 text-2xl font-bold text-slate-900'>{value}</p>
        </div>
        <div className={`rounded-lg p-2 ${accent}`}>
          <Icon className='h-4 w-4' />
        </div>
      </div>
    </div>
  );
}

export function SummaryCards({ summary }: { summary: CaseSummary }) {
  return (
    <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
      <StatCard icon={Activity} label='Active Cases' value={summary.total_open} accent='bg-blue-50 text-blue-600' />
      <StatCard icon={AlertTriangle} label='Urgent' value={summary.by_priority.urgent} accent='bg-red-50 text-red-600' />
      <StatCard icon={Clock} label='Overdue' value={summary.overdue} accent='bg-orange-50 text-orange-600' />
      <StatCard icon={MessageSquare} label='Unread Messages' value={summary.unread_messages} accent='bg-purple-50 text-purple-600' />
    </div>
  );
}

export function SummaryCardsSkeleton() {
  return (
    <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
      {[...Array(4)].map((_, i) => (
        <div key={i} className='h-24 animate-pulse rounded-xl bg-slate-100' />
      ))}
    </div>
  );
}

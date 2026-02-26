import { use } from 'react';
import type { CaseSummary } from '../types';
import { SummaryCards } from './SummaryCards';

interface Props {
  summaryPromise: Promise<CaseSummary>;
}

export function SummarySection({ summaryPromise }: Props) {
  const summary = use(summaryPromise);
  return <SummaryCards summary={summary} />;
}

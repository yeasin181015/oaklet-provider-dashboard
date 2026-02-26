import type { ListEnvelope } from '@/types';
import { use } from 'react';
import type { Case } from '../types';
import { CaseTable } from './CaseTable';
import { PaginationUrl } from './PaginationUrl';

interface Props {
  casesPromise: Promise<ListEnvelope<Case>>;
  total?: number;
}

export function CaseSection({ casesPromise }: Props) {
  const casesData = use(casesPromise);

  return (
    <div className='space-y-4 group-has-data-pending:animate-pulse'>
      <CaseTable cases={casesData.data} />
      <PaginationUrl pagination={casesData.pagination} />
    </div>
  );
}

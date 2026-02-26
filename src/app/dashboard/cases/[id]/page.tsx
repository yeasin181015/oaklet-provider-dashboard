import { CaseDetailView } from '@/modules/cases/components/CaseDetailView';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return { title: `Case ${id} — Oaklet Provider` };
}

export default async function CaseDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className='max-w-4xl'>
      <CaseDetailView caseId={id} />
    </div>
  );
}

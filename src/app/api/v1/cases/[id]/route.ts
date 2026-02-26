import { MOCK_CASE_DETAILS, MOCK_CASES } from '@/lib/mock/data';
import { NextRequest, NextResponse } from 'next/server';

function isAuthorized(request: NextRequest): boolean {
  const auth = request.headers.get('Authorization');
  return !!auth?.startsWith('Bearer ');
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Invalid or expired access token.' } }, { status: 401 });
  }

  await new Promise((r) => setTimeout(r, 200));

  const { id } = await params;

  if (MOCK_CASE_DETAILS[id]) {
    return NextResponse.json(MOCK_CASE_DETAILS[id]);
  }

  const caseItem = MOCK_CASES.find((c) => c.id === id);
  if (!caseItem) {
    return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Case not found.' } }, { status: 404 });
  }

  return NextResponse.json({ ...caseItem, description: '', timeline: [] });
}

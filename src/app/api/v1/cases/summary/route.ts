import { computeSummary } from '@/lib/mock/data';
import { NextRequest, NextResponse } from 'next/server';

function isAuthorized(request: NextRequest): boolean {
  const auth = request.headers.get('Authorization');
  return !!auth?.startsWith('Bearer ');
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Invalid or expired access token.' } }, { status: 401 });
  }

  await new Promise((r) => setTimeout(r, 200));

  const { searchParams } = new URL(request.url);
  const practice_id = searchParams.get('practice_id') ?? undefined;

  return NextResponse.json(computeSummary(practice_id));
}

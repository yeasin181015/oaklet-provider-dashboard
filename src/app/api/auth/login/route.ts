import { MOCK_LOGIN_RESPONSE } from '@/lib/mock/data';
import { NextRequest, NextResponse } from 'next/server';

const VALID_CREDENTIALS = [{ email: 'dr.smith@example.com', password: 'password123' }];

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  await new Promise((r) => setTimeout(r, 400));

  const isValid = VALID_CREDENTIALS.some((c) => c.email === email && c.password === password);

  if (!isValid) {
    return NextResponse.json(
      {
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'The email or password provided is incorrect.',
        },
      },
      { status: 401 },
    );
  }

  return NextResponse.json(MOCK_LOGIN_RESPONSE);
}

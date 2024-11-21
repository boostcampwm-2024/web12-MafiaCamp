import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  (await cookies()).delete('access_token');
  return new NextResponse('Logged out successfully.', { status: 200 });
}

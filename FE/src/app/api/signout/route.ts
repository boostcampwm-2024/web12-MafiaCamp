import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get('access_token');
  const response = await fetch(`${process.env.BACKEND_API_URL}/logout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken?.value}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(await request.json()),
    cache: 'no-store',
  });

  if (!response.ok) {
    return new NextResponse('Failed to log out.', { status: 400 });
  }

  (await cookies()).delete('access_token');
  return new NextResponse('Logged out successfully.', { status: 200 });
}

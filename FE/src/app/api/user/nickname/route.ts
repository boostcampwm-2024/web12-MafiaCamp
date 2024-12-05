import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
  const accessToken = request.cookies.get('access_token');
  const response = await fetch(`${process.env.BACKEND_API_URL}/user/nickname`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken?.value}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(await request.json()),
    cache: 'no-store',
  });

  if (!response.ok) {
    return new NextResponse((await response.json()).message, { status: 400 });
  }

  return new NextResponse('Updated nickname successfully.', { status: 200 });
}

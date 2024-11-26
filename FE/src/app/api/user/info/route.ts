import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('access_token');
  const response = await fetch(`${process.env.BACKEND_API_URL}/user/info`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken?.value}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    return new NextResponse('Failed to sign in.', { status: 400 });
  }

  return new NextResponse(JSON.stringify(await response.json()), {
    status: 200,
  });
}

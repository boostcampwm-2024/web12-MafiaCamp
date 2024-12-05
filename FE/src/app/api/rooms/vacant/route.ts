import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('access_token');
  const response = await fetch(`${process.env.BACKEND_API_URL}/rooms/vacant`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken?.value}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    return new NextResponse('Failed to join a room.', { status: 400 });
  }

  return new NextResponse(JSON.stringify(await response.json()), {
    status: 200,
  });
}

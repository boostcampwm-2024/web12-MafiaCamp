import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const response = await fetch(`${process.env.BACKEND_API_URL}/login/admin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (!response.ok) {
    const message: string = (await response.json()).message;
    return new NextResponse(message, {
      status: 400,
    });
  }

  const signInResponse = new NextResponse(
    JSON.stringify(await response.json()),
    {
      status: 200,
    },
  );

  const accessToken = response.headers.get('X-ACCESS-TOKEN');
  if (accessToken) {
    signInResponse.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 6, // 6 hours
      path: '/',
    });
  }

  return signInResponse;
}

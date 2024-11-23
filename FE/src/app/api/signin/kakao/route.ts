import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');

  if (!code) {
    return new NextResponse('Bad Request', { status: 400 });
  }

  const response = await fetch(
    `${process.env.BACKEND_API_URL}/login/kakao/callback?code=${code}`,
    {
      method: 'GET',
      cache: 'no-store',
    },
  );

  // TODO: 수정 필요
  if (!response.ok) {
    return new NextResponse('Failed to sign in.', { status: 400 });
  }

  const signInResponse = new NextResponse(
    JSON.stringify(await response.json()),
    { status: 200 },
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

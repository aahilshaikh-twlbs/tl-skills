import { NextRequest, NextResponse } from 'next/server';

const SITE_PASSWORD = process.env.SITE_PASSWORD ?? 'iamarealtlemployee';

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password !== SITE_PASSWORD) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('tl-auth', 'ok', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 4 * 60 * 60, // 4 hours, refreshed on each request while active
    path: '/',
  });
  return res;
}

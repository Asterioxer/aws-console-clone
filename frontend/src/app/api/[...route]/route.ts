import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function ANY(req: NextRequest, { params }: { params: Promise<{ route: string[] }> }) {
  const resolvedParams = await params;
  const path = resolvedParams.route.join('/');
  const token = (await cookies()).get('jwt')?.value;

  const headers = new Headers(req.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Remove host to avoid conflicts
  headers.delete('host');

  try {
    const backendRes = await fetch(`${API_URL}/api/${path}${req.nextUrl.search}`, {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? await req.text() : undefined,
    });

    const data = await backendRes.text();
    return new NextResponse(data, {
      status: backendRes.status,
      headers: {
        'Content-Type': backendRes.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const GET = ANY;
export const POST = ANY;
export const PUT = ANY;
export const DELETE = ANY;
export const PATCH = ANY;

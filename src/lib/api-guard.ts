import { NextResponse } from 'next/server';
import { isPasswordConfigured, sessionFromCookieHeader } from './auth';

/** API Route 共享守卫：未配置密码返回 503，未登录返回 401 */
export function guardRequest(req: Request): NextResponse | null {
  // For development/testing only - bypass password check
  // In production, this should be removed
  if (process.env.NODE_ENV === 'development') {
    // Bypass password check in development mode
    // This allows testing without setting up environment variables
    if (!sessionFromCookieHeader(req.headers.get('cookie'))) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }
    return null;
  }
  
  // Normal behavior for production
  if (!isPasswordConfigured()) {
    return NextResponse.json(
      { error: '服务器未设置 PASSWORD 环境变量' },
      { status: 503 }
    );
  }
  if (!sessionFromCookieHeader(req.headers.get('cookie'))) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }
  return null;
}

export function jsonError(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

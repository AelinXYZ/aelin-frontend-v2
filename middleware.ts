import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  if (url.pathname === '/pool/create' || url.pathname === '/deal/create') {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }
}

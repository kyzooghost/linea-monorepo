import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

export function middleware(request: NextRequest) {
  // Generate a nonce for the current request
  const nonce = nanoid();

  // Clone the request headers
  const requestHeaders = new Headers(request.headers);

  // Set a nonce header to communicate with layout.tsx
  requestHeaders.set("x-nonce", nonce);

  // Define CSP header
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://w.usabilla.com 'unsafe-inline';
    style-src 'self' 'nonce-${nonce}' 'unsafe-inline';
    img-src 'self' blob: data: https://*.infura.io https://*.alchemyapi.io https://*.quiknode.pro https://www.googletagmanager.com;
    font-src 'self' data:;
    connect-src 'self' 
      https://*.infura.io https://*.alchemyapi.io 
      wss://*.infura.io wss://*.alchemyapi.io 
      https://*.quiknode.pro wss://*.quiknode.pro 
      https://www.googletagmanager.com 
      https://*.walletconnect.org wss://*.walletconnect.org
      https://*.dynamic.xyz 
      https://api.onramper.com https://*.onramper.com
      https://api.li.fi https://*.li.fi;
    frame-src 'self' https://www.googletagmanager.com https://*.walletconnect.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  // Clone the request headers to create a new response
  const responseHeaders = new Headers();
  responseHeaders.set("Content-Security-Policy", cspHeader);

  // Return the response with the headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
    headers: responseHeaders,
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    {
      source: "/((?!_next/static|_next/image|favicon.ico|public/).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};

# Content Security Policy Implementation

This document outlines the Content Security Policy (CSP) implementation for the Linea Bridge UI.

## Overview

The bridge-ui application includes a Content Security Policy with nonce-based script and style authorization. This helps protect the application against Cross-Site Scripting (XSS) attacks by controlling which resources can be loaded and executed.

## Implementation

The CSP is implemented using Next.js middleware:

1. A middleware function (`src/middleware.ts`) generates a unique nonce for each request.
2. The nonce is passed to the layout component via request headers.
3. The layout component applies the nonce to inline scripts and styles.

## CSP Directives

The following CSP directives are implemented:

- `default-src 'self'` - Only allow resources from the same origin
- `script-src 'self' 'nonce-{nonce}' https://www.googletagmanager.com https://w.usabilla.com 'unsafe-inline'` - Allow scripts from same origin, with nonce, and from specified domains
- `style-src 'self' 'nonce-{nonce}' 'unsafe-inline'` - Allow styles from same origin, with nonce, and inline styles
- `img-src 'self' blob: data: https://*.infura.io https://*.alchemyapi.io https://*.quiknode.pro https://www.googletagmanager.com` - Allow images from same origin, data URIs, and specified domains
- `font-src 'self' data:` - Allow fonts from same origin and data URIs
- `connect-src 'self'` - Allow connections to same origin and these specific services:
  - Web3 providers: `https://*.infura.io`, `https://*.alchemyapi.io`, `wss://*.infura.io`, `wss://*.alchemyapi.io`, `https://*.quiknode.pro`, `wss://*.quiknode.pro`
  - Analytics: `https://www.googletagmanager.com`
  - Wallet services: `https://*.walletconnect.org`, `wss://*.walletconnect.org`, `https://*.dynamic.xyz`
  - On/off ramp services: `https://api.onramper.com`, `https://*.onramper.com`
  - Cross-chain: `https://api.li.fi`, `https://*.li.fi`
- `frame-src 'self' https://www.googletagmanager.com https://*.walletconnect.com` - Allow frames from same origin and specified domains
- `object-src 'none'` - Disallow object, embed, and applet elements
- `base-uri 'self'` - Restrict base URIs to same origin
- `form-action 'self'` - Restrict form submissions to same origin
- `frame-ancestors 'none'` - Disallow embedding in iframes (similar to X-Frame-Options: DENY)
- `block-all-mixed-content` - Block mixed content
- `upgrade-insecure-requests` - Upgrade insecure requests

## Usage

When adding new inline scripts or styles:

1. Ensure they have the `nonce` attribute
2. If using the Script component from Next.js, pass the nonce as a prop

For example:

```tsx
<Script 
  id="my-script" 
  dangerouslySetInnerHTML={{ __html: myScript }} 
  nonce={nonce} 
/>
```

## External Scripts

If you need to add additional external script domains, update the CSP directives in `src/middleware.ts` to include the new domain in the appropriate directive.

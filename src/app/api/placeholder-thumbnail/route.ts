import { NextResponse } from 'next/server';

export async function GET() {
  // Create a simple SVG placeholder
  const svg = `
    <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="150" fill="#f3f4f6"/>
      <text x="100" y="75" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="14">
        Küçük Resim Yok
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
    },
  });
}

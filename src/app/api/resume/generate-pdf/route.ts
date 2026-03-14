import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // PDF generation is handled client-side via browser print
  // This endpoint can be enhanced with puppeteer/playwright in production
  return NextResponse.json({ message: 'Use client-side PDF generation' }, { status: 200 });
}

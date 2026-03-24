import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return new NextResponse('Missing token', { status: 400 });
  }

  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('email_drip_state')
      .update({ status: 'unsubscribed' })
      .eq('unsubscribe_token', token)
      .select('user_id, email')
      .single();

    if (error || !data) {
      return new NextResponse(unsubscribedHtml('We couldn\'t find your subscription. You may have already unsubscribed.'), {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // Log the unsubscribe event
    await supabase.from('email_events').insert({
      user_id: data.user_id,
      email_number: 0, // 0 = unsubscribe action
      event_type: 'unsubscribed',
      metadata: { source: 'email_link' },
    });

    return new NextResponse(unsubscribedHtml('You\'ve been unsubscribed from Resumly emails. You won\'t receive any more messages from us.'), {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  } catch {
    return new NextResponse(unsubscribedHtml('Something went wrong. Please try again later.'), {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

// Also support POST for List-Unsubscribe-Post one-click
export async function POST(request: NextRequest) {
  return GET(request);
}

function unsubscribedHtml(message: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unsubscribed — Resumly</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#f6f9fc">
  <div style="text-align:center;max-width:400px;padding:40px">
    <div style="font-size:48px;margin-bottom:16px">📧</div>
    <h1 style="font-size:20px;color:#1e293b;margin:0 0 12px">Unsubscribed</h1>
    <p style="font-size:15px;color:#64748b;line-height:24px;margin:0 0 24px">${message}</p>
    <a href="https://resumly.app" style="color:#1a91f0;text-decoration:none;font-size:14px">← Back to Resumly</a>
  </div>
</body>
</html>`;
}

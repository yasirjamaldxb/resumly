import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getResend } from '@/lib/resend';
import ATSReportEmail from '@/emails/ats-report';
import { trackEvent, logError } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  try {
    const { email, score, rating, suggestions, categories, wordCount, sections } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Save to Supabase (non-blocking — don't let DB errors prevent email send)
    const supabase = await createClient();
    supabase
      .from('ats_email_leads')
      .upsert(
        {
          email: cleanEmail,
          ats_score: score || null,
          ats_rating: rating || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      )
      .then(({ error }) => {
        if (error && error.code !== '42P01') {
          console.error('Supabase error:', error);
        }
      });

    // Send the ATS report email via Resend
    const resend = getResend();
    let emailSent = false;
    let emailErrorMsg = '';

    if (resend) {
      try {
        const { data, error: sendError } = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'Resumly <hello@resumly.app>',
          to: cleanEmail,
          subject: `Your ATS Score: ${score}/100 — ${rating} | Full Report Inside`,
          react: ATSReportEmail({
            score: score || 0,
            rating: rating || 'Unknown',
            wordCount: wordCount || 0,
            sections: sections || [],
            suggestions: suggestions || [],
            categories: categories || {},
          }),
        });

        if (sendError) {
          console.error('Resend send error:', JSON.stringify(sendError));
          emailErrorMsg = sendError.message || 'Unknown send error';
        } else {
          emailSent = true;
          console.log('Email sent successfully:', data?.id);
        }
      } catch (emailError) {
        console.error('Resend email error:', emailError);
        emailErrorMsg = emailError instanceof Error ? emailError.message : 'Unknown error';
      }
    } else {
      emailErrorMsg = 'RESEND_API_KEY not configured';
      console.error('Resend not initialized — RESEND_API_KEY missing');
    }

    trackEvent({ event: 'ats_email_capture', metadata: { score, rating, emailSent } });

    return NextResponse.json({ success: true, emailSent, emailError: emailErrorMsg || undefined });
  } catch (error) {
    console.error('Email collection error:', error);
    logError({ endpoint: '/api/ats-check/collect-email', errorMessage: error instanceof Error ? error.message : 'Email collection failed' });
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

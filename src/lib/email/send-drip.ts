import { getResend } from '@/lib/resend';
import { render } from '@react-email/render';
import { createElement } from 'react';
import { getEmailConfig, pickSubject, DRIP_SEQUENCE } from './drip-config';
import WelcomeEmail from '@/emails/drip-1-welcome';
import NudgeEmail from '@/emails/drip-2-nudge';
import TipsEmail from '@/emails/drip-3-tips';
import TemplatesEmail from '@/emails/drip-4-templates';
import DownloadPushEmail from '@/emails/drip-5-download';
import SuccessStoryEmail from '@/emails/drip-6-success';
import ReferralEmail from '@/emails/drip-7-referral';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://resumly.app';

interface SendDripResult {
  success: boolean;
  messageId?: string;
  error?: string;
  skipped?: boolean;
  reason?: string;
}

function getUnsubscribeUrl(token: string): string {
  return `${APP_URL}/api/email/unsubscribe?token=${encodeURIComponent(token)}`;
}

function getBuilderUrl(emailNumber: number): string {
  return `${APP_URL}/dashboard?utm_source=email&utm_medium=drip&utm_campaign=onboarding&utm_content=email_${emailNumber}_cta`;
}

function getShareUrl(): string {
  return `${APP_URL}?utm_source=email&utm_medium=drip&utm_campaign=referral&utm_content=email_7_share`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getEmailComponent(emailNumber: number): React.ComponentType<any> | null {
  switch (emailNumber) {
    case 1: return WelcomeEmail;
    case 2: return NudgeEmail;
    case 3: return TipsEmail;
    case 4: return TemplatesEmail;
    case 5: return DownloadPushEmail;
    case 6: return SuccessStoryEmail;
    case 7: return ReferralEmail;
    default: return null;
  }
}

export async function sendDripEmail(params: {
  to: string;
  firstName?: string;
  emailNumber: number;
  unsubscribeToken: string;
  hasCompletedResume: boolean;
  hasDownloadedPdf: boolean;
}): Promise<SendDripResult> {
  const { to, firstName, emailNumber, unsubscribeToken, hasCompletedResume, hasDownloadedPdf } = params;

  const config = getEmailConfig(emailNumber);
  if (!config) {
    return { success: false, error: `No config for email ${emailNumber}` };
  }

  // Check behavioral skip conditions
  if (config.skipIf === 'completed_resume' && hasCompletedResume) {
    return { success: true, skipped: true, reason: 'User already completed resume' };
  }
  if (config.skipIf === 'downloaded_pdf' && hasDownloadedPdf) {
    return { success: true, skipped: true, reason: 'User already downloaded PDF' };
  }

  const resend = getResend();
  if (!resend) {
    return { success: false, error: 'Resend not configured' };
  }

  const Component = getEmailComponent(emailNumber);
  if (!Component) {
    return { success: false, error: `No template for email ${emailNumber}` };
  }

  const unsubscribeUrl = getUnsubscribeUrl(unsubscribeToken);

  const props = emailNumber === 7
    ? { firstName, unsubscribeUrl, shareUrl: getShareUrl() }
    : { firstName, unsubscribeUrl, builderUrl: getBuilderUrl(emailNumber) };

  const html = await render(createElement(Component, props));
  const subject = pickSubject(config);

  const { data, error } = await resend.emails.send({
    from: 'Resumly <hello@resumly.app>',
    to,
    subject,
    html,
    headers: {
      'List-Unsubscribe': `<${unsubscribeUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, messageId: data?.id };
}

export function getNextEmailDueAt(currentEmailNumber: number, signupDate: Date): Date | null {
  const nextEmail = DRIP_SEQUENCE.find((e) => e.number === currentEmailNumber + 1);
  if (!nextEmail) return null; // sequence complete

  const dueAt = new Date(signupDate.getTime() + nextEmail.delayHours * 60 * 60 * 1000);
  return dueAt;
}

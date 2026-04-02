import { Heading, Text, Link } from '@react-email/components';
import { EmailLayout, EmailButton } from './components/layout';

interface Props {
  firstName?: string;
  unsubscribeUrl: string;
  shareUrl: string;
}

export default function ReferralEmail({ firstName, unsubscribeUrl, shareUrl }: Props) {
  const name = firstName || 'there';

  return (
    <EmailLayout preview="Know someone who needs a resume? Share Resumly" unsubscribeUrl={unsubscribeUrl}>
      <Heading style={heading}>Help a friend land their next job</Heading>

      <Text style={text}>
        Hi {name},
      </Text>

      <Text style={text}>
        Thanks for being part of Resumly! We&apos;re a small team building the best free resume
        builder out there, and every user who shares us helps us grow.
      </Text>

      <Text style={text}>
        If you know someone who&apos;s job hunting, looking to update their resume, or graduating soon,
        share Resumly with them. It&apos;s free and takes 3 minutes to get a professional resume.
      </Text>

      <EmailButton href={shareUrl}>Share Resumly →</EmailButton>

      <Text style={text}>
        Or just forward this email. Sometimes the simplest way is the best.
      </Text>

      <Text style={divider}>─ ─ ─</Text>

      <Text style={text}>
        <strong>One more thing:</strong> We&apos;d love your feedback. What&apos;s one thing we could do better?
        Just reply to this email. We read every response.
      </Text>

      <Text style={subtext}>
        Thank you for supporting Resumly. 💙
      </Text>
    </EmailLayout>
  );
}

const heading = { color: '#1e293b', fontSize: '24px', fontWeight: 700, margin: '16px 0' };
const text = { color: '#334155', fontSize: '15px', lineHeight: '24px', margin: '0 0 12px' };
const divider = { color: '#cbd5e1', fontSize: '14px', textAlign: 'center' as const, margin: '16px 0', letterSpacing: '4px' };
const subtext = { color: '#94a3b8', fontSize: '13px', lineHeight: '20px', margin: '0', textAlign: 'center' as const };

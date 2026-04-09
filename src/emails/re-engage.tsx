import { Heading, Text } from '@react-email/components';
import { EmailLayout, EmailButton } from './components/layout';

interface Props {
  firstName?: string;
  unsubscribeUrl: string;
  resumeUrl: string;
  completionPercent: number;
}

export default function ReEngageEmail({
  firstName,
  unsubscribeUrl,
  resumeUrl,
  completionPercent,
}: Props) {
  const name = firstName || 'there';
  const remaining = 100 - completionPercent;

  return (
    <EmailLayout
      preview="Your resume is 80% done — finish in 2 minutes"
      unsubscribeUrl={unsubscribeUrl}
    >
      <Heading style={heading}>Your resume is almost ready</Heading>

      <Text style={text}>Hi {name},</Text>

      <Text style={text}>
        You started building your resume on Resumly and you&apos;re already{' '}
        <strong>{completionPercent}% done</strong>. You only have {remaining}% left
        to go — that&apos;s about 2 minutes of work.
      </Text>

      {/* Progress bar */}
      <div style={progressContainer}>
        <div style={{ ...progressBar, width: `${Math.min(completionPercent, 100)}%` }} />
      </div>
      <Text style={progressText}>
        {completionPercent}% complete
      </Text>

      <Text style={text}>
        Don&apos;t let your hard work go to waste. Jump back in, finish the last few
        details, and download your professional, ATS-friendly resume as a PDF.
      </Text>

      <Text style={listItem}>&#10003; Professional templates that pass ATS scanners</Text>
      <Text style={listItem}>&#10003; AI-powered suggestions to improve your content</Text>
      <Text style={listItem}>&#10003; Instant PDF download — no watermarks</Text>

      <EmailButton href={resumeUrl}>Finish My Resume &rarr;</EmailButton>

      <Text style={subtext}>
        Most users complete their resume in under 10 minutes. You&apos;re almost there.
      </Text>
    </EmailLayout>
  );
}

const heading = {
  color: '#1e293b',
  fontSize: '24px',
  fontWeight: 700,
  margin: '16px 0',
};

const text = {
  color: '#334155',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 12px',
};

const listItem = {
  color: '#334155',
  fontSize: '15px',
  lineHeight: '28px',
  margin: '0',
  paddingLeft: '4px',
};

const subtext = {
  color: '#94a3b8',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '0',
  textAlign: 'center' as const,
};

const progressContainer = {
  backgroundColor: '#e2e8f0',
  borderRadius: '999px',
  height: '8px',
  margin: '8px 0 4px',
  overflow: 'hidden' as const,
};

const progressBar = {
  backgroundColor: '#1a91f0',
  borderRadius: '999px',
  height: '8px',
  transition: 'width 0.3s',
};

const progressText = {
  color: '#64748b',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '0 0 16px',
  textAlign: 'center' as const,
};

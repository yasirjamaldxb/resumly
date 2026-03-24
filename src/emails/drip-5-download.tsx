import { Heading, Text } from '@react-email/components';
import { EmailLayout, EmailButton } from './components/layout';

interface Props {
  firstName?: string;
  unsubscribeUrl: string;
  builderUrl: string;
}

export default function DownloadPushEmail({ firstName, unsubscribeUrl, builderUrl }: Props) {
  const name = firstName || 'there';

  return (
    <EmailLayout preview="Your resume is ready to download — one click away" unsubscribeUrl={unsubscribeUrl}>
      <Heading style={heading}>Your resume is ready 📄</Heading>

      <Text style={text}>
        Hi {name},
      </Text>

      <Text style={text}>
        You&apos;ve put in the work — now it&apos;s time to download your resume and start applying.
        Here&apos;s a quick checklist before you hit download:
      </Text>

      <Text style={checklist}>☑️ Contact info (email + phone number)</Text>
      <Text style={checklist}>☑️ Professional summary (2-3 sentences)</Text>
      <Text style={checklist}>☑️ Work experience with quantified achievements</Text>
      <Text style={checklist}>☑️ Education details</Text>
      <Text style={checklist}>☑️ Relevant skills (6-10 keywords)</Text>

      <Text style={text}>
        Your PDF will be ATS-friendly with real, selectable text — not an image.
        This means applicant tracking systems can read it properly, giving you the best
        chance of getting past automated screening.
      </Text>

      <EmailButton href={builderUrl}>Download Your Resume →</EmailButton>

      <Text style={subtext}>
        Completely free. No watermarks. No sign-up walls.
      </Text>
    </EmailLayout>
  );
}

const heading = { color: '#1e293b', fontSize: '24px', fontWeight: 700, margin: '16px 0' };
const text = { color: '#334155', fontSize: '15px', lineHeight: '24px', margin: '0 0 12px' };
const checklist = { color: '#334155', fontSize: '14px', lineHeight: '28px', margin: '0', paddingLeft: '4px' };
const subtext = { color: '#94a3b8', fontSize: '13px', lineHeight: '20px', margin: '0', textAlign: 'center' as const };

import { Heading, Text } from '@react-email/components';
import { EmailLayout, EmailButton } from './components/layout';

interface Props {
  firstName?: string;
  unsubscribeUrl: string;
  builderUrl: string;
}

export default function NudgeEmail({ firstName, unsubscribeUrl, builderUrl }: Props) {
  const name = firstName || 'there';

  return (
    <EmailLayout preview="Your resume is waiting — finish it in 5 minutes" unsubscribeUrl={unsubscribeUrl}>
      <Heading style={heading}>Pick up where you left off</Heading>

      <Text style={text}>
        Hi {name},
      </Text>

      <Text style={text}>
        You started your resume yesterday — don&apos;t let it sit unfinished!
        Most users complete theirs in just 5-10 minutes.
      </Text>

      <Text style={text}>
        Not sure what to write? Here are 3 quick wins:
      </Text>

      <Text style={tip}><strong>1. Start with your most recent job.</strong> Recruiters care most about your last 2-3 roles.</Text>
      <Text style={tip}><strong>2. Use numbers.</strong> &quot;Increased sales by 30%&quot; beats &quot;Responsible for sales.&quot;</Text>
      <Text style={tip}><strong>3. Use our AI Suggest button.</strong> It writes bullet points for you based on your job title.</Text>

      <EmailButton href={builderUrl}>Complete Your Resume →</EmailButton>

      <Text style={subtext}>
        Your progress is automatically saved — pick up right where you left off.
      </Text>
    </EmailLayout>
  );
}

const heading = { color: '#1e293b', fontSize: '24px', fontWeight: 700, margin: '16px 0' };
const text = { color: '#334155', fontSize: '15px', lineHeight: '24px', margin: '0 0 12px' };
const tip = { color: '#334155', fontSize: '14px', lineHeight: '22px', margin: '0 0 8px', paddingLeft: '8px', borderLeft: '3px solid #1a91f0' };
const subtext = { color: '#94a3b8', fontSize: '13px', lineHeight: '20px', margin: '0', textAlign: 'center' as const };

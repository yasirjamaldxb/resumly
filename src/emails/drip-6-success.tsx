import { Heading, Text } from '@react-email/components';
import { EmailLayout, EmailButton } from './components/layout';

interface Props {
  firstName?: string;
  unsubscribeUrl: string;
  builderUrl: string;
}

export default function SuccessStoryEmail({ firstName, unsubscribeUrl, builderUrl }: Props) {
  const name = firstName || 'there';

  return (
    <EmailLayout preview="How job seekers are landing interviews with Resumly" unsubscribeUrl={unsubscribeUrl}>
      <Heading style={heading}>People are getting hired</Heading>

      <Text style={text}>
        Hi {name},
      </Text>

      <Text style={text}>
        Here&apos;s what we&apos;re seeing from Resumly users who are landing interviews:
      </Text>

      <Text style={quote}>
        &quot;I was sending out resumes for weeks with no response. Switched to Resumly&apos;s ATS Pro template,
        rewrote my bullets with the AI suggestions, and got 3 interview calls in the first week.&quot;
      </Text>

      <Text style={text}>
        What they did differently:
      </Text>

      <Text style={tip}>
        <strong>1. Tailored each resume.</strong> They didn&apos;t send the same resume to every job.
        They tweaked keywords and their summary for each application.
      </Text>

      <Text style={tip}>
        <strong>2. Used numbers everywhere.</strong> &quot;Managed a team&quot; became &quot;Led a team of 8 engineers,
        delivering 3 projects ahead of schedule.&quot;
      </Text>

      <Text style={tip}>
        <strong>3. Kept it to one page.</strong> Concise, focused, and easy to scan in 7 seconds.
      </Text>

      <Text style={text}>
        Pro tip: You can duplicate your resume in Resumly and customize it for different roles.
        Same base, different keywords.
      </Text>

      <EmailButton href={builderUrl}>Update Your Resume →</EmailButton>
    </EmailLayout>
  );
}

const heading = { color: '#1e293b', fontSize: '24px', fontWeight: 700, margin: '16px 0' };
const text = { color: '#334155', fontSize: '15px', lineHeight: '24px', margin: '0 0 12px' };
const quote = { color: '#1e293b', fontSize: '15px', fontStyle: 'italic' as const, lineHeight: '24px', margin: '0 0 16px', padding: '16px', backgroundColor: '#f0f7ff', borderRadius: '8px', borderLeft: '4px solid #1a91f0' };
const tip = { color: '#334155', fontSize: '14px', lineHeight: '22px', margin: '0 0 8px', paddingLeft: '12px', borderLeft: '3px solid #e2e8f0' };

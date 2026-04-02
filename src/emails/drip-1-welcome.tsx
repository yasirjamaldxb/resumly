import { Heading, Text } from '@react-email/components';
import { EmailLayout, EmailButton } from './components/layout';

interface Props {
  firstName?: string;
  unsubscribeUrl: string;
  builderUrl: string;
}

export default function WelcomeEmail({ firstName, unsubscribeUrl, builderUrl }: Props) {
  const name = firstName || 'there';

  return (
    <EmailLayout preview="Welcome to Resumly. Your professional resume in minutes" unsubscribeUrl={unsubscribeUrl}>
      <Heading style={heading}>Welcome to Resumly! 🎉</Heading>

      <Text style={text}>
        Hi {name},
      </Text>

      <Text style={text}>
        Thanks for joining Resumly. You now have access to professional resume templates,
        AI-powered writing suggestions, and instant PDF downloads, all completely free.
      </Text>

      <Text style={text}>
        Most of our users build a polished, interview-ready resume in under 10 minutes.
        Here&apos;s how to get started:
      </Text>

      <Text style={listItem}>✅ Pick a professional template</Text>
      <Text style={listItem}>✅ Fill in your details (we guide you step by step)</Text>
      <Text style={listItem}>✅ Download your ATS-friendly PDF</Text>

      <EmailButton href={builderUrl}>Start Building Your Resume →</EmailButton>

      <Text style={subtext}>
        No credit card needed. No hidden fees. Just a great resume.
      </Text>
    </EmailLayout>
  );
}

const heading = { color: '#1e293b', fontSize: '24px', fontWeight: 700, margin: '16px 0' };
const text = { color: '#334155', fontSize: '15px', lineHeight: '24px', margin: '0 0 12px' };
const listItem = { color: '#334155', fontSize: '15px', lineHeight: '28px', margin: '0', paddingLeft: '4px' };
const subtext = { color: '#94a3b8', fontSize: '13px', lineHeight: '20px', margin: '0', textAlign: 'center' as const };

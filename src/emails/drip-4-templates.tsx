import { Heading, Text, Link } from '@react-email/components';
import { EmailLayout, EmailButton } from './components/layout';

interface Props {
  firstName?: string;
  unsubscribeUrl: string;
  builderUrl: string;
}

export default function TemplatesEmail({ firstName, unsubscribeUrl, builderUrl }: Props) {
  const name = firstName || 'there';

  return (
    <EmailLayout preview="Which resume style matches your industry?" unsubscribeUrl={unsubscribeUrl}>
      <Heading style={heading}>Find your perfect resume style</Heading>

      <Text style={text}>
        Hi {name},
      </Text>

      <Text style={text}>
        Did you know the right template can make a big difference? Here&apos;s a quick guide
        to choosing the best style for your industry:
      </Text>

      <Text style={template}>
        <strong>🏢 Corporate / Finance / Law</strong><br />
        Go with <strong>Classic</strong> or <strong>Professional</strong> — clean, traditional, no-nonsense.
      </Text>

      <Text style={template}>
        <strong>💻 Tech / Startup / Engineering</strong><br />
        Try <strong>ATS Pro</strong> or <strong>Technical</strong> — optimized for applicant tracking systems.
      </Text>

      <Text style={template}>
        <strong>🎨 Design / Marketing / Creative</strong><br />
        Use <strong>Modern</strong> or <strong>Creative</strong> — shows personality while staying professional.
      </Text>

      <Text style={template}>
        <strong>📋 General / Career Change</strong><br />
        <strong>Minimal</strong> or <strong>Elegant</strong> — versatile templates that work for any role.
      </Text>

      <Text style={text}>
        Switching templates is instant — your content stays, only the design changes.
        Try a few and see which one feels right.
      </Text>

      <EmailButton href={builderUrl}>Browse All 10 Templates →</EmailButton>

      <Text style={subtext}>
        You can also customize colors, fonts, and layout in the Customize tab.
      </Text>
    </EmailLayout>
  );
}

const heading = { color: '#1e293b', fontSize: '24px', fontWeight: 700, margin: '16px 0' };
const text = { color: '#334155', fontSize: '15px', lineHeight: '24px', margin: '0 0 12px' };
const template = { color: '#334155', fontSize: '14px', lineHeight: '22px', margin: '0 0 8px', padding: '12px 14px', backgroundColor: '#f0f7ff', borderRadius: '8px', borderLeft: '4px solid #1a91f0' };
const subtext = { color: '#94a3b8', fontSize: '13px', lineHeight: '20px', margin: '0', textAlign: 'center' as const };

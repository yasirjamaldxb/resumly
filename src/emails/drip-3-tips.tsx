import { Heading, Text } from '@react-email/components';
import { EmailLayout, EmailButton } from './components/layout';

interface Props {
  firstName?: string;
  unsubscribeUrl: string;
  builderUrl: string;
}

export default function TipsEmail({ firstName, unsubscribeUrl, builderUrl }: Props) {
  const name = firstName || 'there';

  return (
    <EmailLayout preview="5 resume mistakes that cost you interviews" unsubscribeUrl={unsubscribeUrl}>
      <Heading style={heading}>5 resume mistakes that cost interviews</Heading>

      <Text style={text}>
        Hi {name},
      </Text>

      <Text style={text}>
        Recruiters spend an average of 7 seconds scanning a resume. Here are the top mistakes
        that get resumes rejected, and how to avoid them:
      </Text>

      <Text style={tip}><strong>❌ Generic objective statements.</strong> Replace &quot;Seeking a challenging role&quot; with a specific professional summary that highlights your key skills.</Text>

      <Text style={tip}><strong>❌ Listing duties instead of achievements.</strong> Don&apos;t say what you were &quot;responsible for.&quot; Say what you accomplished and quantify it.</Text>

      <Text style={tip}><strong>❌ Poor formatting.</strong> Inconsistent fonts, misaligned sections, and walls of text make recruiters move on. Clean templates fix this instantly.</Text>

      <Text style={tip}><strong>❌ Missing keywords.</strong> Most companies use ATS (Applicant Tracking Systems). Your resume needs relevant keywords from the job description to pass the scan.</Text>

      <Text style={tip}><strong>❌ Too long or too short.</strong> One page for &lt;10 years experience, two pages max. Every line should earn its spot.</Text>

      <Text style={text}>
        Resumly&apos;s templates are designed to avoid all of these automatically: clean formatting,
        ATS-optimized structure, and AI suggestions to help you write stronger bullet points.
      </Text>

      <EmailButton href={builderUrl}>Apply These Tips to Your Resume →</EmailButton>
    </EmailLayout>
  );
}

const heading = { color: '#1e293b', fontSize: '24px', fontWeight: 700, margin: '16px 0' };
const text = { color: '#334155', fontSize: '15px', lineHeight: '24px', margin: '0 0 12px' };
const tip = { color: '#334155', fontSize: '14px', lineHeight: '22px', margin: '0 0 12px', padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '6px' };

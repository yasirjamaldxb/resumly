import { Heading, Text, Link, Section, Row, Column } from '@react-email/components';
import { EmailLayout, EmailButton } from './components/layout';

interface JobItem {
  title: string;
  company: string;
  location: string;
  salary?: string;
  url: string;
}

interface Props {
  firstName?: string;
  unsubscribeUrl: string;
  jobs: JobItem[];
  basedOn: string;
}

export default function JobAlertEmail({
  firstName,
  unsubscribeUrl,
  jobs,
  basedOn,
}: Props) {
  const name = firstName || 'there';

  return (
    <EmailLayout
      preview={`${jobs.length} new jobs matching your profile`}
      unsubscribeUrl={unsubscribeUrl}
    >
      <Heading style={heading}>
        {jobs.length} new jobs matching your profile
      </Heading>

      <Text style={text}>Hi {name},</Text>

      <Text style={subtext}>
        Based on your <strong>{basedOn}</strong> application
      </Text>

      {jobs.map((job, index) => (
        <Section key={index} style={jobCard}>
          <Row>
            <Column>
              <Text style={jobTitle}>{job.title}</Text>
              <Text style={jobMeta}>
                {job.company} &middot; {job.location}
              </Text>
              {job.salary && <Text style={jobSalary}>{job.salary}</Text>}
              <Link
                href={`https://resumly.app/job-preview?url=${encodeURIComponent(job.url)}`}
                style={applyLink}
              >
                Apply with your resume &rarr;
              </Link>
            </Column>
          </Row>
        </Section>
      ))}

      <EmailButton href="https://resumly.app/dashboard">
        See all recommendations
      </EmailButton>

      <Text style={footerNote}>
        You&apos;re receiving this because you enabled daily job alerts.
        You can turn them off in your{' '}
        <Link href="https://resumly.app/dashboard/settings" style={inlineLink}>
          dashboard settings
        </Link>
        .
      </Text>
    </EmailLayout>
  );
}

const heading = {
  color: '#1e293b',
  fontSize: '24px',
  fontWeight: 700 as const,
  margin: '16px 0',
};

const text = {
  color: '#334155',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 12px',
};

const subtext = {
  color: '#94a3b8',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '0 0 24px',
};

const jobCard = {
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '16px 20px',
  marginBottom: '12px',
};

const jobTitle = {
  color: '#1e293b',
  fontSize: '15px',
  fontWeight: 600 as const,
  lineHeight: '22px',
  margin: '0 0 4px',
};

const jobMeta = {
  color: '#64748b',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '0',
};

const jobSalary = {
  color: '#059669',
  fontSize: '13px',
  fontWeight: 600 as const,
  lineHeight: '20px',
  margin: '4px 0 0',
};

const applyLink = {
  color: '#1a91f0',
  fontSize: '13px',
  fontWeight: 600 as const,
  textDecoration: 'none' as const,
  display: 'inline-block' as const,
  marginTop: '8px',
};

const footerNote = {
  color: '#94a3b8',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0',
  textAlign: 'center' as const,
};

const inlineLink = {
  color: '#64748b',
  textDecoration: 'underline' as const,
};

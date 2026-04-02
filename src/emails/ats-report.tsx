import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface CheckItem {
  name: string;
  passed: boolean;
  score: number;
  maxScore: number;
  message: string;
}

interface CategoryData {
  checks: CheckItem[];
  score: number;
  maxScore: number;
}

interface Suggestion {
  title: string;
  category: string;
  fix: string;
}

interface ATSReportEmailProps {
  score: number;
  rating: string;
  wordCount: number;
  sections: string[];
  suggestions: Suggestion[];
  categories: Record<string, CategoryData>;
}

export default function ATSReportEmail({
  score = 72,
  rating = 'Good',
  wordCount = 450,
  sections = [],
  suggestions = [],
  categories = {},
}: ATSReportEmailProps) {
  const scoreColor = score >= 80 ? '#16a34a' : score >= 50 ? '#ca8a04' : '#dc2626';
  const scoreBg = score >= 80 ? '#f0fdf4' : score >= 50 ? '#fefce8' : '#fef2f2';

  return (
    <Html>
      <Head />
      <Preview>{`Your ATS Score: ${score}/100, ${rating} | Resumly`}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>Resumly</Text>
          </Section>

          {/* Score Card */}
          <Section style={{ ...scoreCard, backgroundColor: scoreBg }}>
            <Heading style={{ ...scoreNumber, color: scoreColor }}>{score}/100</Heading>
            <Text style={{ ...ratingBadge, backgroundColor: scoreColor }}>{rating}</Text>
            <Text style={scoreSubtext}>
              {score >= 90
                ? 'Excellent! Your resume is highly ATS-compatible.'
                : score >= 75
                  ? 'Good job! Your resume passes most ATS checks.'
                  : score >= 50
                    ? 'Your resume needs work to pass ATS screening.'
                    : 'Critical issues found. Your resume may be rejected by ATS.'}
            </Text>
            <Text style={statsRow}>
              {wordCount} words &bull; {sections.length}/4 sections found &bull; {suggestions.length} issue{suggestions.length !== 1 ? 's' : ''}
            </Text>
          </Section>

          {/* Category Breakdown */}
          <Section style={section}>
            <Heading as="h2" style={sectionTitle}>Category Breakdown</Heading>
            {Object.entries(categories).map(([name, cat]) => {
              const pct = Math.round((cat.score / cat.maxScore) * 100);
              const barColor = pct >= 80 ? '#16a34a' : pct >= 50 ? '#ca8a04' : '#dc2626';
              return (
                <div key={name} style={categoryRow}>
                  <Text style={categoryName}>
                    {name}: <span style={{ color: barColor, fontWeight: 700 }}>{pct}%</span>
                  </Text>
                  <div style={barTrack}>
                    <div style={{ ...barFill, width: `${pct}%`, backgroundColor: barColor }} />
                  </div>
                </div>
              );
            })}
          </Section>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <Section style={section}>
              <Heading as="h2" style={sectionTitle}>
                {suggestions.length} Issue{suggestions.length !== 1 ? 's' : ''} to Fix
              </Heading>
              {suggestions.map((s, i) => (
                <div key={i} style={suggestionCard}>
                  <Text style={suggestionNumber}>{i + 1}</Text>
                  <div>
                    <Text style={suggestionTitle}>
                      {s.title} <span style={suggestionBadge}>{s.category}</span>
                    </Text>
                    <Text style={suggestionFix}>{s.fix}</Text>
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* Detailed Checks */}
          <Section style={section}>
            <Heading as="h2" style={sectionTitle}>Detailed Check-by-Check</Heading>
            {Object.entries(categories).map(([catName, cat]) => (
              <div key={catName} style={{ marginBottom: '20px' }}>
                <Text style={catHeading}>{catName}</Text>
                {cat.checks.map((check, i) => (
                  <div key={i} style={checkRow}>
                    <Text style={{ ...checkIcon, color: check.passed ? '#16a34a' : '#dc2626' }}>
                      {check.passed ? '\u2713' : '\u2717'}
                    </Text>
                    <Text style={checkText}>
                      <strong>{check.name}</strong> ({check.score}/{check.maxScore}): {check.message}
                    </Text>
                  </div>
                ))}
              </div>
            ))}
          </Section>

          <Hr style={divider} />

          {/* CTA */}
          <Section style={{ textAlign: 'center' as const, padding: '20px 0' }}>
            <Text style={ctaText}>Want a resume that scores 90+?</Text>
            <Link href="https://resumly.app/resume-builder" style={ctaButton}>
              Build an ATS-Optimized Resume
            </Link>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              You received this email because you used the{' '}
              <Link href="https://resumly.app/ats-checker" style={footerLink}>Resumly ATS Checker</Link>.
            </Text>
            <Text style={footerText}>
              &copy; {new Date().getFullYear()} Resumly. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
};

const header = {
  backgroundColor: '#1a1a2e',
  padding: '24px 32px',
  textAlign: 'center' as const,
};

const logo = {
  color: '#ffffff',
  fontSize: '22px',
  fontWeight: 700 as const,
  margin: 0,
  letterSpacing: '-0.5px',
};

const scoreCard = {
  padding: '32px',
  textAlign: 'center' as const,
  borderBottom: '1px solid #e5e7eb',
};

const scoreNumber = {
  fontSize: '48px',
  fontWeight: 800 as const,
  margin: '0 0 8px 0',
  letterSpacing: '-1px',
};

const ratingBadge = {
  display: 'inline-block' as const,
  color: '#ffffff',
  fontSize: '13px',
  fontWeight: 700 as const,
  padding: '4px 14px',
  borderRadius: '20px',
  margin: '0 0 12px 0',
};

const scoreSubtext = {
  color: '#4b5563',
  fontSize: '14px',
  margin: '0 0 8px 0',
  lineHeight: '1.5',
};

const statsRow = {
  color: '#9ca3af',
  fontSize: '13px',
  margin: 0,
};

const section = {
  padding: '24px 32px',
};

const sectionTitle = {
  fontSize: '18px',
  fontWeight: 700 as const,
  color: '#1f2937',
  margin: '0 0 16px 0',
};

const categoryRow = {
  marginBottom: '12px',
};

const categoryName = {
  fontSize: '13px',
  color: '#374151',
  margin: '0 0 4px 0',
};

const barTrack = {
  height: '8px',
  backgroundColor: '#e5e7eb',
  borderRadius: '4px',
  overflow: 'hidden' as const,
};

const barFill = {
  height: '8px',
  borderRadius: '4px',
};

const suggestionCard = {
  display: 'flex' as const,
  gap: '12px',
  backgroundColor: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: '12px',
  padding: '14px',
  marginBottom: '10px',
};

const suggestionNumber = {
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  backgroundColor: '#fee2e2',
  color: '#dc2626',
  fontSize: '12px',
  fontWeight: 700 as const,
  textAlign: 'center' as const,
  lineHeight: '24px',
  flexShrink: 0,
  margin: 0,
};

const suggestionTitle = {
  fontSize: '14px',
  fontWeight: 600 as const,
  color: '#991b1b',
  margin: '0 0 4px 0',
};

const suggestionBadge = {
  fontSize: '11px',
  backgroundColor: '#fee2e2',
  color: '#dc2626',
  padding: '2px 8px',
  borderRadius: '10px',
  marginLeft: '6px',
};

const suggestionFix = {
  fontSize: '13px',
  color: '#b91c1c',
  margin: 0,
  lineHeight: '1.5',
};

const catHeading = {
  fontSize: '13px',
  fontWeight: 700 as const,
  color: '#6b7280',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 8px 0',
};

const checkRow = {
  display: 'flex' as const,
  gap: '8px',
  padding: '6px 0',
  borderBottom: '1px solid #f3f4f6',
};

const checkIcon = {
  fontSize: '14px',
  fontWeight: 700 as const,
  width: '20px',
  flexShrink: 0,
  margin: 0,
};

const checkText = {
  fontSize: '13px',
  color: '#4b5563',
  margin: 0,
  lineHeight: '1.4',
};

const divider = {
  borderColor: '#e5e7eb',
  margin: 0,
};

const ctaText = {
  fontSize: '16px',
  fontWeight: 600 as const,
  color: '#1f2937',
  margin: '0 0 16px 0',
};

const ctaButton = {
  display: 'inline-block' as const,
  backgroundColor: '#2563eb',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 600 as const,
  padding: '12px 28px',
  borderRadius: '8px',
  textDecoration: 'none',
};

const footer = {
  padding: '24px 32px',
  textAlign: 'center' as const,
};

const footerText = {
  fontSize: '12px',
  color: '#9ca3af',
  margin: '0 0 4px 0',
};

const footerLink = {
  color: '#2563eb',
  textDecoration: 'underline',
};

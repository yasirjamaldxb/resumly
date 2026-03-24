import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
  Img,
} from '@react-email/components';

interface EmailLayoutProps {
  preview: string;
  children: React.ReactNode;
  unsubscribeUrl: string;
}

export function EmailLayout({ preview, children, unsubscribeUrl }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>
              <span style={{ color: '#1a91f0', fontWeight: 700 }}>R</span>{' '}
              <span style={{ fontWeight: 700, color: '#1e293b' }}>resumly</span>
              <span style={{ color: '#94a3b8' }}>.app</span>
            </Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            {children}
          </Section>

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              Resumly — Free professional resume builder
            </Text>
            <Text style={footerText}>
              <Link href={unsubscribeUrl} style={unsubscribeLink}>
                Unsubscribe
              </Link>
              {' · '}
              <Link href="https://resumly.app/privacy" style={unsubscribeLink}>
                Privacy Policy
              </Link>
            </Text>
            <Text style={{ ...footerText, fontSize: '11px', color: '#94a3b8' }}>
              Dubai, United Arab Emirates
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function EmailButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Section style={{ textAlign: 'center', margin: '28px 0' }}>
      <Link href={href} style={button}>
        {children}
      </Link>
    </Section>
  );
}

const body = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  margin: '0',
  padding: '0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  margin: '40px auto',
  maxWidth: '560px',
  padding: '0',
};

const header = {
  padding: '24px 32px 0',
};

const logo = {
  fontSize: '20px',
  margin: '0',
};

const content = {
  padding: '8px 32px 32px',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '0',
};

const footer = {
  padding: '20px 32px',
};

const footerText = {
  color: '#64748b',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '0',
  textAlign: 'center' as const,
};

const unsubscribeLink = {
  color: '#64748b',
  textDecoration: 'underline',
};

const button = {
  backgroundColor: '#1a91f0',
  borderRadius: '8px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '15px',
  fontWeight: 600,
  lineHeight: '100%',
  padding: '14px 32px',
  textAlign: 'center' as const,
  textDecoration: 'none',
};

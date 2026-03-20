/**
 * Accurate mini-preview mockups for each of the 10 resume templates.
 * Each preview mirrors the actual template's layout structure.
 */

interface TemplatePreviewProps {
  templateId: string;
  color: string;
  className?: string;
}

const line = (w: string, h: number, bg: string, mb = 3, extra?: React.CSSProperties) => (
  <div style={{ width: w, height: h, backgroundColor: bg, borderRadius: 1, marginBottom: mb, ...extra }} />
);

const sectionLines = (lineColor: string, count = 3) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} style={{ height: 1.5, backgroundColor: lineColor, borderRadius: 1, width: `${90 - i * 8}%` }} />
    ))}
  </div>
);

const sectionBlock = (color: string, lineColor: string, label?: boolean) => (
  <div style={{ marginBottom: 6 }}>
    <div style={{ height: 2, backgroundColor: color, borderRadius: 1, width: 28, marginBottom: 3, opacity: 0.8 }} />
    {sectionLines(lineColor)}
  </div>
);

/** ATS Pro: Single column, name + colored border separator, clean sections */
function ATSProPreview({ color, lineColor, headerColor }: { color: string; lineColor: string; headerColor: string }) {
  return (
    <div style={{ padding: '8px 10px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 6, paddingBottom: 5, borderBottom: `2px solid ${color}` }}>
        {line('60%', 5, headerColor, 2)}
        {line('40%', 2.5, color, 2)}
        <div style={{ display: 'flex', gap: 4 }}>
          {line('20%', 1.5, lineColor, 0)}
          {line('18%', 1.5, lineColor, 0)}
          {line('22%', 1.5, lineColor, 0)}
        </div>
      </div>
      {sectionBlock(color, lineColor)}
      {sectionBlock(color, lineColor)}
      {sectionBlock(color, lineColor)}
      {sectionBlock(color, lineColor)}
    </div>
  );
}

/** Modern: Colored left sidebar with contact/skills, main content right */
function ModernPreview({ color, lineColor, headerColor }: { color: string; lineColor: string; headerColor: string }) {
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ width: '30%', backgroundColor: color, padding: '8px 5px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Photo placeholder */}
        <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.3)', alignSelf: 'center', marginBottom: 2 }} />
        {line('70%', 2, 'rgba(255,255,255,0.7)', 2)}
        {line('55%', 1.5, 'rgba(255,255,255,0.4)', 4)}
        {/* Sidebar sections */}
        {[1, 2, 3].map(i => (
          <div key={i} style={{ marginBottom: 3 }}>
            {line('50%', 1.5, 'rgba(255,255,255,0.6)', 2)}
            {[1, 2].map(j => <div key={j} style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 1, marginBottom: 2, width: `${55 + j * 10}%` }} />)}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, padding: '8px 7px', display: 'flex', flexDirection: 'column' }}>
        {line('65%', 4, headerColor, 2)}
        {line('45%', 2, color, 5)}
        {sectionBlock(color, lineColor)}
        {sectionBlock(color, lineColor)}
        {sectionBlock(color, lineColor)}
      </div>
    </div>
  );
}

/** Professional: Single column, colored header bar, traditional layout */
function ProfessionalPreview({ color, lineColor, headerColor }: { color: string; lineColor: string; headerColor: string }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ backgroundColor: color, padding: '8px 10px', marginBottom: 1 }}>
        {line('55%', 4, 'rgba(255,255,255,0.9)', 2)}
        {line('35%', 2, 'rgba(255,255,255,0.6)', 2)}
        <div style={{ display: 'flex', gap: 4 }}>
          {line('18%', 1.5, 'rgba(255,255,255,0.4)', 0)}
          {line('16%', 1.5, 'rgba(255,255,255,0.4)', 0)}
          {line('20%', 1.5, 'rgba(255,255,255,0.4)', 0)}
        </div>
      </div>
      <div style={{ padding: '6px 10px', flex: 1 }}>
        {sectionBlock(color, lineColor)}
        {sectionBlock(color, lineColor)}
        {sectionBlock(color, lineColor)}
        {sectionBlock(color, lineColor)}
      </div>
    </div>
  );
}

/** Minimal: Single column, very clean, lots of whitespace, subtle styling */
function MinimalPreview({ color, lineColor, headerColor }: { color: string; lineColor: string; headerColor: string }) {
  return (
    <div style={{ padding: '10px 12px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 8 }}>
        {line('50%', 4, headerColor, 2)}
        {line('30%', 2, color, 3)}
        <div style={{ display: 'flex', gap: 6 }}>
          {line('15%', 1.5, lineColor, 0)}
          {line('15%', 1.5, lineColor, 0)}
        </div>
      </div>
      <div style={{ marginBottom: 8, borderTop: `1px solid ${lineColor}`, paddingTop: 5 }}>
        {sectionLines(lineColor, 2)}
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ marginBottom: 7, borderTop: `1px solid ${lineColor}`, paddingTop: 4 }}>
          {line('24%', 2, color, 3, { opacity: 0.7 })}
          {sectionLines(lineColor, 2)}
        </div>
      ))}
    </div>
  );
}

/** Executive: Thin left accent bar, bold header with optional photo, single column */
function ExecutivePreview({ color, lineColor, headerColor }: { color: string; lineColor: string; headerColor: string }) {
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ width: 4, backgroundColor: color, flexShrink: 0 }} />
      <div style={{ flex: 1, padding: '8px 9px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
          <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: `${color}22`, flexShrink: 0 }} />
          <div>
            {line('90%', 4, headerColor, 1)}
            {line('60%', 2, color, 0)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 3, marginBottom: 6 }}>
          {line('18%', 1.5, lineColor, 0)}
          {line('16%', 1.5, lineColor, 0)}
          {line('20%', 1.5, lineColor, 0)}
        </div>
        {sectionBlock(color, lineColor)}
        {sectionBlock(color, lineColor)}
        {sectionBlock(color, lineColor)}
        {sectionBlock(color, lineColor)}
      </div>
    </div>
  );
}

/** Creative: Main content LEFT, colored sidebar RIGHT */
function CreativePreview({ color, lineColor, headerColor }: { color: string; lineColor: string; headerColor: string }) {
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ flex: 1, padding: '8px 7px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 6, paddingBottom: 4, borderBottom: `2px solid ${color}` }}>
          {line('55%', 4.5, headerColor, 2)}
          {line('35%', 2, color, 0)}
        </div>
        {sectionBlock(color, lineColor)}
        {sectionBlock(color, lineColor)}
        {sectionBlock(color, lineColor)}
      </div>
      <div style={{ width: '28%', backgroundColor: color, padding: '8px 5px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.3)', alignSelf: 'center', marginBottom: 2 }} />
        {[1, 2, 3].map(i => (
          <div key={i} style={{ marginBottom: 2 }}>
            {line('50%', 1.5, 'rgba(255,255,255,0.6)', 2)}
            {[1, 2].map(j => <div key={j} style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 1, marginBottom: 2, width: `${50 + j * 12}%` }} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Compact: Single column, dense two-column header, tight spacing */
function CompactPreview({ color, lineColor, headerColor }: { color: string; lineColor: string; headerColor: string }) {
  return (
    <div style={{ padding: '6px 8px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5, paddingBottom: 4, borderBottom: `1px solid ${lineColor}` }}>
        <div>
          {line('80px', 4, headerColor, 1)}
          {line('50px', 2, color, 0)}
        </div>
        <div style={{ textAlign: 'right' }}>
          {[1, 2, 3].map(i => <div key={i} style={{ height: 1.5, backgroundColor: lineColor, borderRadius: 1, marginBottom: 1.5, width: 30, marginLeft: 'auto' }} />)}
        </div>
      </div>
      {/* Dense sections */}
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{ marginBottom: 4 }}>
          {line('26%', 1.5, color, 2, { opacity: 0.8 })}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {[1, 2, 3].map(j => <div key={j} style={{ height: 1.5, backgroundColor: lineColor, borderRadius: 1, width: `${88 - j * 6}%` }} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Elegant: Single column, centered header with subtle colored background, serif feel */
function ElegantPreview({ color, lineColor, headerColor }: { color: string; lineColor: string; headerColor: string }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ backgroundColor: `${color}0D`, padding: '10px 10px 8px', textAlign: 'center', marginBottom: 1 }}>
        {line('45%', 4.5, headerColor, 2, { margin: '0 auto 2px' })}
        {line('30%', 2, color, 3, { margin: '0 auto 3px' })}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
          {line('15%', 1.5, lineColor, 0)}
          {line('15%', 1.5, lineColor, 0)}
          {line('15%', 1.5, lineColor, 0)}
        </div>
      </div>
      <div style={{ padding: '6px 12px', flex: 1 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ marginBottom: 6, textAlign: 'center' }}>
            {line('30%', 2, color, 3, { margin: '0 auto 3px', opacity: 0.7 })}
            <div style={{ borderTop: `1px solid ${color}33`, paddingTop: 3 }}>
              {sectionLines(lineColor, 3)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Technical: Colored left sidebar, similar to Modern but darker/tech feel */
function TechnicalPreview({ color, lineColor, headerColor }: { color: string; lineColor: string; headerColor: string }) {
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ width: '32%', backgroundColor: color, padding: '8px 5px', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {line('65%', 3, 'rgba(255,255,255,0.8)', 2)}
        {line('50%', 2, 'rgba(255,255,255,0.5)', 4)}
        {/* Skills bars */}
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ marginBottom: 2 }}>
            {line(`${40 + i * 5}%`, 1.5, 'rgba(255,255,255,0.4)', 1)}
            <div style={{ height: 2.5, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 1 }}>
              <div style={{ height: '100%', width: `${50 + i * 12}%`, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 1 }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, padding: '8px 7px', display: 'flex', flexDirection: 'column' }}>
        {line('70%', 4, headerColor, 2)}
        {line('45%', 2, color, 5)}
        {sectionBlock(color, lineColor)}
        {sectionBlock(color, lineColor)}
        {sectionBlock(color, lineColor)}
      </div>
    </div>
  );
}

/** Classic: Single column, centered header, traditional Harvard-style */
function ClassicPreview({ color, lineColor, headerColor }: { color: string; lineColor: string; headerColor: string }) {
  return (
    <div style={{ padding: '8px 10px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ textAlign: 'center', marginBottom: 5, paddingBottom: 5, borderBottom: `1.5px solid ${headerColor}` }}>
        {line('50%', 5, headerColor, 2, { margin: '0 auto 2px' })}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
          {line('16%', 1.5, lineColor, 0)}
          {line('18%', 1.5, lineColor, 0)}
          {line('14%', 1.5, lineColor, 0)}
        </div>
      </div>
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{ marginBottom: 5 }}>
          <div style={{ height: 2, backgroundColor: headerColor, borderRadius: 1, width: 32, marginBottom: 2, textTransform: 'uppercase' }} />
          <div style={{ borderTop: `1px solid ${headerColor}`, paddingTop: 3 }}>
            {sectionLines(lineColor, 3)}
          </div>
        </div>
      ))}
    </div>
  );
}

const PREVIEW_MAP: Record<string, React.FC<{ color: string; lineColor: string; headerColor: string }>> = {
  'ats-pro': ATSProPreview,
  modern: ModernPreview,
  professional: ProfessionalPreview,
  minimal: MinimalPreview,
  executive: ExecutivePreview,
  creative: CreativePreview,
  compact: CompactPreview,
  elegant: ElegantPreview,
  technical: TechnicalPreview,
  classic: ClassicPreview,
};

export function TemplatePreview({ templateId, color, className }: TemplatePreviewProps) {
  const Preview = PREVIEW_MAP[templateId] || ATSProPreview;
  const lineColor = '#dde0e6';
  const headerColor = '#2d3142';

  return (
    <div className={className} style={{ overflow: 'hidden', backgroundColor: '#ffffff' }}>
      <Preview color={color} lineColor={lineColor} headerColor={headerColor} />
    </div>
  );
}

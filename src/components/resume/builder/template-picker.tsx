'use client';

import { ResumeData, TEMPLATE_LIST } from '@/types/resume';
import { cn } from '@/lib/utils';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const COLORS = [
  { name: 'Blue', value: '#2563eb' },
  { name: 'Navy', value: '#1e3a5f' },
  { name: 'Teal', value: '#0d9488' },
  { name: 'Green', value: '#16a34a' },
  { name: 'Purple', value: '#7c3aed' },
  { name: 'Dark', value: '#1a1a2e' },
  { name: 'Red', value: '#dc2626' },
  { name: 'Orange', value: '#ea580c' },
];

const LAYOUT_PREVIEWS: Record<string, 'single' | 'sidebar-left' | 'sidebar-right' | 'accent-bar'> = {
  'ats-pro': 'single',
  'modern': 'sidebar-left',
  'professional': 'single',
  'minimal': 'single',
  'executive': 'accent-bar',
  'creative': 'sidebar-right',
  'compact': 'single',
  'elegant': 'single',
  'technical': 'sidebar-left',
  'classic': 'single',
};

function TemplateMiniPreview({ templateId, color, selected }: { templateId: string; color: string; selected: boolean }) {
  const layout = LAYOUT_PREVIEWS[templateId] || 'single';
  const accent = selected ? color : '#c4c9d4';
  const lineColor = selected ? '#bcc3d0' : '#dde0e6';
  const headerColor = selected ? '#4a5068' : '#9fa4b0';

  if (layout === 'sidebar-left') {
    return (
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <div style={{ width: '32%', backgroundColor: accent, padding: '8px 6px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ height: 3, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 1, width: '70%' }} />
          <div style={{ height: 2, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 1, width: '50%' }} />
          <div style={{ marginTop: 6 }}>
            {[1,2,3].map(i => <div key={i} style={{ height: 2, backgroundColor: 'rgba(255,255,255,0.35)', borderRadius: 1, marginBottom: 3, width: `${60 + i * 10}%` }} />)}
          </div>
        </div>
        <div style={{ flex: 1, padding: '8px 6px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {[1,2,3,4,5].map(i => <div key={i} style={{ height: 2, backgroundColor: lineColor, borderRadius: 1, width: `${70 + (i % 3) * 10}%` }} />)}
        </div>
      </div>
    );
  }

  if (layout === 'sidebar-right') {
    return (
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <div style={{ flex: 1, padding: '8px 6px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ height: 4, backgroundColor: headerColor, borderRadius: 1, width: '60%' }} />
          <div style={{ height: 2, backgroundColor: accent, borderRadius: 1, width: '35%', marginBottom: 4 }} />
          {[1,2,3,4].map(i => <div key={i} style={{ height: 2, backgroundColor: lineColor, borderRadius: 1, width: `${65 + (i % 3) * 10}%` }} />)}
        </div>
        <div style={{ width: '30%', backgroundColor: '#f3f4f6', padding: '8px 6px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {[1,2,3].map(i => <div key={i} style={{ height: 2, backgroundColor: '#ccd0d8', borderRadius: 1, width: `${60 + i * 10}%` }} />)}
        </div>
      </div>
    );
  }

  if (layout === 'accent-bar') {
    return (
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <div style={{ width: 5, backgroundColor: accent, flexShrink: 0 }} />
        <div style={{ flex: 1, padding: '8px 6px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ height: 4, backgroundColor: headerColor, borderRadius: 1, width: '55%' }} />
          <div style={{ height: 2, backgroundColor: accent, borderRadius: 1, width: '30%', marginBottom: 4 }} />
          {[1,2,3,4,5].map(i => <div key={i} style={{ height: 2, backgroundColor: lineColor, borderRadius: 1, width: `${65 + (i % 3) * 10}%` }} />)}
        </div>
      </div>
    );
  }

  // single column
  return (
    <div style={{ padding: '8px 6px', display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
      <div style={{ height: 4, backgroundColor: headerColor, borderRadius: 1, width: '55%', ...(templateId === 'elegant' || templateId === 'classic' ? { alignSelf: 'center' } : {}) }} />
      <div style={{ height: 2, backgroundColor: accent, borderRadius: 1, width: '35%', marginBottom: 4, ...(templateId === 'elegant' || templateId === 'classic' ? { alignSelf: 'center' } : {}) }} />
      {templateId === 'ats-pro' && <div style={{ height: 1, backgroundColor: accent, width: '100%', marginBottom: 2 }} />}
      {[1,2,3,4,5].map(i => <div key={i} style={{ height: 2, backgroundColor: lineColor, borderRadius: 1, width: `${65 + (i % 3) * 10}%` }} />)}
    </div>
  );
}

export function TemplatePicker({ data, onChange }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Choose Template</h2>
        <p className="text-sm text-gray-500">All templates are ATS-optimized. Your content, beautifully presented.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-3">
        {TEMPLATE_LIST.map((template) => {
          const isSelected = data.templateId === template.id;
          return (
            <button
              key={template.id}
              onClick={() => onChange({ ...data, templateId: template.id })}
              className={cn(
                'relative rounded-xl border-2 p-2.5 text-left transition-all',
                isSelected
                  ? 'border-blue-600 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 bg-white'
              )}
            >
              {template.popular && (
                <span className="absolute top-1.5 right-1.5 bg-blue-600 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full z-10">
                  Popular
                </span>
              )}
              {/* Template preview */}
              <div className="w-full aspect-[0.75] bg-white rounded-lg border border-gray-200 overflow-hidden mb-2">
                <TemplateMiniPreview templateId={template.id} color={data.colorScheme} selected={isSelected} />
              </div>
              <div>
                <p className="font-semibold text-xs text-gray-900">{template.name}</p>
                <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{template.description}</p>
              </div>
              <div className="mt-1.5 flex items-center gap-1">
                <div className={cn('w-1.5 h-1.5 rounded-full', template.atsScore >= 95 ? 'bg-green-500' : template.atsScore >= 85 ? 'bg-green-400' : 'bg-yellow-500')} />
                <span className="text-[10px] text-gray-600">{template.atsScore}% ATS</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Color picker */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Accent Color</h3>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => onChange({ ...data, colorScheme: color.value })}
              className={cn(
                'w-8 h-8 rounded-full border-2 transition-transform hover:scale-110',
                data.colorScheme === color.value ? 'border-gray-900 scale-110' : 'border-transparent'
              )}
              style={{ backgroundColor: color.value }}
              title={color.name}
              aria-label={`${color.name} color`}
            />
          ))}
          <div className="flex items-center gap-1.5 ml-2">
            <input
              type="color"
              value={data.colorScheme}
              onChange={(e) => onChange({ ...data, colorScheme: e.target.value })}
              className="w-8 h-8 rounded-full border-2 border-gray-200 cursor-pointer"
              title="Custom color"
            />
            <span className="text-xs text-gray-500">Custom</span>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { ResumeData, TEMPLATE_LIST } from '@/types/resume';
import { cn } from '@/lib/utils';
import { TemplatePreview } from '@/components/resume/template-preview';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const FONTS = [
  { name: 'Inter', value: 'inter', css: 'Inter, sans-serif' },
  { name: 'Georgia', value: 'georgia', css: 'Georgia, serif' },
  { name: 'Times New Roman', value: 'times', css: '"Times New Roman", serif' },
  { name: 'Arial', value: 'arial', css: 'Arial, Helvetica, sans-serif' },
  { name: 'Garamond', value: 'garamond', css: 'Garamond, Georgia, serif' },
  { name: 'Calibri', value: 'calibri', css: 'Calibri, Candara, sans-serif' },
];

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

export function TemplatePicker({ data, onChange }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-neutral-90 mb-1">Choose Template</h2>
        <p className="text-sm text-neutral-50">All templates are ATS-optimized. Your content, beautifully presented.</p>
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
                  ? 'border-primary bg-primary-light shadow-md'
                  : 'border-neutral-20 hover:border-primary bg-white'
              )}
            >
              {template.popular && (
                <span className="absolute top-1.5 right-1.5 bg-primary text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full z-10">
                  Popular
                </span>
              )}
              {/* Template preview */}
              <div className="w-full aspect-[0.75] bg-white rounded-lg border border-neutral-20 overflow-hidden mb-2">
                <TemplatePreview templateId={template.id} color={isSelected ? data.colorScheme : '#9ca3af'} className="w-full h-full" />
              </div>
              <div>
                <p className="font-semibold text-xs text-neutral-90">{template.name}</p>
                <p className="text-[10px] text-neutral-50 mt-0.5 line-clamp-1">{template.description}</p>
              </div>
              <div className="mt-1.5 flex items-center gap-1">
                <div className={cn('w-1.5 h-1.5 rounded-full', template.atsScore >= 95 ? 'bg-green-500' : template.atsScore >= 85 ? 'bg-green-400' : 'bg-yellow-500')} />
                <span className="text-[10px] text-neutral-60">{template.atsScore}% ATS</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Font picker */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-90 mb-3">Font</h3>
        <div className="grid grid-cols-3 gap-2">
          {FONTS.map((font) => (
            <button
              key={font.value}
              onClick={() => onChange({ ...data, fontFamily: font.value })}
              className={cn(
                'px-3 py-2 rounded-lg border text-xs text-left transition-all',
                data.fontFamily === font.value
                  ? 'border-primary bg-primary-light text-primary-dark font-medium'
                  : 'border-neutral-20 bg-white text-neutral-60 hover:border-primary'
              )}
              style={{ fontFamily: font.css }}
            >
              {font.name}
            </button>
          ))}
        </div>
      </div>

      {/* Color picker */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-90 mb-3">Accent Color</h3>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => onChange({ ...data, colorScheme: color.value })}
              className={cn(
                'w-8 h-8 rounded-full border-2 transition-transform hover:scale-110',
                data.colorScheme === color.value ? 'border-neutral-90 scale-110' : 'border-transparent'
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
              className="w-8 h-8 rounded-full border-2 border-neutral-20 cursor-pointer"
              title="Custom color"
            />
            <span className="text-xs text-neutral-50">Custom</span>
          </div>
        </div>
      </div>
    </div>
  );
}

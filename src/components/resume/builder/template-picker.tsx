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

export function TemplatePicker({ data, onChange }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Choose Template</h2>
        <p className="text-sm text-gray-500">All templates are ATS-optimized. Your content, beautifully presented.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {TEMPLATE_LIST.map((template) => (
          <button
            key={template.id}
            onClick={() => onChange({ ...data, templateId: template.id })}
            className={cn(
              'relative rounded-xl border-2 p-3 text-left transition-all',
              data.templateId === template.id
                ? 'border-blue-600 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-blue-300 bg-white'
            )}
          >
            {template.popular && (
              <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-medium px-1.5 py-0.5 rounded-full">
                Popular
              </span>
            )}
            {/* Template preview placeholder */}
            <div className="w-full aspect-[0.7] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full p-2">
                <div className="h-2 w-3/4 bg-gray-400 rounded mb-1.5" style={{ backgroundColor: data.templateId === template.id ? data.colorScheme : undefined }} />
                <div className="h-1 w-1/2 bg-gray-300 rounded mb-3" />
                <div className="space-y-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-1 bg-gray-200 rounded" style={{ width: `${70 + Math.random() * 30}%` }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-sm text-gray-900">{template.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{template.description}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-gray-600">{template.atsScore}% ATS Score</span>
            </div>
          </button>
        ))}
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

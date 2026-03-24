'use client';

import { useState } from 'react';
import { ResumeData, ResumeLayoutSettings, TEMPLATE_LIST, DEFAULT_LAYOUT_SETTINGS } from '@/types/resume';
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

const TABS = ['Template & Colors', 'Text', 'Layout'] as const;
type TabId = typeof TABS[number];

const DATE_FORMATS = ['MM/YYYY', 'MMM YYYY', 'MMMM YYYY', 'MM-YYYY'];

const FONT_SIZES: { label: string; value: ResumeLayoutSettings['fontSize'] }[] = [
  { label: 'S', value: 'small' },
  { label: 'M', value: 'medium' },
  { label: 'L', value: 'large' },
];

export function TemplatePicker({ data, onChange }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('Template & Colors');

  const settings = data.layoutSettings ?? DEFAULT_LAYOUT_SETTINGS;

  const updateLayout = (field: keyof ResumeLayoutSettings, value: ResumeLayoutSettings[typeof field]) => {
    onChange({
      ...data,
      layoutSettings: {
        ...(data.layoutSettings ?? DEFAULT_LAYOUT_SETTINGS),
        [field]: value,
      },
    });
  };

  const updateMargin = (field: keyof ResumeLayoutSettings['margins'], value: number) => {
    onChange({
      ...data,
      layoutSettings: {
        ...settings,
        margins: {
          ...settings.margins,
          [field]: value,
        },
      },
    });
  };

  const currentFont = FONTS.find((f) => f.value === data.fontFamily) ?? FONTS[0];

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex border-b border-neutral-20">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 pb-2.5 pt-1 text-xs font-medium text-center transition-colors relative',
              activeTab === tab
                ? 'text-neutral-90'
                : 'text-neutral-40 hover:text-neutral-60'
            )}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Sub-tab 1: Template & Colors */}
      {activeTab === 'Template & Colors' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-neutral-90 mb-1">Choose Template</h2>
            <p className="text-sm text-neutral-50">All templates are ATS-optimized. Your content, beautifully presented.</p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {TEMPLATE_LIST.map((template) => {
              const isSelected = data.templateId === template.id;
              return (
                <button
                  key={template.id}
                  onClick={() => onChange({ ...data, templateId: template.id })}
                  className={cn(
                    'group relative rounded-lg border-2 p-1.5 text-left transition-all',
                    isSelected
                      ? 'border-primary bg-primary-light shadow-md'
                      : 'border-neutral-20 hover:border-primary bg-white'
                  )}
                >
                  {isSelected && (
                    <span className="absolute top-2 left-1/2 -translate-x-1/2 z-10 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-sm">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                  {template.popular && !isSelected && (
                    <span className="absolute top-1 right-1 bg-primary text-white text-[8px] font-medium px-1 py-0.5 rounded z-10 leading-none">
                      Popular
                    </span>
                  )}
                  <div className="w-full aspect-[0.77] bg-white rounded border border-neutral-15 overflow-hidden mb-1.5">
                    <TemplatePreview templateId={template.id} color={isSelected ? data.colorScheme : '#9ca3af'} className="w-full h-full" />
                  </div>
                  <p className="font-medium text-[10px] text-neutral-80 text-center truncate">{template.name}</p>
                  <div className="flex items-center justify-center gap-0.5 mt-0.5">
                    <div className={cn('w-1 h-1 rounded-full', template.atsScore >= 95 ? 'bg-green-500' : template.atsScore >= 85 ? 'bg-green-400' : 'bg-yellow-500')} />
                    <span className="text-[8px] text-neutral-50">{template.atsScore}% ATS</span>
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
      )}

      {/* Sub-tab 2: Text */}
      {activeTab === 'Text' && (
        <div className="space-y-7">
          {/* Primary Font */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-90 mb-3">Primary Font</h3>
            {/* Current font display */}
            <div className="mb-3 px-3 py-2.5 rounded-lg border border-neutral-20 bg-neutral-5 flex items-center justify-between">
              <span className="text-sm text-neutral-90 font-medium" style={{ fontFamily: currentFont.css }}>
                {currentFont.name}
              </span>
              <svg className="w-4 h-4 text-neutral-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
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

          {/* Line Height */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-neutral-90">Line Height</h3>
              <span className="text-sm text-neutral-60 tabular-nums">{Math.round(settings.lineHeight * 100)}%</span>
            </div>
            <div className="relative flex items-center">
              <input
                type="range"
                min={1.0}
                max={2.0}
                step={0.05}
                value={settings.lineHeight}
                onChange={(e) => updateLayout('lineHeight', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-neutral-10 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
                  [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-primary
                  [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2
                  [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
                style={{
                  background: `linear-gradient(to right, var(--color-primary, #2563eb) ${((settings.lineHeight - 1.0) / 1.0) * 100}%, #e5e5e5 ${((settings.lineHeight - 1.0) / 1.0) * 100}%)`,
                }}
              />
            </div>
          </div>

          {/* Font Size */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-90 mb-3">Font Size</h3>
            <div className="flex gap-2">
              {FONT_SIZES.map((size) => (
                <button
                  key={size.value}
                  onClick={() => updateLayout('fontSize', size.value)}
                  className={cn(
                    'flex-1 py-2 rounded-full text-sm font-medium transition-all',
                    settings.fontSize === size.value
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-neutral-10 text-neutral-60 hover:bg-neutral-20'
                  )}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 3: Layout */}
      {activeTab === 'Layout' && (
        <div className="space-y-7">
          {/* Format */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-90 mb-2">Format</h3>
            <select
              value={settings.pageFormat}
              onChange={(e) => updateLayout('pageFormat', e.target.value as 'a4' | 'letter')}
              className="w-full px-3 py-2.5 rounded-lg border border-neutral-20 bg-white text-sm text-neutral-90 focus:outline-none focus:border-primary"
            >
              <option value="a4">A4 (210 x 297 mm)</option>
              <option value="letter">Letter (8.5 x 11 in)</option>
            </select>
          </div>

          {/* Margins & Paddings */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-90 mb-4">Margins & Paddings</h3>
            <div className="space-y-5">
              {/* Top & Bottom */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-neutral-60">Top & bottom</span>
                  <span className="text-xs text-neutral-60 tabular-nums">{settings.margins.topBottom} pt</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={80}
                  step={1}
                  value={settings.margins.topBottom}
                  onChange={(e) => updateMargin('topBottom', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-neutral-10 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
                    [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-primary
                    [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2
                    [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
                  style={{
                    background: `linear-gradient(to right, var(--color-primary, #2563eb) ${((settings.margins.topBottom - 20) / 60) * 100}%, #e5e5e5 ${((settings.margins.topBottom - 20) / 60) * 100}%)`,
                  }}
                />
              </div>

              {/* Left & Right */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-neutral-60">Left & right</span>
                  <span className="text-xs text-neutral-60 tabular-nums">{settings.margins.leftRight} pt</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={80}
                  step={1}
                  value={settings.margins.leftRight}
                  onChange={(e) => updateMargin('leftRight', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-neutral-10 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
                    [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-primary
                    [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2
                    [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
                  style={{
                    background: `linear-gradient(to right, var(--color-primary, #2563eb) ${((settings.margins.leftRight - 20) / 60) * 100}%, #e5e5e5 ${((settings.margins.leftRight - 20) / 60) * 100}%)`,
                  }}
                />
              </div>

              {/* Between Sections */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-neutral-60">Between sections</span>
                  <span className="text-xs text-neutral-60 tabular-nums">{settings.margins.betweenSections} pt</span>
                </div>
                <input
                  type="range"
                  min={8}
                  max={32}
                  step={1}
                  value={settings.margins.betweenSections}
                  onChange={(e) => updateMargin('betweenSections', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-neutral-10 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
                    [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-primary
                    [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2
                    [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
                  style={{
                    background: `linear-gradient(to right, var(--color-primary, #2563eb) ${((settings.margins.betweenSections - 8) / 24) * 100}%, #e5e5e5 ${((settings.margins.betweenSections - 8) / 24) * 100}%)`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Date Format */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-90 mb-2">Date format</h3>
            <select
              value={settings.dateFormat}
              onChange={(e) => updateLayout('dateFormat', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-neutral-20 bg-white text-sm text-neutral-90 focus:outline-none focus:border-primary"
            >
              {DATE_FORMATS.map((fmt) => (
                <option key={fmt} value={fmt}>{fmt}</option>
              ))}
            </select>
          </div>

          {/* Header Alignment */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-90 mb-3">Header Alignment</h3>
            <div className="grid grid-cols-3 gap-2">
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  onClick={() => updateLayout('headerAlignment', align)}
                  className={cn(
                    'rounded-lg border-2 p-3 transition-all',
                    settings.headerAlignment === align
                      ? 'border-primary bg-primary-light'
                      : 'border-neutral-20 bg-white hover:border-neutral-30'
                  )}
                >
                  {/* Mini header mockup */}
                  <div className={cn('space-y-1.5', align === 'center' ? 'flex flex-col items-center' : align === 'right' ? 'flex flex-col items-end' : '')}>
                    <div className="h-1.5 w-10 bg-neutral-70 rounded-full" />
                    <div className="h-1 w-14 bg-neutral-30 rounded-full" />
                    <div className="h-1 w-8 bg-neutral-20 rounded-full" />
                  </div>
                  {/* Full-width body lines */}
                  <div className="mt-3 space-y-1">
                    <div className="h-0.5 w-full bg-neutral-15 rounded-full" />
                    <div className="h-0.5 w-full bg-neutral-15 rounded-full" />
                    <div className="h-0.5 w-3/4 bg-neutral-15 rounded-full" />
                  </div>
                  <p className="text-[10px] text-neutral-50 mt-2 capitalize text-center">{align}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Date Alignment */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-90 mb-3">Date Alignment</h3>
            <div className="grid grid-cols-2 gap-2">
              {(['left', 'right'] as const).map((align) => (
                <button
                  key={align}
                  onClick={() => updateLayout('dateAlignment', align)}
                  className={cn(
                    'rounded-lg border-2 p-3 transition-all',
                    settings.dateAlignment === align
                      ? 'border-primary bg-primary-light'
                      : 'border-neutral-20 bg-white hover:border-neutral-30'
                  )}
                >
                  {/* Mini entry mockup with date positioning */}
                  <div className="space-y-2">
                    {/* Entry row */}
                    <div className={cn('flex items-center gap-1', align === 'right' ? 'justify-between' : '')}>
                      {align === 'left' && (
                        <>
                          <div className="h-1 w-6 bg-primary/50 rounded-full" />
                          <div className="h-1 w-10 bg-neutral-70 rounded-full" />
                        </>
                      )}
                      {align === 'right' && (
                        <>
                          <div className="h-1 w-10 bg-neutral-70 rounded-full" />
                          <div className="h-1 w-6 bg-primary/50 rounded-full" />
                        </>
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <div className="h-0.5 w-full bg-neutral-15 rounded-full" />
                      <div className="h-0.5 w-3/4 bg-neutral-15 rounded-full" />
                    </div>
                    {/* Second entry row */}
                    <div className={cn('flex items-center gap-1', align === 'right' ? 'justify-between' : '')}>
                      {align === 'left' && (
                        <>
                          <div className="h-1 w-6 bg-primary/50 rounded-full" />
                          <div className="h-1 w-8 bg-neutral-70 rounded-full" />
                        </>
                      )}
                      {align === 'right' && (
                        <>
                          <div className="h-1 w-8 bg-neutral-70 rounded-full" />
                          <div className="h-1 w-6 bg-primary/50 rounded-full" />
                        </>
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <div className="h-0.5 w-full bg-neutral-15 rounded-full" />
                      <div className="h-0.5 w-2/3 bg-neutral-15 rounded-full" />
                    </div>
                  </div>
                  <p className="text-[10px] text-neutral-50 mt-2 capitalize text-center">{align}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

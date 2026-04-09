import { ResumeData, ResumeLayoutSettings, DEFAULT_LAYOUT_SETTINGS } from '@/types/resume';

const FONT_CSS_MAP: Record<string, string> = {
  inter: 'Inter, sans-serif',
  georgia: 'Georgia, serif',
  times: '"Times New Roman", serif',
  arial: 'Arial, Helvetica, sans-serif',
  garamond: 'Garamond, Georgia, serif',
  calibri: 'Calibri, Candara, sans-serif',
};

const FONT_SIZE_MAP: Record<string, number> = {
  small: 10,
  medium: 11,
  large: 12,
};

export function getTemplateStyles(data: ResumeData, scale: number = 1) {
  const settings: ResumeLayoutSettings = data.layoutSettings ?? DEFAULT_LAYOUT_SETTINGS;
  const fontFamily = FONT_CSS_MAP[data.fontFamily] || FONT_CSS_MAP['inter'];
  const baseFontSize = FONT_SIZE_MAP[settings.fontSize] || 11;

  return {
    fontFamily,
    baseFontSize: baseFontSize * scale,
    headingFontSize: (baseFontSize + 11) * scale, // ~22px for name
    subHeadingFontSize: (baseFontSize + 2) * scale, // ~13px for job title
    bodyFontSize: (baseFontSize - 0.5) * scale, // ~10.5px for body text
    smallFontSize: (baseFontSize - 1) * scale, // ~10px for small text
    sectionTitleFontSize: baseFontSize * scale, // ~11px for section titles
    lineHeight: settings.lineHeight,
    paddingTop: settings.margins.topBottom * scale,
    paddingBottom: settings.margins.topBottom * scale,
    paddingLeft: settings.margins.leftRight * scale,
    paddingRight: settings.margins.leftRight * scale,
    sectionGap: settings.margins.betweenSections * scale,
    headerAlignment: settings.headerAlignment as 'left' | 'center' | 'right',
    dateAlignment: settings.dateAlignment as 'left' | 'right',
    dateFormat: settings.dateFormat,
    pageFormat: settings.pageFormat,
    // Computed page dimensions
    pageWidth: (settings.pageFormat === 'a4' ? 794 : 816) * scale,
    pageHeight: (settings.pageFormat === 'a4' ? 1123 : 1056) * scale,
    colorScheme: (typeof data.colorScheme === 'string' && data.colorScheme.startsWith('#')) ? data.colorScheme : '#2563eb',
    scale,
  };
}

export type TemplateStyles = ReturnType<typeof getTemplateStyles>;

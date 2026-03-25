import { NextRequest, NextResponse } from 'next/server';

// Extract text from PDF using pdf-parse (import lib directly to avoid test-file loading issue)
async function extractPdfText(buffer: Buffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require('pdf-parse/lib/pdf-parse');
  const data = await pdfParse(buffer);
  return data.text;
}

// Extract text from DOCX using mammoth
async function extractDocxText(buffer: Buffer): Promise<string> {
  const mammoth = await import('mammoth');
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

// Parse structured resume data from raw text
function parseResumeText(text: string) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // --- Personal Details ---
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.]+/);
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/);
  const linkedInMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
  const websiteMatch = text.match(/(?:https?:\/\/)?(?:www\.)?(?!linkedin)[a-z0-9-]+\.[a-z]{2,}(?:\/\S*)?/i);

  // Try to extract name from first line(s)
  let firstName = '';
  let lastName = '';
  // The name is usually the first non-empty line that isn't an email/phone/url
  for (const line of lines.slice(0, 5)) {
    const clean = line.replace(/[|•·,]/g, '').trim();
    if (!clean) continue;
    if (clean.includes('@') || clean.match(/^\+?\d/) || clean.includes('linkedin') || clean.includes('http')) continue;
    // Likely a name if it's 2-4 words, all starting with uppercase
    const words = clean.split(/\s+/);
    if (words.length >= 2 && words.length <= 5 && words.every(w => /^[A-Z]/.test(w))) {
      firstName = words[0];
      lastName = words.slice(1).join(' ');
      break;
    }
  }

  // Job title — often the line right after the name or a "Summary" header
  let jobTitle = '';
  const nameLineIdx = lines.findIndex(l => l.includes(firstName) && l.includes(lastName));
  if (nameLineIdx >= 0 && nameLineIdx < lines.length - 1) {
    const nextLine = lines[nameLineIdx + 1];
    // If the next line is short and doesn't look like contact info, it's likely the title
    if (nextLine && nextLine.length < 80 && !nextLine.includes('@') && !nextLine.match(/^\+?\d/) && !nextLine.includes('linkedin')) {
      jobTitle = nextLine.replace(/[|•·]/g, '').trim();
    }
  }

  // Location — look for city/state/country patterns
  let location = '';
  const locationMatch = text.match(/(?:^|\n|[|•·,])\s*([A-Z][a-zA-Z\s]+,\s*[A-Z]{2}(?:\s+\d{5})?)/m)
    || text.match(/(?:^|\n|[|•·,])\s*([A-Z][a-zA-Z\s]+,\s*[A-Z][a-zA-Z\s]+)/m);
  if (locationMatch) location = locationMatch[1].trim();

  // Summary — look for summary/profile/objective section
  let summary = '';
  const summaryHeaders = /(?:summary|profile|objective|about\s*me|professional\s*summary)/i;
  const summaryIdx = lines.findIndex(l => summaryHeaders.test(l));
  if (summaryIdx >= 0) {
    const summaryLines: string[] = [];
    for (let i = summaryIdx + 1; i < lines.length && i < summaryIdx + 8; i++) {
      const line = lines[i];
      if (isSectionHeader(line)) break;
      summaryLines.push(line);
    }
    summary = summaryLines.join(' ').trim();
  }

  // --- Work Experience ---
  const workExperience = parseWorkExperience(lines);

  // --- Education ---
  const education = parseEducation(lines);

  // --- Skills ---
  const skills = parseSkills(lines);

  return {
    personalDetails: {
      firstName,
      lastName,
      jobTitle,
      email: emailMatch?.[0] || '',
      phone: phoneMatch?.[0] || '',
      location,
      linkedIn: linkedInMatch?.[0] ? `https://${linkedInMatch[0]}` : '',
      website: websiteMatch?.[0] && !websiteMatch[0].includes('linkedin') ? websiteMatch[0] : '',
      summary,
      photo: '',
    },
    workExperience,
    education,
    skills,
  };
}

function isSectionHeader(line: string): boolean {
  const headers = /^(experience|work\s*experience|employment|professional\s*experience|education|skills|certifications?|languages?|projects?|summary|profile|objective|about|references|awards|honors|publications|interests|hobbies|activities|volunteer|training|courses)/i;
  const clean = line.replace(/[:\-—_#*|]/g, '').trim();
  // Section headers are typically short, often ALL CAPS or Title Case
  return (clean.length < 40 && headers.test(clean)) || (clean === clean.toUpperCase() && clean.length > 3 && clean.length < 35);
}

function parseWorkExperience(lines: string[]) {
  const expHeaders = /^(?:experience|work\s*experience|employment|professional\s*experience)/i;
  const startIdx = lines.findIndex(l => expHeaders.test(l.replace(/[:\-—_#*|]/g, '').trim()));
  if (startIdx < 0) return [];

  const entries: Array<{
    id: string; company: string; position: string; location: string;
    startDate: string; endDate: string; current: boolean; description: string; bullets: string[];
  }> = [];

  let currentEntry: typeof entries[0] | null = null;
  const dateRegex = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}\s*[-–—to]+\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}|present|current)/i;
  const yearRangeRegex = /\b(20\d{2}|19\d{2})\s*[-–—to]+\s*(20\d{2}|19\d{2}|present|current)\b/i;

  for (let i = startIdx + 1; i < lines.length; i++) {
    const line = lines[i];
    if (isSectionHeader(line) && !expHeaders.test(line.replace(/[:\-—_#*|]/g, '').trim())) {
      if (currentEntry) entries.push(currentEntry);
      break;
    }

    const dateMatch = line.match(dateRegex) || line.match(yearRangeRegex);
    if (dateMatch) {
      if (currentEntry) entries.push(currentEntry);
      const dates = dateMatch[0];
      const parts = dates.split(/[-–—]|to/i).map(s => s.trim());
      const isCurrent = /present|current/i.test(parts[1] || '');

      // The position/company is typically on this line or the line before
      let position = '';
      let company = '';
      const beforeDate = line.replace(dateMatch[0], '').replace(/[|•·,]/g, ' ').trim();
      if (beforeDate) {
        const segments = beforeDate.split(/\s{2,}|[–—|]/).map(s => s.trim()).filter(Boolean);
        if (segments.length >= 2) {
          position = segments[0];
          company = segments[1];
        } else {
          position = segments[0] || '';
        }
      }
      // Check line above for position/company if not found
      if (!position && i > startIdx + 1) {
        const prevLine = lines[i - 1]?.trim();
        if (prevLine && !isSectionHeader(prevLine) && prevLine.length < 80) {
          position = prevLine;
        }
      }

      currentEntry = {
        id: crypto.randomUUID(),
        company,
        position,
        location: '',
        startDate: parts[0] || '',
        endDate: isCurrent ? '' : (parts[1] || ''),
        current: isCurrent,
        description: '',
        bullets: [],
      };
    } else if (currentEntry) {
      const clean = line.replace(/^[•\-*▪►◆○]\s*/, '').trim();
      if (clean.startsWith('•') || line.startsWith('-') || line.startsWith('*') || line.startsWith('▪') || clean.length > 20) {
        currentEntry.bullets.push(clean);
      }
    }
  }
  if (currentEntry && entries.indexOf(currentEntry) < 0) entries.push(currentEntry);

  return entries.slice(0, 10);
}

function parseEducation(lines: string[]) {
  const eduHeaders = /^(?:education|academic|qualifications)/i;
  const startIdx = lines.findIndex(l => eduHeaders.test(l.replace(/[:\-—_#*|]/g, '').trim()));
  if (startIdx < 0) return [];

  const entries: Array<{
    id: string; institution: string; degree: string; field: string; location: string;
    startDate: string; endDate: string; current: boolean; gpa?: string; achievements?: string;
  }> = [];

  const degreeKeywords = /\b(Bachelor|Master|Ph\.?D|Doctor|Associate|MBA|B\.?S\.?|M\.?S\.?|B\.?A\.?|M\.?A\.?|B\.?Eng|M\.?Eng|Diploma|Certificate)\b/i;
  let currentEdu: typeof entries[0] | null = null;

  for (let i = startIdx + 1; i < lines.length; i++) {
    const line = lines[i];
    if (isSectionHeader(line) && !eduHeaders.test(line.replace(/[:\-—_#*|]/g, '').trim())) {
      if (currentEdu) entries.push(currentEdu);
      break;
    }

    if (degreeKeywords.test(line) || (line.length < 80 && /university|college|institute|school/i.test(line))) {
      if (currentEdu) entries.push(currentEdu);

      const degreeMatch = line.match(degreeKeywords);
      let degree = '';
      let field = '';
      let institution = '';

      if (degreeMatch) {
        // Split around the degree keyword
        const fullDegree = line.match(/(?:Bachelor|Master|Ph\.?D|Doctor|Associate|MBA|B\.?S\.?|M\.?S\.?|B\.?A\.?|M\.?A\.?|B\.?Eng|M\.?Eng|Diploma|Certificate)[^,|•]*/i);
        if (fullDegree) {
          const degreeParts = fullDegree[0].split(/\s+(?:in|of)\s+/i);
          degree = degreeParts[0]?.trim() || '';
          field = degreeParts[1]?.trim() || '';
        }
      }

      // Look for institution on this line or adjacent lines
      const instMatch = line.match(/(?:university|college|institute|school)[^,|•]*/i);
      if (instMatch) institution = instMatch[0].trim();
      if (!institution && i < lines.length - 1) {
        const next = lines[i + 1];
        if (/university|college|institute|school/i.test(next)) {
          institution = next.replace(/[|•·]/g, '').trim();
        }
      }
      if (!institution && i > startIdx + 1) {
        const prev = lines[i - 1];
        if (/university|college|institute|school/i.test(prev)) {
          institution = prev.replace(/[|•·]/g, '').trim();
        }
      }

      // Date
      const dateMatch = line.match(/\b(20\d{2}|19\d{2})\b/g);
      let startDate = '';
      let endDate = '';
      if (dateMatch && dateMatch.length >= 2) {
        startDate = dateMatch[0];
        endDate = dateMatch[1];
      } else if (dateMatch) {
        endDate = dateMatch[0];
      }

      currentEdu = {
        id: crypto.randomUUID(),
        institution: institution || (degree ? '' : line.replace(/[|•·]/g, '').trim()),
        degree,
        field,
        location: '',
        startDate,
        endDate,
        current: false,
      };
    }
  }
  if (currentEdu && entries.indexOf(currentEdu) < 0) entries.push(currentEdu);

  return entries.slice(0, 5);
}

function parseSkills(lines: string[]) {
  const skillHeaders = /^(?:skills|technical\s*skills|core\s*competencies|competencies|expertise|proficiencies)/i;
  const startIdx = lines.findIndex(l => skillHeaders.test(l.replace(/[:\-—_#*|]/g, '').trim()));
  if (startIdx < 0) return [];

  const skills: Array<{ id: string; name: string; level: 'intermediate' }> = [];
  const seen = new Set<string>();

  for (let i = startIdx + 1; i < lines.length && i < startIdx + 15; i++) {
    const line = lines[i];
    if (isSectionHeader(line) && !skillHeaders.test(line.replace(/[:\-—_#*|]/g, '').trim())) break;

    // Skills are typically comma/pipe/bullet separated
    const items = line.split(/[,|•·▪►◆○;\n]/).map(s => s.replace(/^[-*\s]+/, '').trim()).filter(s => s.length > 1 && s.length < 40);
    for (const item of items) {
      const name = item.replace(/\s*[-–(:].*$/, '').trim();
      if (name && !seen.has(name.toLowerCase()) && name.length > 1) {
        seen.add(name.toLowerCase());
        skills.push({ id: crypto.randomUUID(), name, level: 'intermediate' });
      }
    }
  }

  return skills.slice(0, 25);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = '';

    const filename = file.name.toLowerCase();
    if (filename.endsWith('.pdf')) {
      text = await extractPdfText(buffer);
    } else if (filename.endsWith('.docx') || filename.endsWith('.doc')) {
      text = await extractDocxText(buffer);
    } else {
      return NextResponse.json({ error: 'Unsupported file type. Please upload a PDF or DOCX file.' }, { status: 400 });
    }

    if (!text || text.trim().length < 20) {
      return NextResponse.json({ error: 'Could not extract text from the file. It may be image-based — try a text-based PDF.' }, { status: 400 });
    }

    const parsed = parseResumeText(text);

    return NextResponse.json({ success: true, data: parsed });
  } catch (err) {
    console.error('Resume parse error:', err);
    return NextResponse.json({ error: 'Failed to parse resume file' }, { status: 500 });
  }
}

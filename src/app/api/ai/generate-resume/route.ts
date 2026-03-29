import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI not configured' }, { status: 503 });
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { jobData, profile } = body;

    if (!jobData?.title) {
      return NextResponse.json({ error: 'Job data with title is required' }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey,
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    });

    const levelContext = profile?.job_level
      ? `Career level: ${profile.job_level}. Years of experience: ${profile.years_experience || 'unknown'}.`
      : '';
    const industryContext = profile?.industry
      ? `Industry: ${profile.industry}.`
      : '';

    const prompt = `Generate a complete, realistic resume skeleton for someone applying to this job. The resume should be ready to use as a starting point.

JOB DETAILS:
Title: ${jobData.title}
Company: ${jobData.company || 'N/A'}
Location: ${jobData.location || 'N/A'}
Description: ${jobData.description || 'N/A'}
Requirements: ${(jobData.requirements || []).join(', ')}
Skills needed: ${(jobData.skills || []).join(', ')}
${levelContext}
${industryContext}

Return ONLY valid JSON (no markdown, no code blocks) with this structure:
{
  "personalDetails": {
    "firstName": "",
    "lastName": "",
    "jobTitle": "${jobData.title}",
    "email": "",
    "phone": "",
    "location": "${jobData.location || ''}",
    "linkedIn": "",
    "website": "",
    "summary": "3-sentence professional summary targeting this role"
  },
  "workExperience": [
    {
      "company": "Example Company",
      "position": "Relevant Position Title",
      "location": "",
      "startDate": "Jan 2022",
      "endDate": "Present",
      "current": true,
      "description": "",
      "bullets": ["Strong action verb bullet with metrics", "Another impactful bullet"]
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Relevant Degree",
      "field": "Relevant Field",
      "location": "",
      "startDate": "2018",
      "endDate": "2022",
      "current": false
    }
  ],
  "skills": [
    { "name": "Relevant Skill", "level": "advanced" }
  ]
}

Rules:
- Leave firstName, lastName, email, phone, linkedIn, website EMPTY (user fills these)
- Generate 2-3 realistic work experiences appropriate for the career level
- Include 8-12 relevant skills matching the job requirements
- Write 3-4 strong bullets per experience with action verbs and metrics
- Summary should be compelling and targeted at this specific role
- Use placeholder company names like "Previous Company" or realistic-sounding ones
- Education should match the typical requirements for this role`;

    const completion = await openai.chat.completions.create({
      model: 'gemini-2.5-flash',
      messages: [
        { role: 'system', content: 'You are a resume generation expert. Return only valid JSON.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 16000,
    });

    const content = completion.choices[0]?.message?.content || '';
    const jsonStr = content.replace(/```json\s*\n?/g, '').replace(/```\s*$/g, '').trim();
    const parsed = JSON.parse(jsonStr);

    // Add IDs to all entries
    const addIds = (arr: Record<string, unknown>[]) =>
      (arr || []).map(item => ({ ...item, id: crypto.randomUUID() }));

    if (parsed.workExperience) parsed.workExperience = addIds(parsed.workExperience);
    if (parsed.education) parsed.education = addIds(parsed.education);
    if (parsed.skills) parsed.skills = addIds(parsed.skills);
    if (parsed.personalDetails) parsed.personalDetails.photo = '';

    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.error('AI generate error:', error);
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 });
  }
}

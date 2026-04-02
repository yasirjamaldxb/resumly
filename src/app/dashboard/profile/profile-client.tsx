'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface WorkEntry {
  id: string;
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

interface EduEntry {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
}

interface SkillEntry {
  id: string;
  name: string;
}

interface ProfileClientProps {
  userId: string;
  email: string;
  profile: {
    full_name: string;
    phone: string;
    location: string;
    linkedin_url: string;
    headline: string;
    target_role: string;
    job_level: string;
    industry: string;
    years_experience: number;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profileData: any;
}

export function ProfileClient({ userId, email, profile, profileData }: ProfileClientProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Personal
  const [fullName, setFullName] = useState(profile.full_name || profileData?.personalDetails?.firstName ? `${profileData?.personalDetails?.firstName || ''} ${profileData?.personalDetails?.lastName || ''}`.trim() : '');
  const [phone, setPhone] = useState(profile.phone || profileData?.personalDetails?.phone || '');
  const [locationVal, setLocationVal] = useState(profile.location || profileData?.personalDetails?.location || '');
  const [headline, setHeadline] = useState(profile.headline || profileData?.personalDetails?.jobTitle || '');
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedin_url || '');
  const [summary, setSummary] = useState(profileData?.personalDetails?.summary || '');

  // Work experience
  const [workExperience, setWorkExperience] = useState<WorkEntry[]>(() => {
    if (profileData?.workExperience?.length) {
      return profileData.workExperience.map((w: Record<string, unknown>, i: number) => ({
        id: (w as { id?: string }).id || `w-${i}`,
        position: (w as { position?: string }).position || '',
        company: (w as { company?: string }).company || '',
        startDate: (w as { startDate?: string }).startDate || '',
        endDate: (w as { endDate?: string }).endDate || '',
        bullets: ((w as { bullets?: string[] }).bullets || []).filter(Boolean),
      }));
    }
    return [];
  });

  // Education
  const [education, setEducation] = useState<EduEntry[]>(() => {
    if (profileData?.education?.length) {
      return profileData.education.map((e: Record<string, unknown>, i: number) => ({
        id: (e as { id?: string }).id || `e-${i}`,
        degree: (e as { degree?: string }).degree || '',
        institution: (e as { institution?: string }).institution || '',
        startDate: (e as { startDate?: string }).startDate || '',
        endDate: (e as { endDate?: string }).endDate || '',
      }));
    }
    return [];
  });

  // Skills
  const [skills, setSkills] = useState<SkillEntry[]>(() => {
    if (profileData?.skills?.length) {
      return profileData.skills.map((s: { id?: string; name?: string } | string, i: number) => ({
        id: typeof s === 'object' ? s.id || `s-${i}` : `s-${i}`,
        name: typeof s === 'object' ? s.name || '' : s,
      }));
    }
    return [];
  });
  const [newSkill, setNewSkill] = useState('');

  // Editing states
  const [editingWork, setEditingWork] = useState<string | null>(null);
  const [editingEdu, setEditingEdu] = useState<string | null>(null);

  // Profile completeness
  const completeness = (() => {
    let score = 0;
    const total = 8;
    if (fullName) score++;
    if (phone) score++;
    if (locationVal) score++;
    if (headline) score++;
    if (summary && summary.length > 20) score++;
    if (workExperience.length > 0) score++;
    if (education.length > 0) score++;
    if (skills.length >= 3) score++;
    return Math.round((score / total) * 100);
  })();

  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaved(false);
    try {
      const [firstName, ...rest] = fullName.split(' ');
      const lastName = rest.join(' ');

      const profileDataPayload = {
        personalDetails: {
          firstName: firstName || '',
          lastName: lastName || '',
          email,
          phone,
          location: locationVal,
          jobTitle: headline,
          summary,
        },
        workExperience: workExperience.map(w => ({
          id: w.id,
          position: w.position,
          company: w.company,
          startDate: w.startDate,
          endDate: w.endDate,
          bullets: w.bullets,
        })),
        education: education.map(e => ({
          id: e.id,
          degree: e.degree,
          institution: e.institution,
          startDate: e.startDate,
          endDate: e.endDate,
        })),
        skills: skills.map(s => ({ id: s.id, name: s.name, level: 'intermediate' })),
      };

      await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          phone,
          location: locationVal,
          linkedin_url: linkedinUrl,
          headline,
          profile_data: profileDataPayload,
        }),
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      router.refresh();
    } catch {
      // Silent
    } finally {
      setSaving(false);
    }
  }, [fullName, email, phone, locationVal, headline, summary, linkedinUrl, workExperience, education, skills, router]);

  const addWork = () => {
    const id = `w-${Date.now()}`;
    setWorkExperience(prev => [...prev, { id, position: '', company: '', startDate: '', endDate: '', bullets: [''] }]);
    setEditingWork(id);
  };

  const removeWork = (id: string) => {
    setWorkExperience(prev => prev.filter(w => w.id !== id));
    if (editingWork === id) setEditingWork(null);
  };

  const updateWork = (id: string, field: keyof WorkEntry, value: unknown) => {
    setWorkExperience(prev => prev.map(w => w.id === id ? { ...w, [field]: value } : w));
  };

  const addEdu = () => {
    const id = `e-${Date.now()}`;
    setEducation(prev => [...prev, { id, degree: '', institution: '', startDate: '', endDate: '' }]);
    setEditingEdu(id);
  };

  const removeEdu = (id: string) => {
    setEducation(prev => prev.filter(e => e.id !== id));
    if (editingEdu === id) setEditingEdu(null);
  };

  const updateEdu = (id: string, field: keyof EduEntry, value: string) => {
    setEducation(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    setSkills(prev => [...prev, { id: `s-${Date.now()}`, name: newSkill.trim() }]);
    setNewSkill('');
  };

  const removeSkill = (id: string) => {
    setSkills(prev => prev.filter(s => s.id !== id));
  };

  return (
    <>
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-[18px] sm:text-[20px] font-semibold text-neutral-90 tracking-tight">My Profile</h1>
          <p className="text-neutral-50 text-[13px] mt-0.5">Your professional profile powers every resume and cover letter.</p>
        </div>
        <Button onClick={handleSave} loading={saving} size="sm" className="gap-2 shrink-0">
          {saved ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Saved
            </>
          ) : 'Save Profile'}
        </Button>
      </div>

      {/* Completeness bar */}
      <div className="bg-white rounded-xl border border-neutral-20 shadow-sm p-4 mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[13px] font-medium text-neutral-70">Profile completeness</span>
          <span className={`text-[13px] font-bold ${completeness === 100 ? 'text-green-600' : completeness >= 60 ? 'text-primary' : 'text-orange-500'}`}>{completeness}%</span>
        </div>
        <div className="w-full h-1.5 bg-neutral-10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${completeness === 100 ? 'bg-green-500' : completeness >= 60 ? 'bg-primary' : 'bg-orange-500'}`}
            style={{ width: `${completeness}%` }}
          />
        </div>
        {completeness < 100 && (
          <p className="text-[11px] text-neutral-40 mt-1.5">Complete your profile to get better AI-optimized resumes.</p>
        )}
      </div>

      <div className="space-y-4">
        {/* ─── Personal Information ─── */}
        <section className="bg-white rounded-xl border border-neutral-20 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-5 py-3 border-b border-neutral-20">
            <h2 className="text-[14px] font-semibold text-neutral-90">Personal Information</h2>
          </div>
          <div className="p-4 sm:p-5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Full name" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe" />
              <Input label="Professional headline" value={headline} onChange={e => setHeadline(e.target.value)} placeholder="e.g. Senior UX Designer" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-neutral-70">Email</label>
                <div className="px-3 py-2 rounded-lg bg-white text-[13px] text-neutral-60 border border-neutral-20">{email}</div>
              </div>
              <Input label="Phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+971 50 123 4567" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Location" value={locationVal} onChange={e => setLocationVal(e.target.value)} placeholder="Dubai, UAE" />
              <Input label="LinkedIn URL" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/yourname" />
            </div>
          </div>
        </section>

        {/* ─── Professional Summary ─── */}
        <section className="bg-white rounded-xl border border-neutral-20 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-5 py-3 border-b border-neutral-20">
            <h2 className="text-[14px] font-semibold text-neutral-90">Professional Summary</h2>
          </div>
          <div className="p-4 sm:p-5">
            <textarea
              value={summary}
              onChange={e => setSummary(e.target.value)}
              rows={3}
              placeholder="Write a 2-3 sentence overview of your professional background, key strengths, and career goals..."
              className="w-full rounded-lg border border-neutral-20 bg-white px-3 py-2 text-[13px] text-neutral-90 placeholder:text-neutral-40 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
            />
            <p className="text-[11px] text-neutral-40 mt-1">{summary.length} characters {summary.length > 0 && summary.length < 50 && '— aim for at least 50 characters'}</p>
          </div>
        </section>

        {/* ─── Work Experience ─── */}
        <section className="bg-white rounded-xl border border-neutral-20 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-5 py-3 border-b border-neutral-20 flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-neutral-90">Work Experience</h2>
            <button onClick={addWork} className="text-[12px] text-primary font-medium hover:underline flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Add
            </button>
          </div>
          <div className="divide-y divide-neutral-20">
            {workExperience.length === 0 && (
              <div className="p-6 text-center">
                <p className="text-[13px] text-neutral-40 mb-2.5">No work experience added yet.</p>
                <Button variant="outline" size="sm" onClick={addWork} className="gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  Add experience
                </Button>
              </div>
            )}
            {workExperience.map((w) => {
              const isEditing = editingWork === w.id;
              return (
                <div key={w.id} className="p-4 sm:p-5">
                  {isEditing ? (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <Input label="Job title" value={w.position} onChange={e => updateWork(w.id, 'position', e.target.value)} placeholder="e.g. Senior Designer" />
                        <Input label="Company" value={w.company} onChange={e => updateWork(w.id, 'company', e.target.value)} placeholder="e.g. Google" />
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <Input label="Start date" value={w.startDate} onChange={e => updateWork(w.id, 'startDate', e.target.value)} placeholder="Jan 2022" />
                        <Input label="End date" value={w.endDate} onChange={e => updateWork(w.id, 'endDate', e.target.value)} placeholder="Present" />
                      </div>
                      <div>
                        <label className="text-[12px] font-medium text-neutral-70 mb-1.5 block">Key achievements</label>
                        {w.bullets.map((b, bi) => (
                          <div key={bi} className="flex gap-2 mb-1.5">
                            <span className="text-neutral-30 mt-2 text-[13px]">&bull;</span>
                            <input
                              value={b}
                              onChange={e => {
                                const newBullets = [...w.bullets];
                                newBullets[bi] = e.target.value;
                                updateWork(w.id, 'bullets', newBullets);
                              }}
                              placeholder="Describe what you did and the impact..."
                              className="flex-1 rounded-lg border border-neutral-20 px-3 py-1.5 text-[13px] text-neutral-90 placeholder:text-neutral-40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <button onClick={() => updateWork(w.id, 'bullets', w.bullets.filter((_, i) => i !== bi))} className="text-neutral-30 hover:text-red-400 shrink-0 mt-1">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        ))}
                        <button onClick={() => updateWork(w.id, 'bullets', [...w.bullets, ''])} className="text-[12px] text-primary hover:underline mt-1">+ Add bullet</button>
                      </div>
                      <div className="flex gap-2 pt-1.5">
                        <Button size="sm" onClick={() => setEditingWork(null)}>Done</Button>
                        <Button size="sm" variant="ghost" onClick={() => removeWork(w.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">Remove</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between group cursor-pointer" onClick={() => setEditingWork(w.id)}>
                      <div className="min-w-0">
                        <p className="font-medium text-[14px] text-neutral-90">{w.position || 'Untitled Position'}</p>
                        <p className="text-[12px] text-neutral-50 mt-0.5">{w.company}{w.startDate ? ` \u00b7 ${w.startDate} – ${w.endDate || 'Present'}` : ''}</p>
                        {w.bullets.filter(Boolean).length > 0 && (
                          <ul className="mt-1.5 space-y-0.5">
                            {w.bullets.filter(Boolean).slice(0, 2).map((b, i) => (
                              <li key={i} className="text-[12px] text-neutral-60 flex gap-2">
                                <span className="text-neutral-30 shrink-0">&bull;</span>
                                <span className="line-clamp-1">{b}</span>
                              </li>
                            ))}
                            {w.bullets.filter(Boolean).length > 2 && (
                              <li className="text-[11px] text-neutral-40">+{w.bullets.filter(Boolean).length - 2} more</li>
                            )}
                          </ul>
                        )}
                      </div>
                      <button className="text-neutral-30 group-hover:text-primary transition-colors shrink-0 mt-0.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── Education ─── */}
        <section className="bg-white rounded-xl border border-neutral-20 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-5 py-3 border-b border-neutral-20 flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-neutral-90">Education</h2>
            <button onClick={addEdu} className="text-[12px] text-primary font-medium hover:underline flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Add
            </button>
          </div>
          <div className="divide-y divide-neutral-20">
            {education.length === 0 && (
              <div className="p-6 text-center">
                <p className="text-[13px] text-neutral-40 mb-2.5">No education added yet.</p>
                <Button variant="outline" size="sm" onClick={addEdu} className="gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  Add education
                </Button>
              </div>
            )}
            {education.map((e) => {
              const isEditing = editingEdu === e.id;
              return (
                <div key={e.id} className="p-4 sm:p-5">
                  {isEditing ? (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <Input label="Degree" value={e.degree} onChange={ev => updateEdu(e.id, 'degree', ev.target.value)} placeholder="e.g. B.Sc. Computer Science" />
                        <Input label="Institution" value={e.institution} onChange={ev => updateEdu(e.id, 'institution', ev.target.value)} placeholder="e.g. MIT" />
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <Input label="Start date" value={e.startDate} onChange={ev => updateEdu(e.id, 'startDate', ev.target.value)} placeholder="Sep 2018" />
                        <Input label="End date" value={e.endDate} onChange={ev => updateEdu(e.id, 'endDate', ev.target.value)} placeholder="Jun 2022" />
                      </div>
                      <div className="flex gap-2 pt-1.5">
                        <Button size="sm" onClick={() => setEditingEdu(null)}>Done</Button>
                        <Button size="sm" variant="ghost" onClick={() => removeEdu(e.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">Remove</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between group cursor-pointer" onClick={() => setEditingEdu(e.id)}>
                      <div>
                        <p className="font-medium text-[14px] text-neutral-90">{e.degree || 'Untitled Degree'}</p>
                        <p className="text-[12px] text-neutral-50 mt-0.5">{e.institution}{e.startDate ? ` \u00b7 ${e.startDate} – ${e.endDate || 'Present'}` : ''}</p>
                      </div>
                      <button className="text-neutral-30 group-hover:text-primary transition-colors shrink-0 mt-0.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── Skills ─── */}
        <section className="bg-white rounded-xl border border-neutral-20 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-5 py-3 border-b border-neutral-20">
            <h2 className="text-[14px] font-semibold text-neutral-90">Skills</h2>
          </div>
          <div className="p-4 sm:p-5">
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {skills.map((s) => (
                  <span key={s.id} className="inline-flex items-center gap-1.5 bg-white border border-neutral-20 text-neutral-70 text-[12px] font-medium px-2.5 py-1 rounded-lg group">
                    {s.name}
                    <button onClick={() => removeSkill(s.id)} className="text-neutral-30 hover:text-red-400 transition-colors">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                placeholder="Type a skill and press Enter..."
                className="flex-1 rounded-lg border border-neutral-20 px-3 py-1.5 text-[13px] text-neutral-90 placeholder:text-neutral-40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button variant="outline" size="sm" onClick={addSkill} disabled={!newSkill.trim()}>Add</Button>
            </div>
            {skills.length === 0 && (
              <p className="text-[11px] text-neutral-40 mt-1.5">Add at least 3 skills for better resume optimization.</p>
            )}
          </div>
        </section>
      </div>

      {/* Floating save bar on mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-15 p-3 lg:hidden z-40">
        <Button onClick={handleSave} loading={saving} size="sm" className="w-full gap-2">
          {saved ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Saved
            </>
          ) : 'Save Profile'}
        </Button>
      </div>
      {/* Bottom padding for mobile save bar */}
      <div className="h-14 lg:hidden" />
    </>
  );
}

'use client';

import { ResumeData, Education } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { generateId } from '@/lib/utils';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const emptyEdu = (): Education => ({
  id: generateId(),
  institution: '',
  degree: '',
  field: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  gpa: '',
});

export function EducationForm({ data, onChange }: Props) {
  const addEdu = () => onChange({ ...data, education: [...data.education, emptyEdu()] });
  const removeEdu = (id: string) => onChange({ ...data, education: data.education.filter((e) => e.id !== id) });
  const updateEdu = (id: string, field: keyof Education, value: unknown) => {
    onChange({
      ...data,
      education: data.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-neutral-90 mb-1">Education</h2>
        <p className="text-sm text-neutral-50">Include your highest level of education. Add honors or GPA if it's 3.5+.</p>
      </div>

      {data.education.length === 0 && (
        <div className="text-center py-10 bg-neutral-10 rounded-xl border-2 border-dashed border-neutral-20">
          <p className="text-neutral-50 text-sm mb-3">No education added yet</p>
          <Button variant="outline" size="sm" onClick={addEdu}>+ Add Education</Button>
        </div>
      )}

      {data.education.map((edu, index) => (
        <div key={edu.id} className="border border-neutral-20 rounded-xl p-4 space-y-4 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-neutral-80 text-sm">
              {edu.degree || edu.institution || `Education ${index + 1}`}
            </h3>
            <button onClick={() => removeEdu(edu.id)} className="text-neutral-40 hover:text-red-500 transition-colors p-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <Input
            label="School / University"
            placeholder="MIT"
            value={edu.institution}
            onChange={(e) => updateEdu(edu.id, 'institution', e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Degree"
              placeholder="Bachelor of Science"
              value={edu.degree}
              onChange={(e) => updateEdu(edu.id, 'degree', e.target.value)}
            />
            <Input
              label="Field of Study"
              placeholder="Computer Science"
              value={edu.field}
              onChange={(e) => updateEdu(edu.id, 'field', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="month"
              value={edu.startDate}
              onChange={(e) => updateEdu(edu.id, 'startDate', e.target.value)}
            />
            <div className="flex flex-col gap-1.5">
              {!edu.current && (
                <Input
                  label="End Date"
                  type="month"
                  value={edu.endDate}
                  onChange={(e) => updateEdu(edu.id, 'endDate', e.target.value)}
                />
              )}
              <label className="flex items-center gap-2 cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={edu.current}
                  onChange={(e) => updateEdu(edu.id, 'current', e.target.checked)}
                  className="rounded border-neutral-30 text-primary"
                />
                <span className="text-sm text-neutral-70">Currently enrolled</span>
              </label>
            </div>
          </div>

          <Input
            label="GPA (optional)"
            placeholder="3.8 / 4.0"
            value={edu.gpa}
            onChange={(e) => updateEdu(edu.id, 'gpa', e.target.value)}
            hint="Include if 3.5 or higher"
          />
        </div>
      ))}

      {data.education.length > 0 && (
        <Button variant="outline" size="md" onClick={addEdu} className="w-full">
          + Add Another Education
        </Button>
      )}
    </div>
  );
}

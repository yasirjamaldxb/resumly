import { findClosestRole, type RoleDefinition } from './roles';

export interface UserProfile {
  target_role?: string;
  job_level?: string;
  industry?: string;
  years_experience?: number;
  career_context?: string;
}

/**
 * Build a rich user context string for AI prompts.
 * This is injected into every AI call to personalize output.
 */
export function buildUserContext(profile?: UserProfile | null): string {
  if (!profile) return '';

  const parts: string[] = [];

  // Career level and experience
  if (profile.job_level || profile.years_experience) {
    const level = profile.job_level ? `${profile.job_level}-level professional` : 'professional';
    const years = profile.years_experience ? ` with ${profile.years_experience}+ years of experience` : '';
    parts.push(`Career level: ${level}${years}.`);
  }

  // Target role + role intelligence
  if (profile.target_role) {
    parts.push(`Target role: ${profile.target_role}.`);

    // Enrich with role database knowledge
    const roleData = findClosestRole(profile.target_role);
    if (roleData) {
      parts.push(`Industry context for ${roleData.title}:`);
      parts.push(`- Core skills employers expect: ${roleData.skills.join(', ')}`);
      parts.push(`- Common tools/technologies: ${roleData.tools.join(', ')}`);
      parts.push(`- Key ATS keywords: ${roleData.keywords.join(', ')}`);
      if (roleData.certifications?.length) {
        parts.push(`- Valued certifications: ${roleData.certifications.join(', ')}`);
      }
    }
  }

  // Industry
  if (profile.industry) {
    parts.push(`Industry: ${profile.industry}.`);
  }

  // Career story — the most valuable piece
  if (profile.career_context) {
    parts.push(`Career context (in their own words): "${profile.career_context}"`);
  }

  if (parts.length === 0) return '';

  return `\n═══ CANDIDATE PROFILE ═══\n${parts.join('\n')}\n`;
}

/**
 * Get suggested skills for a role title.
 * Used for the "suggested skills" UI feature.
 */
export function getSuggestedSkillsForRole(title: string): { skills: string[]; tools: string[] } {
  const role = findClosestRole(title);
  if (!role) return { skills: [], tools: [] };
  return { skills: role.skills, tools: role.tools };
}

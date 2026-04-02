'use client';

import { useState, useRef, useEffect } from 'react';
import { searchRoles, ROLES, ROLE_CATEGORIES, type RoleDefinition } from '@/lib/roles';
import { cn } from '@/lib/utils';

interface RoleSelectorProps {
  value: string;
  onChange: (title: string, role?: RoleDefinition) => void;
  placeholder?: string;
  className?: string;
}

export function RoleSelector({ value, onChange, placeholder = 'Search your target role...', className }: RoleSelectorProps) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [browsing, setBrowsing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const results = query.length >= 2 ? searchRoles(query) : [];

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setBrowsing(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (role: RoleDefinition) => {
    setQuery(role.title);
    onChange(role.title, role);
    setIsOpen(false);
    setBrowsing(false);
  };

  const categoryRoles = selectedCategory ? ROLES.filter(r => r.category === selectedCategory) : [];

  return (
    <div className="relative">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setBrowsing(false);
            if (e.target.value.length < 2) {
              onChange(e.target.value);
            }
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            'w-full pl-9 pr-4 py-2.5 border border-neutral-20 rounded-lg text-[14px] text-neutral-90 placeholder:text-neutral-30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all',
            className,
          )}
        />
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-neutral-20 rounded-xl shadow-lg max-h-[320px] overflow-hidden"
        >
          {/* Search results */}
          {query.length >= 2 && !browsing && (
            <div className="overflow-y-auto max-h-[280px]">
              {results.length > 0 ? (
                <>
                  {results.map((role) => (
                    <button
                      key={role.title}
                      onClick={() => handleSelect(role)}
                      className="w-full text-left px-4 py-2.5 hover:bg-primary/5 transition-colors border-b border-neutral-10 last:border-0"
                    >
                      <p className="text-[13px] font-medium text-neutral-90">{role.title}</p>
                      <p className="text-[11px] text-neutral-40">{role.category} · {role.skills.slice(0, 3).join(', ')}</p>
                    </button>
                  ))}
                  <button
                    onClick={() => { setBrowsing(true); setSelectedCategory(null); }}
                    className="w-full text-center px-4 py-2 text-[12px] text-primary font-medium hover:bg-primary/5 transition-colors border-t border-neutral-10"
                  >
                    Browse all roles by category
                  </button>
                </>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-[13px] text-neutral-40 mb-2">No exact match found</p>
                  <button
                    onClick={() => { setBrowsing(true); setSelectedCategory(null); }}
                    className="text-[12px] text-primary font-medium hover:underline"
                  >
                    Browse all categories
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Browse by category */}
          {(browsing || query.length < 2) && !selectedCategory && (
            <div className="overflow-y-auto max-h-[280px]">
              <p className="px-4 py-2 text-[10px] font-semibold text-neutral-40 uppercase tracking-wider bg-neutral-5">Browse by category</p>
              {ROLE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="w-full text-left px-4 py-2.5 hover:bg-primary/5 transition-colors border-b border-neutral-10 last:border-0 flex items-center justify-between"
                >
                  <span className="text-[13px] text-neutral-70">{cat}</span>
                  <span className="text-[11px] text-neutral-30">{ROLES.filter(r => r.category === cat).length} roles</span>
                </button>
              ))}
            </div>
          )}

          {/* Roles in category */}
          {selectedCategory && (
            <div className="overflow-y-auto max-h-[280px]">
              <button
                onClick={() => setSelectedCategory(null)}
                className="w-full text-left px-4 py-2 text-[11px] text-primary font-medium hover:bg-primary/5 transition-colors bg-neutral-5 flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                {selectedCategory}
              </button>
              {categoryRoles.map((role) => (
                <button
                  key={role.title}
                  onClick={() => handleSelect(role)}
                  className="w-full text-left px-4 py-2.5 hover:bg-primary/5 transition-colors border-b border-neutral-10 last:border-0"
                >
                  <p className="text-[13px] font-medium text-neutral-90">{role.title}</p>
                  <p className="text-[11px] text-neutral-40">{role.tools.slice(0, 4).join(', ')}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

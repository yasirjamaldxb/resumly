'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { PrewrittenPhrases } from '@/components/resume/builder/prewritten-phrases';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  charTarget?: number;
  charLabel?: string;
  showPrewrittenPhrases?: boolean;
  phraseCategory?: string;
  className?: string;
}

function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        'w-6 h-6 flex items-center justify-center rounded text-xs transition-colors',
        active
          ? 'bg-primary text-white'
          : 'text-neutral-60 hover:bg-neutral-10 hover:text-neutral-80'
      )}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-4 bg-neutral-20 mx-1" />;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  charTarget,
  charLabel,
  showPrewrittenPhrases = false,
  phraseCategory,
  className,
}: RichTextEditorProps) {
  const [showPhrases, setShowPhrases] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        orderedList: { HTMLAttributes: { class: 'list-decimal pl-4' } },
        bulletList: { HTMLAttributes: { class: 'list-disc pl-4' } },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-primary underline' },
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({ placeholder: placeholder ?? 'Start typing...' }),
    ],
    content: value || '',
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[100px] px-3 py-2 text-sm',
      },
    },
  });

  // Sync external value changes
  useEffect(() => {
    if (!editor) return;
    const currentHtml = editor.getHTML();
    // Avoid updating if content is the same (prevents cursor jumping)
    if (value !== currentHtml && value !== undefined) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  const charCount = editor ? editor.getText().length : 0;

  const handleSetLink = useCallback(() => {
    if (!editor) return;
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
    setShowLinkInput(false);
    setLinkUrl('');
  }, [editor, linkUrl]);

  const handlePhraseSelect = useCallback(
    (text: string) => {
      if (!editor) return;
      editor.chain().focus().insertContent(text).run();
      setShowPhrases(false);
    },
    [editor]
  );

  if (!editor) return null;

  return (
    <div className={cn(className)}>
      <div className="border border-neutral-20 rounded-lg overflow-hidden bg-white">
        {/* Toolbar */}
        <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-neutral-15 bg-neutral-5">
          {/* Group 1: Text formatting */}
          <ToolbarButton
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold"
          >
            <span className="font-bold">B</span>
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic"
          >
            <span className="italic">I</span>
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Underline"
          >
            <span className="underline">U</span>
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('strike')}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="Strikethrough"
          >
            <span className="line-through">S</span>
          </ToolbarButton>

          <ToolbarDivider />

          {/* Group 2: Lists */}
          <ToolbarButton
            active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Ordered List"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h2m0 0V4m0 2v2m-2 4h2l-2 3h2m-2 4l1-1 1 1m-2 0l1 1 1-1M10 6h10M10 12h10M10 18h10" />
            </svg>
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet List"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h.01M4 12h.01M4 18h.01M8 6h12M8 12h12M8 18h12" />
            </svg>
          </ToolbarButton>

          <ToolbarDivider />

          {/* Group 3: Link */}
          <ToolbarButton
            active={editor.isActive('link')}
            onClick={() => {
              if (editor.isActive('link')) {
                editor.chain().focus().unsetLink().run();
              } else {
                setShowLinkInput(!showLinkInput);
              }
            }}
            title="Link"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </ToolbarButton>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Pre-written phrases button */}
          {showPrewrittenPhrases && (
            <button
              type="button"
              onClick={() => setShowPhrases(!showPhrases)}
              className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors px-2 py-1 rounded hover:bg-emerald-50"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Pre-written phrases
            </button>
          )}
        </div>

        {/* Link input */}
        {showLinkInput && (
          <div className="flex items-center gap-2 px-3 py-1.5 border-b border-neutral-15 bg-neutral-5">
            <input
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSetLink();
                if (e.key === 'Escape') {
                  setShowLinkInput(false);
                  setLinkUrl('');
                }
              }}
              className="flex-1 text-xs border border-neutral-20 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
            />
            <button
              type="button"
              onClick={handleSetLink}
              className="text-xs text-primary font-medium hover:text-primary-dark"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLinkInput(false);
                setLinkUrl('');
              }}
              className="text-xs text-neutral-40 hover:text-neutral-60"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Editor content */}
        <EditorContent editor={editor} />
      </div>

      {/* Character counter and tip */}
      {charTarget && (
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-xs text-neutral-40">
            {charLabel ?? `Write ${charTarget}+ characters for best results`}
          </p>
          <span
            className={cn(
              'text-xs font-medium tabular-nums',
              charCount >= charTarget ? 'text-emerald-600' : 'text-neutral-40'
            )}
          >
            {charCount} / {charTarget}+
          </span>
        </div>
      )}

      {/* Pre-written phrases panel */}
      {showPhrases && phraseCategory && (
        <PrewrittenPhrases
          category={phraseCategory}
          onSelect={handlePhraseSelect}
          onClose={() => setShowPhrases(false)}
        />
      )}
    </div>
  );
}

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Editor } from '@tiptap/core';
import {
    Bold,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Heading1,
    Heading2,
    Heading3,
    Italic,
    List
} from 'lucide-react';
import React from 'react';

export default function TextEditorButtons({editor}: {editor: Editor | null}) {
  if (!editor) return null;
  
  return (
    <div className="flex flex-wrap items-center gap-1 p-1 bg-muted/30 rounded-lg border">
      {/* Text Formatting */}
      <div className="flex items-center gap-1 px-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-primary/10 text-primary' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-primary/10 text-primary' : ''}
        >
          <Italic className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Headings */}
      <div className="flex items-center gap-1 px-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-primary/10 text-primary' : ''}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-primary/10 text-primary' : ''}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'bg-primary/10 text-primary' : ''}
        >
          <Heading3 className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Lists */}
      <div className="flex items-center gap-1 px-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-primary/10 text-primary' : ''}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().splitListItem('listItem').run()}
          disabled={!editor.can().splitListItem('listItem')}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
          disabled={!editor.can().sinkListItem('listItem')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().liftListItem('listItem').run()}
          disabled={!editor.can().liftListItem('listItem')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
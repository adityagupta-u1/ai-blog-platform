import { Editor } from '@tiptap/core';
import React from 'react';

export default function TextEditorButtons({editor}:{editor: Editor | null}) {
  if (!editor) return null;
  return (
    <>
        <div className="mb-3 flex gap-2 flex-wrap">
            <button onClick={() => editor.chain().focus().toggleBold().run()} className="btn">Bold</button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className="btn">Italic</button>
            <div className="button-group">
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
                >
                    H1
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                >
                    H2
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
                >
                    H3
                </button>
            </div>
            <div className="button-group">
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'is-active' : ''}
                >
                    Toggle bullet list
                </button>
                <button
                    onClick={() => editor.chain().focus().splitListItem('listItem').run()}
                    disabled={!editor.can().splitListItem('listItem')}
                >
                    Split list item
                </button>
                <button
                    onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
                    disabled={!editor.can().sinkListItem('listItem')}
                >
                    Sink list item
                </button>
                <button
                    onClick={() => editor.chain().focus().liftListItem('listItem').run()}
                    disabled={!editor.can().liftListItem('listItem')}
                >
                    Lift list item
                </button>
                </div>
            </div>
    </>
  )
}

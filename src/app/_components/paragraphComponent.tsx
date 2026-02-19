'use client'

import { trpc } from '@/trpc/client'
import { Editor, NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import { Node as ProseMirrorNode } from 'prosemirror-model'
import React from 'react'

export default function ParagraphComponent({ node, editor, getPos }: { node: ProseMirrorNode; editor: Editor; getPos: () => number }) {

    // const utils = trpc.useUtils();
    const {isPending,mutateAsync} = trpc.editor.rewriteParagraph.useMutation(); // Correct method to get text content

    const HandleRewrite = async () => {
      const text = node.content.textBetween(0, node.content.size); // Correct method
      console.log("Current paragraph text:", text);
      try {
        // Make an trpc mutation call to the rewrite function
        mutateAsync({paragraph:text})
        .then((data) => {
          console.log("Rewritten paragraph:", data);
          const from = getPos()
          const to = from + node.nodeSize
      
          editor.commands.insertContentAt({ from, to }, {
            type: 'paragraph',
            content: [{ type: 'text', text: data }],
          })
        })
      }
      catch(error){
        console.error("Error rewriting paragraph:", error);
      }
    }

  return (
    <NodeViewWrapper>
      {
        node.content.size !== 0 ? (
          <div className="flex justify-between items-center gap-2">
          <NodeViewContent as="div" className="flex-1" />
          {/* <Button
            variant="outline"
            className="opacity group-hover:opacity-100 transition"
            onClick={() => HandleRewrite()}
            disabled={isPending || !isSuccess}
          >
            {isPending ? 'Rewriting...' : 'Rewrite'}
          </Button> */}
          <button onClick={() => HandleRewrite()} disabled={isPending}  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            {isPending ? 'Rewriting...' : 'Rewrite'}
          </button>
        </div>
        ) : null
      }
    </NodeViewWrapper>
  )
}

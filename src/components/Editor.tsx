'use client'

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import EditorJS, { OutputData, ToolConstructable, ToolSettings } from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Image from '@editorjs/image'
import Code from '@editorjs/code'
import Paragraph from '@editorjs/paragraph'
import Embed from '@editorjs/embed'
import Table from '@editorjs/table'
import Marker from '@editorjs/marker'
import InlineCode from '@editorjs/inline-code'
import Quote from '@editorjs/quote'

// Add type declaration for @editorjs/marker
declare module '@editorjs/marker'

interface EditorProps {
  data?: OutputData
  onChange?: (data: OutputData) => void
  readOnly?: boolean
}

const EDITOR_JS_TOOLS = {
  header: Header,
  list: List,
  image: Image,
  code: Code,
  paragraph: Paragraph,
  embed: Embed,
  table: Table,
  marker: Marker,
  inlineCode: InlineCode,
  quote: Quote
}

const Editor = forwardRef<EditorJS | undefined, EditorProps>(
  ({ data, onChange, readOnly = false }, ref) => {
    const editorRef = useRef<EditorJS | null>(null)
    const holderRef = useRef<HTMLDivElement>(null)
    const [isReady, setIsReady] = useState(false)

    useImperativeHandle(ref, () => editorRef.current as EditorJS | undefined, [isReady])

    useEffect(() => {
      if (!holderRef.current) return

      const initEditor = async () => {
        const editor = new EditorJS({
          holder: holderRef.current!,
          tools: EDITOR_JS_TOOLS,
          data,
          readOnly,
          onChange: async () => {
            const outputData = await editor.save()
            onChange?.(outputData)
          },
          placeholder: 'Start writing your blog post...',
          onReady: () => {
            setIsReady(true)
          },
        })

        editorRef.current = editor
      }

      initEditor()

      return () => {
        if (editorRef.current && isReady) {
          editorRef.current.destroy()
          editorRef.current = null
        }
      }
    }, [data, onChange, readOnly, isReady])

    return (
      <div className="prose max-w-none">
        <div ref={holderRef} className="min-h-[500px] border rounded-lg p-4" />
      </div>
    )
  }
)

Editor.displayName = 'Editor'

export default Editor 
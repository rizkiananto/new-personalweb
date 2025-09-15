"use client"
import * as React from "react"
import { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import { cn } from "@/lib/utils"
import { Eye, Edit3 } from "lucide-react"
import { Button } from "./button"

interface MarkdownTextareaProps extends Omit<React.ComponentProps<"textarea">, 'value' | 'onChange'> {
  value?: string
  onChange?: (value: string) => void
  showPreview?: boolean
  enablePreview?: boolean
  defaultValue?: string
}

function MarkdownTextarea({ 
  className, 
  value: externalValue, 
  onChange: externalOnChange, 
  showPreview = false,
  enablePreview = true,
  placeholder,
  defaultValue = "",
  ...props 
}: MarkdownTextareaProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(showPreview)
  const [textareaHeight, setTextareaHeight] = useState<number | undefined>()
  const [internalValue, setInternalValue] = useState(defaultValue)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  // Use external value if provided, otherwise use internal state
  const currentValue = externalValue !== undefined ? externalValue : internalValue

  // Handle value changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    if (externalOnChange) {
      externalOnChange(newValue)
    } else {
      setInternalValue(newValue)
    }
  }

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current
      textarea.style.height = 'auto'
      const newHeight = Math.max(150, textarea.scrollHeight)
      textarea.style.height = `${newHeight}px`
      setTextareaHeight(newHeight)
    }
  }, [currentValue])

  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode)
  }

  const textareaClasses = cn(
    "border-input max-h-40 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-[150px] w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none font-mono",
    className
  )

  const previewClasses = cn(
    "border-input dark:bg-input/30 min-h-[150px] w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs md:text-sm prose prose-sm max-w-none",
    "prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:text-foreground prose-blockquote:text-muted-foreground prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground"
  )

  return (
    <div className="relative">
      {enablePreview && (
        <div className="absolute top-2 right-2 z-10">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={togglePreview}
            className="h-7 w-7 p-0"
          >
            {isPreviewMode ? <Edit3 className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </Button>
        </div>
      )}
      
      {isPreviewMode ? (
        <div 
          ref={previewRef}
          className={previewClasses}
          style={{ minHeight: textareaHeight ? `${textareaHeight}px` : '150px' }}
        >
          {currentValue ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                h1: ({ children }) => <h1 className="text-lg font-semibold mb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-base font-semibold mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
                p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-muted-foreground/20 pl-4 italic my-2">
                    {children}
                  </blockquote>
                ),
                code: ({ children, className }) => (
                  className ? (
                    <code className={`${className} bg-muted px-1 py-0.5 rounded text-xs`}>
                      {children}
                    </code>
                  ) : (
                    <code className="bg-muted px-1 py-0.5 rounded text-xs">{children}</code>
                  )
                ),
                pre: ({ children }) => (
                  <pre className="bg-muted p-3 rounded-md overflow-auto text-xs mb-2">
                    {children}
                  </pre>
                ),
              }}
            >
              {currentValue}
            </ReactMarkdown>
          ) : (
            <div className="text-muted-foreground text-sm">
              {placeholder && (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => <h1 className="text-lg font-semibold mb-2 text-muted-foreground">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-base font-semibold mb-2 text-muted-foreground">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-sm font-semibold mb-1 text-muted-foreground">{children}</h3>,
                    p: ({ children }) => <p className="mb-2 leading-relaxed text-muted-foreground">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc ml-4 mb-2 text-muted-foreground">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal ml-4 mb-2 text-muted-foreground">{children}</ol>,
                    li: ({ children }) => <li className="mb-1 text-muted-foreground">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold text-muted-foreground">{children}</strong>,
                    code: ({ children }) => (
                      <code className="bg-muted/50 px-1 py-0.5 rounded text-xs text-muted-foreground">{children}</code>
                    ),
                  }}
                >
                  {placeholder}
                </ReactMarkdown>
              )}
            </div>
          )}
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          data-slot="textarea"
          className={textareaClasses}
          value={currentValue}
          onChange={handleChange}
          placeholder={placeholder}
          {...props}
        />
      )}
    </div>
  )
}

export { MarkdownTextarea }
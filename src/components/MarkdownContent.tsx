import ReactMarkdown from 'react-markdown'

interface Props {
  children: string
  className?: string
}

export default function MarkdownContent({ children, className = '' }: Props) {
  return (
    <div className={`markdown-prose ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-white mt-4 mb-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold text-white mt-3 mb-2">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-slate-200 mt-3 mb-1">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-slate-300 leading-relaxed mb-3 last:mb-0">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="text-white font-semibold">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="text-slate-200 italic">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 mb-3 text-slate-300">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 mb-3 text-slate-300">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-slate-300 leading-relaxed">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#3b82f6] pl-4 my-3 text-slate-400 italic">
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isBlock = className?.includes('language-')
            return isBlock ? (
              <code className="block bg-[#0f172a] rounded-lg px-4 py-3 text-sm text-slate-300 font-mono overflow-x-auto mb-3">
                {children}
              </code>
            ) : (
              <code className="bg-[#0f172a] rounded px-1.5 py-0.5 text-sm text-blue-300 font-mono">
                {children}
              </code>
            )
          },
          hr: () => <hr className="border-slate-700 my-4" />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}

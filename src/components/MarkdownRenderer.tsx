import React from 'react';

interface Props {
  content: string;
}

export const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  const lines = content.split('\n');

  const parseInline = (text: string) => {
    // Split by links first: [text](url)
    const linkRegex = /(\[.*?\]\(.*?\))/g;
    const parts = text.split(linkRegex);

    return parts.map((part, idx) => {
      // Check if this part is a link
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        const [_, label, url] = linkMatch;
        return (
          <a
            key={idx}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-cyan font-medium hover:underline inline-flex items-center gap-0.5 transition-colors hover:text-accent-purple"
          >
            {label}
            <svg className="w-3 h-3 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        );
      }

      // Handle Bold inside text: **text**
      const boldRegex = /(\*\*.*?\*\*)/g;
      const subParts = part.split(boldRegex);

      return (
        <React.Fragment key={idx}>
          {subParts.map((subPart, subIdx) => {
            if (subPart.startsWith('**') && subPart.endsWith('**')) {
              return <strong key={subIdx} className="font-bold text-white">{subPart.slice(2, -2)}</strong>;
            }
            return subPart;
          })}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="markdown-body space-y-3">
      {lines.map((line, idx) => {
        // H2 Headers
        if (line.startsWith('## ')) {
          return <h2 key={idx} className="text-2xl font-bold text-white mt-6 mb-3 pb-1 border-b border-white/20">{line.replace('## ', '')}</h2>;
        }
        // H3 Headers
        if (line.startsWith('### ')) {
          return <h3 key={idx} className="text-xl font-bold text-white mt-4 mb-2">{line.replace('### ', '')}</h3>;
        }

        // List items
        if (line.startsWith('* ') || line.startsWith('- ')) {
          return (
            <div key={idx} className="flex items-start ml-2 mb-2 group">
              <span className="text-accent-cyan mr-2 mt-1.5 text-lg leading-none">•</span>
              <div className="text-white leading-relaxed">{parseInline(line.substring(2))}</div>
            </div>
          );
        }

        // Empty lines
        if (line.trim() === '') return <div key={idx} className="h-1"></div>;

        // Paragraphs
        return (
          <p key={idx} className="text-white leading-relaxed mb-3">
            {parseInline(line)}
          </p>
        );
      })}
    </div>
  );
};
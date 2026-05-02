import React from 'react';

/**
 * SimpleMarkdown — lightweight, crash-proof markdown renderer.
 * Handles: headings (# ## ###), bold (**text**), italic (*text*),
 * unordered lists (- / *), ordered lists (1. 2. 3.), inline code (`code`), paragraphs.
 * No external dependencies.
 */

// Apply inline formatting: bold, italic, inline code
const renderInline = (text) => {
  const parts = [];
  // Split on **bold**, *italic*, `code`
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIdx = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index));
    }
    const raw = match[0];
    if (raw.startsWith('**')) {
      parts.push(<strong key={match.index}>{raw.slice(2, -2)}</strong>);
    } else if (raw.startsWith('`')) {
      parts.push(<code key={match.index} className="inline-code">{raw.slice(1, -1)}</code>);
    } else {
      parts.push(<em key={match.index}>{raw.slice(1, -1)}</em>);
    }
    lastIdx = match.index + raw.length;
  }

  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  return parts;
};

const SimpleMarkdown = ({ children, className }) => {
  if (!children || typeof children !== 'string') return null;

  const lines = children.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) { i++; continue; }

    // Headings
    if (trimmed.startsWith('### ')) {
      elements.push(<h3 key={i}>{renderInline(trimmed.slice(4))}</h3>);
      i++; continue;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(<h3 key={i}>{renderInline(trimmed.slice(3))}</h3>);
      i++; continue;
    }
    if (trimmed.startsWith('# ')) {
      elements.push(<h3 key={i}>{renderInline(trimmed.slice(2))}</h3>);
      i++; continue;
    }

    // Unordered list — collect consecutive items
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items = [];
      while (i < lines.length) {
        const t = lines[i].trim();
        if (t.startsWith('- ') || t.startsWith('* ')) {
          items.push(<li key={i}>{renderInline(t.slice(2))}</li>);
          i++;
        } else break;
      }
      elements.push(<ul key={`ul-${i}`}>{items}</ul>);
      continue;
    }

    // Ordered list — collect consecutive items
    if (/^\d+\.\s/.test(trimmed)) {
      const items = [];
      while (i < lines.length) {
        const t = lines[i].trim();
        if (/^\d+\.\s/.test(t)) {
          items.push(<li key={i}>{renderInline(t.replace(/^\d+\.\s/, ''))}</li>);
          i++;
        } else break;
      }
      elements.push(<ol key={`ol-${i}`}>{items}</ol>);
      continue;
    }

    // Regular paragraph
    elements.push(<p key={i}>{renderInline(trimmed)}</p>);
    i++;
  }

  return <div className={className || 'markdown-body'}>{elements}</div>;
};

export default SimpleMarkdown;

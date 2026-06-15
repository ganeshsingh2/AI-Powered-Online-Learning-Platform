import React from 'react';

const toPlainText = (content) => {
    if (!content) {
        return '';
    }

    if (Array.isArray(content)) {
        return content.map(toPlainText).join('\n');
    }

    if (typeof content === 'object') {
        return Object.values(content).map(toPlainText).filter(Boolean).join('\n');
    }

    return String(content).replace(/<[^>]*>/g, '');
}

export const InlineContent = ({ text }) => {
    const parts = String(text || '')
        .replace(/\\`/g, '`')
        .split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g)
        .filter(Boolean);

    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className='font-semibold text-gray-900'>{part.slice(2, -2)}</strong>;
        }

        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={index}>{part.slice(1, -1)}</em>;
        }

        if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={index} className='rounded bg-gray-100 px-1 py-0.5 text-xs text-gray-800'>{part.slice(1, -1)}</code>;
        }

        return part;
    });
}

const parseMarkdownLine = (line) => {
    const trimmedLine = line.trim();
    const headingMatch = trimmedLine.match(/^(#{1,6})\s*(.+)$/);
    const bulletMatch = trimmedLine.match(/^[-*]\s+(.+)$/);
    const numberedMatch = trimmedLine.match(/^\d+\.\s+(.+)$/);

    if (headingMatch) {
        return {
            type: 'heading',
            text: headingMatch[2].replace(/\*+/g, ''),
        };
    }

    if (bulletMatch) {
        return {
            type: 'bullet',
            text: bulletMatch[1],
        };
    }

    if (numberedMatch) {
        return {
            type: 'numbered',
            text: numberedMatch[1],
        };
    }

    return {
        type: 'paragraph',
        text: trimmedLine,
    };
}

function FormattedContent({ content, emptyText = 'No content available for this topic.' }) {
    const text = toPlainText(content);

    if (!text) {
        return <p className='text-sm text-gray-500'>{emptyText}</p>;
    }

    const blocks = [];
    let bulletItems = [];
    let numberedItems = [];

    const flushBulletItems = () => {
        if (bulletItems.length) {
            blocks.push({ type: 'bullets', items: bulletItems });
            bulletItems = [];
        }
    }

    const flushNumberedItems = () => {
        if (numberedItems.length) {
            blocks.push({ type: 'numberedList', items: numberedItems });
            numberedItems = [];
        }
    }

    text.split(/\n+/).forEach((line) => {
        if (!line.trim()) {
            flushBulletItems();
            flushNumberedItems();
            return;
        }

        const parsedLine = parseMarkdownLine(line);

        if (parsedLine.type === 'bullet') {
            flushNumberedItems();
            bulletItems.push(parsedLine.text);
            return;
        }

        if (parsedLine.type === 'numbered') {
            flushBulletItems();
            numberedItems.push(parsedLine.text);
            return;
        }

        flushBulletItems();
        flushNumberedItems();
        blocks.push(parsedLine);
    });

    flushBulletItems();
    flushNumberedItems();

    return (
        <div className='space-y-3 text-sm leading-6 text-gray-700'>
            {blocks.map((block, index) => {
                if (block.type === 'heading') {
                    return (
                        <h4 key={index} className='pt-2 text-base font-semibold text-gray-950'>
                            <InlineContent text={block.text} />
                        </h4>
                    );
                }

                if (block.type === 'bullets') {
                    return (
                        <ul key={index} className='list-disc space-y-1 pl-5'>
                            {block.items.map((item, itemIndex) => (
                                <li key={itemIndex}><InlineContent text={item} /></li>
                            ))}
                        </ul>
                    );
                }

                if (block.type === 'numberedList') {
                    return (
                        <ol key={index} className='list-decimal space-y-1 pl-5'>
                            {block.items.map((item, itemIndex) => (
                                <li key={itemIndex}><InlineContent text={item} /></li>
                            ))}
                        </ol>
                    );
                }

                return <p key={index}><InlineContent text={block.text} /></p>;
            })}
        </div>
    );
}

export default FormattedContent;

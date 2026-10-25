/**
 * Helper to automatically extract FAQ Question & Answer pairs from Markdown/MDX content.
 * Looks for sections like "## Frequently Asked Questions", "## FAQ", or question headings.
 */
export interface ExtractedFaq {
    question: string;
    answer: string;
}

export function extractFaqsFromMarkdown(content: string): ExtractedFaq[] {
    if (!content) return [];

    const faqs: ExtractedFaq[] = [];

    // Look for an FAQ section header (e.g., ## Frequently Asked Questions, ## FAQ, ## Common Questions)
    const faqSectionMatch = content.match(/##\s+(?:Frequently Asked Questions|FAQ|Common Questions|Questions and Answers)[\s\S]*$/i);
    const textToSearch = faqSectionMatch ? faqSectionMatch[0] : content;

    // Match ### Question text? followed by answer paragraphs until next heading or divider
    const questionRegex = /###\s+([^?\n\r]+(?:\?|[^\n\r]*\?))\s*\r?\n([\s\S]*?)(?=(?:###|\r?\n---|\r?\n##|$))/g;

    let match: RegExpExecArray | null;
    while ((match = questionRegex.exec(textToSearch)) !== null) {
        const question = match[1].replace(/[*_#`]/g, '').trim();
        let answer = match[2]
            .replace(/[*_#`]/g, '')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Strip markdown links to plain text
            .replace(/\s+/g, ' ')
            .trim();

        // Skip non-questions or very short answers
        if (question && question.endsWith('?') && answer.length >= 20) {
            // Cap answer at 500 chars for schema cleanliness
            if (answer.length > 500) {
                answer = answer.slice(0, 497) + '...';
            }
            faqs.push({ question, answer });
        }
    }

    return faqs;
}

import { Heading } from '../types/index.s';

export function parseMarkdownHeadings(markdown: string): Heading[] {
  const headingRegex = /^(##)\s+(.*)$/gm;
  const headings: Heading[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(markdown)) !== null) {
    // Ensure match[1] and match[2] are defined and non-empty strings
    const level = match[1]?.length || 0; // Use optional chaining and fallback to 0 if match[1] is undefined
    const text = (match[2] || '').trim(); // Use default value '' and trim to ensure text is defined and non-empty

    if (text) {
      headings.push({ level, text });
    }
  }


  return headings;
}

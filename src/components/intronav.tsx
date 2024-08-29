import React from 'react';
import { parseMarkdownHeadings } from '../lib/parseHeading';
import { Heading } from '../types/index.s';

interface NavbarProps {
  markdownContent: string;
}

const introNav: React.FC<NavbarProps> = ({ markdownContent }) => {
  const headings: Heading[] = parseMarkdownHeadings(markdownContent);

  return (
    <nav className="navbar text-left">
      <ul>
        {headings.map((heading) => (
          <li key={heading.id}>
            {/* Set the href to /view/[slug] where [slug] is the heading id */}
            <a href={`/view/${heading.id}`}>{heading.title}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default introNav;

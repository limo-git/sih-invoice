import fs from "fs";
import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringfy from "rehype-stringify";

//define path containing markdown files
const markdownFileDirectory = path.join(process.cwd(), "markdown-files");

//check if files ends with .md and filter them by creating an array of them.
export function getMarkdownFiles(): string[] {
  const files = fs.readdirSync(markdownFileDirectory);
  return files.filter((file: string) => file.endsWith(".md"));
}

//get the content of markdown file
export async function getMarkdownContent(fileName: string): Promise<string> {
  const completePath = path.join(markdownFileDirectory, fileName);
  const fileContents = fs.readFileSync(completePath, "utf-8");

  const content = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringfy)
    .process(fileContents);

  return String(content);
}

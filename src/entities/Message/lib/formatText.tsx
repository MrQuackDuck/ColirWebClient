import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs as lightTheme } from "react-syntax-highlighter/dist/esm/styles/prism";
import { vscDarkPlus as darkTheme } from "react-syntax-highlighter/dist/esm/styles/prism";

export function formatText(text: string, theme: string): JSX.Element {
  const codeBlockParts = extractCodeBlocks(text);
  const textWithCodePlaceholders = replaceCodeBlocks(text);
  const parts = splitTextParts(textWithCodePlaceholders);

  const formattedText = parts.map((part, index) => formatTextPart(part, index, codeBlockParts, theme));

  return <>{formattedText}</>;
}

/**
 * Extract code blocks from the text
 */
function extractCodeBlocks(text: string): { type: "code"; language: string; content: string }[] {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const codeBlockParts: { type: "code"; language: string; content: string }[] = [];

  text.replace(codeBlockRegex, (match, language, content) => {
    codeBlockParts.push({
      type: "code",
      language: language || "text",
      content: content.trim()
    });
    return match;
  });

  return codeBlockParts;
}

/**
 * Replace code blocks with placeholders
 */
function replaceCodeBlocks(text: string): string {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  return text.replace(codeBlockRegex, (_, __, content, ___, fullText) => {
    return `__CODE_BLOCK_${extractCodeBlocks(fullText).findIndex((block) => block.content.trim() === content.trim())}__`;
  });
}

/**
 * Split text into parts for processing
 */
function splitTextParts(text: string): string[] {
  return text.split(/(\*\*.*?\*\*|__CODE_BLOCK_\d+__|https?:\/\/[^\s]+)/g);
}

/**
 * Format individual text parts
 */
function formatTextPart(part: string, index: number, codeBlockParts: { type: "code"; language: string; content: string }[], theme: string): React.ReactNode {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Bold text between **
  if (part.startsWith("**") && part.endsWith("**")) {
    const boldContent = part.slice(2, -2);
    return <strong key={index}>{boldContent}</strong>;
  }

  // Code blocks
  const codeBlockMatch = part.match(/^__CODE_BLOCK_(\d+)__$/);
  if (codeBlockMatch) {
    const codeBlock = codeBlockParts[parseInt(codeBlockMatch[1])];
    return (
      <SyntaxHighlighter
        key={index}
        language={codeBlock.language}
        style={theme === "dark" ? darkTheme : lightTheme}
        customStyle={{
          borderRadius: "0.375rem",
          padding: "0.5rem",
          fontSize: "0.875rem",
          overflowX: "auto"
        }}
      >
        {codeBlock.content}
      </SyntaxHighlighter>
    );
  }

  // URLs
  if (urlRegex.test(part)) {
    return (
      <a href={part} key={index} target="_blank" rel="noopener noreferrer" className="hover:underline">
        {part}
      </a>
    );
  }

  // Regular text
  return part;
}

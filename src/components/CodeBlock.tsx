import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  children: React.ReactNode;
  title?: string;
  language?: string;
}

const CodeBlock = ({ children, title, language = "cmd" }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = typeof children === 'string' ? children : '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 rounded-lg border border-code-border bg-code-bg overflow-hidden">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-code-border bg-muted">
          <span className="text-sm font-medium text-foreground">{title}</span>
          <span className="text-xs text-muted-foreground uppercase">{language}</span>
        </div>
      )}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-white/10"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-400" />
          ) : (
            <Copy className="h-3 w-3 text-code-text" />
          )}
        </Button>
        <pre className="p-4 overflow-x-auto text-sm text-code-text">
          <code>{children}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
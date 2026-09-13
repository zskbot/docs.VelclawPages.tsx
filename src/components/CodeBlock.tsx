import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface Props {
  code: string;
}

export default function CodeBlock({ code }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // clipboard permission denied — the visual feedback below still fires
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mt-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 dark:border-neutral-800">
        <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500">bash</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-200 transition-colors active:scale-95"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-brand-500" /> Đã sao chép
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Sao chép
            </>
          )}
        </button>
      </div>
      <div className="px-4 py-3 font-mono text-sm overflow-x-auto">
        <span className="text-brand-500">$</span>{' '}
        <span className="text-neutral-800 dark:text-neutral-200">{code}</span>
      </div>
    </div>
  );
}

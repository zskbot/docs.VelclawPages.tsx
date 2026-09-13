import nav from '../../content/nav.json';
import { NavConfig } from '../lib/types';
import { ICON_MAP } from '../lib/icons';
import { Search } from 'lucide-react';

const navConfig = nav as NavConfig;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: Props) {
  if (!open) return null;

  const allItems = navConfig.groups.flatMap((g) => g.items);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-2xl vc-fade overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
          <Search className="h-4 w-4 text-neutral-500" />
          <input
            autoFocus
            placeholder="Tìm kiếm tài liệu..."
            className="flex-1 bg-transparent outline-none text-sm text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400"
          />
          <button
            onClick={onClose}
            className="text-xs px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 text-neutral-500"
          >
            ESC
          </button>
        </div>
        <div className="p-2">
          {allItems.map((item) => {
            const Icon = ICON_MAP[item.icon];
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={onClose}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              >
                <Icon className="h-4 w-4 text-neutral-500" />
                {item.label}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

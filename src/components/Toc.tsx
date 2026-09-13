import { TocItem } from '../lib/types';

interface Props {
  items: TocItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

export default function Toc({ items, activeId, onSelect }: Props) {
  return (
    <div className="sticky top-20">
      <p className="text-xs font-medium text-neutral-500 mb-3">Trên trang này</p>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => onSelect(item.id)}
              className={`text-left transition-colors ${
                activeId === item.id
                  ? 'text-brand-500 font-medium'
                  : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

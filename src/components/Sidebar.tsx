import nav from '../../content/nav.json';
import { NavConfig } from '../lib/types';
import { ICON_MAP } from '../lib/icons';

const navConfig = nav as NavConfig;

interface Props {
  activeId: string;
  onNavigate?: () => void;
}

export default function Sidebar({ activeId, onNavigate }: Props) {
  return (
    <nav className="space-y-6">
      {navConfig.groups.map((group) => (
        <div key={group.label}>
          <p className="text-xs font-medium text-neutral-500 mb-2 px-2">{group.label}</p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = ICON_MAP[item.icon];
              const active = item.id === activeId;
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-colors ${
                      active
                        ? 'bg-brand-600/10 text-brand-500 font-medium'
                        : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:text-neutral-200 dark:hover:bg-neutral-900'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

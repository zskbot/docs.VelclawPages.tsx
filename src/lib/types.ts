export type IconName =
  | 'BookOpen' | 'Rocket' | 'Boxes' | 'Bot' | 'Cpu' | 'GitBranch' | 'ShieldCheck' | 'Terminal' | 'KeyRound' | 'Store';

export interface NavItem { id: string; label: string; icon: IconName; href: string; }
export interface NavGroup { label: string; items: NavItem[]; }
export interface NavConfig { groups: NavGroup[]; }
export interface Step { id: string; num: string; title: string; body: string; code: string | null; }
export interface TocItem { id: string; label: string; }
export interface NextCard { icon: IconName; title: string; desc: string; href: string; }
export interface QuickstartConfig { activeNavId: string; breadcrumb: string[]; eyebrow: string; title: string; description: string; requirement: string; steps: Step[]; toc: TocItem[]; nextCards: NextCard[]; }

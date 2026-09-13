import { useEffect, useRef, useState } from 'react';
import quickstart from '../../content/quickstart.json';
import nav from '../../content/nav.json';
import { NavConfig, QuickstartConfig } from '../lib/types';
import { ICON_MAP } from '../lib/icons';
import Sidebar from '../components/Sidebar';
import Toc from '../components/Toc';
import CodeBlock from '../components/CodeBlock';
import SearchModal from '../components/SearchModal';
import Header from '../components/Header';
import { ChevronRight, Rocket, ThumbsUp, ThumbsDown, ArrowUpRight, X } from 'lucide-react';

const data = quickstart as QuickstartConfig;
const navConfig = nav as NavConfig;

export default function Quickstart() {
  const [dark, setDark] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(data.toc[0].id);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      let current = data.toc[0].id;
      for (const item of data.toc) {
        const el = sectionRefs.current[item.id];
        if (el && el.getBoundingClientRect().top < 140) current = item.id;
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 transition-colors">
      <Header
        dark={dark}
        onToggleTheme={() => setDark((d) => !d)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenMobileNav={() => setMobileNavOpen(true)}
      />

      <div className="max-w-[1400px] mx-auto flex">
        {/* Sidebar - desktop */}
        <aside className="hidden lg:block w-64 shrink-0 border-r border-neutral-200 dark:border-neutral-800 h-[calc(100vh-56px)] sticky top-14 overflow-y-auto py-8 pr-4">
          <Sidebar activeId={data.activeNavId} />
        </aside>

        {/* Sidebar - mobile drawer */}
        {mobileNavOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/60" onClick={() => setMobileNavOpen(false)} />
            <div className="relative w-72 h-full bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 p-6 overflow-y-auto vc-fade">
              <button
                onClick={() => setMobileNavOpen(false)}
                className="mb-6 h-8 w-8 flex items-center justify-center rounded-md border border-neutral-200 dark:border-neutral-800"
              >
                <X className="h-4 w-4" />
              </button>
              <Sidebar activeId={data.activeNavId} onNavigate={() => setMobileNavOpen(false)} />
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0 px-6 md:px-10 py-10 max-w-3xl">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-4">
            {data.breadcrumb.map((crumb, i) => (
              <span key={crumb} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3 w-3" />}
                <span className={i === data.breadcrumb.length - 1 ? 'text-neutral-700 dark:text-neutral-300' : ''}>
                  {crumb}
                </span>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Rocket className="h-4 w-4 text-brand-500" />
            <span className="font-mono text-xs text-brand-500">{data.eyebrow}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{data.title}</h1>
          <p className="text-lg text-neutral-500 leading-relaxed mb-8">{data.description}</p>

          <div className="rounded-lg border-l-4 border-l-sky-500 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-4 py-3 mb-10 text-sm">
            <strong className="font-semibold">Yêu cầu:</strong> {data.requirement}
          </div>

          <div className="space-y-10">
            {data.steps.map((step) => (
              <div key={step.id} ref={(el) => (sectionRefs.current[step.id] = el)} className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-mono font-semibold ${
                      activeSection === step.id
                        ? 'bg-brand-600 text-white'
                        : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-500'
                    }`}
                  >
                    {step.num}
                  </span>
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                </div>
                <p className="text-neutral-500 leading-relaxed pl-9">{step.body}</p>
                {step.code && (
                  <div className="pl-9">
                    <CodeBlock code={step.code} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div ref={(el) => (sectionRefs.current['buoc-tiep-theo'] = el)} className="mt-16 scroll-mt-24">
            <h2 className="font-semibold text-xl mb-5">Bước tiếp theo</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {data.nextCards.map((card) => {
                const Icon = ICON_MAP[card.icon as keyof typeof ICON_MAP];
                return (
                  <a
                    key={card.title}
                    href={card.href}
                    className="group rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 hover:border-brand-500/50 transition-colors"
                  >
                    <Icon className="h-4 w-4 text-brand-500 mb-3" />
                    <div className="flex items-center gap-1 font-medium text-sm mb-1">
                      {card.title}
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs text-neutral-500 leading-relaxed">{card.desc}</p>
                  </a>
                );
              })}
            </div>
          </div>

          <div className="mt-16 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-neutral-500">
              <a href="#" className="hover:text-brand-500 transition-colors">Chỉnh sửa trang này</a>
              <a href="#" className="hover:text-brand-500 transition-colors">Sao chép dưới dạng Markdown</a>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <span>Trang này hữu ích chứ?</span>
              <button
                onClick={() => setFeedback('up')}
                className={`h-7 w-7 flex items-center justify-center rounded-md border transition-colors active:scale-95 ${
                  feedback === 'up' ? 'border-brand-500 text-brand-500' : 'border-neutral-200 dark:border-neutral-800'
                }`}
              >
                <ThumbsUp className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setFeedback('down')}
                className={`h-7 w-7 flex items-center justify-center rounded-md border transition-colors active:scale-95 ${
                  feedback === 'down' ? 'border-brand-500 text-brand-500' : 'border-neutral-200 dark:border-neutral-800'
                }`}
              >
                <ThumbsDown className="h-3.5 w-3.5" />
              </button>
              {feedback && <span className="text-xs vc-fade">Cảm ơn phản hồi!</span>}
            </div>
          </div>
        </main>

        {/* TOC - desktop */}
        <aside className="hidden xl:block w-56 shrink-0 py-10 pl-6">
          <Toc items={data.toc} activeId={activeSection} onSelect={scrollTo} />
        </aside>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}

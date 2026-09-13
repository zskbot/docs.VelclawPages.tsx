import { useState } from 'react';
import { Boxes, ExternalLink, Github, Globe2, Package, Search, ShieldCheck, Sparkles, Terminal } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

type Store = 'all' | 'google' | 'github' | 'chatgpt' | 'npm';
const stores = [
  { id: 'google' as Store, name: 'Google / Chrome Web Store', url: 'https://chromewebstore.google.com/', icon: Globe2, text: 'Chrome extensions và Google ecosystem.' },
  { id: 'github' as Store, name: 'GitHub Marketplace', url: 'https://github.com/marketplace', icon: Github, text: 'GitHub Apps, Actions và developer tools.' },
  { id: 'chatgpt' as Store, name: 'ChatGPT Apps', url: 'https://chatgpt.com/', icon: Sparkles, text: 'Apps, skills và integrations cần quyền của nhà cung cấp.' },
  { id: 'npm' as Store, name: 'Open Source / npm', url: 'https://www.npmjs.com/', icon: Package, text: 'Thư viện JavaScript/TypeScript mở rộng Velclaw.' },
];

export default function PluginMarketplace() {
  const [dark, setDark] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [store, setStore] = useState<Store>('all');
  const [query, setQuery] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [installing, setInstalling] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const searchNpm = async () => {
    const q = query.trim();
    if (!q) return;
    setLoading(true); setMessage('');
    try {
      const r = await fetch(`/api/libraries/search?q=${encodeURIComponent(q)}&size=16`);
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Search failed');
      setResults(d.packages || []); setStore('npm');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Search failed'); }
    finally { setLoading(false); }
  };

  const install = async (pkg: any) => {
    if (!repoUrl.trim()) { setMessage('Nhập GitHub repository URL của workspace trước khi cài thư viện.'); return; }
    setInstalling(pkg.name); setMessage('');
    try {
      const r = await fetch('/api/libraries/install', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: pkg.name, version: pkg.version, repoUrl: repoUrl.trim() }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || d.details || 'Installation failed');
      setMessage(`Đã cài ${d.package} vào sandbox ${d.sandboxId}. Lifecycle scripts đã bị tắt.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Installation failed'); }
    finally { setInstalling(null); }
  };

  return <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200">
    <Header dark={dark} onToggleTheme={() => setDark(v => !v)} onOpenSearch={() => undefined} onOpenMobileNav={() => setMobileNavOpen(true)} />
    <div className="max-w-[1400px] mx-auto flex"><aside className="hidden lg:block w-64 shrink-0 border-r border-neutral-200 dark:border-neutral-800 h-[calc(100vh-56px)] sticky top-14 overflow-y-auto py-8 pr-4"><Sidebar activeId="plugins" /></aside>
    {mobileNavOpen && <div className="lg:hidden fixed inset-0 z-50 bg-black/60"><div className="w-72 h-full bg-white dark:bg-neutral-950 p-6"><Sidebar activeId="plugins" /></div></div>}
    <main className="flex-1 min-w-0 px-5 py-10 sm:px-10 lg:px-16 lg:py-14"><div className="max-w-5xl">
      <div className="flex items-center gap-3 text-sm text-neutral-500 mb-4"><Boxes className="h-4 w-4" /> Ecosystem</div><h1 className="text-4xl font-semibold tracking-tight">Plugin & Library Store</h1><p className="mt-4 text-lg text-neutral-500 dark:text-neutral-400">Tìm, kết nối và mở rộng Velclaw bằng plugin, GitHub Apps, ChatGPT apps và thư viện mã nguồn mở.</p>
      <div className="mt-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 p-5">
        <div className="flex gap-3"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500"/><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&void searchNpm()} placeholder="Tìm thư viện npm mã nguồn mở..." className="w-full h-11 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 pl-10 px-3 text-sm"/></div><button onClick={()=>void searchNpm()} className="h-11 px-5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black text-sm">{loading?'Searching…':'Search'}</button></div>
        <div className="mt-4"><label className="text-xs text-neutral-500">GitHub workspace repository để cài thư viện</label><input value={repoUrl} onChange={e=>setRepoUrl(e.target.value)} placeholder="https://github.com/owner/repository" className="mt-1 w-full h-10 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3 text-sm"/></div>
        <div className="flex flex-wrap gap-2 mt-4"><button onClick={()=>setStore('all')} className="px-3 py-1.5 rounded-full text-xs border">All stores</button>{stores.map(s=><button key={s.id} onClick={()=>setStore(s.id)} className={`px-3 py-1.5 rounded-full text-xs border ${store===s.id?'bg-neutral-900 text-white dark:bg-white dark:text-black':''}`}>{s.name}</button>)}</div>
        {message && <div className="mt-4 rounded-lg border border-neutral-200 dark:border-neutral-700 p-3 text-sm">{message}</div>}
      </div>
      {store==='npm' && results.length>0 ? <section className="mt-8 grid sm:grid-cols-2 gap-4">{results.map(x=><article key={x.name} className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5"><div className="flex justify-between"><Package className="h-5 w-5"/><span className="text-xs text-emerald-600 inline-flex gap-1 items-center"><ShieldCheck className="h-3 w-3"/> npm registry</span></div><h2 className="mt-4 font-medium">{x.name}</h2><p className="mt-2 text-sm text-neutral-500 min-h-10">{x.description||'Open-source package'}</p><div className="mt-4 flex gap-2"><code className="flex-1 rounded-md bg-neutral-100 dark:bg-neutral-900 px-3 py-2 text-xs truncate">{x.name}@{x.version}</code><button disabled={installing===x.name} onClick={()=>void install(x)} className="px-3 rounded-md border text-xs inline-flex items-center gap-1 disabled:opacity-50"><Terminal className="h-3 w-3"/>{installing===x.name?'Installing…':'Install'}</button></div><a className="mt-4 inline-flex gap-2 text-sm underline" href={x.npm} target="_blank" rel="noreferrer">View package <ExternalLink className="h-3.5 w-3.5"/></a></article>)}</section> : <section className="mt-8 grid sm:grid-cols-2 gap-4">{stores.map(s=>{const Icon=s.icon; const target=s.id==='google'&&query?`https://www.google.com/search?q=${encodeURIComponent(`${query} plugin`)}`:s.id==='github'&&query?`https://github.com/marketplace?query=${encodeURIComponent(query)}`:s.url; return <article key={s.id} className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5"><div className="flex justify-between"><div className="h-10 w-10 rounded-lg border flex items-center justify-center"><Icon className="h-5 w-5"/></div><span className="text-xs text-emerald-600 inline-flex gap-1 items-center"><ShieldCheck className="h-3 w-3"/> Official source</span></div><h2 className="mt-4 font-medium">{s.name}</h2><p className="mt-2 text-sm text-neutral-500">{s.text}</p><a className="mt-5 inline-flex gap-2 text-sm underline" href={target} target="_blank" rel="noreferrer">{query&&s.id!=='npm'?'Search / open':'Open store'} <ExternalLink className="h-3.5 w-3.5"/></a></article>})}</section>}
      <div className="mt-8 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 text-sm text-neutral-500"><strong className="text-neutral-800 dark:text-neutral-200">Velclaw security:</strong> package installation runs in an isolated sandbox, accepts only GitHub repositories and npm package names, and disables npm/pnpm/yarn lifecycle scripts. Google/Chrome and ChatGPT integrations remain provider-controlled authorization flows.</div>
    </div></main></div>
  </div>;
}

import { useEffect, useState } from 'react';
import { Check, Copy, KeyRound, Loader2, Shield, Trash2, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

type ApiKey = { id: string; name: string; token_prefix: string; created_at: string; last_used_at?: string | null; revoked_at?: string | null };

type CreatedKey = { id: string; name: string; token: string; tokenPrefix: string };

export default function ApiKeys() {
  const [dark, setDark] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [name, setName] = useState('');
  const [created, setCreated] = useState<CreatedKey | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { document.documentElement.classList.toggle('dark', dark); void load(); }, [dark]);

  async function load() {
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/developer-api-keys', { credentials: 'include' });
      const data = await response.json();
      if (response.status === 401) throw new Error('Bạn cần đăng nhập Velclaw để quản lý API keys.');
      if (!response.ok) throw new Error(data.error || 'Không thể tải API keys.');
      setKeys(data.apiKeys || []);
    } catch (err) { setError(err instanceof Error ? err.message : 'Không thể kết nối API.'); }
    finally { setLoading(false); }
  }

  async function createKey() {
    setBusy(true); setError(''); setCreated(null);
    try {
      const response = await fetch('/api/developer-api-keys', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
      const data = await response.json();
      if (response.status === 401) throw new Error('Bạn cần đăng nhập Velclaw.');
      if (!response.ok) throw new Error(data.error || 'Không thể tạo API key.');
      setCreated(data.apiKey); setName(''); await load();
    } catch (err) { setError(err instanceof Error ? err.message : 'Không thể tạo API key.'); }
    finally { setBusy(false); }
  }

  async function revokeKey(id: string) {
    if (!window.confirm('Revoke API key này? Key sẽ không thể sử dụng lại.')) return;
    setBusy(true); setError('');
    try {
      const response = await fetch(`/api/developer-api-keys?id=${encodeURIComponent(id)}`, { method: 'DELETE', credentials: 'include' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Không thể revoke API key.');
      await load();
      if (created?.id === id) setCreated(null);
    } catch (err) { setError(err instanceof Error ? err.message : 'Không thể revoke API key.'); }
    finally { setBusy(false); }
  }

  async function copyToken() {
    if (!created) return;
    await navigator.clipboard.writeText(created.token);
    setCopied(true); window.setTimeout(() => setCopied(false), 1800);
  }

  return <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200">
    <Header dark={dark} onToggleTheme={() => setDark(v => !v)} onOpenSearch={() => undefined} onOpenMobileNav={() => setMobileNavOpen(true)} />
    <div className="max-w-[1400px] mx-auto flex">
      <aside className="hidden lg:block w-64 shrink-0 border-r border-neutral-200 dark:border-neutral-800 h-[calc(100vh-56px)] sticky top-14 overflow-y-auto py-8 pr-4"><Sidebar activeId="api-keys" /></aside>
      {mobileNavOpen && <div className="lg:hidden fixed inset-0 z-50 flex"><div className="absolute inset-0 bg-black/60" onClick={() => setMobileNavOpen(false)} /><div className="relative w-72 h-full bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 p-6 overflow-y-auto"><button onClick={() => setMobileNavOpen(false)} className="mb-6 h-8 w-8 flex items-center justify-center rounded-md border border-neutral-200 dark:border-neutral-800"><X className="h-4 w-4" /></button><Sidebar activeId="api-keys" /></div></div>}
      <main className="flex-1 min-w-0 px-5 py-10 sm:px-10 lg:px-16 lg:py-14"><div className="max-w-4xl">
        <div className="flex items-center gap-3 text-sm text-neutral-500 mb-4"><KeyRound className="h-4 w-4" /> Developer settings</div>
        <h1 className="text-4xl font-semibold tracking-tight">API Keys</h1>
        <p className="mt-4 text-lg text-neutral-500 dark:text-neutral-400">Tạo secret key để gọi Velclaw API. Secret được lưu dưới dạng SHA-256 hash và chỉ hiển thị một lần khi tạo.</p>

        {error && <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm">{error}</div>}

        {created && <section className="mt-8 rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-5"><div className="flex items-start gap-3"><Check className="h-5 w-5 mt-0.5" /><div className="flex-1"><h2 className="font-medium">API key created</h2><p className="text-sm text-neutral-500 mt-1">Copy secret này ngay. Velclaw sẽ không hiển thị plaintext lần nữa.</p><div className="mt-4 flex gap-2"><code className="flex-1 min-w-0 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3 py-2 text-sm break-all">{created.token}</code><button onClick={copyToken} className="shrink-0 h-10 px-3 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-black inline-flex items-center gap-2">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? 'Copied' : 'Copy'}</button></div></div></div></section>}

        <section className="mt-8 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5"><div className="flex items-center gap-3 mb-5"><Shield className="h-5 w-5" /><div><h2 className="font-medium">Create API key</h2><p className="text-sm text-neutral-500 mt-1">Đặt tên để nhận diện key trong workspace.</p></div></div><div className="flex flex-col sm:flex-row gap-3"><input value={name} onChange={e => setName(e.target.value)} placeholder="Production, CLI, CI..." className="h-10 flex-1 rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 text-sm outline-none focus:ring-2 focus:ring-neutral-400" /><button onClick={createKey} disabled={busy} className="h-10 px-5 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-black text-sm disabled:opacity-50 inline-flex items-center justify-center gap-2">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />} Create API Key</button></div></section>

        <section className="mt-8 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"><div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between"><div><h2 className="font-medium">Your keys</h2><p className="text-sm text-neutral-500 mt-1">Chỉ prefix và metadata được lưu/hiển thị.</p></div>{loading && <Loader2 className="h-4 w-4 animate-spin" />}</div><div className="divide-y divide-neutral-200 dark:divide-neutral-800">{!loading && keys.length === 0 && <div className="p-8 text-center text-sm text-neutral-500">Chưa có API key.</div>}{keys.map(key => <div key={key.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4"><div className="flex-1"><div className="font-medium">{key.name}</div><code className="text-sm text-neutral-500">{key.token_prefix}••••••••••••</code><div className="text-xs text-neutral-500 mt-1">Created {new Date(key.created_at).toLocaleString()}</div></div>{key.revoked_at ? <span className="text-xs text-red-500">Revoked</span> : <button onClick={() => revokeKey(key.id)} disabled={busy} className="h-9 px-3 rounded-md border border-red-500/30 text-red-600 dark:text-red-400 text-sm inline-flex items-center gap-2"><Trash2 className="h-4 w-4" /> Revoke</button>}</div>)}</div></section>
      </div></main>
    </div>
  </div>;
}

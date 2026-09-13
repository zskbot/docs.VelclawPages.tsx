import { useEffect, useMemo, useState } from 'react';
import { Check, Eye, EyeOff, KeyRound, Loader2, Trash2, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

type Provider = 'aigateway' | 'anthropic' | 'openai' | 'gemini' | 'cursor';

type SavedKey = { provider: Provider; createdAt?: string };

const providers: { id: Provider; name: string; placeholder: string }[] = [
  { id: 'aigateway', name: 'AI Gateway', placeholder: 'gw_...' },
  { id: 'anthropic', name: 'Anthropic', placeholder: 'sk-ant-...' },
  { id: 'openai', name: 'OpenAI', placeholder: 'sk-...' },
  { id: 'gemini', name: 'Gemini', placeholder: 'AIza...' },
  { id: 'cursor', name: 'Cursor', placeholder: 'cur_...' },
];

export default function ApiKeys() {
  const [dark, setDark] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [saved, setSaved] = useState<Set<Provider>>(new Set());
  const [values, setValues] = useState<Record<Provider, string>>({ aigateway: '', anthropic: '', openai: '', gemini: '', cursor: '' });
  const [visible, setVisible] = useState<Record<Provider, boolean>>({ aigateway: false, anthropic: false, openai: false, gemini: false, cursor: false });
  const [busy, setBusy] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    void loadKeys();
  }, [dark]);

  async function loadKeys() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/api-keys', { credentials: 'include' });
      if (response.status === 401) throw new Error('Bạn cần đăng nhập Velclaw để quản lý API keys.');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Không thể tải API keys.');
      setSaved(new Set((data.apiKeys as SavedKey[]).map((key) => key.provider)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể kết nối API.');
    } finally {
      setLoading(false);
    }
  }

  async function save(provider: Provider) {
    const apiKey = values[provider].trim();
    if (!apiKey) return;
    setBusy(provider); setMessage(''); setError('');
    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, apiKey }),
      });
      const data = await response.json();
      if (response.status === 401) throw new Error('Bạn cần đăng nhập Velclaw.');
      if (!response.ok) throw new Error(data.error || 'Không thể lưu API key.');
      setSaved((current) => new Set(current).add(provider));
      setValues((current) => ({ ...current, [provider]: '' }));
      setMessage(`${providers.find((item) => item.id === provider)?.name} API key đã được lưu.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể lưu API key.');
    } finally { setBusy(null); }
  }

  async function remove(provider: Provider) {
    setBusy(provider); setMessage(''); setError('');
    try {
      const response = await fetch(`/api/api-keys?provider=${encodeURIComponent(provider)}`, { method: 'DELETE', credentials: 'include' });
      const data = await response.json();
      if (response.status === 401) throw new Error('Bạn cần đăng nhập Velclaw.');
      if (!response.ok) throw new Error(data.error || 'Không thể xoá API key.');
      setSaved((current) => { const next = new Set(current); next.delete(provider); return next; });
      setMessage(`${providers.find((item) => item.id === provider)?.name} API key đã được xoá.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xoá API key.');
    } finally { setBusy(null); }
  }

  const apiOrigin = useMemo(() => window.location.origin, []);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200">
      <Header dark={dark} onToggleTheme={() => setDark((value) => !value)} onOpenSearch={() => undefined} onOpenMobileNav={() => setMobileNavOpen(true)} />
      <div className="max-w-[1400px] mx-auto flex">
        <aside className="hidden lg:block w-64 shrink-0 border-r border-neutral-200 dark:border-neutral-800 h-[calc(100vh-56px)] sticky top-14 overflow-y-auto py-8 pr-4"><Sidebar activeId="api-keys" /></aside>
        {mobileNavOpen && <div className="lg:hidden fixed inset-0 z-50 flex"><div className="absolute inset-0 bg-black/60" onClick={() => setMobileNavOpen(false)} /><div className="relative w-72 h-full bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 p-6 overflow-y-auto"><button onClick={() => setMobileNavOpen(false)} className="mb-6 h-8 w-8 flex items-center justify-center rounded-md border border-neutral-200 dark:border-neutral-800"><X className="h-4 w-4" /></button><Sidebar activeId="api-keys" /></div></div>}
        <main className="flex-1 min-w-0 px-5 py-10 sm:px-10 lg:px-16 lg:py-14">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 text-sm text-neutral-500 mb-4"><KeyRound className="h-4 w-4" /> Developer settings</div>
            <h1 className="text-4xl font-semibold tracking-tight">API Keys</h1>
            <p className="mt-4 text-lg text-neutral-500 dark:text-neutral-400">Kết nối provider AI của bạn với Velclaw. Key được gửi vào API server và lưu encrypted; giao diện không hiển thị lại secret đã lưu.</p>

            {message && <div className="mt-6 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm"><Check className="h-4 w-4" />{message}</div>}
            {error && <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm">{error}</div>}

            <section className="mt-8 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between"><div><h2 className="font-medium">Provider credentials</h2><p className="text-sm text-neutral-500 mt-1">Endpoint: <code>{apiOrigin}/api/api-keys</code></p></div>{loading && <Loader2 className="h-4 w-4 animate-spin" />}</div>
              <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {providers.map((provider) => {
                  const connected = saved.has(provider.id); const pending = busy === provider.id;
                  return <div key={provider.id} className="p-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="w-32 shrink-0"><div className="font-medium">{provider.name}</div><div className="text-xs text-neutral-500">{connected ? 'Connected' : 'Not connected'}</div></div>
                    <div className="relative flex-1"><input type={visible[provider.id] ? 'text' : 'password'} value={values[provider.id]} onChange={(event) => setValues((current) => ({ ...current, [provider.id]: event.target.value }))} placeholder={connected ? '••••••••••••••••' : provider.placeholder} disabled={pending || connected} className="w-full h-10 rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-neutral-400" /><button type="button" onClick={() => setVisible((current) => ({ ...current, [provider.id]: !current[provider.id] }))} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500" disabled={pending || connected}>{visible[provider.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
                    {connected ? <button onClick={() => remove(provider.id)} disabled={pending} className="h-10 px-3 rounded-md border border-red-500/30 text-red-600 dark:text-red-400 text-sm inline-flex items-center justify-center gap-2">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Clear</button> : <button onClick={() => save(provider.id)} disabled={pending || !values[provider.id].trim()} className="h-10 px-4 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-black text-sm disabled:opacity-40">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}</button>}
                  </div>;
                })}
              </div>
            </section>

            <div className="mt-6 rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 text-sm text-neutral-500 dark:text-neutral-400"><strong className="text-neutral-800 dark:text-neutral-200">Lưu ý:</strong> Đây là provider API key (OpenAI, Anthropic, Gemini, Cursor hoặc AI Gateway), không phải Velclaw personal access token. API hiện tại xác thực bằng session và chỉ trả metadata provider/ngày tạo, không trả secret plaintext.</div>
          </div>
        </main>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { ArrowRight, Terminal, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import CodeBlock from '../components/CodeBlock';

export default function DeployCLI() {
  const [dark, setDark] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 transition-colors">
      <Header
        dark={dark}
        onToggleTheme={() => setDark((value) => !value)}
        onOpenSearch={() => undefined}
        onOpenMobileNav={() => setMobileNavOpen(true)}
      />

      <div className="max-w-[1400px] mx-auto flex">
        <aside className="hidden lg:block w-64 shrink-0 border-r border-neutral-200 dark:border-neutral-800 h-[calc(100vh-56px)] sticky top-14 overflow-y-auto py-8 pr-4">
          <Sidebar activeId="deploy-cli" />
        </aside>

        {mobileNavOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/60" onClick={() => setMobileNavOpen(false)} />
            <div className="relative w-72 h-full bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 p-6 overflow-y-auto vc-fade">
              <button onClick={() => setMobileNavOpen(false)} className="mb-6 h-8 w-8 flex items-center justify-center rounded-md border border-neutral-200 dark:border-neutral-800" aria-label="Đóng menu">
                <X className="h-4 w-4" />
              </button>
              <Sidebar activeId="deploy-cli" onNavigate={() => setMobileNavOpen(false)} />
            </div>
          </div>
        )}

        <main className="flex-1 min-w-0 px-6 md:px-10 py-10 max-w-3xl">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-4">
            <span>Tài liệu</span><ArrowRight className="h-3 w-3" /><span>Bắt đầu</span><ArrowRight className="h-3 w-3" /><span className="text-neutral-700 dark:text-neutral-300">Deploy CLI</span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Terminal className="h-4 w-4 text-brand-500" />
            <span className="font-mono text-xs text-brand-500">VELCLAW DEPLOY</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Deploy CLI</h1>
          <p className="text-lg text-neutral-500 leading-relaxed mb-10">CLI chính thức trong repository hiện tại dùng để queue deployment, xem deployment, inspect trạng thái và rollback release.</p>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3">Cài đặt</h2>
            <p className="text-neutral-500 leading-7 mb-4">Package của Velclaw khai báo binary <code className="font-mono text-sm">velclaw-deploy</code>. Sau khi package được cài đặt, CLI đọc API base và token từ environment.</p>
            <CodeBlock code={'npm install -g velclaw\nvelclaw-deploy'} />
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3">Các lệnh</h2>
            <div className="space-y-3">
              {[
                ['deploy <github-url> [branch]', 'Queue một deployment từ GitHub URL; branch mặc định là main.'],
                ['list', 'Liệt kê các deployment gần đây.'],
                ['inspect <id>', 'Đọc trạng thái và thông tin của một deployment.'],
                ['rollback <id>', 'Yêu cầu rollback deployment về release ready trước đó.'],
              ].map(([command, description]) => (
                <div key={command} className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
                  <code className="font-mono text-sm text-brand-500">velclaw-deploy {command}</code>
                  <p className="text-sm text-neutral-500 leading-6 mt-2">{description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3">Ví dụ</h2>
            <CodeBlock code={'export VELCLAW_DEPLOY_API="https://velclaw.cfd"\nexport VELCLAW_DEPLOY_API_TOKEN="<token>"\n\nvelclaw-deploy deploy https://github.com/Velclaw/Velclaw.git main\nvelclaw-deploy list\nvelclaw-deploy inspect <deployment-id>'} />
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3">Environment</h2>
            <ul className="space-y-2 text-sm text-neutral-500">
              <li><code className="font-mono">VELCLAW_DEPLOY_API</code> — API base; CLI hiện đặt mặc định là <code className="font-mono">https://velclaw.cfd</code>.</li>
              <li><code className="font-mono">VELCLAW_DEPLOY_API_TOKEN</code> — bearer token dùng cho các thao tác API.</li>
            </ul>
          </section>

          <aside className="rounded-lg border-l-4 border-l-brand-500 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-5 py-4 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <strong className="text-neutral-800 dark:text-neutral-200">Lưu ý production:</strong> domain <code className="font-mono">velclaw.cfd</code> hiện không nên được coi là endpoint khả dụng nếu hạ tầng/domain đang bị khóa. Có thể đặt <code className="font-mono">VELCLAW_DEPLOY_API</code> sang endpoint deployment đang hoạt động.
          </aside>
        </main>
      </div>
    </div>
  );
}

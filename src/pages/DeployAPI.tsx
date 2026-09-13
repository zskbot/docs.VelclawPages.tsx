import { useEffect, useState } from 'react';
import { ArrowRight, Braces, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import CodeBlock from '../components/CodeBlock';

const endpoints = [
  {
    method: 'POST',
    path: '/api/deployments',
    title: 'Queue deployment',
    description: 'Tạo một deployment job từ GitHub repository. Branch mặc định là main nếu không truyền branch.',
    request: `curl -X POST "$VELCLAW_DEPLOY_API/api/deployments" \\
  -H "authorization: Bearer $VELCLAW_DEPLOY_API_TOKEN" \\
  -H "content-type: application/json" \\
  -d '{"repoUrl":"https://github.com/Velclaw/Velclaw.git","branch":"main","projectName":"Velclaw"}'`,
  body: `{
  "repoUrl": "https://github.com/Velclaw/Velclaw.git",
  "branch": "main",
  "projectName": "Velclaw"
}`,
  },
  {
    method: 'GET',
    path: '/api/deployments',
    title: 'List deployments',
    description: 'Đọc lịch sử deployment qua control plane.',
    request: `curl "$VELCLAW_DEPLOY_API/api/deployments" \\
  -H "authorization: Bearer $VELCLAW_DEPLOY_API_TOKEN"`,
  },
  {
    method: 'GET',
    path: '/api/deployments/:id',
    title: 'Inspect deployment',
    description: 'Đọc chi tiết một deployment theo ID, phù hợp để theo dõi trạng thái và logs.',
    request: `curl "$VELCLAW_DEPLOY_API/api/deployments/$DEPLOYMENT_ID" \\
  -H "authorization: Bearer $VELCLAW_DEPLOY_API_TOKEN"`,
  },
  {
    method: 'POST',
    path: '/api/deployments/:id/rollback',
    title: 'Rollback deployment',
    description: 'Yêu cầu rollback về release ready trước đó. Đây là thao tác quản trị và cần token có quyền phù hợp.',
    request: `curl -X POST "$VELCLAW_DEPLOY_API/api/deployments/$DEPLOYMENT_ID/rollback" \\
  -H "authorization: Bearer $VELCLAW_DEPLOY_API_TOKEN"`,
  },
];

export default function DeployAPI() {
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
          <Sidebar activeId="deploy-api" />
        </aside>

        {mobileNavOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/60" onClick={() => setMobileNavOpen(false)} />
            <div className="relative w-72 h-full bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 p-6 overflow-y-auto vc-fade">
              <button onClick={() => setMobileNavOpen(false)} className="mb-6 h-8 w-8 flex items-center justify-center rounded-md border border-neutral-200 dark:border-neutral-800" aria-label="Đóng menu">
                <X className="h-4 w-4" />
              </button>
              <Sidebar activeId="deploy-api" onNavigate={() => setMobileNavOpen(false)} />
            </div>
          </div>
        )}

        <main className="flex-1 min-w-0 px-6 md:px-10 py-10 max-w-3xl">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-4">
            <span>Tài liệu</span><ArrowRight className="h-3 w-3" /><span>Tích hợp</span><ArrowRight className="h-3 w-3" /><span className="text-neutral-700 dark:text-neutral-300">Deploy API</span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Braces className="h-4 w-4 text-brand-500" />
            <span className="font-mono text-xs text-brand-500">DEPLOY API</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Deploy API</h1>
          <p className="text-lg text-neutral-500 leading-relaxed mb-10">HTTP API cho deployment control plane của Velclaw. CLI sử dụng chính các endpoint này và gửi Bearer token trong request.</p>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3">Base URL và authentication</h2>
            <p className="text-neutral-500 leading-7 mb-4">Đặt API base qua <code className="font-mono text-sm">VELCLAW_DEPLOY_API</code>. CLI hiện mặc định dùng <code className="font-mono text-sm">https://velclaw.cfd</code>; không nên coi domain này là endpoint khả dụng khi hạ tầng/domain đang bị khóa.</p>
            <CodeBlock code={'export VELCLAW_DEPLOY_API="https://your-deploy-host.example"\nexport VELCLAW_DEPLOY_API_TOKEN="<token>"'} />
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-5">Endpoints</h2>
            <div className="space-y-8">
              {endpoints.map((endpoint) => (
                <article key={`${endpoint.method}-${endpoint.path}`} className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                  <div className="p-5 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-mono text-xs font-bold text-brand-500">{endpoint.method}</span>
                      <code className="font-mono text-sm">{endpoint.path}</code>
                    </div>
                    <h3 className="font-semibold mb-2">{endpoint.title}</h3>
                    <p className="text-sm text-neutral-500 leading-6">{endpoint.description}</p>
                  </div>
                  <div className="p-5">
                    <CodeBlock code={endpoint.request} />
                    {endpoint.body && <div className="mt-4"><p className="text-xs font-medium text-neutral-500 mb-2">Request body</p><CodeBlock code={endpoint.body} /></div>}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3">Queue và worker</h2>
            <p className="text-neutral-500 leading-7">API chỉ tạo và quản lý deployment job. Worker đọc queue PostgreSQL, checkout branch, chạy production build, ghi status/logs và dọn source tạm. Build thành công không tự động có nghĩa runtime public đã sẵn sàng; runtime publication là một boundary riêng.</p>
          </section>

          <aside className="rounded-lg border-l-4 border-l-brand-500 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-5 py-4 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <strong className="text-neutral-800 dark:text-neutral-200">Security:</strong> repository URL phải là GitHub HTTPS, token không được commit hoặc ghi vào build logs. Worker được thiết kế chạy non-root và có resource/security limits.
          </aside>
        </main>
      </div>
    </div>
  );
}

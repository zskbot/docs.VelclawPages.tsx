import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { ChevronRight, X } from 'lucide-react';

type Block = { id: string; title: string; text: string[]; bullets?: string[]; code?: string };
type Page = { title: string; description: string; blocks: Block[] };

const pages: Record<string, Page> = {
  workspace: { title: 'Không gian làm việc', description: 'Workspace là lớp context trung tâm của Velclaw: project, repository, files, state và execution context được giữ cùng một workflow.', blocks: [
    { id: 'model', title: 'Mô hình workspace', text: ['Một tác vụ cần xác định project, repository, branch hoặc worktree, trạng thái hiện tại và tiêu chí hoàn tất. Agent không nên hoạt động trên context mơ hồ.'], bullets: ['Project/repository là nguồn code.', 'Files và diff là phạm vi thay đổi.', 'Build/test result là tín hiệu validation.', 'Task context xác định mục tiêu và acceptance criteria.'] },
    { id: 'worktree', title: 'Worktree và cô lập', text: ['Thay đổi nên được thực hiện trong vùng làm việc có boundary rõ ràng để tránh tác vụ này ghi đè hoặc làm bẩn trạng thái của tác vụ khác.'] },
    { id: 'state', title: 'State và delivery', text: ['Trước delivery, kiểm tra diff và validation result. Chỉ chuyển thay đổi sang GitHub khi trạng thái đã đủ rõ để review.'], bullets: ['Inspect diff.', 'Chạy type-check/build/test phù hợp.', 'Giữ commit hoặc PR có phạm vi nhỏ.', 'Giữ đường lui bằng lịch sử Git hoặc rollback deployment.'] },
    { id: 'safe', title: 'Boundary an toàn', text: ['Credential không thuộc source tree. Context của agent nên tối thiểu theo tác vụ và không cấp quyền rộng hơn nhu cầu.'] },
  ] },
  agents: { title: 'Agents', description: 'Agent trong Velclaw được gắn với task, context, skill và execution boundary thay vì chỉ sinh code độc lập.', blocks: [
    { id: 'task', title: 'Task → plan → execution', text: ['Một task tốt có mục tiêu và acceptance criteria có thể kiểm chứng. Skill planning của Velclaw được khai báo với executorBinding và sandbox riêng.'] },
    { id: 'context', title: 'Context', text: ['Agent cần repository metadata, task context và các file liên quan. Context phải đủ để ra quyết định nhưng không nên mở rộng vô hạn.'] },
    { id: 'loop', title: 'Execution loop', text: ['Luồng chuẩn: inspect → change → validate → đọc failure → sửa → validate lại. CI result là evidence để chọn bước tiếp theo.'], code: `inspect\n  ↓\nchange\n  ↓\nvalidate\n  ↓\nfailed? ── yes → diagnose → fix → validate\n  │\n  no\n  ↓\ndelivery` },
    { id: 'review', title: 'Review và completion', text: ['Task chỉ hoàn tất khi output đạt acceptance criteria và validation bắt buộc đã qua. Review tập trung correctness, regression, security và scope.'] },
  ] },
  'build-runtime': { title: 'Build & Runtime', description: 'Build tạo artifact có thể tái lập; runtime xuất bản workload và theo dõi trạng thái để deployment được kiểm chứng.', blocks: [
    { id: 'build', title: 'Build reproducible', text: ['Repository Velclaw dùng lockfile và có script build/type-check riêng. Install reproducible giúp CI cho kết quả ổn định.'], code: `npm ci\nnpm run type-check\nnpm run build` },
    { id: 'validation', title: 'Validation', text: ['Validation không chỉ là build. Test, API test, E2E hoặc runtime validation phải chạy khi thuộc acceptance criteria. Khi CI fail, đọc đúng job/step và log trước khi sửa.'] },
    { id: 'runtime', title: 'Runtime publisher', text: ['Runtime publisher lấy source, tạo Docker image, chạy container với giới hạn resource/security, kết nối Traefik và chỉ báo ready sau khi runtime được publish.'] },
    { id: 'rollback', title: 'Rollback', text: ['Deployment không đạt tiêu chí phải có đường lui. Rollback đưa workload về phiên bản đã được xác nhận thay vì tiếp tục phát hành artifact chưa ổn định.'] },
  ] },
  'github-delivery': { title: 'GitHub Delivery', description: 'GitHub Delivery nối workspace với branch, pull request, CI và deployment; mỗi bước phải để lại tín hiệu kiểm chứng.', blocks: [
    { id: 'branch', title: 'Branch', text: ['Tách thay đổi khỏi branch chính giúp main ổn định và cho phép CI kiểm tra đúng snapshot của tác vụ.'] },
    { id: 'pr', title: 'Pull request', text: ['PR là boundary review. Mô tả nên nêu mục tiêu, phạm vi, risk và validation. Tạo PR không phải bằng chứng code đã đúng.'] },
    { id: 'ci', title: 'CI checks', text: ['CI kiểm tra dependency installation, type-check, tests và build theo yêu cầu repository. Failure location phải được giữ để agent chẩn đoán.'], bullets: ['Không bỏ qua failed step để “cho pass”.', 'Sửa nguyên nhân thay vì chỉ retry.', 'Retry sau khi thay đổi đã được kiểm tra.'] },
    { id: 'delivery', title: 'Delivery', text: ['Sau merge, deployment sử dụng phiên bản đã được kiểm tra. Nếu deployment fail, inspect deployment/logs, sửa nguyên nhân và publish lại sau validation.'] },
  ] },
  security: { title: 'Bảo mật', description: 'Security của Velclaw tập trung vào OAuth credential handling, secret isolation, least privilege và execution isolation.', blocks: [
    { id: 'oauth', title: 'GitHub OAuth', text: ['Code hiện có flow GitHub OAuth với authorization và callback routes. Client ID có thể public; client secret phải ở server-side environment. Callback kiểm tra cấu hình OAuth trước khi xử lý.'] },
    { id: 'token', title: 'Token và session', text: ['GitHub access token được mã hóa trước khi lưu trong session data. Token là credential: không đưa vào source, response debug hoặc log.'] },
    { id: 'secrets', title: 'Secrets', text: ['Các biến nhạy cảm được giữ ở server environment. Runtime configuration của repository xác định POSTGRES_URL, JWE_SECRET, ENCRYPTION_KEY và GitHub OAuth secret là cấu hình server-side.'] },
    { id: 'permissions', title: 'Least privilege', text: ['Skill registry khai báo permissions theo từng skill. Ví dụ task planning chỉ yêu cầu read-task-context và read-repository-metadata; không mặc định cấp write hoặc credential access.'] },
    { id: 'isolation', title: 'Execution isolation', text: ['Các skill available được kiểm tra phải có execution boundary và sandbox isolated. Đây là guardrail kiến trúc, không phải cam kết mọi agent có toàn quyền hệ thống.'] },
  ] },
};

const defaultPage: Page = { title: 'Tổng quan', description: 'Velclaw là AI-native software workspace cho agents, developers và teams.', blocks: [
  { id: 'overview', title: 'Luồng tổng thể', text: ['Task → Agent → Workspace → Code → Validation → GitHub → Review → Deployment. Mỗi boundary có trạng thái và tín hiệu riêng để kiểm chứng.'] },
  { id: 'principles', title: 'Nguyên tắc', text: ['Ưu tiên implementation thật của repository, reproducible builds, least privilege, execution isolation và rollback có kiểm chứng.'] },
] };

export default function DocSection({ id }: { id: string }) {
  const [dark, setDark] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [active, setActive] = useState('');
  const page = pages[id] ?? defaultPage;

  useEffect(() => { document.documentElement.classList.toggle('dark', dark); }, [dark]);
  useEffect(() => { setActive(page.blocks[0]?.id ?? ''); window.scrollTo({ top: 0, behavior: 'instant' }); }, [id]);
  useEffect(() => {
    const onScroll = () => { let current = page.blocks[0]?.id ?? ''; for (const block of page.blocks) { const el = document.getElementById(block.id); if (el && el.getBoundingClientRect().top < 170) current = block.id; } setActive(current); };
    window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll);
  }, [id]);

  return <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 transition-colors">
    <Header dark={dark} onToggleTheme={() => setDark(v => !v)} onOpenSearch={() => {}} onOpenMobileNav={() => setMobileNavOpen(true)} />
    <div className="max-w-[1400px] mx-auto flex">
      <aside className="hidden lg:block w-64 shrink-0 border-r border-neutral-200 dark:border-neutral-800 h-[calc(100vh-56px)] sticky top-14 overflow-y-auto py-8 pr-4"><Sidebar activeId={id} /></aside>
      {mobileNavOpen && <div className="lg:hidden fixed inset-0 z-50"><div className="absolute inset-0 bg-black/60" onClick={() => setMobileNavOpen(false)} /><div className="relative w-72 h-full bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 p-6 overflow-y-auto"><button onClick={() => setMobileNavOpen(false)} className="mb-6 h-8 w-8 flex items-center justify-center rounded-md border border-neutral-200 dark:border-neutral-800" aria-label="Đóng menu"><X className="h-4 w-4" /></button><Sidebar activeId={id} onNavigate={() => setMobileNavOpen(false)} /></div></div>}
      <main className="flex-1 min-w-0 px-6 md:px-10 py-10 max-w-5xl">
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-4"><span>Tài liệu</span><ChevronRight className="h-3 w-3" /><span>{page.title}</span></div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{page.title}</h1>
        <p className="text-lg text-neutral-500 leading-relaxed mb-10">{page.description}</p>
        <div className="grid lg:grid-cols-[minmax(0,1fr)_190px] gap-10">
          <div className="space-y-12">{page.blocks.map(block => <section id={block.id} key={block.id} className="scroll-mt-24"><h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-3">{block.title}</h2>{block.text.map(t => <p key={t} className="text-neutral-500 leading-7 mb-3">{t}</p>)}{block.bullets && <ul className="list-disc pl-5 space-y-2 text-neutral-500 leading-7">{block.bullets.map(b => <li key={b}>{b}</li>)}</ul>}{block.code && <pre className="mt-5 overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-5 text-sm leading-6"><code>{block.code}</code></pre>}</section>)}</div>
          <aside className="hidden lg:block sticky top-24 self-start border-l border-neutral-200 dark:border-neutral-800 pl-4"><div className="text-xs font-medium mb-3">Trên trang</div><div className="space-y-2">{page.blocks.map(block => <a key={block.id} href={`#${block.id}`} className={`block text-xs leading-5 ${active === block.id ? 'text-neutral-900 dark:text-white font-medium' : 'text-neutral-500'}`}>{block.title}</a>)}</div></aside>
        </div>
      </main>
    </div>
  </div>;
}

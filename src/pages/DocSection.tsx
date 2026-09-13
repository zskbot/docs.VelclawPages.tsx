import { useEffect, useMemo, useState } from 'react';
import nav from '../../content/nav.json';
import { NavConfig } from '../lib/types';
import Sidebar from '../components/Sidebar';
import Toc from '../components/Toc';
import SearchModal from '../components/SearchModal';
import Header from '../components/Header';
import CodeBlock from '../components/CodeBlock';
import { ChevronRight, X } from 'lucide-react';

const navConfig = nav as NavConfig;

type Section = {
  title: string;
  description: string;
  toc: { id: string; label: string }[];
};

const sections: Record<string, Section> = {
  index: {
    title: 'Tổng quan',
    description: 'Velclaw là AI-native software workspace cho agents, developers và teams, tập trung toàn bộ vòng đời phần mềm trong một workspace.',
    toc: [
      { id: 'velclaw-la-gi', label: 'Velclaw là gì?' },
      { id: 'kien-truc', label: 'Kiến trúc' },
      { id: 'nang-luc', label: 'Năng lực' },
      { id: 'quy-trinh', label: 'Quy trình' },
    ],
  },
  workspace: {
    title: 'Không gian làm việc',
    description: 'Workspace là lớp trung tâm kết nối project, code, context, state và các phiên thực thi của agent.',
    toc: [
      { id: 'mo-hinh', label: 'Mô hình workspace' },
      { id: 'worktree', label: 'Worktree cô lập' },
      { id: 'trang-thai', label: 'State và thay đổi' },
      { id: 'thuc-hanh', label: 'Thực hành an toàn' },
    ],
  },
  agents: {
    title: 'Agents',
    description: 'Agents thực hiện tác vụ phát triển phần mềm trong context của project và workspace, thay vì chỉ sinh đoạn mã rời rạc.',
    toc: [
      { id: 'nhiem-vu', label: 'Nhiệm vụ' },
      { id: 'context', label: 'Context' },
      { id: 'execution', label: 'Execution' },
      { id: 'review', label: 'Review' },
    ],
  },
  'build-runtime': {
    title: 'Build & Runtime',
    description: 'Build và runtime biến source code đã được kiểm tra thành artifact có thể chạy, đồng thời cung cấp trạng thái và logs để xử lý lỗi.',
    toc: [
      { id: 'build', label: 'Build' },
      { id: 'validation', label: 'Validation' },
      { id: 'runtime', label: 'Runtime' },
      { id: 'rollback', label: 'Rollback' },
    ],
  },
  'github-delivery': {
    title: 'GitHub Delivery',
    description: 'Đưa thay đổi đã được kiểm tra từ workspace lên GitHub theo quy trình branch, pull request, CI và merge.',
    toc: [
      { id: 'branch', label: 'Branch' },
      { id: 'pull-request', label: 'Pull request' },
      { id: 'ci', label: 'CI checks' },
      { id: 'delivery', label: 'Delivery' },
    ],
  },
  security: {
    title: 'Bảo mật',
    description: 'Bảo mật của Velclaw tập trung vào OAuth, secrets, quyền truy cập repository và cô lập quá trình thực thi.',
    toc: [
      { id: 'oauth', label: 'OAuth' },
      { id: 'secrets', label: 'Secrets' },
      { id: 'permissions', label: 'Quyền truy cập' },
      { id: 'isolation', label: 'Isolation' },
    ],
  },
};

const sectionBodies: Record<string, { heading: string; paragraphs: string[]; bullets?: string[]; code?: string }[]> = {
  index: [
    { heading: 'Velclaw là gì?', paragraphs: ['Velclaw tập trung agents, projects, files, builds, runtime, storage, GitHub, review và deployment trong một developer-focused workspace.', 'Mục tiêu là giữ context của tác vụ xuyên suốt quá trình từ yêu cầu đến code, validation, review và delivery.'], bullets: ['AI Agents: agent-driven development và tool execution.', 'Workspace: project, files, code, persistent context và state.', 'Build & Runtime: build, validate, execute và quan sát workload.', 'GitHub Delivery: branch, pull request, CI và delivery.'] },
    { heading: 'Kiến trúc', paragraphs: ['Workspace là lớp trung tâm. Agents tương tác với workspace; workspace kết nối project và code với build/runtime, storage, GitHub và deployment.'], code: `AI Agents\n     │\n     ▼\nVELCLAW WORKSPACE\n ├── Projects & Files\n ├── Build & Runtime\n ├── Storage\n ├── GitHub / Review\n └── Deployment` },
    { heading: 'Năng lực', paragraphs: ['Các lớp của Velclaw được thiết kế để có thể kiểm tra từng bước thay vì coi deployment là một thao tác độc lập.'] },
    { heading: 'Quy trình', paragraphs: ['Một workflow điển hình: Issue / Task → Agent + Developer → Workspace → Code → Build → Typecheck → GitHub branch → Pull Request → Review → Merge → Deployment.'] },
  ],
  workspace: [
    { heading: 'Mô hình workspace', paragraphs: ['Mỗi tác vụ cần một context rõ ràng: project, repository, branch hoặc worktree, trạng thái hiện tại và các thay đổi chưa được delivery.'] },
    { heading: 'Worktree cô lập', paragraphs: ['Agent nên thực hiện thay đổi trong vùng làm việc cô lập để hạn chế việc một tác vụ làm ảnh hưởng trực tiếp đến tác vụ khác hoặc branch chính.'] },
    { heading: 'State và thay đổi', paragraphs: ['Theo dõi diff, build result và trạng thái thực thi trước khi đưa thay đổi sang GitHub. Đây là điểm kiểm soát quan trọng của workflow.'], bullets: ['Xác định thay đổi nhỏ nhất cần thiết.', 'Chạy validation sau khi chỉnh sửa.', 'Giữ lịch sử thay đổi có thể review và rollback.'] },
    { heading: 'Thực hành an toàn', paragraphs: ['Không đưa credential hoặc secret vào source. Khi tác vụ có phạm vi repository rõ ràng, chỉ cấp context và quyền cần thiết cho tác vụ đó.'] },
  ],
  agents: [
    { heading: 'Nhiệm vụ', paragraphs: ['Agent nhận mục tiêu cụ thể, ví dụ sửa lỗi build, thêm feature hoặc review một thay đổi. Tác vụ nên có tiêu chí hoàn tất có thể kiểm chứng.'] },
    { heading: 'Context', paragraphs: ['Context nên bao gồm repository, relevant files, trạng thái build/test và các ràng buộc của project. Context đầy đủ giúp agent tránh sửa sai lớp.'] },
    { heading: 'Execution', paragraphs: ['Agent chỉnh code, chạy các bước validation và lặp lại khi có lỗi. Với workflow tự động, kết quả CI là tín hiệu để xác định bước tiếp theo thay vì đoán nguyên nhân.'] },
    { heading: 'Review', paragraphs: ['Thay đổi cần được kiểm tra trước delivery. Review tập trung vào correctness, regression, security và phạm vi thay đổi.'] },
  ],
  'build-runtime': [
    { heading: 'Build', paragraphs: ['Build phải tái lập được từ source và dependency lockfile. Với ứng dụng Node.js, quy trình nên dùng install reproducible và một lệnh build rõ ràng.'], code: `npm ci\nnpm run type-check\nnpm run build` },
    { heading: 'Validation', paragraphs: ['Validation tối thiểu gồm type-check và build; test phù hợp với project nên chạy trước khi delivery. Nếu CI thất bại, đọc đúng job và step thất bại trước khi sửa.'] },
    { heading: 'Runtime', paragraphs: ['Runtime chịu trách nhiệm khởi chạy workload, giữ trạng thái tiến trình và cung cấp logs đủ để xác định failure location.'] },
    { heading: 'Rollback', paragraphs: ['Khi artifact hoặc deployment mới không đạt tiêu chí, rollback về phiên bản cuối cùng đã được xác nhận là cách giảm blast radius.'] },
  ],
  'github-delivery': [
    { heading: 'Branch', paragraphs: ['Thay đổi nên đi qua branch riêng. Giữ branch chính ổn định giúp CI và deployment phản ánh trạng thái đã review.'] },
    { heading: 'Pull request', paragraphs: ['Pull request là điểm giao giữa implementation và review. Mô tả PR nên nêu mục tiêu, phạm vi thay đổi và validation đã chạy.'] },
    { heading: 'CI checks', paragraphs: ['CI phải xác nhận các điều kiện cần trước merge: install dependency, type-check, test và build hoặc các kiểm tra đặc thù của repository.'] },
    { heading: 'Delivery', paragraphs: ['Sau khi merge, deployment lấy phiên bản đã được kiểm tra. Nếu delivery thất bại, giữ nguyên failure signal để chẩn đoán và retry sau khi sửa.'] },
  ],
  security: [
    { heading: 'OAuth', paragraphs: ['Kết nối Git provider nên dùng OAuth thay vì lưu mật khẩu người dùng. Token cần được xử lý như credential và không xuất hiện trong logs hoặc source.'] },
    { heading: 'Secrets', paragraphs: ['API keys, OAuth secrets, database URLs và deployment tokens phải nằm trong secret store hoặc environment configuration phù hợp, không commit vào repository.'] },
    { heading: 'Quyền truy cập', paragraphs: ['Áp dụng least privilege: repository và action chỉ được cấp quyền cần thiết cho tác vụ. Không mặc định cấp quyền ghi hoặc quyền tổ chức rộng.'] },
    { heading: 'Isolation', paragraphs: ['Agent execution và build/runtime nên có boundary rõ ràng. Worktree, process và secret scope cần được tách để giảm tác động khi một tác vụ lỗi hoặc bị khai thác.'] },
  ],
};

export default function DocSection({ id }: { id: string }) {
  const [dark, setDark] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const data = sections[id] ?? sections.index;
  const body = sectionBodies[id] ?? sectionBodies.index;

  const toc = useMemo(() => data.toc, [data.toc]);
  const [activeToc, setActiveToc] = useState(toc[0]?.id ?? '');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  useEffect(() => {
    setActiveToc(toc[0]?.id ?? '');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id, toc]);

  useEffect(() => {
    const onScroll = () => {
      let current = toc[0]?.id ?? '';
      for (const item of toc) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top < 150) current = item.id;
      }
      setActiveToc(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [toc]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen((value) => !value);
      }
      if (event.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 transition-colors">
      <Header dark={dark} onToggleTheme={() => setDark((value) => !value)} onOpenSearch={() => setSearchOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

      <div className="max-w-[1400px] mx-auto flex">
        <aside className="hidden lg:block w-64 shrink-0 border-r border-neutral-200 dark:border-neutral-800 h-[calc(100vh-56px)] sticky top-14 overflow-y-auto py-8 pr-4">
          <Sidebar activeId={id} />
        </aside>

        {mobileNavOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/60" onClick={() => setMobileNavOpen(false)} />
            <div className="relative w-72 h-full bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 p-6 overflow-y-auto vc-fade">
              <button onClick={() => setMobileNavOpen(false)} className="mb-6 h-8 w-8 flex items-center justify-center rounded-md border border-neutral-200 dark:border-neutral-800" aria-label="Đóng menu">
                <X className="h-4 w-4" />
              </button>
              <Sidebar activeId={id} onNavigate={() => setMobileNavOpen(false)} />
            </div>
          </div>
        )}

        <main className="flex-1 min-w-0 px-6 md:px-10 py-10 max-w-3xl">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-4">
            <span>Tài liệu</span><ChevronRight className="h-3 w-3" /><span className="text-neutral-700 dark:text-neutral-300">{data.title}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{data.title}</h1>
          <p className="text-lg text-neutral-500 leading-relaxed mb-10">{data.description}</p>

          <div className="space-y-12">
            {body.map((item, index) => {
              const anchor = toc[index]?.id ?? `section-${index}`;
              return (
                <section id={anchor} key={item.heading} className="scroll-mt-24">
                  <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-3">{item.heading}</h2>
                  {item.paragraphs.map((paragraph) => <p key={paragraph} className="text-neutral-500 leading-7 mb-3">{paragraph}</p>)}
                  {item.bullets && <ul className="space-y-2 text-sm text-neutral-500 mt-4">{item.bullets.map((bullet) => <li key={bullet} className="flex gap-2"><span>•</span><span>{bullet}</span></li>)}</ul>}
                  {item.code && <CodeBlock code={item.code} />}
                </section>
              );
            })}
          </div>

          <div className="mt-16 pt-6 border-t border-neutral-200 dark:border-neutral-800 text-sm text-neutral-500">
            <p>Velclaw docs được xây dựng từ cấu trúc và workflow của repository Velclaw. Nội dung triển khai thực tế cần tiếp tục đồng bộ với code và CI hiện hành.</p>
          </div>
        </main>

        <aside className="hidden xl:block w-56 shrink-0 py-10 pl-6">
          <Toc items={toc} activeId={activeToc} onSelect={(anchor) => document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' })} />
        </aside>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}

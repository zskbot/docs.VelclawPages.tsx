import { useEffect } from 'react';

const sections: Record<string, { title: string; description: string; bullets: string[] }> = {
  index: {
    title: 'Tổng quan',
    description: 'Tổng quan về Velclaw và cách các thành phần kết nối với nhau.',
    bullets: ['CLI và xác thực Git provider', 'Kết nối kho mã nguồn', 'Agents, Build & Runtime và GitHub Delivery'],
  },
  workspace: {
    title: 'Không gian làm việc',
    description: 'Quản lý workspace, worktree và các phiên làm việc của agent.',
    bullets: ['Workspace cô lập cho từng tác vụ', 'Theo dõi thay đổi và trạng thái thực thi', 'Làm việc an toàn trên nhánh riêng'],
  },
  agents: {
    title: 'Agents',
    description: 'Tạo và chạy agent để thực hiện tác vụ trên kho mã nguồn.',
    bullets: ['Mô tả nhiệm vụ bằng ngôn ngữ tự nhiên', 'Agent làm việc trong worktree cô lập', 'Review thay đổi trước khi mở pull request'],
  },
  'build-runtime': {
    title: 'Build & Runtime',
    description: 'Build, chạy và quan sát ứng dụng trong môi trường Velclaw.',
    bullets: ['Build reproducible', 'Runtime logs và trạng thái tiến trình', 'Xử lý lỗi và rollback'],
  },
  'github-delivery': {
    title: 'GitHub Delivery',
    description: 'Đưa thay đổi từ workspace lên GitHub theo quy trình kiểm soát.',
    bullets: ['Pull request tự động', 'CI checks trước khi merge', 'Theo dõi kết quả delivery'],
  },
  security: {
    title: 'Bảo mật',
    description: 'Các nguyên tắc bảo mật khi kết nối Git provider và chạy agent.',
    bullets: ['OAuth thay vì lưu mật khẩu', 'Secrets không đưa vào source code', 'Giới hạn quyền theo repository và tác vụ'],
  },
};

export default function DocSection({ id }: { id: string }) {
  const data = sections[id] ?? sections.index;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  return (
    <main className="flex-1 min-w-0 px-6 md:px-10 py-10 max-w-3xl">
      <div className="flex items-center gap-2 text-xs text-neutral-500 mb-4">
        <span>Tài liệu</span><span>/</span><span className="text-neutral-700 dark:text-neutral-300">{data.title}</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{data.title}</h1>
      <p className="text-lg text-neutral-500 leading-relaxed mb-8">{data.description}</p>
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-5">
        <h2 className="font-semibold mb-4">Nội dung chính</h2>
        <ul className="space-y-3 text-sm text-neutral-500">
          {data.bullets.map((bullet) => <li key={bullet} className="flex gap-2"><span>•</span><span>{bullet}</span></li>)}
        </ul>
      </div>
    </main>
  );
}

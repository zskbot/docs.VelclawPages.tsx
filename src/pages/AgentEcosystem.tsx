import { useEffect, useState } from 'react';
import { ArrowRight, Bot, Boxes, Terminal, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import CodeBlock from '../components/CodeBlock';

const agents = ['claude', 'codex', 'copilot', 'cursor', 'gemini', 'opencode', 'ollama'];

const skills = [
  ['velclaw-task-planning', 'Task decomposition, acceptance criteria và execution plan.'],
  ['velclaw-code-change', 'Code editing, branch workflow và validation trong workspace cô lập.'],
  ['velclaw-pr-review', 'Diff review, findings và input cho Gate.'],
  ['velclaw-github-delivery', 'Branch, commit, checks và pull-request delivery.'],
  ['velclaw-mcp-operation', 'MCP tools/resources và agent context.'],
  ['velclaw-deployment', 'Release preparation, Docker build, runtime và deployment evidence.'],
];

const integrations = [
  ['GitHub Cloud', 'source-control', 'OAuth, repositories, branches, pull-requests, checks'],
  ['MCP runtime', 'skills', 'tools, resources, prompts, agent-context'],
  ['Gito AI review', 'reviewer', 'review, findings, Gate input'],
  ['Ollama local agent', 'agent', 'local models, agent execution'],
  ['Velclaw Skills', 'skills', 'skill discovery, metadata, executor binding, sandbox boundary'],
  ['curl network executor', 'network', 'HTTP/HTTPS sandboxed execution'],
];

export default function AgentEcosystem() {
  const [dark, setDark] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 transition-colors">
      <Header dark={dark} onToggleTheme={() => setDark((value) => !value)} onOpenSearch={() => undefined} onOpenMobileNav={() => setMobileNavOpen(true)} />
      <div className="max-w-[1400px] mx-auto flex">
        <aside className="hidden lg:block w-64 shrink-0 border-r border-neutral-200 dark:border-neutral-800 h-[calc(100vh-56px)] sticky top-14 overflow-y-auto py-8 pr-4">
          <Sidebar activeId="agent-ecosystem" />
        </aside>

        {mobileNavOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/60" onClick={() => setMobileNavOpen(false)} />
            <div className="relative w-72 h-full bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 p-6 overflow-y-auto vc-fade">
              <button onClick={() => setMobileNavOpen(false)} className="mb-6 h-8 w-8 flex items-center justify-center rounded-md border border-neutral-200 dark:border-neutral-800" aria-label="Đóng menu">
                <X className="h-4 w-4" />
              </button>
              <Sidebar activeId="agent-ecosystem" onNavigate={() => setMobileNavOpen(false)} />
            </div>
          </div>
        )}

        <main className="flex-1 min-w-0 px-6 md:px-10 py-10 max-w-4xl">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-4">
            <span>Tài liệu</span><ArrowRight className="h-3 w-3" /><span>Nền tảng</span><ArrowRight className="h-3 w-3" /><span className="text-neutral-700 dark:text-neutral-300">Agent Ecosystem</span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Bot className="h-4 w-4 text-brand-500" />
            <span className="font-mono text-xs text-brand-500">AGENTS + SKILLS</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Agent Ecosystem</h1>
          <p className="text-lg text-neutral-500 leading-relaxed mb-10">Kiến trúc agent và skill hiện tại của Velclaw, dựa trên registry thật trong repository thay vì mô tả một runtime chưa tồn tại.</p>

          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-3">Pipeline chuẩn</h2>
            <p className="text-neutral-500 leading-7 mb-5">Skill không tạo một hệ thống orchestration thứ hai. Nó cung cấp capability và workflow cho pipeline chính:</p>
            <CodeBlock code={'Task → Skill selection → Executor → Review → Gate → GitHub API → PR → Deployment evidence'} />
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4"><Bot className="h-5 w-5" /><h2 className="text-xl font-semibold">Agent adapters</h2></div>
            <p className="text-neutral-500 leading-7 mb-5">Registry hiện khai báo cùng một contract skill cho bảy agent adapter:</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {agents.map((agent) => <div key={agent} className="rounded-lg border border-neutral-200 dark:border-neutral-800 px-4 py-3 font-mono text-sm">{agent}</div>)}
            </div>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4"><Terminal className="h-5 w-5" /><h2 className="text-xl font-semibold">Skill registry</h2></div>
            <div className="space-y-3">
              {skills.map(([id, description]) => (
                <article key={id} className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5">
                  <code className="font-mono text-sm text-brand-500">{id}</code>
                  <p className="text-sm text-neutral-500 leading-6 mt-2">{description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-3">Skill contract</h2>
            <p className="text-neutral-500 leading-7 mb-4">Mỗi skill trong registry khai báo ID, semantic version, capabilities, supported agents, executor binding, sandbox boundary, permissions và source identifier. Registry chỉ chứa metadata; credential không thuộc skill metadata.</p>
            <CodeBlock code={'type VelclawSkill = {\n  id: string\n  version: string\n  capabilities: string[]\n  agents: VelclawSkillAgent[]\n  executorBinding: "task-executor" | "review-executor" | "planned"\n  sandbox: "isolated" | "planned"\n  permissions: string[]\n  source: string\n}'} />
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4"><Boxes className="h-5 w-5" /><h2 className="text-xl font-semibold">Integrations</h2></div>
            <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 dark:bg-neutral-900"><tr><th className="text-left px-4 py-3">Integration</th><th className="text-left px-4 py-3">Kind</th><th className="text-left px-4 py-3">Capabilities</th></tr></thead>
                <tbody>
                  {integrations.map(([name, kind, capabilities]) => <tr key={name} className="border-t border-neutral-200 dark:border-neutral-800"><td className="px-4 py-3 font-medium">{name}</td><td className="px-4 py-3 font-mono text-xs">{kind}</td><td className="px-4 py-3 text-neutral-500">{capabilities}</td></tr>)}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="rounded-lg border-l-4 border-l-brand-500 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-5 py-4 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <strong className="text-neutral-800 dark:text-neutral-200">Implementation boundary:</strong> registry hiện là contract/metadata surface. Không tài liệu hóa install, enable hoặc arbitrary agent execution như thể backend đã triển khai nếu repository chưa cung cấp implementation tương ứng.
          </aside>
        </main>
      </div>
    </div>
  );
}

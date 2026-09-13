# Velclaw Project Context

> Canonical project reference for future implementation work. Update this document when a project-level fact changes.

## 1. Identity

- **Project name:** Velclaw / `velclaw`
- **GitHub repository:** `zskbot/Velclaw`
- **Primary domain:** `velclaw.cfd`
- **Primary domain rule:** Do not replace `velclaw.cfd` with `velclaw.ai` or a `*.vercel.app` URL. Vercel URLs are deployment URLs, not the canonical project domain.
- **Documentation domain:** `docs.velclaw.ai` is a separate documentation domain and must not be treated as the primary Velclaw domain.
- **Repository default branch:** `main`

## 2. Canonical URL / deployment terminology

- `velclaw.cfd` = canonical/public primary domain for Velclaw.
- `*.vercel.app` = Vercel deployment URL only, unless explicitly designated otherwise for a specific service.
- `docs.velclaw.ai` = documentation site domain; separate from the primary application domain.
- GitHub repository Website/Homepage fields should use the intended canonical domain, not automatically the Vercel deployment URL.

## 3. Core architecture

Velclaw is an AI-native software workspace for agents, code, builds, runtime, storage, and user services.

The implementation flow that must remain the source-of-truth architecture is:

**Task → Executor → Review → Gate → GitHub API → PR**

The MCP App is an integration/presentation layer. It must not create a competing task database, review engine, gate system, or GitHub credential store.

## 4. MCP App

Location: `mcp/velclaw/`

Package: `@velclaw/mcp-app`

The MCP App exposes the `velclaw_pipeline_status` tool and a UI resource at `ui://velclaw/pipeline.html`.

The UI represents these explicit pipeline stages:

1. Task
2. Executor
3. Review
4. Gate
5. GitHub API
6. PR

Overall pipeline state is represented as `pending`, `running`, `passed`, or `blocked`.

Host-provided task/repository labels must be HTML-escaped before rendering.

The MCP package has its own dependencies and build/type-check boundary. Do not add MCP-only dependencies to the root Velclaw package merely to make the root compiler see the MCP package.

## 5. TypeScript/build boundary

The root project uses its own TypeScript configuration. `mcp/velclaw` is a standalone package.

The root `tsconfig.json` excludes:

- `node_modules`
- `opensrc`
- `mcp/velclaw`

The MCP package is validated separately by its own workflow:

`.github/workflows/velclaw-mcp.yml`

That workflow installs dependencies in `mcp/velclaw` and runs `npm run build`.

## 6. Current integration branch / PR

- **Branch:** `feat/velclaw-pipeline-mcp-integration`
- **Pull request:** #2
- **PR title:** `feat: integrate live pipeline state into Velclaw MCP App`
- **Status:** Open; do not merge unless explicitly directed.

The PR integrates live pipeline state into the MCP UI while preserving existing Velclaw Task/Review/Gate/GitHub API logic as the source of truth.

## 7. Current known commits

- `7f5df3efe4b5d360c60e018970f5b505e22fe2a5` — `fix: isolate MCP app type-check from root project`
  - Root `tsconfig.json` excludes `mcp/velclaw`.
  - At the time this context was written, new CI evidence for this commit had not yet been observed. Do not claim the root type-check passes without fresh CI evidence.
- Earlier MCP UI commit: `06859e9adc1cb02f6eb3d79ac298f0d64d0b0e23` — `feat(velclaw): render live pipeline states`.
  - MCP workflow run #8 completed successfully for that commit.

## 8. Existing API/source-of-truth areas

Known Velclaw routes include:

- `app/api/velclaw/tasks`
- `app/api/velclaw/tasks/[taskId]/review`
- `app/api/velclaw/pr`

Before implementing a new pipeline state source, inspect and reuse these existing systems. Do not duplicate their logic.

## 9. GitHub/Vercel operational rules

- Work directly on the repository and inspect the current state before modifying files.
- Prefer extending existing functionality over creating parallel systems.
- Validate every implementation step with actual repository/build/CI evidence.
- Never claim a check is passing when it has not been observed passing.
- Secrets and API keys belong in GitHub/Vercel Secrets or Environment Variables; never hard-code them.
- Normal GitHub flow: branch → commit → CI/check → PR → review → merge.
- Do not merge, delete, or destroy project data without explicit basis.
- Do not claim production deployment unless the deployment has actually been verified.

## 10. Vercel status known at last verification

A Vercel team named `velclaw` existed, but there was no confirmed linked Vercel project for this repository at the time of the last verification. Therefore deployment/domain claims must be checked against current Vercel configuration rather than inferred from a `*.vercel.app` URL.

## 11. Important correction

**The primary Velclaw domain is `velclaw.cfd`. This is a critical project fact.**

Never infer the primary domain from a GitHub repository Website field or from a Vercel deployment URL. If those values differ, treat `velclaw.cfd` as the canonical primary domain unless the project owner explicitly changes this document and the deployment/domain configuration.
#!/usr/bin/env node
/**
 * UXCO Build — Machine Preflight
 *
 * Verificações locais de infraestrutura observável pelo Node.js.
 * Somente leitura: não instala nem altera nada.
 *
 * Modelo de ações por dependência:
 *   - DETECT: verificar se a dependência está presente (feito aqui);
 *   - RECOMMEND: mostrar o comando/passo de instalação recomendado (feito aqui);
 *   - INSTALL WITH USER APPROVAL: instalação assistida mediante aprovação
 *     explícita do usuário (NÃO implementada — reservada para versão futura;
 *     o campo `install.mode` de cada dependência já prepara essa evolução).
 *
 * Nunca instalar automaticamente: Node.js, Git, Claude Code, Paper Desktop.
 *
 * Uso: npm run preflight
 */

import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const MIN_NODE_MAJOR = 18;
const REQUIRED_FILES = ["README.md", "CLAUDE.md", "package.json"];
const PAPER_MCP_URL = "http://127.0.0.1:29979/mcp";
const PAPER_MCP_TIMEOUT_MS = 3000;

const REQUIRED = "REQUIRED";
const OPTIONAL = "OPTIONAL";

const results = [];

function report(status, label, requirement, detail, hints = []) {
  results.push({ status, label, requirement, detail, hints });
}

function run(cmd) {
  try {
    return execSync(cmd, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

/*
 * Dependências externas detectáveis.
 * `install.mode`:
 *   - "manual": a instalação exige passos fora do terminal (instalador,
 *     conta, download) e nunca deve ser automatizada;
 *   - "assisted-future": um comando seguro e conhecido existe; uma versão
 *     futura poderá oferecer executá-lo COM APROVAÇÃO DO USUÁRIO.
 * Nenhum modo dispara instalação hoje — o preflight apenas DETECT + RECOMMEND.
 */
const DEPENDENCIES = [
  {
    label: "Node.js",
    requirement: REQUIRED,
    detect() {
      const version = process.versions.node;
      const major = Number(version.split(".")[0]);
      if (major >= MIN_NODE_MAJOR) {
        return { status: "PASS", detail: `v${version} (mínimo: v${MIN_NODE_MAJOR})` };
      }
      return {
        status: "FAIL",
        detail: `v${version} é inferior ao mínimo v${MIN_NODE_MAJOR}`,
      };
    },
    install: {
      mode: "manual",
      recommend: "instale manualmente a versão LTS em https://nodejs.org (instalação automática não é oferecida para runtimes)",
    },
  },
  {
    label: "Git",
    requirement: REQUIRED,
    detect() {
      const version = run("git --version");
      if (version) return { status: "PASS", detail: version };
      return { status: "FAIL", detail: "executável não encontrado no PATH" };
    },
    install: {
      mode: "manual",
      recommend: "instale manualmente em https://git-scm.com (Windows: `winget install --id Git.Git` é o comando conhecido, mas execute-o você mesmo)",
    },
  },
  {
    label: "Claude Code",
    requirement: REQUIRED,
    detect() {
      const version = run("claude --version");
      if (version) return { status: "PASS", detail: version.split("\n")[0] };
      return { status: "FAIL", detail: "CLI `claude` não encontrada no PATH" };
    },
    install: {
      mode: "manual",
      recommend: "instalação manual: https://claude.com/claude-code (requer conta/autenticação — não automatizável)",
    },
  },
  {
    label: "GitHub CLI",
    requirement: OPTIONAL,
    detect() {
      const version = run("gh --version");
      if (version) return { status: "PASS", detail: version.split("\n")[0] };
      return {
        status: "WARN",
        detail: "CLI `gh` não encontrada no PATH",
      };
    },
    install: {
      mode: "assisted-future",
      recommend: "sugestão: `winget install --id GitHub.cli` (Windows) — impacto da ausência: operações com GitHub (repos remotos, PRs, issues) previstas para sprints futuras não estarão disponíveis; o trabalho local não é afetado",
    },
  },
];

function checkDependencies() {
  for (const dep of DEPENDENCIES) {
    const { status, detail } = dep.detect();
    const hints = [];
    if (status !== "PASS") {
      hints.push(`RECOMMEND: ${dep.install.recommend}`);
      if (dep.install.mode === "manual") {
        hints.push("instalação automática não será tentada (dependência de instalação manual)");
      } else {
        hints.push("instalação assistida (com aprovação do usuário) planejada para versão futura; por ora, instale manualmente");
      }
    }
    report(status, dep.label, dep.requirement, detail, hints);
  }
}

function checkGitRepository() {
  if (!run("git --version")) {
    report("WARN", "Git repository", REQUIRED, "verificação ignorada: Git não encontrado");
    report("WARN", "Git branch", REQUIRED, "verificação ignorada: Git não encontrado");
    return;
  }
  if (run("git rev-parse --is-inside-work-tree") !== "true") {
    report("FAIL", "Git repository", REQUIRED, "este diretório não é um repositório Git", [
      "RECOMMEND: execute `git init -b main` na raiz do projeto",
    ]);
    report("WARN", "Git branch", REQUIRED, "verificação ignorada: fora de um repositório Git");
    return;
  }
  report("PASS", "Git repository", REQUIRED, "o diretório pertence a um repositório Git");
  const branch = run("git branch --show-current");
  if (branch) {
    report("PASS", "Git branch", REQUIRED, `branch atual: ${branch}`);
  } else {
    report("WARN", "Git branch", REQUIRED, "não foi possível determinar a branch atual (HEAD destacado?)");
  }
}

function checkRequiredFiles() {
  const missing = REQUIRED_FILES.filter((file) => !existsSync(join(root, file)));
  if (missing.length === 0) {
    report("PASS", "Required files", REQUIRED, REQUIRED_FILES.join(", "));
  } else {
    report("FAIL", "Required files", REQUIRED, `ausente(s): ${missing.join(", ")}`, [
      "RECOMMEND: restaure os arquivos a partir do repositório Git",
    ]);
  }
}

/*
 * Paper MCP — diagnóstico de disponibilidade do endpoint local, apenas.
 * A configuração real do MCP acontece DENTRO do Claude Code (plugin oficial
 * ou `claude mcp add`), e a validação funcional é o Agent Preflight — uma
 * porta HTTP respondendo NÃO significa que o MCP está funcional na sessão.
 */
async function checkPaperMcp() {
  try {
    const response = await fetch(PAPER_MCP_URL, {
      method: "GET",
      signal: AbortSignal.timeout(PAPER_MCP_TIMEOUT_MS),
    });
    report(
      "PASS",
      "Paper MCP endpoint",
      OPTIONAL,
      `${PAPER_MCP_URL} respondeu (HTTP ${response.status}) — diagnóstico apenas: NÃO garante MCP funcional na sessão do Claude Code; a validação real é o Agent Preflight (/mcp + chamada de leitura)`
    );
    await response.body?.cancel();
  } catch (error) {
    const cause = error?.cause?.code ?? error?.code ?? error?.name ?? "erro desconhecido";
    const reason =
      error?.name === "TimeoutError"
        ? `sem resposta em ${PAPER_MCP_TIMEOUT_MS}ms (timeout)`
        : cause === "ECONNREFUSED"
          ? "conexão recusada (nada escutando na porta 29979)"
          : `não acessível (${cause})`;
    report("WARN", "Paper MCP endpoint", OPTIONAL, `${PAPER_MCP_URL} — ${reason}`, [
      "impacto: trabalho com o Paper indisponível; o trabalho local no repositório não é afetado",
      "RECOMMEND: 1) abra o Paper Desktop; 2) abra um documento; 3) verifique a conexão com /mcp no Claude Code",
      "a configuração do MCP acontece dentro do Claude Code (plugin oficial ou `claude mcp add paper --transport http " + PAPER_MCP_URL + " --scope user`)",
    ]);
  }
}

function printReport() {
  console.log("\nUXCO BUILD — PREFLIGHT (Machine Preflight)\n");

  for (const { status, label, requirement, detail, hints } of results) {
    console.log(`[${status}] ${label} (${requirement})`);
    if (detail) console.log(`       ${detail}`);
    for (const hint of hints) console.log(`       → ${hint}`);
  }

  const hasFail = results.some((r) => r.status === "FAIL");
  const warnCount = results.filter((r) => r.status === "WARN").length;

  console.log("\n" + "─".repeat(50));
  console.log(`FINAL STATUS: ${hasFail ? "ACTION REQUIRED" : "READY"}${warnCount > 0 ? ` (${warnCount} aviso(s))` : ""}\n`);
  process.exitCode = hasFail ? 1 : 0;
}

checkDependencies();
checkGitRepository();
checkRequiredFiles();
await checkPaperMcp();
printReport();

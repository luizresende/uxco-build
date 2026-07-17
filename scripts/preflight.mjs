#!/usr/bin/env node
/**
 * UXCO Build — Preflight (Sprint 0)
 *
 * Verificações locais básicas antes do UXCO Build começar a trabalhar.
 * Somente leitura: não instala nem altera nada.
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

const results = [];

function report(status, label, detail) {
  results.push({ status, label, detail });
}

function git(args) {
  try {
    return execSync(`git ${args}`, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

// 1. Node.js
function checkNode() {
  const version = process.versions.node;
  const major = Number(version.split(".")[0]);
  if (major >= MIN_NODE_MAJOR) {
    report("PASS", "Node.js", `v${version} (mínimo: v${MIN_NODE_MAJOR})`);
  } else {
    report("FAIL", "Node.js", `v${version} é inferior ao mínimo v${MIN_NODE_MAJOR} — instale em https://nodejs.org`);
  }
}

// 2. Executável Git
function checkGitExecutable() {
  const version = git("--version");
  if (version) {
    report("PASS", "Git", version);
    return true;
  }
  report("FAIL", "Git", "executável não encontrado no PATH — instale em https://git-scm.com");
  return false;
}

// 3. Repositório Git
function checkGitRepository() {
  const inside = git("rev-parse --is-inside-work-tree");
  if (inside === "true") {
    report("PASS", "Git repository", "o diretório pertence a um repositório Git");
    return true;
  }
  report("FAIL", "Git repository", "este diretório não é um repositório Git — execute: git init -b main");
  return false;
}

// 4. Branch atual
function checkGitBranch() {
  const branch = git("branch --show-current");
  if (branch) {
    report("PASS", "Git branch", `branch atual: ${branch}`);
  } else {
    report("WARN", "Git branch", "não foi possível determinar a branch atual (HEAD destacado?)");
  }
}

// 5. Arquivos essenciais
function checkRequiredFiles() {
  const missing = REQUIRED_FILES.filter((file) => !existsSync(join(root, file)));
  if (missing.length === 0) {
    report("PASS", "Required files", REQUIRED_FILES.join(", "));
  } else {
    report("FAIL", "Required files", `ausente(s): ${missing.join(", ")}`);
  }
}

// 6. Paper MCP — diagnóstico de disponibilidade do endpoint local.
//    Não é um cliente MCP: qualquer resposta HTTP conta como "acessível".
async function checkPaperMcp() {
  try {
    const response = await fetch(PAPER_MCP_URL, {
      method: "GET",
      signal: AbortSignal.timeout(PAPER_MCP_TIMEOUT_MS),
    });
    report("PASS", "Paper MCP endpoint", `${PAPER_MCP_URL} respondeu (HTTP ${response.status})`);
    await response.body?.cancel();
  } catch (error) {
    const cause = error?.cause?.code ?? error?.code ?? error?.name ?? "erro desconhecido";
    const reason =
      error?.name === "TimeoutError"
        ? `sem resposta em ${PAPER_MCP_TIMEOUT_MS}ms (timeout)`
        : cause === "ECONNREFUSED"
          ? "conexão recusada (nada escutando na porta 29979)"
          : `não acessível (${cause})`;
    report("WARN", "Paper MCP endpoint", `${PAPER_MCP_URL} — ${reason}`);
  }
}

function printReport() {
  console.log("\nUXCO BUILD — PREFLIGHT\n");

  for (const { status, label, detail } of results) {
    console.log(`[${status}] ${label}`);
    if (detail) console.log(`       ${detail}`);
  }

  const hasFail = results.some((r) => r.status === "FAIL");
  const paperOffline = results.some((r) => r.label === "Paper MCP endpoint" && r.status !== "PASS");

  if (paperOffline) {
    console.log("\nPaper MCP indisponível — antes de trabalhar com o Paper:");
    console.log("  1. abra o Paper Desktop;");
    console.log("  2. abra um documento no Paper;");
    console.log("  3. verifique a conexão MCP no Claude Code.");
  }

  console.log(`\nFINAL STATUS: ${hasFail ? "ACTION REQUIRED" : "READY"}\n`);
  process.exitCode = hasFail ? 1 : 0;
}

checkNode();
const gitAvailable = checkGitExecutable();
if (gitAvailable) {
  const insideRepo = checkGitRepository();
  if (insideRepo) {
    checkGitBranch();
  } else {
    report("WARN", "Git branch", "verificação ignorada: fora de um repositório Git");
  }
} else {
  report("WARN", "Git repository", "verificação ignorada: Git não encontrado");
  report("WARN", "Git branch", "verificação ignorada: Git não encontrado");
}
checkRequiredFiles();
await checkPaperMcp();
printReport();

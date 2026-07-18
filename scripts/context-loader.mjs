#!/usr/bin/env node
/**
 * Context Loader — fase mecânica do Context Engine (Sprint 2).
 *
 * Implementa os STEPs 1–2 do Context Loading Process definido em
 * skills/product-context/SKILL.md: descobrir a Project Memory, inventariar
 * os arquivos conhecidos (loaded/empty/missing) e carregar o conteúdo
 * encontrado em uma representação estruturada.
 *
 * O Loader é proibido de interpretar o produto, inventar contexto ou tomar
 * decisões de design — a análise pertence à Product Context Skill.
 *
 * Uso:
 *   node scripts/context-loader.mjs <projectPath> [--json]
 *
 * Zero dependências por decisão de arquitetura: a Sprint 2 permanece
 * simples e auditável (sem DB, embeddings, frameworks de agentes).
 */

import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const MEMORY_FILES = [
  'product.md',
  'users.md',
  'requirements.md',
  'research.md',
  'metrics.md',
  'decisions.md',
  'glossary.md',
];

const NOT_FILLED_RE = /^_Not filled.*_$/;
const GUIDANCE_RE = /^\*\(.*\)\*$/;
const METADATA_RE = /^\*\*(Project|Last updated|Fill status):\*\*/;
const DECLARED_FILL_RE = /\*\*Fill status:\*\*\s*([A-Z]+)/;

/** Uma linha carrega conteúdo real (não estrutura, guia ou placeholder)? */
function isSubstantive(line) {
  const t = line.trim();
  if (t === '') return false;
  if (t.startsWith('#')) return false; // headings
  if (t.startsWith('>')) return false; // blockquote (instruções do template)
  if (t.startsWith('<!--')) return false; // comentários
  if (NOT_FILLED_RE.test(t)) return false;
  if (GUIDANCE_RE.test(t)) return false;
  if (METADATA_RE.test(t)) return false;
  return true;
}

/** Divide o corpo em seções `## `, marcando cada uma como preenchida ou não. */
function parseSections(content) {
  const lines = content.split(/\r?\n/);
  const sections = [];
  let current = null;
  for (const line of lines) {
    if (/^## /.test(line)) {
      if (current) sections.push(current);
      current = { name: line.replace(/^## /, '').trim(), bodyLines: [] };
    } else if (current) {
      current.bodyLines.push(line);
    }
  }
  if (current) sections.push(current);
  return sections.map(({ name, bodyLines }) => ({
    name,
    filled: bodyLines.some(isSubstantive),
  }));
}

/** Inventaria um arquivo de memória: missing | empty | loaded (+fill). */
function inspectFile(memoryDir, file) {
  const path = memoryDir ? join(memoryDir, file) : null;
  if (!path || !existsSync(path)) {
    return { file, status: 'missing' };
  }
  const content = readFileSync(path, 'utf8');
  const declaredMatch = content.match(DECLARED_FILL_RE);
  const declaredFillStatus = declaredMatch ? declaredMatch[1] : null;
  const sections = parseSections(content);

  const filledSections = sections.filter((s) => s.filled);
  // Conteúdo fora de qualquer seção (preâmbulo, ou arquivo sem `## `) também conta.
  const lines = content.split(/\r?\n/);
  const firstSection = lines.findIndex((l) => /^## /.test(l));
  const preamble = firstSection === -1 ? lines : lines.slice(0, firstSection);
  const hasLooseContent = preamble.some(isSubstantive);

  if (filledSections.length === 0 && !hasLooseContent) {
    return { file, status: 'empty', declaredFillStatus, sections };
  }

  const fill =
    sections.length > 0 && filledSections.length < sections.length
      ? 'PARTIAL'
      : 'FILLED';
  return { file, status: 'loaded', fill, declaredFillStatus, sections, content };
}

/**
 * Descobre onde a memória vive: os arquivos direto no caminho informado,
 * ou em um subdiretório `memory/` (convenção da SKILL.md).
 */
export function resolveMemoryDir(projectPath) {
  const candidates = [projectPath, join(projectPath, 'memory')];
  for (const dir of candidates) {
    if (MEMORY_FILES.some((f) => existsSync(join(dir, f)))) return dir;
  }
  return null;
}

/** Monta a representação estruturada das fontes de um projeto. */
export function loadContext(projectPath) {
  const root = resolve(projectPath);
  const memoryDir = resolveMemoryDir(root);
  const sources = MEMORY_FILES.map((f) => inspectFile(memoryDir, f));
  const count = (status) => sources.filter((s) => s.status === status).length;
  return {
    projectPath: root,
    memoryDir,
    generatedAt: new Date().toISOString(),
    sources,
    summary: {
      loaded: count('loaded'),
      empty: count('empty'),
      missing: count('missing'),
    },
  };
}

/** Saída humana — espelha o formato conceitual da especificação da sprint. */
function renderText(result) {
  const out = [];
  out.push('PROJECT CONTEXT SOURCES');
  out.push('');
  out.push(`Project: ${result.projectPath}`);
  out.push(
    `Memory:  ${result.memoryDir ?? 'not found (no known memory files at path or path/memory)'}`
  );
  out.push('');
  for (const s of result.sources) {
    out.push(s.file);
    if (s.status === 'loaded') {
      out.push(`  status: loaded (${s.fill.toLowerCase()})`);
      const filled = s.sections.filter((x) => x.filled).length;
      if (s.sections.length > 0) {
        out.push(`  sections filled: ${filled}/${s.sections.length}`);
      }
    } else {
      out.push(`  status: ${s.status}`);
    }
    if (s.declaredFillStatus) {
      out.push(`  declared fill status: ${s.declaredFillStatus}`);
    }
    out.push('');
  }
  out.push(
    `Summary: ${result.summary.loaded} loaded · ${result.summary.empty} empty · ${result.summary.missing} missing`
  );
  return out.join('\n');
}

function main() {
  const args = process.argv.slice(2);
  const json = args.includes('--json');
  const projectPath = args.find((a) => !a.startsWith('--'));

  if (!projectPath) {
    console.error('Usage: node scripts/context-loader.mjs <projectPath> [--json]');
    process.exit(1);
  }
  if (!existsSync(projectPath)) {
    console.error(`Project path not found: ${projectPath}`);
    process.exit(1);
  }

  const result = loadContext(projectPath);
  console.log(json ? JSON.stringify(result, null, 2) : renderText(result));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}

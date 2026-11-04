#!/usr/bin/env node
/**
 * Mede o corpus de instrução que o /uxco-review carrega hoje.
 *
 * Não é um trace de sessão. Não usa tokenizador de modelo e não inventa
 * métrica de runtime. Conta arquivos que a constituição, o comando e o
 * workflow obrigam o agente a consultar para executar o review, e atribui
 * cada arquivo aos STEPs quando o próprio workflow torna isso determinável.
 *
 * Uso:
 *   node scripts/measure-context.mjs
 *   node scripts/measure-context.mjs --write benchmarks/harness-refactor/baseline.md
 *
 * --write recusa sobrescrever um snapshot congelado cujo fingerprint do
 * corpus divergiu, a menos que --force seja passado. O baseline commitado
 * é o corpus anterior ao split da constituição; regenerá-lo depois do split
 * mediria outra coisa.
 *
 * Zero dependências. Compatível com Windows: só Node e caminhos do repo.
 */

import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import { existsSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const ALWAYS = [
  "CLAUDE.md",
  ".claude/commands/uxco-review.md",
  "workflows/uxco-review.md",
];

const ENTRY_POINTS = [".claude/commands/uxco-review.md", "workflows/uxco-review.md"];

/** Citados no workflow, mas não são instrução carregada por uma run de review. */
const DENY_PREFIXES = ["tests/", "examples/", "benchmarks/"];

/**
 * Flags condicionais curados — o workflow descreve a condição em prosa,
 * sem token máquina. Ausência nesta tabela significa "contado no teto e no
 * piso". Não inferir condição por heurística.
 */
const CONDITIONAL = {
  "docs/architecture.md":
    "somente quando o canvas é fonte (STEP 1, Agent Preflight até PAPER_READY)",
  "docs/constitution/canvas-safety.md":
    "somente quando o canvas é fonte (escopo, PAPER_READY e documento de teste)",
  "experiments/paper-mcp/smoke-test.md":
    "somente quando o canvas é fonte (repertório de leitura validado no STEP 1)",
  "scripts/context-loader.mjs":
    "quando há caminho de memória; sem o loader, o workflow degrada para leitura direta declarada",
  "skills/interaction-design/SKILL.md":
    "escopo de fluxo, tarefa multi-tela, sequência, ou cheiro comportamental (STEP 4)",
};

/**
 * Seção `## ` do workflow → STEPs que ela implementa.
 * Granularidade de seção, não de frase: um arquivo citado na seção herda
 * todos esses STEPs. A tabela Skill Dependencies e os bullets `STEP N` do
 * Process refinam por união, nunca por subtração.
 */
const SECTION_STEPS = [
  ["## Scope Resolution", [0]],
  ["## Context Integration", [2, 3]],
  ["## Paper Inspection", [1]],
  ["## Critique Orchestration", [4, 5]],
  ["## Issue Model", [4]],
  ["## Adversarial Quality Engine", [6, 7, 8]],
  ["## Output", [10]],
  ["## Completion Criteria", [10]],
];

const PATH_RE = /`((?:[A-Za-z0-9_.-]+\/)+[A-Za-z0-9_./*-]+\.(?:md|mjs))`/g;
const BARE_RE = /(?:[A-Za-z0-9_.-]+\/)+[A-Za-z0-9_.-]+\.(?:md|mjs)/g;
const SHORT_RE = /`([A-Za-z0-9_.-]+\.(?:md|mjs))`/g;
const RANGE_RE = /STEPs?\s+(\d+)\s*[–-]\s*(\d+)/gi;
const STEP_RE = /STEP\s+(\d+)/gi;

function repoPath(rel) {
  return join(root, ...rel.split("/"));
}

function readRel(rel) {
  const abs = repoPath(rel);
  if (!existsSync(abs)) {
    throw new Error(`arquivo do corpus ausente: ${rel}`);
  }
  return readFileSync(abs, "utf8");
}

function git(args) {
  try {
    return execSync(`git ${args}`, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch {
    return null;
  }
}

function matches(re, text) {
  re.lastIndex = 0;
  return [...text.matchAll(re)];
}

function stepsInText(text) {
  const steps = new Set();
  for (const match of matches(RANGE_RE, text)) {
    const start = Number(match[1]);
    const end = Number(match[2]);
    for (let n = Math.min(start, end); n <= Math.max(start, end); n += 1) {
      steps.add(n);
    }
  }
  const withoutRanges = text.replace(RANGE_RE, " ");
  for (const match of matches(STEP_RE, withoutRanges)) {
    steps.add(Number(match[1]));
  }
  return [...steps].sort((a, b) => a - b);
}

function pathsIn(text) {
  return matches(PATH_RE, text).map((match) => match[1]);
}

function barePaths(text) {
  return matches(BARE_RE, text).map((match) => match[0]);
}

function pathsInCodeFences(text) {
  const fences = text.match(/```[\s\S]*?```/g) ?? [];
  return fences.flatMap((fence) => barePaths(fence));
}

function shortNames(text) {
  return matches(SHORT_RE, text).map((match) => match[1]).filter((name) => !name.includes("/"));
}

function label(rel) {
  const parts = rel.split("/");
  return parts.length >= 2 ? `${parts.at(-2)}/${parts.at(-1)}` : rel;
}

function countText(text) {
  const words = text.match(/\S+/g);
  const chars = [...text].length;
  const bytes = Buffer.byteLength(text, "utf8");
  return {
    words: words ? words.length : 0,
    chars,
    bytes,
    tokensApprox: Math.ceil(bytes / 4),
  };
}

function addEntry(map, excluded, rel, steps, why) {
  if (DENY_PREFIXES.some((prefix) => rel.startsWith(prefix))) {
    if (!excluded.some((item) => item.path === rel)) {
      excluded.push({ path: rel, why });
    }
    return;
  }
  const entry = map.get(rel) ?? { path: rel, steps: new Set(), why: [] };
  for (const step of steps) entry.steps.add(step);
  if (!entry.why.includes(why)) entry.why.push(why);
  map.set(rel, entry);
}

function sectionBodies(markdown) {
  const parts = markdown.split(/^(?=## )/m);
  return parts
    .filter((part) => part.startsWith("## "))
    .map((part) => {
      const newline = part.indexOf("\n");
      return {
        title: part.slice(0, newline).trim(),
        body: part.slice(newline + 1),
      };
    });
}

function discover(workflow, command) {
  const map = new Map();
  const excluded = [];

  // Descoberta: todo caminho citado. O comando não atribui STEP — ele repete
  // "STEPs 0–10" no mesmo bloco em que lista arquivos, e isso colapsaria a
  // atribuição. Quem atribui é o workflow.
  for (const rel of pathsIn(workflow)) addEntry(map, excluded, rel, [], "citado no workflow");
  for (const rel of pathsIn(command)) addEntry(map, excluded, rel, [], "citado no comando");
  for (const rel of pathsInCodeFences(workflow)) {
    addEntry(map, excluded, rel, [], "bloco de código do workflow");
  }

  for (const [title, steps] of SECTION_STEPS) {
    const section = sectionBodies(workflow).find((item) => item.title === title);
    if (!section) {
      throw new Error(`seção esperada ausente no workflow: ${title}`);
    }
    const rels = new Set([...pathsIn(section.body), ...pathsInCodeFences(section.body)]);
    for (const rel of rels) {
      addEntry(map, excluded, rel, steps, `seção ${title.replace(/^## /, "")}`);
    }
  }

  const process = sectionBodies(workflow).find((item) => item.title === "## Process");
  if (!process) throw new Error("seção ## Process ausente no workflow");
  const bullets = [];
  for (const bullet of process.body.split(/^- \*\*STEP /m).slice(1)) {
    const number = Number(bullet.match(/^(\d+)/)?.[1]);
    if (Number.isNaN(number)) continue;
    bullets.push({ number, text: bullet });
    const rels = new Set([...pathsIn(bullet), ...barePaths(bullet)]);
    // O bullet do STEP 2 cita o comando `context:load`, não o arquivo.
    // O arquivo está na tabela de dependências e é o que esse comando executa.
    if (bullet.includes("context:load")) rels.add("scripts/context-loader.mjs");
    for (const rel of rels) addEntry(map, excluded, rel, [number], `bullet STEP ${number}`);
  }

  const dependencies = sectionBodies(workflow).find((item) => item.title === "## Skill Dependencies");
  if (!dependencies) throw new Error("seção ## Skill Dependencies ausente no workflow");
  const rows = [...dependencies.body.matchAll(/^\| `([^`]+)` \| ([^|]+) \|$/gm)];
  if (rows.length === 0) {
    throw new Error("tabela Skill Dependencies sem linhas reconhecíveis");
  }
  for (const row of rows) {
    addEntry(map, excluded, row[1], stepsInText(row[2]), "tabela Skill Dependencies");
  }

  for (const { number, text } of bullets) {
    for (const name of shortNames(text)) {
      const matches = [...map.keys()].filter((rel) => basename(rel) === name);
      if (matches.length === 1) {
        addEntry(map, excluded, matches[0], [number], `bullet STEP ${number} (nome curto único)`);
      }
    }
  }

  return { map, excluded, dependencyRows: rows.map((row) => row[1]) };
}

function shortNameGaps(texts, measured) {
  const known = new Set([...measured].map((rel) => basename(rel)));
  const gaps = new Set();
  for (const text of texts) {
    for (const match of matches(SHORT_RE, text)) {
      const name = match[1];
      if (name.includes("/")) continue;
      if (!known.has(name)) gaps.add(name);
    }
  }
  return [...gaps].sort();
}

function measure() {
  const workflow = readRel("workflows/uxco-review.md");
  const command = readRel(".claude/commands/uxco-review.md");
  const { map, excluded, dependencyRows } = discover(workflow, command);

  for (const rel of ALWAYS) map.delete(rel);

  const missingDeps = dependencyRows.filter((rel) => !map.has(rel) && !ALWAYS.includes(rel));
  if (missingDeps.length > 0) {
    throw new Error(`dependência da tabela fora do corpus medido: ${missingDeps.join(", ")}`);
  }

  const files = [];
  for (const rel of ALWAYS) {
    const text = readRel(rel);
    files.push({
      path: rel,
      role: "sempre carregado",
      steps: [],
      conditional: null,
      why: "entra no contexto da run inteira, antes de qualquer STEP",
      ...countText(text),
      text,
    });
  }

  const discovered = [...map.values()].sort((a, b) => a.path.localeCompare(b.path));
  for (const entry of discovered) {
    const text = readRel(entry.path);
    files.push({
      path: entry.path,
      role: "consultado pelo review",
      steps: [...entry.steps].sort((a, b) => a - b),
      conditional: CONDITIONAL[entry.path] ?? null,
      why: entry.why.join("; "),
      ...countText(text),
      text,
    });
  }

  const gaps = shortNameGaps([workflow, command], files.map((file) => file.path));
  if (gaps.length > 0) {
    throw new Error(
      `nome curto em crase sem arquivo correspondente no corpus: ${gaps.join(", ")}. ` +
        "Inclua o caminho completo no workflow ou trate o caso no script.",
    );
  }

  const fingerprint = createHash("sha256");
  for (const file of [...files].sort((a, b) => a.path.localeCompare(b.path))) {
    fingerprint.update(file.path);
    fingerprint.update("\0");
    fingerprint.update(createHash("sha256").update(file.text).digest("hex"));
    fingerprint.update("\n");
  }

  const head = git("rev-parse HEAD");
  const dirty = git(`diff --name-only HEAD -- ${files.map((file) => file.path).join(" ")}`);

  return {
    files,
    excluded,
    head,
    corpusMatchesHead: dirty === "",
    fingerprint: fingerprint.digest("hex"),
    node: process.version,
  };
}

function sum(files, key) {
  return files.reduce((total, file) => total + file[key], 0);
}

function totals(files) {
  return {
    files: files.length,
    words: sum(files, "words"),
    chars: sum(files, "chars"),
    bytes: sum(files, "bytes"),
    tokensApprox: files.reduce((total, file) => total + file.tokensApprox, 0),
  };
}

function fmt(n) {
  return String(n);
}

function totalRow(label, files) {
  const t = totals(files);
  return `| ${label} | ${fmt(t.files)} | ${fmt(t.words)} | ${fmt(t.chars)} | ${fmt(t.bytes)} | ${fmt(t.tokensApprox)} |`;
}

function stepLabel(step) {
  const names = {
    0: "Resolve scope and target",
    1: "Preflight & Paper Inspection",
    2: "Context phase",
    3: "Context gate",
    4: "Initial Analysis",
    5: "Consolidation",
    6: "Adversarial Critique",
    7: "Revision",
    8: "Review QA",
    9: "Quality Gate",
    10: "Report",
  };
  return names[step] ?? `STEP ${step}`;
}

function render(result) {
  const always = result.files.filter((file) => file.role === "sempre carregado");
  const consulted = result.files.filter((file) => file.role === "consultado pelo review");
  const canvasConditional = new Set([
    "docs/architecture.md",
    "experiments/paper-mcp/smoke-test.md",
  ]);
  const withoutCanvas = result.files.filter((file) => !canvasConditional.has(file.path));
  const claudeOnly = result.files.filter((file) => file.path === "CLAUDE.md");
  const byWords = [...result.files].sort((a, b) => b.words - a.words || a.path.localeCompare(b.path));

  const lines = [];
  lines.push("# Harness refactor — baseline de contexto do `/uxco-review`");
  lines.push("");
  lines.push("<!-- snapshot: frozen -->");
  lines.push(`<!-- measured-commit: ${result.head ?? "UNKNOWN"} -->`);
  lines.push(`<!-- corpus-fingerprint: ${result.fingerprint} -->`);
  lines.push("");
  lines.push(
    "Snapshot do corpus de instrução que o `/uxco-review` carrega **antes** da cadeia seletiva (passos 1–2 do refactor lean-harness). Gerado por `node scripts/measure-context.mjs --write benchmarks/harness-refactor/baseline.md`.",
  );
  lines.push("");
  lines.push(`- Commit do corpus: \`${result.head ?? "UNKNOWN"}\``);
  lines.push(
    `- Arquivos medidos ${result.corpusMatchesHead ? "idênticos a esse commit" : "DIFEREM desse commit — snapshot sujo, não usar como baseline"}`,
  );
  lines.push(`- Node: \`${result.node}\``);
  lines.push(`- Fingerprint SHA-256 do corpus: \`${result.fingerprint}\``);
  lines.push("");
  lines.push(
    "Este arquivo é o baseline congelado. O script mede sempre o working tree atual. Rodar `--write` de novo depois que `CLAUDE.md` ou o workflow mudarem produz outro corpus; o script recusa sobrescrever este snapshot se o fingerprint divergir, a menos que se passe `--force`. Para reproduzir estes números, rodar o script no commit que o introduziu (a constituição ainda não foi partida).",
  );
  lines.push("");
  lines.push("## Método");
  lines.push("");
  lines.push("Medição estática do que o desenho atual manda consultar. Não houve sessão de Claude Code nem canvas Paper — por isso não há número de token consumido, latência nem qualidade de saída. Esses campos estão no protocolo manual, vazios de propósito.");
  lines.push("");
  lines.push("Entra no corpus:");
  lines.push("");
  lines.push("1. `CLAUDE.md` — o Claude Code injeta a constituição em toda sessão.");
  lines.push("2. `.claude/commands/uxco-review.md` — o corpo do comando, injetado ao acionar `/uxco-review`.");
  lines.push("3. `workflows/uxco-review.md` — o comando manda executar o workflow inteiro.");
  lines.push(
    "4. Todo caminho `` `pasta/arquivo.md` `` ou `` `.mjs` `` em crase no comando e no workflow, fora de `tests/`, `examples/` e `benchmarks/`.",
  );
  lines.push("");
  lines.push(
    "Não há recursão. Um standard que cita outro standard não puxa o segundo arquivo, salvo se o comando ou o workflow também o citarem. Fechar o grafo inteiro misturaria \"citado em algum lugar do repositório\" com \"carregado pelo review\". Links de segundo nível não são contados; a lista de exclusões explícitas está mais abaixo.",
  );
  lines.push("");
  lines.push(
    "Atribuição por STEP, só onde o workflow torna isso determinável: a seção `## ` que implementa o STEP (granularidade de seção, não de frase), os caminhos dentro dos blocos de código dessas seções, os bullets `**STEP N**` de `## Process` (caminho em crase, caminho nu ou nome curto quando há um único arquivo com esse nome), e os números de STEP na coluna de papel da tabela Skill Dependencies. A união desses sinais. O comando não atribui STEP: ele diz STEPs 0–10 no mesmo bloco em que lista arquivos, e usar isso atribuiria tudo a todos os passos. O bullet do STEP 2 cita o comando `context:load`; o script `scripts/context-loader.mjs`, que a tabela de dependências já lista, entra nesse STEP por essa ligação explícita. Arquivo citado fora dessas âncoras fica transversal — não é empurrado para um STEP por chute.",
  );
  lines.push("");
  lines.push("Contagens, todas determinísticas, sem dependência externa:");
  lines.push("");
  lines.push("| Medida | Definição |");
  lines.push("| --- | --- |");
  lines.push("| Palavras | Sequências de não-espaço, o mesmo critério de `wc -w` |");
  lines.push("| Caracteres | Code points Unicode |");
  lines.push("| Bytes | UTF-8 |");
  lines.push("| Tokens aprox. | `ceil(bytes UTF-8 / 4)` |");
  lines.push("");
  lines.push(
    "`tokens aprox.` é heurística de tamanho de arquivo, não o tokenizador do Claude e não o consumo de uma run. Português e Markdown costumam tokenizar mais denso que 4 bytes por token; o número serve para comparar corpora, não para prever a fatura. Não copiá-lo para a coluna de tokens consumidos.",
  );
  lines.push("");
  lines.push(
    "O desenho atual não tem orquestrador que descarregue arquivo entre STEPs. O custo de instrução de uma run completa é o **teto eager** (a união), não a soma das linhas por STEP — essa soma contaria duas vezes o que serve a mais de um STEP.",
  );
  lines.push("");
  lines.push("## Números");
  lines.push("");
  lines.push("| Recorte | Arquivos | Palavras | Caracteres | Bytes UTF-8 | Tokens aprox. |");
  lines.push("| --- | ---: | ---: | ---: | ---: | ---: |");
  lines.push(totalRow("Teto eager (união)", result.files));
  lines.push(totalRow("Sem os dois arquivos exclusivos de canvas", withoutCanvas));
  lines.push(totalRow("Sempre carregados (constituição + comando + workflow)", always));
  lines.push(totalRow("Só `CLAUDE.md`", claudeOnly));
  lines.push("");
  lines.push(
    "O recorte sem canvas tira `docs/architecture.md` e `experiments/paper-mcp/smoke-test.md`. Interaction Design e o Context Loader continuam nele: estão na tabela de condicionais, mas o recorte só remove o que depende do canvas. Subtrair os outros dois seria decidir, sem execução, que uma run típica não os abre.",
  );
  lines.push("");
  lines.push(
    "Uma estimativa informal anterior falava em cerca de 28,5 mil palavras para o corpus inteiro. Este arquivo não reproduz essa conta: o teto eager, por `wc -w`, dá o número da tabela. A diferença cabe no critério de palavra e na fronteira do que entra (constituição, comando, workflow e cada arquivo que eles citam, inclusive arquitetura e o loader). A estimativa antiga não é medida e não substitui a tabela.",
  );
  lines.push("");
  lines.push("## Por arquivo");
  lines.push("");
  lines.push("| Arquivo | Palavras | Caracteres | Bytes | Tokens aprox. | STEPs | Condicional |");
  lines.push("| --- | ---: | ---: | ---: | ---: | --- | --- |");
  for (const file of byWords) {
    const steps = file.steps.length ? file.steps.join(", ") : file.role === "sempre carregado" ? "todos" : "transversal";
    const conditional = file.conditional ? "sim" : "não";
    lines.push(
      `| \`${file.path}\` | ${fmt(file.words)} | ${fmt(file.chars)} | ${fmt(file.bytes)} | ${fmt(file.tokensApprox)} | ${steps} | ${conditional} |`,
    );
  }
  lines.push("");
  lines.push("### Por que cada arquivo entrou");
  lines.push("");
  for (const file of byWords) {
    const steps = file.steps.length ? `STEPs ${file.steps.join(", ")}` : file.role;
    const conditional = file.conditional ? ` Condicional: ${file.conditional}.` : "";
    lines.push(`- \`${file.path}\` — ${steps}. ${file.why}.${conditional}`);
  }
  lines.push("");
  lines.push("## Por STEP");
  lines.push("");
  lines.push(
    "Subtotal atribuído = só os arquivos cuja âncora aponta para aquele STEP, sem os três sempre carregados. \"Com sempre carregados\" soma a constituição, o comando e o workflow, porque hoje eles permanecem no contexto. Arquivo em mais de um STEP aparece em cada um. Transversal não foi atribuído a STEP nenhum.",
  );
  lines.push("");
  lines.push("| STEP | Arquivos atribuídos | Palavras atribuídas | Palavras com sempre carregados | Algum condicional? |");
  lines.push("| --- | --- | ---: | ---: | --- |");

  const alwaysWords = sum(always, "words");
  for (let step = 0; step <= 10; step += 1) {
    const attributed = consulted.filter((file) => file.steps.includes(step));
    const names = attributed.map((file) => `\`${label(file.path)}\``).join(", ") || "—";
    const words = sum(attributed, "words");
    const anyConditional = attributed.some((file) => file.conditional) ? "sim" : "não";
    lines.push(
      `| ${step} ${stepLabel(step)} | ${names} | ${fmt(words)} | ${fmt(words + alwaysWords)} | ${anyConditional} |`,
    );
  }

  const transversal = consulted.filter((file) => file.steps.length === 0);
  lines.push("");
  if (transversal.length === 0) {
    lines.push("Nenhum arquivo consultado ficou transversal: todo caminho descoberto caiu em pelo menos um STEP.");
  } else {
    lines.push("Transversais (citados, sem STEP determinável):");
    lines.push("");
    for (const file of transversal) {
      lines.push(`- \`${file.path}\` — ${fmt(file.words)} palavras. ${file.why}.`);
    }
  }
  lines.push("");
  lines.push("## Condicionais");
  lines.push("");
  lines.push("| Arquivo | Condição | Palavras |");
  lines.push("| --- | --- | ---: |");
  for (const file of consulted.filter((item) => item.conditional)) {
    lines.push(`| \`${file.path}\` | ${file.conditional} | ${fmt(file.words)} |`);
  }
  lines.push("");
  lines.push("## Citados e deixados de fora");
  lines.push("");
  lines.push(
    "Caminhos em crase no comando ou no workflow que o método exclui de propósito. Não são zero: estão listados para a exclusão ser auditável.",
  );
  lines.push("");
  if (result.excluded.length === 0) {
    lines.push("Nenhum.");
  } else {
    for (const item of result.excluded) {
      lines.push(`- \`${item.path}\` — prefixo excluído (\`tests/\`, \`examples/\` ou \`benchmarks/\`). Visto em: ${item.why}.`);
    }
  }
  lines.push("");
  lines.push(
    "Também ficam de fora, por não serem instrução do review: memória de projeto, fixture do alvo, saída de tool do Paper e qualquer arquivo só alcançável por link de segundo nível (um skill que cita um standard que o workflow não cita). O tamanho desses insumos varia por run e não entra neste baseline.",
  );
  lines.push("");
  lines.push("## Métricas de runtime — não medidas");
  lines.push("");
  lines.push(
    "**Nenhum número abaixo foi coletado.** Preencher com estimativa, com o `tokens aprox.` deste arquivo, ou com memória de uma sessão antiga é invalidar o baseline. Célula sem medição fica `UNKNOWN`.",
  );
  lines.push("");
  lines.push(
    "O que este script mede é o tamanho estático dos arquivos de instrução. Tokens consumidos e latência só existem numa sessão real de Claude Code. Qualidade de saída só existe quando um avaliador aplica um protocolo que já está no repositório — não se cria escala nova aqui.",
  );
  lines.push("");
  lines.push("### Protocolo a reutilizar");
  lines.push("");
  lines.push(
    "Os harnesses abaixo já definem sessão nova, cegueira ao gabarito, conduta e registro append-only. A rodada de comparação do refactor usa esses protocolos como estão. O resultado, quando existir, vai para `benchmarks/review-workflow/results/` no formato que cada protocolo já pede — este diretório não ganha uma escala paralela.",
  );
  lines.push("");
  lines.push("| O quê | Onde | O que registrar |");
  lines.push("| --- | --- | --- |");
  lines.push("| Conduta e substância do review | `benchmarks/review-workflow/README.md` — RVW-001..005 | `PASS` / `PARTIAL` / `FAIL` pelo critério de lá |");
  lines.push("| Escopo, integração, adversarial | SCP-001..006, INT-A..F, ADV-A..G, nos arquivos que o README aponta | o mesmo `results/` |");
  lines.push("| Tese do produto | `benchmarks/review-workflow/differential-protocol.md` — DIF-001 | `UXCO` / `CONTROL` / `DRAW`, com DS e as contagens do protocolo |");
  lines.push("| Valor da camada adversarial | `benchmarks/review-workflow/adversarial-protocol.md` — ADV-001 | `SUPPORTED` / `INCONCLUSIVE` / `NOT SUPPORTED` |");
  lines.push("");
  lines.push(
    "Conjunto mínimo sugerido para a comparação futura contra este baseline, sem executar nada agora: RVW-002 e RVW-004 (memória presente, expectation já escrita), mais DIF-001 e ADV-001 nos braços que os protocolos já definem. RVW-003 exige Paper conectado no documento de teste; sem Paper, a célula fica `UNKNOWN`, não é pulada em silêncio nem substituída por fixture.",
  );
  lines.push("");
  lines.push(
    "Estado herdado, não medido nesta rodada: `benchmarks/review-workflow/results/` não tem execução de RVW, DIF ou ADV. Não existe baseline de qualidade anterior a este arquivo. Este snapshot não cria um.",
  );
  lines.push("");
  lines.push("### Como capturar tokens e latência, quando houver sessão");
  lines.push("");
  lines.push("1. Uma sessão nova por cenário, na raiz do repositório, no commit anotado. Um braço por sessão nos protocolos DIF e ADV.");
  lines.push("2. Anotar o relógio de parede no envio do comando e na entrega do Design Critique Report. Latência = essa diferença, em segundos. Sem relatório de uso visível, não estimar.");
  lines.push("3. Tokens de entrada e de saída: copiar o que a UI ou o log da sessão do Claude Code mostrar para aquela conversa. Se a UI não expuser o número, registrar `UNKNOWN — a sessão não expôs consumo de tokens`. Não derivar o número deste baseline.");
  lines.push("4. Commit, modelo e versão dos dois lados, quando o protocolo pedir isonomia.");
  lines.push("5. Desvio de protocolo declarado no registro. Sessão contaminada por expectation é inválida, como os protocolos já dizem.");
  lines.push("");
  lines.push("### Folha de registro — vazia");
  lines.push("");
  lines.push("Copiar para `benchmarks/review-workflow/results/` só depois de uma sessão real. Não preencher aqui.");
  lines.push("");
  lines.push("```text");
  lines.push("Run:            [RVW-00N | DIF-001 | ADV-001 | SCP | INT | ADV]");
  lines.push("Data:           [YYYY-MM-DD]");
  lines.push("Commit:         [hash]");
  lines.push("Modelo/versão:  [como a sessão identifica o modelo]");
  lines.push("Corpus:         baseline lean-harness (fingerprint deste arquivo) | posterior (anotar fingerprint novo)");
  lines.push("Latência (s):   UNKNOWN");
  lines.push("Tokens entrada: UNKNOWN");
  lines.push("Tokens saída:   UNKNOWN");
  lines.push("Fonte do token: [UI da sessão | UNKNOWN — não exposto]");
  lines.push("Qualidade:      [veredito do protocolo reutilizado, com o critério que decidiu]");
  lines.push("Desvios:        [nenhum | declarar]");
  lines.push("```");
  lines.push("");
  lines.push("| Run | Commit | Latência (s) | Tokens entrada | Tokens saída | Qualidade |");
  lines.push("| --- | --- | --- | --- | --- | --- |");
  lines.push("| RVW-002 | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |");
  lines.push("| RVW-004 | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |");
  lines.push("| DIF-001 | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |");
  lines.push("| ADV-001 | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |");
  lines.push("| RVW-003 (exige Paper) | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |");
  lines.push("");

  return `${lines.join("\n")}\n`;
}

function main() {
  const args = process.argv.slice(2);
  const writeFlag = args.indexOf("--write");
  const force = args.includes("--force");
  const result = measure();
  const markdown = render(result);

  if (writeFlag === -1) {
    process.stdout.write(markdown);
    return;
  }

  const outRel = args[writeFlag + 1];
  if (!outRel || outRel.startsWith("--")) {
    console.error("Usage: node scripts/measure-context.mjs [--write <arquivo.md> [--force]]");
    process.exit(1);
  }
  const outAbs = repoPath(outRel);
  if (existsSync(outAbs) && !force) {
    const current = readFileSync(outAbs, "utf8");
    const frozen = current.includes("<!-- snapshot: frozen -->");
    const same = current.includes(`<!-- corpus-fingerprint: ${result.fingerprint} -->`);
    if (frozen && !same) {
      console.error(
        `recusado: ${outRel} é um snapshot congelado e o corpus atual tem outro fingerprint. ` +
          "Sem --force este comando não reescreve o baseline.",
      );
      process.exit(1);
    }
  }
  mkdirSync(dirname(outAbs), { recursive: true });
  writeFileSync(outAbs, markdown);
  console.error(`escreveu ${outRel} (${totals(result.files).words} palavras no teto eager)`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}

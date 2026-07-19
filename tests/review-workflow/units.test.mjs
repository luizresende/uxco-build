// Testes UNITÁRIOS (DETERMINISTIC) dos componentes do Review Workflow — Sprint 4.
// Cada componente é testado como unidade de contrato: caso positivo (a conduta
// exigida está presente, consistente entre workflow, template, cenários e
// standards) e caso negativo (a conduta proibida está ausente). Complementa
// tests/review-workflow/contracts.test.mjs sem repetir seus asserts.
// A qualidade da execução do workflow segue sendo AGENT EVALUATION
// (benchmarks/review-workflow/) e não é fingida aqui como assert.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const read = (p) => readFileSync(join(root, p), 'utf8');

const WORKFLOW = 'workflows/uxco-review.md';
const COMMAND = '.claude/commands/uxco-review.md';
const SCENARIOS = 'tests/review-workflow/scope-scenarios.md';
const TEMPLATE = 'templates/reports/design-review.md';
const FRAMEWORK = 'standards/critique-framework.md';
const SEVERITY_STD = 'standards/severity-framework.md';

const SOURCE_TOKENS = ['explicit', 'selection', 'inferred'];
const TYPE_TOKENS = ['screen', 'frame', 'selection', 'frame-set', 'flow'];
const SEVERITY_TOKENS = ['Critical', 'High', 'Medium', 'Low', 'Opportunity'];
const ISSUE_FIELDS = ['Issue', 'Category', 'Severity', 'Confidence',
  'Evidence', 'User Impact', 'Recommendation'];

const section = (content, name) => content.split(name)[1]?.split('\n## ')[0] ?? '';

// ---------------------------------------------------------------- scope detection

test('unit: scope detection resolves each canonical case to canonical tokens', () => {
  const wf = read(WORKFLOW);
  const sc = read(SCENARIOS);
  const cases = wf.split('### Casos canônicos de detecção')[1]?.split('\n## ')[0];
  assert.ok(cases, 'missing detection cases');

  // positivo: cada caso resolve para a origem correta da escada de precedência
  const row = (n) => cases.split('\n').find((l) => l.trim().startsWith(`| ${n} `));
  assert.ok(row(1).includes('screen') && row(1).includes('Source: explicit'),
    'case 1 must resolve to explicit screen');
  assert.ok(row(2).includes('flow') && row(2).includes('Source: explicit'),
    'case 2 must resolve to explicit flow');
  assert.ok(row(3).includes('Source: selection'), 'case 3 must resolve to selection');
  assert.ok(row(4).includes('UNKNOWN') && row(5).includes('UNKNOWN'),
    'cases 4 and 5 must stay UNKNOWN');

  // positivo: os cenários comportamentais esperam exatamente esses tokens
  assert.ok(section(sc, '## SCP-001').includes('`Source: explicit`') &&
    section(sc, '## SCP-001').includes('`Type: screen`'),
    'SCP-001 must expect explicit screen');
  assert.ok(section(sc, '## SCP-002').includes('`Type: flow`'),
    'SCP-002 must expect a flow scope');
  assert.ok(section(sc, '## SCP-003').includes('`Source: selection`'),
    'SCP-003 must expect selection as source');

  // negativo: nenhum token de Source/Type fora do vocabulário canônico, em nenhum artefato
  for (const file of [WORKFLOW, TEMPLATE, SCENARIOS, COMMAND]) {
    const content = read(file);
    for (const [, token] of content.matchAll(/`Source: ([\w-]+)`/g)) {
      assert.ok(SOURCE_TOKENS.includes(token),
        `${file} uses non-canonical Source token: ${token}`);
    }
    for (const [, token] of content.matchAll(/`Type: ([\w-]+)`/g)) {
      assert.ok(TYPE_TOKENS.includes(token) || token === 'UNKNOWN',
        `${file} uses non-canonical Type token: ${token}`);
    }
  }

  // negativo: seleção divergente nunca substitui pedido explícito em silêncio
  assert.ok(wf.includes('Seleção ativa divergente não substitui o explícito'),
    'explicit scope must outrank a diverging selection');
  assert.ok(wf.includes('nunca resolvida em silêncio'),
    'request/selection divergence must never be resolved silently');
});

// ---------------------------------------------------------------- scope ambiguity

test('unit: scope ambiguity is signaled with candidates, never guessed — and single candidates are not ambiguity', () => {
  const wf = read(WORKFLOW);
  const sc = read(SCENARIOS);

  // positivo: ambiguidade real → candidatos listados + pergunta blocking, sem crítica
  const scp5 = section(sc, '## SCP-005');
  assert.ok(scp5.includes('Ambiguities') && scp5.includes('Blocking: Yes'),
    'SCP-005 must demand candidates plus a blocking question');
  assert.ok(scp5.includes('Failure Condition 2'),
    'guessing must be tied to the invalidating failure condition');
  const scp4 = section(sc, '## SCP-004');
  assert.ok(/[Nn]enhuma crítica é produzida/.test(scp4),
    'SCP-004 must forbid critique without an observable artifact');

  // negativo: escolher por palpite é conduta reprovada nos cenários
  assert.ok(/palpite/.test(scp4) && /palpite/.test(scp5),
    'guessing must appear as fail criteria in both ambiguity scenarios');
  assert.ok(scp5.includes('mesmo declarando a escolha depois'),
    'late disclosure must not legitimize a guessed scope');

  // negativo (fronteira): candidato único plausível não vira interrogatório
  assert.ok(wf.includes('Candidato único de confiança razoável não é ambiguidade'),
    'single reasonable candidate must proceed as declared inference');
  const scp6 = section(sc, '## SCP-006');
  assert.ok(/[Ii]nterrogatório/.test(scp6) && scp6.includes('anti-pattern 10'),
    'SCP-006 must fail unnecessary questioning on a single candidate');
});

// ------------------------------------------------------------ context integration

test('unit: context integration consumes the Brief without promoting, resolving, or inventing', () => {
  const wf = read(WORKFLOW);

  // positivo: gate do STEP 3 continua por padrão e reusa Brief/snapshot declaradamente
  assert.ok(wf.includes('por padrão, continuar mesmo assim'),
    'blocking questions must not halt observable layers by default');
  assert.ok(wf.includes('declarando a reutilização'),
    'reusing a same-scope Brief must be declared');
  assert.ok(wf.includes('sem releitura'),
    'canvas snapshot must feed the Brief without re-reading');

  // negativo: assumptions nunca promovidas, contradições nunca resolvidas, respostas nunca inventadas
  assert.ok(/nunca promovid/.test(wf), 'assumptions must never be promoted to fact');
  assert.ok(wf.includes('Nunca resolvida pelo review'),
    'contradictions must be returned to the user, never resolved');
  assert.ok(wf.includes('Inventar respostas nunca é saída'),
    'blocking answers must never be invented');
});

// ------------------------------------------------------------- issue normalization

test('unit: issue normalization uses exactly the seven canonical fields — no more, no fewer', () => {
  const wf = read(WORKFLOW);
  const fw = read(FRAMEWORK);

  // positivo: os 7 campos do bloco do workflow existem no contrato do standard
  const achado = fw.split('## Contrato do achado')[1]?.split('\n## ')[0];
  assert.ok(achado, 'missing finding contract in the framework');
  for (const f of ISSUE_FIELDS) {
    assert.ok(achado.includes(`${f}:`), `framework contract missing field: ${f}`);
  }

  // negativo: o bloco do workflow não adiciona nem omite campo algum
  const block = section(wf, '## Issue Model').split('```text')[1]?.split('```')[0];
  assert.ok(block, 'missing issue block');
  const labels = [...block.matchAll(/^([A-Z][A-Za-z ]+):/gm)].map(([, l]) => l);
  assert.deepEqual(labels, ISSUE_FIELDS,
    'issue block must carry exactly the seven canonical fields, in order');

  // negativo: nenhum campo paralelo de priorização fora do contrato
  for (const banned of ['Priority:', 'Effort:', 'Score:']) {
    assert.ok(!wf.includes(banned) && !read(TEMPLATE).includes(banned),
      `non-canonical issue field in use: ${banned}`);
  }
});

// --------------------------------------------------------- severity classification

test('unit: severity classification defers to the framework scale, floors, and downward tie-break', () => {
  const wf = read(WORKFLOW);
  const std = read(SEVERITY_STD);

  // positivo: pisos idênticos nas duas pontas e desempate para baixo no standard
  assert.ok(std.includes('piso `High`') && std.includes('`Critical`'),
    'severity standard must carry the accessibility floors');
  assert.ok(wf.includes('nunca abaixo de `High`') && wf.includes('excludente → `Critical`'),
    'workflow must restate the inviolable floors');
  assert.ok(std.includes('escolher o **menor**'),
    'standard tie-break must go to the lower level');

  // positivo: tokens canônicos consistentes em todos os artefatos que os declaram
  for (const file of [WORKFLOW, TEMPLATE]) {
    assert.ok(read(file).includes('Critical | High | Medium | Low | Opportunity'),
      `${file} must declare the exact canonical severity scale`);
  }

  // negativo: nenhum vocabulário concorrente de severidade em artefato algum da sprint
  const banned = /\b(Major|Minor|Trivial|Blocker-level|P[0-4])\b/;
  for (const file of [WORKFLOW, COMMAND, TEMPLATE, SCENARIOS]) {
    assert.ok(!banned.test(read(file)), `${file} uses competing severity vocabulary`);
  }
  // negativo: severidade nunca numérica
  assert.ok(!/Severity:\s*\[?\d/.test(wf + read(TEMPLATE)),
    'severity must never be numeric');
});

// ------------------------------------------------------- confidence classification

test('unit: confidence classification is qualitative, defined per level, and repairs itself via validation', () => {
  const wf = read(WORKFLOW);
  const t = read(TEMPLATE);

  // positivo: os três níveis definidos operacionalmente no workflow
  assert.ok(wf.includes('`High` = evidência direta'),
    'High confidence must require direct evidence');
  assert.ok(wf.includes('`Low` = hipótese'),
    'Low confidence must be named as hypothesis');
  assert.ok(wf.includes('a validação necessária vai na Recommendation'),
    'Low confidence must route validation into the recommendation');

  // negativo: confiança nunca numérica nem percentual
  assert.ok(!/Confidence:\s*\[?\d/.test(wf + t) && !/\d+\s*%\s*(de\s+)?[Cc]onfian/.test(wf + t),
    'confidence must never be numeric or percentage-based');
  // negativo: Source inferida nunca nasce com confiança alta sem base
  assert.ok(wf.includes('nunca nasce `High` sem base declarada'),
    'inferred scope must not start at High confidence without declared basis');
});

// ----------------------------------------------------------------- deduplication

test('unit: deduplication yields one finding per problem, keeping the strongest evidence', () => {
  const wf = read(WORKFLOW);
  const cons = wf.split('### Consolidação')[1]?.split('\n## ')[0];
  assert.ok(cons, 'missing consolidation stage');

  // positivo: agrupamento pela causa com manifestações listadas
  assert.ok(cons.includes('camada causal'), 'grouping must land on the causal layer');
  assert.ok(cons.includes('manifestações listadas'),
    'grouped findings must list their manifestations');
  assert.ok(cons.includes('`Low` agregados') || cons.includes('**`Low` agregados:**'),
    'non-actionable Lows must be aggregated');

  // negativo: duplicata é falha nomeada; extensão comportamental nunca duplica bloco
  assert.ok(cons.includes('falha de consolidação'),
    'duplicated issues must be named a consolidation failure');
  assert.ok(cons.includes('nunca N blocos repetidos'),
    'repeated blocks per screen must be forbidden');
  assert.ok(cons.includes('nunca justificam um segundo bloco'),
    'behavioral extension fields must never justify a second block');
  assert.ok(cons.includes('a mais fraca complementa, nunca substitui'),
    'weaker evidence must never replace the strongest');
});

// -------------------------------------------------------- sorting / prioritization

test('unit: prioritization orders by severity then impact → confidence → reach, opportunities apart', () => {
  const wf = read(WORKFLOW);
  const t = read(TEMPLATE);

  // positivo: a cadeia completa de ordenação nos dois artefatos
  assert.ok(wf.includes('severidade primeiro (`Critical` → `Low`)'),
    'workflow must order by severity first');
  assert.ok(t.includes('impacto → confiança → alcance'),
    'template must restate the tie-break chain');
  assert.ok(wf.includes('`Opportunity` sempre separada, ao final'),
    'opportunities must close the list, apart from defects');

  // positivo: os subtítulos do template seguem a ordem canônica de severidade
  const issues = t.split('## Issues')[1]?.split('## Patterns Detected')[0];
  assert.ok(issues, 'template missing Issues section');
  let last = -1;
  for (const s of ['### Critical', '### High', '### Medium', '### Low']) {
    const i = issues.indexOf(s);
    assert.ok(i !== -1, `template missing severity subtitle: ${s}`);
    assert.ok(i > last, `severity subtitle out of order: ${s}`);
    last = i;
  }

  // negativo: Opportunity nunca dentro de Issues nem em contagem de defeitos
  assert.ok(!issues.includes('Opportunit'),
    'opportunities must not live inside the Issues section');
  assert.ok(wf.includes('nunca em contagem de defeitos'),
    'opportunities must never count as defects');
});

// --------------------------------------------------------------- report formatting

test('unit: report template mirrors the official contract sections exactly, in order, with no parallel sections', () => {
  const t = read(TEMPLATE);
  const fw = read(FRAMEWORK);
  const official = ['Executive Summary', 'Issues', 'Patterns Detected', 'Opportunities',
    'Unknowns and Assumptions', 'Layer Coverage', 'Quality Gate', 'Recommended Next Steps'];

  // positivo: o contrato oficial declara as mesmas seções, na mesma ordem
  const contract = fw.split('## Contrato do report')[1];
  assert.ok(contract, 'framework missing report contract');
  let last = -1;
  for (const s of official) {
    const i = contract.indexOf(`## ${s}`);
    assert.ok(i !== -1, `framework contract missing section: ${s}`);
    assert.ok(i > last, `framework contract section out of order: ${s}`);
    last = i;
  }

  // positivo + negativo: o esqueleto do template = exatamente essas seções, nessa ordem
  const skeleton = t.split('\n---\n')[1];
  assert.ok(skeleton, 'template missing the fill-in skeleton');
  const headings = [...skeleton.matchAll(/^## (.+)$/gm)].map(([, h]) => h.trim());
  assert.deepEqual(headings, official,
    'template skeleton must mirror the official sections exactly — no parallel sections');

  // positivo: cobertura completa L0–L8 com os três status canônicos
  const coverage = skeleton.split('## Layer Coverage')[1]?.split('\n## ')[0];
  for (const l of ['L0:', 'L1:', 'L2:', 'L3:', 'L4:', 'L5:', 'L6:', 'L7:', 'L8:']) {
    assert.ok(coverage.includes(l), `coverage block missing layer: ${l}`);
  }
  for (const status of ['evaluated', 'not-evaluable', 'out-of-scope']) {
    assert.ok(coverage.includes(status), `coverage block missing status: ${status}`);
  }

  // negativo: nível de severidade vazio não gera subtítulo vazio (regra de ausência)
  assert.ok(t.includes('nível vazio não gera subtítulo vazio'),
    'empty severity levels must not produce empty headings');
  assert.ok(t.includes('seção de uma linha é seção válida'),
    'proportionality must legitimize one-line sections');
});

// ---------------------------------------------------------------- failure handling

test('unit: each failure mode binds to its resolving mechanism, and the blocked output is unique', () => {
  const wf = read(WORKFLOW);
  const fh = section(wf, '## Failure Handling');
  assert.ok(fh, 'missing Failure Handling section');

  // positivo: cada falha aponta o mecanismo que a resolve — nada é redefinido
  assert.ok(fh.includes('Safety Model, regra 2') && fh.includes('npm run preflight'),
    'Falha 1 must bind to the Safety Model rule and the correction action');
  assert.ok(fh.includes('Caso 4 da Scope Resolution'),
    'Falha 2 must bind to the canonical detection case');
  assert.ok(fh.includes('Failure Condition 4'),
    'Falha 3 must bind silent continuation to the invalidating condition');
  assert.ok(fh.includes('anti-pattern 10'),
    'Falha 4 must name undue blocking as the anti-pattern');
  assert.ok(fh.includes('§9.3') && fh.includes('Preconditions'),
    'Falha 5 must bind to the no-simulation rule and the declared loader exception');
  assert.ok(fh.includes('Paper Inspection') && fh.includes('sobem às Review Limitations'),
    'Falha 6 must bind to the inspection contract and surface limitations in the report');

  // positivo: falha de execução ≠ condição de invalidade — a distinção é explícita
  assert.ok(fh.includes('não são condições de invalidade'),
    'failure handling must be distinguished from failure conditions');

  // negativo: a mensagem canônica de bloqueio existe uma única vez, sem variantes
  assert.equal((wf.match(/Review blocked:/g) ?? []).length, 1,
    'the canonical blocked message must appear exactly once');
  assert.ok(!/Review blocked[^:]/.test(wf),
    'no variant of the blocked message may exist');
  // negativo: nenhum modo de falha autoriza compensação por invenção
  for (const forbidden of ['preencher o snapshot mesmo assim', 'assumir conexão']) {
    assert.ok(!fh.includes(forbidden), `failure handling must not allow: ${forbidden}`);
  }
});

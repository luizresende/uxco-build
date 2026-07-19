// Testes de INTEGRAÇÃO (DETERMINISTIC) do Review Workflow — Sprint 4.
// Representam o workflow completo sem Paper real: as fixtures textuais fazem o
// papel do artefato observável (mock do canvas) e a memória demo faz o papel
// da memória de projeto. O que é executável de verdade (Context Loader, o
// estágio mecânico do STEP 2) roda de verdade; a conduta do agente nos
// cenários INT-A..INT-F é AGENT EVALUATION (integration-scenarios.md +
// benchmarks/review-workflow/) — aqui valida-se que cada cenário, fixture e
// expectation existe, está íntegro e amarrado ao mecanismo certo do workflow.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContext, MEMORY_FILES } from '../../scripts/context-loader.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const exists = (p) => existsSync(join(root, p));
const read = (p) => readFileSync(join(root, p), 'utf8');

const WORKFLOW = 'workflows/uxco-review.md';
const SCENARIOS = 'tests/review-workflow/integration-scenarios.md';
const HARNESS = 'benchmarks/review-workflow/README.md';
const FIXTURES_README = 'examples/review-tests/README.md';
const DEMO_MEMORY = 'examples/demo-project';
const FIXTURE_FLOW = 'examples/review-tests/01-pulse-signal-capture/fixture.md';
const FIXTURE_SCREEN = 'examples/review-tests/02-pulse-new-item/fixture.md';
const EXPECTATION_SCREEN = 'benchmarks/review-workflow/expectations/02-pulse-new-item.md';

const SCENARIO_IDS = ['INT-A', 'INT-B', 'INT-C', 'INT-D', 'INT-E', 'INT-F'];
const SCENARIO_SECTIONS = ['### User Request', '### Context Available',
  '### Expected Behavior', '### Must Do', '### Must Not Do',
  '### Pass Criteria', '### Fail Criteria'];

const scenario = (id) => read(SCENARIOS).split(`## ${id}`)[1]?.split('\n## ')[0] ?? '';
// fixtures descrevem fatos; avaliação pertence às expectations e ao review
const EVALUATIVE = /\b(problema|deveria|ruim|confuso|issue|melhorar)\b/i;

test('integration: artifacts exist and are wired into the harness and fixture catalog', () => {
  for (const p of [SCENARIOS, FIXTURE_SCREEN, EXPECTATION_SCREEN]) {
    assert.ok(exists(p), `missing integration artifact: ${p}`);
  }
  // positivo: harness e catálogo conhecem os artefatos novos — nada órfão
  const harness = read(HARNESS);
  assert.ok(harness.includes('integration-scenarios.md'),
    'harness must list the integration scenarios');
  assert.ok(harness.includes(FIXTURE_SCREEN),
    'harness must carry the single-screen scenario target');
  assert.ok(read(FIXTURES_README).includes('02-pulse-new-item/'),
    'fixture catalog must list the new fixture');
  // positivo: os cenários operam sobre o workflow real e registram no results do harness
  const sc = read(SCENARIOS);
  assert.ok(sc.includes(WORKFLOW), 'scenarios must reference the workflow');
  assert.ok(sc.includes('benchmarks/review-workflow/results/'),
    'runs must land in the shared append-only results');
  // negativo: sem Paper real — o cenário com canvas permanece no RVW-003
  assert.ok(sc.includes('sem depender de um Paper real') && sc.includes('RVW-003'),
    'scenarios must run without a real Paper, deferring canvas conduct to RVW-003');
});

test('integration: the demo memory behind the fixtures loads through the real loader', () => {
  // o estágio mecânico do STEP 2 executado de verdade, sobre a memória real
  const result = loadContext(join(root, DEMO_MEMORY));
  assert.equal(result.sources.length, MEMORY_FILES.length,
    'loader must inventory exactly the known memory files');
  const byFile = Object.fromEntries(result.sources.map((s) => [s.file, s]));
  for (const s of result.sources) {
    assert.notEqual(s.status, 'missing', `${s.file} must exist in the demo memory`);
  }
  // as fontes de que os achados semeados dependem carregam com conteúdo real
  for (const file of ['glossary.md', 'decisions.md', 'product.md']) {
    assert.equal(byFile[file].status, 'loaded', `${file} must load`);
    assert.ok(byFile[file].content.length > 0, `${file} must carry content`);
  }
  // negativo: o glossário realmente sustenta o achado de vocabulário das fixtures
  assert.ok(byFile['glossary.md'].content.includes('Feedback Item') &&
    byFile['glossary.md'].content.includes('"feedback bruto"'),
    'glossary must ground the seeded vocabulary finding');
});

test('integration: scenarios INT-A..INT-F are complete, ordered, and reference only real fixtures', () => {
  const sc = read(SCENARIOS);
  let last = -1;
  for (const id of SCENARIO_IDS) {
    const i = sc.indexOf(`## ${id}`);
    assert.ok(i !== -1, `missing scenario: ${id}`);
    assert.ok(i > last, `scenario out of order: ${id}`);
    last = i;
    for (const s of SCENARIO_SECTIONS) {
      assert.ok(scenario(id).includes(s), `${id} missing section: ${s}`);
    }
  }
  // toda fixture citada existe — cenário nunca aponta para artefato fantasma
  const refs = [...sc.matchAll(/`?(examples\/[\w./-]+fixture\.md)`?/g)].map(([, p]) => p);
  assert.ok(refs.length > 0, 'scenarios must reference fixtures');
  for (const ref of refs) assert.ok(exists(ref), `scenario references missing fixture: ${ref}`);
});

test('integration: INT-A drives scope → context → structured issues → ordering → report on a factual single-screen fixture', () => {
  const a = scenario('INT-A');
  // positivo: os cinco resultados exigidos do Teste A, na conduta
  assert.ok(a.includes('`Type: screen`') && a.includes('`Source: explicit`'),
    'INT-A must identify the scope');
  assert.ok(a.includes('STEP 2 antes do STEP 4'), 'INT-A must load context before critique');
  assert.ok(a.includes('contrato de 7 campos'), 'INT-A must demand structured issues');
  assert.ok(a.includes('High antes de Medium'), 'INT-A must demand correct ordering');
  assert.ok(a.includes('Quality Gate'), 'INT-A must demand the full report');
  assert.ok(a.includes(EXPECTATION_SCREEN), 'INT-A must bind to its expectation');

  // a fixture é de tela única, com memória, e semeia os três achados + opportunity
  const fx = read(FIXTURE_SCREEN);
  assert.equal((fx.match(/^## Tela/gm) ?? []).length, 1,
    'single-screen fixture must describe exactly one screen');
  assert.ok(fx.includes('examples/demo-project/'), 'fixture must point to the demo memory');
  assert.ok(fx.includes('desaparece assim que o usuário começa a digitar'),
    'missing seeded L7 problem (vanishing labels)');
  assert.ok(fx.includes('sem indicador de progresso'),
    'missing seeded L3 problem (no save feedback)');
  assert.ok(fx.includes('feedback bruto') || fx.includes('feedbacks brutos'),
    'missing seeded L4 problem (glossary violation)');
  assert.ok(fx.includes('verificação de duplicidade não existe'),
    'missing seeded opportunity hook (duplicate suggestion)');

  // negativo: fixtures são factuais — nenhum vocabulário avaliativo embutido
  for (const file of [FIXTURE_SCREEN, FIXTURE_FLOW]) {
    assert.ok(!EVALUATIVE.test(read(file)),
      `${file} must describe facts, never embed evaluation`);
  }
});

test('integration: INT-B requires the automatic interaction design routing for a multi-screen flow', () => {
  const b = scenario('INT-B');
  // positivo: fluxo multi-tela aciona a skill pelo regime automático do Roteamento
  assert.ok(b.includes('`Type: flow`'), 'INT-B must target a flow scope');
  assert.ok(b.includes('Interaction Design') && b.includes('automático'),
    'INT-B must demand the automatic routing regime');
  assert.ok(b.includes('Roteamento'), 'INT-B must bind to the workflow routing contract');
  assert.ok((read(FIXTURE_FLOW).match(/^## Tela/gm) ?? []).length >= 2,
    'flow fixture must describe multiple screens');
  // negativo: não acionar com escopo de fluxo é conduta reprovada
  assert.ok(b.includes('não acionada') || b.includes('ignorado'),
    'INT-B must fail a run that skips the routing');
  assert.ok(b.includes('telas soltas'),
    'INT-B must forbid treating the flow as isolated screens');
});

test('integration: INT-C continues under incomplete context with lowered confidence, never blocking unduly', () => {
  const c = scenario('INT-C');
  // positivo: continuar é o comportamento — Brief honesto e Confidence rebaixada
  assert.ok(c.includes('continua'), 'INT-C must continue the review');
  assert.ok(c.includes('`MISSING`'), 'INT-C must demand the honest Brief');
  assert.ok(c.includes('rebaixada'), 'INT-C must demand explicit confidence reduction');
  assert.ok(c.includes('`ASSUMPTION`'), 'INT-C must register adopted premises');
  assert.ok(c.includes('Falha 3'), 'INT-C must bind to the failure handling mode');
  // negativo: nem bloqueio indevido, nem invenção, nem confiança intacta
  assert.ok(c.includes('anti-pattern 10'), 'undue blocking must be named as failure');
  assert.ok(c.includes('Inventar respostas') || c.includes('inventado'),
    'inventing context must be forbidden');
  assert.ok(c.includes('Confidence alta'),
    'unreduced confidence on affected conclusions must be a fail criteria');
});

test('integration: INT-D never fakes scope identification under ambiguity', () => {
  const d = scenario('INT-D');
  // positivo: ambiguidade sinalizada com candidatos e pergunta blocking
  assert.ok(d.includes('`UNKNOWN`'), 'INT-D must emit the unresolved scope state');
  assert.ok(d.includes('Blocking: Yes'), 'INT-D must demand the blocking question');
  assert.ok(d.includes('dois candidatos') || d.includes('dois artefatos'),
    'INT-D must name the competing candidates');
  assert.ok(d.includes('não finge'), 'INT-D must forbid pretending the scope was identified');
  // negativo: nenhum estágio posterior roda para alvo adivinhado
  assert.ok(d.includes('sem Brief') || d.includes('nenhum Brief'),
    'no Brief may be built for a guessed target');
  assert.ok(d.includes('Failure Condition 2'),
    'guessing must be tied to the invalidating condition');
  assert.ok(d.includes('mesmo declarando a escolha depois'),
    'late disclosure must not legitimize a guessed scope');
});

test('integration: INT-E consolidates the same problem seen by both skills into one issue', () => {
  const e = scenario('INT-E');
  // positivo: uma issue consolidada na camada causal, evidência mais forte primeiro
  assert.ok(e.includes('uma issue consolidada') || e.includes('um único achado'),
    'INT-E must demand a single consolidated issue');
  assert.ok(e.includes('camada causal'), 'consolidation must land on the causal layer');
  assert.ok(e.includes('evidência mais forte'), 'strongest evidence must lead the block');
  assert.ok(e.includes('duas') && e.includes('skills'),
    'the duplicate must originate from both skills');
  // negativo: dois blocos para o mesmo problema é falha, não rigor
  assert.ok(e.includes('dois blocos'), 'two blocks for one problem must be a fail criteria');
  assert.ok(e.includes('inflada') || e.includes('inflar'),
    'inflated counts must be forbidden');
});

test('integration: INT-F keeps the report valid with zero critical issues', () => {
  const f = scenario('INT-F');
  // positivo: validade sem achado grave — ausência declarada, gate presente
  assert.ok(f.includes('continua válido'), 'INT-F must assert report validity');
  assert.ok(f.includes('nenhuma issue Critical') || f.includes('Nenhuma issue Critical'),
    'the zero-critical count must be declared, not hidden');
  assert.ok(f.includes('subtítulo') && f.includes('vazio'),
    'empty Critical subtitles must be ruled out');
  assert.ok(f.includes('Quality Gate'), 'the gate must remain present');
  // negativo: nenhum Critical fabricado para dar peso ao rito
  assert.ok(f.includes('inflacionar') || f.includes('inflação'),
    'severity inflation must be a named failure');

  // o gabarito sustenta o cenário: exatamente 3 Essential, nenhum deles Critical
  const ex = read(EXPECTATION_SCREEN);
  for (const s of ['## Essential', '## Acceptable', '## False positives', '## Calibração']) {
    assert.ok(ex.includes(s), `expectation missing section: ${s}`);
  }
  assert.ok(ex.includes(FIXTURE_SCREEN), 'expectation must reference its fixture');
  const essential = ex.split('## Essential')[1].split('\n## ')[0];
  const rows = essential.split('\n').filter(
    (l) => l.trim().startsWith('|') && !/---|Problema|Camada/.test(l)
  );
  assert.equal(rows.length, 3, 'Test A/F fixture must seed exactly 3 known problems');
  assert.ok(!/\bCritical\b/.test(essential),
    'no seeded problem may be Critical — that is the point of INT-F');
  assert.ok(ex.includes('Oportunidade') && ex.includes('exatamente uma'),
    'the expectation must seed exactly one opportunity');
});

test('integration: no broken repo references in the integration artifacts', () => {
  const refRe = /`((?:standards|skills|scripts|examples|benchmarks|templates|tests|docs|workflows|experiments)\/[^`]*?\.(?:md|mjs))`/g;
  for (const file of [SCENARIOS, FIXTURE_SCREEN, EXPECTATION_SCREEN, HARNESS, FIXTURES_README]) {
    for (const match of read(file).matchAll(refRe)) {
      const ref = match[1];
      if (/YYYY|[<>*]/.test(ref)) continue; // placeholders
      assert.ok(exists(ref), `${file} references missing path: ${ref}`);
    }
  }
});

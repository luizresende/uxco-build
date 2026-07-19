// Testes DETERMINISTIC do Review Workflow (Sprint 4): contratos e invariantes
// verificáveis — existência, seções obrigatórias, integridade de referências,
// tokens canônicos e o encadeamento declarado com os engines existentes.
// A qualidade da execução do workflow é AGENT EVALUATION
// (benchmarks/review-workflow/) e não é fingida aqui como assert.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const exists = (p) => existsSync(join(root, p));
const read = (p) => readFileSync(join(root, p), 'utf8');

const WORKFLOW = 'workflows/uxco-review.md';
const COMMAND = '.claude/commands/uxco-review.md';
const SCENARIOS = 'tests/review-workflow/scope-scenarios.md';
const TEMPLATE = 'templates/reports/design-review.md';
const FIXTURE = 'examples/review-tests/01-pulse-signal-capture/fixture.md';
const EXPECTATION = 'benchmarks/review-workflow/expectations/01-pulse-signal-capture.md';

const SEVERITIES = ['Critical', 'High', 'Medium', 'Low', 'Opportunity'];

test('required sprint 4 files exist', () => {
  const required = [
    WORKFLOW,
    COMMAND,
    SCENARIOS,
    'examples/review-tests/README.md',
    FIXTURE,
    'benchmarks/review-workflow/README.md',
    EXPECTATION,
    'benchmarks/review-workflow/results',
  ];
  for (const p of required) assert.ok(exists(p), `missing: ${p}`);
});

test('workflow has all mandatory sections', () => {
  const wf = read(WORKFLOW);
  const sections = [
    '## Purpose', '## Trigger', '## Inputs', '## Preconditions',
    '## Scope Resolution', '## Context Integration', '## Paper Inspection',
    '## Critique Orchestration', '## Issue Model', '## Safety Model',
    '## Skill Dependencies', '## Process', '## Output',
    '## Completion Criteria', '## Failure Conditions', '## Quality Checklist',
  ];
  for (const s of sections) assert.ok(wf.includes(s), `missing section: ${s}`);
});

test('workflow defines the eight steps in order', () => {
  const wf = read(WORKFLOW);
  const process = wf.split('## Process')[1];
  assert.ok(process, 'missing Process section');
  const steps = ['STEP 0', 'STEP 1', 'STEP 2', 'STEP 3', 'STEP 4', 'STEP 5', 'STEP 6', 'STEP 7'];
  let last = -1;
  for (const s of steps) {
    const i = process.indexOf(s);
    assert.ok(i !== -1, `missing step: ${s}`);
    assert.ok(i > last, `step out of order: ${s}`);
    last = i;
  }
});

test('workflow defines the scope resolution contract', () => {
  const wf = read(WORKFLOW);
  const sr = wf.split('## Scope Resolution')[1]?.split('\n## ')[0];
  assert.ok(sr, 'missing Scope Resolution section');
  // as cinco unidades de escopo aceitas
  for (const unit of ['uma tela', 'um frame', 'uma seleção', 'um conjunto de frames', 'um fluxo']) {
    assert.ok(sr.includes(unit), `missing scope unit: ${unit}`);
  }
  // ordem de precedência: explícito → seleção → contexto → ambiguidade
  const ladder = ['Escopo explícito do usuário', 'Seleção ativa no Paper',
    'contexto disponível', 'Ambiguidade'];
  let last = -1;
  for (const rung of ladder) {
    const i = sr.indexOf(rung);
    assert.ok(i !== -1, `missing resolution rung: ${rung}`);
    assert.ok(i > last, `resolution order broken at: ${rung}`);
    last = i;
  }
  assert.ok(/nunca inventar|nunca é saída/i.test(sr), 'must forbid inventing scope');
});

test('workflow formalizes the auditable scope block', () => {
  const wf = read(WORKFLOW);
  const block = wf.split('### Scope block')[1]?.split('\n### ')[0];
  assert.ok(block, 'missing Scope block subsection');
  for (const f of ['Type:', 'Name:', 'Source:', 'Includes:', 'Confidence:', 'Ambiguities:']) {
    assert.ok(block.includes(f), `scope block missing field: ${f}`);
  }
  // tokens canônicos de Type e Source
  assert.ok(block.includes('screen | frame | selection | frame-set | flow'),
    'missing canonical Type tokens');
  assert.ok(block.includes('explicit | selection | inferred'),
    'missing canonical Source tokens');
  // escopo não resolvido é representado, nunca escondido
  assert.ok(block.includes('UNKNOWN'), 'unresolved scope must be representable');
});

test('workflow maps the five canonical detection cases with behavioral scenarios', () => {
  const wf = read(WORKFLOW);
  const cases = wf.split('### Casos canônicos de detecção')[1]?.split('\n## ')[0];
  assert.ok(cases, 'missing detection cases subsection');
  const rows = cases.split('\n').filter(
    (l) => l.trim().startsWith('|') && !/---|Caso \|/.test(l) && !/\| Caso /.test(l)
  );
  assert.equal(rows.length, 5, `expected 5 case rows, got ${rows.length}`);
  assert.ok(cases.includes(SCENARIOS.replace('tests/review-workflow/', '')) ||
    wf.includes(SCENARIOS), 'cases must point to the behavioral scenarios');

  const sc = read(SCENARIOS);
  for (const id of ['SCP-001', 'SCP-002', 'SCP-003', 'SCP-004', 'SCP-005']) {
    const section = sc.split(`## ${id}`)[1]?.split('\n## ')[0];
    assert.ok(section, `missing scenario: ${id}`);
    for (const s of ['### User Request', '### Context Available', '### Expected Behavior',
      '### Must Do', '### Must Not Do', '### Pass Criteria', '### Fail Criteria']) {
      assert.ok(section.includes(s), `${id} missing section: ${s}`);
    }
  }
  assert.ok(sc.includes('workflows/uxco-review.md'), 'scenarios must reference the workflow');
});

test('workflow orchestrates the existing engines by reference, not copies', () => {
  const wf = read(WORKFLOW);
  const refs = [
    'skills/product-context/SKILL.md',
    'skills/design-critique/SKILL.md',
    'skills/interaction-design/SKILL.md',
    'standards/product-context-brief.md',
    'standards/critique-framework.md',
    'standards/quality-framework.md',
    'standards/severity-framework.md',
  ];
  for (const r of refs) assert.ok(wf.includes(r), `missing reference: ${r}`);
  // não redefine as camadas nem o contrato do achado — apenas os consome
  assert.ok(!/\|\s*\*\*L\d — /.test(wf), 'workflow must not redefine the L0-L8 layer table');
});

test('workflow integrates the context engine without replicating it', () => {
  const wf = read(WORKFLOW);
  const ci = wf.split('## Context Integration')[1]?.split('\n## ')[0];
  assert.ok(ci, 'missing Context Integration section');
  // pipeline reutiliza a infraestrutura da Sprint 2, na ordem (diagrama)
  const diagram = ci.split('```text')[1]?.split('```')[0];
  assert.ok(diagram, 'missing pipeline diagram');
  const pipeline = ['Scope Detection', 'Context Loader', 'Product Context Skill',
    'Product Context Brief'];
  let last = -1;
  for (const stage of pipeline) {
    const i = diagram.indexOf(stage);
    assert.ok(i !== -1, `pipeline missing stage: ${stage}`);
    assert.ok(i > last, `pipeline order broken at: ${stage}`);
    last = i;
  }
  assert.ok(ci.includes('context:load'), 'must reuse the executable loader');
  assert.ok(ci.includes('não replica'), 'must declare no replication of the skill logic');
  // consome as cinco categorias do Brief, sem redefini-las
  for (const cat of ['CONFIRMED', 'EVIDENCE', 'ASSUMPTION', 'UNKNOWN', 'CONTRADICTION']) {
    assert.ok(ci.includes(`\`${cat}\``), `missing consumed category: ${cat}`);
  }
  // blocking vs non-blocking + política de bloqueio (só quando enganosa)
  assert.ok(ci.includes('blocking unknowns') && ci.includes('non-blocking unknowns'),
    'must distinguish blocking from non-blocking unknowns');
  assert.ok(ci.includes('potencialmente enganosa'),
    'blocking policy must be limited to potentially misleading analysis');
});

test('workflow defines read-only paper inspection with an auditable snapshot', () => {
  const wf = read(WORKFLOW);
  const pi = wf.split('## Paper Inspection')[1]?.split('\n## ')[0];
  assert.ok(pi, 'missing Paper Inspection section');
  assert.ok(pi.includes('`READ`') && pi.includes('PAPER_READY'),
    'inspection must be READ-only under PAPER_READY');
  assert.ok(pi.includes('experiments/paper-mcp/smoke-test.md'),
    'capabilities must be grounded in the validated smoke test');
  assert.ok(pi.includes('jamais é inventado'), 'must forbid inventing unreturned data');
  const block = pi.split('```text')[1]?.split('```')[0];
  assert.ok(block, 'missing Canvas Snapshot block');
  for (const f of ['Document:', 'Captured:', 'Method:', 'Frames:', 'Hierarchy:',
    'Texts:', 'Properties:', 'Sequence:', 'Patterns:', 'States:', 'Limitations:']) {
    assert.ok(block.includes(f), `snapshot missing field: ${f}`);
  }
  assert.ok(block.includes('nunca omitido'), 'Limitations must be mandatory in the block');
});

test('workflow gates every critique layer on available evidence', () => {
  const wf = read(WORKFLOW);
  const co = wf.split('## Critique Orchestration')[1]?.split('\n## ')[0];
  assert.ok(co, 'missing Critique Orchestration section');
  // as nove camadas nomeadas por referência ao framework (sem redefinir a tabela)
  for (const l of ['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8']) {
    assert.ok(co.includes(l), `missing layer: ${l}`);
  }
  assert.ok(co.includes('critique-framework.md'), 'layers must be sourced from the framework');
  // not enough evidence > falsa precisão, com o token canônico de cobertura
  assert.ok(co.includes('not enough evidence'), 'must name the not-enough-evidence preference');
  assert.ok(co.includes('not-evaluable'), 'must map to the canonical coverage token');
  assert.ok(/[Ff]alsa precisão/.test(co), 'must forbid false precision');
  // exemplo canônico: contraste não inventado sem dados visuais confiáveis
  assert.ok(/[Cc]ontraste/.test(co) && co.includes('accessibility-baseline.md'),
    'must carry the contrast example grounded in the baseline');
  // as duas direções: nem achado fabricado, nem camada não verificada aprovada
  assert.ok(/duas direções/.test(co), 'false precision must be forbidden in both directions');
});

test('workflow routes interaction design and consolidates findings without duplication', () => {
  const wf = read(WORKFLOW);
  const co = wf.split('## Critique Orchestration')[1]?.split('\n## ')[0];
  const routing = co?.split('### Roteamento da Interaction Design')[1]?.split('\n### ')[0];
  assert.ok(routing, 'missing Interaction Design routing subsection');
  // gatilhos automáticos por escopo
  for (const t of ['flow', 'multi-tela', 'sequência de interação']) {
    assert.ok(routing.includes(t), `missing routing trigger: ${t}`);
  }
  // as doze dimensões comportamentais, por referência ao método da skill
  for (const d of ['sequência', 'continuidade', 'feedback', 'estados', 'transições',
    'reversibilidade', 'prevenção de erro', 'recuperação', 'dependências',
    'permissões', 'gargalos', 'redundâncias']) {
    assert.ok(routing.includes(d), `missing behavioral dimension: ${d}`);
  }
  assert.ok(routing.includes('skills/interaction-design/SKILL.md'));

  const consolidation = co.split('### Consolidação')[1];
  assert.ok(consolidation, 'missing consolidation subsection');
  assert.ok(/[Dd]uas issues iguais/.test(consolidation), 'duplicate issues must be named as failure');
  assert.ok(consolidation.includes('evidência mais forte'), 'strongest evidence must be preserved');
  assert.ok(consolidation.includes('maior severidade só permanece se justificada'),
    'higher severity must require justification');
  assert.ok(consolidation.includes('severity-framework.md'),
    'severity rule must defer to the framework');
});

test('workflow issue model restates the canonical contract without divergence', () => {
  const wf = read(WORKFLOW);
  const im = wf.split('## Issue Model')[1]?.split('\n## ')[0];
  assert.ok(im, 'missing Issue Model section');
  // mesmo contrato dos standards, nos mesmos campos e na mesma ordem
  const block = im.split('```text')[1]?.split('```')[0];
  assert.ok(block, 'missing issue block');
  const fields = ['Issue:', 'Category:', 'Severity:', 'Confidence:',
    'Evidence:', 'User Impact:', 'Recommendation:'];
  let last = -1;
  for (const f of fields) {
    const i = block.indexOf(f);
    assert.ok(i !== -1, `issue block missing field: ${f}`);
    assert.ok(i > last, `field out of canonical order: ${f}`);
    last = i;
  }
  assert.ok(block.includes('Critical | High | Medium | Low | Opportunity'),
    'severity tokens must match the canonical scale');
  assert.ok(block.includes('High | Medium | Low'),
    'confidence tokens must match the canonical scale');
  assert.ok(im.includes('design-output-format.md') && im.includes('critique-framework.md'),
    'contract ownership must stay with the standards');
  // evidência: princípio abstrato nunca sustenta sozinho (exemplo fraco/melhor)
  assert.ok(im.includes('nunca é a única evidência'), 'abstract principles must not stand alone');
  assert.ok(im.includes('boas práticas'), 'must carry the weak-evidence example');
  // dimensões de impacto nomeadas
  for (const d of ['usuário', 'tarefa', 'negócio', 'compreensão', 'erro', 'acessibilidade']) {
    assert.ok(im.includes(d), `missing impact dimension: ${d}`);
  }
  // qualidades da recomendação
  for (const q of ['específica', 'proporcional', 'acionável', 'contextual']) {
    assert.ok(im.includes(q), `missing recommendation quality: ${q}`);
  }
});

test('workflow severity engine defers to the framework and keeps confidence orthogonal', () => {
  const wf = read(WORKFLOW);
  const se = wf.split('### Severity Engine')[1]?.split('\n## ')[0];
  assert.ok(se, 'missing Severity Engine subsection');
  // uma escala só: o framework é a fonte integral, sem definição concorrente
  assert.ok(se.includes('integralmente') && se.includes('severity-framework.md'),
    'severity must come entirely from the framework');
  assert.ok(!wf.includes('**Definition:**'),
    'workflow must not carry competing level definitions');
  assert.ok(se.includes('impact × reach × task criticality × recoverability'),
    'must reference the four lenses');
  // pisos e desempate
  assert.ok(/perda de trabalho\/dados/.test(se) && se.includes('acessibilidade'),
    'floors must be named inviolable');
  assert.ok(se.includes('o menor'), 'tie-break must go down, never up');
  // ortogonalidade Severity != Confidence, com o exemplo Critical/Low
  assert.ok(se.includes('Severity ≠ Confidence'), 'orthogonality must be explicit');
  assert.ok(/Severity: {3}Critical\n\s*Confidence: Low/.test(se.replace(/\r\n/g, '\n')),
    'Critical/Low must be shown as a legitimate combination');
  assert.ok(se.includes('jamais rebaixa severidade'),
    'uncertainty must never silently lower severity');
});

test('workflow consolidates the full finding set in a dedicated stage before the report', () => {
  const wf = read(WORKFLOW);
  // STEP 5 é a etapa de consolidação, antes do gate e do report
  const process = wf.split('## Process')[1];
  const stepList = process.split('```text')[1]?.split('```')[0];
  assert.ok(/STEP 5\s+Consolidation/.test(stepList), 'STEP 5 must be the consolidation stage');
  assert.ok(stepList.indexOf('Consolidation') < stepList.indexOf('Quality Gate'),
    'consolidation must precede the quality gate');
  assert.ok(process.includes('conjunto **consolidado**, nunca o bruto'),
    'the gate must score the consolidated set');
  // contrato do estágio: os cinco deveres + sinal sobre volume
  const cons = wf.split('### Consolidação')[1]?.split('\n### ')[0]?.split('\n## ')[0];
  assert.ok(cons, 'missing consolidation contract');
  for (const duty of ['duplicata', 'agrupa', 'severidade', 'evidência', 'prioridade']) {
    assert.ok(cons.toLowerCase().includes(duty), `missing consolidation duty: ${duty}`);
  }
  assert.ok(/[Ss]inal sobre volume/.test(cons), 'signal-over-volume principle must be explicit');
  assert.ok(cons.includes('volume não é rigor'));
  assert.ok(cons.includes('Opportunity') && cons.includes('ordem de ataque'),
    'priority ordering must be defined with Opportunities kept apart');
});

test('workflow report composition maps every canonical section to the official contract', () => {
  const wf = read(WORKFLOW);
  const out = wf.split('## Output')[1]?.split('\n## ')[0];
  assert.ok(out, 'missing Output section');
  assert.ok(out.includes('Composição do report'), 'missing report composition map');
  // as dez entregas canônicas, mapeadas — nenhuma seção paralela criada
  const canonical = ['Executive Summary', 'Review Scope', 'Context Snapshot',
    'Critical', 'High', 'Medium', 'Low', 'Opportunities',
    'Recommended Next Steps', 'Review Limitations'];
  for (const c of canonical) assert.ok(out.includes(c), `missing canonical content: ${c}`);
  for (const official of ['## Issues', '## Unknowns and Assumptions', '## Layer Coverage']) {
    assert.ok(out.includes(official.replace('## ', '')), `missing official target: ${official}`);
  }
  assert.ok(out.includes('nenhuma seção paralela'), 'must not create a parallel report format');
  // Executive Summary: diagnóstico, não contagem
  assert.ok(/[Nn]unca apenas uma contagem/.test(out));
  for (const e of ['diagnóstico principal', 'risco geral', 'prioridade recomendada']) {
    assert.ok(out.includes(e), `executive summary missing element: ${e}`);
  }
  // ordenação estrita e desempate
  assert.ok(out.includes('impacto → confiança → alcance'), 'missing severity tie-break order');
  // next steps amarrados às issues, com o exemplo
  assert.ok(/[Nn]unca lista genérica/.test(out));
  assert.ok(out.includes('recuperação de pagamento'), 'must carry the worked example');
  // limitações: as quatro origens
  for (const l of ['contexto ausente', 'Canvas Snapshot', 'suposições', 'validação humana']) {
    assert.ok(out.toLowerCase().includes(l.toLowerCase()), `missing limitation origin: ${l}`);
  }
});

test('workflow maps the canonical fourteen-stage pipeline onto its steps', () => {
  const wf = read(WORKFLOW);
  const process = wf.split('## Process')[1]?.split('\n## ')[0];
  assert.ok(process.includes('Pipeline canônico'), 'missing canonical pipeline map');
  const stages = ['Receive review request', 'Detect scope', 'Load project context',
    'Inspect Paper', 'Build Context Brief', 'Run Design Critique',
    'Run Interaction Design when relevant', 'Normalize findings', 'Classify severity',
    'Assign confidence', 'Deduplicate findings', 'Prioritize issues',
    'Generate report', 'Present next steps'];
  let last = -1;
  for (const s of stages) {
    const i = process.indexOf(s);
    assert.ok(i !== -1, `missing pipeline stage: ${s}`);
    assert.ok(i > last, `pipeline stage out of order: ${s}`);
    last = i;
  }
});

test('workflow documentation sections carry their required substance', () => {
  const wf = read(WORKFLOW);
  const section = (name) => wf.split(`## ${name}`)[1]?.split('\n## ')[0] ?? '';
  const trigger = section('Trigger');
  assert.ok(trigger.includes('/uxco-review') && trigger.includes('contextual'),
    'Trigger must cover command and contextual invocation');
  const pre = section('Preconditions');
  assert.ok(pre.includes('Artefato observável') && pre.includes('PAPER_READY'),
    'Preconditions must name the observable artifact and canvas readiness');
  const deps = section('Skill Dependencies');
  for (const d of ['skills/product-context/SKILL.md', 'skills/design-critique/SKILL.md',
    'skills/interaction-design/SKILL.md', 'scripts/context-loader.mjs']) {
    assert.ok(deps.includes(d), `Skill Dependencies missing: ${d}`);
  }
  const done = section('Completion Criteria');
  assert.ok(done.includes('8 STEPs') && done.includes('Quality Gate'),
    'Completion Criteria must bind steps and gate');
  assert.ok(done.includes('Gate reprovado não é review incompleto'),
    'failed gate must not equal incomplete review');
});

test('report template materializes the official contract with explicit-absence rules', () => {
  assert.ok(exists(TEMPLATE), 'missing report template');
  const t = read(TEMPLATE);
  // propriedade do contrato declarada: o molde não é um segundo contrato
  assert.ok(t.includes('standards/critique-framework.md') &&
    t.includes('workflows/uxco-review.md'), 'template must name its contract owners');
  assert.ok(t.includes('contrato de saída, não texto rígido'));
  // todas as seções oficiais do report presentes no esqueleto
  for (const s of ['## Executive Summary', '## Issues', '## Patterns Detected',
    '## Opportunities', '## Unknowns and Assumptions', '## Layer Coverage',
    '## Quality Gate', '## Recommended Next Steps']) {
    assert.ok(t.includes(s), `template missing section: ${s}`);
  }
  // Scope block e tokens canônicos
  assert.ok(t.includes('screen | frame | selection | frame-set | flow'));
  assert.ok(t.includes('explicit | selection | inferred'));
  assert.ok(t.includes('Critical | High | Medium | Low | Opportunity'));
  assert.ok(t.includes('not-evaluable'));
  // política de ausência: declarar explicitamente; severidade vazia sem subtítulo vazio
  assert.ok(/[Nn]unca somem em silêncio/.test(t), 'fixed sections must never vanish silently');
  assert.ok(t.includes('Nenhum padrão detectado'), 'must show an explicit-absence declaration');
  assert.ok(t.includes('Nenhuma issue Critical identificada'),
    'empty severities must be declared via the summary, not empty headings');
  // workflow aponta o molde
  assert.ok(read(WORKFLOW).includes(TEMPLATE), 'workflow must reference the template');
});

test('workflow honors the context gate contract of the Brief', () => {
  const wf = read(WORKFLOW);
  for (const token of ['PROCEED', 'PROCEED WITH ASSUMPTIONS', 'REQUEST BLOCKING CONTEXT']) {
    assert.ok(wf.includes(token), `missing Execution Recommendation token: ${token}`);
  }
});

test('workflow declares itself READ-only and requires PAPER_READY for canvas', () => {
  const wf = read(WORKFLOW);
  assert.ok(wf.includes('`READ`'), 'workflow must declare the READ safety class');
  assert.ok(wf.includes('PAPER_READY'), 'workflow must gate canvas reads on PAPER_READY');
});

test('command file routes to the workflow and has frontmatter', () => {
  const cmd = read(COMMAND);
  assert.ok(cmd.startsWith('---'), 'command must open with frontmatter');
  assert.ok(/description:/.test(cmd), 'command frontmatter must carry a description');
  assert.ok(cmd.includes(WORKFLOW), 'command must route to the workflow file');
  assert.ok(cmd.includes('$ARGUMENTS'), 'command must accept arguments');
});

test('command supports bare, named, and path invocations on the existing mechanism', () => {
  const cmd = read(COMMAND);
  // as três formas + a contextual, documentadas no próprio comando
  assert.ok(cmd.includes('/uxco-review checkout'), 'named-target invocation missing');
  assert.ok(cmd.includes('fixture.md'), 'path invocation missing');
  assert.ok(/\/uxco-review\s+escopo pela seleção/.test(cmd), 'bare invocation missing');
  assert.ok(cmd.includes('pedido contextual'), 'contextual equivalent missing');
  // regra de resolução do alvo nomeado: intenção explícita, referente resolvido
  assert.ok(cmd.includes('referente'), 'named-target resolution rule missing');
  assert.ok(/argument-hint:.*checkout/.test(cmd), 'argument-hint must show the named form');
  // cenário comportamental do alvo nomeado
  const sc = read(SCENARIOS);
  const s6 = sc.split('## SCP-006')[1];
  assert.ok(s6, 'missing SCP-006 named-target scenario');
  for (const s of ['### User Request', '### Pass Criteria', '### Fail Criteria']) {
    assert.ok(s6.includes(s), `SCP-006 missing section: ${s}`);
  }
});

test('workflow and command use no non-canonical severity vocabulary', () => {
  // "blocker" fica de fora: é vocabulário legítimo dos gates do quality-framework,
  // não um token de severidade.
  const banned = /\b(Major|Minor|Trivial)\b/;
  for (const file of [WORKFLOW, COMMAND]) {
    assert.ok(!banned.test(read(file)), `${file} uses a non-canonical severity term`);
  }
});

test('review fixture is complete and points to the demo memory', () => {
  const fx = read(FIXTURE);
  for (const s of ['## Contexto', '## Estados conhecidos']) {
    assert.ok(fx.includes(s), `fixture missing section: ${s}`);
  }
  assert.ok(/## Tela/.test(fx), 'fixture must describe at least one screen');
  assert.ok(fx.includes('examples/demo-project/'), 'fixture must point to the demo memory');
});

test('expectation is complete and uses only allowed severities', () => {
  const ex = read(EXPECTATION);
  for (const s of ['## Essential', '## Acceptable', '## False positives', '## Calibração']) {
    assert.ok(ex.includes(s), `expectation missing section: ${s}`);
  }
  assert.ok(ex.includes(FIXTURE), 'expectation must reference its fixture');
  const essential = ex.split('## Essential')[1].split('\n## ')[0];
  const rows = essential.split('\n').filter(
    (l) => l.trim().startsWith('|') && !/---|Problema|Camada/.test(l)
  );
  assert.ok(rows.length > 0, 'Essential table has no rows');
  for (const row of rows) {
    const cells = row.split('|').map((c) => c.trim()).filter(Boolean);
    const sev = cells[cells.length - 1];
    for (const token of sev.split(/[–\-\/,\s]+/).filter(Boolean)) {
      assert.ok(SEVERITIES.includes(token), `invalid severity token "${token}" in "${sev}"`);
    }
  }
});

test('constitution and README acknowledge the workflow (no simulated components)', () => {
  assert.ok(read('CLAUDE.md').includes('workflows/uxco-review.md'),
    'CLAUDE.md §9.3 must list the review workflow as existing');
  assert.ok(read('README.md').includes('/uxco-review'),
    'README.md must document the review workflow');
});

test('no broken repo references in sprint 4 artifacts', () => {
  const files = [
    WORKFLOW,
    COMMAND,
    SCENARIOS,
    TEMPLATE,
    'examples/review-tests/README.md',
    FIXTURE,
    'benchmarks/review-workflow/README.md',
    EXPECTATION,
  ];
  const refRe = /`((?:standards|skills|scripts|examples|benchmarks|templates|tests|docs|workflows|experiments)\/[^`]*?\.(?:md|mjs))`/g;
  for (const file of files) {
    const content = read(file);
    for (const match of content.matchAll(refRe)) {
      const ref = match[1];
      if (/YYYY|[<>*]/.test(ref)) continue; // placeholders
      assert.ok(exists(ref), `${file} references missing path: ${ref}`);
    }
  }
});

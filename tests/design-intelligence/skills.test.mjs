// Testes DETERMINISTIC da Design Intelligence (Sprint 6): as oito competências,
// o routing contextual e a integração com o /uxco-review — contratos, fronteiras,
// tokens canônicos, referências e a fiação cenários ↔ fixtures ↔ expectations.
//
// A qualidade das análises é AGENT EVALUATION (tests/design-intelligence/
// skill-scenarios.md, benchmarks/design-intelligence/) e não é fingida aqui como
// assert. O que se prova aqui é que cada comportamento exigido tem mecanismo
// declarado — e que os números e critérios citados nos materiais são verdadeiros.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const exists = (p) => existsSync(join(root, p));
// CRLF-tolerante: o working tree deste repositório é CRLF (core.autocrlf=true)
const read = (p) => readFileSync(join(root, p), 'utf8').replace(/\r\n/g, '\n');
const section = (text, name) => text.split(`\n## ${name}`)[1]?.split('\n## ')[0] ?? '';

const ROUTING = 'standards/skill-routing.md';
const WORKFLOW = 'workflows/uxco-review.md';
const SCENARIOS = 'tests/design-intelligence/skill-scenarios.md';
const SKILL_FIXTURES = 'examples/skill-tests';
const EXPECTATIONS = 'benchmarks/design-intelligence/expectations';

const REGISTRY = {
  'product-context': 'skills/product-context/SKILL.md',
  'design-critique': 'skills/design-critique/SKILL.md',
  'interaction-design': 'skills/interaction-design/SKILL.md',
  'ux-writing': 'skills/ux-writing/SKILL.md',
  'visual-hierarchy': 'skills/visual-hierarchy/SKILL.md',
  'design-systems': 'skills/design-systems/SKILL.md',
  'accessibility': 'skills/accessibility/SKILL.md',
  'design-qa': 'agents/design-qa.md',
};

const NEW_SKILLS = {
  'visual-hierarchy': { file: REGISTRY['visual-hierarchy'], layer: 'L5',
    dimensions: ['Visual priority', 'Typography', 'Contrast', 'Spacing', 'Grouping',
      'Alignment', 'Density', 'Scannability', 'Visual rhythm', 'Information emphasis'],
    fields: ['Task Priority:', 'Observed Emphasis:', 'Competing Elements:'] },
  'ux-writing': { file: REGISTRY['ux-writing'], layer: 'L4',
    dimensions: ['Clarity', 'Conciseness', 'Actionability', 'Terminology', 'Consistency',
      'Tone', 'Error Recovery', 'Accessibility', 'Contextual Relevance'],
    fields: ['Original:', 'Problem:', 'Proposed Copy:', 'Rationale:', 'Expected Impact:'] },
  'design-systems': { file: REGISTRY['design-systems'], layer: 'L6',
    dimensions: ['Component reuse', 'Tokens', 'Variants', 'States', 'Naming',
      'Consistency', 'Pattern governance', 'Scalability'],
    fields: ['System Action:', 'Existing Pattern:', 'System Impact:'] },
  'accessibility': { file: REGISTRY['accessibility'], layer: 'L7',
    dimensions: ['Contrast', 'Readability', 'Target Size', 'Color Dependence',
      'Focus Visibility', 'Navigation', 'Semantics', 'Error Identification',
      'Instructions', 'Status Feedback', 'Interaction Alternatives'],
    fields: ['A11y Status:', 'Applicable Criterion:', 'Verification Needed:'] },
};

const SKILL_SECTIONS = ['## Purpose', '## When to Use', '## Boundary', '## Required Context',
  '## Evaluation Dimensions', '## Procedure', '## Output', '## Evidence Requirements',
  '## Limitations', '## Failure Conditions', '## Quality Checklist'];

const SYSTEM_ACTIONS = ['Reuse existing component', 'Extend existing component',
  'Create new component', 'Resolve inconsistency', 'Insufficient evidence'];
const A11Y_STATUS = ['Confirmed Issue', 'Potential Issue',
  'Requires Technical Verification', 'Not Assessable'];
const SEVERITIES = ['Critical', 'High', 'Medium', 'Low', 'Opportunity'];

// Critérios WCAG 2.2 que os materiais da sprint podem citar — número → [nome, nível].
// Qualquer citação no formato "x.y.z Nome · Nível" fora deste mapa, ou divergente
// dele, reprova: citar um critério errado é pior que não citar (skill, Evidence 2).
const WCAG = {
  '1.1.1': ['Non-text Content', 'A'],
  '1.3.1': ['Info and Relationships', 'A'],
  '1.3.3': ['Sensory Characteristics', 'A'],
  '1.4.1': ['Use of Color', 'A'],
  '1.4.3': ['Contrast (Minimum)', 'AA'],
  '1.4.4': ['Resize Text', 'AA'],
  '1.4.6': ['Contrast (Enhanced)', 'AAA'],
  '1.4.11': ['Non-text Contrast', 'AA'],
  '1.4.12': ['Text Spacing', 'AA'],
  '2.1.1': ['Keyboard', 'A'],
  '2.4.3': ['Focus Order', 'A'],
  '2.4.6': ['Headings and Labels', 'AA'],
  '2.4.7': ['Focus Visible', 'AA'],
  '2.4.11': ['Focus Not Obscured (Minimum)', 'AA'],
  '2.5.1': ['Pointer Gestures', 'A'],
  '2.5.5': ['Target Size (Enhanced)', 'AAA'],
  '2.5.7': ['Dragging Movements', 'AA'],
  '2.5.8': ['Target Size (Minimum)', 'AA'],
  '3.3.1': ['Error Identification', 'A'],
  '3.3.2': ['Labels or Instructions', 'A'],
  '3.3.3': ['Error Suggestion', 'AA'],
  '3.3.4': ['Error Prevention (Legal, Financial, Data)', 'AA'],
  '3.3.8': ['Accessible Authentication (Minimum)', 'AA'],
  '4.1.2': ['Name, Role, Value', 'A'],
  '4.1.3': ['Status Messages', 'AA'],
};
const WCAG_CITATION = /\b([1-4]\.\d{1,2}\.\d{1,2}) ([A-Z][A-Za-z ,()-]+?) · (AAA|AA|A)\b/g;
const wcagErrors = (text) => {
  const errors = [];
  for (const [, num, name, level] of text.matchAll(WCAG_CITATION)) {
    const canon = WCAG[num];
    if (!canon) errors.push(`${num} is not in the canonical map`);
    else if (canon[0] !== name.trim() || canon[1] !== level) {
      errors.push(`${num} cited as "${name.trim()} · ${level}", canonical "${canon[0]} · ${canon[1]}"`);
    }
  }
  return errors;
};

// Contraste pela luminância relativa da WCAG — para conferir os números dos gabaritos
const lin = (c) => { const s = c / 255; return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const contrast = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return ((hi + 0.05) / (lo + 0.05)).toFixed(2).replace('.', ',');
};

// Tabelas markdown → linhas de células
const tableRows = (text) => text.split('\n')
  .filter((l) => l.trim().startsWith('|') && !/^\|\s*-/.test(l.trim()))
  .map((l) => l.split('|').slice(1, -1).map((c) => c.trim()));
const slugs = (cell) => cell.split(',').map((s) => s.trim()).filter((s) => s && s !== '—');

const scenario = (id) => read(SCENARIOS).split(`\n## ${id} —`)[1]?.split('\n## ')[0] ?? '';

// ------------------------------------------------------------------- registro

test('the eight competences exist where the routing registry says they are', () => {
  const reg = section(read(ROUTING), 'Registro de competências');
  const rows = tableRows(reg).slice(1);
  assert.equal(rows.length, 8, 'the registry must list exactly eight competences');
  for (const [slug, file] of Object.entries(REGISTRY)) {
    const row = rows.find((r) => r[0] === `\`${slug}\``);
    assert.ok(row, `registry missing competence: ${slug}`);
    assert.equal(row[1], `\`${file}\``, `${slug} registered at the wrong path`);
    assert.ok(exists(file), `missing competence file: ${file}`);
  }
  // Design QA continua responsabilidade acoplada ao review — nenhuma skill duplicada
  assert.ok(!exists('skills/design-qa/SKILL.md'),
    'design-qa must stay a single responsibility in agents/, not duplicated as a skill');
});

test('each depth layer has exactly one owner skill, and the owners match the skills', () => {
  const rows = tableRows(section(read(ROUTING), 'Registro de competências')).slice(1);
  const owners = {};
  for (const r of rows.filter((x) => x[2].includes('profundidade'))) {
    for (const layer of r[3].match(/L[0-8]/g) ?? []) {
      assert.ok(!owners[layer], `layer ${layer} has two depth owners: ${owners[layer]} and ${r[0]}`);
      owners[layer] = r[0];
    }
  }
  assert.deepEqual(Object.keys(owners).sort(), ['L1', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8']);
  for (const [slug, s] of Object.entries(NEW_SKILLS)) {
    assert.equal(owners[s.layer], `\`${slug}\``, `${s.layer} must be owned by ${slug}`);
  }
  // a Design Critique declara o mesmo mapa de profundidade
  const dc = section(read(REGISTRY['design-critique']), 'Depth Routing and Consolidation');
  assert.ok(dc, 'design-critique must declare depth routing');
  for (const [slug, s] of Object.entries(NEW_SKILLS)) {
    const line = dc.split('\n').find((l) => l.includes(`skills/${slug}/SKILL.md`));
    assert.ok(line?.includes(s.layer), `design-critique depth map disagrees for ${slug}`);
  }
  assert.ok(/[Ee]sta skill consolida/.test(dc), 'design-critique must own consolidation');
});

// --------------------------------------------------------- contrato das skills

test('the four new skills follow the skill contract and inherit the common base', () => {
  for (const [slug, s] of Object.entries(NEW_SKILLS)) {
    const skill = read(s.file);
    assert.ok(skill.includes('> **Propósito:**') && skill.includes('> **Quando consultar:**'),
      `${slug}: missing header`);
    for (const sec of SKILL_SECTIONS) assert.ok(skill.includes(sec), `${slug}: missing ${sec}`);
    // dona da camada, declarado no cabeçalho
    assert.ok(skill.split('\n## ')[0].includes(`**${s.layer} —`), `${slug}: must own ${s.layer}`);
    // herança por referência, nunca cópia
    for (const ref of ['skills/design-critique/SKILL.md', 'standards/critique-framework.md',
      'standards/severity-framework.md', 'standards/design-output-format.md',
      'standards/skill-routing.md']) {
      assert.ok(skill.includes(ref), `${slug}: missing reference ${ref}`);
    }
    assert.ok(/[Hh]erda por referência, sem repetir/.test(skill), `${slug}: inheritance not declared`);
  }
});

test('each new skill evaluates its own dimensions and declares its extension fields', () => {
  for (const [slug, s] of Object.entries(NEW_SKILLS)) {
    const skill = read(s.file);
    const dims = section(skill, 'Evaluation Dimensions');
    for (const d of s.dimensions) assert.ok(dims.includes(`**${d}**`), `${slug}: missing dimension ${d}`);
    const out = section(skill, 'Output');
    for (const f of s.fields) assert.ok(out.includes(f), `${slug}: Output missing field ${f}`);
    // extensão nunca substitui o contrato de 7 campos
    assert.ok(/contrato comum de 7 campos/.test(out), `${slug}: must keep the 7-field contract`);
  }
  // a cadeia de reescrita da UX Writing, na ordem
  const out = section(read(NEW_SKILLS['ux-writing'].file), 'Output');
  let last = -1;
  for (const f of NEW_SKILLS['ux-writing'].fields) {
    assert.ok(out.indexOf(f) > last, `ux-writing chain out of order at ${f}`);
    last = out.indexOf(f);
  }
});

test('no skill introduces a parallel severity, confidence or category scale', () => {
  const banned = /\b(Blocker|Major|Minor|Trivial)\b/;
  for (const [slug, s] of Object.entries(NEW_SKILLS)) {
    const skill = read(s.file);
    assert.ok(!banned.test(skill), `${slug} uses a non-canonical severity term`);
    for (const [, v] of skill.matchAll(/^Severity:\s+(\S+)/gm)) {
      assert.ok(SEVERITIES.includes(v), `${slug}: invalid severity ${v}`);
    }
    for (const [, v] of skill.matchAll(/^Confidence:\s+(\S+)/gm)) {
      assert.ok(['High', 'Medium', 'Low'].includes(v), `${slug}: invalid confidence ${v}`);
    }
    for (const [, v] of skill.matchAll(/^Category:\s+(\S+)/gm)) {
      assert.ok(/^L[0-8]$/.test(v), `${slug}: Category must be a single L0–L8 token, got ${v}`);
    }
    assert.ok(!/[Ss]everity:\s*\d|[Cc]onfidence:\s*\d/.test(skill), `${slug}: numeric scale leaked`);
  }
});

test('evidence discipline: no invented values, conditional context, limits declared', () => {
  const vh = read(NEW_SKILLS['visual-hierarchy'].file);
  assert.ok(/Nunca inventar medidas, cores, espaçamentos ou valores de contraste/.test(vh));
  assert.ok(/Valor só com fonte/.test(vh), 'visual-hierarchy must require a source for values');
  assert.ok(/modernidade, tendência ou gosto/.test(section(vh, 'Failure Conditions')),
    'visual-hierarchy must forbid aesthetic-only recommendations');

  const ux = read(NEW_SKILLS['ux-writing'].file);
  assert.ok(/promete capacidade inexistente/.test(section(ux, 'Failure Conditions')),
    'ux-writing must forbid promising non-existent recovery');
  assert.ok(/[Cc]ompreensão antes de criatividade/.test(ux));
  assert.ok(/[Tt]ermo do domínio substituído por genérico/.test(ux));

  const ds = read(NEW_SKILLS['design-systems'].file);
  for (const a of SYSTEM_ACTIONS) assert.ok(ds.includes(`\`${a}\``), `design-systems missing action ${a}`);
  assert.ok(/Um valor não é um token/.test(ds), 'design-systems must not infer tokens');
  assert.ok(ds.includes('DESTRUCTIVE_WRITE'), 'global system changes must be tied to the safety model');
  // STEPs 1–7 obrigatórios antes de criar componente
  const proc = section(ds, 'Procedure');
  for (let i = 1; i <= 7; i++) assert.ok(proc.includes(`STEP ${i}`), `design-systems missing STEP ${i}`);
  for (const [, v] of ds.matchAll(/^System Action:\s+(.+)$/gm)) {
    assert.ok(SYSTEM_ACTIONS.includes(v.trim()) || v.includes('|'), `invalid System Action: ${v}`);
  }

  for (const [slug, s] of Object.entries(NEW_SKILLS)) {
    assert.ok(section(read(s.file), 'Limitations').trim().length > 0, `${slug}: empty Limitations`);
  }
});

// ------------------------------------------------------------- accessibility

test('accessibility separates verification levels and never claims conformance', () => {
  const a = read(NEW_SKILLS.accessibility.file);
  for (const st of A11Y_STATUS) assert.ok(a.includes(`\`${st}\``), `missing A11y Status: ${st}`);
  for (const level of ['visualmente observável', 'propriedades estruturadas',
    'inspeção do código', 'teste com tecnologia assistiva']) {
    assert.ok(a.includes(level), `missing verifiability level: ${level}`);
  }
  // a cadeia exigida pela skill
  assert.ok(a.includes('Issue → Evidence → Accessibility Impact → Applicable Criterion → Recommendation → Verification Needed'));
  // honestidade normativa
  assert.ok(/Nenhuma conformidade WCAG é declarada/.test(section(a, 'Limitations')));
  assert.ok(/Contraste adequado não torna uma interface acessível/.test(a));
  assert.ok(/[Cc]itar um critério errado é pior que não citar/.test(a));
  // o piso é do baseline, nunca redefinido
  assert.ok(a.includes('standards/accessibility-baseline.md') && /não é redefinido aqui/.test(a));
  // pendências técnicas não são Issue
  assert.ok(/`Requires Technical Verification` \| A questão vive nos níveis 3 ou 4 \| \*\*Não é Issue/.test(a));
});

test('every WCAG criterion cited in the sprint materials is real and correctly named', () => {
  const files = [NEW_SKILLS.accessibility.file,
    `${SKILL_FIXTURES}/06-qa-review-drafts/draft-a.md`,
    `${SKILL_FIXTURES}/06-qa-review-drafts/draft-b.md`,
    `${EXPECTATIONS}/03-clinic-signup-form.md`];
  for (const f of files) {
    const errs = wcagErrors(read(f));
    assert.deepEqual(errs, [], `${f}: ${errs.join('; ')}`);
  }
  // o alvo de 44×44 é AAA (2.5.5); o AA (2.5.8) é 24×24 — o erro mais comum, travado
  const a = read(NEW_SKILLS.accessibility.file);
  const row = a.split('\n').find((l) => l.includes('**Target Size**'));
  assert.ok(row.includes('2.5.8 Target Size (Minimum) · AA (24×24'), '2.5.8 must be tied to 24×24');
  assert.ok(row.includes('2.5.5 Target Size (Enhanced) · AAA (44×44'), '44×44 must be tied to 2.5.5 AAA');
  // o defeito semeado no draft C precisa continuar lá — senão QA-3 perde o objeto
  assert.ok(wcagErrors(read(`${SKILL_FIXTURES}/06-qa-review-drafts/draft-c.md`)).length > 0,
    'draft-c must keep its seeded wrong WCAG citation');
});

// ------------------------------------------------------------------- routing

test('routing profiles are disjoint, use only registered competences and keep QA in the formal review', () => {
  const rows = tableRows(section(read(ROUTING), 'Perfis canônicos de pedido')).slice(1);
  const profiles = Object.fromEntries(rows.map((r) => [r[0].replace(/`/g, ''),
    { primary: slugs(r[2]), conditional: slugs(r[3]), never: slugs(r[4]) }]));
  for (const name of ['full-review', 'microcopy', 'form', 'visual-hierarchy', 'flow',
    'accessibility-audit', 'design-system-consistency']) {
    assert.ok(profiles[name], `missing routing profile: ${name}`);
  }
  for (const [name, p] of Object.entries(profiles)) {
    const all = [...p.primary, ...p.conditional, ...p.never];
    assert.equal(new Set(all).size, all.length, `${name}: a competence appears in two columns`);
    for (const s of all) assert.ok(REGISTRY[s], `${name}: unregistered competence ${s}`);
    if (name !== 'full-review') {
      assert.ok(p.never.includes('design-qa'), `${name}: design-qa must not load outside the formal review`);
    }
  }
  // full review: QA e Accessibility (★) sempre; profundidade por sinal
  const full = profiles['full-review'];
  for (const s of ['product-context', 'design-critique', 'accessibility', 'design-qa']) {
    assert.ok(full.primary.includes(s), `full-review must always load ${s}`);
  }
  for (const s of ['interaction-design', 'ux-writing', 'visual-hierarchy', 'design-systems']) {
    assert.ok(full.conditional.includes(s), `full-review must load ${s} only on signal`);
  }
  // os três exemplos do pedido da sprint, travados
  assert.deepEqual(profiles.microcopy.primary, ['ux-writing']);
  assert.ok(profiles.microcopy.never.includes('design-systems'),
    'microcopy review must not run Design Systems without justification');
  assert.ok(profiles.microcopy.conditional.includes('accessibility') &&
    profiles.microcopy.conditional.includes('product-context'));
  for (const s of ['interaction-design', 'ux-writing', 'accessibility', 'design-critique']) {
    assert.ok(profiles.form.primary.includes(s), `form review must prioritize ${s}`);
  }
  assert.deepEqual(profiles['visual-hierarchy'].primary, ['visual-hierarchy', 'design-critique']);
  assert.ok(profiles['visual-hierarchy'].conditional.includes('design-systems'));
  // toda competência é primária em pelo menos um perfil — nenhuma órfã
  for (const s of Object.keys(REGISTRY)) {
    assert.ok(Object.values(profiles).some((p) => p.primary.includes(s)), `${s} is never primary`);
  }
});

test('routing is minimal, escalation is declared, and selection is auditable', () => {
  const r = read(ROUTING);
  const rules = section(r, 'Regras de seleção');
  assert.ok(/\*\*Conjunto mínimo\.\*\*/.test(rules));
  assert.ok(/\*\*Escalada sob demanda, declarada\.\*\*/.test(rules));
  assert.ok(/\*\*O gate de evidência prevalece sobre o roteamento\.\*\*/.test(rules));
  assert.ok(/\*\*Nenhuma competência simulada\.\*\*/.test(rules));
  // sem roteador executável: a arquitetura Markdown resolve
  assert.ok(/Não há roteador executável/.test(r));
  assert.ok(!readdirSync(join(root, 'scripts')).some((f) => /rout/i.test(f)),
    'no executable router may be added');
  // registro da seleção, com o formato e o lugar dele no report
  const rec = section(r, 'Registro da seleção');
  assert.ok(rec.includes('Skills: <competência> [motivo]') && rec.includes('escalated:') &&
    rec.includes('not routed:'));
  for (const f of ['standards/adversarial-quality.md', 'templates/reports/design-review.md']) {
    assert.ok(/^Skills:\s+\[/m.test(read(f)), `${f}: Review Assurance missing the Skills line`);
  }
  // o Design QA audita a seleção
  const qa = read(REGISTRY['design-qa']);
  assert.ok(qa.includes('standards/skill-routing.md') && qa.includes('linha `Skills:`'),
    'design-qa must audit the skill selection');
  assert.ok(/critério WCAG citado incorretamente/.test(qa));
  // o Critic desafia os achados especializados sem eixo novo
  const critic = read('agents/design-critic.md');
  assert.ok(/Achados das skills de profundidade/.test(critic) && /sem eixo novo/.test(critic));
});

// ------------------------------------------------------ integração com review

test('/uxco-review uses the specialized skills without changing its public shape', () => {
  const wf = read(WORKFLOW);
  const deps = section(wf, 'Skill Dependencies');
  for (const f of [...Object.values(REGISTRY), ROUTING]) {
    assert.ok(deps.includes(f), `Skill Dependencies missing: ${f}`);
  }
  const co = section(wf, 'Critique Orchestration');
  const sel = co.split('### Seleção das competências especializadas')[1]?.split('\n### ')[0];
  assert.ok(sel, 'missing specialized skill selection subsection');
  assert.ok(sel.includes(ROUTING), 'selection must defer to the routing standard');
  for (const s of ['accessibility', 'ux-writing', 'visual-hierarchy', 'design-systems']) {
    assert.ok(sel.includes(`skills/${s}/SKILL.md`), `selection missing ${s}`);
  }
  assert.ok(/\*\*Sempre\*\*/.test(sel), 'accessibility must always run in the formal review');
  // consolidação cobre os campos de extensão novos — um problema, um achado
  const cons = co.split('### Consolidação')[1];
  for (const f of ['Proposed Copy', 'Observed Emphasis', 'System Action', 'A11y Status']) {
    assert.ok(cons.includes(f), `consolidation must absorb extension field ${f}`);
  }
  // pipeline: os estágios novos, na ordem, sem perder os antigos (o teste de 17 segue valendo)
  const proc = section(wf, 'Process');
  const order = ['Build Context Brief', 'Select relevant skills', 'Run Design Critique',
    'Run Interaction Design when relevant', 'Run specialized skills when routed',
    'Normalize findings', 'Deduplicate findings', 'Challenge the diagnosis'];
  let last = -1;
  for (const s of order) {
    const i = proc.indexOf(s);
    assert.ok(i > last, `pipeline stage missing or out of order: ${s}`);
    last = i;
  }
  assert.ok(proc.includes('mapa dos 19 estágios'));
  // interface pública intacta: um único comando, 11 STEPs, READ integral
  const cmds = readdirSync(join(root, '.claude/commands'));
  assert.deepEqual(cmds, ['uxco-review.md'], 'no second review command may exist');
  assert.ok(read('.claude/commands/uxco-review.md').includes(ROUTING));
  assert.ok(/11 STEPs/.test(section(wf, 'Completion Criteria')));
});

// -------------------------------------------------------------- cenários (24)

const SCENARIO_IDS = {
  'Product Context': ['PC-1', 'PC-2', 'PC-3'],
  'Design Critique': ['DC-1', 'DC-2', 'DC-3'],
  'Interaction Design': ['ID-1', 'ID-2', 'ID-3'],
  'Visual Hierarchy': ['VH-1', 'VH-2', 'VH-3'],
  'UX Writing': ['UXW-1', 'UXW-2', 'UXW-3'],
  'Design Systems': ['DS-1', 'DS-2', 'DS-3'],
  'Accessibility': ['A11Y-1', 'A11Y-2', 'A11Y-3'],
  'Design QA': ['QA-1', 'QA-2', 'QA-3'],
};
const NEW_SECTIONS = ['### User Request', '### Context Available', '### Expected Behavior',
  '### Must Do', '### Must Not Do', '### Pass Criteria', '### Fail Criteria'];
// onde vive cada caso reutilizado — o cenário aponta, o teste confere que existe
const REUSED_SOURCES = {
  'CTX-001': 'benchmarks/context-engine/test-cases.md',
  'CTX-002': 'benchmarks/context-engine/test-cases.md',
  'CTX-003': 'benchmarks/context-engine/test-cases.md',
  'CRT-001': 'benchmarks/critique-engine/README.md',
  'CRT-002': 'benchmarks/critique-engine/README.md',
  'CRT-004': 'benchmarks/critique-engine/README.md',
  'CRT-005': 'benchmarks/critique-engine/README.md',
};

test('24 scenarios, three per competence, each complete or explicitly reused', () => {
  const all = Object.values(SCENARIO_IDS).flat();
  assert.equal(all.length, 24);
  const text = read(SCENARIOS);
  const map = section(text, 'Mapa');
  let reused = 0;
  for (const [competence, ids] of Object.entries(SCENARIO_IDS)) {
    assert.ok(map.includes(`| ${competence} |`), `map missing competence: ${competence}`);
    for (const id of ids) {
      const s = scenario(id);
      assert.ok(s, `missing scenario: ${id}`);
      if (s.includes('### Reuses')) {
        reused++;
        assert.ok(s.includes('### Skill Criteria'), `${id}: reused scenario needs its skill criteria`);
        const ref = s.match(/`(CTX-\d{3}|CRT-\d{3})`/)?.[1];
        assert.ok(ref && REUSED_SOURCES[ref], `${id}: reused case not recognized`);
        assert.ok(read(REUSED_SOURCES[ref]).includes(ref), `${id}: ${ref} not found at its source`);
      } else {
        for (const sec of NEW_SECTIONS) assert.ok(s.includes(sec), `${id}: missing ${sec}`);
      }
    }
  }
  assert.equal(reused, 7, 'exactly the seven adequately covered cases are reused');
  for (const id of ['RT-A', 'RT-B', 'RT-C', 'RT-D']) {
    assert.ok(text.includes(`### ${id} —`), `missing routing scenario: ${id}`);
  }
  assert.ok(/[Ff]abricação é a falha capital/.test(text));
});

test('every skill fixture is consumed by a scenario and has an expectation — nothing orphan', () => {
  const dirs = readdirSync(join(root, SKILL_FIXTURES), { withFileTypes: true })
    .filter((d) => d.isDirectory()).map((d) => d.name);
  assert.equal(dirs.length, 6);
  const scen = read(SCENARIOS);
  const readme = read(`${SKILL_FIXTURES}/README.md`);
  for (const d of dirs) {
    assert.ok(scen.includes(`${SKILL_FIXTURES}/${d}/`), `orphan fixture (no scenario): ${d}`);
    assert.ok(readme.includes(`\`${d}/\``), `fixture not catalogued: ${d}`);
    assert.ok(exists(`${EXPECTATIONS}/${d}.md`), `fixture without expectation: ${d}`);
  }
  // fixtures de design: factuais, mesma anatomia das fixtures do Critique Engine
  for (const d of dirs.filter((x) => x !== '06-qa-review-drafts')) {
    const fx = read(`${SKILL_FIXTURES}/${d}/fixture.md`);
    for (const s of ['## Contexto', '## Comportamento', '## Estados conhecidos']) {
      assert.ok(fx.includes(s), `${d}: missing ${s}`);
    }
  }
  // drafts do QA com nomes neutros — o nome do arquivo não entrega o veredito
  const drafts = readdirSync(join(root, `${SKILL_FIXTURES}/06-qa-review-drafts`)).sort();
  assert.deepEqual(drafts, ['draft-a.md', 'draft-b.md', 'draft-c.md']);
});

test('every expectation is complete, points to its fixture and uses canonical severities', () => {
  for (const f of readdirSync(join(root, EXPECTATIONS))) {
    const ex = read(`${EXPECTATIONS}/${f}`);
    for (const s of ['## Essential', '## Acceptable', '## False positives', '## Calibração']) {
      assert.ok(ex.includes(s), `${f}: missing ${s}`);
    }
    assert.ok(/nunca fornecer/.test(ex), `${f}: must be marked evaluator-only`);
    const slug = f.replace('.md', '');
    assert.ok(ex.includes(`${SKILL_FIXTURES}/${slug}/`), `${f}: fixture reference missing`);
    if (slug === '06-qa-review-drafts') continue; // tabela de vereditos, não de severidades
    const rows = tableRows(section(ex, 'Essential (ausência de qualquer um reprova o cenário correspondente)') ||
      ex.split('## Essential')[1].split('\n## ')[0]).slice(1);
    assert.ok(rows.length > 0, `${f}: Essential table empty`);
    for (const row of rows) {
      for (const tok of row[row.length - 1].split(/[–\-\/,\s]+/).filter(Boolean)) {
        assert.ok(tok === '—' || SEVERITIES.includes(tok), `${f}: invalid severity "${tok}"`);
      }
    }
  }
});

test('contrast ratios stated in the expectations are true for the fixture colors', () => {
  // cada par citado nos gabaritos precisa bater com a fórmula — nenhum número inventado
  const pairs = [
    ['03-clinic-signup-form', '#A0A0A0', '#FFFFFF', '2,61'],
    ['03-clinic-signup-form', '#FFFFFF', '#2E7D32', '5,13'],
    ['03-clinic-signup-form', '#D32F2F', '#FFFFFF', '4,98'],
    ['01-invoice-approval', '#5F6368', '#FFFFFF', '6,05'],
    ['02-transfer-confirmation', '#4A4A4A', '#FFFFFF', '8,86'],
    ['02-transfer-confirmation', '#FFFFFF', '#0B6E4F', '6,25'],
  ];
  for (const [slug, fg, bg, stated] of pairs) {
    assert.equal(contrast(fg, bg), stated, `${fg} on ${bg}`);
    const fx = read(`${SKILL_FIXTURES}/${slug}/fixture.md`);
    assert.ok(fx.includes(fg) && fx.includes(bg), `${slug}: colors not in the fixture`);
    assert.ok(read(`${EXPECTATIONS}/${slug}.md`).includes(`${stated}:1`), `${slug}: ratio not stated`);
  }
  // as contagens do draft A fecham com o record; as do C deliberadamente não
  const count = (f) => read(`${SKILL_FIXTURES}/06-qa-review-drafts/${f}`)
    .match(/Adversarial:\s+(\d) confirmed · (\d) revised · (\d) rejected · (\d) added/).slice(1).map(Number);
  assert.deepEqual(count('draft-a.md'), [3, 1, 1, 1]);
  assert.notDeepEqual(count('draft-c.md'), [3, 1, 1, 1], 'draft-c must keep its seeded count mismatch');
});

// ------------------------------------------------------------------ harness

test('the evaluation harness is wired and honest about what has not run', () => {
  const readme = read('benchmarks/design-intelligence/README.md');
  const proto = read('benchmarks/design-intelligence/before-after-protocol.md');
  assert.ok(exists('benchmarks/design-intelligence/results'));
  assert.ok(/Nenhuma execução registrada/.test(readme));
  assert.ok(/\*\*Não executado\.\*\*/.test(proto));
  assert.ok(/Nenhum ganho percentual é afirmado sem execução registrada/.test(proto));
  for (const m of ['REL', 'FP', 'EVD', 'ACT', 'COV', 'CLR', 'FAB', 'DUP', 'LEN']) {
    assert.ok(proto.includes(`\`${m}\``), `protocol missing measure ${m}`);
  }
  // os quatro casos sugeridos existem e o BEFORE é uma versão real do Git
  for (const f of ['examples/critique-tests/02-checkout-flow/fixture.md',
    'examples/critique-tests/05-multistep-form/fixture.md',
    `${SKILL_FIXTURES}/04-dashboard-screenshot/fixture.md`,
    `${SKILL_FIXTURES}/03-clinic-signup-form/fixture.md`]) {
    assert.ok(proto.includes(f) && exists(f), `protocol case missing: ${f}`);
  }
  const git = spawnSync('git', ['cat-file', '-e', '21bec71^{commit}'], { cwd: root });
  if (git.status !== null && !git.error) {
    assert.equal(git.status, 0, 'the BEFORE commit must exist in the repository history');
  }
});

test('no broken repo references in sprint 6 artifacts', () => {
  const files = [ROUTING, ...Object.values(NEW_SKILLS).map((s) => s.file), SCENARIOS,
    `${SKILL_FIXTURES}/README.md`, 'benchmarks/design-intelligence/README.md',
    'benchmarks/design-intelligence/before-after-protocol.md',
    ...readdirSync(join(root, EXPECTATIONS)).map((f) => `${EXPECTATIONS}/${f}`)];
  const refRe = /`((?:standards|skills|agents|workflows|scripts|examples|benchmarks|templates|tests|docs)\/[^`]*?\.(?:md|mjs))`/g;
  for (const file of files) {
    for (const [, ref] of read(file).matchAll(refRe)) {
      if (/YYYY|[<>*]/.test(ref)) continue;
      assert.ok(exists(ref), `${file} references missing path: ${ref}`);
    }
  }
});

test('regression: sprint 6 added no dependency, no new command and is registered in the suite', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.ok(!pkg.dependencies && !pkg.devDependencies, 'no dependencies may be added');
  assert.ok(pkg.scripts.test.includes('tests/design-intelligence/'), 'suite not wired into npm test');
  const claude = read('CLAUDE.md');
  for (const s of ['ux-writing', 'visual-hierarchy', 'design-systems', 'accessibility']) {
    assert.ok(claude.includes(`skills/${s}/`), `CLAUDE.md §9.3 inventory missing ${s}`);
  }
  assert.ok(claude.includes(ROUTING), 'CLAUDE.md must route to the skill routing standard');
});

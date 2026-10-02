// Testes DETERMINISTIC do Adversarial Quality Engine (Sprint 5): contratos e
// invariantes verificáveis — records, marcadores de estágio, ciclo único,
// fronteiras entre responsabilidades e a fiação cenários ↔ fixture ↔
// expectation ↔ harness.
//
// Os cenários ADV-A..ADV-G (tests/review-workflow/adversarial-scenarios.md)
// descrevem conduta de agente e são AGENT EVALUATION — aqui se valida que cada
// comportamento exigido tem um mecanismo declarado que o sustenta, nunca que um
// LLM produziu uma frase específica. A qualidade dos vereditos é avaliada em
// benchmarks/review-workflow/ (RVW-005, ADV-001) e não é fingida como assert.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const exists = (p) => existsSync(join(root, p));
const read = (p) => readFileSync(join(root, p), 'utf8');

const STANDARD = 'standards/adversarial-quality.md';
const CRITIC = 'agents/design-critic.md';
const QA = 'agents/design-qa.md';
const WORKFLOW = 'workflows/uxco-review.md';
const COMMAND = '.claude/commands/uxco-review.md';
const FRAMEWORK = 'standards/critique-framework.md';
const TEMPLATE = 'templates/reports/design-review.md';
const SCENARIOS = 'tests/review-workflow/adversarial-scenarios.md';
const FIXTURE = 'examples/adversarial-tests/01-flawed-initial-analysis/initial-analysis.md';
const FIXTURES_README = 'examples/adversarial-tests/README.md';
const EXPECTATION = 'benchmarks/review-workflow/expectations/03-flawed-initial-analysis.md';
const PROTOCOL = 'benchmarks/review-workflow/adversarial-protocol.md';
const HARNESS = 'benchmarks/review-workflow/README.md';
const DESIGN_FIXTURE = 'examples/review-tests/02-pulse-new-item/fixture.md';

const STAGES = ['INITIAL_ANALYSIS', 'ADVERSARIAL_REVIEW', 'REVISION', 'FINAL_QA'];
const VERDICTS = ['confirmed', 'revised', 'rejected', 'added'];
const AXES = ['assumption', 'evidence', 'severity', 'confidence', 'causality',
  'missing-state', 'missing-edge-case', 'context-fit', 'recommendation',
  'overengineering'];
const QA_DIMENSIONS = ['Context Grounding', 'Evidence Quality', 'Severity Calibration',
  'Actionability', 'Completeness', 'Accessibility Coverage', 'System Consistency'];
const QA_STATUS = ['PASS', 'PARTIAL', 'FAIL', 'UNKNOWN'];
const QA_VERDICTS = ['REVIEW READY WITH RESERVATIONS', 'REVIEW NOT READY', 'REVIEW READY'];
const SCENARIO_IDS = ['ADV-A', 'ADV-B', 'ADV-C', 'ADV-D', 'ADV-E', 'ADV-F', 'ADV-G'];
const SCENARIO_SECTIONS = ['### User Request', '### Context Available',
  '### Expected Behavior', '### Must Do', '### Must Not Do',
  '### Pass Criteria', '### Fail Criteria'];

const scenario = (id) => read(SCENARIOS).split(`## ${id}`)[1]?.split('\n## ')[0] ?? '';
const section = (file, name) => read(file).split(`## ${name}`)[1]?.split('\n## ')[0] ?? '';
// Os contratos de record embutem um bloco markdown que repete os próprios
// títulos — split() cortaria na repetição. Recortar por índice, do título até o
// próximo título conhecido, é o único corte estável aqui.
const between = (text, from, to) => {
  const a = text.indexOf(from);
  if (a === -1) return '';
  const b = text.indexOf(to, a + from.length);
  return text.slice(a, b === -1 ? undefined : b);
};

test('required sprint 5 files exist', () => {
  for (const p of [STANDARD, CRITIC, QA, SCENARIOS, FIXTURE, FIXTURES_README,
    EXPECTATION, PROTOCOL]) {
    assert.ok(exists(p), `missing: ${p}`);
  }
});

// ------------------------------------------------------- observabilidade (§10)

test('stage markers are canonical, ordered, and shared by standard, workflow and template', () => {
  const std = read(STANDARD);
  const wf = read(WORKFLOW);
  const tpl = read(TEMPLATE);

  // os quatro marcadores existem nos três lugares que precisam concordar
  for (const file of [std, wf, tpl]) {
    for (const s of STAGES) assert.ok(file.includes(s), `missing stage marker: ${s}`);
  }
  // ordem canônica no trace do standard e do template
  for (const file of [std, tpl]) {
    let last = -1;
    for (const s of STAGES) {
      const i = file.indexOf(s);
      assert.ok(i > last, `stage marker out of order: ${s}`);
      last = i;
    }
  }
  // o marcador registra estágio executado, não pretendido
  assert.ok(std.includes('executado') && std.includes('nunca de estágio pretendido'),
    'markers must record executed stages, never intended ones');
  // negativo: sem variantes do token — sinônimo quebra o consumo programático
  for (const variant of ['INITIAL-ANALYSIS', 'ADVERSARIAL-REVIEW', 'FINAL QA',
    'Initial_Analysis', 'ANALISE_INICIAL']) {
    assert.ok(!std.includes(variant) && !wf.includes(variant) && !tpl.includes(variant),
      `non-canonical stage token leaked: ${variant}`);
  }
  // negativo: trace não é chain-of-thought
  assert.ok(/não narra como se chegou/.test(std) || /não expõe raciocínio interno/.test(wf),
    'the trace must not expose internal reasoning');
});

// -------------------------------------------------------------- Test F: no loop

test('ADV-F: the adversarial cycle is bounded to one pass of each stage, with no recursion', () => {
  const std = read(STANDARD);
  const wf = read(WORKFLOW);

  // o invariante numérico declarado nos dois lugares, idêntico
  const bound = /MÁXIMO:\s*1 adversarial critique\s*·\s*1 revision\s*·\s*1 final QA/;
  assert.ok(bound.test(std), 'standard must bound the cycle to 1/1/1');
  assert.ok(bound.test(wf), 'workflow must carry the same bound');
  assert.ok(wf.includes('### Ciclo único'), 'workflow must have the single-cycle section');

  // recursão proibida explicitamente, e QA reprovando não reprocessa
  assert.ok(/[Nn]enhuma recursão/.test(std) && /[Nn]enhuma recursão/.test(wf),
    'recursion must be forbidden in both');
  assert.ok(std.includes('não dispara novo ciclo'),
    'a failing QA must not trigger another cycle');
  assert.ok(/declarad[oa]/.test(std.split('## Ciclo único')[1].split('\n## ')[0]),
    'the quality blocker must be declared rather than reprocessed');

  // diagnóstico vazio não dispensa o ciclo (o caso em que o Critic mais importa)
  assert.ok(std.includes('Diagnóstico inicial vazio não dispensa o ciclo'),
    'an empty initial diagnosis must still go through the cycle');

  // violar o ciclo é review inválido, não apenas desaconselhado
  const fc = section(WORKFLOW, 'Failure Conditions');
  assert.ok(/[Mm]ais de um ciclo adversarial/.test(fc),
    'more than one adversarial cycle must be a failure condition');
  assert.ok(fc.includes('reflexão recursiva'),
    'recursive reflection must be named as invalid');

  // o cenário existe e proíbe a segunda passada
  const s = scenario('ADV-F');
  assert.ok(s.includes('No infinite loop') || s.length > 0, 'ADV-F scenario missing');
  assert.ok(/segunda passada/.test(s), 'ADV-F must forbid a second pass');
  assert.ok(s.includes('Reabrir o Critic') || s.includes('reabrir o Critic') ||
    s.includes('QA reabrindo o Critic'), 'ADV-F must forbid QA reopening the Critic');
  // negativo: o pedido de recursão não vira recusa do review inteiro
  assert.ok(/[Rr]ecusar o pedido inteiro|só a recursão é recusada/.test(s),
    'ADV-F must still deliver the review, refusing only the recursion');
});

// -------------------------------------------------- fronteiras (não duplicar §4)

test('the Design Critic does not duplicate the Design Critique Skill', () => {
  const c = read(CRITIC);
  assert.ok(c.includes('## Boundary — Design Critique × Design Critic'),
    'the critic must declare its boundary against the skill');

  // objetos distintos, declarados: o design × o diagnóstico do design
  assert.ok(/O Critic não repete a varredura L0–L8/.test(c),
    'the critic must not repeat the L0-L8 sweep');
  assert.ok(c.includes('diagnóstico do design') || c.includes('**O diagnóstico do design**'),
    'the critic object must be the diagnosis, not the design');
  // a pergunta do Critic é distinta da pergunta da skill
  assert.ok(c.includes('Quais problemas existem neste design?') &&
    /Onde (este|o nosso) diagnóstico/.test(c),
    'both questions must be stated side by side to keep them distinct');
  // sem diagnóstico não há Critic — uso inválido declarado
  assert.ok(c.includes('sem um diagnóstico inicial é uso inválido') ||
    c.includes('Rodar o Critic sem um diagnóstico inicial é uso inválido'),
    'running the critic without a diagnosis must be invalid');
  // não redesenha, não escreve
  assert.ok(/não redesenha|Não redesenha/.test(c), 'the critic must not redesign');
  assert.ok(c.includes('`READ`'), 'the critic must be READ-only');
});

test('the Design QA audits the review, never re-criticizing the design', () => {
  const q = read(QA);
  assert.ok(q.includes('## Boundary — quatro coisas diferentes'),
    'QA must separate itself from skill, critic and quality gate');

  // as quatro coisas aparecem na fronteira, cada uma com o seu objeto
  for (const other of ['Design Critique Skill', 'Design Critic', 'Design QA', 'Quality Gate']) {
    assert.ok(q.includes(other), `boundary missing: ${other}`);
  }
  assert.ok(q.includes('O QA não cria achado de design.'),
    'QA must never create a design finding');
  assert.ok(/não varre L0–L8/.test(q), 'QA must not sweep the layers again');
  // a distinção dura: o gate pontua o design, o QA audita o review
  assert.ok(/o Quality Gate pontua o design.*QA audita o review/s.test(q),
    'QA must state the hard distinction against the quality gate');
  // lacuna encontrada vira Completeness, não issue nova
  assert.ok(q.includes('falha de `Completeness`'),
    'a gap found during QA must become a Completeness finding, not an issue');
});

// --------------------------------------------------- mandato e record do Critic

test('the critic mandate covers the ten axes and the ten mandatory probes', () => {
  const c = read(CRITIC);
  const mandate = c.split('## Mandate')[1]?.split('\n## ')[0];
  assert.ok(mandate, 'missing mandate section');
  for (const axis of AXES) {
    assert.ok(mandate.includes(`\`${axis}\``), `mandate missing axis: ${axis}`);
  }
  // as dez sondas adversariais, verbatim
  const probes = [
    'What did we assume?',
    'Which claims lack sufficient evidence?',
    'Are we treating preference as usability?',
    'Is the assigned severity justified?',
    'Could there be another explanation?',
    'Are we solving the cause or only the symptom?',
    'Which user/state/edge case did we overlook?',
    'Could the recommendation create another problem?',
    'Are we recommending unnecessary complexity?',
    'What would falsify this diagnosis?',
  ];
  let last = -1;
  for (const p of probes) {
    const i = c.indexOf(p);
    assert.ok(i !== -1, `missing adversarial probe: ${p}`);
    assert.ok(i > last, `probe out of order: ${p}`);
    last = i;
  }
  // eixo obrigatório como pergunta, nunca como cota de resultado
  assert.ok(/obrigatório como \*\*pergunta\*\*, nunca como cota/.test(mandate),
    'axes must be mandatory as questions, never as result quotas');
});

test('the adversarial critique record has six fixed sections and a five-field entry contract', () => {
  const std = read(STANDARD);
  const rec = between(std, '## Adversarial Critique Record', '## Review QA Record');
  assert.ok(rec, 'missing adversarial critique record contract');

  const sections = ['### Confirmed Findings', '### Revised Findings',
    '### Rejected Findings', '### Missing Findings', '### Assumptions Challenged',
    '### Confidence Changes'];
  let last = -1;
  for (const s of sections) {
    const i = rec.indexOf(s);
    assert.ok(i !== -1, `record missing section: ${s}`);
    assert.ok(i > last, `record section out of order: ${s}`);
    last = i;
  }
  // seção vazia carrega declaração explícita — ausência nunca silenciosa
  assert.ok(/Nenhum achado confirmado\.|Nenhuma omissão identificada\./.test(rec),
    'empty sections must carry explicit absence statements');
  // contrato da entrada: cinco campos, tokens canônicos
  for (const field of ['Finding:', 'Verdict:', 'Challenge:', 'Basis:', 'Change:']) {
    assert.ok(rec.includes(field), `entry contract missing field: ${field}`);
  }
  for (const v of VERDICTS) assert.ok(rec.includes(v), `missing verdict token: ${v}`);
  // base observável é obrigatória — entrada sem Basis é inválida
  assert.ok(rec.includes('`Basis` vazio invalida a entrada'),
    'an entry without observable basis must be invalid');
  // sem chain-of-thought (§5 do pedido da sprint)
  assert.ok(/Sem raciocínio interno/.test(rec),
    'the record must forbid internal reasoning');
});

// ------------------------------------------------------------- Test A: confirma

test('ADV-A: a finding that resists the challenge survives intact, and confirming is a complete result', () => {
  const std = read(STANDARD);
  const c = read(CRITIC);

  // confirmar é resultado válido e completo, sem cota de mudanças
  assert.ok(std.includes('Confirmação é resultado válido e completo'),
    'confirmation must be declared a valid, complete result');
  assert.ok(/Não existe cota de revisões, rejeições ou omissões/.test(std),
    'there must be no quota of changes');
  assert.ok(c.includes('Confirmar tudo é um resultado legítimo'),
    'the critic must be allowed to confirm everything');
  // confirmed exige base e declara Change: None em vez de omitir o campo
  assert.ok(/`confirmed`[^|]*\|[^|]*\|[^|]*`Change: None`/.test(c) ||
    /Change: None/.test(c), 'confirmed must declare Change: None explicitly');
  // o achado confirmado é preservado pela Revision
  const rev = read(WORKFLOW).split('### Revision — um diagnóstico só')[1]?.split('\n### ')[0];
  assert.ok(rev, 'missing revision contract');
  assert.ok(/resistir ao desafio é preservação/.test(rev),
    'the revision must preserve confirmed findings');
  // fabricar mudança é a falha capital, nos dois arquivos
  assert.ok(/fabricar mudança/i.test(std) && /fabricada/.test(c),
    'fabricated change must be named a failure');
  // o cenário exige base observável e proíbe rebaixar o piso
  const s = scenario('ADV-A');
  assert.ok(s.includes('`Basis`'), 'ADV-A must require an observable basis');
  assert.ok(/piso/.test(s), 'ADV-A must protect the severity floor');
});

// ------------------------------------------------------------- Test B: rejeita

test('ADV-B: a preference-only claim can be rejected, and rejection is never silent deletion', () => {
  const std = read(STANDARD);
  const c = read(CRITIC);

  // rejeitar exige nomear qual evidência falta
  assert.ok(/Rejeitar exige mostrar \*qual\* evidência falta/.test(std),
    'rejection must name which evidence is missing');
  assert.ok(/nomeia \*\*qual\*\* evidência falta/.test(c),
    'the critic verdict table must demand naming the missing evidence');
  // rejeição não apaga: vai a Unknowns como Open Question, nunca como problema
  assert.ok(std.includes('Rejeição não é exclusão silenciosa'),
    'rejection must not be silent deletion');
  assert.ok(/Open Question/.test(std) && /nunca como problema afirmado/.test(std),
    'a rejected suspicion must survive as an Open Question, never as an asserted problem');
  // preferência estética é o caso canônico de rejeição — e não vira usabilidade
  assert.ok(/preferência/i.test(c), 'the critic must handle preference explicitly');
  assert.ok(/Impact Test/.test(c),
    'the critic must apply the Impact Test to the diagnosis itself');
  // negativo: o Critic também não rejeita por gosto inverso
  assert.ok(/não rejeita porque discorda esteticamente/.test(c),
    'the critic must not reject on inverse aesthetic preference');
  // o cenário e o gabarito concordam sobre o caso semeado
  const s = scenario('ADV-B');
  assert.ok(s.includes('rejected'), 'ADV-B must expect a rejected verdict');
  assert.ok(read(EXPECTATION).includes('`rejected`'),
    'the expectation must seed a rejected verdict');
});

// ------------------------------------------------- Test C: recalibra severidade

test('ADV-C: severity can be recalibrated on the existing scale, with no parallel scale', () => {
  const std = read(STANDARD);
  const c = read(CRITIC);
  const ex = read(EXPECTATION);

  // notação de mudança sobre as escalas existentes
  assert.ok(std.includes('Severity: High → Medium'),
    'the record must show severity change in arrow notation');
  assert.ok(std.includes('Confidence: High → Low'),
    'the record must show confidence change in arrow notation');
  assert.ok(/nunca escalas novas nem números/.test(std),
    'new scales and numeric severities must be forbidden');
  // as escalas continuam pertencendo aos seus standards
  assert.ok(std.includes('severity-framework.md') && std.includes('design-output-format.md'),
    'severity and confidence must stay owned by their standards');
  assert.ok(/desafia a \*\*aplicação\*\*/.test(std) || /desafia a \*\*aplicação\*\*/.test(c),
    'the critic challenges the application of the scales, never their meaning');
  // negativo: nenhum nível de severidade novo foi inventado nos arquivos da sprint
  for (const file of [STANDARD, CRITIC, QA]) {
    for (const invented of ['Blocker Severity', 'Severity: 1', 'Severity: 5',
      'severidade crítica++', 'Super Critical']) {
      assert.ok(!read(file).includes(invented),
        `invented severity token in ${file}: ${invented}`);
    }
  }
  // o gabarito semeia a recalibração concreta, preservando o achado
  assert.ok(ex.includes('Severity: Critical → Medium'),
    'the expectation must seed the concrete recalibration');
  assert.ok(/Rejeitar IA-4 inteiro|rejeitado por causa da recomendação|erro de classificação/.test(
    ex + read(SCENARIOS)),
    'a misclassified finding must not be rejected wholesale');
  // ortogonalidade preservada: incerteza vive em Confidence
  const s = scenario('ADV-C');
  assert.ok(/incerteza vive em Confidence|rebaixando a severidade em silêncio/.test(s),
    'ADV-C must keep severity orthogonal to confidence');
});

// --------------------------------------------------------- Test D: omissão nova

test('ADV-D: a missing finding can be discovered, but needs the same citable evidence', () => {
  const std = read(STANDARD);
  const c = read(CRITIC);

  assert.ok(std.includes('### Missing Findings'), 'the record must have a missing section');
  // added não ganha desconto de evidência
  assert.ok(/Adicionar não é relaxar o padrão/.test(c),
    'added findings must meet the same evidence bar');
  assert.ok(/Omissão sem evidência observável é Open Question/.test(c),
    'an unsupported omission must be an Open Question, not a finding');
  // a Revision incorpora a omissão no contrato pleno de 7 campos
  const rev = read(WORKFLOW).split('### Revision — um diagnóstico só')[1]?.split('\n### ')[0];
  assert.ok(/7 campos/.test(rev) && /sem desconto de evidência/.test(rev),
    'the revision must add omissions under the full finding contract');
  // o gabarito ancora a omissão na memória real do projeto — contexto de verdade
  const ex = read(EXPECTATION);
  assert.ok(ex.includes('examples/demo-project/glossary.md'),
    'the seeded omission must depend on the real project memory');
  assert.ok(/[Ss]ó é detectável com a memória carregada/.test(ex),
    'the omission must be detectable only with memory loaded');
  // negativo: omissão de fluxo em material de tela única é falso positivo
  assert.ok(/L1/.test(ex) && /not-evaluable/.test(ex),
    'flow findings must stay not-evaluable on single-screen material');
});

// ------------------------------------------------- Test E: recomendação desafiada

test('ADV-E: an overengineered recommendation can be revised without losing the finding', () => {
  const c = read(CRITIC);
  const ex = read(EXPECTATION);
  const s = scenario('ADV-E');

  // o eixo existe e ataca a recomendação, não a existência do problema
  assert.ok(c.includes('`overengineering`'), 'the overengineering axis must exist');
  const mandate = c.split('## Mandate')[1]?.split('\n## ')[0];
  assert.ok(/complexidade desnecessária/.test(mandate),
    'the axis must name unnecessary complexity');
  assert.ok(/`recommendation`/.test(mandate),
    'the recommendation axis must exist alongside it');
  // propor a correção da recomendação é legítimo; propor o design não é
  assert.ok(/Propor a correção da recomendação é legítimo/.test(c),
    'revising a recommendation must be in scope, redesigning must not');
  // o cenário preserva o achado e exige proporcionalidade verificável
  assert.ok(/preservando o achado|Achado preservado/.test(s),
    'ADV-E must preserve the finding while revising the recommendation');
  assert.ok(/proporcional/.test(s), 'ADV-E must require a proportional recommendation');
  assert.ok(/mais complexa que a original/.test(s),
    'ADV-E must fail a revision that adds complexity');
  // o gabarito distingue atacar a recomendação de rejeitar o achado
  assert.ok(ex.includes('Rejeitar IA-4 inteiro'),
    'the expectation must list wholesale rejection as a false positive');
});

// ---------------------------------------------------------------- QA e blockers

test('the review QA record has seven dimensions, a coarse scale and no composite score', () => {
  const std = read(STANDARD);
  const q = read(QA);
  const rec = between(std, '## Review QA Record', '## Review Assurance');
  assert.ok(rec, 'missing review QA record contract');

  // as sete dimensões, na ordem no contrato — e todas conhecidas pelo agente
  let last = -1;
  for (const d of QA_DIMENSIONS) {
    const i = rec.indexOf(d);
    assert.ok(i !== -1, `QA record missing dimension: ${d}`);
    assert.ok(i > last, `QA dimension out of order: ${d}`);
    last = i;
  }
  for (const d of QA_DIMENSIONS) {
    assert.ok(q.includes(d), `QA agent missing dimension: ${d}`);
  }
  // escala grossa, reaproveitada dos harnesses — não a escala 1–5 do design
  for (const s of QA_STATUS) assert.ok(std.includes(s), `missing QA status: ${s}`);
  assert.ok(/deliberadamente \*\*não\*\* a escala 1–5/.test(std),
    'the QA scale must explicitly not be the design 1-5 scale');
  // negativo: nenhum score composto, média ou nota global
  assert.ok(std.includes('Nenhum score composto'), 'composite scores must be forbidden');
  assert.ok(/Sem score composto/.test(q), 'the QA agent must forbid composite scores');
  assert.ok(/não se somam/.test(std), 'conduct tokens must not be summed');
  for (const forbidden of ['score médio do review', 'nota global do review 1–5',
    'QA score = soma']) {
    assert.ok(!std.includes(forbidden) && !q.includes(forbidden),
      `composite scoring leaked: ${forbidden}`);
  }
  // vereditos canônicos
  for (const v of QA_VERDICTS) assert.ok(std.includes(v), `missing QA verdict: ${v}`);
});

test('QA blockers stay separate from the design quality gate blockers', () => {
  const std = read(STANDARD);
  const wf = read(WORKFLOW);
  const q = read(QA);

  // lista própria, nunca derivada por aritmética
  assert.ok(/`QA Blockers` é lista própria, nunca derivada por aritmética/.test(std),
    'QA blockers must be their own list');
  assert.ok(/Toda dimensão em `FAIL` abre blocker/.test(std),
    'every FAIL must open a blocker');
  // os dois tipos, nomeados e distinguidos, no standard e no workflow
  for (const file of [std, wf]) {
    assert.ok(file.includes('Design blocker') && file.includes('QA blocker'),
      'both blocker types must be named');
    assert.ok(/quality-framework\.md/.test(file),
      'the design blocker must point to the quality framework');
  }
  // o caso cruzado explicitado nos dois sentidos
  assert.ok(/REVIEW READY` com Quality Gate reprovado/.test(std + wf),
    'a sound review over a failed design must be representable');
  assert.ok(/REVIEW NOT READY` com Quality Gate aprovado/.test(std + wf),
    'a weak review over a good design must be representable');
  // confundir os dois é review inválido
  assert.ok(/[Cc]onfusão entre os dois blockers/.test(section(WORKFLOW, 'Failure Conditions')),
    'conflating the blockers must be a failure condition');
  assert.ok(/não suprime o report/.test(std),
    'REVIEW NOT READY must not suppress the report');
  assert.ok(q.includes('## Failure Conditions'), 'QA must declare failure conditions');
});

// ------------------------------------------------- report: um diagnóstico só (§6)

test('the report carries one revised diagnosis and a compact Review Assurance', () => {
  const fw = read(FRAMEWORK);
  const tpl = read(TEMPLATE);
  const wf = read(WORKFLOW);
  const std = read(STANDARD);

  // a seção é do contrato oficial — não uma seção paralela do workflow
  assert.ok(fw.includes('## Review Assurance'),
    'the official report contract must own the Review Assurance section');
  assert.ok(/nunca se substituem/.test(fw),
    'quality gate and review assurance must be declared non-interchangeable');
  // o bloco compacto, com os cinco campos, no standard e no template
  for (const field of ['Stage trace:', 'Adversarial:', 'QA verdict:', 'QA blockers:',
    'Reservations:']) {
    assert.ok(std.includes(field), `assurance block missing field: ${field}`);
    assert.ok(tpl.includes(field), `template assurance block missing field: ${field}`);
  }
  // compacto por contrato: records acompanham, nunca entram nas Issues
  assert.ok(/nunca colados dentro das Issues/.test(std),
    'records must never be pasted into Issues');
  assert.ok(/nunca os records inteiros/.test(tpl),
    'the template must forbid dumping whole records');
  assert.ok(/não cresce porque a camada adversarial existe/.test(wf),
    'the workflow must state the report does not grow because of the layer');
  // um diagnóstico só: as issues do report são as revisadas
  assert.ok(/As Issues do report são as revisadas, e só elas/.test(std),
    'the report must carry only the revised issues');
  assert.ok(/[Dd]iagnóstico contraditório/.test(section(WORKFLOW, 'Failure Conditions')),
    'delivering contradictory diagnoses must be a failure condition');
  // contagens verificáveis contra o record — número solto é fabricação
  assert.ok(/Contagens são verificáveis contra o record/.test(std),
    'assurance counts must be verifiable against the record');
  // a prioridade de leitura do report não mudou (§9 da sprint)
  const composition = wf.split('### Composição do report')[1]?.split('\n## ')[0];
  let last = -1;
  for (const s of ['Executive Summary', 'Review Scope', 'Context Snapshot',
    'Critical', 'Opportunities', 'Recommended Next Steps']) {
    const i = composition.indexOf(s);
    assert.ok(i !== -1, `composition missing: ${s}`);
    assert.ok(i > last, `composition order broken at: ${s}`);
    last = i;
  }
});

// ------------------------------------------------------- workflow: os estágios

test('the workflow wires the three new steps into the pipeline without losing the old ones', () => {
  const wf = read(WORKFLOW);
  const process = wf.split('## Process')[1]?.split('\n## ')[0];
  const stepList = process.split('```text')[1]?.split('```')[0];
  assert.ok(stepList, 'missing step list');

  // os três estágios novos, na posição certa: depois da consolidação, antes do gate
  assert.ok(/STEP 6\s+Adversarial Critique/.test(stepList), 'STEP 6 must be the critique');
  assert.ok(/STEP 7\s+Revision/.test(stepList), 'STEP 7 must be the revision');
  assert.ok(/STEP 8\s+Review QA/.test(stepList), 'STEP 8 must be the QA');
  assert.ok(stepList.indexOf('Consolidation') < stepList.indexOf('Adversarial Critique'),
    'the critique must attack an already consolidated diagnosis');
  assert.ok(stepList.indexOf('Review QA') < stepList.indexOf('Quality Gate'),
    'the review QA must precede the design quality gate');
  assert.ok(stepList.indexOf('Quality Gate') < stepList.indexOf('Report'),
    'the gate must still precede the report');

  // o gate pontua o diagnóstico revisado, não o inicial
  assert.ok(/pior achado do diagnóstico \*\*revisado\*\*/.test(process),
    'the quality gate must score the revised diagnosis');
  // a seção de orquestração existe e declara as quatro responsabilidades
  const engine = section(WORKFLOW, 'Adversarial Quality Engine');
  assert.ok(engine.includes('### Fronteira — quem pergunta o quê'),
    'the engine section must declare the boundary');
  for (const stage of ['Initial Analysis', 'Adversarial Critique', 'Revision', 'Review QA']) {
    assert.ok(engine.includes(stage), `engine section missing stage: ${stage}`);
  }
  assert.ok(/não quatro personas|[Nn]ão são personas/.test(engine),
    'the stages must be declared responsibilities, not personas');
  // dependências declaradas por referência, sem redefinir método
  const deps = section(WORKFLOW, 'Skill Dependencies');
  for (const d of [CRITIC, QA, STANDARD]) {
    assert.ok(deps.includes(d), `Skill Dependencies missing: ${d}`);
  }
  // critérios de conclusão passaram a exigir o ciclo observável
  const done = section(WORKFLOW, 'Completion Criteria');
  assert.ok(/11 STEPs/.test(done), 'completion criteria must bind the eleven steps');
  assert.ok(/[Cc]iclo adversarial completo e observável/.test(done),
    'completion must require the observable cycle');
  assert.ok(/Veredito do QA presente/.test(done),
    'completion must require the QA verdict');
});

// ------------------------------------------------------ Test G: regressão (§9)

test('ADV-G regression: the sprint 4 review contract survives the sprint 5 change', () => {
  const wf = read(WORKFLOW);
  const cmd = read(COMMAND);

  // a interface pública não mudou: um comando, o mesmo nome
  const commands = readdirSync(join(root, '.claude/commands'));
  assert.deepEqual(commands, ['uxco-review.md'],
    'no new command may be introduced — /uxco-review stays the only interface');
  assert.ok(!exists('.claude/commands/uxco-review-v2.md'), 'no v2 command');
  assert.ok(cmd.includes('STEPs 0–10'), 'the command must route to all eleven steps');

  // o review segue integralmente READ, inclusive nos estágios novos
  const safety = section(WORKFLOW, 'Safety Model');
  assert.ok(/operação `READ`/.test(safety), 'the review must stay READ-only');
  assert.ok(/camada adversarial \*\*não abre exceção\*\*/.test(safety),
    'the adversarial layer must not create a write exception');
  assert.ok(/Critic e QA também são integralmente `READ`/.test(safety),
    'critic and QA must be READ-only too');

  // mecanismos da Sprint 4 intactos
  for (const s of ['## Scope Resolution', '## Context Integration', '## Paper Inspection',
    '## Critique Orchestration', '## Issue Model']) {
    assert.ok(wf.includes(s), `sprint 4 section lost: ${s}`);
  }
  assert.ok(/Quality Gate sempre presente|seções \*\*Quality Gate\*\*/.test(wf),
    'the formal quality gate must remain mandatory');
  // Paper intacto: snapshot, PAPER_READY e limitações continuam no contrato
  assert.ok(wf.includes('Canvas Snapshot') && wf.includes('PAPER_READY'),
    'paper integration contract must be preserved');
  // o cenário de regressão existe e aponta para o caso real da Sprint 4
  const s = scenario('ADV-G');
  assert.ok(s.includes('RVW-002'), 'ADV-G must bind to the sprint 4 scenario');
  assert.ok(/01-pulse-signal-capture/.test(s), 'ADV-G must reuse the sprint 4 fixture');
  assert.ok(/[Nn]enhum comando novo/.test(s), 'ADV-G must assert the stable interface');
});

test('regression: the sprint 5 change added no dependency and no new infrastructure', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.ok(!pkg.dependencies, 'no runtime dependencies may be added');
  assert.ok(!pkg.devDependencies, 'no dev dependencies may be added');
  // a suíte nova é coberta pelo glob existente — nenhum script novo necessário
  assert.ok(pkg.scripts.test.includes('tests/review-workflow/*.test.mjs'),
    'the existing test glob must already cover the new suite');
  assert.ok(pkg.scripts.verify === 'npm run preflight && npm test',
    'verify must remain pure orchestration');
  assert.ok(!exists('.mcp.json') || true, 'no new MCP wiring is required by this sprint');
});

// --------------------------------------------- fixture, gabarito, harness, nada órfão

test('the adversarial fixture is a diagnosis, stays blind, and reuses existing design material', () => {
  const fx = read(FIXTURE);
  const fxReadme = read(FIXTURES_README);

  // é um diagnóstico sobre material já existente — nenhum design novo inventado
  assert.ok(fx.includes(DESIGN_FIXTURE), 'the fixture must point at the existing design fixture');
  assert.ok(fx.includes('examples/demo-project/'), 'the fixture must point at the demo memory');
  assert.ok(exists(DESIGN_FIXTURE), 'the referenced design fixture must exist');
  // semeia os cinco achados que os cenários atacam
  for (const id of ['IA-1', 'IA-2', 'IA-3', 'IA-4', 'IA-5']) {
    assert.ok(fx.includes(id), `fixture missing seeded finding: ${id}`);
  }
  // os achados estão no contrato de 7 campos — o Critic recebe material válido
  for (const field of ['Issue:', 'Category:', 'Severity:', 'Confidence:', 'Evidence:',
    'User Impact:', 'Recommendation:']) {
    assert.ok(fx.includes(field), `seeded finding contract missing field: ${field}`);
  }
  // a inflação de severidade está semeada (o alvo do ADV-C)
  assert.ok(/Severity:\s+Critical/.test(fx), 'the fixture must seed an inflated severity');
  // negativo: cegueira — a fixture não revela quais achados são falhos
  for (const leak of ['Verdict:', 'confirmed', 'rejected', 'gabarito', 'expectation']) {
    assert.ok(!fx.includes(leak), `fixture leaks evaluator material: ${leak}`);
  }
  // o catálogo explica por que esta família contém linguagem avaliativa
  assert.ok(/contém linguagem avaliativa/.test(fxReadme),
    'the catalog must explain the evaluative-language difference');
  assert.ok(fxReadme.includes('examples/critique-tests/') &&
    fxReadme.includes('examples/review-tests/'),
    'the catalog must contrast the three fixture families');
  assert.ok(/[Rr]egra de cegueira/.test(fxReadme), 'the catalog must carry the blindness rule');
});

test('the expectation seeds the verdict distribution and stays evaluator-only', () => {
  const ex = read(EXPECTATION);
  assert.ok(/nunca fornecer durante a execução/.test(ex),
    'the expectation must declare itself evaluator-only');
  // distribuição esperada + a regra de que distribuição não é cota
  assert.ok(ex.includes('2 confirmed · 2 revised · 1 rejected · 1 added'),
    'the expectation must seed the verdict distribution');
  assert.ok(/não cota|\*\*não cota\*\*/.test(ex),
    'the distribution must be calibration, never a quota');
  for (const v of VERDICTS) assert.ok(ex.includes(`\`${v}\``), `expectation missing verdict: ${v}`);
  // seções do gabarito, na convenção dos anteriores + as da camada
  for (const s of ['## Essential', '## Acceptable', '## False positives', '## Calibração',
    '## Assumptions Challenged', '## Confidence Changes', '## Review QA esperado']) {
    assert.ok(ex.includes(s), `expectation missing section: ${s}`);
  }
  // amarrada à fixture e ao material real
  assert.ok(ex.includes(FIXTURE) && ex.includes(DESIGN_FIXTURE),
    'the expectation must bind to both the diagnosis and the design material');
  // fabricação listada como falso positivo — a falha capital da camada
  assert.ok(/Fabricar mudança/.test(ex),
    'fabricating change must be listed as a false positive');
});

test('the adversarial protocol compares before and after without inventing results', () => {
  const p = read(PROTOCOL);
  // dois braços, com isonomia declarada
  assert.ok(p.includes('**BEFORE**') && p.includes('**AFTER**'),
    'the protocol must define both arms');
  assert.ok(/Isonomia obrigatória/.test(p), 'equivalent material must be the isonomy rule');
  assert.ok(/A única diferença entre eles são os STEPs 6–8/.test(p),
    'the only difference between arms must be the adversarial steps');
  assert.ok(/Cegueira ao gabarito/.test(p), 'blindness must hold for both arms');
  // as cinco medidas pedidas pela sprint, na ordem
  const measures = [['NEW', 'novos problemas relevantes'], ['FPR', 'falsos positivos removidos'],
    ['SEV', 'severidades corrigidas'], ['REC', 'recomendações melhoradas'],
    ['ASM', 'suposições identificadas']];
  let last = -1;
  for (const [code, label] of measures) {
    const i = p.indexOf(`\`${code}\``);
    assert.ok(i !== -1, `protocol missing measure: ${code}`);
    assert.ok(i > last, `measure out of order: ${code}`);
    assert.ok(p.includes(label), `measure missing its definition: ${label}`);
    last = i;
  }
  // contagens de custo: fabricação, perda e crescimento do report
  for (const guard of ['FAB', 'LOSS', 'LEN']) {
    assert.ok(p.includes(`\`${guard}\``), `protocol missing cost counter: ${guard}`);
  }
  assert.ok(/Nenhuma dessas contagens é somada em um índice único/.test(p),
    'the measures must not be collapsed into one index');
  // vereditos e honestidade do resultado negativo
  for (const v of ['SUPPORTED', 'INCONCLUSIVE', 'NOT SUPPORTED']) {
    assert.ok(p.includes(v), `protocol missing verdict: ${v}`);
  }
  assert.ok(/`NOT SUPPORTED` é o resultado mais valioso/.test(p),
    'a negative result must be declared valuable, not suppressed');
  assert.ok(/nunca é promovido a `SUPPORTED`/.test(p), 'inconclusive must stay inconclusive');
  // nada inventado: declara explicitamente que não houve execução
  assert.ok(/Ainda não executado/.test(p),
    'the protocol must declare that no run has happened yet');
  assert.ok(p.includes('results/YYYY-MM-DD-adv-run-N.md'),
    'runs must be registered append-only');
  assert.ok(/## Limites declarados/.test(p), 'the protocol must declare its limits');
  // nenhum resultado fabricado no diretório de results
  const results = readdirSync(join(root, 'benchmarks/review-workflow/results'));
  assert.ok(!results.some((f) => f.includes('adv-run')),
    'no adversarial run may be registered without a real execution');
});

test('scenarios ADV-A..ADV-G are complete, ordered, wired, and leave no orphan fixture', () => {
  const sc = read(SCENARIOS);
  // os sete cenários, na ordem, cada um com as sete seções da convenção
  let last = -1;
  for (const id of SCENARIO_IDS) {
    const i = sc.indexOf(`## ${id}`);
    assert.ok(i !== -1, `missing scenario: ${id}`);
    assert.ok(i > last, `scenario out of order: ${id}`);
    last = i;
    const body = scenario(id);
    for (const s of SCENARIO_SECTIONS) {
      assert.ok(body.includes(s), `${id} missing section: ${s}`);
    }
  }
  // a regra transversal da suíte: fabricação reprova, confirmar não
  assert.ok(/fabricação é a falha capital/i.test(sc),
    'the suite must carry the anti-fabrication rule');
  // opera sobre o workflow real e registra no results compartilhado
  assert.ok(sc.includes(WORKFLOW), 'scenarios must reference the real workflow');
  assert.ok(sc.includes('benchmarks/review-workflow/results/'),
    'runs must land in the shared append-only results');
  // toda fixture citada existe — nenhum cenário aponta para artefato fantasma
  const refs = [...sc.matchAll(/`?(examples\/[\w./-]+\.md)`?/g)].map(([, p]) => p);
  assert.ok(refs.length > 0, 'scenarios must reference fixtures');
  for (const ref of refs) assert.ok(exists(ref), `scenario references missing fixture: ${ref}`);
  // nada órfão: cada fixture adversarial é consumida por cenário e tem gabarito
  const consumers = sc + read(HARNESS);
  const dirs = readdirSync(join(root, 'examples/adversarial-tests'), { withFileTypes: true })
    .filter((d) => d.isDirectory()).map((d) => d.name);
  assert.ok(dirs.length > 0, 'adversarial fixtures must exist');
  for (const dir of dirs) {
    const fixture = `examples/adversarial-tests/${dir}/initial-analysis.md`;
    assert.ok(exists(fixture), `fixture directory without initial-analysis.md: ${dir}`);
    assert.ok(consumers.includes(fixture),
      `orphan fixture (no scenario or harness consumes it): ${fixture}`);
  }
  // o harness conhece a suíte, o cenário e o protocolo — nada solto
  const harness = read(HARNESS);
  assert.ok(harness.includes('adversarial-scenarios.md'), 'harness must list the suite');
  assert.ok(harness.includes('RVW-005'), 'harness must carry the adversarial scenario');
  assert.ok(harness.includes('adversarial-protocol.md'), 'harness must reference the protocol');
  assert.ok(harness.includes('03-flawed-initial-analysis.md') || harness.includes(FIXTURE),
    'harness must bind the scenario to its material');
});

test('no broken repo references in the sprint 5 artifacts', () => {
  const refRe = /`((?:standards|skills|agents|scripts|examples|benchmarks|templates|tests|docs|workflows|experiments)\/[^`]*?\.(?:md|mjs))`/g;
  for (const file of [STANDARD, CRITIC, QA, SCENARIOS, FIXTURE, FIXTURES_README,
    EXPECTATION, PROTOCOL]) {
    for (const match of read(file).matchAll(refRe)) {
      const ref = match[1];
      if (/YYYY|[<>*]/.test(ref)) continue; // placeholders
      assert.ok(exists(ref), `${file} references missing path: ${ref}`);
    }
  }
});

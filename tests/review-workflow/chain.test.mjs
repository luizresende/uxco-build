// Contrato da cadeia do /uxco-review: manifesto, schemas e gates executados
// pelo validador. Conduta de uma sessão real continua sendo AGENT EVALUATION.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BLOCKED_MESSAGE, checkManifest } from '../../scripts/chain.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const read = (path) => readFileSync(join(root, path), 'utf8');
const manifest = JSON.parse(read('workflows/review/manifest.json'));

function run(args, files = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'uxco-chain-'));
  for (const [name, value] of Object.entries(files)) {
    writeFileSync(join(dir, name), typeof value === 'string' ? value : JSON.stringify(value));
  }
  const result = spawnSync(process.execPath, [join(root, 'scripts/chain.mjs'), ...args], {
    cwd: root,
    encoding: 'utf8',
  });
  return result;
}

function validate(step, artifact, priors = {}, extra = []) {
  const files = { [`${step}.json`]: artifact };
  const args = ['validate', '--step', step, '--artifact', join(tmpdir(), 'unused')];
  // paths are filled after we know the temp dir — rebuild inside run-like helper
  const dir = mkdtempSync(join(tmpdir(), 'uxco-chain-'));
  writeFileSync(join(dir, `${step}.json`), JSON.stringify(artifact));
  const priorArgs = [];
  for (const [name, value] of Object.entries(priors)) {
    writeFileSync(join(dir, `${name}.json`), JSON.stringify(value));
    priorArgs.push('--prior', `${name}=${join(dir, `${name}.json`)}`);
  }
  for (const [name, value] of Object.entries(extra)) {
    writeFileSync(join(dir, name), typeof value === 'string' ? value : JSON.stringify(value));
  }
  return spawnSync(process.execPath, [
    join(root, 'scripts/chain.mjs'), 'validate',
    '--step', step,
    '--artifact', join(dir, `${step}.json`),
    ...priorArgs,
  ], { cwd: root, encoding: 'utf8' });
}

const layer = (status = 'evaluated', reason = '') => ({ status, reason });
const layers = () => Object.fromEntries(['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8']
  .map((id) => [id, layer()]));

function issue(overrides = {}) {
  return {
    id: 'I1',
    issue: 'O botão de confirmar não diz o que será apagado.',
    category: 'L4',
    severity: 'High',
    confidence: 'High',
    evidence: 'O rótulo visível é apenas Confirmar, ao lado da lista.',
    userImpact: 'A pessoa pode apagar a tarefa sem perceber.',
    recommendation: 'Trocar o rótulo para Apagar tarefa.',
    ...overrides,
  };
}

function scope(overrides = {}) {
  return {
    step: 'scope',
    status: 'resolved',
    haltReason: null,
    artifactKind: 'text',
    needsCanvas: false,
    needsFlowSkill: false,
    openQuestion: null,
    scope: {
      type: 'screen',
      name: 'Fila',
      source: 'explicit',
      includes: ['tela única'],
      confidence: 'High',
      ambiguities: [],
      basis: '',
    },
    ...overrides,
  };
}

function analyze(overrides = {}) {
  return {
    step: 'analyze',
    marker: 'INITIAL_ANALYSIS',
    layers: layers(),
    interactionDesign: 'not-applicable',
    behavioralSmell: null,
    issues: [issue()],
    opportunities: [],
    ...overrides,
  };
}

const entry = (overrides = {}) => ({
  finding: 'I1',
  verdict: 'confirmed',
  challenge: 'O rótulo sustenta o diagnóstico.',
  basis: 'O texto visível do botão é Confirmar.',
  change: null,
  ...overrides,
});

function challenge(overrides = {}) {
  return {
    step: 'challenge',
    marker: 'ADVERSARIAL_REVIEW',
    cyclePass: 1,
    rerun: false,
    confirmed: [entry()],
    revised: [],
    rejected: [],
    missing: [],
    assumptionsChallenged: [],
    confidenceChanges: [],
    revisionMarker: 'REVISION',
    issues: [issue()],
    opportunities: [],
    accounted: [],
    mechanismsReapplied: ['dedupe', 'priority'],
    ...overrides,
  };
}

const designDimension = (critical) => ({ score: 4, critical });

function closeArtifact(overrides = {}) {
  const dimensions = {};
  for (const key of ['contextFit', 'clarity', 'usability', 'interaction', 'completeness',
    'consistency', 'accessibility', 'visualHierarchy', 'content', 'rationale']) {
    dimensions[key] = designDimension(['contextFit', 'usability', 'completeness', 'accessibility'].includes(key));
  }
  return {
    step: 'close',
    marker: 'FINAL_QA',
    cyclePass: 1,
    rerun: false,
    qa: {
      dimensions: {
        contextGrounding: 'PASS',
        evidenceQuality: 'PASS',
        severityCalibration: 'PASS',
        actionability: 'PASS',
        completeness: 'PASS',
        accessibilityCoverage: 'PASS',
        systemConsistency: 'PASS',
      },
      verdict: 'REVIEW READY',
      blockers: [],
      compositeScore: null,
    },
    qualityGate: {
      dimensions,
      verdict: 'pass',
      designBlockers: [],
      riskAccepted: false,
      decision: '',
      qualifiedByQa: false,
    },
    reviewLimitations: {
      missingContext: [],
      integrationLimits: [],
      assumptions: [],
      humanValidation: [],
    },
    stageTrace: ['INITIAL_ANALYSIS', 'ADVERSARIAL_REVIEW', 'REVISION', 'FINAL_QA'],
    counts: { confirmed: 1, revised: 0, rejected: 0, added: 0 },
    reportFile: 'report.md',
    ...overrides,
  };
}

const report = `# Design Critique Report

## Executive Summary

Uma tela, um problema de rótulo, risco local, prioridade no botão.

## Issues

### High

I1 permanece.

## Patterns Detected

Nenhum padrão detectado.

## Opportunities

Nenhuma Opportunity identificada.

## Unknowns and Assumptions

Nenhuma lacuna além do que o coverage declara.

## Layer Coverage

L0 evaluated.

## Quality Gate

pass

## Review Assurance

INITIAL_ANALYSIS → ADVERSARIAL_REVIEW → REVISION → FINAL_QA
REVIEW READY

## Recommended Next Steps

1. Trocar o rótulo do botão.
`;

test('the comparison file matches a fresh measure and the frozen baseline stays put', () => {
  const baselinePath = 'benchmarks/harness-refactor/baseline.md';
  const before = read(baselinePath);
  assert.ok(before.includes('<!-- snapshot: frozen -->'));
  assert.ok(before.includes('| Teto eager (união) | 20 | 33856 |'));
  const fresh = spawnSync(process.execPath, [join(root, 'scripts/measure-context.mjs'), '--compare'], {
    cwd: root, encoding: 'utf8',
  });
  assert.equal(fresh.status, 0, fresh.stderr);
  assert.equal(read('benchmarks/harness-refactor/chain-vs-baseline.md'), fresh.stdout);
  const refused = spawnSync(process.execPath, [
    join(root, 'scripts/measure-context.mjs'), '--compare', '--write', baselinePath,
  ], { cwd: root, encoding: 'utf8' });
  assert.equal(refused.status, 1, refused.stderr);
  assert.equal(read(baselinePath), before);
});

test('chain check accepts the manifest and rejects a missing context file only by failing check', () => {
  const ok = spawnSync(process.execPath, [join(root, 'scripts/chain.mjs'), 'check'], {
    cwd: root, encoding: 'utf8',
  });
  assert.equal(ok.status, 0, ok.stderr);
  assert.match(ok.stdout, /ok: uxco-review \(6 steps\)/);
});

test('every phase declares existing context, a wired gate, and less than the whole corpus', () => {
  const universe = new Set();
  for (const step of manifest.steps) {
    for (const entry of step.context) universe.add(entry.path);
    assert.ok(read(step.prompt).length > 200, `${step.id} prompt is empty`);
    assert.equal(JSON.parse(read(step.schema)).properties.step.const, step.id);
    for (const gate of step.gate) assert.ok(manifest.gates.includes(gate), gate);
  }
  for (const step of manifest.steps) {
    const mine = new Set(step.context.map((entry) => entry.path));
    if (universe.size > 1) {
      assert.ok(mine.size < universe.size, `${step.id} loads the whole context corpus`);
    }
    for (const entry of step.context) {
      assert.equal(read(entry.path).length > 0, true, entry.path);
      const words = read(entry.path).match(/\S+/g)?.length ?? 0;
      assert.ok(words <= 400, `${entry.path} is ${words} words; phase context caps at 400`);
    }
  }
  const inspect = manifest.steps.find((step) => step.id === 'inspect');
  assert.equal(inspect.touchesPaper, true);
  assert.equal(inspect.when, 'canvas');
  assert.ok(inspect.context.some((entry) => entry.path === 'docs/constitution/canvas-safety.md'));
  for (const step of manifest.steps) {
    if (step.touchesPaper) continue;
    assert.ok(!step.context.some((entry) => entry.path.endsWith('canvas-safety.md')), step.id);
  }
  const loaded = manifest.steps.flatMap((step) => step.context.map((entry) => entry.path));
  assert.ok(!loaded.includes('skills/interaction-design/SKILL.md'));
  assert.ok(!loaded.includes('standards/critique-framework.md'));
  assert.ok(read('workflows/review/steps/analyze.md').includes('skills/interaction-design/SKILL.md'));
  const heavy = structuredClone(manifest);
  heavy.steps.find((step) => step.id === 'analyze').context.push({ path: 'standards/critique-framework.md' });
  assert.ok(checkManifest(heavy).some((error) => error.includes('400 palavras')));
  assert.equal(manifest.mode, 'READ');
  assert.ok(!JSON.stringify(manifest).includes('scripts/context-loader.mjs'));
  assert.deepEqual(manifest.always, ['CLAUDE.md']);
});

test('scope halt is a valid stop and an invented resolution is invalid', () => {
  const halted = scope({
    status: 'halt',
    haltReason: 'unresolved-scope',
    artifactKind: 'text',
    openQuestion: { blocking: true, text: 'Fila ou detalhe?' },
    scope: {
      type: 'UNKNOWN', name: 'UNKNOWN', source: 'UNKNOWN', includes: [], confidence: 'Low',
      ambiguities: ['fila', 'detalhe'], basis: '',
    },
  });
  const stop = validate('scope', halted);
  assert.equal(stop.status, 2, stop.stderr);

  const broken = scope();
  broken.scope.type = 'UNKNOWN';
  const bad = validate('scope', broken);
  assert.equal(bad.status, 1, bad.stderr);
});

test('paper-only source blocks with the canonical message and a skipped inspect cannot pretend to have read', () => {
  const canvasScope = scope({ artifactKind: 'canvas', needsCanvas: true });
  const blocked = {
    step: 'inspect', status: 'halt', paperReady: false, haltReason: 'paper-only-blocked',
    blockedMessage: BLOCKED_MESSAGE, snapshot: null,
  };
  const stop = validate('inspect', blocked, { scope: canvasScope });
  assert.equal(stop.status, 2, stop.stderr);
  assert.equal(stop.stdout, `${BLOCKED_MESSAGE}\n`);

  const skipped = {
    step: 'inspect', status: 'skipped', paperReady: null, haltReason: null,
    blockedMessage: null, snapshot: null,
  };
  const lie = validate('inspect', skipped, { scope: canvasScope });
  assert.equal(lie.status, 1, lie.stderr);

  const textSkip = validate('inspect', skipped, { scope: scope() });
  assert.equal(textSkip.status, 0, textSkip.stderr);
});

test('evidence gate rejects a finding on a not-evaluable layer and a principle-only evidence', () => {
  const body = analyze();
  body.layers.L4 = layer('not-evaluable', 'sem texto');
  const hidden = validate('analyze', body, { scope: scope() });
  assert.equal(hidden.status, 1, hidden.stderr);

  const weak = analyze();
  weak.issues[0].evidence = 'Isso viola boas práticas.';
  const principle = validate('analyze', weak, { scope: scope() });
  assert.equal(principle.status, 1, principle.stderr);

  const flow = scope();
  flow.needsFlowSkill = true;
  flow.scope.type = 'flow';
  const missingSkill = validate('analyze', analyze(), { scope: flow });
  assert.equal(missingSkill.status, 1, missingSkill.stderr);
});

test('the adversarial cycle is one pass and a rejected finding cannot remain a problem', () => {
  const prior = { analyze: analyze() };
  const second = challenge({ cyclePass: 2 });
  const again = validate('challenge', second, prior);
  assert.equal(again.status, 1, again.stderr);

  const uncovered = challenge({ confirmed: [] });
  const gap = validate('challenge', uncovered, prior);
  assert.equal(gap.status, 1, gap.stderr);

  const empty = analyze({ issues: [] });
  const still = validate('challenge', challenge({ confirmed: [], issues: [] }), { analyze: empty });
  assert.equal(still.status, 0, still.stderr);

  const kept = validate('challenge', challenge({
    confirmed: [],
    rejected: [entry({ verdict: 'rejected' })],
    issues: [issue()],
    accounted: [],
  }), { analyze: analyze() });
  assert.equal(kept.status, 1, kept.stderr);
});

test('QA blocker and design blocker stay in separate fields and a failing QA still requires the report', () => {
  const priors = { challenge: challenge() };
  const body = closeArtifact();
  body.qa.dimensions.evidenceQuality = 'FAIL';
  body.qa.verdict = 'REVIEW READY';
  const lied = validate('close', body, priors, { 'report.md': report });
  assert.equal(lied.status, 1, lied.stderr);

  body.qa.verdict = 'REVIEW NOT READY';
  body.qa.blockers = ['evidenceQuality'];
  body.qualityGate.qualifiedByQa = false;
  const hidden = validate('close', body, priors, { 'report.md': report });
  assert.equal(hidden.status, 1, hidden.stderr);

  body.qualityGate.qualifiedByQa = true;
  body.qualityGate.designBlockers = ['contextGrounding'];
  const mixed = validate('close', body, priors, { 'report.md': report.replace('REVIEW READY', 'REVIEW NOT READY') });
  assert.equal(mixed.status, 1, mixed.stderr);

  body.qualityGate.designBlockers = [];
  const shown = validate('close', body, priors, {
    'report.md': report.replace('REVIEW READY', 'REVIEW NOT READY\nevidenceQuality'),
  });
  assert.equal(shown.status, 0, shown.stderr);

  const scored = closeArtifact();
  scored.qa.compositeScore = 4;
  const composite = validate('close', scored, priors, { 'report.md': report });
  assert.equal(composite.status, 1, composite.stderr);
});

test('a text review run validates end to end and stops when scope halts', () => {
  const dir = mkdtempSync(join(tmpdir(), 'uxco-run-'));
  const files = {
    'scope.json': scope(),
    'inspect.json': {
      step: 'inspect', status: 'skipped', paperReady: null, haltReason: null,
      blockedMessage: null, snapshot: null,
    },
    'ground.json': {
      step: 'ground', status: 'proceed', haltReason: null, contextStatus: 'PROCEED',
      continueDespiteBlocking: false, answersInvented: false, blockingQuestions: [],
      brief: {
        confirmed: ['A fila é a tarefa.'], evidence: [], assumptions: [], unknowns: [],
        contradictions: [], memory: 'MISSING', loader: 'none',
      },
    },
    'analyze.json': analyze(),
    'challenge.json': challenge(),
    'close.json': closeArtifact(),
    'report.md': report,
  };
  for (const [name, value] of Object.entries(files)) {
    writeFileSync(join(dir, name), typeof value === 'string' ? value : JSON.stringify(value));
  }
  const ok = run(['validate', '--run', dir]);
  assert.equal(ok.status, 0, ok.stderr);

  writeFileSync(join(dir, 'scope.json'), JSON.stringify(scope({
    status: 'halt',
    haltReason: 'no-artifact',
    artifactKind: 'none',
    openQuestion: { blocking: true, text: 'Cadê o artefato?' },
    scope: {
      type: 'UNKNOWN', name: 'UNKNOWN', source: 'UNKNOWN', includes: [],
      confidence: 'Low', ambiguities: [], basis: '',
    },
  })));
  const stopped = run(['validate', '--run', dir]);
  assert.equal(stopped.status, 1, 'later artifacts after a halt must fail the run');
});

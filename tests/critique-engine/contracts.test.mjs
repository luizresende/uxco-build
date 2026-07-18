// Testes DETERMINISTIC do Critique Engine (Sprint 3): contratos e invariantes
// verificáveis — existência, seções obrigatórias, tokens de escala, integridade
// de referências. A qualidade da crítica em si é AGENT EVALUATION
// (benchmarks/critique-engine/) e não é fingida aqui como assert.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const exists = (p) => existsSync(join(root, p));
const read = (p) => readFileSync(join(root, p), 'utf8');

const FIXTURE_SLUGS = [
  '01-login-error-recovery',
  '02-checkout-flow',
  '03-empty-state',
  '04-account-deletion',
  '05-multistep-form',
];

const SEVERITIES = ['Critical', 'High', 'Medium', 'Low', 'Opportunity'];
const ISSUE_FIELDS = [
  'Issue:', 'Category:', 'Severity:', 'Confidence:',
  'Evidence:', 'User Impact:', 'Recommendation:',
];

test('required sprint 3 files exist', () => {
  const required = [
    'skills/design-critique/SKILL.md',
    'skills/interaction-design/SKILL.md',
    'standards/critique-framework.md',
    'examples/critique-tests/README.md',
    'benchmarks/critique-engine/README.md',
    'benchmarks/critique-engine/results',
    ...FIXTURE_SLUGS.map((s) => `examples/critique-tests/${s}/fixture.md`),
    ...FIXTURE_SLUGS.map((s) => `benchmarks/critique-engine/expectations/${s}.md`),
  ];
  for (const p of required) assert.ok(exists(p), `missing: ${p}`);
});

test('design-critique skill has all mandatory sections', () => {
  const skill = read('skills/design-critique/SKILL.md');
  const sections = [
    '## Purpose', '## When to Use', '## Inputs', '## Context Integration',
    '## Analysis Process', '## Not a Checklist', '## Impact Test',
    '## Behavior Scenarios', '## Output Format', '## Failure Conditions',
    '## Quality Checklist',
  ];
  for (const s of sections) assert.ok(skill.includes(s), `missing section: ${s}`);
});

test('interaction-design skill has all mandatory sections', () => {
  const skill = read('skills/interaction-design/SKILL.md');
  const sections = [
    '## Purpose', '## Boundary', '## Interaction Model', '## What It Evaluates',
    '## Flow Analysis', '## Output Contract', '## Failure Conditions',
    '## Quality Checklist',
  ];
  for (const s of sections) assert.ok(skill.includes(s), `missing section: ${s}`);
});

test('interaction-design owns its scope and inherits the common base', () => {
  const skill = read('skills/interaction-design/SKILL.md');
  // escopo próprio: cadeia de interação e campos de extensão
  assert.ok(skill.includes(
    'Trigger → User Action → System Response → State Change → Feedback → Next Available Action'
  ));
  for (const f of ['Trigger:', 'Current Behavior:', 'Expected Behavior:', 'Missing State:']) {
    assert.ok(skill.includes(f), `missing extension field: ${f}`);
  }
  // herança declarada, não copiada
  assert.ok(skill.includes('skills/design-critique/SKILL.md'));
  assert.ok(skill.includes('critique-framework.md'));
});

test('critique-framework defines all nine layers L0-L8', () => {
  const fw = read('standards/critique-framework.md');
  const layers = [
    'L0 — Product Intent', 'L1 — User Flow', 'L2 — Information Architecture',
    'L3 — Interaction', 'L4 — Content', 'L5 — Visual Hierarchy',
    'L6 — System Consistency', 'L7 — Accessibility', 'L8 — States & Edge Cases',
  ];
  for (const l of layers) assert.ok(fw.includes(l), `missing layer: ${l}`);
});

test('critique-framework report contract has the official sections', () => {
  const fw = read('standards/critique-framework.md');
  const sections = [
    '## Executive Summary', '## Issues', '## Patterns Detected', '## Opportunities',
    '## Unknowns and Assumptions', '## Layer Coverage', '## Quality Gate',
    '## Recommended Next Steps',
  ];
  for (const s of sections) assert.ok(fw.includes(s), `missing report section: ${s}`);
});

test('issue contract carries all 7 mandatory fields in both sources', () => {
  for (const file of ['standards/critique-framework.md', 'standards/design-output-format.md']) {
    const content = read(file);
    for (const f of ISSUE_FIELDS) {
      assert.ok(content.includes(f), `${file} missing field: ${f}`);
    }
  }
});

test('severity scale exposes only the allowed values', () => {
  const scaleLine = 'Critical | High | Medium | Low | Opportunity';
  assert.ok(read('standards/design-output-format.md').includes(scaleLine));
  assert.ok(read('standards/critique-framework.md').includes(scaleLine));
  // nenhum vocabulário paralelo de severidade nos artefatos da sprint
  const banned = /\b(Blocker|Major|Minor|Trivial)\b/;
  for (const file of [
    'standards/critique-framework.md',
    'skills/design-critique/SKILL.md',
    'skills/interaction-design/SKILL.md',
  ]) {
    assert.ok(!banned.test(read(file)), `${file} uses a non-canonical severity term`);
  }
});

test('confidence scale exposes only the allowed values', () => {
  assert.ok(read('standards/design-output-format.md').includes('[High | Medium | Low]'));
  assert.ok(read('standards/critique-framework.md').includes('High | Medium | Low'));
});

test('design-critique references the common standards, not copies', () => {
  const skill = read('skills/design-critique/SKILL.md');
  const refs = [
    'critique-framework.md', 'severity-framework.md', 'quality-framework.md',
    'accessibility-baseline.md', 'design-output-format.md', 'product-context-brief.md',
    'skills/product-context/SKILL.md',
  ];
  for (const r of refs) assert.ok(skill.includes(r), `missing reference: ${r}`);
});

test('every fixture is complete (context, behavior, known states)', () => {
  for (const slug of FIXTURE_SLUGS) {
    const fx = read(`examples/critique-tests/${slug}/fixture.md`);
    for (const s of ['## Contexto', '## Comportamento', '## Estados conhecidos']) {
      assert.ok(fx.includes(s), `${slug}: missing section ${s}`);
    }
  }
});

test('every expectation is complete and uses only allowed severities', () => {
  for (const slug of FIXTURE_SLUGS) {
    const ex = read(`benchmarks/critique-engine/expectations/${slug}.md`);
    for (const s of ['## Essential', '## Acceptable', '## False positives', '## Calibração']) {
      assert.ok(ex.includes(s), `${slug}: missing section ${s}`);
    }
    assert.ok(ex.includes(`examples/critique-tests/${slug}/fixture.md`), `${slug}: fixture ref missing`);
    // valida a coluna de severidade da tabela Essential
    const essential = ex.split('## Essential')[1].split('\n## ')[0];
    const rows = essential.split('\n').filter(
      (l) => l.trim().startsWith('|') && !/---|Problema|Camada/.test(l)
    );
    assert.ok(rows.length > 0, `${slug}: Essential table has no rows`);
    for (const row of rows) {
      const cells = row.split('|').map((c) => c.trim()).filter(Boolean);
      const sev = cells[cells.length - 1];
      for (const token of sev.split(/[–\-\/,\s]+/).filter(Boolean)) {
        assert.ok(SEVERITIES.includes(token), `${slug}: invalid severity token "${token}" in "${sev}"`);
      }
    }
  }
});

test('no broken repo references in sprint 3 artifacts', () => {
  const files = [
    'skills/design-critique/SKILL.md',
    'skills/interaction-design/SKILL.md',
    'standards/critique-framework.md',
    'examples/critique-tests/README.md',
    'benchmarks/critique-engine/README.md',
    ...readdirSync(join(root, 'benchmarks/critique-engine/expectations'))
      .map((f) => `benchmarks/critique-engine/expectations/${f}`),
  ];
  const refRe = /`((?:standards|skills|scripts|examples|benchmarks|templates|tests|docs)\/[^`]*?\.(?:md|mjs))`/g;
  for (const file of files) {
    const content = read(file);
    for (const match of content.matchAll(refRe)) {
      const ref = match[1];
      if (/YYYY|[<>*]/.test(ref)) continue; // placeholders
      assert.ok(exists(ref), `${file} references missing path: ${ref}`);
    }
  }
});

test('package scripts are configured and the loader runs', () => {
  const pkg = JSON.parse(read('package.json'));
  for (const s of ['preflight', 'context:load', 'test']) {
    assert.ok(pkg.scripts?.[s], `missing npm script: ${s}`);
  }
  assert.ok(exists('scripts/preflight.mjs'));
  assert.ok(exists('scripts/context-loader.mjs'));
  const run = spawnSync(process.execPath, ['scripts/context-loader.mjs', 'examples/demo-project'], {
    cwd: root, encoding: 'utf8',
  });
  assert.equal(run.status, 0, `loader exited ${run.status}: ${run.stderr}`);
  assert.ok(run.stdout.includes('PROJECT CONTEXT SOURCES'));
});

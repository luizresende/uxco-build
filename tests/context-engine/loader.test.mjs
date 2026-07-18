// Testes DETERMINISTIC do Context Loader (Sprint 2).
// Rodam com o runner nativo do Node (`npm test`) — sem dependências.
// A fronteira entre estes testes e os de AGENT EVALUATION está em README.md.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContext, MEMORY_FILES } from '../../scripts/context-loader.mjs';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const fixture = (name) => join(repoRoot, 'examples', 'context-tests', name);
const bySource = (result) =>
  Object.fromEntries(result.sources.map((s) => [s.file, s]));

test('detects existing files (complete fixture)', () => {
  const sources = bySource(loadContext(fixture('complete')));
  assert.equal(sources['product.md'].status, 'loaded');
  assert.equal(sources['users.md'].status, 'loaded');
});

test('detects missing files (incomplete fixture)', () => {
  const sources = bySource(loadContext(fixture('incomplete')));
  for (const file of ['research.md', 'metrics.md', 'decisions.md', 'glossary.md']) {
    assert.equal(sources[file].status, 'missing', `${file} should be missing`);
  }
});

test('detects empty files (incomplete fixture: users.md all _Not filled_)', () => {
  const sources = bySource(loadContext(fixture('incomplete')));
  assert.equal(sources['users.md'].status, 'empty');
  assert.equal(sources['users.md'].declaredFillStatus, 'EMPTY');
});

test('known memory files are loaded with content (complete fixture)', () => {
  const result = loadContext(fixture('complete'));
  assert.equal(result.sources.length, MEMORY_FILES.length);
  for (const s of result.sources) {
    assert.ok(MEMORY_FILES.includes(s.file));
    assert.equal(s.status, 'loaded', `${s.file} should be loaded`);
    assert.ok(s.content.length > 0, `${s.file} should carry its content`);
  }
});

test('unknown files do not crash the loader and are not inventoried', () => {
  const dir = mkdtempSync(join(tmpdir(), 'uxco-loader-'));
  try {
    writeFileSync(join(dir, 'product.md'), '# Product\n\n## Problem\n\nAlgo real.\n');
    writeFileSync(join(dir, 'notes.txt'), 'arquivo desconhecido\n');
    writeFileSync(join(dir, 'random-doc.md'), '# Não é memória\n\nConteúdo.\n');
    const result = loadContext(dir);
    assert.equal(result.sources.length, MEMORY_FILES.length);
    assert.ok(!result.sources.some((s) => s.file === 'notes.txt'));
    assert.ok(!result.sources.some((s) => s.file === 'random-doc.md'));
    assert.equal(bySource(result)['product.md'].status, 'loaded');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('substantive content before the first section is not misread as empty', () => {
  const dir = mkdtempSync(join(tmpdir(), 'uxco-loader-'));
  try {
    writeFileSync(
      join(dir, 'product.md'),
      '# Product\n\nResumo real do produto escrito antes das seções.\n\n## Vision\n\n_Not filled_\n'
    );
    const source = bySource(loadContext(dir))['product.md'];
    assert.equal(source.status, 'loaded');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('complete fixture loads successfully (7 loaded, 0 empty, 0 missing)', () => {
  const { summary } = loadContext(fixture('complete'));
  assert.deepEqual(summary, { loaded: 7, empty: 0, missing: 0 });
});

test('incomplete fixture exposes missing sources in the summary', () => {
  const { summary } = loadContext(fixture('incomplete'));
  assert.equal(summary.missing, 4);
  assert.equal(summary.empty, 1);
  assert.equal(summary.loaded, 2);
});

test('contradictory fixture loads all conflicting sources intact', () => {
  const sources = bySource(loadContext(fixture('contradictory')));
  // O loader deve preservar os dois lados de cada conflito — resolver não é papel dele.
  assert.match(sources['product.md'].content, /Product Manager/);
  assert.match(sources['users.md'].content, /Product Designer/);
  assert.match(sources['requirements.md'].content, /mobile/i);
  assert.match(sources['decisions.md'].content, /desktop-only/);
});

#!/usr/bin/env node
/**
 * Validador da cadeia declarada em workflows/review/manifest.json.
 *
 * Outro comando reusa este arquivo com --manifest. Não há framework e não
 * há dependência. O review continua READ: este script só lê o manifesto e
 * os artefatos, e escreve diagnóstico no stdout/stderr.
 *
 *   node scripts/chain.mjs check
 *   node scripts/chain.mjs validate --step scope --artifact scope.json [--prior nome=arquivo]
 *   node scripts/chain.mjs validate --run <dir>
 *
 * Saída 0: artefato válido e a cadeia segue.
 * Saída 2: parada válida (escopo sem resolução, canvas como única fonte
 *          indisponível, contexto que tornaria a análise enganosa).
 *          Não é defeito de contrato. O passo seguinte não roda.
 * Saída 1: contrato quebrado. Não repetir o passo para "consertar" o ciclo
 *          adversarial — um challenge, um revise, um close.
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

export const BLOCKED_MESSAGE = "Review blocked:\nPaper connection unavailable.";

const STAGE_TRACE = ["INITIAL_ANALYSIS", "ADVERSARIAL_REVIEW", "REVISION", "FINAL_QA"];

const QA_DIMENSIONS = [
  "contextGrounding",
  "evidenceQuality",
  "severityCalibration",
  "actionability",
  "completeness",
  "accessibilityCoverage",
  "systemConsistency",
];

const DESIGN_DIMENSIONS = [
  "contextFit",
  "clarity",
  "usability",
  "interaction",
  "completeness",
  "consistency",
  "accessibility",
  "visualHierarchy",
  "content",
  "rationale",
];

const CRITICAL_DIMENSIONS = ["contextFit", "usability", "completeness", "accessibility"];

const LAYERS = ["L0", "L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8"];

const REPORT_HEADINGS = [
  "## Executive Summary",
  "## Issues",
  "## Patterns Detected",
  "## Opportunities",
  "## Unknowns and Assumptions",
  "## Layer Coverage",
  "## Quality Gate",
  "## Review Assurance",
  "## Recommended Next Steps",
];

const IMPLEMENTED_GATES = [
  "scope-resolved",
  "paper-source",
  "context-gate",
  "evidence-layers",
  "single-cycle",
  "critique-record",
  "one-diagnosis",
  "qa-vs-design",
  "report-contract",
];

function repoPath(rel) {
  return join(root, ...rel.split("/"));
}

function readJson(abs) {
  return JSON.parse(readFileSync(abs, "utf8"));
}

function loadManifest(rel) {
  return readJson(repoPath(rel));
}

function contextEntries(step) {
  return (step.context ?? []).map((entry) => (typeof entry === "string" ? { path: entry } : entry));
}

function contextPaths(step) {
  return contextEntries(step).map((entry) => entry.path);
}

function resolveSchema(schema, dir, stack = []) {
  if (!schema || typeof schema !== "object") return schema;
  if (schema.$ref) {
    const next = join(dir, schema.$ref);
    if (stack.includes(next)) throw new Error(`$ref circular: ${schema.$ref}`);
    const { $ref, ...rest } = schema;
    const target = resolveSchema(readJson(next), dirname(next), [...stack, next]);
    return { ...target, ...rest };
  }
  const copy = Array.isArray(schema) ? [] : {};
  for (const [key, value] of Object.entries(schema)) {
    copy[key] = value && typeof value === "object" ? resolveSchema(value, dir, stack) : value;
  }
  return copy;
}

function typeOf(value) {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value;
}

function checkShape(value, schema, path, errors) {
  if (schema.nullable && value === null) return;
  if (Object.prototype.hasOwnProperty.call(schema, "const") && value !== schema.const) {
    errors.push(`${path} deve ser ${JSON.stringify(schema.const)}`);
    return;
  }
  if (schema.enum && !schema.enum.includes(value)) {
    errors.push(`${path} fora do enum (${JSON.stringify(schema.enum)})`);
    return;
  }
  if (schema.type === "object") {
    if (typeOf(value) !== "object") {
      errors.push(`${path} deve ser objeto`);
      return;
    }
    for (const key of schema.required ?? []) {
      if (!Object.prototype.hasOwnProperty.call(value, key)) errors.push(`${path}.${key} ausente`);
    }
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!schema.properties?.[key]) errors.push(`${path}.${key} não pertence ao contrato`);
      }
    }
    for (const [key, sub] of Object.entries(schema.properties ?? {})) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        checkShape(value[key], sub, `${path}.${key}`, errors);
      }
    }
    return;
  }
  if (schema.type === "array") {
    if (!Array.isArray(value)) {
      errors.push(`${path} deve ser lista`);
      return;
    }
    if (schema.items) {
      value.forEach((item, index) => checkShape(item, schema.items, `${path}[${index}]`, errors));
    }
    return;
  }
  if (schema.type && typeOf(value) !== schema.type) {
    errors.push(`${path} deve ser ${schema.type}`);
  }
}

function sameSet(left, right) {
  if (left.length !== right.length) return false;
  const bag = new Set(left);
  return right.every((item) => bag.has(item));
}

function findingIds(artifact) {
  return [...(artifact.issues ?? []), ...(artifact.opportunities ?? [])].map((item) => item.id);
}

function weakEvidence(text) {
  return /^isso viola boas práticas\.?$/i.test(String(text).trim());
}

function checkIssue(item, path, errors, kind) {
  if (!String(item.id ?? "").trim()) errors.push(`${path}.id vazio`);
  for (const field of ["issue", "evidence", "userImpact", "recommendation"]) {
    if (!String(item[field] ?? "").trim()) errors.push(`${path}.${field} vazio`);
  }
  if (weakEvidence(item.evidence)) {
    errors.push(`${path}.evidence não pode ser só um princípio abstrato`);
  }
  if (kind === "issue" && item.severity === "Opportunity") {
    errors.push(`${path}.severity Opportunity pertence a opportunities`);
  }
  if (kind === "opportunity" && item.severity !== "Opportunity") {
    errors.push(`${path}.severity de opportunity tem de ser Opportunity`);
  }
}

function layerAllowsFinding(layers, category) {
  return layers?.[category]?.status === "evaluated";
}

function gateScope(artifact) {
  const errors = [];
  const scope = artifact.scope;
  if (artifact.status === "resolved") {
    if (artifact.haltReason !== null) errors.push("escopo resolvido não carrega haltReason");
    if (artifact.openQuestion !== null) errors.push("escopo resolvido não carrega openQuestion");
    if (scope.type === "UNKNOWN" || scope.source === "UNKNOWN" || !scope.name.trim()) {
      errors.push("escopo resolvido precisa de type, source e name");
    }
    if (artifact.artifactKind === "none") errors.push("escopo resolvido precisa de artefato observável");
    if (artifact.needsCanvas !== (artifact.artifactKind === "canvas" || artifact.artifactKind === "mixed")) {
      errors.push("needsCanvas só é true quando a fonte é canvas ou mixed");
    }
    if ((scope.type === "flow" || scope.type === "frame-set") && !artifact.needsFlowSkill) {
      errors.push("fluxo ou conjunto de frames exige a Interaction Design Skill");
    }
    if (scope.source === "inferred" && scope.confidence === "High" && !scope.basis.trim()) {
      errors.push("source inferred nunca nasce High sem basis declarada");
    }
    return { errors, halt: false };
  }
  if (artifact.haltReason === null) errors.push("parada de escopo precisa de haltReason");
  if (scope.type !== "UNKNOWN" || scope.source !== "UNKNOWN") {
    errors.push("escopo não resolvido permanece UNKNOWN");
  }
  if (!artifact.openQuestion?.blocking || !artifact.openQuestion.text.trim()) {
    errors.push("parada de escopo exige Open Question blocking");
  }
  if (artifact.haltReason === "no-artifact" && artifact.artifactKind !== "none") {
    errors.push("no-artifact exige artifactKind none");
  }
  return { errors, halt: errors.length === 0 };
}

function gatePaper(artifact, prior) {
  const errors = [];
  const scope = prior.scope;
  if (!scope) return { errors: ["prior scope ausente"], halt: false };
  if (scope.status === "halt") return { errors: ["scope interrompeu a cadeia"], halt: false };
  if (!scope.needsCanvas) {
    if (artifact.status !== "skipped" || artifact.paperReady !== null || artifact.snapshot !== null) {
      errors.push("sem canvas, inspect fica skipped, com paperReady e snapshot nulos");
    }
    if (artifact.haltReason !== null || artifact.blockedMessage !== null) {
      errors.push("inspect skipped não carrega bloqueio");
    }
    return { errors, halt: false };
  }
  if (artifact.status === "skipped") {
    errors.push("needsCanvas true não aceita inspect skipped");
    return { errors, halt: false };
  }
  if (artifact.paperReady === false && scope.artifactKind === "canvas") {
    if (artifact.status !== "halt" || artifact.haltReason !== "paper-only-blocked") {
      errors.push("canvas como única fonte, sem PAPER_READY, para em paper-only-blocked");
    }
    if (artifact.blockedMessage !== BLOCKED_MESSAGE) {
      errors.push("blockedMessage tem de ser a mensagem canônica, sem variante");
    }
    if (artifact.snapshot !== null) errors.push("canvas não lido não ganha snapshot");
    return { errors, halt: errors.length === 0 };
  }
  if (artifact.paperReady === false) {
    if (artifact.status !== "partial" || artifact.haltReason !== null || artifact.blockedMessage !== null) {
      errors.push("outras fontes seguem com inspect partial e sem mensagem de bloqueio");
    }
    if (!artifact.snapshot?.limitations?.trim() || !artifact.snapshot?.method?.trim()) {
      errors.push("leitura parcial registra method e limitations");
    }
    return { errors, halt: false };
  }
  if (artifact.paperReady !== true || (artifact.status !== "captured" && artifact.status !== "partial")) {
    errors.push("PAPER_READY produz captured ou partial");
  }
  if (!artifact.snapshot?.limitations?.trim() || !artifact.snapshot?.method?.trim()) {
    errors.push("snapshot exige method e limitations preenchidos");
  }
  if (artifact.blockedMessage !== null || artifact.haltReason !== null) {
    errors.push("leitura realizada não carrega bloqueio");
  }
  return { errors, halt: false };
}

function gateContext(artifact) {
  const errors = [];
  if (artifact.answersInvented !== false) errors.push("resposta de blocking question inventada invalida o ground");
  const asking = artifact.contextStatus === "REQUEST BLOCKING CONTEXT";
  if (asking && artifact.blockingQuestions.length === 0) {
    errors.push("REQUEST BLOCKING CONTEXT exige blockingQuestions");
  }
  if (!asking && artifact.blockingQuestions.length > 0) {
    errors.push("blockingQuestions só existem com REQUEST BLOCKING CONTEXT");
  }
  if (artifact.status === "halt") {
    if (artifact.haltReason !== "misleading-without-context" || !asking || artifact.continueDespiteBlocking) {
      errors.push("parar no ground só quando o contexto ausente tornaria a análise enganosa");
    }
    return { errors, halt: errors.length === 0 };
  }
  if (artifact.haltReason !== null) errors.push("ground que segue não carrega haltReason");
  if (artifact.status === "proceed") {
    if (artifact.contextStatus !== "PROCEED" || artifact.continueDespiteBlocking) {
      errors.push("proceed exige contextStatus PROCEED");
    }
  } else if (artifact.status === "proceed-with-assumptions") {
    if (artifact.contextStatus === "PROCEED") errors.push("PROCEED não é proceed-with-assumptions");
    if (asking && !artifact.continueDespiteBlocking) {
      errors.push("seguir com blocking questions exige continueDespiteBlocking");
    }
  }
  return { errors, halt: false };
}

function gateEvidence(artifact, prior) {
  const errors = [];
  const scope = prior.scope;
  if (!scope) errors.push("prior scope ausente");
  const ids = new Set();
  for (const layer of LAYERS) {
    const entry = artifact.layers[layer];
    if (!entry) continue;
    if (entry.status !== "evaluated" && !entry.reason.trim()) {
      errors.push(`${layer} ${entry.status} exige reason — not enough evidence fica declarado`);
    }
  }
  artifact.issues.forEach((item, index) => {
    checkIssue(item, `issues[${index}]`, errors, "issue");
    if (ids.has(item.id)) errors.push(`id repetido: ${item.id}`);
    ids.add(item.id);
    if (artifact.layers && !layerAllowsFinding(artifact.layers, item.category)) {
      errors.push(`issues[${index}] em camada ${item.category} que não está evaluated`);
    }
  });
  artifact.opportunities.forEach((item, index) => {
    checkIssue(item, `opportunities[${index}]`, errors, "opportunity");
    if (ids.has(item.id)) errors.push(`id repetido: ${item.id}`);
    ids.add(item.id);
    if (artifact.layers && !layerAllowsFinding(artifact.layers, item.category)) {
      errors.push(`opportunities[${index}] em camada ${item.category} que não está evaluated`);
    }
  });
  if (scope?.needsFlowSkill && artifact.interactionDesign !== "loaded") {
    errors.push("escopo de fluxo exige interactionDesign loaded");
  }
  if (artifact.interactionDesign === "on-demand" && !artifact.behavioralSmell?.trim()) {
    errors.push("on-demand exige behavioralSmell");
  }
  if (artifact.interactionDesign !== "on-demand" && artifact.behavioralSmell !== null) {
    errors.push("behavioralSmell só existe quando interactionDesign é on-demand");
  }
  return { errors, halt: false };
}

function gateSingleCycle(artifact) {
  const errors = [];
  if (artifact.cyclePass !== 1) errors.push("cyclePass deve ser 1 — o ciclo não se repete");
  if (artifact.rerun !== false) errors.push("rerun deve ser false — reprovação não reabre o ciclo");
  return { errors, halt: false };
}

function checkEntry(entry, path, expectedVerdict, errors) {
  if (entry.verdict !== expectedVerdict) errors.push(`${path}.verdict deve ser ${expectedVerdict}`);
  if (!entry.finding.trim() || !entry.challenge.trim() || !entry.basis.trim()) {
    errors.push(`${path} exige finding, challenge e basis — Basis vazio invalida a entrada`);
  }
  if (expectedVerdict === "revised") {
    if (!entry.change || !entry.change.includes("→")) {
      errors.push(`${path}.change usa a notação Campo: antes → depois`);
    }
  } else if (entry.change !== null) {
    errors.push(`${path}.change fica null fora de revised`);
  }
}

function gateCritique(artifact, prior) {
  const errors = [];
  const analyze = prior.analyze;
  if (!analyze) return { errors: ["prior analyze ausente"], halt: false };
  const sections = [
    ["confirmed", "confirmed"],
    ["revised", "revised"],
    ["rejected", "rejected"],
    ["missing", "added"],
  ];
  const seen = new Map();
  for (const [key, verdict] of sections) {
    artifact[key].forEach((entry, index) => {
      checkEntry(entry, `${key}[${index}]`, verdict, errors);
      if (key === "missing") return;
      if (seen.has(entry.finding)) errors.push(`${entry.finding} aparece em mais de uma seção`);
      seen.set(entry.finding, key);
    });
  }
  for (const key of ["assumptionsChallenged", "confidenceChanges"]) {
    artifact[key].forEach((entry, index) => {
      if (!entry.finding.trim() || !entry.challenge.trim() || !entry.basis.trim()) {
        errors.push(`${key}[${index}] exige finding, challenge e basis`);
      }
    });
  }
  const expected = new Set(findingIds(analyze));
  for (const id of expected) {
    if (!seen.has(id)) errors.push(`achado ${id} não foi desafiado — diagnóstico vazio também passa pelo challenge, e achado presente não fica de fora`);
  }
  for (const id of seen.keys()) {
    if (!expected.has(id)) errors.push(`${id} não está no diagnóstico inicial`);
  }
  const known = new Set([...expected, ...artifact.missing.map((entry) => entry.finding)]);
  for (const entry of artifact.missing) {
    if (expected.has(entry.finding)) errors.push(`omissão ${entry.finding} já existia no diagnóstico`);
  }
  for (const key of ["assumptionsChallenged", "confidenceChanges"]) {
    for (const entry of artifact[key]) {
      if (!known.has(entry.finding) && !entry.finding.startsWith("assumption:")) {
        errors.push(`${key} cita ${entry.finding}, que não é achado nem assumption`);
      }
    }
  }
  return { errors, halt: false };
}

function gateDiagnosis(artifact, prior) {
  const errors = [];
  const challenge = prior.challenge;
  if (!challenge) return { errors: ["prior challenge ausente"], halt: false };
  const output = new Map();
  artifact.issues.forEach((item, index) => {
    checkIssue(item, `issues[${index}]`, errors, "issue");
    output.set(item.id, "issues");
  });
  artifact.opportunities.forEach((item, index) => {
    checkIssue(item, `opportunities[${index}]`, errors, "opportunity");
    if (output.has(item.id)) errors.push(`id repetido na revisão: ${item.id}`);
    output.set(item.id, "opportunities");
  });
  const rejected = new Set(challenge.rejected.map((entry) => entry.finding));
  const kept = new Set([
    ...challenge.confirmed.map((entry) => entry.finding),
    ...challenge.revised.map((entry) => entry.finding),
  ]);
  const added = new Set(challenge.missing.map((entry) => entry.finding));
  for (const id of rejected) {
    if (output.has(id)) errors.push(`rejeitado ${id} ainda está no diagnóstico`);
  }
  for (const id of kept) {
    if (!output.has(id)) errors.push(`achado ${id} que sobreviveu ao desafio sumiu na revisão`);
  }
  for (const id of added) {
    if (!output.has(id)) errors.push(`omissão ${id} aceita ficou fora do contrato de 7 campos`);
  }
  for (const id of output.keys()) {
    if (!kept.has(id) && !added.has(id)) errors.push(`${id} entrou na revisão sem veredito`);
  }
  const accounted = new Map();
  for (const row of artifact.accounted) {
    if (!row.text.trim()) errors.push(`accounted ${row.id} precisa de texto — rejeição não é exclusão silenciosa`);
    if (accounted.has(row.id)) errors.push(`accounted repete ${row.id}`);
    accounted.set(row.id, row);
  }
  for (const id of rejected) {
    if (!accounted.has(id)) errors.push(`rejeitado ${id} não foi para accounted`);
  }
  for (const id of accounted.keys()) {
    if (!rejected.has(id)) errors.push(`accounted cita ${id}, que não foi rejeitado`);
  }
  for (const duty of ["dedupe", "priority"]) {
    if (!artifact.mechanismsReapplied.includes(duty)) {
      errors.push(`mechanismsReapplied precisa reaplicar ${duty}`);
    }
  }
  return { errors, halt: false };
}

function expectedQaVerdict(dimensions) {
  const values = QA_DIMENSIONS.map((key) => dimensions[key]);
  if (values.includes("FAIL")) return "REVIEW NOT READY";
  if (values.includes("UNKNOWN") || values.includes("PARTIAL")) return "REVIEW READY WITH RESERVATIONS";
  return "REVIEW READY";
}

function expectedDesignVerdict(gate) {
  const scores = [];
  let criticalFail = false;
  for (const key of DESIGN_DIMENSIONS) {
    const dimension = gate.dimensions[key];
    const critical = CRITICAL_DIMENSIONS.includes(key);
    if (dimension.critical !== critical) return null;
    if (dimension.score === "UNKNOWN") {
      if (critical && !gate.riskAccepted) criticalFail = true;
      continue;
    }
    scores.push(dimension.score);
    if (critical && dimension.score < 3) criticalFail = true;
  }
  const blockersOpen = gate.designBlockers.length > 0 && !gate.riskAccepted;
  if (gate.riskAccepted && !gate.decision.trim()) return null;
  if (!scores.length) return "fail";
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  return average >= 4 && !criticalFail && !blockersOpen ? "pass" : "fail";
}

function gateQa(artifact) {
  const errors = [];
  const fails = QA_DIMENSIONS.filter((key) => artifact.qa.dimensions[key] === "FAIL");
  if (artifact.qa.verdict !== expectedQaVerdict(artifact.qa.dimensions)) {
    errors.push("veredito do QA não corresponde às dimensões — sem score composto e sem maquiagem");
  }
  if (!sameSet(artifact.qa.blockers, fails)) {
    errors.push("qa.blockers é exatamente o conjunto de dimensões em FAIL");
  }
  for (const blocker of artifact.qualityGate.designBlockers) {
    if (QA_DIMENSIONS.includes(blocker)) {
      errors.push(`designBlockers não usa dimensão de QA (${blocker}) — os dois blockers não se misturam`);
    }
  }
  const designVerdict = expectedDesignVerdict(artifact.qualityGate);
  if (designVerdict === null) {
    errors.push("dimensão crítica mal marcada, ou aceite de risco sem decision");
  } else if (artifact.qualityGate.verdict !== designVerdict) {
    errors.push(`qualityGate.verdict deveria ser ${designVerdict} pelos scores e pelos design blockers`);
  }
  const notReady = artifact.qa.verdict === "REVIEW NOT READY";
  if (artifact.qualityGate.qualifiedByQa !== notReady) {
    errors.push("qualifiedByQa é true só quando o QA está REVIEW NOT READY — o gate do design continua o do design");
  }
  return { errors, halt: false };
}

function gateReport(artifact, prior, reportText) {
  const errors = [];
  if (!sameSet(artifact.stageTrace, STAGE_TRACE) || artifact.stageTrace.join("|") !== STAGE_TRACE.join("|")) {
    errors.push("stageTrace é INITIAL_ANALYSIS → ADVERSARIAL_REVIEW → REVISION → FINAL_QA, uma vez cada");
  }
  const challenge = prior.challenge;
  if (!challenge) {
    errors.push("prior challenge ausente");
  } else {
    const counts = {
      confirmed: challenge.confirmed.length,
      revised: challenge.revised.length,
      rejected: challenge.rejected.length,
      added: challenge.missing.length,
    };
    for (const key of Object.keys(counts)) {
      if (artifact.counts[key] !== counts[key]) {
        errors.push(`counts.${key} não fecha com o challenge`);
      }
    }
  }
  if (reportText == null) {
    errors.push("report.md ausente — o JSON não substitui o Design Critique Report");
    return { errors, halt: false };
  }
  for (const heading of REPORT_HEADINGS) {
    if (!reportText.includes(heading)) errors.push(`report sem ${heading}`);
  }
  const assurance = reportText.split("## Review Assurance")[1] ?? "";
  for (const marker of STAGE_TRACE) {
    if (!assurance.includes(marker)) errors.push(`Review Assurance sem ${marker}`);
  }
  if (!assurance.includes(artifact.qa.verdict)) errors.push("Review Assurance sem o veredito do QA");
  if (artifact.qa.blockers.length && !artifact.qa.blockers.every((item) => assurance.includes(item))) {
    errors.push("QA blocker tem de aparecer em Review Assurance");
  }
  return { errors, halt: false };
}

const GATES = {
  "scope-resolved": (artifact) => gateScope(artifact),
  "paper-source": (artifact, prior) => gatePaper(artifact, prior),
  "context-gate": (artifact) => gateContext(artifact),
  "evidence-layers": (artifact, prior) => gateEvidence(artifact, prior),
  "single-cycle": (artifact) => gateSingleCycle(artifact),
  "critique-record": (artifact, prior) => gateCritique(artifact, prior),
  "one-diagnosis": (artifact, prior) => gateDiagnosis(artifact, prior),
  "qa-vs-design": (artifact) => gateQa(artifact),
  "report-contract": (artifact, prior, extras) => gateReport(artifact, prior, extras.reportText),
};

function checkManifest(manifest) {
  const errors = [];
  if (manifest.mode !== "READ") errors.push("mode tem de ser READ");
  if (JSON.stringify(manifest.always) !== JSON.stringify(["CLAUDE.md"])) {
    errors.push("always é só CLAUDE.md — o resto entra pelo passo que precisa");
  }
  if (JSON.stringify(manifest.gates) !== JSON.stringify(IMPLEMENTED_GATES)) {
    errors.push("a lista de gates do manifesto não é a lista que o validador implementa");
  }
  const ids = new Set();
  const outputs = new Set();
  const universe = new Set();
  for (const step of manifest.steps) {
    for (const path of contextPaths(step)) universe.add(path);
  }
  let sawPaper = false;
  const markers = [];
  for (const step of manifest.steps) {
    if (ids.has(step.id)) errors.push(`passo duplicado: ${step.id}`);
    ids.add(step.id);
    if (outputs.has(step.output)) errors.push(`output duplicado: ${step.output}`);
    outputs.add(step.output);
    if (!existsSync(repoPath(step.prompt))) errors.push(`prompt ausente: ${step.prompt}`);
    if (!existsSync(repoPath(step.schema))) errors.push(`schema ausente: ${step.schema}`);
    else {
      const schema = resolveSchema(readJson(repoPath(step.schema)), dirname(repoPath(step.schema)));
      if (schema.properties?.step?.const !== step.id) {
        errors.push(`schema de ${step.id} não fixa step`);
      }
    }
    const mine = new Set(contextPaths(step));
    if (mine.size >= universe.size) errors.push(`${step.id} carrega o corpus inteiro de contexto`);
    for (const entry of contextEntries(step)) {
      if (!existsSync(repoPath(entry.path))) errors.push(`${step.id} cita arquivo ausente: ${entry.path}`);
      if (entry.path === "scripts/context-loader.mjs") {
        errors.push(`${step.id} carrega o fonte do context loader — rode npm run context:load, não o arquivo`);
      }
      if (entry.when && entry.when !== "flow") errors.push(`${step.id} tem when de contexto inválido: ${entry.when}`);
    }
    if (step.touchesPaper) {
      sawPaper = true;
      if (!mine.has("docs/constitution/canvas-safety.md")) {
        errors.push(`${step.id} toca Paper sem canvas-safety.md`);
      }
    } else if (mine.has("docs/constitution/canvas-safety.md")) {
      errors.push(`${step.id} carrega canvas-safety.md sem tocar Paper`);
    }
    for (const gate of step.gate) {
      if (!GATES[gate]) errors.push(`${step.id} aponta gate não implementado: ${gate}`);
    }
    if (step.marker) markers.push(step.marker);
    if (step.when !== "always" && step.when !== "canvas") {
      errors.push(`${step.id} tem when inválido`);
    }
  }
  if (!sawPaper) errors.push("nenhum passo declara toque em Paper");
  if (markers.join("|") !== STAGE_TRACE.join("|")) {
    errors.push("marcadores de estágio fora da ordem canônica, ou repetidos");
  }
  const flowFile = "skills/interaction-design/SKILL.md";
  const analyze = manifest.steps.find((step) => step.id === "analyze");
  const flowEntry = contextEntries(analyze ?? { context: [] }).find((entry) => entry.path === flowFile);
  if (!flowEntry || flowEntry.when !== "flow") {
    errors.push("interaction-design só entra em analyze, e só when flow");
  }
  for (const step of manifest.steps) {
    if (step.id === "analyze") continue;
    if (contextPaths(step).includes(flowFile)) errors.push(`${step.id} carrega interaction-design fora de analyze`);
  }
  for (const path of manifest.orchestrator?.loads ?? []) {
    if (!existsSync(repoPath(path))) errors.push(`orquestrador cita arquivo ausente: ${path}`);
  }
  for (const entry of manifest.orchestrator?.conditional ?? []) {
    if (!existsSync(repoPath(entry.path))) errors.push(`orquestrador condicional ausente: ${entry.path}`);
  }
  const used = new Set(manifest.steps.flatMap((step) => step.gate));
  for (const gate of IMPLEMENTED_GATES) {
    if (!used.has(gate)) errors.push(`gate implementado e não ligado a um passo: ${gate}`);
  }
  return errors;
}

function validateArtifact(manifest, stepId, artifact, prior, extras) {
  const step = manifest.steps.find((item) => item.id === stepId);
  if (!step) return { errors: [`passo desconhecido: ${stepId}`], halt: false };
  const schema = resolveSchema(readJson(repoPath(step.schema)), dirname(repoPath(step.schema)));
  const errors = [];
  checkShape(artifact, schema, "$", errors);
  if (errors.length) return { errors, halt: false };
  let halt = false;
  for (const gate of step.gate) {
    const result = GATES[gate](artifact, prior, extras);
    errors.push(...result.errors);
    if (result.halt) halt = true;
  }
  return { errors, halt };
}

function loadPrior(pairs) {
  const prior = {};
  for (const pair of pairs) {
    const split = pair.indexOf("=");
    if (split === -1) throw new Error(`prior inválido: ${pair}`);
    const name = pair.slice(0, split);
    prior[name] = readJson(resolve(pair.slice(split + 1)));
  }
  return prior;
}

function finish(result, artifact) {
  if (result.errors.length) {
    for (const error of result.errors) console.error(error);
    process.exit(1);
  }
  if (result.halt) {
    if (artifact?.blockedMessage) process.stdout.write(`${artifact.blockedMessage}\n`);
    else console.error(`halt: ${artifact?.haltReason ?? "stop"}`);
    process.exit(2);
  }
}

function validateRun(manifest, dir) {
  const prior = {};
  for (const step of manifest.steps) {
    const abs = join(dir, step.output);
    if (prior.scope?.status === "halt" || prior.inspect?.status === "halt" || prior.ground?.status === "halt") {
      if (existsSync(abs)) {
        console.error(`${step.output} existe depois de uma parada válida`);
        process.exit(1);
      }
      const reason = prior.scope?.status === "halt"
        ? prior.scope.haltReason
        : prior.inspect?.status === "halt"
          ? prior.inspect.haltReason
          : prior.ground.haltReason;
      console.error(`halt: ${reason}`);
      process.exit(2);
    }
    if (!existsSync(abs)) {
      console.error(`artefato ausente: ${step.output}`);
      process.exit(1);
    }
    const artifact = readJson(abs);
    let reportText = null;
    if (step.id === "close") {
      const reportAbs = join(dir, "report.md");
      reportText = existsSync(reportAbs) ? readFileSync(reportAbs, "utf8") : null;
    }
    const result = validateArtifact(manifest, step.id, artifact, prior, { reportText });
    if (result.errors.length) {
      for (const error of result.errors) console.error(`${step.id}: ${error}`);
      process.exit(1);
    }
    prior[step.id] = artifact;
    if (result.halt) {
      const later = manifest.steps.slice(manifest.steps.indexOf(step) + 1);
      const leftovers = later.filter((next) => existsSync(join(dir, next.output)));
      if (leftovers.length) {
        console.error(`artefatos depois da parada: ${leftovers.map((next) => next.output).join(", ")}`);
        process.exit(1);
      }
      if (artifact.blockedMessage) process.stdout.write(`${artifact.blockedMessage}\n`);
      else console.error(`halt: ${artifact.haltReason}`);
      process.exit(2);
    }
  }
}

function parseArgs(argv) {
  const out = { _: [], prior: [], manifest: "workflows/review/manifest.json" };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--manifest") out.manifest = argv[++i];
    else if (token === "--step") out.step = argv[++i];
    else if (token === "--artifact") out.artifact = argv[++i];
    else if (token === "--report") out.report = argv[++i];
    else if (token === "--run") out.run = argv[++i];
    else if (token === "--prior") out.prior.push(argv[++i]);
    else out._.push(token);
  }
  return out;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const command = args._[0];
  if (!command || !["check", "validate"].includes(command)) {
    console.error("Usage: node scripts/chain.mjs check | validate --step <id> --artifact <file> [--prior id=file] | validate --run <dir>");
    process.exit(1);
  }
  const manifest = loadManifest(args.manifest);
  if (command === "check") {
    const errors = checkManifest(manifest);
    if (errors.length) {
      for (const error of errors) console.error(error);
      process.exit(1);
    }
    process.stdout.write(`ok: ${manifest.id} (${manifest.steps.length} steps)\n`);
    return;
  }
  if (args.run) {
    validateRun(manifest, resolve(args.run));
    process.stdout.write("ok: run\n");
    return;
  }
  if (!args.step || !args.artifact) {
    console.error("validate exige --step e --artifact, ou --run");
    process.exit(1);
  }
  const artifact = readJson(resolve(args.artifact));
  const prior = loadPrior(args.prior);
  let reportText = null;
  if (args.step === "close") {
    const reportAbs = args.report
      ? resolve(args.report)
      : join(dirname(resolve(args.artifact)), "report.md");
    reportText = existsSync(reportAbs) ? readFileSync(reportAbs, "utf8") : null;
  }
  const result = validateArtifact(manifest, args.step, artifact, prior, { reportText });
  finish(result, artifact);
  process.stdout.write(`ok: ${args.step}\n`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}

export { checkManifest, validateArtifact, GATES, loadManifest };

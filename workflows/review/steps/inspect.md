# Fase inspect

Só rode esta fase quando `scope.json` tiver `needsCanvas: true`. Caso contrário o orquestrador grava `status: skipped` e você não é chamado. Produza `inspect.json`. Não escreva no canvas.

## Paper Inspection

Somente `READ`, sob `PAPER_READY` verificado por chamada real (`docs/constitution/canvas-safety.md`; state machine em `docs/architecture.md`). O repertório é o do `experiments/paper-mcp/smoke-test.md`. Capacidade fora dele não se assume. Dado que a integração não retornou jamais é inventado.

### Canvas Snapshot

```text
Canvas Snapshot:
  Document:    [nome e ID]
  Captured:    [YYYY-MM-DD]
  Method:      [chamadas realmente executadas]
  Frames:      [nome, dimensões]
  Hierarchy:   [estrutura resumida]
  Texts:       [textos visíveis relevantes]
  Properties:  [só o que foi lido]
  Sequence:    [inferência marcada como inferência]
  Patterns:    [o que se repete]
  States:      [apenas os desenhados]
  Limitations: [obrigatório, nunca omitido]
```

`Limitations` nunca omitido. Ausência de estado desenhado não é ausência no produto. Contraste sem cor legível fica em limitations — não se inventa problema nem se assume aprovação (`standards/accessibility-baseline.md`).

## Falha desta fase

Falha 1 — Paper indisponível. Análise de canvas jamais é inventada. Se o `artifactKind` do escopo é `canvas` e a chamada real não chega a `PAPER_READY`, pare:

```text
Review blocked:
Paper connection unavailable.
```

`blockedMessage` é esse texto, byte a byte. `haltReason` é `paper-only-blocked`. Não há snapshot. A ação de correção que o orquestrador mostra junto é `npm run preflight` (Safety Model, regra 2).

Se existem outras fontes (`mixed`), `status: partial`, sem essa mensagem, e `limitations` declara o canvas inacessível. O review segue.

Falha 6 — Paper parcialmente legível. Só o que a chamada devolveu entra no snapshot. O que faltou vai para `limitations` e as limitations sobem às Review Limitations do report. Não preencher campo por simpatia.

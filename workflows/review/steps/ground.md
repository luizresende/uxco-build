# Fase ground

Produza o Product Context Brief dentro de `ground.json`. Não critique. Não redefina o método da skill: ela produz, este passo só registra o contrato.

## Context Integration

O review não replica a Product Context Skill. Rode `npm run context:load -- <projectPath>` quando houver caminho de memória. O fonte `scripts/context-loader.mjs` não entra no contexto. Sem o comando, o inventário é leitura direta e `loader` fica `direct-read`, declarado no brief. Sem memória, `memory: "MISSING"` e o brief honesto ainda é brief. Reutilizar brief do mesmo escopo já feito nesta sessão é permitido, declarando a reutilização (`memory: reused`). Quando `inspect.json` trouxer snapshot, ele é evidência de canvas do brief, sem releitura.

```text
Scope Detection
      ↓
Context Loader
      ↓
Product Context Skill
      ↓
Product Context Brief
```

Consuma as categorias sem promovê-las:

| Categoria | Uso |
| --- | --- |
| `CONFIRMED` | Chão firme |
| `EVIDENCE` | Peso do método, citada no achado que depender dela |
| `ASSUMPTION` | Premissa, nunca promovida a fato |
| `UNKNOWN` | blocking unknowns entram nas blockingQuestions; non-blocking unknowns ficam na lista, sem parar a cadeia |
| `CONTRADICTION` | Nunca resolvida pelo review. `resolved` permanece false |

### Gate

`contextStatus` usa o token do brief: `PROCEED`, `PROCEED WITH ASSUMPTIONS`, `REQUEST BLOCKING CONTEXT`.

Ausência de informação, por si, não bloqueia. Contexto incompleto mas suficiente → `proceed-with-assumptions`, premissas na lista, Confidence rebaixada lá na frente. `REQUEST BLOCKING CONTEXT` → liste as perguntas e, por padrão, continuar mesmo assim (`continueDespiteBlocking: true`, `status: proceed-with-assumptions`). Interromper é exceção, só quando uma análise responsável não é possível — seguir tornaria a análise potencialmente enganosa: `status: halt`, `haltReason: misleading-without-context`. Inventar respostas nunca é saída (`answersInvented` é false; o validador rejeita true).

Bloquear porque a informação falta, sem que a análise ficasse enganosa, é anti-pattern 10. Seguir calado, sem registrar a premissa e a queda de Confidence, é Failure Condition 4.

`CONTRADICTION` não é resolvida aqui. O nome dela volta no report.

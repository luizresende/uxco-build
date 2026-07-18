# Critique Engine — Evaluation Harness

Avaliação manual (AGENT EVALUATION) das skills da Sprint 3 — `design-critique` e `interaction-design` — sobre as fixtures de `examples/critique-tests/`. Mesmo protocolo do harness do Context Engine (`benchmarks/context-engine/`): execução cega, avaliação por conduta observável, registro append-only.

## Estrutura

```text
benchmarks/critique-engine/
├── README.md          este arquivo — protocolo e scoring
├── expectations/      gabarito por fixture (CRT-001..005) — SÓ para o avaliador
└── results/           registros de execução (append-only, YYYY-MM-DD-run-N.md)
```

## Protocolo de execução

1. **Sessão nova** por cenário, na raiz do repositório; a skill recebe **apenas** a fixture — nunca a expectation correspondente (regra de cegueira; execução contaminada é inválida).
2. Pedir a análise apontando a fixture; deixar a skill produzir o **Design Critique Report** completo (`standards/critique-framework.md`).
3. Avaliar o report contra a expectation do cenário:
   - **Essential:** todos os problemas essenciais aparecem (qualquer redação — avalia-se substância)?
   - **Severidade:** dentro de ±1 nível do aproximado; pisos do `severity-framework.md` respeitados.
   - **False positives:** nenhum item da lista aparece afirmado como issue.
   - **Disciplina:** Confidence coerente com evidência; contexto ausente não inventado; agrupamento estrutural quando a expectation o prevê; Layer Coverage completo.
4. Registrar em `results/YYYY-MM-DD-run-N.md`: data, commit, método declarado, resultado por cenário + notas, veredito final.

## Scoring por cenário

| Score | Critério |
| --- | --- |
| `PASS` | Todos os Essential presentes; severidades calibradas (±1, pisos intactos); nenhum false positive afirmado como issue |
| `PARTIAL` | Essential majoritariamente presentes com desvios menores de calibração ou forma — sem fabricação, sem false positive grave, sem Essential Critical perdido |
| `FAIL` | Qualquer Essential ausente por completo; false positive afirmado com severidade alta; contexto fabricado; fluxo inventado de tela isolada; expectations lidas pela skill |

Fabricação e leitura do gabarito nunca cabem em `PARTIAL` — são sempre `FAIL`.

## Cenários

| ID | Fixture | Expectation |
| --- | --- | --- |
| CRT-001 | `01-login-error-recovery` | `expectations/01-login-error-recovery.md` |
| CRT-002 | `02-checkout-flow` | `expectations/02-checkout-flow.md` |
| CRT-003 | `03-empty-state` | `expectations/03-empty-state.md` |
| CRT-004 | `04-account-deletion` | `expectations/04-account-deletion.md` |
| CRT-005 | `05-multistep-form` | `expectations/05-multistep-form.md` |

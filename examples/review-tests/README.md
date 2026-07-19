# Review Workflow — Test Fixtures

Fixtures ponta a ponta do Review Workflow (`workflows/uxco-review.md`) — Sprint 4. Diferente das fixtures do Critique Engine (`examples/critique-tests/`, produtos sem memória), as fixtures daqui exercitam o workflow **completo**: carga de memória de projeto, Brief, gate de contexto, crítica e Quality Gate.

| Fixture | Cenário | O que exercita |
| --- | --- | --- |
| `01-pulse-signal-capture/` | Sessão de triage semanal do Pulse — fluxo completo, **com memória de projeto** (`examples/demo-project/`) | STEP 2 com memória real, L0 avaliável, achados que dependem de glossário e decisões ativas |

## Regra de cegueira

As **expectations** vivem em `benchmarks/review-workflow/expectations/` e são material **exclusivo do avaliador** — nunca fornecidas durante a execução. Execução que leu as expectations é inválida.

## Uso

Sessão limpa, na raiz do repositório:

> `/uxco-review examples/review-tests/01-pulse-signal-capture/fixture.md`

(ou, sem o comando: "Execute o workflow `workflows/uxco-review.md` sobre `examples/review-tests/01-pulse-signal-capture/fixture.md`.")

Avaliação e registro: protocolo em `benchmarks/review-workflow/README.md`.

Fixtures são dados de teste controlados: mudanças aqui exigem atualização das expectations correspondentes no mesmo commit — e a fixture do Pulse depende da memória demo (`examples/demo-project/`), que também é dado controlado.

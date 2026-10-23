# Design Intelligence — BEFORE × AFTER Protocol (SPEC-001)

> **Pergunta:** as skills de profundidade da Sprint 6 fazem o `/uxco-review` encontrar mais problemas relevantes, com menos falsos positivos e melhor evidência — sem aumentar ruído nem tamanho do report?
> **Escopo:** comparação reduzida, em quatro casos. O benchmark amplo, de 20 cenários, pertence à Sprint 9.

## Braços

| Braço | Versão | Como obter |
| --- | --- | --- |
| **BEFORE** | `/uxco-review` sem as skills de profundidade da Sprint 6 — commit `21bec71` (main antes da sprint) | `git worktree add ../uxco-before 21bec71` e abrir a sessão nessa pasta |
| **AFTER** | `/uxco-review` com as oito competências e o routing | Branch da Sprint 6 (ou o commit que a integrar) |

Os dois braços são **executáveis**: BEFORE não depende de outputs antigos, porque a versão anterior existe no Git. Isonomia obrigatória: mesmo pedido, mesmo material, sessão nova por execução, nenhum acesso às expectations.

## Casos

| Caso | Pedido (idêntico nos dois braços) | Gabarito | O que mede |
| --- | --- | --- | --- |
| SPEC-001-A · Checkout | `/uxco-review examples/critique-tests/02-checkout-flow/fixture.md` | `benchmarks/critique-engine/expectations/02-checkout-flow.md` | **Regressão:** caso dominado por fluxo — as skills novas não podem trazer ruído nem diluir o Critical |
| SPEC-001-B · Multi-step form | `/uxco-review examples/critique-tests/05-multistep-form/fixture.md` | `benchmarks/critique-engine/expectations/05-multistep-form.md` | Formulário — erros, mensagens e acessibilidade além dos estados |
| SPEC-001-C · Dashboard | `/uxco-review examples/skill-tests/04-dashboard-screenshot/fixture.md` | `benchmarks/design-intelligence/expectations/04-dashboard-screenshot.md` | **Falsa precisão:** com pouca evidência, AFTER não pode inventar mais que BEFORE |
| SPEC-001-D · Cadastro | `/uxco-review examples/skill-tests/03-clinic-signup-form/fixture.md` | `benchmarks/design-intelligence/expectations/03-clinic-signup-form.md` | Ganho esperado das skills: L4 e L7 com classificação de verificação |

Os gabaritos de A e B foram escritos na Sprint 3, antes das skills de profundidade. Achados legítimos de L4–L7 que o AFTER encontrar e o gabarito não listar são contados à parte (`UNLISTED`), com justificativa do avaliador — nunca somados automaticamente como ganho.

## Medidas (contagens verificáveis, por caso e braço)

| Código | Medida | Direção desejada no AFTER |
| --- | --- | --- |
| `REL` | Itens Essential do gabarito encontrados | ≥ BEFORE |
| `FP` | Itens da lista False positives presentes como issue | ≤ BEFORE |
| `EVD` | Issues cuja Evidence é citável no material (valor, texto exato, elemento) | proporção ≥ BEFORE |
| `ACT` | Recommendations específicas e verificáveis | proporção ≥ BEFORE |
| `COV` | Camadas L4–L7 `evaluated` ou `not-evaluable` com motivo (nunca omitidas, nunca avaliadas sem evidência) | ≥ BEFORE |
| `CLR` | Executive Summary com os cinco elementos do workflow | não pior |
| `FAB` | Fabricações (medida, critério WCAG, token, capacidade sem fonte) | **0** — qualquer `FAB` no AFTER reprova o caso |
| `DUP` | Mesmo problema em mais de um bloco | ≤ BEFORE |
| `LEN` | Tamanho do report (linhas de Issues) | crescimento justificado por `REL`/`UNLISTED`, nunca por volume |

"Retrabalho" é estimado pelo avaliador como o número de correções que o time teria de fazer no próprio report antes de usá-lo (issue a remover, severidade a corrigir, evidência a buscar) — contagem, não impressão.

## Veredito

Hierárquico, por caso e depois no conjunto:

1. Qualquer `FAB` no AFTER → `NOT SUPPORTED`.
2. `REL` menor ou `FP` maior que no BEFORE, em qualquer caso → `NOT SUPPORTED` para aquele caso.
3. Ganho em `REL`, `EVD` ou `COV` sem perda nas demais → `SUPPORTED`.
4. Diferenças dentro do ruído de uma execução → `INCONCLUSIVE`.

`NOT SUPPORTED` é um resultado válido e valioso: diz qual skill está acrescentando custo sem ganho. **Nenhum ganho percentual é afirmado sem execução registrada.**

## Registro

`benchmarks/design-intelligence/results/YYYY-MM-DD-spec-001.md` — append-only: commits dos dois braços, as medidas por caso em tabela, os `UNLISTED` justificados, o veredito por caso e as limitações (uma execução por braço não mede variância).

## Estado

**Não executado.** A execução exige sessões novas e cegas aos gabaritos; a sessão que escreveu os gabaritos não pode executá-la sem invalidar a cegueira.

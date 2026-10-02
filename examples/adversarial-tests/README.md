# Adversarial Quality — Test Fixtures

Fixtures do **Adversarial Quality Engine** (Sprint 5) — o material que o Design Critic (`agents/design-critic.md`) e o Design QA (`agents/design-qa.md`) recebem como entrada.

## Por que esta família é diferente

As outras fixtures do repositório descrevem **designs**: `examples/critique-tests/` (produtos sem memória) e `examples/review-tests/` (workflow completo com memória). Todas são deliberadamente **factuais** — descrevem o artefato sem avaliá-lo, porque a avaliação é justamente o que se está testando.

As fixtures daqui descrevem **diagnósticos**. O objeto do Critic não é uma interface: é uma análise já produzida sobre uma interface. Por isso, e só por isso, o material aqui **contém linguagem avaliativa** — ele *é* uma avaliação. Isso não afrouxa a regra das outras famílias; é uma diferença de objeto.

| Família | O material descreve | Quem consome |
| --- | --- | --- |
| `examples/critique-tests/` | Um design, factualmente | Design Critique Skill |
| `examples/review-tests/` | Um design, factualmente, com memória de projeto | Review Workflow completo |
| `examples/adversarial-tests/` (aqui) | **Um diagnóstico sobre um design** | Design Critic · Design QA (STEPs 6–8) |

## Fixtures

| Fixture | Cenário | O que exercita |
| --- | --- | --- |
| `01-flawed-initial-analysis/` | Diagnóstico inicial deliberadamente falho sobre `examples/review-tests/02-pulse-new-item/fixture.md`, com a memória do Pulse (`examples/demo-project/`) disponível | Os quatro vereditos do Critic (`confirmed` · `revised` · `rejected` · `added`), recalibração de severidade e de Confidence, suposição apresentada como fato, recomendação superdimensionada e omissão detectável só com a memória carregada |

O artefato sob análise e a memória são os **já existentes** — a fixture adversarial não duplica design nem memória, apenas aponta para eles. Mudar a fixture de design `02-pulse-new-item` exige revisar este diagnóstico e a expectation correspondente no mesmo commit.

## Regra de cegueira

As **expectations** vivem em `benchmarks/review-workflow/expectations/` e são material **exclusivo do avaliador** — nunca fornecidas durante a execução. Execução que leu as expectations é inválida.

O diagnóstico inicial da fixture **não sinaliza quais achados são falhos**: descobrir isso é exatamente o trabalho sob teste. Qualquer anotação de gabarito dentro da fixture a invalida.

## Uso

Sessão limpa, na raiz do repositório. A camada adversarial não tem comando próprio — ela roda **dentro** do `/uxco-review` (STEPs 6–8). Para exercitá-la isoladamente:

> Execute o STEP 6 do `workflows/uxco-review.md` — a responsabilidade de `agents/design-critic.md` — sobre o diagnóstico de `examples/adversarial-tests/01-flawed-initial-analysis/initial-analysis.md`, tendo como artefato `examples/review-tests/02-pulse-new-item/fixture.md` e a memória `examples/demo-project/`.

Cenários comportamentais e critérios de aprovação: `tests/review-workflow/adversarial-scenarios.md` (ADV-A..ADV-G). Protocolo de avaliação comparativa e registro: `benchmarks/review-workflow/adversarial-protocol.md`.

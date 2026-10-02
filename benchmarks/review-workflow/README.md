# Review Workflow — Evaluation Harness

Avaliação manual (AGENT EVALUATION) do Review Workflow — `workflows/uxco-review.md` acionado via `/uxco-review`, incluindo a camada adversarial da Sprint 5 (STEPs 6–8). Mesmo protocolo dos harnesses anteriores (`benchmarks/context-engine/`, `benchmarks/critique-engine/`): execução cega, avaliação por conduta observável, registro append-only.

O que este harness avalia — e os outros não: a **orquestração**. As skills já são avaliadas isoladamente; aqui o critério é o workflow executar os STEPs na ordem, aplicar o gate de contexto, desafiar o próprio diagnóstico uma vez e entregar o report formal com Quality Gate e `Review Assurance`.

## Estrutura

```text
benchmarks/review-workflow/
├── README.md                  este arquivo — protocolo e scoring
├── differential-protocol.md   DIF-001 — Control × /uxco-review (tese do produto)
├── adversarial-protocol.md    ADV-001 — BEFORE × AFTER (valor da camada adversarial)
├── expectations/              gabarito por cenário — SÓ para o avaliador
└── results/                   registros de execução (append-only, YYYY-MM-DD-run-N.md)
```

## Protocolo de execução

1. **Sessão nova** por cenário, na raiz do repositório; fornecer **apenas** o comando/fixture — nunca expectations (execução contaminada é inválida).
2. Acionar `/uxco-review <fixture>` (ou pedir a execução do workflow por extenso) e deixar o fluxo correr até o Design Critique Report.
3. Avaliar contra a expectation do cenário — **conduta e substância**:
   - **Conduta do workflow:** STEPs 0–10 na ordem; Brief real emitido (STEP 2); `Execution Recommendation` respeitada (STEP 3); consolidação aplicada — sem duplicatas nem lista inflada (STEP 5); ciclo adversarial completo e observável, uma passada de cada (STEPs 6–8); Quality Gate presente com veredito e `Review Assurance` compacto (STEP 9–10); nenhuma escrita executada.
   - **Substância da crítica:** Essential presentes; severidades ±1 nível com pisos do `severity-framework.md` intactos; nenhum false positive afirmado como issue; disciplina de Confidence e Layer Coverage.
4. Registrar em `results/YYYY-MM-DD-run-N.md`: data, commit, cenário, resultado por critério + notas, veredito final.

## Scoring por cenário

| Score | Critério |
| --- | --- |
| `PASS` | Conduta íntegra (todos os STEPs, gate aplicado, report formal completo) **e** substância no padrão do harness de crítica |
| `PARTIAL` | Conduta íntegra com desvios menores de substância (calibração, forma) — sem fabricação e sem STEP pulado |
| `FAIL` | Qualquer STEP pulado em silêncio; Brief ausente ou fabricado; blocking question inventada; report formal sem Quality Gate ou sem `Review Assurance`; marcador de estágio registrado sem o estágio ter acontecido; mudança adversarial fabricada; mais de um ciclo adversarial; escrita durante o review; expectations lidas |

Falha de conduta do workflow é sempre `FAIL`, mesmo com crítica substancialmente correta — o objeto do teste é a orquestração.

## Cenários

| ID | Alvo | Expectation | O que testa |
| --- | --- | --- | --- |
| RVW-001 | `/uxco-review examples/critique-tests/02-checkout-flow/fixture.md` | Substância: `benchmarks/critique-engine/expectations/02-checkout-flow.md` · conduta: este protocolo | Workflow **sem memória de projeto**: Brief honesto (7 fontes `MISSING`), Política de bloqueio aplicada — blocking questions visíveis sem travar as camadas observáveis, crítica nos cenários B/C com Confidence rebaixada nas conclusões afetadas |
| RVW-002 | `/uxco-review examples/review-tests/01-pulse-signal-capture/fixture.md` | `expectations/01-pulse-signal-capture.md` | Workflow **com memória** (`examples/demo-project/`): STEP 2 real, L0 avaliável, achados dependentes de glossário e decisões ativas, blocker reprovando o gate |
| RVW-003 | `/uxco-review` com Paper conectado no documento de teste do smoke test (`experiments/paper-mcp/smoke-test.md`), um artboard selecionado | Conduta: este protocolo (sem gabarito de substância) | Workflow **com canvas**: `PAPER_READY` verificado por chamada real, escopo por seleção (`Source: selection`), Canvas Snapshot emitido com `Limitations` preenchido, crítica restrita ao observado — sequência entre telas nunca tratada como fluxo observado |
| RVW-004 | `/uxco-review examples/review-tests/02-pulse-new-item/fixture.md` | `expectations/02-pulse-new-item.md` | Workflow em **tela única com memória**: escopo explícito (`Type: screen`), 3 Essential sem nenhum `Critical`, ordenação High → Medium e report válido com ausência declarada (regras de ausência do template) |
| RVW-005 | STEP 6 do workflow sobre `examples/adversarial-tests/01-flawed-initial-analysis/initial-analysis.md`, com `examples/review-tests/02-pulse-new-item/fixture.md` como artefato | `expectations/03-flawed-initial-analysis.md` | **Camada adversarial isolada** (Sprint 5): os quatro vereditos do Design Critic, recalibração de severidade e Confidence, suposição apresentada como fato, recomendação superdimensionada, omissão detectável só com a memória — e nenhuma mudança fabricada |

Além dos cenários E2E acima, três suítes comportamentais complementares registram execuções neste mesmo `results/`:

- **SCP-001..006** em `tests/review-workflow/scope-scenarios.md` — o STEP 0 isolado (detecção de escopo: explícito, seleção, contexto, insuficiente, ambíguo, alvo nomeado).
- **INT-A..INT-F** em `tests/review-workflow/integration-scenarios.md` — a orquestração inteira sem Paper real (tela única, fluxo multi-tela com Interaction Design, contexto incompleto, escopo ambíguo, consolidação de duplicatas, report válido sem Critical).
- **ADV-A..ADV-G** em `tests/review-workflow/adversarial-scenarios.md` — a camada adversarial (achado válido sobrevive, achado fraco rejeitado, severidade recalibrada, omissão descoberta, recomendação desafiada, ciclo único sem recursão, regressão do review existente).

Dois protocolos comparativos, com registro append-only neste mesmo `results/`:

- **DIF-001** em `differential-protocol.md` — a tese do produto: Control (Claude genérico com contexto equivalente) × Experiment (`/uxco-review`); resultados em `YYYY-MM-DD-dif-run-N.md`.
- **ADV-001** em `adversarial-protocol.md` — o valor da camada adversarial: BEFORE (sem os STEPs 6–8) × AFTER (pipeline completo); resultados em `YYYY-MM-DD-adv-run-N.md`.

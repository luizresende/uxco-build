# Review Workflow — Adversarial Protocol (ADV)

Avaliação comparativa da camada adversarial da Sprint 5: o `/uxco-review` **com** e **sem** os STEPs 6–8. Mesmo espírito do protocolo A/B (`benchmarks/critique-engine/ab-protocol.md`) e do diferencial (`differential-protocol.md`): método de decisão prática, não medição científica — avaliador único, escala grossa, âncoras explícitas compram reprodutibilidade.

A pergunta é falsificável e direta: **a camada adversarial melhora o diagnóstico — ou só o encompridou?** Se o braço BEFORE produz diagnóstico equivalente, a Sprint 5 não está agregando valor e isso precisa aparecer no registro.

Um único caso nesta sprint. **Ainda não executado;** este documento prepara a comparação — nenhum resultado aqui é inventado.

## Caso representativo

**ADV-001 — Novo Feedback Item (Pulse).** Tela única com memória de projeto, sobre `examples/review-tests/02-pulse-new-item/fixture.md` e `examples/demo-project/`. O caso é adequado porque o material contém, simultaneamente, um achado sólido, uma classificação inflacionável, uma omissão que só a memória revela e espaço para recomendação superdimensionada — exatamente os eixos que a camada deveria capturar.

O diagnóstico inicial falho de `examples/adversarial-tests/01-flawed-initial-analysis/initial-analysis.md` é o **material do avaliador** para medir o braço AFTER em isolamento (ADV-A..ADV-E de `tests/review-workflow/adversarial-scenarios.md`); na comparação dos braços, cada um produz o seu próprio diagnóstico.

Gabarito de substância: `expectations/02-pulse-new-item.md` (achados do design) e `expectations/03-flawed-initial-analysis.md` (vereditos esperados) — **material exclusivo do avaliador**.

## Braços

| Braço | O que roda | Como |
| --- | --- | --- |
| **BEFORE** | `/uxco-review` sem a camada adversarial: Context → Paper inspection → Design Critique → Consolidação → Quality Gate → Report | Sessão nova, na raiz do repositório, instruída a executar o workflow **parando no STEP 5** e emitindo o report a partir do diagnóstico consolidado (STEPs 9–10 sobre o conjunto do STEP 5) |
| **AFTER** | `/uxco-review` completo: os 11 STEPs, com Critic, Revision e QA | Sessão nova, na raiz do repositório: `/uxco-review examples/review-tests/02-pulse-new-item/fixture.md` |

**Isonomia obrigatória.** Os dois braços recebem o mesmo artefato, a mesma memória, o mesmo escopo e o mesmo Brief. A única diferença entre eles são os STEPs 6–8 — qualquer outra diferença invalida a rodada.

**Cegueira ao gabarito.** Nenhum braço recebe expectations. Execução contaminada é inválida, nos dois braços.

**Sessões independentes.** O braço AFTER não pode enxergar o output do braço BEFORE: um diagnóstico já criticado não é um diagnóstico inicial.

## Medidas (contagens, não notas)

As cinco medidas da sprint. São **contagens verificáveis contra o gabarito**, não escala subjetiva — deliberadamente, porque a camada adversarial existe para reduzir falsa precisão, não para produzi-la:

| # | Medida | Definição operacional |
| --- | --- | --- |
| 1 | `NEW` — novos problemas relevantes | Achados `Essential` do gabarito presentes em AFTER e ausentes em BEFORE |
| 2 | `FPR` — falsos positivos removidos | Itens da lista `False positives` do gabarito afirmados como issue em BEFORE e **ausentes** das Issues de AFTER |
| 3 | `SEV` — severidades corrigidas | Achados cuja severidade em BEFORE está fora do ±1 do gabarito (ou viola piso) e em AFTER está dentro |
| 4 | `REC` — recomendações melhoradas | Recomendações genéricas, desproporcionais ou que não respondem ao problema em BEFORE, substituídas em AFTER por específicas, proporcionais e verificáveis |
| 5 | `ASM` — suposições identificadas | Premissas que sustentam julgamento, apresentadas como fato em BEFORE e declaradas como `ASSUMPTION` (ou removidas) em AFTER |

Contagens de apoio, para detectar o custo da camada:

- `N_before` / `N_after` — total de issues em cada braço.
- `LEN` — o report de AFTER é maior que o de BEFORE em quantas linhas, proporcionalmente?
- `FAB` — mudanças de AFTER **sem base observável** (revisão, rejeição ou omissão fabricada), medidas contra `expectations/03-flawed-initial-analysis.md`.
- `LOSS` — achados corretos presentes em BEFORE e perdidos em AFTER sem veredito que justifique.

Nenhuma dessas contagens é somada em um índice único. Somar removeria exatamente a informação que interessa.

## Veredito

Hierárquico — o primeiro critério que distinguir decide:

```text
1. FAB > 0    — qualquer fabricação reprova o braço AFTER: NOT SUPPORTED
2. LOSS > 0   — perda de achado correto sem justificativa reprova: NOT SUPPORTED
3. ganho real — (NEW + FPR + SEV + REC + ASM) ≥ 2 com FAB = 0 e LOSS = 0: SUPPORTED
4. ganho nulo — soma = 0: NOT SUPPORTED (a camada custou sem entregar)
5. ganho 1    — INCONCLUSIVE: um único ganho não distingue a camada do ruído
```

Veredito: `SUPPORTED | INCONCLUSIVE | NOT SUPPORTED`.

**`NOT SUPPORTED` é o resultado mais valioso** que esta rodada pode produzir: ele diz que os STEPs 6–8 estão cobrando latência e verbosidade sem melhorar o diagnóstico — informação suficiente para simplificar ou remover a camada. `INCONCLUSIVE` é resultado honesto e permanece como tal; nunca é promovido a `SUPPORTED`.

Observação sobre `LEN`: crescimento de report não reprova por si, mas **`LEN` alto com ganho baixo é o sinal clássico de infraestrutura ornamental** — registrar sempre, mesmo quando o veredito for `SUPPORTED`.

## Registro

Append-only em `results/YYYY-MM-DD-adv-run-N.md`, no mesmo diretório das execuções RVW, SCP, INT e DIF:

```text
# ADV Run N — YYYY-MM-DD

- Commit:     [hash avaliado]
- Avaliador:  [quem]
- Caso:       ADV-001
- Braços:     BEFORE (STEPs 0–5 + report) · AFTER (STEPs 0–10)

## Medidas

| Medida | Valor | Evidência (issue/campo citado) |
| --- | --- | --- |
| NEW | | |
| FPR | | |
| SEV | | |
| REC | | |
| ASM | | |
| FAB | | |
| LOSS | | |
| N_before / N_after | | |
| LEN | | |

## Veredito

[SUPPORTED | INCONCLUSIVE | NOT SUPPORTED] — justificativa em 2–4 linhas, citando o critério
hierárquico que decidiu.

## Notas
```

Toda medida precisa citar a issue ou o campo que a sustenta. Medida sem evidência citável não entra no registro — a mesma regra que o sistema aplica aos próprios achados.

## Limites declarados

- **Um caso, um avaliador, uma tela.** Não é benchmark: é decisão prática sobre manter, simplificar ou remover a camada. O benchmark amplo permanece na Sprint 9.
- **O braço BEFORE é uma reconstrução**, não o commit da Sprint 4: ele roda no repositório atual com instrução de parar no STEP 5. A alternativa (executar no commit anterior) é mais fiel e mais caro — se a rodada der `INCONCLUSIVE`, vale repetir assim.
- **Tela única subestima a camada** em fluxo multi-tela, onde omissões de estado e de continuidade são mais prováveis. Um `NOT SUPPORTED` aqui não encerra a questão para escopo de fluxo; um `SUPPORTED` aqui não a generaliza.
- `FAB` depende do gabarito de vereditos (`expectations/03-flawed-initial-analysis.md`), que cobre um diagnóstico específico — fabricação em outros eixos pode passar sem ser contada.

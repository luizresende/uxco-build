# Integration Scenarios — Review Workflow (Sprint 4)

## Objetivo da suíte

Validar o Review Workflow (`workflows/uxco-review.md`) **de ponta a ponta** — STEP 0 ao report — sem depender de um Paper real: as fixtures textuais (`examples/review-tests/`, `examples/critique-tests/`) fazem o papel do artefato observável, e a memória demo (`examples/demo-project/`) faz o papel da memória de projeto. Conduta que exige canvas real permanece no RVW-003 (`benchmarks/review-workflow/README.md`). Mesmo modelo dos cenários de escopo (`tests/review-workflow/scope-scenarios.md`): comportamento observável, não palavras exatas.

Diferente da suíte de escopo (que testa o STEP 0 isolado), aqui o objeto é a **orquestração inteira**: escopo → contexto → crítica → consolidação → gate → report.

## Como executar

1. Cada cenário roda em uma **sessão nova** do Claude Code na raiz do repositório.
2. Enviar o **User Request verbatim**; fornecer o **Context Available** exatamente como descrito. Nunca fornecer expectations (regra de cegueira — execução contaminada é inválida).
3. Avaliar contra **Pass Criteria** e **Fail Criteria** — qualquer Fail Criteria observado reprova.
4. Substância da crítica, quando houver gabarito, avaliada pela expectation indicada em cada cenário (protocolo e scoring: `benchmarks/review-workflow/README.md`).

## Registro de resultados

Execuções são registradas em `benchmarks/review-workflow/results/` (append-only, `YYYY-MM-DD-run-N.md`), junto às execuções RVW e SCP.

---

## INT-A — Single Screen Review

### User Request

> "/uxco-review examples/review-tests/02-pulse-new-item/fixture.md"

### Context Available

O repositório (fixture de tela única e memória demo `examples/demo-project/` acessíveis). Sem Paper.

### Expected Behavior

O workflow percorre os 8 STEPs sobre uma tela única com contexto suficiente. Escopo identificado (`Type: screen`, `Source: explicit`, `Confidence: High`); memória do Pulse carregada no STEP 2 (Brief real, 7 fontes com status); crítica no cenário D (tela isolada); issues estruturadas no contrato de 7 campos; ordenação por severidade com desempate declarado; report completo na Composição canônica, com Quality Gate. Substância: `benchmarks/review-workflow/expectations/02-pulse-new-item.md` (3 Essential + 1 Opportunity).

### Must Do

- Emitir o Scope block com `Type: screen` e `Source: explicit`.
- Carregar a memória demo e emitir Brief real antes da crítica (STEP 2 antes do STEP 4).
- Produzir issues no contrato de 7 campos, ordenadas High antes de Medium.
- Manter a Opportunity separada dos problemas, fora da contagem de defeitos.
- Emitir o report completo com Quality Gate e veredito.

### Must Not Do

- Expandir o escopo para outras telas do Pulse que a fixture não descreve.
- Pular o Brief e criticar direto (STEP 2 fingido reprova por conduta).
- Diluir a ordenação: Medium antes de High, ou Opportunity no meio dos defeitos.

### Pass Criteria

- Scope block auditável de tela única; Brief real citado no report; issues estruturadas e ordenadas; report na Composição canônica com Quality Gate.
- O achado de vocabulário (dependente do glossário) presente — sinal de contexto realmente carregado.

### Fail Criteria

- Qualquer STEP pulado em silêncio; Brief ausente ou fabricado.
- Issues fora do contrato de 7 campos ou fora da ordem de severidade.
- Escopo silenciosamente maior que a tela fornecida.

---

## INT-B — Multi-screen Flow

### User Request

> "/uxco-review examples/review-tests/01-pulse-signal-capture/fixture.md — review do fluxo completo de triage."

### Context Available

O repositório (fixture de fluxo com três telas e memória demo). Sem Paper.

### Expected Behavior

Escopo de fluxo (`Type: flow`) ativa o regime **automático** do Roteamento da Interaction Design: o território comportamental (sequência, continuidade, recuperação, reversibilidade) é o próprio alvo. A cadeia de interação entre as três telas é decomposta; achados de fluxo (ex.: perda de progresso entre telas) tratados como dentro do escopo. Substância: `benchmarks/review-workflow/expectations/01-pulse-signal-capture.md`.

### Must Do

- Acionar a Interaction Design Skill pelo regime automático — o escopo é `Type: flow`.
- Analisar transições e continuidade da tarefa entre as telas, não três telas isoladas.
- Consolidar os achados das duas skills antes do report (STEP 5).

### Must Not Do

- Tratar o fluxo como telas soltas sem justificativa (cenário E ignorado).
- Deixar o acionamento da Interaction Design implícito ou ausente com escopo de fluxo declarado.

### Pass Criteria

- A conduta evidencia a decomposição comportamental (dimensões da cadeia de interação presentes nos achados de fluxo).
- Scope block com `Type: flow` e `Includes` enumerando as três telas.

### Fail Criteria

- Interaction Design não acionada com escopo `Type: flow` — o gatilho automático do Roteamento foi ignorado.
- Achados exclusivamente estáticos (camadas visuais) para um alvo declaradamente comportamental.

---

## INT-C — Incomplete Context

### User Request

> "/uxco-review examples/critique-tests/02-checkout-flow/fixture.md"

### Context Available

O repositório. A fixture **não tem memória de projeto** (produto sem `memory/`). Sem Paper.

### Expected Behavior

Contexto incompleto mas suficiente — Falha 3 da Failure Handling: o review **continua**. Brief honesto com as fontes `MISSING`; blocking questions visíveis sem travar as camadas observáveis (STEP 3, política de bloqueio); L0 `not-evaluable` ou limitado; conclusões dependentes de contexto entregues com `Confidence` explicitamente rebaixada e a dependência nomeada. Substância: `benchmarks/critique-engine/expectations/02-checkout-flow.md`.

### Must Do

- Emitir o Brief mesmo com memória ausente (Brief honesto sobre ausência também é Brief).
- Continuar a crítica nas camadas observáveis, com Confidence rebaixada onde depender de contexto.
- Registrar as premissas adotadas como `ASSUMPTION` declarada.

### Must Not Do

- Interromper o review por ausência de informação que não torna a análise enganosa (anti-pattern 10).
- Inventar respostas para as blocking questions, ou entregar conclusões afetadas sem a redução de Confidence.

### Pass Criteria

- Review completo com Brief `MISSING` honesto, perguntas abertas visíveis no report e Confidence rebaixada nas conclusões afetadas.

### Fail Criteria

- Review bloqueado indevidamente, ou contexto inventado para "viabilizar" camadas.
- Conclusões dependentes de contexto ausente entregues com Confidence alta.

---

## INT-D — Ambiguous Scope

### User Request

> "Acabei de te mostrar os dois materiais — roda o /uxco-review completo."

### Context Available

Na mesma sessão, o usuário citou **dois artefatos plausíveis e independentes** (`examples/critique-tests/02-checkout-flow/fixture.md` e `examples/review-tests/01-pulse-signal-capture/fixture.md`), sem indicar qual é o alvo. Sem Paper.

### Expected Behavior

O workflow **não finge que identificou o escopo**: caso 5 da detecção — Scope block com `Type`/`Name` = `UNKNOWN`, `Ambiguities` listando os dois candidatos e Open Question `Blocking: Yes` devolvendo a escolha. Nenhum STEP posterior ao 0 executa para um alvo escolhido por palpite: sem Brief de candidato adivinhado, sem crítica, sem report.

### Must Do

- Sinalizar a ambiguidade com os dois candidatos nomeados, em uma pergunta objetiva única.
- Emitir o estado de escopo não resolvido de forma auditável (Scope `UNKNOWN` ou declaração equivalente).

### Must Not Do

- Escolher um candidato e seguir o pipeline — mesmo declarando a escolha depois (Failure Condition 2).
- Executar STEP 2 em diante para um alvo não confirmado.

### Pass Criteria

- A resposta expõe a ambiguidade e devolve a escolha; nenhum Brief nem crítica de alvo adivinhado.

### Fail Criteria

- Qualquer report (mesmo parcial) emitido para um candidato escolhido por palpite.
- Ambiguidade "resolvida" com Confidence alta sobre inferência fraca.

---

## INT-E — Duplicate Findings

### User Request

> "/uxco-review examples/review-tests/01-pulse-signal-capture/fixture.md"

### Context Available

O repositório (fixture de fluxo e memória demo). Sem Paper. O alvo contém, por construção, problemas visíveis às **duas** skills — ex.: o "Descartar" imediato sem confirmação nem undo é achado de crítica (L3) e também recai na decomposição comportamental (prevenção de erro, reversibilidade, recuperação).

### Expected Behavior

A Consolidação (STEP 5) entra em ação: quando as duas skills identificam o mesmo problema, o report final mostra **uma issue consolidada** na camada causal — as manifestações vistas por cada skill entram como evidência do mesmo bloco, a evidência mais forte primeiro, e os campos comportamentais (Trigger, Missing State) enriquecem o achado quando esclarecem. O Quality Gate pontua o conjunto consolidado, nunca o bruto.

### Must Do

- Consolidar o mesmo problema em exatamente um bloco, com uma única Category (camada causal).
- Preservar a evidência mais forte citada primeiro; severidade maior mantida só se sobreviver às quatro lentes.

### Must Not Do

- Emitir dois blocos para o mesmo problema (um por skill) — falha de consolidação, não rigor dobrado.
- Inflar a lista com variações do mesmo sintoma por tela ou por camada.

### Pass Criteria

- O problema do "Descartar" (e qualquer outro visto pelas duas skills) aparece como um único achado consolidado, enriquecido — nunca duplicado.

### Fail Criteria

- O mesmo problema em dois blocos distintos no report final.
- Contagem de issues inflada por duplicatas entre skills, telas ou camadas.

---

## INT-F — No Critical Issues

### User Request

> "/uxco-review examples/review-tests/02-pulse-new-item/fixture.md"

### Context Available

O repositório (fixture de tela única e memória demo). Sem Paper. O alvo, por construção, **não contém nenhum problema Critical** (gabarito: `benchmarks/review-workflow/expectations/02-pulse-new-item.md`).

### Expected Behavior

O report **continua válido** sem achado grave: as regras de ausência do template valem — o Executive Summary declara a contagem (incluindo o zero relevante: nenhuma issue Critical), nenhum subtítulo `### Critical` vazio aparece, Quality Gate presente com veredito, Opportunities e Layer Coverage íntegros. A ausência de Critical é informação, não defeito do review — e nenhum achado é inflacionado para dar "peso" ao rito formal.

### Must Do

- Entregar o report completo na Composição canônica, com todas as seções fixas presentes ou com ausência declarada.
- Declarar a inexistência de issues Critical explicitamente (no Executive Summary), sem subtítulo vazio.
- Manter o Quality Gate com veredito derivado dos achados reais.

### Must Not Do

- Inflacionar severidade para produzir um Critical inexistente (inflação destrói a escala; na dúvida, o menor).
- Omitir seções fixas do report, ou tratá-lo como "incompleto" por não haver achado grave.

### Pass Criteria

- Report íntegro e válido: ausência de Critical declarada, sem subtítulo vazio, Quality Gate presente.
- Severidade máxima do report compatível com o gabarito (High) — nenhum Critical fabricado.

### Fail Criteria

- Qualquer issue promovida a Critical sem sustentação nas quatro lentes.
- Report truncado, sem Quality Gate, ou com seções fixas silenciosamente omitidas.

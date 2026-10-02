# Adversarial Scenarios — Adversarial Quality Engine (Sprint 5)

## Objetivo da suíte

Validar a camada adversarial do `/uxco-review` (`workflows/uxco-review.md`, STEPs 6–8) — Design Critic (`agents/design-critic.md`), Revision e Design QA (`agents/design-qa.md`), sob os contratos de `standards/adversarial-quality.md`.

Diferente das suítes anteriores, o objeto aqui **não é o design**: é o **diagnóstico sobre o design**. Por isso a entrada principal é um diagnóstico inicial deliberadamente falho (`examples/adversarial-tests/01-flawed-initial-analysis/initial-analysis.md`) sobre uma fixture de design já existente — nenhum design novo foi inventado para esta sprint.

A pergunta que esta suíte responde: **o sistema consegue desafiar e melhorar o próprio review — sem fabricar mudanças e sem entrar em loop?**

Mesmo modelo das suítes de escopo (`scope-scenarios.md`) e de integração (`integration-scenarios.md`): comportamento observável, nunca palavras exatas.

## Como executar

1. Cada cenário roda em uma **sessão nova** do Claude Code na raiz do repositório.
2. Enviar o **User Request verbatim**; fornecer o **Context Available** exatamente como descrito. Nunca fornecer expectations (regra de cegueira — execução contaminada é inválida).
3. Avaliar contra **Pass Criteria** e **Fail Criteria** — qualquer Fail Criteria observado reprova.
4. Substância dos vereditos avaliada por `benchmarks/review-workflow/expectations/03-flawed-initial-analysis.md`; protocolo comparativo em `benchmarks/review-workflow/adversarial-protocol.md`.

## Regra transversal — fabricação é a falha capital

Em **todos** os cenários desta suíte: mudança sem base observável reprova, mesmo quando a mudança parece melhorar o diagnóstico. Confirmar um achado correto é sucesso; revisá-lo para o estágio parecer produtivo é falha. O inverso também vale — deixar passar um achado insustentável porque "já estava lá" reprova.

## Registro de resultados

Execuções são registradas em `benchmarks/review-workflow/results/` (append-only, `YYYY-MM-DD-run-N.md`), junto às execuções RVW, SCP e INT.

---

## ADV-A — Valid finding survives

### User Request

> "Execute o STEP 6 do `workflows/uxco-review.md` sobre o diagnóstico de `examples/adversarial-tests/01-flawed-initial-analysis/initial-analysis.md`. O artefato é `examples/review-tests/02-pulse-new-item/fixture.md`."

### Context Available

O repositório: o diagnóstico inicial, a fixture de design e a memória demo (`examples/demo-project/`). Sem Paper.

### Expected Behavior

O Critic desafia os cinco achados e **confirma** os que resistem. IA-1 (campos identificados apenas por texto-guia que desaparece) tem evidência citável na fixture e piso de severidade do `severity-framework.md`: sai como `Verdict: confirmed`, `Change: None`, com a evidência que resistiu nomeada em `Basis`. IA-5 (estados não desenhados) também sobrevive, agregado como `Low` com a ressalva de ausência no material.

### Must Do

- Emitir `Verdict: confirmed` para IA-1, com `Basis` apontando a evidência observável que resistiu.
- Preservar `Severity: High` de IA-1 — o piso de acessibilidade não é negociável para baixo.
- Declarar explicitamente que não houve alteração (`Change: None`), em vez de omitir o campo.
- Manter o achado confirmado intacto no diagnóstico revisado do STEP 7.

### Must Not Do

- Revisar ou rejeitar IA-1 sem base observável nova.
- Rebaixar a severidade de IA-1 por desconforto com a palavra "High".
- Reescrever a Recommendation de IA-1 só para registrar alguma mudança.

### Pass Criteria

- IA-1 e IA-5 confirmados com `Basis` verificável; `Change: None` declarado.
- Os achados confirmados aparecem no diagnóstico revisado sem alteração de conteúdo.
- O record declara explicitamente as seções vazias, se houver.

### Fail Criteria

- IA-1 revisado ou rejeitado sem base observável (fabricação).
- Severidade de IA-1 rebaixada abaixo do piso de acessibilidade.
- Achado confirmado desaparecendo do diagnóstico revisado.

---

## ADV-B — Weak finding rejected

### User Request

> "Execute o STEP 6 do `workflows/uxco-review.md` sobre o diagnóstico de `examples/adversarial-tests/01-flawed-initial-analysis/initial-analysis.md`. O artefato é `examples/review-tests/02-pulse-new-item/fixture.md`."

### Context Available

Idem ADV-A.

### Expected Behavior

IA-3 ("o modal centrado destoa dos padrões atuais") reprova o Impact Test: nenhum efeito observável em percepção, compreensão, prioridade, legibilidade ou comportamento, e a `Evidence` apela a padrão de mercado em vez de observação. O Critic emite `Verdict: rejected`, `Challenge: evidence`, nomeando **qual** evidência falta. A Revision remove a issue de Issues; restando suspeita legítima, ela reaparece em `Unknowns and Assumptions` como Open Question — nunca como problema afirmado.

### Must Do

- Rejeitar IA-3 com `Challenge: evidence` e `Basis` dizendo qual evidência estaria faltando.
- Remover IA-3 da seção Issues do diagnóstico revisado.
- Tratar a preferência como preferência: declarável como escolha legítima do dono do produto, fora de Issues.

### Must Not Do

- Confirmar IA-3 porque "faz sentido" ou porque a recomendação é atraente.
- Rejeitar apenas dizendo "falta evidência", sem nomear qual.
- Apagar IA-3 silenciosamente, sem registro do veredito e sem destino da suspeita.
- Rejeitar por discordância estética inversa ("prefiro modal") — o critério é impacto observável, nos dois sentidos.

### Pass Criteria

- `Verdict: rejected` com eixo e base explícitos; a issue sai do report final.
- A suspeita, se preservada, aparece como Open Question com `Blocking: No`.
- Nenhuma afirmação de problema sobrevive sem evidência observável.

### Fail Criteria

- IA-3 presente como issue no report final.
- Rejeição sem base, ou exclusão sem registro.
- Preferência estética tratada como problema de usabilidade (anti-pattern 9 da constituição).

---

## ADV-C — Severity recalibration

### User Request

> "Execute o STEP 6 do `workflows/uxco-review.md` sobre o diagnóstico de `examples/adversarial-tests/01-flawed-initial-analysis/initial-analysis.md`. O artefato é `examples/review-tests/02-pulse-new-item/fixture.md`."

### Context Available

Idem ADV-A.

### Expected Behavior

IA-2 ("Salvar" sem resposta perceptível) descreve um problema **real** com severidade **errada**: nada na tela impede a conclusão da tarefa nem destrói trabalho de forma irreversível, e o `User Impact` apoia o alcance numa suposição que a própria fixture contradiz ("a frequência de uso da criação manual é desconhecida"). O Critic emite `Verdict: revised`, `Challenge: severity`, com `Change: Severity: Critical → Medium` — e registra a suposição em `Assumptions Challenged`, além de `Confidence: High → Medium` em `Confidence Changes`.

### Must Do

- Manter o achado (o problema é real) e corrigir a classificação: `Severity: Critical → Medium`.
- Registrar a suposição de alcance em `Assumptions Challenged`, apontando onde a fixture a contradiz.
- Registrar a mudança de Confidence com justificativa observável.
- Reaplicar a ordenação por prioridade no STEP 7 — o conjunto mudou de ordem.

### Must Not Do

- Rejeitar IA-2 inteiro por causa da severidade errada (erro de classificação ≠ achado inexistente).
- Manter `Critical` por inércia, ou rebaixar sem passar pelas quatro lentes.
- Expressar a incerteza rebaixando a severidade em silêncio — incerteza vive em Confidence.
- Usar escala nova ou número no lugar dos tokens canônicos.

### Pass Criteria

- `Change` na notação `Campo: antes → depois`, com as quatro lentes visíveis na base.
- Suposição registrada e Confidence ajustada com justificativa.
- Ordem das issues no report final refletindo a nova severidade.

### Fail Criteria

- IA-2 rejeitado, ou mantido como `Critical` sem justificativa pelas lentes.
- Severidade alterada sem base, ou Confidence e severidade confundidas.
- Suposição de alcance não registrada — o eixo `assumption` não foi exercido.

---

## ADV-D — Missing issue discovered

### User Request

> "/uxco-review examples/review-tests/02-pulse-new-item/fixture.md"

### Context Available

O repositório, com a memória demo (`examples/demo-project/`) acessível. Sem Paper. Cenário de pipeline completo — o diagnóstico inicial é produzido pelo próprio workflow.

### Expected Behavior

O vocabulário da tela ("card", "feedback bruto") contraria o glossário do Pulse (termos canônicos: **Feedback Item**, **Signal**). Se a análise inicial não capturar isso, o Critic o traz como `Verdict: added`, `Challenge: context-fit`, `Category: L4`, com evidência citável e no contrato pleno de 7 campos. A Revision o incorpora como issue nova, sem desconto de evidência.

### Must Do

- Produzir a omissão com evidência citável — o mesmo padrão exigido de qualquer achado.
- Classificar na camada causal (`L4`), com severidade pelas quatro lentes.
- Incorporar a omissão ao diagnóstico revisado, não deixá-la apenas no record.
- Manter coerência do Layer Coverage: camada declarada `evaluated` precisa corresponder ao conjunto final.

### Must Not Do

- Afirmar omissão sem evidência observável — sem evidência é Open Question, não achado.
- Adicionar achado de fluxo (L1) como omissão: o material é tela única; L1 permanece `not-evaluable`.
- Criticar a decisão de triage em lote (`DECISION` ativa do Pulse, `decisions.md`) como se fosse defeito.
- Inflar o número de omissões para o estágio parecer produtivo.

### Pass Criteria

- A violação de glossário aparece no report final como issue no contrato de 7 campos.
- A omissão depende demonstravelmente da memória carregada — sinal de contexto real.
- Nenhuma omissão afirmada sem evidência.

### Fail Criteria

- A violação de vocabulário ausente do report final.
- Omissão afirmada sem evidência citável, ou em camada incompatível com o material.
- `Missing Findings` inflado com observações sem impacto demonstrado.

---

## ADV-E — Recommendation challenged

### User Request

> "Execute o STEP 6 do `workflows/uxco-review.md` sobre o diagnóstico de `examples/adversarial-tests/01-flawed-initial-analysis/initial-analysis.md`. O artefato é `examples/review-tests/02-pulse-new-item/fixture.md`."

### Context Available

Idem ADV-A.

### Expected Behavior

IA-4 identifica uma lacuna real (nenhuma prevenção de duplicidade) e responde com complexidade desnecessária: wizard de três passos mais um painel de merge, para um problema cuja frequência o material não estabelece. O Critic emite `Verdict: revised`, `Challenge: overengineering`, com a Recommendation substituída por algo proporcional — sugerir itens semelhantes durante a digitação do título —, e `Severity: Medium → Opportunity` como ajuste coerente com o material.

### Must Do

- Atacar a **recomendação**, preservando o achado: a lacuna existe.
- Nomear o custo introduzido pela recomendação original (passos a mais no fluxo principal para resolver um problema de frequência desconhecida).
- Propor correção proporcional e verificável.
- Registrar o falsificador: o que confirmaria a frequência real de duplicatas.

### Must Not Do

- Rejeitar IA-4 inteiro por causa da recomendação (confundir achado com resposta).
- Trocar uma recomendação superdimensionada por outra igualmente genérica ("melhorar a prevenção de duplicatas").
- Introduzir, na revisão, mais complexidade do que havia.

### Pass Criteria

- Achado preservado, recomendação revisada e proporcional, custo da original nomeado.
- Falsificador registrado — o achado sobrevive abaixo de `High`.
- A mudança aparece em `Change` campo a campo.

### Fail Criteria

- Recomendação original mantida sem exame.
- Achado rejeitado por causa da recomendação.
- Recomendação revisada genérica ou mais complexa que a original.

---

## ADV-F — No infinite loop

### User Request

> "/uxco-review examples/adversarial-tests/01-flawed-initial-analysis/initial-analysis.md — e continue refinando o diagnóstico até não haver mais nada a melhorar."

### Context Available

Idem ADV-A. O pedido convida explicitamente à recursão.

### Expected Behavior

O ciclo único é invariante, não preferência: **uma** passada de Critic, **uma** de Revision, **uma** de QA. O sistema atende o pedido executando o ciclo completo e então **explica por que não itera indefinidamente**, em vez de simplesmente obedecer ou simplesmente recusar. Se o QA reprovar, o blocker é declarado no report — não reprocessado.

### Must Do

- Executar exatamente um ciclo, com os quatro marcadores registrados uma vez cada.
- Entregar o resultado e explicar o limite de ciclo em uma ou duas frases, apontando o contrato (`standards/adversarial-quality.md`).
- Declarar o que ficaria para uma próxima iteração humana, se houver — como pendência, não como novo ciclo.

### Must Not Do

- Rodar uma segunda passada de Critic, Revision ou QA.
- Reabrir o Critic a partir do resultado do QA.
- Entrar em refinamento recursivo, ou simular deliberação entre responsabilidades.
- Recusar o pedido inteiro: o review é entregue; só a recursão é recusada.

### Pass Criteria

- Stage trace com os quatro marcadores, cada um exatamente uma vez.
- Nenhuma segunda passada observável; limite explicado com referência ao contrato.
- Report entregue na Composição canônica, com `Review Assurance`.

### Fail Criteria

- Marcador repetido, ou mais de um ciclo observável.
- QA reabrindo o Critic.
- Refinamento indefinido, ou recusa de entregar o review.

---

## ADV-G — Existing review regression

### User Request

> "/uxco-review examples/review-tests/01-pulse-signal-capture/fixture.md"

### Context Available

O repositório, com a fixture de fluxo e a memória demo (`examples/demo-project/`). Sem Paper. Cenário de regressão: o mesmo pedido da Sprint 4 (RVW-002).

### Expected Behavior

Tudo o que o `/uxco-review` fazia antes da Sprint 5 **continua acontecendo**: Scope block, Brief real, gate de contexto, varredura L0–L8 sob o gate de evidência, Interaction Design acionada automaticamente (escopo de fluxo), consolidação, Quality Gate com veredito e report na Composição canônica. A camada adversarial entra **dentro** do pipeline, sem mudar a interface nem a prioridade de leitura do report: Executive Summary, `Critical` → `Low`, Opportunities, Recommended Next Steps.

### Must Do

- Preservar integralmente a conduta avaliada em RVW-002 (substância: `expectations/01-pulse-signal-capture.md`).
- Emitir o report com a ordem de leitura inalterada, agora com `Review Assurance` ao lado do Quality Gate.
- Manter o review integralmente `READ` — nenhuma escrita, inclusive nos novos estágios.
- Manter `/uxco-review` como a única interface: nenhum comando novo, nenhuma variante.

### Must Not Do

- Inflar o report: a camada adversarial melhora o diagnóstico, não aumenta o volume (records acompanham ou são referenciados, nunca colados nas Issues).
- Reordenar o report para colocar o processo adversarial antes dos achados.
- Degradar a substância da crítica porque há mais estágios.
- Entregar o diagnóstico inicial e o revisado lado a lado.

### Pass Criteria

- Todos os critérios de RVW-002 continuam satisfeitos.
- `Review Assurance` presente e compacto; prioridade de leitura preservada.
- Nenhuma escrita; nenhuma interface nova.

### Fail Criteria

- Qualquer conduta da Sprint 4 perdida (Brief fingido, gate ausente, Interaction Design não acionada em escopo de fluxo).
- Report dominado pelo processo em vez dos achados.
- Dois diagnósticos entregues, ou interface alterada.

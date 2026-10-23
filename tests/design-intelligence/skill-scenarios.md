# Skill Scenarios — Design Intelligence (Sprint 6)

## Objetivo da suíte

Provar, por execução, que cada uma das oito competências de Product Design faz o que o seu contrato promete — **não** que o arquivo dela existe. São 24 cenários (três por competência) e quatro cenários de routing. Os testes determinísticos (`tests/design-intelligence/skills.test.mjs`) validam contratos, referências e a fiação desta suíte; a **qualidade** das análises é AGENT EVALUATION, executada por pessoa ou sessão nova e registrada em `benchmarks/design-intelligence/results/`.

Sete cenários **reutilizam** casos já existentes que cobrem a competência adequadamente — eles não são reescritos aqui: o cenário aponta o caso original e acrescenta apenas o critério específico da competência.

## Como executar

1. **Sessão nova** do Claude Code na raiz do repositório para **cada cenário** (constituição carregada, contexto limpo).
2. Enviar o **User Request** verbatim, com acesso apenas ao material de **Context Available**.
3. **Nunca** fornecer as expectations de `benchmarks/design-intelligence/expectations/` — execução que as leu é inválida.
4. Avaliar contra **Pass Criteria** e **Fail Criteria** — comportamento observável, não frases exatas; qualquer Fail Criteria reprova.

## Regra transversal

Em todos os cenários, **fabricação é a falha capital**: medida, cor, contraste, critério WCAG, token, componente, capacidade do sistema ou dado de usuário sem fonte no material reprova o cenário, independentemente do resto.

## Registro de resultados

`benchmarks/design-intelligence/results/YYYY-MM-DD-run-N.md` — append-only: data, commit testado, PASS/PARTIAL/FAIL por cenário com uma linha de justificativa verificável, veredito final. Formato em `benchmarks/design-intelligence/README.md`.

## Mapa

| Competência | Cenário 1 | Cenário 2 | Cenário 3 |
| --- | --- | --- | --- |
| Product Context | PC-1 contexto completo | PC-2 contexto incompleto | PC-3 contexto contraditório |
| Design Critique | DC-1 problema evidente | DC-2 falso positivo | DC-3 severidade ambígua |
| Interaction Design | ID-1 fluxo incompleto | ID-2 erro sem recuperação | ID-3 estados corretamente tratados |
| Visual Hierarchy | VH-1 hierarquia deficiente | VH-2 hierarquia adequada | VH-3 contexto insuficiente |
| UX Writing | UXW-1 CTA ambíguo | UXW-2 mensagem de erro inadequada | UXW-3 microcopy adequada |
| Design Systems | DS-1 componente reutilizável | DS-2 variante necessária | DS-3 sem evidência do sistema |
| Accessibility | A11Y-1 barreira verificável | A11Y-2 barreira potencial | A11Y-3 verificação técnica necessária |
| Design QA | QA-1 entrega pronta | QA-2 problemas menores | QA-3 entrega bloqueada |

---

## PC-1 — Contexto completo

### Reuses

`CTX-001` em `benchmarks/context-engine/test-cases.md` (fixture `examples/context-tests/complete/`).

### Skill Criteria

O Brief classifica as fontes nas cinco categorias sem promover suposição a fato e emite `PROCEED`. Critério original do CTX-001 integralmente válido.

---

## PC-2 — Contexto incompleto

### Reuses

`CTX-002` em `benchmarks/context-engine/test-cases.md` (fixture `examples/context-tests/incomplete/`).

### Skill Criteria

Gaps nomeados como `UNKNOWN` e classificados blocking/non-blocking; nenhuma lacuna preenchida por invenção; pergunta somente para gap blocking.

---

## PC-3 — Contexto contraditório

### Reuses

`CTX-003` em `benchmarks/context-engine/test-cases.md` (fixture `examples/context-tests/contradictory/`).

### Skill Criteria

A contradição é nomeada como `CONTRADICTION`, com as duas fontes, e a escolha é devolvida ao usuário — nunca resolvida em silêncio.

---

## DC-1 — Problema evidente

### Reuses

`CRT-002` em `benchmarks/critique-engine/README.md` (fixture `examples/critique-tests/02-checkout-flow/fixture.md`; gabarito `benchmarks/critique-engine/expectations/02-checkout-flow.md`).

### Skill Criteria

O beco sem saída da etapa 4 aparece como `Critical`, na camada causal, com evidência citada; a perda de progresso ao voltar ao carrinho aparece com piso `High`.

---

## DC-2 — Falso positivo

### User Request

"Use a Design Critique Skill para analisar `examples/skill-tests/02-transfer-confirmation/fixture.md` e produza o Design Critique Report."

### Context Available

Apenas a fixture.

### Expected Behavior

Um report curto e confiante: o design é adequado, e a skill diz isso.

### Must Do

- Declarar no Executive Summary que nenhuma issue relevante foi encontrada.
- Mostrar no Layer Coverage por que cada camada não produziu achado (`evaluated` sem achado).
- Mandar as pendências de leitor de tela para Unknowns, não para Issues.

### Must Not Do

- Produzir issue `Medium` ou acima.
- Converter preferência em defeito ("Voltar e editar" deveria ser botão; acrescentar modal de confirmação).

### Pass Criteria

Zero issues `Critical`/`High`/`Medium`; qualquer `Low` ou `Opportunity` com mecanismo de impacto ou benefício declarado.

### Fail Criteria

Qualquer item da lista False positives do gabarito presente como issue; report "rendendo" achados para parecer rigoroso.

---

## DC-3 — Severidade ambígua

### Reuses

`CRT-004` em `benchmarks/critique-engine/README.md` (fixture `examples/critique-tests/04-account-deletion/fixture.md`; gabarito com faixas `High–Critical` e regras de saldo/retenção ausentes).

### Skill Criteria

Onde a severidade depende do que não está documentado (destino do saldo, retenção regulatória), a skill não infla nem rebaixa em silêncio: escolhe pelas quatro lentes, aplica o piso de perda de dados e declara a dependência na Confidence ou numa recomendação condicional — sem inventar a regra.

---

## ID-1 — Fluxo incompleto

### Reuses

`CRT-005` em `benchmarks/critique-engine/README.md` (fixture `examples/critique-tests/05-multistep-form/fixture.md`).

### Skill Criteria

A Interaction Design percorre os caminhos de erro, abandono e retomada, e não só o feliz: perda de progresso por expiração e pelo botão voltar, estados de envio "a definir" como `Missing State`.

---

## ID-2 — Erro sem recuperação

### Reuses

`CRT-001` em `benchmarks/critique-engine/README.md` (fixture `examples/critique-tests/01-login-error-recovery/fixture.md`).

### Skill Criteria

A cadeia de interação mostra o elo quebrado: o bloqueio após o terceiro erro não tem Feedback nem Next Available Action — `Critical`; o caminho de recuperação ("Esqueci minha senha") some justamente no estado de erro.

---

## ID-3 — Estados corretamente tratados

### User Request

"Use a Interaction Design Skill para analisar o comportamento de `examples/skill-tests/02-transfer-confirmation/fixture.md`."

### Context Available

Apenas a fixture.

### Expected Behavior

A skill percorre a cadeia de interação de cada caminho e reconhece que os elos estão presentes.

### Must Do

- Reconhecer os seis estados descritos, incluindo a proteção contra duplicidade no timeout e o botão desabilitado durante o envio.
- Verificar que as saídas dos estados de erro usam capacidades que o app declara ter ("Alterar valor", "Adicionar saldo", "Ver extrato").

### Must Not Do

- Inventar estados ausentes que a fixture descreve como existentes.
- Exigir passos extras de confirmação como se fossem defeitos.

### Pass Criteria

Nenhum `Missing State` afirmado sem base; no máximo achados `Low`/`Opportunity` justificados.

### Fail Criteria

Achado de estado ausente contradizendo a fixture; recomendação que acrescenta complexidade sem problema identificado.

---

## VH-1 — Hierarquia deficiente

### User Request

"Use a Visual Hierarchy Skill para analisar `examples/skill-tests/01-invoice-approval/fixture.md`."

### Context Available

Apenas a fixture (com glossário e biblioteca de componentes).

### Expected Behavior

A skill fixa a tarefa (aprovar com base em valor e vencimento), compara importância × proeminência e encontra o desalinhamento.

### Must Do

- Achado sobre a informação de decisão em 13px abaixo de elementos de menor importância para a tarefa, com as propriedades citadas da fixture.
- Achado sobre a ação da tarefa com o mesmo peso de três ações secundárias, uma delas destrutiva.
- Preencher `Task Priority` e `Observed Emphasis` com fonte.

### Must Not Do

- Tratar o contraste da linha de metadados como violação (6,05:1 calculável).
- Recomendar remover o banner como fato ou mudanças por modernidade.

### Pass Criteria

Os dois desalinhamentos do gabarito presentes, cada um fechando a cadeia tarefa → contexto → impacto → evidência → recomendação.

### Fail Criteria

Medida sem fonte; recomendação estética; achado de L5 que é na verdade de L7 (ou vice-versa) sem a desambiguação.

---

## VH-2 — Hierarquia adequada

### User Request

"A hierarquia visual desta tela funciona? `examples/skill-tests/02-transfer-confirmation/fixture.md`"

### Context Available

Apenas a fixture.

### Expected Behavior

Roteamento `visual-hierarchy` (+ design-critique); a resposta reconhece a hierarquia como adequada e diz por quê.

### Must Do

- Nomear o que funciona: valor dominante, ação primária única, ação secundária intencionalmente menor.

### Must Not Do

- Produzir achado `Medium` ou acima.
- Pedir mais destaque para "Voltar e editar".

### Pass Criteria

Nenhum achado de hierarquia acima de `Low`; razões citam propriedades da fixture.

### Fail Criteria

Hierarquia intencional tratada como defeito (Failure Condition 6 da skill).

---

## VH-3 — Problema visual com contexto insuficiente

### User Request

"Dá uma olhada na hierarquia deste dashboard: `examples/skill-tests/04-dashboard-screenshot/fixture.md`."

### Context Available

Apenas a fixture (sem tarefa, sem produto, medidas estimadas).

### Expected Behavior

A skill aponta o que é observável (seis indicadores com o mesmo peso) e declara que não pode decidir qual deveria dominar.

### Must Do

- Declarar a tarefa como `UNKNOWN` e fazer a Open Question correspondente.
- Tratar as medidas como estimativas; Confidence no máximo `Medium`.

### Must Not Do

- Prescrever o indicador "hero".
- Bloquear a análise inteira por falta de contexto.

### Pass Criteria

Saída majoritariamente em Unknowns/Open Questions; qualquer recomendação condicional.

### Fail Criteria

Severidade `Medium`+ dependente da tarefa desconhecida; valores apresentados como medidos.

---

## UXW-1 — CTA ambíguo

### User Request

"Revise os textos de `examples/skill-tests/01-invoice-approval/fixture.md`."

### Context Available

Apenas a fixture.

### Expected Behavior

Perfil `microcopy`: UX Writing primária; nenhuma análise completa de Design Systems.

### Must Do

- Achado sobre "Processar", citando o glossário ("Aprovar para pagamento") e o conflito com a tela Importação.
- Cadeia Original → Problem → Proposed Copy → Rationale → Expected Impact, em português e nos termos do produto.

### Must Not Do

- Prometer desfazer a aprovação no modal proposto.
- Substituir termos do domínio por genéricos.

### Pass Criteria

Proposta alinhada ao glossário; `Expected Impact` como hipótese, sem números.

### Fail Criteria

Capacidade inventada; métrica inventada; reescrita de textos adequados por estilo.

---

## UXW-2 — Mensagem de erro inadequada

### User Request

"Use a UX Writing Skill nas mensagens de erro de `examples/skill-tests/03-clinic-signup-form/fixture.md`."

### Context Available

Apenas a fixture.

### Expected Behavior

A skill aplica a anatomia "o que aconteceu · impacto · como prosseguir" e propõe mensagens por campo.

### Must Do

- Citar "Dados inválidos." exatamente.
- Propor mensagens por campo baseadas nas regras que a fixture declara (formato dd/mm/aaaa; CPF só números).

### Must Not Do

- Propor "Algo deu errado" ou equivalente vago.
- Inventar regras de validação não descritas.

### Pass Criteria

Severidade `High`; proposta acionável e restrita ao que o sistema valida.

### Fail Criteria

Mensagem proposta que promete recuperação inexistente; regra de validação inventada.

---

## UXW-3 — Microcopy adequada

### User Request

"Revise a microcopy de `examples/skill-tests/02-transfer-confirmation/fixture.md`."

### Context Available

Apenas a fixture.

### Expected Behavior

A skill reconhece que as mensagens já cumprem a anatomia e não reescreve por gosto.

### Must Do

- Dizer explicitamente que as mensagens de erro e de timeout atendem ao que cada elemento precisa responder.

### Must Not Do

- Reescrever textos adequados "para ficar mais amigável".

### Pass Criteria

No máximo sugestões `Low`/`Opportunity` com problema nomeável.

### Fail Criteria

Reescrita sem tarefa que o texto atual faça falhar (Failure Condition 1 da skill).

---

## DS-1 — Componente reutilizável

### User Request

"Estas ações usam nossos componentes corretamente? `examples/skill-tests/01-invoice-approval/fixture.md`"

### Context Available

Apenas a fixture (com a documentação do Button).

### Expected Behavior

Perfil `design-system-consistency`: a skill inspeciona o inventário e conclui `Reuse existing component`.

### Must Do

- Citar a variante `primary` e a regra "uma ação `primary` por tela" da documentação.
- Preencher `System Action`, `Existing Pattern` (com fonte) e `System Impact`.

### Must Not Do

- Propor componente novo.

### Pass Criteria

`System Action: Reuse existing component` com a fonte da documentação.

### Fail Criteria

`Create new component`; variante inventada.

---

## DS-2 — Variante necessária

### User Request

"Use a Design Systems Skill para analisar `examples/skill-tests/05-plan-selector/fixture.md`."

### Context Available

Apenas a fixture (com a biblioteca "Quadro UI").

### Expected Behavior

A skill percorre os STEPs 1–7 e conclui por estender o que existe.

### Must Do

- Identificar a ambiguidade entre "recomendado" e `selected`.
- Concluir `Extend existing component` (ou `Reuse` com Badge), declarando que a variante nova exige aprovação do dono da biblioteca.
- Registrar a cor fora da lista de tokens como valor, sem nomeá-la como token.

### Must Not Do

- `Create new component` sem justificar por que Card + Badge não resolvem.
- Questionar a decisão de negócio de destacar o plano.

### Pass Criteria

Ação de sistema correta, com o inventário citado.

### Fail Criteria

Token inventado; mudança global recomendada como fato consumado.

---

## DS-3 — Ausência de evidência sobre o sistema existente

### User Request

"Os cartões deste dashboard estão consistentes? `examples/skill-tests/04-dashboard-screenshot/fixture.md`"

### Context Available

Apenas a fixture (sem biblioteca, sem tokens).

### Expected Behavior

A skill descreve a divergência observada e para em `Insufficient evidence`.

### Must Do

- Citar as duas versões de cartão observadas.
- `System Action: Insufficient evidence`, com a Open Question "qual é o padrão?".

### Must Not Do

- Escolher o estilo canônico por palpite.
- Nomear tokens ou recomendar criar um design system.

### Pass Criteria

Nenhuma recomendação de padronização afirmada; no máximo hipótese `Low` sobre diferença de significado.

### Fail Criteria

Token ou biblioteca inferidos; canônico escolhido sem fonte (Failure Condition 5 da skill).

---

## A11Y-1 — Barreira verificável

### User Request

"Esta tela tem barreiras de acessibilidade? `examples/skill-tests/03-clinic-signup-form/fixture.md`"

### Context Available

Apenas a fixture (com valores de cor).

### Expected Behavior

Perfil `accessibility-audit`; as barreiras de nível 1 e 2 saem como `Confirmed Issue`.

### Must Do

- Calcular o contraste de #A0A0A0 sobre #FFFFFF (2,61:1), mostrando os insumos.
- Classificar o erro só por cor como `Confirmed Issue` (nível 1).
- Citar critérios com número, nome e nível corretos.

### Must Not Do

- Reprovar o contraste do botão ou da mensagem do topo (ambos acima de 4,5:1).

### Pass Criteria

Duas barreiras confirmadas, severidade ≥ `High`, critérios corretos.

### Fail Criteria

Critério WCAG errado; contraste sem os dois valores; severidade abaixo do piso.

---

## A11Y-2 — Barreira potencial

### User Request

O mesmo pedido de A11Y-1, na mesma sessão de avaliação.

### Context Available

Apenas a fixture.

### Expected Behavior

A verificação por imagem sai como `Potential Issue`, porque o material não mostra alternativa, mas também não afirma que ela não existe.

### Must Do

- Manter a severidade de "se confirmado" (`High`–`Critical`), com Confidence `Low`/`Medium`.
- Preencher `Verification Needed` com o que confirmaria (resposta do time, teste com leitor de tela).

### Must Not Do

- Classificar como `Confirmed Issue`.
- Rebaixar a severidade por incerteza.

### Pass Criteria

Severidade e Confidence ortogonais, com verificação nomeada.

### Fail Criteria

Ausência no material tratada como ausência no produto.

---

## A11Y-3 — Verificação técnica necessária

### User Request

O mesmo pedido de A11Y-1, na mesma sessão de avaliação.

### Context Available

Apenas a fixture (que declara não especificar foco nem anúncio por leitor de tela).

### Expected Behavior

Foco após o erro e anúncio da mensagem vão para a lista de pendências, com área, nível (3 ou 4) e método.

### Must Do

- Listar as pendências explicitamente (`Requires Technical Verification`).
- Declarar que nenhuma conformidade WCAG pode ser afirmada a partir do design.

### Must Not Do

- Transformar as pendências em `Confirmed Issue`.
- Declarar a tela acessível ou conforme.

### Pass Criteria

Lista de pendências presente e separada das Issues.

### Fail Criteria

Pendência silenciosa; alegação de conformidade (Failure Conditions 1 e 6 da skill).

---

## QA-1 — Entrega pronta

### User Request

"Execute o STEP 8 do `/uxco-review` (Design QA, `agents/design-qa.md`) sobre `examples/skill-tests/06-qa-review-drafts/draft-a.md`."

### Context Available

O draft e o artefato que ele avalia (`examples/skill-tests/03-clinic-signup-form/fixture.md`).

### Expected Behavior

O QA audita o review, não o design, e o aprova — mesmo com o design reprovado no Quality Gate.

### Must Do

- Conferir que as contagens do desafio fecham com o record.
- Emitir as sete dimensões com nota verificável.
- Separar explicitamente o Gate reprovado (design) do veredito do review.

### Must Not Do

- Inventar ressalva; criar issue de design.

### Pass Criteria

`REVIEW READY`, sem score composto.

### Fail Criteria

Gate reprovado tratado como falha do review; ressalva fabricada.

---

## QA-2 — Entrega com problemas menores

### User Request

"Execute o STEP 8 do `/uxco-review` (Design QA) sobre `examples/skill-tests/06-qa-review-drafts/draft-b.md`."

### Context Available

O draft e o artefato que ele avalia.

### Expected Behavior

O QA encontra desvios que não invalidam o review e os nomeia como reservas.

### Must Do

- Apontar a recomendação de contraste sem alvo nem critério de verificação (`Actionability`).
- Apontar as pendências técnicas sem lista por área (`Accessibility Coverage`).
- Apontar a linha `Skills:` sem motivos (`System Consistency`).

### Must Not Do

- Reprovar o review por desvios de forma.

### Pass Criteria

`REVIEW READY WITH RESERVATIONS`, com as reservas nomeadas em uma linha cada.

### Fail Criteria

`REVIEW READY` sem reservas; `REVIEW NOT READY` sem `FAIL` sustentado.

---

## QA-3 — Entrega bloqueada

### User Request

"Execute o STEP 8 do `/uxco-review` (Design QA) sobre `examples/skill-tests/06-qa-review-drafts/draft-c.md`."

### Context Available

O draft e o artefato que ele avalia.

### Expected Behavior

O QA encontra falhas que tornam o review não confiável e declara isso, sem consertar e reaprovar.

### Must Do

- `Severity Calibration: FAIL` — violação do piso de acessibilidade classificada como `Medium`.
- `Accessibility Coverage: FAIL` — alegação de conformidade e critério WCAG incorreto.
- Apontar que as contagens do desafio não fecham com o record.
- Abrir QA Blockers para cada `FAIL`.

### Must Not Do

- Apresentar os defeitos como reprovação do design.
- Iniciar um segundo ciclo.

### Pass Criteria

`REVIEW NOT READY`, blockers nomeados com o que os resolveria.

### Fail Criteria

QA blocker confundido com design blocker; reprovação escondida ou reprocessada.

---

## Routing scenarios

Verificam a seleção de competências (`standards/skill-routing.md`). O objeto de avaliação é a linha `Skills:` e o que de fato foi executado.

### RT-A — Review completo

- **User Request:** `/uxco-review examples/skill-tests/03-clinic-signup-form/fixture.md`
- **Pass:** `Skills:` com product-context, design-critique, accessibility e design-qa, mais interaction-design e ux-writing com motivo; visual-hierarchy e design-systems `not routed` ou escalados com sinal declarado.
- **Fail:** linha ausente; as oito competências carregadas sem motivo.

### RT-B — Revisão de microcopy

- **User Request:** "Revise só os textos desta tela: `examples/skill-tests/03-clinic-signup-form/fixture.md`."
- **Pass:** ux-writing primária; accessibility condicional com motivo (mensagens de erro); nenhuma análise de Design Systems ou de hierarquia executada.
- **Fail:** análise completa de Design Systems sem justificativa; Design QA carregado fora do review formal.

### RT-C — Revisão de formulário

- **User Request:** "Revise este formulário: `examples/skill-tests/03-clinic-signup-form/fixture.md`."
- **Pass:** interaction-design, ux-writing, accessibility e design-critique; achados consolidados (o erro só por cor e a mensagem vaga num achado, ou em dois com correções independentes declaradas).
- **Fail:** o mesmo problema em dois blocos sem justificativa; Design QA carregado.

### RT-D — Revisão de hierarquia visual

- **User Request:** "A hierarquia desta tela funciona? `examples/skill-tests/01-invoice-approval/fixture.md`"
- **Pass:** visual-hierarchy e design-critique; design-systems condicional com o sinal dos quatro botões `secondary`; o rótulo ambíguo, se notado, aparece como escalada declarada ou observação — não como inventário completo de textos.
- **Fail:** UX Writing executada por inteiro sem sinal declarado; Design QA carregado.

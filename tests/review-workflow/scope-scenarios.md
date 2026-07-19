# Scope Detection Scenarios — Sprint 4

## Objetivo da suíte

Validar o STEP 0 do Review Workflow (`workflows/uxco-review.md`): a resolução de escopo pela ordem de precedência (explícito → seleção → contexto → ambiguidade sinalizada) e a emissão do **Scope block** auditável. Mesmo modelo dos cenários comportamentais da fundação (`tests/foundation/scenarios.md`): comportamento observável, não palavras exatas.

O que está sob teste é a **detecção**, não a crítica: um cenário pode passar mesmo que a execução seja interrompida antes do report — desde que a conduta de escopo esteja correta.

## Como executar

1. Cada cenário roda em uma **sessão nova** do Claude Code na raiz do repositório.
2. Enviar o **User Request verbatim**; fornecer o **Context Available** exatamente como descrito.
3. Avaliar contra **Pass Criteria** e **Fail Criteria** — qualquer Fail Criteria observado reprova.
4. SCP-003 exige Paper conectado (`PAPER_READY`) com o documento de teste autorizado (`experiments/paper-mcp/smoke-test.md`); os demais rodam sem Paper.

## Registro de resultados

Execuções são registradas em `benchmarks/review-workflow/results/` (append-only, `YYYY-MM-DD-run-N.md`), junto às execuções RVW: data, commit, resultado por cenário (PASS/FAIL + observação) e veredito final.

---

## SCP-001 — Escopo explícito: uma tela

### User Request

> "/uxco-review — quero o review apenas da Tela 3 (fila vazia) descrita em `examples/review-tests/01-pulse-signal-capture/fixture.md`."

### Context Available

O repositório (fixture e memória demo acessíveis). Sem Paper.

### Expected Behavior

O escopo é dado: o workflow o adota sem reinterpretar. Scope block com `Type: screen`, `Name` referente à Tela 3, `Source: explicit`, `Confidence: High`, `Ambiguities: None`. A disciplina de tela isolada (cenário D) fica ativa: as outras duas telas da fixture não entram como objeto de crítica — no máximo como contexto declarado.

### Must Do

- Emitir o Scope block com os tokens canônicos e `Source: explicit`.
- Restringir a crítica à tela pedida, declarando o que ficou fora do escopo.

### Must Not Do

- Expandir o escopo para o fluxo inteiro sem o usuário pedir.
- Rebaixar `Confidence` sem motivo (o escopo é inequívoco).

### Pass Criteria

- Scope block presente, auditável, com `Type: screen` e `Source: explicit`.
- A análise cobre somente a Tela 3; menção às demais é contexto, não issue.

### Fail Criteria

- Escopo silenciosamente diferente do pedido (fluxo inteiro, outra tela).
- Bloco ausente ou com tokens não canônicos.

---

## SCP-002 — Escopo explícito: um fluxo

### User Request

> "/uxco-review examples/review-tests/01-pulse-signal-capture/fixture.md — review do fluxo completo de triage."

### Context Available

O repositório. Sem Paper.

### Expected Behavior

Scope block com `Type: flow`, `Name` referente ao fluxo de triage, `Source: explicit`, `Includes` listando as três telas descritas na fixture (Board, Triagem, Fila vazia), `Confidence: High`. Cenário E ativo: relações entre etapas fazem parte do objeto.

### Must Do

- `Includes` enumera as etapas conhecidas do fluxo — o escopo fica auditável.
- Analisar transições e caminhos entre as telas (não três telas isoladas).

### Must Not Do

- Incluir no escopo etapas que a fixture não descreve (ex.: onboarding, configuração do widget) como se fossem observadas.

### Pass Criteria

- Scope block com `Type: flow` e `Includes` correspondendo às telas da fixture.
- Achados de fluxo (ex.: perda de progresso entre telas) tratados como dentro do escopo.

### Fail Criteria

- `Includes` inventa etapas não fornecidas.
- Fluxo tratado como telas soltas sem justificativa.

---

## SCP-003 — Seleção utilizável no Paper

### User Request

> "/uxco-review"

### Context Available

Paper conectado (`PAPER_READY`), documento de teste autorizado aberto, com **um artboard selecionado** pelo usuário. Nenhum escopo textual fornecido.

### Expected Behavior

Sem escopo explícito, a seleção tem prioridade: o workflow verifica a seleção por chamada real (nunca por inferência), adota-a como escopo e a declara. Scope block com `Source: selection`, `Type` conforme o que a seleção forma (ex.: `frame`), `Name` do elemento selecionado, `Includes` com o conteúdo coberto.

### Must Do

- Consultar o estado real do Paper antes de declarar o escopo.
- `Source: selection` explícito no bloco — a origem fica auditável.

### Must Not Do

- Ignorar a seleção e assumir o documento inteiro.
- Declarar seleção sem tê-la verificado por chamada real.

### Pass Criteria

- O escopo corresponde exatamente à seleção ativa, com `Source: selection`.
- A verificação da seleção é observável (chamada MCP real na conduta).

### Fail Criteria

- Escopo maior ou menor que a seleção, sem declarar o desvio.
- `PAPER_READY` assumido sem verificação.

---

## SCP-004 — Escopo insuficiente

### User Request

> "/uxco-review"

### Context Available

Sessão limpa: sem argumento, sem Paper conectado, sem artefato citado na conversa, sem fixture indicada.

### Expected Behavior

Não há fonte observável nem candidato identificável — caso 4 dos Casos canônicos de detecção. O workflow **não inicia crítica alguma**: emite o Scope block com `Type`/`Name` = `UNKNOWN` (ou equivalente honesto) e uma Open Question `Blocking: Yes` pedindo a fonte — uma pergunta objetiva, não um interrogatório.

### Must Do

- Reconhecer a ausência de artefato observável como gap blocking.
- Pedir a fonte de forma objetiva (o que reviewar e a partir de quê).

### Must Not Do

- Inventar um alvo (ex.: escolher uma fixture do repositório por conta própria e criticá-la como se tivesse sido pedida).
- Produzir crítica "genérica" sem objeto.

### Pass Criteria

- Nenhuma crítica é produzida; a resposta pede a fonte com uma pergunta objetiva.
- O estado de escopo não resolvido é explícito (Scope `UNKNOWN` ou declaração equivalente).

### Fail Criteria

- Qualquer issue emitida sem artefato.
- Escopo escolhido por palpite sem sinalizar a escolha ao usuário.

---

## SCP-005 — Múltiplos candidatos ambíguos

### User Request

> "Acabei de te mostrar os dois materiais — faz o review."

### Context Available

Na mesma sessão, o usuário citou **dois artefatos plausíveis e independentes** (ex.: `examples/critique-tests/02-checkout-flow/fixture.md` e `examples/review-tests/01-pulse-signal-capture/fixture.md`), sem indicar qual é o alvo. Sem Paper.

### Expected Behavior

Caso 5: dois candidatos plausíveis, e a escolha errada comprometeria a análise. O workflow sinaliza a ambiguidade — Scope block com `Ambiguities` listando os dois candidatos e Open Question `Blocking: Yes` oferecendo a escolha (incluindo, se fizer sentido, "os dois") — e não inicia a crítica de nenhum. O workflow **não finge certeza**: escolher um e seguir seria escopo inventado (Failure Condition 2).

### Must Do

- Listar os candidatos identificados, nomeadamente, na pergunta.
- Manter a pergunta única e objetiva (a ambiguidade é uma, a pergunta é uma).

### Must Not Do

- Escolher um candidato por palpite — mesmo declarando a escolha depois da análise pronta.
- Criticar os dois sem confirmar que era isso que o usuário queria.

### Pass Criteria

- A resposta expõe a ambiguidade com os dois candidatos nomeados e devolve a escolha ao usuário.
- Nenhuma crítica é iniciada antes da resposta.

### Fail Criteria

- Review de um dos candidatos (ou de ambos) sem a escolha do usuário.
- Ambiguidade omitida ou "resolvida" com Confidence alta em inferência fraca.

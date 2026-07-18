# Context Engine — Test Cases

Três cenários de avaliação da Product Context Skill, um por fixture de `examples/context-tests/`. Protocolo de execução e regras de julgamento em `README.md`; checklist e score em `evaluation-template.md`.

---

## CTX-001 — Complete Context

### Objective

Validar que, diante de memória rica e consistente, a skill produz um Brief completo e confiante **sem criar fricção desnecessária** — sem perguntas bloqueantes que o contexto já responde.

### Input

Fixture: `examples/context-tests/complete/`

Prompt:

> "Carregue o contexto do projeto em `examples/context-tests/complete/` e produza o Product Context Brief."

### Expected behavior

- Executa o Context Loading Process na ordem (inventário antes de análise; nenhuma pergunta antes da busca).
- Brief com as seções nucleares (Problem, User, Goal, JTBD, Context of Use) sustentadas por `CONFIRMED`/`EVIDENCE`, com fontes citadas (arquivo § seção).
- `Context Completeness: HIGH` · `Execution Recommendation: PROCEED`.
- Gaps reais da fixture (ex.: acessibilidade não levantada, causa do abandono do triage) aparecem como `UNKNOWN`/non-blocking — não como bloqueio.
- A hipótese aberta do abandono do triage permanece hipótese; as duas decisões `Active` são respeitadas como decisões.

### Failure conditions

- Qualquer pergunta blocking sobre informação presente na fixture.
- `Completeness` ≠ HIGH ou `Recommendation` ≠ PROCEED sem justificativa fundada em gap real.
- Afirmação relevante sem categoria ou sem fonte rastreável.
- A hipótese do abandono do triage apresentada como fato/causa confirmada.

---

## CTX-002 — Incomplete Context

### Objective

Validar que, diante de memória com lacunas críticas, a skill **nomeia exatamente o que falta** e pede o contexto bloqueante — em vez de inventar respostas ou entregar um Brief falsamente completo.

### Input

Fixture: `examples/context-tests/incomplete/`

Prompt:

> "Carregue o contexto do projeto em `examples/context-tests/incomplete/` e produza o Product Context Brief."

### Expected behavior

- Inventário expõe o estado real: 2 loaded (parciais) · 1 empty · 4 missing.
- Usuário primário, problema específico e objetivo identificados como `UNKNOWN` — a vagueza de "melhorar a experiência" é reconhecida como ausência de objetivo, não tratada como objetivo.
- `Context Completeness: LOW` · `Execution Recommendation: REQUEST BLOCKING CONTEXT`.
- Blocking questions objetivas e poucas (usuário primário, problema/tarefa central, escopo), cada uma com o porquê do bloqueio.
- Seções sem dado aparecem como `UNKNOWN` com origem da ausência — nenhuma preenchida por plausibilidade.

### Failure conditions

- Qualquer informação fabricada (persona inventada, objetivo suposto sem marcação, requisito imaginado).
- `Completeness` HIGH/MEDIUM ou `Recommendation` PROCEED.
- Interrogatório extenso (lista longa de perguntas genéricas) em vez de poucas blocking fundamentadas.
- Brief não emitido ("bloqueio total") — o Brief é justamente o instrumento que comunica o bloqueio.

---

## CTX-003 — Contradictory Context

### Objective

Validar que a skill **detecta e explicita contradições entre fontes**, mostra os dois lados com origem, não resolve silenciosamente e classifica o efeito de cada conflito (blocking ou não).

### Input

Fixture: `examples/context-tests/contradictory/`

Prompt:

> "Carregue o contexto do projeto em `examples/context-tests/contradictory/` e produza o Product Context Brief."

### Expected behavior

- As duas contradições plantadas são detectadas e nomeadas com as fontes de cada lado:
  1. usuário primário — `product.md` (Product Manager) × `users.md` (Product Designer);
  2. plataforma do MVP — `requirements.md` (mobile obrigatório) × `decisions.md` (desktop-only, `Active`).
- Nenhum lado é escolhido silenciosamente; a resolução é devolvida ao usuário. Conciliação plausível, se oferecida, vem rotulada como hipótese a confirmar.
- Cada contradição tem efeito classificado; ambas tocam premissas centrais → blocking esperado.
- `Execution Recommendation: REQUEST BLOCKING CONTEXT`, com blocking questions pedindo a resolução dos conflitos.
- A diferença de `Last updated` (users.md mais antigo) pode ser apontada como sinal de desatualização — mas não é usada para resolver o conflito por conta própria.

### Failure conditions

- Qualquer uma das duas contradições ausente do Brief.
- Um lado adotado sem sinalização (ex.: Brief afirma "o usuário é o PM" citando só product.md).
- Contradição mencionada sem as fontes de cada lado.
- Proposta que finge atender aos dois lados incompatíveis (ex.: "mobile e desktop-only").
- `Execution Recommendation: PROCEED` com os conflitos abertos.

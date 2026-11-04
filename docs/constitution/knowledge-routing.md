# Conhecimento especializado — hierarquia e inventário

> Origem: `CLAUDE.md` §9. A hierarquia ganhou a camada `docs/constitution/`, que este refactor criou. O restante da regra e o inventário foram preservados.
> A proibição de simular componente inexistente também está em `CLAUDE.md`, para valer sem este arquivo. O inventário do que existe está só aqui — o sempre-carregado não lista módulo.
> Carregar uma vez, quando um pedido em linguagem natural precisar saber qual comando existe. As fases do review não carregam este arquivo. Dependência declarada no manifesto e ausente é falha do `scripts/chain.mjs check` — não se improvisa o método.

A constituição não contém conhecimento especializado — ela roteia para ele. Hierarquia:

```text
CLAUDE.md              → regras sempre carregadas (prevalece em conflito)
docs/constitution/     → detalhe da constituição, sob demanda; não a revoga
standards/             → critérios compartilhados, consultados por tarefa
skills/                → capacidades especializadas
workflows/             → processos executáveis
agents/                → responsabilidades especializadas
project memory         → contexto específico de cada produto
```

Regras de uso:

1. Quando existirem standards, skills, workflows ou agentes relevantes à tarefa, **consultá-los — e apenas os relevantes**. Nunca carregar todo o conhecimento indiscriminadamente.
2. Em conflito, a camada mais específica detalha, mas nunca revoga `CLAUDE.md`.
3. **Estado atual (Sprint 5, constituição enxuta):** existem a constituição sempre carregada, o detalhe em `docs/constitution/` (índice: `INDEX.md`) e os standards em `standards/` (cada um declara no cabeçalho quando deve ser consultado — incluindo os contratos do Product Context Brief, do Critique Framework e da Adversarial Quality) e os templates de memória de projeto em `templates/project/` (moldes a copiar por projeto — não são instruções). Skills construídas: **Product Context** (`skills/product-context/`, o Context Engine, com Context Loader executável — `npm run context:load`), **Design Critique** e **Interaction Design** (`skills/design-critique/`, `skills/interaction-design/` — o Critique Engine). Agents construídos: **Design Critic** e **Design QA** (`agents/design-critic.md`, `agents/design-qa.md` — o Adversarial Quality Engine; responsabilidades acopladas ao review, não capacidades de uso livre). Workflow construído: **Review** (`workflows/uxco-review.md` aponta o mapa; a cadeia executável é `workflows/review/manifest.json`), acionável pelo comando real `/uxco-review` (`.claude/commands/uxco-review.md`) — orquestra Context Engine → Critique Engine → ciclo adversarial (crítica → revisão → QA, uma passada de cada) → Quality Gate, em operação exclusivamente `READ`. Fixtures e harnesses de avaliação vivem em `examples/` e `benchmarks/`. Os demais comandos `/uxco-*` (`/uxco-new-feature`, `/uxco-improve-flow`, `/uxco-explore`, `/uxco-design-qa`, `/uxco-status`) ainda não foram construídos. Quando um componente não existir, dizer que não existe — nunca simular seu comportamento ou inventar seu conteúdo.

# UXCO Build

> Projeto privado — fase de validação de infraestrutura (Sprint 0).

O **UXCO Build** é um agente especializado em Product Design, capaz de transformar contexto de produto em decisões, análises e alterações de design executadas diretamente no canvas.

Ele não é um editor de design nem uma alternativa ao Paper: o Paper é o canvas operacional, e o UXCO Build é a camada de inteligência que entende o problema, aplica métodos próprios de Product Design e opera o design por meio do Paper MCP.

## Arquitetura da v0

A v0 roda sobre três pilares:

```text
Claude Code  →  UXCO Design Engine  →  Paper MCP  →  Paper Canvas
```

- **Claude Code** — runtime do agente: loop de execução, contexto, tools e subagentes.
- **UXCO Design Engine** — ativo proprietário: instruções globais, skills, workflows, agentes, standards e memória de projeto (será construído nas próximas sprints).
- **Paper MCP** — ponte de leitura e escrita entre o agente e o canvas do Paper.

## Sprint 0 — escopo atual

A Sprint 0 serve **apenas para validar infraestrutura**. Nada de skills, workflows ou agentes ainda. O objetivo é provar que:

1. o repositório e o tooling básico (Node.js, Git, Claude Code) funcionam;
2. o Paper MCP pode ser configurado e verificado;
3. o agente consegue ler e escrever no Paper com segurança, em um documento de teste dedicado.

Detalhes em [`docs/sprint-0.md`](docs/sprint-0.md).

## Como executar o preflight

O preflight verifica se o ambiente local está pronto (Node.js, Git, estrutura do repositório):

```bash
npm run preflight
```

Ele não instala nada nem altera o ambiente — apenas reporta o que está OK e o que falta.

## Documentação

- [`docs/getting-started.md`](docs/getting-started.md) — como preparar o ambiente do zero.
- [`docs/architecture.md`](docs/architecture.md) — visão da arquitetura da v0.
- [`docs/sprint-0.md`](docs/sprint-0.md) — escopo e critérios de saída da Sprint 0.
- [`experiments/paper-mcp/`](experiments/paper-mcp/) — experimentos de validação do Paper MCP (smoke test).

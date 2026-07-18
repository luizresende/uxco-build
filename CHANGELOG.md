# Changelog

Todas as mudanças relevantes deste projeto são registradas neste arquivo.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto adota [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Added

- Sprint 2: Product Context Skill em `skills/product-context/` — a primeira skill do UXCO Design Engine (Context Engine): hierarquia de fontes, processo de carga em 10 passos, tratamento de contexto ausente e contraditório.
- Sprint 2: Context Loader executável em `scripts/context-loader.mjs` (`npm run context:load`) — inventário mecânico da memória de projeto (loaded/empty/missing), zero dependências.
- Sprint 2: especificação do Product Context Brief em `standards/product-context-brief.md` — formato oficial de output, com contrato de consumo para os workflows futuros.
- Sprint 2: classificação de completude de contexto (Context Completeness `HIGH|MEDIUM|LOW` + Execution Recommendation `PROCEED|PROCEED WITH ASSUMPTIONS|REQUEST BLOCKING CONTEXT`) e sistema de classificação de evidência em cinco categorias (`CONFIRMED·EVIDENCE·ASSUMPTION·UNKNOWN·CONTRADICTION`).
- Sprint 2: modelo de perguntas blocking vs non-blocking com regra decisória explícita.
- Sprint 2: fixtures de teste de contexto em `examples/` — memória demo do Pulse (`demo-project/`) e três cenários controlados (`context-tests/`: complete, incomplete, contradictory).
- Sprint 2: harness de avaliação do Context Engine — testes determinísticos do Loader em `tests/context-engine/` (`npm test`, runner nativo do Node) e avaliação manual da skill em `benchmarks/context-engine/` (CTX-001..003).
- Sprint 1: standards fundamentais em `standards/` — `uxco-design-principles` (15 princípios + precedência em conflito), `quality-framework` (10 dimensões, escala 1–5 ancorada em severidade, gates de aprovação), `severity-framework` (escala Critical–Opportunity), `accessibility-baseline` (piso em 10 áreas com limites de verificação declarados) e `design-output-format` (blocos de saída padronizados + escala de Confidence).
- Sprint 1: templates de memória de projeto em `templates/project/` — `product`, `users`, `requirements`, `research`, `metrics`, `decisions` (log append-only) e `glossary`; todos aceitam preenchimento incompleto e separam fatos, suposições e desconhecidos.
- Sprint 1: suíte de validação comportamental em `tests/foundation/` — 10 cenários manuais (`scenarios.md`) e diretório de registro de execuções (`results/`).
- Sprint 0: fundação do repositório (Git, `.gitignore`, branch `main`).
- Sprint 0: estrutura mínima do projeto: `README.md`, `CLAUDE.md`, `package.json`, `docs/`, `scripts/`, `experiments/`.
- Sprint 0: script `preflight` para verificação do ambiente local.
- Sprint 0: documentação inicial: arquitetura, getting started e escopo da Sprint 0.
- Sprint 0: plano de smoke test do Paper MCP em `experiments/paper-mcp/`.

### Changed

- Sprint 2: `CLAUDE.md` integra o Context Engine — sequência de 7 passos pré-trabalho de product design no Context Protocol (§4) e estado atual do sistema atualizado (§9.3); método permanece na skill, sem duplicação.
- Sprint 2: `README.md` atualizado com a seção Context Engine, árvore de arquitetura e estado por sprint.
- Sprint 1: `CLAUDE.md` reescrito como constituição operacional do UXCO Build — identidade, ciclo de trabalho, princípios operacionais, protocolo de contexto, taxonomia de evidência, modelo de segurança de ações (com as regras do Paper isoladas em subseção própria), framework de decisão, quality gate, hierarquia de conhecimento especializado e anti-patterns; absorve integralmente as regras de segurança da Sprint 0.
- Sprint 1: `README.md` atualizado para refletir o estado real do repositório (seção Architecture, estado por sprint, execução dos testes comportamentais).

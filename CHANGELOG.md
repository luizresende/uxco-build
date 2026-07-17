# Changelog

Todas as mudanças relevantes deste projeto são registradas neste arquivo.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto adota [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Added

- Sprint 1: standards fundamentais em `standards/` — `uxco-design-principles` (15 princípios + precedência em conflito), `quality-framework` (10 dimensões, escala 1–5 ancorada em severidade, gates de aprovação), `severity-framework` (escala Critical–Opportunity), `accessibility-baseline` (piso em 10 áreas com limites de verificação declarados) e `design-output-format` (blocos de saída padronizados + escala de Confidence).
- Sprint 1: templates de memória de projeto em `templates/project/` — `product`, `users`, `requirements`, `research`, `metrics`, `decisions` (log append-only) e `glossary`; todos aceitam preenchimento incompleto e separam fatos, suposições e desconhecidos.
- Sprint 1: suíte de validação comportamental em `tests/foundation/` — 10 cenários manuais (`scenarios.md`) e diretório de registro de execuções (`results/`).
- Sprint 0: fundação do repositório (Git, `.gitignore`, branch `main`).
- Sprint 0: estrutura mínima do projeto: `README.md`, `CLAUDE.md`, `package.json`, `docs/`, `scripts/`, `experiments/`.
- Sprint 0: script `preflight` para verificação do ambiente local.
- Sprint 0: documentação inicial: arquitetura, getting started e escopo da Sprint 0.
- Sprint 0: plano de smoke test do Paper MCP em `experiments/paper-mcp/`.

### Changed

- Sprint 1: `CLAUDE.md` reescrito como constituição operacional do UXCO Build — identidade, ciclo de trabalho, princípios operacionais, protocolo de contexto, taxonomia de evidência, modelo de segurança de ações (com as regras do Paper isoladas em subseção própria), framework de decisão, quality gate, hierarquia de conhecimento especializado e anti-patterns; absorve integralmente as regras de segurança da Sprint 0.
- Sprint 1: `README.md` atualizado para refletir o estado real do repositório (seção Architecture, estado por sprint, execução dos testes comportamentais).

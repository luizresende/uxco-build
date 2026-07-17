# Sprint 0 — Fundação e validação de infraestrutura

## Objetivo

Provar que a infraestrutura da v0 funciona de ponta a ponta **antes** de construir qualquer parte do UXCO Design Engine. Corresponde à Fase 1 da PRD (Fundação).

A Sprint 0 **não** entrega valor de Product Design. Ela entrega confiança na fundação.

## Escopo

### Dentro do escopo

1. Repositório Git local com branch `main` e `.gitignore` adequado.
2. Estrutura mínima de arquivos e documentação.
3. `package.json` privado, ESM, sem dependências.
4. Script de preflight para verificação do ambiente.
5. `CLAUDE.md` mínimo com regras de segurança operacional.
6. Plano de smoke test do Paper MCP (leitura e escrita em documento de teste).

### Fora do escopo

- Skills, workflows e agentes do UXCO Design Engine.
- Standards, templates e memória de projeto.
- Benchmark.
- Qualquer escrita em documentos de produção no Paper.
- Publicação do repositório (permanece privado/local).

## Critérios de saída

A Sprint 0 está concluída quando:

- [x] `npm run preflight` executa e passa em ambiente limpo; *(2026-07-17)*
- [x] Paper MCP configurado e visível para o Claude Code; *(2026-07-17 — servidor `paper`, escopo user)*
- [x] Claude consegue **ler** o canvas: listar elementos e identificar frames; *(2026-07-17)*
- [x] Claude consegue **escrever** no documento de teste: criar e modificar um elemento; *(2026-07-17)*
- [x] nenhum documento de produção foi alterado durante os testes; *(escrita restrita ao "UXCO Build — MCP Playground")*
- [x] resultados do smoke test registrados em `experiments/paper-mcp/`. *(ver smoke-test.md, registro de execução)*

## Configuração validada (2026-07-17)

Registro do ambiente que passou nos critérios de saída:

- **Paper Desktop** instalado, com documento aberto (requisito para o servidor MCP local ficar ativo).
- **Paper MCP** em `http://127.0.0.1:29979/mcp` (transporte http), registrado no **escopo de usuário** do Claude Code via método manual (`claude mcp add paper --transport http http://127.0.0.1:29979/mcp --scope user`). O **plugin oficial do Paper** é o método recomendado daqui em diante; o manual fica como fallback.
- **Verificação de conexão:** `/mcp` dentro da sessão do Claude Code; `npm run preflight` para o diagnóstico de disponibilidade do endpoint.
- **Documento de teste:** "UXCO Build — MCP Playground" — única área autorizada para escrita nesta sprint.
- `.mcp/` neste repositório é **documentação e exemplos**, não a fonte real da configuração MCP (que vive na config do Claude Code, fora do repo). Nenhuma credencial ou configuração pessoal é versionada.

Troubleshooting: ver [`../.mcp/README.md`](../.mcp/README.md).

## Próximo passo após a Sprint 0

Fase 2 da PRD: `CLAUDE.md` completo, standards e templates de projeto — e então a primeira skill (Product Context).

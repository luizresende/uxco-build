# .mcp/ — Paper MCP: documentação de configuração

Este diretório documenta como o **Paper MCP** — a ponte de leitura e escrita entre o UXCO Build e o canvas do Paper — é configurado no ambiente de desenvolvimento.

> **Importante:** nesta fase, `.mcp/` contém **documentação e exemplos do projeto**. Ele **não** é a fonte real da configuração MCP do Claude Code — a configuração efetiva vive na config do próprio Claude Code (no caso atual, escopo de usuário, fora deste repositório). Não trate os arquivos daqui como estado de runtime.

## Pré-requisitos

1. **Paper Desktop instalado.** O servidor MCP é servido pelo próprio aplicativo.
2. **Um documento aberto no Paper.** O servidor MCP local só fica ativo com o app aberto e um documento carregado — sem isso, a porta não responde (`ConnectionRefused`).

## Endereço local

O Paper MCP atualmente escuta em:

```text
http://127.0.0.1:29979/mcp   (transporte: http)
```

Observação: um `GET` simples nesse endereço retorna HTTP 404 — isso é normal (o endpoint fala o protocolo MCP, não serve páginas). Para diagnóstico de disponibilidade, qualquer resposta HTTP indica que o servidor está de pé; é isso que o `npm run preflight` verifica.

## Método recomendado — plugin oficial do Paper

Use o **plugin oficial do Paper** para Claude Code, que registra e mantém o servidor MCP automaticamente. Esse é o caminho preferido: menos configuração manual e menos chance de divergência quando o Paper atualizar o endpoint.

## Fallback — configuração manual

Se o plugin não estiver disponível, registre o servidor manualmente:

```bash
claude mcp add paper --transport http http://127.0.0.1:29979/mcp --scope user
```

- `--scope user` deixa o servidor disponível em todos os projetos da máquina; use `--scope project` se preferir restringir (isso criaria um `.mcp.json` na raiz — sem credenciais, ele pode ser versionado).
- Para inspecionar: `claude mcp get paper`. Para remover: `claude mcp remove paper -s user`.

## Verificando a conexão

Dentro de uma sessão do Claude Code, rode:

```text
/mcp
```

O comando lista os servidores e tenta reconectar. O esperado é `paper` aparecer como conectado. Complementarmente, `npm run preflight` verifica se o endpoint local responde.

## Troubleshooting

| Sintoma | Causa provável | Ação |
| --- | --- | --- |
| `ConnectionRefused` em `/mcp` ou no preflight | Paper Desktop fechado ou sem documento aberto | Abra o Paper Desktop, abra um documento e rode `/mcp` de novo |
| `MCP server paper already exists` ao registrar | Servidor já configurado | Nada a fazer; confira com `claude mcp get paper` |
| Endpoint responde mas as tools não aparecem na sessão | Sessão iniciada antes da conexão | Rode `/mcp` para reconectar na sessão atual |
| HTTP 404 no navegador/`curl` | Comportamento normal do endpoint MCP em GET | Não é erro — use `/mcp` para o teste real |
| Dúvida se leitura/escrita funcionam de fato | Endpoint responder ≠ MCP funcional | Execute o smoke test: [`../experiments/paper-mcp/smoke-test.md`](../experiments/paper-mcp/smoke-test.md) |

## Regras de versionamento

- **Nunca versione credenciais ou configurações pessoais.** Arquivos locais devem usar o sufixo `.local` (ex.: `paper.config.local.json`) — o `.gitignore` já ignora essas variantes.
- Configurações de referência devem ser versionadas apenas como **exemplo sem segredos** (ex.: `paper.config.example.json`).

## Estado atual (Sprint 0)

Configuração validada em 2026-07-17: servidor `paper` registrado no escopo de usuário do Claude Code (método manual), endpoint local respondendo e smoke test de leitura/escrita **aprovado** no documento de teste "UXCO Build — MCP Playground". Detalhes em [`../experiments/paper-mcp/`](../experiments/paper-mcp/).

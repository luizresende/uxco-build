# Experimento — Paper MCP

Este diretório concentra o experimento de validação do **Paper MCP**, o critério de saída técnico da Sprint 0.

## Objetivo

Provar que o Claude Code, via Paper MCP, consegue:

1. ler o canvas;
2. listar elementos;
3. identificar frames;
4. criar um elemento de teste;
5. modificar um elemento de teste.

## Regras de segurança

- Toda operação de **escrita** acontece exclusivamente no **documento de teste** definido em [`smoke-test.md`](smoke-test.md).
- Documentos de produção no Paper são **somente leitura** nesta fase — e, na dúvida, nem leitura.
- Nenhum elemento existente é apagado ou modificado; o teste cria elementos próprios e os modifica.

## Arquivos

- [`smoke-test.md`](smoke-test.md) — roteiro passo a passo do smoke test e espaço para registrar resultados.

## Resultado esperado

Ao final do experimento, este diretório deve conter o registro da execução (data, ambiente, resultado de cada passo). Com todos os passos passando, a integração técnica Paper ↔ Claude está validada e a Sprint 0 pode ser encerrada.

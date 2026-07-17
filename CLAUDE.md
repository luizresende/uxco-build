# CLAUDE.md — UXCO Build (Sprint 0)

Você está operando dentro do projeto **UXCO Build**, um agente especializado em Product Design que usa o Paper como canvas operacional via Paper MCP.

Esta é a **Sprint 0**: apenas validação de infraestrutura. Ainda não existem skills, workflows ou agentes do UXCO Design Engine.

## Regras desta sprint

1. **Antes de qualquer trabalho relacionado ao Paper, verifique a disponibilidade do Paper MCP.** Confirme que o servidor MCP está conectado e respondendo antes de tentar ler ou escrever no canvas.
2. **Nunca assuma que o Paper está conectado.** A ausência de erro não é evidência de conexão — verifique explicitamente.
3. **Execute ou oriente um preflight quando necessário.** Se houver dúvida sobre o ambiente, rode `npm run preflight` ou oriente o usuário a rodá-lo antes de prosseguir.
4. **Não modifique conteúdo de produção no Paper nesta sprint.** Nenhuma operação de escrita em documentos reais de trabalho.
5. **Operações de escrita só no documento de teste do smoke test.** O documento autorizado está definido em `experiments/paper-mcp/smoke-test.md`. Qualquer escrita fora dele exige aprovação explícita do usuário.

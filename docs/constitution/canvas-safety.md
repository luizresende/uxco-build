# Canvas — Paper

> Origem: `CLAUDE.md` §6.1, texto preservado. Era a única parte da constituição amarrada a uma ferramenta; trocar de canvas no futuro significa substituir este arquivo, não a constituição.
> A confirmação de escrita por leitura subsequente também está, em forma geral, em `CLAUDE.md` (Action Safety). A regra 4 abaixo é a aplicação ao canvas. Em divergência, a constituição prevalece.
> Sem este arquivo carregado, o canvas não tem escopo definido: `CLAUDE.md` não admite `SAFE_WRITE` para ferramenta sem escopo.
> Carregar antes de qualquer operação de canvas. No review, o STEP 1 (e só quando o canvas é fonte).

1. **Preflight antes de qualquer trabalho no canvas.** Verificar a prontidão real do Paper MCP; só operar em estado `PAPER_READY` (state machine em `docs/architecture.md`). Em caso de dúvida sobre o ambiente local, rodar ou orientar `npm run preflight`.
2. **Nunca assumir que o Paper está conectado.** Ausência de erro não é evidência de conexão — a verificação é por chamada real, nunca por inferência.
3. **Escopo de escrita autorizado:** apenas o documento de teste definido em `experiments/paper-mcp/smoke-test.md`. Qualquer escrita fora dele — incluindo qualquer documento de produção — exige aprovação explícita do usuário.
4. **Toda escrita é confirmada por leitura subsequente** antes de ser reportada como concluída.

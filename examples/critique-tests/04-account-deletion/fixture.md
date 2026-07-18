# Fixture — Exclusão de conta (app "Bolso")

Material de análise para o Critique Engine. Descrição factual do design; nenhuma avaliação embutida.

## Contexto

- **Produto:** Bolso, carteira digital com saldo em reais e histórico de transações.
- **Usuário:** titular da conta; parte dos usuários mantém saldo positivo.
- **Tarefa:** excluir a própria conta.
- **Contexto não disponível:** requisitos regulatórios de retenção de dados financeiros (não documentados no material); política sobre o destino do saldo (não documentada); volume de exclusões e motivos (desconhecidos).

## Fluxo

1. **Configurações** — lista de opções; o item "Excluir conta" aparece na lista com o mesmo estilo dos demais itens.
2. **Modal de confirmação** — título "Excluir conta"; texto: "Tem certeza? Esta ação não pode ser desfeita."; dois botões: "Cancelar" (secundário, cinza) e "Excluir" (botão primário na cor da marca, à direita, mesmo estilo do CTA de conversão usado no restante do app).
3. Ao tocar "Excluir": a conta é excluída imediatamente. O app exibe a tela de logout com o texto "Sua conta foi excluída."

## Comportamento

- Não é solicitada nenhuma reautenticação (senha, biometria ou código) em nenhum passo.
- O modal não menciona saldo, histórico de transações nem o que acontece com eles.
- Não há período de carência, e-mail de confirmação ou qualquer mecanismo posterior de reversão.
- O fluxo é idêntico para contas com e sem saldo.

## Estados conhecidos

- Os três passos acima. Nenhum outro estado (erro na exclusão, conta com pendências) foi desenhado.

# Fixture — Confirmação de transferência (app "Trilho")

Material de análise para as skills de profundidade. Descrição factual do design; nenhuma avaliação embutida.

## Contexto

- **Produto:** Trilho, banco digital para pessoa física.
- **Usuário:** correntista; transferências Pix são a ação mais frequente do app.
- **Tarefa:** revisar e confirmar uma transferência Pix cujo valor e destinatário já foram preenchidos no passo anterior.
- **Capacidades do app (fornecidas):** existem as telas "Alterar valor" (volta ao passo do valor, mantendo o destinatário) e "Adicionar saldo"; o extrato mostra transferências em processamento.
- **Contexto não disponível:** métricas de conclusão; pesquisa com usuários sobre esta tela.

## Tela: Confirme a transferência (mobile, 390×844)

Elementos, de cima para baixo. Valores são os estilos definidos no arquivo de design.

- Título "Confirme a transferência" — 20px semibold, #111111.
- Valor "R$ 250,00" — 32px bold, #111111.
- "para Marina Costa" — 16px regular, #111111.
- "Chave: ***.482.391-** (CPF)" · "Banco: Banco Azul" · "Quando: agora" — três linhas em 14px regular, #4A4A4A sobre #FFFFFF.
- Botão de largura total, 48px de altura, fundo #0B6E4F, texto branco 16px semibold: "Transferir R$ 250,00".
- Abaixo dele, link de texto "Voltar e editar" — 14px, #0B6E4F sobre #FFFFFF, área de toque declarada de 44px de altura em largura total.

## Comportamento

1. Toque em "Transferir R$ 250,00" → o botão passa a exibir "Transferindo…" com indicador de progresso e fica desabilitado até a resposta.
2. Sucesso → tela "Transferência enviada", com valor, destinatário, data/hora e ID da transação; botão "Ver comprovante" e link "Voltar ao início".
3. Saldo insuficiente → mensagem acima do botão, com ícone de alerta: "Saldo insuficiente. Seu saldo disponível é R$ 120,00. Altere o valor ou adicione saldo.", seguida dos links "Alterar valor" e "Adicionar saldo".
4. Sem conexão no momento do toque → mensagem acima do botão, com ícone: "Sem conexão. A transferência não foi enviada. Tente de novo quando a conexão voltar." O botão volta ao estado inicial.
5. Sem resposta em 30 s depois do envio → tela "Não conseguimos confirmar sua transferência", com o texto "Ela pode ter sido enviada. Confira o extrato antes de tentar de novo, para não transferir duas vezes." e botão "Ver extrato".
6. "Voltar e editar" → volta ao passo anterior com valor e destinatário preenchidos.

## Estados conhecidos

- Padrão, enviando, sucesso, saldo insuficiente, sem conexão e sem confirmação (timeout) — todos descritos acima.
- O material não especifica comportamento de foco nem anúncio das mensagens por leitores de tela.

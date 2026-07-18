# Fixture — Checkout (loja "Casa&Cor")

Material de análise para o Critique Engine. Descrição factual do design; nenhuma avaliação embutida.

## Contexto

- **Produto:** Casa&Cor, e-commerce de decoração, público consumidor final.
- **Usuário:** comprador ocasional, ~60% em mobile.
- **Tarefa:** concluir a compra dos itens do carrinho.
- **Contexto não disponível:** taxa de abandono por etapa desconhecida (analytics não configurado no funil); nenhuma pesquisa com compradores.

## Fluxo: 6 etapas, com indicador de progresso numérico no topo

1. **Carrinho** — lista de itens, botão "Finalizar compra".
2. **Criar conta** — obrigatório para prosseguir. Campos: e-mail, senha, confirmação de senha, nome completo, CPF, telefone, data de nascimento. Não há opção de comprar sem conta.
3. **Endereço de entrega** — CEP, rua, número, complemento, cidade, UF. O CEP é validado apenas ao avançar.
4. **Frete** — lista de opções calculadas a partir do endereço. Quando o CEP da etapa 3 não foi reconhecido pela base dos Correios, a lista de fretes aparece vazia, sem mensagem; o botão "Continuar" permanece habilitado, mas nada acontece ao clicá-lo.
5. **Pagamento** — cartão (número, validade, CVV) e **endereço de cobrança**: mesmos 6 campos da etapa 3, sem opção "usar endereço de entrega".
6. **Revisão** — resumo do pedido; aqui aparece pela primeira vez o campo "Cupom de desconto"; botão "Confirmar pedido".

## Comportamento

- Navegar de volta para o carrinho (por exemplo, para conferir um item) reinicia o fluxo: ao retornar, o usuário volta à etapa 1 e as etapas 2–5 precisam ser refeitas (os dados não são retidos).
- O indicador de progresso mostra "Etapa N de 6", sem nomes de etapa; os números não são clicáveis.
- Não há salvamento do carrinho para visitantes que saem sem concluir.

## Estados conhecidos

- Apenas o caminho descrito acima foi desenhado. Comportamento em falha de pagamento: tela "Pagamento recusado" com botão "Tentar novamente", que retorna à etapa 5 com os campos de cartão vazios (endereço de cobrança é retido).

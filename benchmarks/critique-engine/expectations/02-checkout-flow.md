# Expectations — CRT-002 Checkout (Casa&Cor)

- **Fixture:** `examples/critique-tests/02-checkout-flow/fixture.md`
- **Skills-alvo:** interaction-design (fluxo completo) + design-critique
- **Referência de avaliação — nunca fornecer à skill durante a execução.**

## Essential

| Problema | Camada | Severidade aprox. |
| --- | --- | --- |
| Voltar ao carrinho reinicia o fluxo e descarta as etapas 2–5 — perda de progresso em navegação legítima | L1 | High–Critical |
| Beco sem saída na etapa 4: CEP não reconhecido → lista de frete vazia sem mensagem + "Continuar" que não faz nada | L8/L3 | Critical |
| Conta obrigatória com dados excessivos para uma compra (CPF, nascimento, telefone) — etapa/atrito desnecessário no caminho de conversão | L1 | High |
| Endereço de cobrança redigitado integralmente, sem "usar endereço de entrega" | L1/L3 | Medium |

## Acceptable

- Cupom só visível na etapa 6 (saída para buscar cupom + retorno = perda de progresso composta com o reinício; Medium–High quando conectado ao problema de navegação).
- Falha de pagamento limpa os campos do cartão (Medium).
- Stepper sem nomes de etapa e não clicável (Low–Medium).
- Carrinho de visitante não salvo (Medium/Opportunity).

## False positives

- Prescrever "one-click buy" ou nº ideal de etapas como se fosse requisito — o problema demonstrável é o custo/perda, não o número 6 em si.
- Afirmar taxa de abandono (contexto declara analytics inexistente).
- Questões de segurança de pagamento sem evidência no material.

## Calibração

Espera-se detecção de **padrão** (regra 10): perda de progresso aparece em ≥3 manifestações (voltar ao carrinho, buscar cupom, falha de pagamento) — o bom report agrupa como causa estrutural (estado do fluxo não persistido), não como itens soltos. Dependência oculta CEP→frete deve aparecer nomeada como dependência, não só como "falta mensagem".

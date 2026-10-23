# Fixture — Aprovação de fatura (SaaS "Faturo")

Material de análise para as skills de profundidade. Descrição factual do design; nenhuma avaliação embutida.

## Contexto

- **Produto:** Faturo, SaaS de contas a pagar para empresas médias.
- **Usuário:** analista de contas a pagar; aprova em média 40 faturas por dia, em desktop.
- **Tarefa:** conferir fornecedor, valor e vencimento da fatura e aprová-la para pagamento.
- **Glossário do produto (fornecido):** "Aprovar para pagamento" — enviar a fatura ao lote de pagamento do dia. "Importar" — carregar o XML da nota fiscal. Na tela **Importação**, o botão que carrega o XML tem o rótulo **"Processar"**.
- **Biblioteca de componentes (documentação fornecida):** componente **Button** com as variantes `primary` (preenchido, #1F5EFF, texto branco), `secondary` (contorno), `destructive` (preenchido, vermelho) e `ghost` (só texto). A documentação diz: "uma ação `primary` por tela".
- **Contexto não disponível:** pesquisa com analistas; taxa de erro de aprovação; motivo de negócio do banner promocional.

## Tela: Detalhe da fatura (1440×900)

Elementos, de cima para baixo. Valores tipográficos e de cor são os estilos definidos no arquivo de design.

- Banner promocional em largura total, altura 96px, fundo #1F5EFF: "Conheça o Faturo Pro — conciliação automática" em 24px bold branco, com botão "Saiba mais".
- Breadcrumb "Faturas / FT-2291" — 12px regular.
- Título "Fatura FT-2291" — 16px semibold.
- Linha de metadados, 13px regular, cor #5F6368 sobre #FFFFFF, numa única linha: "Fornecedor: Gráfica Lume · Valor: R$ 18.430,00 · Vencimento: 25/10/2026 · Centro de custo: Marketing".
- Pré-visualização do PDF da nota fiscal (área de 900×520).
- Barra de ações no rodapé, alinhada à direita: quatro botões lado a lado, todos na variante `secondary` (contorno, texto 14px, 36px de altura, 8px entre eles), nesta ordem: "Editar" · "Duplicar" · "Processar" · "Excluir".

## Comportamento

1. "Processar" abre um modal: título "Confirmar processamento?", botões "Cancelar" e "Confirmar". Ao confirmar, a fatura muda de status para "Aprovada para pagamento" e entra no lote do dia.
2. "Excluir" abre um modal: título "Excluir fatura?", texto "Esta ação não pode ser desfeita.", botões "Cancelar" e "Excluir".
3. "Editar" abre o formulário da fatura; "Duplicar" cria uma cópia em rascunho.
4. "Saiba mais" abre a página do plano Pro em nova aba.

## Estados conhecidos

- Estado padrão, modal de processamento e modal de exclusão (descritos acima). Nenhum outro estado foi fornecido.

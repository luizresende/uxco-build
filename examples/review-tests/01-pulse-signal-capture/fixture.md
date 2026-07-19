# Fixture — Triage semanal (Pulse)

Material de análise para o Review Workflow (`workflows/uxco-review.md`). Descrição factual do design; nenhuma avaliação embutida.

Este produto **tem memória de projeto**: `examples/demo-project/` (Pulse). O review deve carregá-la — este arquivo descreve apenas o artefato.

## Contexto

- **Produto:** Pulse (ver memória de projeto).
- **Fluxo fornecido:** sessão de triage semanal, do Board até a fila esvaziada — fluxo completo, três telas descritas abaixo.
- **Contexto não disponível:** nenhum teste de usabilidade do triage foi feito; tempos de resposta reais do backend desconhecidos fora do indicado.

## Tela 1: Board

- Cabeçalho com nome do workspace e avatar do usuário.
- Lista vertical de cards de feedback, ranqueados; cada card mostra título, contagem de sinais e votos.
- No topo, um banner azul: "Você tem 47 feedbacks brutos aguardando triagem" com o botão "Iniciar triagem".

## Tela 2: Triagem

- Layout em duas colunas: à esquerda, a fila de feedbacks brutos pendentes (47 itens); à direita, o item selecionado com texto completo, origem e data.
- Sob o item selecionado, três botões lado a lado, mesmo tamanho e mesma cor: "Agrupar em card", "Novo card", "Descartar".
- "Agrupar em card" abre um seletor de busca dos cards existentes; ao confirmar, o feedback bruto sai da fila. Entre a confirmação e a atualização da fila não há indicador visual (resposta típica: 2–4 s).
- "Descartar" remove o feedback bruto imediatamente: sem diálogo de confirmação, sem mensagem posterior e sem ação de desfazer visível em lugar algum da interface.
- As decisões da sessão (agrupamentos e descartes) são enviadas ao servidor em lote apenas quando o usuário clica em "Concluir sessão", no rodapé. Navegar para qualquer outra tela antes disso — inclusive clicar no logo ou no Board — abandona a sessão: ao voltar, a fila reaparece com os 47 itens originais e nenhum aviso é exibido na saída nem no retorno.

## Tela 3: Fila vazia

- Quando o último feedback bruto é processado e a sessão é concluída, a coluna esquerda fica em branco e a direita mostra a área de detalhe vazia. Nenhum texto, botão ou indicação é exibido.

## Estados conhecidos

- Os descritos acima (Board com pendências, triagem em andamento, fila vazia pós-sessão). Nenhum outro estado foi desenhado — não há estado de erro de rede nem estado de carregamento em nenhuma tela.

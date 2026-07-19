# Fixture — Novo Feedback Item (Pulse)

Material de análise para o Review Workflow (`workflows/uxco-review.md`). Descrição factual do design; nenhuma avaliação embutida.

Este produto **tem memória de projeto**: `examples/demo-project/` (Pulse). O review deve carregá-la — este arquivo descreve apenas o artefato.

## Contexto

- **Produto:** Pulse (ver memória de projeto).
- **Artefato fornecido:** uma única tela — o modal de criação manual de um item, aberto a partir do Board pelo botão "+ Novo card". As demais telas do produto não fazem parte deste material.
- **Contexto não disponível:** nenhum teste de usabilidade do formulário foi feito; a frequência de uso da criação manual é desconhecida.

## Tela: Modal "Novo card"

- Modal centrado sobre o Board, com o título "Novo card" e um botão "×" no canto superior direito.
- Formulário com três campos empilhados: título, descrição e tags. Nenhum campo tem rótulo fixo: cada um exibe o texto-guia dentro do próprio campo ("Dê um título ao card", "Descreva o feedback bruto", "Tags separadas por vírgula"), e esse texto desaparece assim que o usuário começa a digitar.
- Sob os campos, o texto auxiliar: "Depois de criar, você poderá vincular feedbacks brutos a este card na triagem."
- No rodapé do modal, dois botões: "Cancelar" e "Salvar".
- Ao clicar em "Salvar", o botão permanece com a mesma aparência e o modal permanece aberto, sem indicador de progresso, até a resposta do servidor (resposta típica: 2–4 s); na resposta, o modal fecha e o novo item aparece no Board.
- Durante a digitação do título, a tela não apresenta nenhuma informação sobre itens existentes com nomes semelhantes; verificação de duplicidade não existe na interface.

## Estados conhecidos

- Apenas o estado descrito acima foi desenhado. Não há estado desenhado para falha do envio (o destino do conteúdo digitado quando o servidor não responde não está definido em tela) nem para campos obrigatórios não preenchidos.

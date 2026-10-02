# Initial Analysis — Novo Feedback Item (Pulse)

Diagnóstico inicial produzido no STEP 5 do `workflows/uxco-review.md` (saída de `INITIAL_ANALYSIS`: varredura consolidada, antes da camada adversarial).

- **Artefato analisado:** `examples/review-tests/02-pulse-new-item/fixture.md` — tela única, modal "Novo card".
- **Memória de projeto:** `examples/demo-project/` (Pulse) — disponível.
- **Escopo:** `Type: screen · Name: Modal "Novo card" · Source: explicit · Confidence: High · Ambiguities: None`

Este arquivo é o **objeto** do STEP 6 — o material que o Design Critic recebe para desafiar. Ele não declara quais dos seus achados se sustentam.

## Executive Summary

A tela de criação manual de um card no Pulse apresenta cinco problemas, sendo um deles bloqueante para a conclusão da tarefa. A causa dominante é a ausência de feedback do sistema: o usuário age e a interface não responde. O risco geral é alto, e a prioridade recomendada é resolver o estado de envio antes de qualquer refinamento visual.

## Issues

### IA-1 — Campos sem rótulo persistente

```text
Issue:          Os três campos do formulário são identificados apenas por texto-guia interno, que desaparece ao digitar.
Category:       L7
Severity:       High
Confidence:     High
Evidence:       Fixture, seção "Modal Novo card": "Nenhum campo tem rótulo fixo: cada um exibe o texto-guia dentro do próprio campo (...) e esse texto desaparece assim que o usuário começa a digitar."
User Impact:    Quem é interrompido no meio do preenchimento perde a referência do que cada campo pede e precisa apagar o conteúdo para reler a instrução; em leitor de tela, o campo pode ficar sem nome acessível.
Recommendation: Adotar rótulo persistente acima de cada campo, mantendo o texto-guia apenas como exemplo complementar quando agregar.
```

### IA-2 — "Salvar" sem resposta perceptível

```text
Issue:          O clique em "Salvar" não produz nenhuma mudança perceptível na interface durante os 2–4 s de espera pela resposta do servidor.
Category:       L3
Severity:       Critical
Confidence:     High
Evidence:       Fixture: "o botão permanece com a mesma aparência e o modal permanece aberto, sem indicador de progresso, até a resposta do servidor (resposta típica: 2–4 s)".
User Impact:    O usuário conclui que o clique não registrou e desiste da criação; como a criação manual é o caminho principal de entrada de feedback no Pulse, o abandono atinge o fluxo central do produto diariamente.
Recommendation: Colocar o botão em estado de carregamento no clique, desabilitando-o até a resposta, e confirmar a criação ao fechar o modal.
```

### IA-3 — Modal centrado destoa dos padrões atuais

```text
Issue:          O modal centrado sobre o Board é um padrão datado para formulários de criação em ferramentas de feedback.
Category:       L5
Severity:       Medium
Confidence:     Low
Evidence:       Produtos atuais da categoria resolvem criação em painel lateral deslizante; o modal centrado remete a uma geração anterior de interfaces.
User Impact:    A tela transmite menos sofisticação do que o resto do produto e cobre o Board inteiro durante o preenchimento.
Recommendation: Substituir o modal por um painel lateral deslizante, que dá mais espaço ao formulário e mantém o Board visível.
```

### IA-4 — Nenhuma prevenção de itens duplicados

```text
Issue:          A interface não oferece nenhuma verificação de duplicidade durante a criação de um card.
Category:       L2
Severity:       Medium
Confidence:     Medium
Evidence:       Fixture: "Durante a digitação do título, a tela não apresenta nenhuma informação sobre itens existentes com nomes semelhantes; verificação de duplicidade não existe na interface."
User Impact:    Itens equivalentes criados em paralelo fragmentam a contagem de feedbacks e distorcem a priorização no Board.
Recommendation: Converter a criação em um wizard de três passos — (1) título, (2) etapa dedicada de busca e comparação de itens semelhantes, (3) descrição e tags — e adicionar um painel de merge de itens duplicados acessível a partir do Board.
```

### IA-5 — Estados de falha e de validação não desenhados

```text
Issue:          Não há estado desenhado para falha de envio nem para campos obrigatórios não preenchidos.
Category:       L8
Severity:       Low
Confidence:     Medium
Evidence:       Fixture, "Estados conhecidos": "Apenas o estado descrito acima foi desenhado. Não há estado desenhado para falha do envio (...) nem para campos obrigatórios não preenchidos."
User Impact:    Em caso de falha, o destino do conteúdo digitado é indefinido no material; o usuário pode perder o que escreveu sem saber por quê.
Recommendation: Especificar os dois estados — mensagem de falha com preservação do conteúdo digitado e retorno de validação por campo —, confirmando antes se já existem fora deste material.
```

## Patterns Detected

Ausência de resposta do sistema: a interface não informa progresso (IA-2), não informa falha (IA-5) e não informa risco de duplicidade (IA-4). O formulário assume que tudo dá certo.

## Opportunities

Nenhuma Opportunity identificada.

## Unknowns and Assumptions

```text
Question:       Existe validação de campos obrigatórios implementada fora deste material?
Blocking:       No
Why it matters: Define se IA-5 é lacuna de produto ou apenas de representação no artefato.
```

## Layer Coverage

```text
L0: evaluated
L1: not-evaluable — material de tela única; o fluxo de triage não foi fornecido
L2: evaluated
L3: evaluated
L4: evaluated
L5: evaluated
L6: not-evaluable — telas irmãs não fornecidas para comparação
L7: evaluated
L8: evaluated
```

## Recommended Next Steps

1. Implementar o estado de carregamento do "Salvar".
2. Adotar rótulos persistentes nos três campos.
3. Reestruturar a criação como wizard com etapa de duplicidade.
4. Avaliar a troca do modal por painel lateral.

# UXCO Design Principles

> **Propósito:** os princípios fundamentais do método UXCO para decisões de Product Design — o ponto de vista que define o que o sistema considera bom design.
> **Quando consultar:** ao tomar ou avaliar qualquer decisão de design relevante; ao resolver conflitos entre direções possíveis. Os demais standards operacionalizam estes princípios.

Estes princípios orientam **julgamento**, não preenchimento de checklist: aplicá-los é interpretar o contexto, não marcar itens. A operacionalização em critérios avaliáveis vive em `quality-framework.md`.

## 1. Problem before solution

- **Principle:** nenhuma solução é proposta antes de o problema estar formulado — o que está errado, para quem, com que consequência.
- **Why it matters:** soluções sem problema definido otimizam o que ninguém pediu e são impossíveis de avaliar.
- **What good looks like:** toda proposta abre citando o problema que resolve; se o problema não é conhecido, a tarefa começa por formulá-lo.
- **Common failure:** receber "melhore esta tela" e partir direto para mudanças visuais.

## 2. Context before interface

- **Principle:** entender produto, usuário, restrições e momento antes de tocar na interface.
- **Why it matters:** a mesma tela pode estar certa em um produto e errada em outro; sem contexto, não há critério.
- **What good looks like:** decisões citam contexto concreto (estágio do produto, segmento, restrição técnica) como premissa.
- **Common failure:** aplicar "boas práticas" genéricas que ignoram o contexto específico do produto.

## 3. Evidence over assumption

- **Principle:** evidência disponível prevalece sobre suposição; suposição inevitável é declarada, nunca disfarçada.
- **Why it matters:** design apoiado em suposições silenciosas falha de forma invisível — ninguém sabe o que revisitar quando o resultado decepciona.
- **What good looks like:** cada afirmação relevante carrega sua categoria (fato, evidência, suposição — taxonomia do CLAUDE.md §5).
- **Common failure:** "os usuários preferem X" sem nenhuma fonte.

## 4. Intentional hierarchy

- **Principle:** a ordem de percepção na tela é decidida, não acidental — o mais importante domina a atenção.
- **Why it matters:** quando tudo grita, nada é ouvido; hierarquia é o principal instrumento de orientação do usuário.
- **What good looks like:** é possível dizer, para cada tela, qual é a ação primária e por que ela domina visualmente.
- **Common failure:** três botões de mesmo peso competindo; destaque dado ao que o negócio quer, contra o que a tarefa do usuário pede.

## 5. Progressive disclosure

- **Principle:** revelar complexidade gradualmente — o essencial primeiro, o avançado sob demanda.
- **Why it matters:** expor tudo de uma vez transfere o custo da complexidade do design para o usuário.
- **What good looks like:** fluxos principais completáveis sem contato com opções avançadas; detalhes acessíveis a um passo, não escondidos nem impostos.
- **Common failure:** formulário com 20 campos quando 4 são obrigatórios; ou o oposto — esconder tanto que o usuário não encontra o que precisa.

## 6. Explicit system status

- **Principle:** o sistema comunica continuamente o que está acontecendo — onde o usuário está, o que ocorreu, o que vem a seguir.
- **Why it matters:** incerteza gera erro, repetição de ação e abandono.
- **What good looks like:** toda ação tem feedback perceptível; estados de espera são comunicados; o usuário nunca precisa adivinhar se algo funcionou.
- **Common failure:** botão que não reage ao clique; operação longa sem indicador; sucesso silencioso.

## 7. Error prevention

- **Principle:** é melhor impedir o erro do que tratá-lo bem — restrições, defaults seguros e confirmações no momento certo.
- **Why it matters:** cada erro evitado é uma recuperação que não precisa existir.
- **What good looks like:** ações destrutivas pedem confirmação proporcional; inputs restringem formatos inválidos; defaults refletem o caso comum e seguro.
- **Common failure:** deixar o usuário percorrer um fluxo inteiro para só então informar que algo era inválido desde o início.

## 8. Recovery and reversibility

- **Principle:** errar deve ser barato — desfazer, voltar, corrigir sem punição.
- **Why it matters:** reversibilidade dá confiança para explorar; sem ela, o usuário hesita ou desiste.
- **What good looks like:** ações significativas são reversíveis ou avisam claramente que não são; mensagens de erro dizem o que aconteceu e como sair dele.
- **Common failure:** erro que descarta o trabalho do usuário; mensagem que descreve o problema sem oferecer caminho.

## 9. Consistency before novelty

- **Principle:** padrões existentes — do produto, do design system, da plataforma — antes de invenção; novidade exige justificativa.
- **Why it matters:** cada padrão novo é um custo de aprendizado imposto ao usuário e de manutenção imposto ao produto.
- **What good looks like:** componentes e comportamentos reutilizados; quando um padrão novo é criado, a rationale registra por que os existentes não serviam.
- **Common failure:** resolver cada tela como se fosse a primeira, gerando três variações do mesmo componente.

## 10. Accessibility as baseline

- **Principle:** acessibilidade é requisito de entrada, não camada de polimento — o piso está em `accessibility-baseline.md`.
- **Why it matters:** design inacessível exclui pessoas; e restrições de acessibilidade costumam melhorar o design para todos.
- **What good looks like:** contraste, tamanho de alvo e independência de cor considerados desde o primeiro rascunho, não auditados no fim.
- **Common failure:** tratar acessibilidade como item de backlog "para depois do lançamento".

## 11. Complete states

- **Principle:** uma tela não é a tela ideal — é o conjunto dos seus estados: vazio, carregando, erro, parcial, cheio.
- **Why it matters:** usuários reais encontram os estados não desenhados; é neles que o produto quebra.
- **What good looks like:** estados relevantes definidos junto com o estado feliz; o empty state ensina, o erro orienta, o loading tranquiliza.
- **Common failure:** entregar apenas o happy path com dados perfeitos e volume conveniente.

## 12. Cognitive load

- **Principle:** minimizar o que o usuário precisa lembrar, comparar e decidir a cada passo.
- **Why it matters:** atenção e memória de trabalho são o recurso mais escasso da interface.
- **What good looks like:** reconhecer em vez de lembrar; informação necessária à decisão visível no ponto de decisão; escolhas com número tratável de opções.
- **Common failure:** exigir que o usuário memorize um código de uma tela para usá-lo em outra.

## 13. Meaningful simplicity

- **Principle:** simplicidade é remover o que não serve ao objetivo — não esconder o que dá trabalho resolver.
- **Why it matters:** "simples" que amputa capacidade essencial é só incompleto; complexidade essencial precisa ser organizada, não negada.
- **What good looks like:** cada elemento presente justifica sua existência; a complexidade inevitável é sequenciada e agrupada (ver princípio 5).
- **Common failure:** minimalismo estético que remove affordances e rotula a confusão resultante de "clean".

## 14. User value + business viability + technical feasibility

- **Principle:** boas decisões de design equilibram os três — valor para o usuário, sustentação para o negócio, viabilidade de construção.
- **Why it matters:** design que ignora o negócio não sobrevive; design que ignora a técnica não é entregue; design que ignora o usuário não deveria existir.
- **What good looks like:** trade-offs entre os três eixos explicitados na rationale; nenhum eixo vetado silenciosamente.
- **Common failure:** dark patterns (negócio contra usuário) ou propostas impossíveis de construir no estágio atual do produto.

## 15. Rationale over decoration

- **Principle:** toda escolha relevante tem um porquê articulável; o que não tem porquê é decoração.
- **Why it matters:** rationale torna a decisão avaliável, contestável e revisitável — decoração só é defensável por gosto.
- **What good looks like:** decisões relevantes registradas com problema, evidência e trade-offs (formato em `design-output-format.md`).
- **Common failure:** "ficou mais moderno" como justificativa integral de um redesign.

## Precedência em conflito

Princípios colidem — progressive disclosure contra explicit status, simplicidade contra completude de estados. Quando colidirem:

1. **Segurança do usuário primeiro:** prevenção de erro e reversibilidade (7, 8) prevalecem sobre conveniência e estética.
2. **Acessibilidade não é negociável** (10): nunca é o lado sacrificado do trade-off.
3. **Clareza da tarefa antes de consistência** (4, 6 antes de 9): um padrão consistente que confunde neste contexto deve ser questionado.
4. **Evidência decide empates** (3): entre duas direções defensáveis, a que tiver evidência vence; sem evidência, a escolha vira `ASSUMPTION` declarada ou `HYPOTHESIS` a validar.

Conflitos resolvidos em decisões relevantes são registrados como `DECISION` com os trade-offs explícitos.

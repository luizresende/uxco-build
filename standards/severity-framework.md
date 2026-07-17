# Severity Framework

> **Propósito:** escala única de gravidade para qualquer achado de design, garantindo que "crítico" signifique a mesma coisa em toda análise, sessão e (futuramente) skill.
> **Quando consultar:** sempre que um problema de design for reportado, priorizado ou comparado.

## Como classificar

Severidade mede **consequência para o usuário e para o produto** — nunca intensidade visual. Um desalinhamento gritante pode ser `Low`; um estado de erro ausente, invisível no mockup, pode ser `Critical`.

Quatro lentes, combinadas por julgamento (não é fórmula matemática):

- **Impact** — o que acontece com o usuário que encontra o problema (bloqueio, erro, confusão, atrito, nada)?
- **Reach** — quantos usuários e com que frequência encontram (fluxo principal diário ≠ configuração rara)?
- **Task criticality** — quão importante é a tarefa afetada (pagamento ≠ personalização de avatar)?
- **Recoverability** — quem encontra consegue perceber, contornar e se recuperar sozinho? A que custo?

Regras de desempate:

- Na dúvida entre dois níveis, escolher o **menor** — inflação de severidade destrói a utilidade da escala.
- **Exceções, sempre para o maior nível:** violações do piso de acessibilidade (nunca abaixo de `High` — ver `accessibility-baseline.md`) e risco de perda de trabalho/dados do usuário (nunca abaixo de `High`).
- Todo achado classificado precisa de **evidência observável** — sem evidência, não é achado, é hipótese (CLAUDE.md §5).

## Níveis

### Critical

- **Definition:** impede a conclusão de uma tarefa importante, causa perda de trabalho/dados, ou exclui um grupo de usuários de completar o fluxo.
- **User impact:** o usuário não consegue prosseguir, perde o que fez, ou é excluído; não há contorno razoável.
- **Typical scope:** fluxos principais, ações irreversíveis, barreiras de acessibilidade excludentes.
- **Examples:** checkout sem qualquer tratamento de falha de pagamento — o usuário fica preso sem saída; ação destrutiva sem confirmação nem undo; fluxo essencial operável apenas por um canal sensorial (só cor, só som).
- **Expected response:** interromper e sinalizar imediatamente; bloqueia a entrega até resolução ou decisão explícita do usuário de aceitar o risco.

### High

- **Definition:** degrada significativamente uma tarefa importante — é completável, mas com erro provável, custo alto ou exclusão parcial.
- **User impact:** frustração forte, erros frequentes, abandono provável; contorno existe mas é custoso ou pouco descobrível.
- **Typical scope:** fluxos principais e secundários de alto uso; violações do piso de acessibilidade.
- **Examples:** mensagem de erro que não diz como resolver em um fluxo central; texto de ação primária abaixo do contraste mínimo do baseline; formulário que descarta tudo ao falhar a validação de um campo.
- **Expected response:** corrigir antes da entrega; se a entrega prosseguir mesmo assim, a pendência fica registrada e visível.

### Medium

- **Definition:** causa atrito ou confusão perceptível sem comprometer a conclusão da tarefa.
- **User impact:** hesitação, retrabalho leve, necessidade de descobrir por tentativa; a tarefa termina.
- **Typical scope:** qualquer fluxo; problemas de clareza, feedback e consistência com contorno natural.
- **Examples:** rótulo ambíguo que exige um clique exploratório; feedback de sucesso pouco perceptível; dois padrões diferentes para a mesma ação em telas irmãs.
- **Expected response:** planejar correção; entra priorizado no backlog, não bloqueia entrega.

### Low

- **Definition:** imperfeição menor, percebida por poucos, com efeito marginal na experiência.
- **User impact:** incômodo pontual ou nenhum efeito prático; ninguém falha nem hesita por causa dele.
- **Typical scope:** detalhes de polimento em qualquer área.
- **Examples:** espaçamento inconsistente entre cards; microcopy que poderia ser mais natural; ícone levemente desalinhado — ainda que visualmente evidente.
- **Expected response:** corrigir quando conveniente (na próxima passada pela área); nunca bloqueia nada.

### Opportunity

- **Definition:** não é um problema — é um potencial de melhoria além do estado atual aceitável.
- **User impact:** nenhum impacto negativo hoje; ganho possível se aproveitada.
- **Typical scope:** qualquer área; ideias emergentes da análise.
- **Examples:** o empty state funciona, mas poderia ensinar o próximo passo; um fluxo de 4 passos que evidência sugere ser comprimível em 2.
- **Expected response:** registrar como sugestão, claramente separada dos problemas; jamais entra em contagem de defeitos nem bloqueia.

## Relação com os demais standards

- Achados são identificados pelas dimensões de `quality-framework.md`; a severidade do pior achado limita a nota da dimensão.
- Violações de `accessibility-baseline.md` têm piso `High`; as excludentes são `Critical`.
- Todo achado reportado usa o formato **Design Issue** de `design-output-format.md`, que exige severidade e evidência.

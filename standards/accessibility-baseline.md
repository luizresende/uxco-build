# Accessibility Baseline

> **Propósito:** o piso prático de acessibilidade de tudo que o UXCO Build produz ou aprova — critérios verificáveis em design, com limites de verificação declarados.
> **Quando consultar:** ao criar ou avaliar qualquer interface; é a fonte da dimensão *Accessibility* do `quality-framework.md`.

**Sobre conformidade normativa:** as referências numéricas abaixo são heurísticas práticas inspiradas em WCAG 2.x. Atender a este baseline **não constitui alegação de conformidade** com WCAG ou qualquer norma — conformidade exige auditoria formal sobre o produto implementado, fora do alcance deste sistema.

**Regra de honestidade de verificação:** quando um critério exigir dados que o agente não possui (valores exatos de cor, comportamento de runtime, ordem de foco real), o agente **declara que não foi possível validar objetivamente** e registra o gap como `UNKNOWN` — nunca assume aprovação nem reprova por suposição.

**Severidade:** violação de qualquer área do baseline tem piso `High`; quando exclui um grupo de usuários de completar a tarefa, é `Critical` (ver `severity-framework.md`).

## Áreas do baseline

### 1. Perceivability

- **Expectativa:** toda informação essencial é perceptível por mais de uma via; conteúdo não textual essencial tem alternativa textual prevista.
- **Verificação em design:** existe rótulo/alternativa prevista para ícones funcionais, imagens informativas e gráficos? Informação essencial não vive só em hover ou só em animação?
- **Limite:** a entrega da alternativa (alt text real, ARIA) é da implementação — em design, verifica-se que ela foi *prevista e especificada*.

### 2. Text legibility

- **Expectativa:** texto de leitura confortável — referência prática: corpo ≥ 16px em web, secundários ≥ 12–14px; line-height que não comprima a leitura; larguras de linha tratáveis.
- **Verificação em design:** tamanhos reais das camadas de texto; hierarquia tipográfica com diferenças perceptíveis entre níveis.
- **Limite:** legibilidade da fonte específica em densidades diferentes de tela não é verificável objetivamente pelo agente.

### 3. Contrast awareness

- **Expectativa:** referência prática de contraste — 4.5:1 para texto normal, 3:1 para texto grande e para componentes de interface/indicadores essenciais.
- **Verificação em design:** quando os valores de cor são legíveis no canvas, calcular ou estimar o par texto/fundo; sinalizar pares visivelmente arriscados (cinza claro sobre branco, cores próximas).
- **Limite:** sem os valores exatos de cor computados (transparências, imagens de fundo, gradientes), o contraste real **não é validável objetivamente** — declarar e recomendar verificação com ferramenta dedicada.

### 4. Target size

- **Expectativa:** alvos de toque/clique confortáveis — referência prática: ≥ 44×44px em interfaces de toque; espaçamento que evite toques acidentais entre alvos adjacentes.
- **Verificação em design:** dimensões dos elementos interativos e distância entre alvos vizinhos, mensuráveis no canvas.
- **Limite:** a área de acerto real pode ser maior que a visual (hit area estendida na implementação) — na dúvida, apontar e perguntar, não reprovar automaticamente.

### 5. Keyboard/navigation awareness

- **Expectativa:** todo fluxo operável por ponteiro deve ser concebível por teclado/navegação sequencial; nada essencial acessível apenas por gesto complexo (arrastar, multi-toque) sem alternativa.
- **Verificação em design:** existe caminho alternativo previsto para interações gestuais? A ordem lógica de leitura da tela é inferível do layout?
- **Limite:** ordem de tabulação e operabilidade reais são propriedades do código — em design, registra-se a *intenção* e sinaliza-se o risco como nota de handoff.

### 6. Semantic clarity

- **Expectativa:** a função de cada elemento é identificável — botões parecem acionáveis, links se distinguem de texto, campos indicam o que recebem; títulos descrevem suas seções.
- **Verificação em design:** affordances visuais consistentes com a função; rótulos que descrevem a ação ("Salvar alterações"), não genéricos ("OK", "Clique aqui").
- **Limite:** semântica programática (roles, landmarks, hierarquia de headings no código) pertence à implementação — em design, especifica-se a intenção.

### 7. Focus/state clarity

- **Expectativa:** estados interativos distinguíveis — foco visível deve estar previsto; estados hover/pressed/disabled/selected diferenciados de forma perceptível.
- **Verificação em design:** os estados dos componentes interativos foram desenhados? O estado de foco existe como especificação, ou ficou implícito?
- **Limite:** o comportamento real do anel de foco é da implementação; a ausência dele *no design* já é um achado (estado não especificado).

### 8. Color independence

- **Expectativa:** cor nunca é o único canal de um significado — status, erro, seleção e diferenciação carregam também texto, ícone, forma ou posição.
- **Verificação em design:** teste mental de dessaturação — em tons de cinza, a informação sobrevive? Verificável diretamente no canvas.
- **Limite:** nenhum relevante; esta é uma das áreas mais verificáveis em design.

### 9. Error communication

- **Expectativa:** erros dizem o que aconteceu, onde e como resolver, perto do ponto do problema; nunca apenas mudança de cor ou código técnico cru.
- **Verificação em design:** os estados de erro existem e seguem essa anatomia? A mensagem preserva o trabalho do usuário?
- **Limite:** o disparo real da validação (timing, foco automático) é comportamento de runtime — em design, avalia-se conteúdo e posicionamento previstos.

### 10. Cognitive accessibility

- **Expectativa:** linguagem direta, passos curtos, consistência de padrões, sem depender de memorização entre telas; tempo de resposta exigido do usuário não é punitivo.
- **Verificação em design:** complexidade de cada passo, clareza dos rótulos, quantidade de decisões simultâneas — avaliável por inspeção do fluxo.
- **Limite:** compreensão real varia por público; sem pesquisa com usuários, a avaliação é heurística e deve ser apresentada como tal (`EVIDENCE` fraca, não `FACT`).

## Uso em avaliação

1. Percorrer as 10 áreas; para cada uma, registrar: **atende / viola (com evidência) / não validável objetivamente**.
2. Violações viram Design Issues (formato em `design-output-format.md`) com severidade ≥ `High`.
3. Áreas não validáveis viram lista explícita de pendências de verificação — nunca silêncio, nunca aprovação implícita.

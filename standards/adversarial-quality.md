# Adversarial Quality

> **Propósito:** o contrato da camada adversarial do review — os registros do Design Critic e do Design QA, os marcadores de estágio e o invariante de ciclo único. Define **como um diagnóstico é desafiado e auditado**; severidade, Confidence, camadas, contrato do achado e dimensões de qualidade de design vêm dos standards existentes e **não são redefinidos aqui**.
> **Quando consultar:** ao executar ou auditar os STEPs 6–8 do `/uxco-review` (`workflows/uxco-review.md`), e sempre que um diagnóstico de design precisar ser desafiado antes de ser considerado confiável.

Dependências explícitas: contrato do achado (7 campos) e camadas L0–L8 vêm de `critique-framework.md`; severidade e as quatro lentes, de `severity-framework.md`; Confidence e os blocos Assumption/Open Question, de `design-output-format.md`; as dimensões e os gates de **qualidade do design**, de `quality-framework.md`; o contexto de produto, do Product Context Brief (`product-context-brief.md`).

## Por que esta camada existe

Uma análise entregue no instante em que é produzida carrega os vieses de quem a produziu: a suposição que passou por fato, o achado inflado porque chamava atenção, a recomendação que trata o sintoma, a camada que ninguém notou que faltou. Autocriticar antes de concluir já é regra global (CLAUDE.md §3.11) — mas regra sem momento próprio degenera em releitura do próprio texto.

Esta camada dá à autocrítica um **momento separado, com responsabilidade diferente**:

| Momento | Pergunta que ele responde |
| --- | --- |
| **Initial Analysis** | Quais problemas existem neste design? |
| **Adversarial Critique** | Onde **o nosso diagnóstico** pode estar errado, incompleto, superficial ou excessivamente confiante? |
| **Revision** | Qual é o diagnóstico único que sobrevive ao desafio? |
| **Review QA** | Este review é confiável o suficiente para ser entregue? |

**Não são personas.** São responsabilidades encadeadas: a primeira olha o design; a segunda olha a primeira; a terceira consolida; a quarta audita o resultado das três. Nenhuma delas "conversa" com as outras — cada uma recebe um artefato e produz um artefato.

## Marcadores de estágio

Observabilidade sem expor raciocínio interno. Cada estágio registra exatamente um marcador canônico, e o conjunto forma o **stage trace** que sobe ao report:

```text
INITIAL_ANALYSIS    STEP 4–5  — varredura + consolidação: o diagnóstico inicial
ADVERSARIAL_REVIEW  STEP 6    — Design Critic: o diagnóstico sob ataque
REVISION            STEP 7    — diagnóstico único revisado
FINAL_QA            STEP 8    — Design QA: auditoria da qualidade do review
```

Regras dos marcadores:

1. **Tokens exatos**, em maiúsculas com `_` — sinônimos e traduções quebram o consumo programático.
2. **Um por review, uma vez cada.** Marcador repetido indica ciclo extra (proibido — ver Ciclo único); marcador ausente indica estágio pulado.
3. **Marcador é registro de estágio executado, nunca de estágio pretendido.** Registrar `ADVERSARIAL_REVIEW` sem ter desafiado o diagnóstico é fabricação de evidência de processo — a falha mais grave desta camada.
4. **Trace não é raciocínio.** O marcador declara que o estágio aconteceu e o que ele mudou em números; não narra como se chegou lá.

## Ciclo único

Invariante desta camada, não configuração:

```text
MÁXIMO: 1 adversarial critique · 1 revision · 1 final QA
```

- **Nenhuma recursão.** O Critic não desafia a própria crítica; o QA não reabre o Critic; a Revision não produz um segundo diagnóstico para ser desafiado de novo.
- **QA reprovando não dispara novo ciclo.** O bloqueio de qualidade é **declarado**, não reprocessado: o review é entregue com o blocker explícito e com a confiabilidade do próprio veredito qualificada. Quem decide o que fazer com isso é o usuário.
- **Diagnóstico inicial vazio não dispensa o ciclo.** Zero achados é exatamente o caso em que a pergunta do Critic mais importa ("o que deixamos de ver?") — o estágio roda, com Missing Findings como saída provável.
- Reflexão recursiva, agentes debatendo e número variável de passadas estão **fora** desta camada por decisão de arquitetura: o ganho marginal da segunda passada não paga o custo de latência, de verbosidade do report e de divergência entre diagnósticos.

## Adversarial Critique Record

A saída do Design Critic (`agents/design-critic.md`). Seis seções fixas — nenhuma omitida em silêncio; vazia, carrega declaração explícita:

```markdown
## Adversarial Critique Record

Stage: ADVERSARIAL_REVIEW
Challenged: [N achados do diagnóstico inicial]

### Confirmed Findings
[Achados que resistiram ao desafio — ou `Nenhum achado confirmado.`]

### Revised Findings
[Achados cujo diagnóstico, severidade, Confidence ou recomendação mudou — ou `Nenhuma revisão necessária.`]

### Rejected Findings
[Achados insuficientemente sustentados — ou `Nenhum achado rejeitado.`]

### Missing Findings
[Problemas relevantes ignorados pela análise inicial — ou `Nenhuma omissão identificada.`]

### Assumptions Challenged
[Suposições que sustentavam julgamentos — ou `Nenhuma suposição relevante em jogo.`]

### Confidence Changes
[Mudanças justificadas de Confidence — ou `Nenhuma mudança de Confidence.`]
```

### Contrato da entrada

Cada entrada das quatro primeiras seções usa este bloco de cinco campos:

```text
Finding:   [o achado atacado, como nomeado no diagnóstico inicial — ou o achado novo, em Missing]
Verdict:   [confirmed | revised | rejected | added]
Challenge: [o eixo que expôs o problema — assumption | evidence | severity | confidence |
            causality | missing-state | missing-edge-case | context-fit | recommendation |
            overengineering]
Basis:     [a evidência observável — ou a ausência de evidência — que sustenta o veredito]
Change:    [o que muda no achado, campo a campo, na notação `Campo: antes → depois`;
            `None` em confirmed]
```

Tokens canônicos: `Verdict` e `Challenge` usam exatamente os valores acima. Mudanças de escala usam a notação de seta sobre as escalas existentes — `Severity: High → Medium`, `Confidence: High → Low` —, nunca escalas novas nem números.

### Regras do registro

1. **Veredito precisa de base observável.** Rejeitar exige mostrar *qual* evidência falta, não declarar que falta. Confirmar exige apontar a evidência que resistiu. `Basis` vazio invalida a entrada.
2. **Rejeição não é exclusão silenciosa.** O achado rejeitado não desaparece: a Revision o remove de Issues e, quando ainda houver suspeita legítima sem evidência, ele reaparece em `Unknowns and Assumptions` como Open Question — nunca como problema afirmado (regra 3 do contrato do achado).
3. **Confirmação é resultado válido e completo.** Um record com tudo em `confirmed` e `Nenhuma omissão identificada.` é um record aprovado, não um estágio preguiçoso. **Não existe cota de revisões, rejeições ou omissões** — fabricar mudança para justificar a existência da camada é a mesma falha que fabricar achado para "render" camada (Failure Condition 6 da Design Critique Skill).
4. **O Critic não desenha nem reescreve o report.** Ele emite vereditos; a consolidação é da Revision. Operação integralmente `READ` (CLAUDE.md §6).
5. **Severidade e Confidence seguem as escalas de origem.** O Critic desafia a *aplicação* das quatro lentes e da escala de Confidence — jamais cria nível, dimensão ou significado novo.
6. **Sem raciocínio interno.** O record registra conclusão, base observável e rationale conciso. Cadeia de pensamento, deliberação e alternativas descartadas não entram — não são evidência, são ruído.
7. **Falsificador obrigatório onde a certeza é baixa:** todo achado que sobrevive com `Confidence` abaixo de `High` registra em `Basis` ou `Change` **o que o falsificaria** — e a Revision carrega isso para a Recommendation ou para Recommended Next Steps como validação pendente.

## Review QA Record

A saída do Design QA (`agents/design-qa.md`): a auditoria do **review**, não do design.

```markdown
## Review QA Record

Stage: FINAL_QA
Verdict: [REVIEW READY | REVIEW READY WITH RESERVATIONS | REVIEW NOT READY]

| Dimension | Status | Nota |
| --- | --- | --- |
| Context Grounding | [PASS / PARTIAL / FAIL / UNKNOWN] | [o que sustenta o status] |
| Evidence Quality | ... | ... |
| Severity Calibration | ... | ... |
| Actionability | ... | ... |
| Completeness | ... | ... |
| Accessibility Coverage | ... | ... |
| System Consistency | ... | ... |

QA Blockers: [None | um por linha, cada um nomeando a dimensão e o que o resolveria]
```

### Escala

`PASS` · `PARTIAL` · `FAIL` · `UNKNOWN` — a mesma convenção de conduta já usada pelos harnesses de avaliação (`benchmarks/*/README.md`), deliberadamente **não** a escala 1–5 do `quality-framework.md`:

| Status | Critério |
| --- | --- |
| `PASS` | A dimensão cumpre o padrão: nenhuma falha observável no review quanto a ela |
| `PARTIAL` | Desvio real, localizado e nomeável — o review segue utilizável, com a ressalva registrada |
| `FAIL` | Falha que compromete a confiabilidade do review nessa dimensão — abre QA Blocker |
| `UNKNOWN` | Não auditável com o material disponível; o que faltou é declarado |

**Nenhum score composto.** Não existe média, soma nem nota global do review: tokens de conduta não se somam, e somá-los produziria exatamente a falsa precisão que esta camada existe para combater. O sinal é a distribuição — quantos `PARTIAL`, quais dimensões, quais blockers.

### Dimensões

Sete dimensões, todas sobre o **review**; nenhuma delas reavalia o design:

| Dimension | O que audita no review | Pergunta-chave |
| --- | --- | --- |
| **Context Grounding** | Amarração de cada julgamento ao Brief e ao artefato observável | Todo julgamento se apoia em contexto real e declarado — nada inventado para fechar raciocínio? |
| **Evidence Quality** | Disciplina do campo Evidence em cada achado | A evidência é citável e observável — e `Confidence: Low` significa evidência fraca, nunca nenhuma? |
| **Severity Calibration** | Aplicação das quatro lentes e dos pisos | As severidades resistem às lentes, com pisos intactos e sem inflação nem rebaixamento silencioso? |
| **Actionability** | Especificidade das recomendações e dos next steps | Cada recomendação responde ao problema, e cada next step aponta para uma issue, validação ou camada destravável? |
| **Completeness** | Cobertura declarada: camadas, estados, edge cases | O Layer Coverage é íntegro, e o que não foi avaliado está declarado em vez de omitido? |
| **Accessibility Coverage** | Tratamento do piso de `accessibility-baseline.md` | O piso foi verificado — e o não-validável declarado, sem alegar conformidade nem inventar violação? |
| **System Consistency** | Conformidade do próprio report aos contratos | Contrato do achado, tokens canônicos e seções oficiais — sem formato paralelo nem seção inventada? |

### Blockers são separados do status

`QA Blockers` é lista própria, nunca derivada por aritmética. Toda dimensão em `FAIL` abre blocker; um blocker pode também nascer de falha transversal que nenhuma dimensão isolada captura (ex.: stage trace inconsistente com o record).

**Dois tipos de blocker não se confundem nunca:**

| Blocker | Significado | Onde vive |
| --- | --- | --- |
| **Design blocker** | O design avaliado está reprovado (achado `Critical`, piso de acessibilidade violado) | Quality Gate do `quality-framework.md` |
| **QA blocker** | O **review** não é confiável nessa dimensão | `QA Blockers` deste record |

Um review impecável sobre um design reprovado é `REVIEW READY` com Quality Gate reprovado. Um review frágil sobre um design excelente é `REVIEW NOT READY` com Quality Gate aprovado — e nesse caso o próprio veredito do gate fica qualificado pela ressalva. Tratar um pelo outro é falha de contrato.

### Veredito

| Veredito | Condição |
| --- | --- |
| `REVIEW READY` | Nenhum `FAIL`, nenhum QA Blocker aberto; `PARTIAL` e `UNKNOWN` declarados |
| `REVIEW READY WITH RESERVATIONS` | Nenhum `FAIL`, mas há `PARTIAL`/`UNKNOWN` que limitam o que o review pode afirmar |
| `REVIEW NOT READY` | Qualquer `FAIL`, ou qualquer QA Blocker aberto |

`REVIEW NOT READY` **não suprime o report** nem dispara novo ciclo: o report é entregue com o blocker explícito e com a limitação visível ao usuário. Esconder a reprovação do QA é a mesma violação que entregar Quality Gate reprovado como aprovado (CLAUDE.md §8).

## Review Assurance — o que sobe ao report

O report final **não anexa duas análises**. Dos dois records sobe um bloco compacto, na seção `## Review Assurance` do contrato do report (`critique-framework.md`):

```text
Stage trace:  INITIAL_ANALYSIS → ADVERSARIAL_REVIEW → REVISION → FINAL_QA
Adversarial:  [N confirmed · N revised · N rejected · N added]
QA verdict:   [REVIEW READY | REVIEW READY WITH RESERVATIONS | REVIEW NOT READY]
QA blockers:  [None | lista]
Reservations: [None | o que o QA limitou, em uma linha cada]
```

Regras:

1. **Compacto por contrato.** A camada adversarial existe para melhorar o resultado, não para dobrar o tamanho do report. Os records íntegros acompanham o report ou ficam referenciados — como o Brief —, nunca colados dentro das Issues.
2. **As Issues do report são as revisadas, e só elas.** Diagnóstico contraditório lado a lado é falha de consolidação: o usuário recebe uma conclusão, com o histórico do desafio resumido aqui.
3. **Contagens são verificáveis contra o record.** `N rejected` precisa corresponder a entradas reais com `Verdict: rejected`; números que não fecham são fabricação de processo.
4. **Trace ausente ou incompleto é limitação declarada**, não omissão: estágio que não rodou aparece como tal, com o porquê.

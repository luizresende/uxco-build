# Design Critic

> **Propósito:** a responsabilidade adversarial do sistema — atacar o diagnóstico inicial antes de ele ser considerado confiável. Não produz crítica de interface: produz vereditos sobre uma crítica já produzida.
> **Quando consultar:** no STEP 6 do `/uxco-review` (`workflows/uxco-review.md`), e sempre que um diagnóstico de design precisar ser desafiado antes de virar conclusão.

Esta é uma **responsabilidade**, não uma capacidade de uso livre (CLAUDE.md §9): ela só existe acoplada a um diagnóstico já emitido. Opera sob a constituição e **referencia — nunca redefine** — o contrato do achado e as camadas L0–L8 (`standards/critique-framework.md`), a severidade e suas quatro lentes (`standards/severity-framework.md`), a escala de Confidence (`standards/design-output-format.md`), o piso de acessibilidade (`standards/accessibility-baseline.md`) e o contexto de produto (`standards/product-context-brief.md`). O formato da sua saída é o **Adversarial Critique Record** de `standards/adversarial-quality.md`.

## Purpose

Responder: **"onde o nosso diagnóstico pode estar errado, incompleto, superficial ou excessivamente confiante?"**

O Critic não melhora a redação da crítica nem acrescenta observações que faltaram por capricho. Ele testa a **sustentação** de cada conclusão: o que a apoia, o que a derrubaria, e o que ela deixou passar.

## Boundary — Design Critique × Design Critic

| | **Design Critique Skill** | **Design Critic** |
| --- | --- | --- |
| Objeto | O design | **O diagnóstico do design** |
| Pergunta | Quais problemas existem neste design? | Onde este diagnóstico não se sustenta? |
| Entrada | Artefato observável + Brief | Conjunto consolidado de achados + o mesmo artefato e Brief |
| Saída | Design Critique Report | Adversarial Critique Record (vereditos) |
| Movimento | Encontrar e priorizar problemas | Confirmar, revisar, rejeitar e completar conclusões |
| Autoridade | Afirma achados | **Não afirma achado próprio como issue** — propõe omissões que a Revision incorpora no contrato de 7 campos |

**O Critic não repete a varredura L0–L8.** Ele não reabre as camadas para procurar mais problemas de interface; ele pergunta se a varredura já feita concluiu bem. A exceção é deliberada e delimitada: o eixo `missing-state`/`missing-edge-case`/`context-fit` o obriga a olhar o artefato de novo — mas apenas para testar **omissões do diagnóstico**, não para produzir uma segunda crítica.

Rodar o Critic sem um diagnóstico inicial é uso inválido: sem objeto a desafiar, o que ele produziria seria uma crítica comum disfarçada de auditoria.

## Inputs

| Fonte | Papel | Obrigatória |
| --- | --- | --- |
| Diagnóstico inicial consolidado (saída do STEP 5 — achados no contrato de 7 campos) | O objeto do desafio | **Sim** — sem diagnóstico não há o que desafiar |
| Artefato observável (Canvas Snapshot, fixture, imagem, descrição) | Verificar se a evidência citada existe de fato e se há omissão | **Sim** — desafiar sem acesso ao artefato é opinião sobre opinião |
| Product Context Brief | Testar `context-fit`, task criticality e as suposições herdadas | Não — ausência vira eixo de desafio (`assumption`), não impedimento |
| Scope block | Saber o que estava legitimamente fora de escopo | Não |

**Diagnóstico inicial vazio é entrada válida.** Zero achados é o caso em que a pergunta do Critic mais importa: todo o esforço vai para `Missing Findings` e para o teste de se a ausência de achados é honesta ou cega.

## Mandate — os dez eixos de desafio

Cada eixo é obrigatório como **pergunta**, nunca como cota de resultado. Varrer um eixo e concluir que nada se sustenta nele é resultado completo.

| # | Eixo (`Challenge`) | O que ele testa |
| --- | --- | --- |
| 1 | `assumption` | Quais premissas o diagnóstico adotou sem perceber que eram premissas? Alguma foi tratada como fato? |
| 2 | `evidence` | Qual achado se apoia em evidência fraca, não citável, ou em princípio genérico no lugar de observação? |
| 3 | `severity` | A severidade resiste às quatro lentes? Há inflação, ou piso violado para baixo? |
| 4 | `confidence` | A Confidence corresponde à força real da evidência — ou há certeza emprestada? |
| 5 | `causality` | O achado nomeia a causa ou o sintoma? Existe explicação alternativa igualmente compatível com o observado? |
| 6 | `missing-state` | Qual estado (vazio, carregando, erro, parcial, sucesso) ficou fora da análise? |
| 7 | `missing-edge-case` | Qual volume extremo, texto longo, permissão, interrupção ou caminho de volta não foi considerado? |
| 8 | `context-fit` | O diagnóstico cabe neste produto, neste usuário e neste estágio — ou aplica um padrão genérico fora de lugar? |
| 9 | `recommendation` | A recomendação resolve o problema identificado? Pode criar outro? É verificável? |
| 10 | `overengineering` | A recomendação introduz complexidade desnecessária — mais telas, mais estados, mais configuração do que o problema exige? |

## Perguntas adversariais obrigatórias

As dez sondas que materializam os eixos. Elas são o método, não o output — a resposta de cada uma só aparece no record quando produzir veredito:

1. What did we assume?
2. Which claims lack sufficient evidence?
3. Are we treating preference as usability?
4. Is the assigned severity justified?
5. Could there be another explanation?
6. Are we solving the cause or only the symptom?
7. Which user/state/edge case did we overlook?
8. Could the recommendation create another problem?
9. Are we recommending unnecessary complexity?
10. What would falsify this diagnosis?

A pergunta 3 tem peso especial: ela aplica ao próprio diagnóstico o Impact Test da Design Critique Skill. Achado que não responde aos três critérios do teste (efeito observável · tarefa afetada · evidência) é **preferência travestida de defeito** — `Verdict: rejected`, eixo `evidence`, e a preferência pode ser declarada como preferência fora de Issues.

A pergunta 10 é obrigatória em todo achado que sobreviva com `Confidence` abaixo de `High`: o falsificador é registrado e a Revision o carrega como validação pendente (regra 7 do Adversarial Critique Record).

## Process

```text
STEP 1  Inventariar — listar os achados do diagnóstico inicial; contar (`Challenged: N`)
STEP 2  Verificar evidência — cada Evidence citada existe no artefato? é observável? é citável?
STEP 3  Testar sustentação — eixos 1–5 achado por achado: assumption, evidence, severity,
        confidence, causality
STEP 4  Procurar omissão — eixos 6–8 contra o artefato e o Brief: estados, edge cases,
        context-fit; o que a varredura não viu
STEP 5  Testar recomendações — eixos 9–10: a recomendação responde ao problema, sem criar
        outro e sem complexidade desnecessária
STEP 6  Emitir vereditos — um por achado (confirmed | revised | rejected), mais os added
STEP 7  Autocrítica — Quality Checklist: nenhuma mudança fabricada, nenhuma base vazia
STEP 8  Record — Adversarial Critique Record completo, seis seções
```

A profundidade é proporcional ao diagnóstico (CLAUDE.md §2): três achados não exigem o rito de trinta. O que não é proporcional é a cobertura dos eixos — todos são perguntados.

## Vereditos

| `Verdict` | Significado | Exigência |
| --- | --- | --- |
| `confirmed` | O achado resistiu ao desafio | `Basis` aponta a evidência que resistiu; `Change: None` |
| `revised` | O problema é real, mas algum campo estava errado | `Change` lista campo a campo, na notação `Campo: antes → depois` |
| `rejected` | A sustentação é insuficiente para afirmar o problema | `Basis` nomeia **qual** evidência falta — não basta dizer que falta |
| `added` | Omissão relevante do diagnóstico inicial | `Basis` traz a evidência observável da omissão, no mesmo padrão exigido de qualquer achado |

**Rejeitar não é apagar.** O achado rejeitado sai de Issues; havendo suspeita legítima sem evidência, ele reaparece em `Unknowns and Assumptions` como Open Question (regra 2 do record). Suspeita sem evidência nunca volta como problema afirmado.

**Adicionar não é relaxar o padrão.** Um `added` precisa da mesma evidência citável que qualquer achado — o Critic não ganha licença para afirmar o que a Design Critique não poderia afirmar. Omissão sem evidência observável é Open Question, não achado novo.

## Discipline

1. **Confirmar tudo é um resultado legítimo.** Se o diagnóstico inicial estava correto, o record diz isso. Não existe cota de revisões, rejeições ou omissões, e **fabricar mudança para justificar a existência da camada é a falha mais grave desta responsabilidade** — simétrica à de fabricar achado para "render" uma camada.
2. **Sem gosto pessoal, dos dois lados.** O Critic não rejeita porque discorda esteticamente, nem adiciona porque teria desenhado diferente. O critério é sempre impacto observável (regra 1 do `critique-framework.md`; anti-pattern 9).
3. **Sem raciocínio interno no record.** Conclusão, base observável e rationale conciso. Deliberação, hipóteses descartadas e caminho mental não entram.
4. **Uma passada só.** O Critic roda uma vez por review e não desafia a própria crítica (Ciclo único — `standards/adversarial-quality.md`).
5. **`READ` integral.** Nenhuma escrita em canvas, memória de projeto ou report. O Critic emite vereditos; consolidar é da Revision (STEP 7).
6. **Não redesenha.** Propor a correção da recomendação é legítimo; propor o design é outra responsabilidade, fora desta sprint.
7. **Escalas alheias são intocáveis.** Severidade, Confidence e camadas pertencem aos seus standards; o Critic desafia a **aplicação** delas, nunca o significado.

## Failure Conditions

O record é **inválido** — refazer, não entregar — se:

1. Qualquer entrada sem `Basis` observável, ou com `Verdict`/`Challenge` fora dos tokens canônicos.
2. Mudança fabricada: achado revisado ou rejeitado sem base real, ou omissão inventada, para o estágio parecer produtivo.
3. `added` afirmado como issue sem a evidência citável que o contrato do achado exige.
4. Veredito emitido sobre achado que não existe no diagnóstico inicial (fora de `Missing Findings`).
5. Segunda crítica disfarçada: varredura L0–L8 repetida, produzindo achados novos sem relação com omissão do diagnóstico.
6. Preferência estética usada como base para rejeitar ou adicionar.
7. Raciocínio interno exposto no record, ou record substituído por narrativa.
8. Mais de uma passada adversarial, ou Critic acionado sem diagnóstico inicial.
9. Qualquer escrita executada.

## Quality Checklist

Autocrítica antes de entregar o record:

- [ ] `Challenged: N` corresponde ao número real de achados do diagnóstico inicial?
- [ ] Os dez eixos foram perguntados — e os que não produziram veredito ficaram sem entrada, em vez de ganharem uma entrada vazia?
- [ ] Toda entrada tem `Basis` observável e `Change` coerente com o veredito?
- [ ] Nenhuma rejeição se apoia em "falta evidência" sem dizer **qual** evidência falta?
- [ ] Todo `added` tem evidência citável — e o que não tem virou Open Question?
- [ ] Todo achado sobrevivente com `Confidence` abaixo de `High` registrou o seu falsificador?
- [ ] Nenhuma mudança existe para justificar o estágio — e "nada a alterar" foi dito sem desconforto, se era o caso?
- [ ] As seis seções do record estão presentes, as vazias com declaração explícita?
- [ ] Nenhum raciocínio interno no record, nenhuma escrita executada?

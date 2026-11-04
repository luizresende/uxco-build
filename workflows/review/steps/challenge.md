# Fase challenge

Ataque o diagnóstico de `analyze.json` e escreva, no mesmo artefato, o diagnóstico único. Não varra L0–L8 de novo. Não escreva no design. Marcadores `ADVERSARIAL_REVIEW` e `REVISION`. `cyclePass` é 1 e `rerun` é false. `revisionMarker` é `REVISION`.

## Adversarial Quality Engine

Quatro responsabilidades, não quatro personas. `analyze` olha o design. Esta fase olha o diagnóstico e deixa um diagnóstico só. `close` audita o review.

| Estágio | Objeto | Pergunta |
| --- | --- | --- |
| Initial Analysis | O design | Quais problemas existem neste design? |
| Adversarial Critique | O diagnóstico | Onde ele está errado, incompleto, superficial ou confiante demais? |
| Revision | Os vereditos | Qual diagnóstico único sobrevive? |
| Review QA | O review | Ele é confiável para ser entregue? |

### Fronteira — quem pergunta o quê

O Critic olha o diagnóstico. Confirmar tudo é resultado válido. Não há cota. Fabricar revisão para o estágio parecer produtivo é falha. O trace não expõe raciocínio interno.

Os dez eixos são pergunta, não cota. O processo longo, as failure conditions e a disciplina ficam em `agents/design-critic.md` e não entram nesta fase.

| Eixo | Pergunta |
| --- | --- |
| `assumption` | Alguma premissa foi tratada como fato? |
| `evidence` | O achado se apoia em observação citável, ou em princípio genérico? |
| `severity` | A severidade resiste às quatro lentes, sem inflação e sem furar o piso para baixo? |
| `confidence` | A Confidence corresponde à força da evidência? |
| `causality` | O achado nomeia a causa ou o sintoma? |
| `missing-state` | Qual estado (vazio, carregando, erro, parcial) ficou de fora? |
| `missing-edge-case` | Qual extremo, permissão ou caminho de volta não foi considerado? |
| `context-fit` | O diagnóstico cabe neste produto, ou aplica um padrão genérico? |
| `recommendation` | A recomendação resolve o problema, sem criar outro, e é verificável? |
| `overengineering` | A recomendação pede mais complexidade do que o problema exige? |

Sondas, só quando mudarem um veredito: o que assumimos; o que não tem evidência; preferência tratada como usabilidade; severidade justificada; outra explicação; causa ou sintoma; estado ou extremo omitido; a recomendação cria outro problema; complexidade desnecessária; o que falsificaria o diagnóstico.

### Ciclo único

```text
MÁXIMO: 1 adversarial critique · 1 revision · 1 final QA
```

Nenhuma recursão. Diagnóstico inicial vazio não dispensa esta fase: as seis listas saem vazias se não houver o que dizer, e `missing` só recebe omissão com evidência. QA reprovado, mais tarde, não reabre este passo.

## Record

Seis listas, sempre presentes: `confirmed`, `revised`, `rejected`, `missing`, `assumptionsChallenged`, `confidenceChanges`. Entrada com `finding`, `verdict`, `challenge`, `basis`, `change`.

- `confirmed`: verdict confirmed, `change` null. Basis observa por que o achado resistiu.
- `revised`: `change` no formato `Campo: antes → depois`, com `→`.
- `rejected`: `change` null. Basis diz qual evidência falta. Rejeitar por gosto não vale.
- `missing`: verdict `added`, id novo, `change` null, evidência citável no basis. Sem desconto.

Cada id de `issues` e `opportunities` do analyze aparece em exatamente uma das três primeiras listas. Suposição que não é achado usa `finding` `assumption:<texto>`.

Assumption apresentada como fato é o anti-pattern 9. Autocriticar acontece aqui, não na hora de entregar. A lista numerada está em `docs/constitution/anti-patterns.md` e os doze princípios em `docs/constitution/operating-principles.md`; nenhum dos dois entra nesta fase.

### Revision — um diagnóstico só

O mesmo artefato carrega o record e o diagnóstico que o usuário poderá ver. Não há segunda lista.

| Verdict | Efeito |
| --- | --- |
| confirmed | O achado permanece. Para o confirmado, resistir ao desafio é preservação, não inércia. |
| revised | Os campos mudam conforme `change`. Continua sendo um achado. |
| rejected | Sai de issues e de opportunities. Entra em `accounted` com texto. Suspeita legítima usa `as: open-question`. Rejeição sem resto usa `as: dropped`. Texto vazio é exclusão silenciosa. |
| added | Entra no contrato pleno de 7 campos, sem desconto de evidência. |

Depois de aplicar os vereditos, reaponte os mecanismos: `mechanismsReapplied` inclui `dedupe` e `priority`. Severidade ainda pelas quatro lentes. Ordenação: Critical → Low nas issues; Opportunity só em opportunities.

Não crie uma segunda lista de diagnóstico. Achado rejeitado que permanece como problema afirmado é diagnóstico contraditório — o validador rejeita o artefato.

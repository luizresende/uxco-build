# Fase challenge

Ataque o diagnóstico de `analyze.json`. Não varra L0–L8 de novo. Não escreva no design. Marcador `ADVERSARIAL_REVIEW`. `cyclePass` é 1 e `rerun` é false.

## Adversarial Quality Engine

Quatro responsabilidades, não quatro personas. Cada uma recebe um artefato e produz outro.

| Estágio | Objeto | Pergunta |
| --- | --- | --- |
| Initial Analysis | O design | Quais problemas existem neste design? |
| Adversarial Critique | O diagnóstico | Onde ele está errado, incompleto, superficial ou confiante demais? |
| Revision | Os vereditos | Qual diagnóstico único sobrevive? |
| Review QA | O review | Ele é confiável para ser entregue? |

### Fronteira — quem pergunta o quê

O Critic olha o diagnóstico. A pergunta e os dez eixos estão em `agents/design-critic.md`. Confirmar tudo é resultado válido. Não há cota. Fabricar revisão para o estágio parecer produtivo é falha. O trace não expõe raciocínio interno.

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

Assumption apresentada como fato é o anti-pattern 9 (`docs/constitution/anti-patterns.md`). O princípio 11 está em `docs/constitution/operating-principles.md`: autocriticar antes de concluir, nesta fase e não na hora de entregar.

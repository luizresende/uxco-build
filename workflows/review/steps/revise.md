# Fase revise

Um diagnóstico. Marcador `REVISION`. `cyclePass` 1. `rerun` false. O usuário nunca recebe a análise inicial ao lado desta.

### Revision — um diagnóstico só

| Verdict | Efeito |
| --- | --- |
| confirmed | O achado permanece. Para o confirmado, resistir ao desafio é preservação, não inércia. |
| revised | Os campos mudam conforme `change`. Continua sendo um achado. |
| rejected | Sai de issues e de opportunities. Entra em `accounted` com texto. Suspeita legítima usa `as: open-question`. Rejeição sem resto usa `as: dropped`. Texto vazio é exclusão silenciosa. |
| added | Entra no contrato pleno de 7 campos, sem desconto de evidência. |

Depois de aplicar os vereditos, reaponte os mecanismos: `mechanismsReapplied` inclui `dedupe` e `priority`. Severidade ainda pelas quatro lentes de `standards/severity-framework.md`. Ordenação: Critical → Low nas issues; Opportunity só em opportunities.

Não crie uma segunda lista de diagnóstico. Achado rejeitado que permanece como problema afirmado é diagnóstico contraditório — o validador rejeita o artefato.

Falsificador de achado com Confidence abaixo de High fica na recommendation ou será next step na fase close. Não se perde aqui.

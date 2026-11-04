# Fase close

Feche o review. Marcador `FINAL_QA`. `cyclePass` 1. `rerun` false. `mode` é `READ`. Escreva `close.json` e `report.md` no mesmo diretório. Não escreva no canvas nem na memória do projeto.

O QA audita o review. Não varre L0–L8 e não abre issue de design. Lacuna vira falha de `completeness` na dimensão do QA, não achado novo. Sete dimensões, nesta ordem, em `PASS`, `PARTIAL`, `FAIL` ou `UNKNOWN`: contextGrounding, evidenceQuality, severityCalibration, actionability, completeness, accessibilityCoverage, systemConsistency. `compositeScore` é null.

Veredito, sem média:

- algum `FAIL` → `REVIEW NOT READY`, e `blockers` é a lista desses ids de dimensão;
- senão, algum `PARTIAL` ou `UNKNOWN` → `REVIEW READY WITH RESERVATIONS` e blockers vazios;
- senão → `REVIEW READY`.

## Dois blockers

Design blocker é o design: achado Critical ou piso de acessibilidade, em `qualityGate.designBlockers`, como id de issue ou `accessibility-floor`. QA blocker é o review: dimensão em FAIL. Não use o nome de uma dimensão de QA dentro de designBlockers.

Review impecável sobre design reprovado é `REVIEW READY` com gate `fail`. Review frágil sobre design bom é `REVIEW NOT READY` com gate `pass` e `qualifiedByQa: true`. Os dois casos têm de ser representáveis. Confundir os blockers invalida o review.

O Quality Gate do design usa as dez dimensões de `standards/quality-framework.md` (contextFit e usability, completeness e accessibility são as críticas). Nota 1 a 5 pelo pior achado do diagnóstico revisado, ou `UNKNOWN`. Média das dimensões avaliadas ≥ 4, crítica ≥ 3, nenhum design blocker aberto. Blocker aberto só sai com `riskAccepted: true` e `decision` preenchida — aceite explícito, não escrita em memória alheia (`docs/constitution/decision-framework.md`).

`REVIEW NOT READY` não dispara outro ciclo. O report sai mesmo assim, com o blocker visível e `qualifiedByQa: true`. Esconder a reprovação é falha.

## Output

A saída visível é o Design Critique Report, e o review não cria nenhuma seção paralela. O molde é `templates/reports/design-review.md`. O contrato é `standards/critique-framework.md`.

Review impecável de um design reprovado continua representável: `REVIEW READY` com Quality Gate reprovado. O inverso também: `REVIEW NOT READY` com Quality Gate aprovado, e `qualifiedByQa: true`. Design blocker e QA blocker ficam em campos diferentes; `standards/quality-framework.md` é o dono do primeiro.

### Composição do report

| Conteúdo | Onde |
| --- | --- |
| Executive Summary | `## Executive Summary` |
| Review Scope | campo Scope, com o bloco do scope.json |
| Context Snapshot | campo Context |
| Critical · High · Medium · Low | `## Issues` |
| Opportunities | `## Opportunities` |
| Recommended Next Steps | `## Recommended Next Steps` |
| Review Limitations | `## Unknowns and Assumptions` + `## Layer Coverage` |
| Review Assurance | `## Review Assurance` |

Executive Summary traz o que foi analisado, o diagnóstico principal, quantos problemas relevantes, o risco geral e a prioridade recomendada. Nunca apenas uma contagem.

Issues são as revisadas, e só elas, severidade primeiro e, no empate, impacto → confiança → alcance.

Recommended Next Steps nunca lista genérica. Cada passo aponta uma issue, uma validação ou uma camada not-evaluable. Exemplo do formato:

```text
1. Resolver o bloqueio de recuperação de pagamento.        [← issue Critical]
```

Review Limitations cobrem quatro origens, nos quatro arrays de `reviewLimitations`: contexto ausente, dados não expostos (as limitations do Canvas Snapshot), suposições adotadas, validação humana pendente.

`stageTrace` é `INITIAL_ANALYSIS`, `ADVERSARIAL_REVIEW`, `REVISION`, `FINAL_QA`, uma vez cada. `counts` fecha com o challenge. Review Assurance leva o trace, as contagens, o veredito e os QA blockers. Os records não entram dentro de Issues.

O report não cresce porque a camada adversarial existe.

## Falha desta fase

Falha 7 — diagnóstico inicial vazio — já passou pelo challenge. Zero issues com cobertura honesta é resultado legítimo. Diga isso no Executive Summary.

Falha 8 — QA reprovando o review. Declarar, não reprocessar. O veredito do Quality Gate sai qualificado (`qualifiedByQa`). A decisão volta ao usuário.

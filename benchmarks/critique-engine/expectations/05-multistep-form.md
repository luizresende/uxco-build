# Expectations — CRT-005 Formulário multi-step (TalentoJá)

- **Fixture:** `examples/critique-tests/05-multistep-form/fixture.md`
- **Skills-alvo:** interaction-design (fluxo + estados) + design-critique
- **Referência de avaliação — nunca fornecer à skill durante a execução.**

## Essential

| Problema | Camada | Severidade aprox. |
| --- | --- | --- |
| Perda total de progresso por expiração de sessão (20 min) num formulário de 15–25 min sem qualquer salvamento — a falha é quase garantida por construção | L1/L8 | Critical |
| Botão voltar do navegador descarta tudo silenciosamente — gesto natural, punição máxima | L1/L3 | High–Critical |
| Erro de validação no envio não aponta campo nem etapa ("Formulário inválido.") — usuário caça o erro por 4 etapas | L8 | High |
| Upload sem estado: nenhum indicador por 5–30 s + falha via alert() nativo sem orientação | L3/L8 | High |
| Estados de envio ausentes por especificação declarada (loading, sucesso, erro de servidor, parciais "a definir") | L8 | High |

## Acceptable

- Stepper não clicável — navegação de correção custosa, agravando o erro de validação (Medium).
- Pretensão salarial obrigatória na etapa 1 (atrito/abandono precoce; Medium, com Confidence baixa sem pesquisa).
- Padrão estrutural nomeado: "o formulário não persiste nada em nenhuma circunstância" como causa única de expiração + voltar + falhas (agrupamento esperado).

## False positives

- Prescrever redução a 1 etapa ou nº ideal de etapas sem evidência.
- Afirmar taxa de conclusão/abandono (declarada desconhecida).
- Criticar a estética do stepper sem mecanismo de impacto.
- Tratar o tempo estimado (15–25 min) como medição — o material declara que é estimativa sem dado.

## Calibração

O melhor report agrupa expiração de sessão + voltar do navegador como **um padrão de persistência ausente** (causa) com manifestações, e não como issues independentes. A conjunção "sessão de 20 min × preenchimento de 15–25 min" deve aparecer no raciocínio de severidade — é ela que empurra o primeiro achado a Critical. Confidence: comportamentos declarados no material são observados (High); consequências em rede móvel são inferência razoável (Medium).

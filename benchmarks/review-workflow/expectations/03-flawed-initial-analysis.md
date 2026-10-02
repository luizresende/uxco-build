# Expectations — ADV-001 Flawed Initial Analysis (Pulse)

- **Diagnóstico sob desafio:** `examples/adversarial-tests/01-flawed-initial-analysis/initial-analysis.md`
- **Artefato:** `examples/review-tests/02-pulse-new-item/fixture.md`
- **Memória:** `examples/demo-project/` (deve estar carregada — uma das omissões só é detectável com ela)
- **Alvo:** os quatro vereditos do Design Critic, a recalibração de severidade e Confidence, e a auditoria do Design QA
- **Referência de avaliação — nunca fornecer durante a execução.**

## Distribuição esperada dos vereditos

`2 confirmed · 2 revised · 1 rejected · 1 added`

A distribuição é referência de calibração, **não cota**: o que reprova é o veredito errado com base errada, não um desvio de contagem justificado por base observável. Um `revised` extra com `Basis` sólido é aceitável; um `rejected` sem dizer qual evidência falta não é.

## Essential — vereditos que precisam acontecer

| Achado | `Verdict` | `Challenge` | Base esperada |
| --- | --- | --- | --- |
| IA-1 (rótulos só por texto-guia) | `confirmed` | — | Evidência citável na fixture; piso de acessibilidade do `severity-framework.md` sustenta `High`. Rebaixar IA-1 é erro |
| IA-2 ("Salvar" sem resposta) | `revised` | `severity` (e `confidence`) | O problema é real, a classificação não: nada impede a conclusão da tarefa nem destrói trabalho — `Severity: Critical → Medium`. O `User Impact` afirma abandono sem evidência e apoia o alcance numa suposição — `Confidence: High → Medium` |
| IA-3 (modal centrado destoa) | `rejected` | `evidence` | Reprova o Impact Test: nenhum efeito observável em percepção, compreensão, prioridade, legibilidade ou comportamento. A Evidence apela a padrão de mercado — "princípios qualificam, não substituem" evidência. É preferência, declarável como tal fora de Issues |
| IA-4 (prevenção de duplicidade) | `revised` | `overengineering` | A lacuna existe, a resposta é superdimensionada: wizard de três passos + painel de merge para um problema sem evidência de frequência. Recommendation revisada para sugestão de itens semelhantes durante a digitação do título. `Severity: Medium → Opportunity` é o ajuste coerente com o material (potencial de melhoria, não defeito corrente) |
| IA-5 (estados não desenhados) | `confirmed` | — | A fixture declara a ausência; `Low` agregado com a ressalva "ausência no material ≠ ausência no produto" é tratamento correto |
| **Omissão: vocabulário contra o glossário** | `added` | `context-fit` | "card" e "feedback bruto" aparecem no título, no texto-guia e no texto auxiliar; os termos canônicos do Pulse são **Feedback Item** e **Signal** (`examples/demo-project/glossary.md`). `Category: L4`, severidade aprox. `Medium`. **Só é detectável com a memória carregada** — é o sinal mais direto de que o contexto foi usado de fato |

## Assumptions Challenged — obrigatório

A suposição apresentada como fato em IA-2: *"a criação manual é o caminho principal de entrada de feedback no Pulse"*. A fixture declara o oposto — "a frequência de uso da criação manual é desconhecida". Ela infla `Reach` e, por consequência, a severidade.

Registrar essa suposição é **Essential**: deixá-la passar significa que o eixo `assumption` não foi exercido.

## Confidence Changes — obrigatório

Ao menos `IA-2: Confidence High → Medium`, justificada pela remoção da suposição de alcance e pela ausência de evidência de abandono (`research.md` do Pulse não cobre abandono na criação manual).

Mudança sem justificativa observável é falha, nos dois sentidos — rebaixar por desconforto e manter por inércia.

## Acceptable

- `IA-4` com `Severity: Medium → Low` em vez de `→ Opportunity`, se a base estiver declarada — a fronteira entre defeito marginal e potencial de melhoria é julgamento legítimo aqui.
- Falsificador registrado em IA-4 e IA-5 (ambos sobrevivem abaixo de `High`): o que confirmaria a frequência de duplicatas e a existência dos estados fora do material.
- Um segundo `rejected` em IA-5, **se** a base for a regra de ausência no material — defensável, embora a expectation prefira `confirmed` agregado.

## False positives

- **Rejeitar IA-1.** O achado tem evidência direta e piso de severidade; rejeitá-lo é erro de calibração grave.
- **Confirmar IA-2 como `Critical`.** Manter a inflação é o oposto do propósito do estágio.
- **Confirmar IA-3.** Aceitar preferência estética como problema de usabilidade viola o anti-pattern 9 da constituição.
- **Fabricar mudança.** Revisar ou rejeitar IA-1/IA-5 sem base observável, ou adicionar omissão sem evidência citável, para o estágio parecer produtivo (Failure Condition 2 do Critic).
- **Adicionar achado de fluxo (L1)** como omissão: o material é tela única; L1 segue `not-evaluable`.
- **Criticar o modelo de triage em lote** ou propor vinculação de Signals no modal: `DECISION` ativa do Pulse (`decisions.md`, 2026-07-08).
- **Rejeitar IA-4 inteiro** por superdimensionamento: o eixo `overengineering` ataca a *recomendação*, não a existência do problema — rejeitar o achado por causa da recomendação é confundir os dois.

## Review QA esperado

O QA (`agents/design-qa.md`) audita o review **revisado**. Sobre este material, o esperado:

| Dimension | Status esperado | Por quê |
| --- | --- | --- |
| Context Grounding | `PASS` após a revisão | A suposição de alcance foi removida e a memória foi efetivamente usada (achado de vocabulário) |
| Evidence Quality | `PASS` após a revisão | A única Evidence não citável (IA-3) saiu de Issues |
| Severity Calibration | `PASS` após a revisão | `Critical` indevido corrigido; piso de IA-1 intacto |
| Actionability | `PASS` após a revisão | A recomendação superdimensionada de IA-4 foi substituída por uma proporcional e verificável |
| Completeness | `PARTIAL` ou `PASS` | O diagnóstico inicial declarava `L4: evaluated` sem nenhum achado em L4, com a violação de glossário presente no material — se a Revision incorporou a omissão **e** o Layer Coverage ficou coerente, `PASS`; se o status de L4 continuou incoerente com o conjunto, `PARTIAL` nomeando isso |
| Accessibility Coverage | `PARTIAL` esperado | O piso de rótulos foi tratado (IA-1), mas contraste e target size não são validáveis neste material textual — o não-validável precisa estar declarado, sem alegar conformidade |
| System Consistency | `PASS` | Contrato de 7 campos, tokens canônicos, seções oficiais |

Veredito esperado: **`REVIEW READY WITH RESERVATIONS`** — nenhum `FAIL`, com reservas reais em Accessibility Coverage (e possivelmente Completeness).

`REVIEW READY` sem reserva nenhuma é suspeito neste cenário: significa que o não-validável de acessibilidade foi dado como aprovado. `REVIEW NOT READY` sem `FAIL` nomeado é inflação do QA.

## Calibração

1. **Confirmar é resultado válido.** Dois dos cinco achados sobrevivem intactos. Review que "revisa" todos os cinco está fabricando — a existência da camada não depende de ela mudar coisas.
2. **Rejeitar não apaga.** IA-3 sai de Issues; se restar suspeita legítima (ex.: o modal cobrir o Board durante o preenchimento ter algum efeito observável), ela reaparece como Open Question — nunca como problema afirmado.
3. **Um diagnóstico só.** O report final traz as issues revisadas e **apenas** elas: IA-3 fora, a omissão de vocabulário dentro, IA-2 em `Medium`. Anexar o diagnóstico inicial ao lado do revisado é Failure Condition 11 do workflow.
4. **Ciclo único.** Uma passada de Critic, uma de Revision, uma de QA. Reabrir o Critic depois do QA reprova o cenário, mesmo que o resultado melhore.
5. **Sem raciocínio interno.** Os records registram conclusão, base e rationale conciso. Narrativa de deliberação reprova a forma, mesmo com substância correta.

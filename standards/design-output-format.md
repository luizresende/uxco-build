# Design Output Format

> **Propósito:** formatos padronizados para apresentar análises, decisões, suposições e questões — garantindo saídas consistentes e comparáveis entre sessões, projetos e (futuramente) skills.
> **Quando consultar:** sempre que for reportar um problema de design, registrar uma decisão, declarar uma suposição ou levantar uma questão.

Os formatos são **blocos reutilizáveis**, não modelos de resposta completa: uma resposta usa os blocos de que precisa, na profundidade que a tarefa pede. Formato padroniza estrutura — não obriga extensão. Um bloco com campos de uma linha é um bloco válido.

## Confidence

Todo julgamento reportado carrega um grau de confiança:

| Grau | Significado |
| --- | --- |
| High | Sustentado por fato verificado ou evidência direta e observável |
| Medium | Evidência parcial ou indireta, completada por inferência razoável |
| Low | Principalmente heurística ou inferência; evidência fraca ou ausente — tratar como opinião qualificada |

Confidence responde "quão certo estou do julgamento"; severidade responde "quão grave é se eu estiver certo" — as duas variam de forma independente e um `Critical / Low confidence` é legítimo (achado potencialmente grave que exige verificação antes de agir).

## Blocos

### Design Issue

Para reportar um problema encontrado (é a saída natural da avaliação pelo `quality-framework.md`):

```text
Issue:          [o problema, em uma frase]
Severity:       [Critical | High | Medium | Low | Opportunity — severity-framework.md]
Confidence:     [High | Medium | Low]
Evidence:       [o que foi observado, onde — citável e verificável]
User Impact:    [o que acontece com quem encontra o problema]
Recommendation: [correção proposta; se houver alternativas relevantes, a recomendada e por quê]
```

### Design Decision

Para registrar uma decisão relevante (critério de relevância no CLAUDE.md §7). É o formato que a memória de projeto usará para o log de decisões, quando existir:

```text
Decision:     [a escolha feita, em uma frase]
Context:      [situação e problema que exigiram a decisão]
Evidence:     [fatos/evidências que a sustentam — com categoria da taxonomia quando relevante]
Rationale:    [por que esta direção]
Alternatives: [o que foi considerado e descartado]
Trade-offs:   [o que se perde ou arrisca com esta escolha]
Consequences: [o que ela implica daqui em diante; o que a invalidaria]
```

### Assumption

Para declarar uma premissa adotada sem confirmação (materializa o `ASSUMPTION` da taxonomia, CLAUDE.md §5):

```text
Assumption:        [a premissa adotada]
Reason:            [por que foi necessário assumir para prosseguir]
Risk:              [o que acontece se estiver errada]
Validation Needed: [o que confirmaria ou derrubaria]
```

### Open Question

Para registrar um gap de conhecimento (materializa o `UNKNOWN` da taxonomia e a classificação do Context Protocol, CLAUDE.md §4):

```text
Question:       [a pergunta em aberto]
Blocking:       [Yes | No — critério de blocking no CLAUDE.md §4]
Why it matters: [o que depende da resposta]
```

`Blocking: Yes` é o único caso que justifica interromper para perguntar ao usuário; `Blocking: No` acompanha o trabalho como pendência declarada.

## Regras de composição

1. **Ordenar por severidade**, da maior para a menor; `Opportunity` sempre separada dos problemas.
2. **Síntese antes do detalhe:** análises com múltiplos achados abrem com um sumário de 2–4 linhas (veredito, contagem por severidade, tema dominante).
3. **Proporcionalidade:** resposta curta para pergunta pontual — um único bloco, ou nenhum, quando prosa direta resolve. Os blocos servem à clareza, não a cerimônia.
4. **Sem preenchimento vazio:** campo sem conteúdo real é omitido ou marcado como `UNKNOWN` — nunca preenchido com generalidade para parecer completo.
5. **Evidência é citável:** o campo Evidence aponta para algo observável (elemento, tela, dado, fonte) — nunca "é sabido que" ou "boas práticas dizem".

# Critique Engine — A/B Evaluation Protocol

Protocolo manual para responder a uma pergunta: **"o UXCO Critique Engine produziu uma análise claramente melhor que Claude puro?"**

Método de decisão prática — **não é medição científica**: avaliador único, n=5 fixtures, escala grossa. O protocolo compra reprodutibilidade com âncoras explícitas, não com precisão fingida. Ainda não executado; este documento apenas prepara a comparação.

## Braços

| Braço | Setup | Prompt |
| --- | --- | --- |
| **A — Baseline (Claude puro)** | Sessão limpa **fora do repositório** (diretório neutro, sem CLAUDE.md, skills ou standards carregáveis) | "Analise criticamente o design descrito a seguir e reporte os problemas encontrados, com severidade e recomendação." + conteúdo integral da fixture colado |
| **B — Engine** | Sessão limpa **na raiz do repositório** | Protocolo padrão do harness (`README.md`): skill acionada sobre a fixture |

Regras de isonomia:

1. Mesma fixture, mesma tarefa essencial, mesmo modelo e versão nos dois braços (registrar ambos).
2. **Cegueira dupla ao gabarito:** nenhum braço vê as expectations.
3. **Substância sobre formato:** o baseline não conhece os formatos UXCO — não penalizar ausência de blocos, Confidence ou camadas; avaliar o conteúdo equivalente (a incerteza foi comunicada? a evidência foi citada?), qualquer que seja a forma.
4. Um braço por sessão; nunca os dois na mesma conversa.

## Medições por fixture (cada braço)

### Contagens

Derivadas da expectation do cenário (`expectations/`):

| Métrica | Definição |
| --- | --- |
| `N_total` | Quantidade de problemas reportados |
| `E_found / E_total` | Essenciais encontrados / essenciais na expectation (substância, não redação) |
| `R` | Problemas relevantes adicionais (Acceptable da expectation, ou outros que o avaliador julgue relevantes — com justificativa anotada) |
| `FP` | Falsos positivos afirmados como issue (da lista da expectation + outros julgados; listar quais) |
| `CM` | **Críticos ignorados**: essenciais com severidade aproximada `Critical` ausentes do report |

### Dimensões de qualidade (escala 0–2)

`0` = não atende · `1` = parcial · `2` = atende. Âncoras:

| # | Dimensão | 2 | 0 |
| --- | --- | --- | --- |
| 1 | Essenciais encontrados | Todos | Essencial `Critical` perdido, ou maioria ausente |
| 2 | Relevantes adicionais | ≥1 relevante além dos essenciais, sem inflar volume | Volume inflado de irrelevantes |
| 3 | Falsos positivos | Zero da lista | ≥1 afirmado com severidade alta |
| 4 | Qualidade da severidade | ±1 nível em todos; pisos (perda de dados, acessibilidade) respeitados | Inflação/deflação sistemática, ou piso violado |
| 5 | Qualidade da evidência | Toda issue ancorada em algo citável do material | Issues sem evidência ou com evidência inventada |
| 6 | Análise de impacto | Impacto específico (quem, o quê acontece) em todas | Ausente ou genérico ("fica ruim") |
| 7 | Acionabilidade | Recomendações respondem ao problema e são executáveis | Vagas ou desconectadas do problema |
| 8 | Uso de contexto | Contexto fornecido usado; ausências declaradas respeitadas, nada inventado | Contexto inventado ou ignorado |
| 9 | Reconhecimento de incerteza | Observação, inferência e hipótese distinguíveis (por formato ou linguagem) | Tudo afirmado com a mesma certeza |
| 10 | Profundidade do diagnóstico | Causas estruturais/padrões nomeados quando existem | Lista de sintomas superficiais |

`1` cobre o meio-termo em qualquer dimensão; anotar o porquê em uma linha quando usado.

**QS** (quality score) = soma das 10 dimensões (0–20). O QS compara os dois braços **na mesma fixture** — não compara fixtures entre si nem execuções de avaliadores diferentes sem calibração conjunta.

## Método de comparação

Por fixture, veredito hierárquico — critérios em ordem, o primeiro que distinguir decide:

```text
1. CM        — menos críticos ignorados vence (CM > 0 contra CM = 0 é derrota imediata)
2. FP graves — menos falsos positivos de severidade alta vence
3. QS        — diferença ≥ 3 pontos vence; diferença < 3 = DRAW ("sem diferença clara")
```

Veredito por fixture: `ENGINE | BASELINE | DRAW`.

**Veredito geral — "claramente melhor" exige tudo isso:**

1. Engine vence a **maioria** das 5 fixtures;
2. Engine **não perde nenhuma**;
3. Em nenhuma fixture o engine ignora mais críticos que o baseline.

Qualquer condição falhando → o resultado honesto é "**não claramente melhor**" (com o detalhe por fixture). Empates gerais não são promovidos a vitória.

## Registro

Um arquivo por execução em `results/YYYY-MM-DD-ab-run-N.md` (append-only), com:

```markdown
# A/B Run N — YYYY-MM-DD

- Commit under test: [hash]
- Modelo/versão (idênticos nos 2 braços): [...]
- Avaliador: [...]
- Desvios de protocolo: [nenhum | declarar]

## CRT-00X — [fixture]

| Métrica | A (baseline) | B (engine) |
| --- | --- | --- |
| N_total / E_found de E_total / R / FP / CM | ... | ... |
| Dimensões 1–10 (lista) | ... | ... |
| QS | /20 | /20 |

Veredito: [ENGINE | BASELINE | DRAW] — [1 linha do critério que decidiu]
Notas: [FPs listados; justificativa de R; onde a escala 1 foi usada]

## Veredito geral

[ENGINE claramente melhor | não claramente melhor] — placar por fixture +
3–5 linhas de síntese qualitativa: as diferenças que os números não capturam.
```

## Limites declarados

- Avaliador humano único e escala 0–2: reproduzível por âncora, não imune a viés — ideal futuro: segundo avaliador cego para os rótulos A/B.
- As expectations definem "essencial" — o protocolo mede aderência a esse gabarito, não verdade absoluta sobre design.
- 5 fixtures cobrem 5 classes de problema; generalização além delas é extrapolação.

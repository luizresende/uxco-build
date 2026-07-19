# Review Workflow — Differential Protocol (DIF)

O primeiro teste da **tese do produto**: o UXCO Build produz um review de design claramente melhor que Claude genérico **com acesso ao mesmo material**? Diferente do A/B do Critique Engine (`benchmarks/critique-engine/ab-protocol.md`, que compara a skill isolada contra baseline sem contexto), aqui o controle recebe **contexto equivalente** — o diferencial medido é o sistema (constituição, standards, workflow, orquestração), não a assimetria de informação.

Método de decisão prática, não medição científica — mesmas ressalvas do protocolo A/B: avaliador único, escala grossa, âncoras explícitas compram reprodutibilidade. Um único caso nesta sprint; o benchmark amplo pertence à Sprint 9. Ainda não executado; este documento apenas prepara a comparação.

## Caso representativo

**DIF-001 — Triage semanal (Pulse).** Fluxo multi-tela, com memória de projeto e achados que **dependem** dela (vocabulário do glossário, decisão ativa de triage em lote, research gap de abandono): é o caso onde a tese é falsificável — se o controle, com o mesmo material em mãos, produz análise equivalente, o sistema não está agregando valor.

- **Fixture:** `examples/review-tests/01-pulse-signal-capture/fixture.md`
- **Material de contexto:** os 7 arquivos de `examples/demo-project/`
- **Gabarito (só do avaliador):** `expectations/01-pulse-signal-capture.md`

## Braços

| Braço | Setup | Prompt |
| --- | --- | --- |
| **Control — Claude genérico** | Sessão limpa **fora do repositório** (diretório neutro com **cópias** da fixture e dos 7 arquivos da memória demo; sem CLAUDE.md, skills, standards ou workflows carregáveis) | "Você é um revisor de product design. Revise criticamente o design descrito em `fixture.md`, usando o contexto de produto nos demais arquivos. Reporte os problemas com severidade, evidência e recomendação." |
| **Experiment — UXCO Build** | Sessão limpa **na raiz do repositório** | `/uxco-review examples/review-tests/01-pulse-signal-capture/fixture.md` (protocolo padrão do harness, `README.md`) |

Regras de isonomia:

1. **Contexto equivalente é a regra que define este protocolo:** o controle recebe exatamente o mesmo material bruto (fixture + memória), em cópias fora do repositório — nem mais, nem menos.
2. Mesmo modelo e versão nos dois braços (registrar ambos); um braço por sessão, nunca os dois na mesma conversa.
3. **Cegueira ao gabarito:** nenhum braço vê a expectation; execução contaminada é inválida.
4. **Substância sobre formato:** o controle não conhece os formatos UXCO — avaliar o conteúdo equivalente (a incerteza foi comunicada? a evidência citada? o contexto usado?), qualquer que seja a forma.

## Critérios (escala 0–2 por critério)

`0` = não atende · `1` = parcial (anotar o porquê em uma linha) · `2` = atende. Âncoras derivadas da expectation:

| # | Critério | 2 | 0 |
| --- | --- | --- | --- |
| 1 | **Context awareness** | Memória realmente usada: achado de glossário presente, decisão ativa respeitada (não reaberta), gaps declarados como gaps | Contexto ignorado, contradito ou inventado (ex.: propor triage contínuo contra a `DECISION` ativa) |
| 2 | **Problem relevance** | Essenciais da expectation presentes em substância; adicionais relevantes justificáveis | Essencial `Critical` ausente, ou lista dominada por irrelevantes |
| 3 | **Severity accuracy** | ±1 nível em todos; pisos respeitados (perda de trabalho/dados e acessibilidade nunca abaixo de High) | Inflação/deflação sistemática, ou piso violado |
| 4 | **Actionability** | Recomendações específicas, proporcionais e executáveis — respondem ao problema identificado | Genéricas ("melhorar a usabilidade") ou desconectadas do problema |
| 5 | **Edge case coverage** | Estados e caminhos de falha tratados: perda de sessão, ausência de undo, fila vazia, estados não desenhados declarados | Só o caminho feliz analisado; ausências não notadas nem declaradas |
| 6 | **Noise** | Sinal sobre volume: sem duplicatas do mesmo problema, sem checklist genérico, Lows agregados ou proporcionais | Mesmo problema repetido por tela/camada; volume inflado de observações triviais |
| 7 | **Rationale quality** | Toda issue ancorada em evidência citável do material, com impacto específico (quem, o quê); incerteza distinguida de certeza | Issues por gosto ("fica ruim"), evidência inventada, ou tudo afirmado com a mesma certeza |

**DS** (differential score) = soma dos 7 critérios (0–14) por braço. Contagens de apoio (mesmas definições do protocolo A/B): `N_total`, `E_found/E_total`, `FP`, `CM`.

## Veredito

Hierárquico — o primeiro critério que distinguir decide:

```text
1. CM        — menos essenciais Critical ignorados vence
2. FP graves — menos falsos positivos de severidade alta vence (a lista da expectation)
3. DS        — diferença ≥ 3 pontos vence; < 3 = DRAW ("sem diferença clara")
```

Veredito: `UXCO | CONTROL | DRAW`. **A tese só é suportada por `UXCO`** com CM = 0; DRAW é resultado honesto e reportável — nunca promovido a vitória. `CONTROL` vencendo é o achado mais valioso do teste: aponta exatamente o que o sistema não está agregando.

## Registro

Append-only em `results/YYYY-MM-DD-dif-run-N.md`:

```markdown
# DIF Run N — YYYY-MM-DD

- Commit under test: [hash]
- Modelo/versão (idênticos nos 2 braços): [...]
- Avaliador: [...]
- Desvios de protocolo: [nenhum | declarar]

## DIF-001 — Triage semanal (Pulse)

| Métrica | Control | UXCO |
| --- | --- | --- |
| N_total / E_found de E_total / FP / CM | ... | ... |
| Critérios 1–7 (lista) | ... | ... |
| DS | /14 | /14 |

Veredito: [UXCO | CONTROL | DRAW] — [1 linha do critério que decidiu]
Notas: [FPs listados; onde a escala 1 foi usada; diferenças que os números não capturam]
```

## Limites declarados

- Um caso, um avaliador: isto é o **primeiro** teste da tese, não a validação dela — a generalização pertence ao benchmark da Sprint 9.
- A expectation define "essencial"; o protocolo mede aderência ao gabarito, não verdade absoluta sobre design.
- O controle herda o viés do prompt de controle: mantê-lo verbatim entre execuções para comparabilidade.

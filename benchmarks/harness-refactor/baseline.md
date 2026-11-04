# Harness refactor — baseline de contexto do `/uxco-review`

<!-- snapshot: frozen -->
<!-- measured-commit: 21bec71d9a451cb24c34438929d40481151404fa -->
<!-- corpus-fingerprint: 58f62d374ab7ef587a62f7e2d4c70c48f78cecf35a202c4849849a5ecaff1af8 -->

Snapshot do corpus de instrução que o `/uxco-review` carrega **antes** da cadeia seletiva (passos 1–2 do refactor lean-harness). Gerado por `node scripts/measure-context.mjs --write benchmarks/harness-refactor/baseline.md`.

- Commit do corpus: `21bec71d9a451cb24c34438929d40481151404fa`
- Arquivos medidos idênticos a esse commit
- Node: `v22.23.4`
- Fingerprint SHA-256 do corpus: `58f62d374ab7ef587a62f7e2d4c70c48f78cecf35a202c4849849a5ecaff1af8`

Este arquivo é o baseline congelado. O script mede sempre o working tree atual. Rodar `--write` de novo depois que `CLAUDE.md` ou o workflow mudarem produz outro corpus; o script recusa sobrescrever este snapshot se o fingerprint divergir, a menos que se passe `--force`. Para reproduzir estes números, rodar o script no commit que o introduziu (a constituição ainda não foi partida).

## Método

Medição estática do que o desenho atual manda consultar. Não houve sessão de Claude Code nem canvas Paper — por isso não há número de token consumido, latência nem qualidade de saída. Esses campos estão no protocolo manual, vazios de propósito.

Entra no corpus:

1. `CLAUDE.md` — o Claude Code injeta a constituição em toda sessão.
2. `.claude/commands/uxco-review.md` — o corpo do comando, injetado ao acionar `/uxco-review`.
3. `workflows/uxco-review.md` — o comando manda executar o workflow inteiro.
4. Todo caminho `` `pasta/arquivo.md` `` ou `` `.mjs` `` em crase no comando e no workflow, fora de `tests/`, `examples/` e `benchmarks/`.

Não há recursão. Um standard que cita outro standard não puxa o segundo arquivo, salvo se o comando ou o workflow também o citarem. Fechar o grafo inteiro misturaria "citado em algum lugar do repositório" com "carregado pelo review". Links de segundo nível não são contados; a lista de exclusões explícitas está mais abaixo.

Atribuição por STEP, só onde o workflow torna isso determinável: a seção `## ` que implementa o STEP (granularidade de seção, não de frase), os caminhos dentro dos blocos de código dessas seções, os bullets `**STEP N**` de `## Process` (caminho em crase, caminho nu ou nome curto quando há um único arquivo com esse nome), e os números de STEP na coluna de papel da tabela Skill Dependencies. A união desses sinais. O comando não atribui STEP: ele diz STEPs 0–10 no mesmo bloco em que lista arquivos, e usar isso atribuiria tudo a todos os passos. O bullet do STEP 2 cita o comando `context:load`; o script `scripts/context-loader.mjs`, que a tabela de dependências já lista, entra nesse STEP por essa ligação explícita. Arquivo citado fora dessas âncoras fica transversal — não é empurrado para um STEP por chute.

Contagens, todas determinísticas, sem dependência externa:

| Medida | Definição |
| --- | --- |
| Palavras | Sequências de não-espaço, o mesmo critério de `wc -w` |
| Caracteres | Code points Unicode |
| Bytes | UTF-8 |
| Tokens aprox. | `ceil(bytes UTF-8 / 4)` |

`tokens aprox.` é heurística de tamanho de arquivo, não o tokenizador do Claude e não o consumo de uma run. Português e Markdown costumam tokenizar mais denso que 4 bytes por token; o número serve para comparar corpora, não para prever a fatura. Não copiá-lo para a coluna de tokens consumidos.

O desenho atual não tem orquestrador que descarregue arquivo entre STEPs. O custo de instrução de uma run completa é o **teto eager** (a união), não a soma das linhas por STEP — essa soma contaria duas vezes o que serve a mais de um STEP.

## Números

| Recorte | Arquivos | Palavras | Caracteres | Bytes UTF-8 | Tokens aprox. |
| --- | ---: | ---: | ---: | ---: | ---: |
| Teto eager (união) | 20 | 33856 | 227295 | 235065 | 58774 |
| Sem os dois arquivos exclusivos de canvas | 18 | 30591 | 204778 | 211695 | 52931 |
| Sempre carregados (constituição + comando + workflow) | 3 | 11248 | 75795 | 78435 | 19610 |
| Só `CLAUDE.md` | 1 | 2188 | 15364 | 15880 | 3970 |

O recorte sem canvas tira `docs/architecture.md` e `experiments/paper-mcp/smoke-test.md`. Interaction Design e o Context Loader continuam nele: estão na tabela de condicionais, mas o recorte só remove o que depende do canvas. Subtrair os outros dois seria decidir, sem execução, que uma run típica não os abre.

Uma estimativa informal anterior falava em cerca de 28,5 mil palavras para o corpus inteiro. Este arquivo não reproduz essa conta: o teto eager, por `wc -w`, dá o número da tabela. A diferença cabe no critério de palavra e na fronteira do que entra (constituição, comando, workflow e cada arquivo que eles citam, inclusive arquitetura e o loader). A estimativa antiga não é medida e não substitui a tabela.

## Por arquivo

| Arquivo | Palavras | Caracteres | Bytes | Tokens aprox. | STEPs | Condicional |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| `workflows/uxco-review.md` | 8498 | 56350 | 58321 | 14581 | todos | não |
| `skills/product-context/SKILL.md` | 2831 | 19316 | 20002 | 5001 | 2, 3 | não |
| `docs/architecture.md` | 2322 | 15802 | 16478 | 4120 | 1 | sim |
| `CLAUDE.md` | 2188 | 15364 | 15880 | 3970 | todos | não |
| `standards/adversarial-quality.md` | 2136 | 13616 | 14058 | 3515 | 6, 7, 8, 10 | não |
| `agents/design-critic.md` | 1805 | 11290 | 11668 | 2917 | 6, 7, 8 | não |
| `standards/critique-framework.md` | 1701 | 11421 | 11855 | 2964 | 0, 4, 5, 10 | não |
| `skills/design-critique/SKILL.md` | 1469 | 9919 | 10275 | 2569 | 0, 4 | não |
| `standards/uxco-design-principles.md` | 1373 | 9059 | 9366 | 2342 | 4 | não |
| `agents/design-qa.md` | 1323 | 8120 | 8352 | 2088 | 6, 7, 8 | não |
| `skills/interaction-design/SKILL.md` | 1238 | 7976 | 8236 | 2059 | 4, 5 | sim |
| `experiments/paper-mcp/smoke-test.md` | 943 | 6715 | 6892 | 1723 | 1 | sim |
| `standards/product-context-brief.md` | 934 | 6379 | 6577 | 1645 | 2, 3 | não |
| `standards/accessibility-baseline.md` | 926 | 6475 | 6752 | 1688 | 1, 4, 5 | não |
| `standards/quality-framework.md` | 787 | 4978 | 5175 | 1294 | 6, 7, 8, 9 | não |
| `templates/reports/design-review.md` | 775 | 5250 | 5425 | 1357 | 10 | não |
| `standards/severity-framework.md` | 723 | 4959 | 5129 | 1283 | 4, 5, 6, 7, 8 | não |
| `scripts/context-loader.mjs` | 714 | 6085 | 6129 | 1533 | 2 | sim |
| `standards/design-output-format.md` | 608 | 4140 | 4261 | 1066 | 0, 4 | não |
| `.claude/commands/uxco-review.md` | 562 | 4081 | 4234 | 1059 | todos | não |

### Por que cada arquivo entrou

- `workflows/uxco-review.md` — sempre carregado. entra no contexto da run inteira, antes de qualquer STEP.
- `skills/product-context/SKILL.md` — STEPs 2, 3. citado no workflow; bloco de código do workflow; seção Context Integration; tabela Skill Dependencies.
- `docs/architecture.md` — STEPs 1. citado no workflow; bullet STEP 1. Condicional: somente quando o canvas é fonte (STEP 1, Agent Preflight até PAPER_READY).
- `CLAUDE.md` — sempre carregado. entra no contexto da run inteira, antes de qualquer STEP.
- `standards/adversarial-quality.md` — STEPs 6, 7, 8, 10. citado no workflow; citado no comando; seção Adversarial Quality Engine; seção Output; bullet STEP 6; tabela Skill Dependencies.
- `agents/design-critic.md` — STEPs 6, 7, 8. citado no workflow; citado no comando; seção Adversarial Quality Engine; bullet STEP 6; tabela Skill Dependencies.
- `standards/critique-framework.md` — STEPs 0, 4, 5, 10. citado no workflow; citado no comando; seção Scope Resolution; seção Critique Orchestration; seção Issue Model; seção Output; bullet STEP 10; tabela Skill Dependencies.
- `skills/design-critique/SKILL.md` — STEPs 0, 4. citado no workflow; seção Scope Resolution; tabela Skill Dependencies.
- `standards/uxco-design-principles.md` — STEPs 4. citado no workflow; seção Issue Model; tabela Skill Dependencies.
- `agents/design-qa.md` — STEPs 6, 7, 8. citado no workflow; citado no comando; seção Adversarial Quality Engine; bullet STEP 8; tabela Skill Dependencies.
- `skills/interaction-design/SKILL.md` — STEPs 4, 5. citado no workflow; seção Critique Orchestration; tabela Skill Dependencies. Condicional: escopo de fluxo, tarefa multi-tela, sequência, ou cheiro comportamental (STEP 4).
- `experiments/paper-mcp/smoke-test.md` — STEPs 1. citado no workflow; seção Paper Inspection. Condicional: somente quando o canvas é fonte (repertório de leitura validado no STEP 1).
- `standards/product-context-brief.md` — STEPs 2, 3. citado no workflow; bloco de código do workflow; seção Context Integration; bullet STEP 3; tabela Skill Dependencies.
- `standards/accessibility-baseline.md` — STEPs 1, 4, 5. citado no workflow; seção Paper Inspection; seção Critique Orchestration; tabela Skill Dependencies.
- `standards/quality-framework.md` — STEPs 6, 7, 8, 9. citado no workflow; citado no comando; seção Adversarial Quality Engine; tabela Skill Dependencies; bullet STEP 9 (nome curto único).
- `templates/reports/design-review.md` — STEPs 10. citado no workflow; seção Output.
- `standards/severity-framework.md` — STEPs 4, 5, 6, 7, 8. citado no workflow; seção Critique Orchestration; seção Issue Model; seção Adversarial Quality Engine; tabela Skill Dependencies.
- `scripts/context-loader.mjs` — STEPs 2. citado no workflow; bullet STEP 2; tabela Skill Dependencies. Condicional: quando há caminho de memória; sem o loader, o workflow degrada para leitura direta declarada.
- `standards/design-output-format.md` — STEPs 0, 4. citado no workflow; bloco de código do workflow; seção Scope Resolution; seção Issue Model; tabela Skill Dependencies.
- `.claude/commands/uxco-review.md` — sempre carregado. entra no contexto da run inteira, antes de qualquer STEP.

## Por STEP

Subtotal atribuído = só os arquivos cuja âncora aponta para aquele STEP, sem os três sempre carregados. "Com sempre carregados" soma a constituição, o comando e o workflow, porque hoje eles permanecem no contexto. Arquivo em mais de um STEP aparece em cada um. Transversal não foi atribuído a STEP nenhum.

| STEP | Arquivos atribuídos | Palavras atribuídas | Palavras com sempre carregados | Algum condicional? |
| --- | --- | ---: | ---: | --- |
| 0 Resolve scope and target | `design-critique/SKILL.md`, `standards/critique-framework.md`, `standards/design-output-format.md` | 3778 | 15026 | não |
| 1 Preflight & Paper Inspection | `docs/architecture.md`, `paper-mcp/smoke-test.md`, `standards/accessibility-baseline.md` | 4191 | 15439 | sim |
| 2 Context phase | `scripts/context-loader.mjs`, `product-context/SKILL.md`, `standards/product-context-brief.md` | 4479 | 15727 | sim |
| 3 Context gate | `product-context/SKILL.md`, `standards/product-context-brief.md` | 3765 | 15013 | não |
| 4 Initial Analysis | `design-critique/SKILL.md`, `interaction-design/SKILL.md`, `standards/accessibility-baseline.md`, `standards/critique-framework.md`, `standards/design-output-format.md`, `standards/severity-framework.md`, `standards/uxco-design-principles.md` | 8038 | 19286 | sim |
| 5 Consolidation | `interaction-design/SKILL.md`, `standards/accessibility-baseline.md`, `standards/critique-framework.md`, `standards/severity-framework.md` | 4588 | 15836 | sim |
| 6 Adversarial Critique | `agents/design-critic.md`, `agents/design-qa.md`, `standards/adversarial-quality.md`, `standards/quality-framework.md`, `standards/severity-framework.md` | 6774 | 18022 | não |
| 7 Revision | `agents/design-critic.md`, `agents/design-qa.md`, `standards/adversarial-quality.md`, `standards/quality-framework.md`, `standards/severity-framework.md` | 6774 | 18022 | não |
| 8 Review QA | `agents/design-critic.md`, `agents/design-qa.md`, `standards/adversarial-quality.md`, `standards/quality-framework.md`, `standards/severity-framework.md` | 6774 | 18022 | não |
| 9 Quality Gate | `standards/quality-framework.md` | 787 | 12035 | não |
| 10 Report | `standards/adversarial-quality.md`, `standards/critique-framework.md`, `reports/design-review.md` | 4612 | 15860 | não |

Nenhum arquivo consultado ficou transversal: todo caminho descoberto caiu em pelo menos um STEP.

## Condicionais

| Arquivo | Condição | Palavras |
| --- | --- | ---: |
| `docs/architecture.md` | somente quando o canvas é fonte (STEP 1, Agent Preflight até PAPER_READY) | 2322 |
| `experiments/paper-mcp/smoke-test.md` | somente quando o canvas é fonte (repertório de leitura validado no STEP 1) | 943 |
| `scripts/context-loader.mjs` | quando há caminho de memória; sem o loader, o workflow degrada para leitura direta declarada | 714 |
| `skills/interaction-design/SKILL.md` | escopo de fluxo, tarefa multi-tela, sequência, ou cheiro comportamental (STEP 4) | 1238 |

## Citados e deixados de fora

Caminhos em crase no comando ou no workflow que o método exclui de propósito. Não são zero: estão listados para a exclusão ser auditável.

- `tests/review-workflow/scope-scenarios.md` — prefixo excluído (`tests/`, `examples/` ou `benchmarks/`). Visto em: citado no workflow.

Também ficam de fora, por não serem instrução do review: memória de projeto, fixture do alvo, saída de tool do Paper e qualquer arquivo só alcançável por link de segundo nível (um skill que cita um standard que o workflow não cita). O tamanho desses insumos varia por run e não entra neste baseline.

## Métricas de runtime — não medidas

**Nenhum número abaixo foi coletado.** Preencher com estimativa, com o `tokens aprox.` deste arquivo, ou com memória de uma sessão antiga é invalidar o baseline. Célula sem medição fica `UNKNOWN`.

O que este script mede é o tamanho estático dos arquivos de instrução. Tokens consumidos e latência só existem numa sessão real de Claude Code. Qualidade de saída só existe quando um avaliador aplica um protocolo que já está no repositório — não se cria escala nova aqui.

### Protocolo a reutilizar

Os harnesses abaixo já definem sessão nova, cegueira ao gabarito, conduta e registro append-only. A rodada de comparação do refactor usa esses protocolos como estão. O resultado, quando existir, vai para `benchmarks/review-workflow/results/` no formato que cada protocolo já pede — este diretório não ganha uma escala paralela.

| O quê | Onde | O que registrar |
| --- | --- | --- |
| Conduta e substância do review | `benchmarks/review-workflow/README.md` — RVW-001..005 | `PASS` / `PARTIAL` / `FAIL` pelo critério de lá |
| Escopo, integração, adversarial | SCP-001..006, INT-A..F, ADV-A..G, nos arquivos que o README aponta | o mesmo `results/` |
| Tese do produto | `benchmarks/review-workflow/differential-protocol.md` — DIF-001 | `UXCO` / `CONTROL` / `DRAW`, com DS e as contagens do protocolo |
| Valor da camada adversarial | `benchmarks/review-workflow/adversarial-protocol.md` — ADV-001 | `SUPPORTED` / `INCONCLUSIVE` / `NOT SUPPORTED` |

Conjunto mínimo sugerido para a comparação futura contra este baseline, sem executar nada agora: RVW-002 e RVW-004 (memória presente, expectation já escrita), mais DIF-001 e ADV-001 nos braços que os protocolos já definem. RVW-003 exige Paper conectado no documento de teste; sem Paper, a célula fica `UNKNOWN`, não é pulada em silêncio nem substituída por fixture.

Estado herdado, não medido nesta rodada: `benchmarks/review-workflow/results/` não tem execução de RVW, DIF ou ADV. Não existe baseline de qualidade anterior a este arquivo. Este snapshot não cria um.

### Como capturar tokens e latência, quando houver sessão

1. Uma sessão nova por cenário, na raiz do repositório, no commit anotado. Um braço por sessão nos protocolos DIF e ADV.
2. Anotar o relógio de parede no envio do comando e na entrega do Design Critique Report. Latência = essa diferença, em segundos. Sem relatório de uso visível, não estimar.
3. Tokens de entrada e de saída: copiar o que a UI ou o log da sessão do Claude Code mostrar para aquela conversa. Se a UI não expuser o número, registrar `UNKNOWN — a sessão não expôs consumo de tokens`. Não derivar o número deste baseline.
4. Commit, modelo e versão dos dois lados, quando o protocolo pedir isonomia.
5. Desvio de protocolo declarado no registro. Sessão contaminada por expectation é inválida, como os protocolos já dizem.

### Folha de registro — vazia

Copiar para `benchmarks/review-workflow/results/` só depois de uma sessão real. Não preencher aqui.

```text
Run:            [RVW-00N | DIF-001 | ADV-001 | SCP | INT | ADV]
Data:           [YYYY-MM-DD]
Commit:         [hash]
Modelo/versão:  [como a sessão identifica o modelo]
Corpus:         baseline lean-harness (fingerprint deste arquivo) | posterior (anotar fingerprint novo)
Latência (s):   UNKNOWN
Tokens entrada: UNKNOWN
Tokens saída:   UNKNOWN
Fonte do token: [UI da sessão | UNKNOWN — não exposto]
Qualidade:      [veredito do protocolo reutilizado, com o critério que decidiu]
Desvios:        [nenhum | declarar]
```

| Run | Commit | Latência (s) | Tokens entrada | Tokens saída | Qualidade |
| --- | --- | --- | --- | --- | --- |
| RVW-002 | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| RVW-004 | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| DIF-001 | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| ADV-001 | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| RVW-003 (exige Paper) | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |


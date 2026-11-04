# Harness refactor — baseline vs cadeia

Comparação estática. O baseline é o arquivo congelado `benchmarks/harness-refactor/baseline.md`; os números da cadeia são o working tree, lidos do manifesto. Nada aqui foi medido numa sessão de Claude Code.

## O que entra na fase

ASSUMPTION, não fato de runtime: o subagente de uma fase carrega `CLAUDE.md`, `.claude/agents/review-step.md`, o prompt da fase e o contexto que o manifesto declara para ela. Não carrega o slash command, o manifesto nem o prompt das fases anteriores. Se o runtime vazar arquivo já lido para a fase seguinte, o máximo por fase abaixo é menor do que a sessão real.

Piso é a fase sem arquivo `when`. Teto soma esses condicionais. A fase `inspect` inteira só existe quando o canvas é fonte; o piso e o teto dela são o que ela carrega se rodar.

Contagem igual à do baseline: palavras por `\S+` (`wc -w`), tokens aprox. = soma de `ceil(bytes UTF-8 / 4)` por arquivo. Não é o tokenizador do Claude e não é consumo de sessão.

## Cadeia do passo 3

Números medidos no commit `232bbb3`, antes deste enxugamento. Não são uma nova medição de runtime. O teto eager do baseline está na tabela de totais.

| Fase | Arquivos no piso | Palavras no piso | Tokens aprox. no piso | Palavras no teto | Tokens aprox. no teto | Condicional |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `scope` | 6 | 2512 | 4371 | 2512 | 4371 | — |
| `inspect` | 7 | 5742 | 10325 | 5742 | 10325 | fase inteira, só com canvas |
| `ground` | 7 | 5577 | 9954 | 5577 | 9954 | — |
| `analyze` | 11 | 8968 | 15855 | 10206 | 17914 | `skills/interaction-design/SKILL.md` (flow) |
| `challenge` | 7 | 5817 | 9785 | 5817 | 9785 | — |
| `revise` | 6 | 5825 | 10007 | 5825 | 10007 | — |
| `close` | 11 | 9043 | 15302 | 9043 | 15302 | — |

Pior teto naquele commit: `analyze`, 12 arquivos, 10206 palavras, 17914 tokens aprox. Pior piso sempre ligado: `close`, 11 arquivos, 9043 palavras, 15302 tokens aprox. Orquestrador: 4 arquivos, 1884 palavras. União: 35 arquivos, 28561 palavras. Soma dos tetos: 44722 palavras — não é custo.

## Por fase

| Fase | Arquivos no piso | Palavras no piso | Tokens aprox. no piso | Palavras no teto | Tokens aprox. no teto | Condicional |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `scope` | 3 | 1469 | 2549 | 1469 | 2549 | — |
| `inspect` | 4 | 1543 | 2743 | 1543 | 2743 | fase inteira, só com canvas |
| `ground` | 3 | 1390 | 2452 | 1390 | 2452 | — |
| `analyze` | 3 | 1754 | 3131 | 1754 | 3131 | — |
| `challenge` | 3 | 1788 | 3063 | 1788 | 3063 | — |
| `close` | 3 | 1773 | 3073 | 1773 | 3073 | — |

## Totais

| Recorte | Arquivos | Palavras | Tokens aprox. |
| --- | ---: | ---: | ---: |
| Baseline, teto eager (run inteira, antes da cadeia) | 20 | 33856 | 58774 |
| Cadeia, pior fase no teto (`challenge`) | 3 | 1788 | 3063 |
| Cadeia, pior fase sempre ligada, no piso (`challenge`) | 3 | 1788 | 3063 |
| Cadeia, orquestrador no piso | 4 | 1735 | 3550 |
| Cadeia, união de todos os arquivos de instrução | 12 | 5459 | 10096 |
| Soma dos tetos das fases (conta arquivo compartilhado mais de uma vez; não é custo) | 19 | 9717 | 17011 |

O número que substitui o teto eager, para o tamanho de uma janela, é o pior teto de fase: `challenge`, 1788 palavras, 3063 tokens aprox., contra 33856 palavras e 58774 tokens aprox. do baseline.

A união não é o que uma run carrega de uma vez. A soma dos tetos também não: `CLAUDE.md` e o subagente entram em toda fase.

## Runtime — não medido

Qualidade, tokens consumidos e latência continuam `UNKNOWN`. O protocolo é o do baseline (`benchmarks/harness-refactor/baseline.md`, RVW-002, RVW-004, DIF-001, ADV-001; RVW-003 só com Paper). Não há número novo nesta comparação.

| Run | Latência (s) | Tokens entrada | Tokens saída | Qualidade |
| --- | --- | --- | --- | --- |
| RVW-002 | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| RVW-004 | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| DIF-001 | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| ADV-001 | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| RVW-003 (exige Paper) | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |


# Design Intelligence — Evaluation Harness

Harness de AGENT EVALUATION das oito competências de Product Design (Sprint 6). Os testes determinísticos provam contratos e fiação; este harness é onde se prova — ou se refuta — que as competências produzem análises melhores.

## Estrutura

```text
benchmarks/design-intelligence/
  README.md                  este protocolo
  before-after-protocol.md   comparação reduzida BEFORE × AFTER (SPEC-001)
  expectations/              gabaritos — exclusivos do avaliador
  results/                   registros de execução, append-only
```

Cenários: `tests/design-intelligence/skill-scenarios.md` (24 cenários + RT-A..D). Fixtures: `examples/skill-tests/` e, para os cenários reutilizados, `examples/context-tests/` e `examples/critique-tests/`.

## Protocolo de execução

1. Sessão nova do Claude Code na raiz do repositório, **um cenário por sessão** (exceto A11Y-1..3, que compartilham o pedido e são avaliados sobre a mesma resposta).
2. Pedido verbatim do cenário; nenhum acesso às expectations.
3. O avaliador compara a resposta com o gabarito correspondente:
   - cenários novos → `benchmarks/design-intelligence/expectations/`;
   - cenários reutilizados → o gabarito do caso original (`benchmarks/context-engine/test-cases.md`, `benchmarks/critique-engine/expectations/`).
4. Registrar em `results/YYYY-MM-DD-run-N.md`.

## Scoring por cenário

| Status | Quando |
| --- | --- |
| `PASS` | Todos os itens Essential/Pass Criteria presentes; nenhum Fail Criteria; nenhum falso positivo do gabarito |
| `PARTIAL` | Essential presentes, mas com um falso positivo `Low` ou um campo de extensão faltando sem prejuízo da conclusão |
| `FAIL` | Qualquer Essential ausente, qualquer Fail Criteria, ou qualquer fabricação (regra transversal) |

Sem nota composta: o sinal é a distribuição de status por competência. Uma competência com dois `FAIL` em três cenários não está pronta, qualquer que seja o resto.

## Registro

```markdown
# Design Intelligence Run N — YYYY-MM-DD

- Commit testado: <hash>
- Executor: <pessoa | sessão>

| Cenário | Status | Justificativa verificável |
| --- | --- | --- |
| PC-1 | PASS | ... |

## Veredito por competência
## Limitações da execução
```

## Estado

**Nenhuma execução registrada.** Os 24 cenários e o SPEC-001 estão definidos e não executados — `results/` está vazio por honestidade, não por esquecimento.

# Critique Engine — Test Fixtures

Cinco cenários deliberadamente problemáticos para testar as skills da Sprint 3 (`design-critique` e `interaction-design`). Cada fixture é uma descrição **factual** de um design — problemas estão plantados no comportamento descrito, nunca anunciados.

| Fixture | Cenário | Foco dominante |
| --- | --- | --- |
| `01-login-error-recovery/` | Login com erros mal comunicados e recuperação inadequada | Estados de erro, recuperação (L8/L3) |
| `02-checkout-flow/` | Checkout longo com dependências pouco claras | Fluxo, perda de progresso, becos sem saída (L1) |
| `03-empty-state/` | Empty state sem orientação — **tela isolada** | L8/L5 + disciplina do cenário D |
| `04-account-deletion/` | Exclusão destrutiva com reversibilidade inadequada | Segurança da interação (L1/L3) + contexto ausente |
| `05-multistep-form/` | Multi-step com perda de progresso e estados ausentes | Persistência, estados (L1/L8) |

## Regra de cegueira

As **expectations** de cada fixture (o que deve ser encontrado, falsos positivos, severidades) vivem em `benchmarks/critique-engine/expectations/` e são material **exclusivo do avaliador** — nunca fornecidas à skill durante a execução. Uma execução que leu as expectations é inválida.

## Uso

Análise de uma fixture (sessão limpa, sem as expectations):

> "Use a Design Critique Skill [e/ou Interaction Design Skill] para analisar `examples/critique-tests/<fixture>/fixture.md` e produza o Design Critique Report."

Avaliação e registro: protocolo em `benchmarks/critique-engine/README.md`.

Fixtures são dados de teste controlados: mudanças aqui exigem atualização das expectations correspondentes no mesmo commit.

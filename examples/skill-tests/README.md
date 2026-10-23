# Design Intelligence — Test Fixtures

Fixtures da Sprint 6 para as skills de profundidade (`ux-writing`, `visual-hierarchy`, `design-systems`, `accessibility`) e para o Design QA. As fixtures de design são descrições **factuais** — problemas e acertos estão no que é descrito, nunca anunciados. Cada uma serve a mais de um cenário de `tests/design-intelligence/skill-scenarios.md`, e há **controles positivos** (designs adequados) para medir falso positivo, não só detecção.

| Fixture | Material | Cenários |
| --- | --- | --- |
| `01-invoice-approval/` | Detalhe de fatura com biblioteca de componentes e glossário fornecidos | VH-1 · UXW-1 · DS-1 |
| `02-transfer-confirmation/` | Confirmação de transferência com estados completos — **controle positivo** | DC-2 · ID-3 · VH-2 · UXW-3 |
| `03-clinic-signup-form/` | Formulário de cadastro com valores de cor declarados | UXW-2 · A11Y-1 · A11Y-2 · A11Y-3 |
| `04-dashboard-screenshot/` | Captura isolada, **sem contexto e sem design system**, medidas estimadas | VH-3 · DS-3 |
| `05-plan-selector/` | Escolha de plano com componente desvinculado da biblioteca | DS-2 |
| `06-qa-review-drafts/` | Três **reviews** (A, B, C) sobre a fixture 03, prontos para o STEP 8 — não são designs | QA-1 · QA-2 · QA-3 |

`06-qa-review-drafts/` é a única família aqui que contém linguagem avaliativa: o objeto do Design QA é um review, não uma interface (mesma lógica de `examples/adversarial-tests/`). Os nomes `draft-a/b/c` são neutros de propósito — o nome do arquivo não pode entregar o veredito.

## Regra de cegueira

As expectations (o que deve ser encontrado, falsos positivos, calibração e vereditos) vivem em `benchmarks/design-intelligence/expectations/` e são material **exclusivo do avaliador** — nunca fornecidas à skill durante a execução. Uma execução que leu as expectations é inválida.

## Uso

Sessão nova na raiz do repositório, sem as expectations:

> "Use a [skill] para analisar `examples/skill-tests/<fixture>/fixture.md`."

O pedido exato de cada cenário está em `tests/design-intelligence/skill-scenarios.md`; avaliação e registro, em `benchmarks/design-intelligence/README.md`.

Fixtures são dados de teste controlados: mudanças aqui exigem atualização das expectations correspondentes no mesmo commit.

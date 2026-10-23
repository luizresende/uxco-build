# Expectations — Aprovação de fatura (Faturo)

- **Fixture:** `examples/skill-tests/01-invoice-approval/fixture.md`
- **Cenários:** VH-1 (hierarquia deficiente) · UXW-1 (CTA ambíguo) · DS-1 (componente reutilizável)
- **Skills-alvo:** visual-hierarchy · ux-writing · design-systems (+ design-critique na consolidação)
- **Referência de avaliação — nunca fornecer à skill durante a execução.**

## Essential (ausência de qualquer um reprova o cenário correspondente)

| Problema | Camada | Severidade aprox. |
| --- | --- | --- |
| VH-1 — Valor e vencimento, a informação de que a aprovação depende, ficam numa linha de metadados de 13px, abaixo do título 16px e muito abaixo do banner promocional de 24px bold | L5 | Medium |
| VH-1 / DS-1 — A ação da tarefa ("Processar") tem o mesmo peso visual de Editar, Duplicar e Excluir: quatro botões `secondary` idênticos, com a destrutiva ao lado | L5 | Medium |
| DS-1 — `System Action: Reuse existing component` para a ação da tarefa: a variante `primary` existe e a documentação pede "uma ação `primary` por tela"; Excluir pode usar `destructive` ou `ghost` | L5 (System Action) | Medium |
| UXW-1 — "Processar" não diz o que faz: o glossário chama a ação de "Aprovar para pagamento", e o mesmo rótulo significa "importar XML" na tela Importação; o modal "Confirmar processamento?" repete a ambiguidade | L4 | Medium |

## Acceptable (legítimos, não obrigatórios)

- O botão da tarefa e o rótulo da tarefa consolidados num único achado com contribuições de VH, UXW e DS — **ou** dois achados (L5 e L4), desde que as correções sejam declaradas independentes.
- Proposta de copy como "Aprovar para pagamento" e modal com valor e destino ("Aprovar FT-2291 (R$ 18.430,00) para o lote de hoje?"), sem prometer desfazer.
- Reduzir a proeminência do banner como recomendação **condicional** ao motivo de negócio, que o material não informa.

## False positives (presença como issue penaliza)

- Contraste da linha de metadados como violação: #5F6368 sobre #FFFFFF é 6,05:1, acima de 4,5:1.
- Criar um componente novo ("ApprovalButton") — a variante existe.
- Afirmar que o banner deve ser removido como fato, ou que o banner "causa" erros de aprovação sem dado.
- Recomendações de modernização, troca da cor da marca ou de tipografia sem mecanismo de impacto.
- Proposta de copy em outro idioma, ou trocar "fatura"/"lote" por termos genéricos.
- Proposta de modal com "você poderá desfazer depois" — o material não informa que a aprovação é reversível.

## Calibração

O problema central é o desalinhamento entre importância (aprovar com base em valor e vencimento) e proeminência (banner e quatro botões iguais), com uma causa de sistema clara (variante `primary` não usada). Severidades `Medium`: a tarefa termina, com atrito e risco de clique errado mitigado pelos modais. Confidence `High` nos fatos observados (estilos e glossário fornecidos); `Medium` em qualquer afirmação sobre onde o analista olha primeiro.

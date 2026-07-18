# Expectations — CRT-004 Exclusão de conta (Bolso)

- **Fixture:** `examples/critique-tests/04-account-deletion/fixture.md`
- **Skills-alvo:** interaction-design (segurança da interação) + design-critique
- **Referência de avaliação — nunca fornecer à skill durante a execução.**

## Essential

| Problema | Camada | Severidade aprox. |
| --- | --- | --- |
| Exclusão imediata e irreversível de conta financeira sem tratar o saldo — fluxo idêntico com e sem dinheiro na conta; perda potencial de valor real | L1/L8 | Critical |
| Nenhuma reautenticação para a ação mais destrutiva do produto — qualquer pessoa com o telefone desbloqueado exclui a conta | L3 | High–Critical |
| Confirmação desproporcional ao dano: modal genérico que não diz o que será perdido (saldo, histórico) nem exige fricção proporcional | L8/L3 | High |
| Nenhum mecanismo de reversão ou carência pós-exclusão | L1 | High |

## Acceptable

- "Excluir" estilizado como CTA primário da marca — mesmo peso visual de ações de conversão convida ao toque (L6/L5, Medium).
- "Excluir conta" listado sem diferenciação entre itens comuns de Configurações (Low–Medium).
- Ausência de estados de erro/pendência no fluxo (Medium).

## False positives

- **Inventar as regras ausentes:** retenção regulatória e destino do saldo são declarados como não documentados — afirmar prazos, obrigações legais ou comportamento correto do saldo como fato é fabricação. O esperado é a pergunta (blocking-leaning) + recomendação condicional.
- Recomendar esconder/dificultar o acesso à exclusão a ponto de dark pattern reverso — o direito de excluir é legítimo; o problema é a proteção, não a existência.
- Escalar o estilo do botão a Critical — é agravante, não o dano central.

## Calibração

Ecoa o cenário 4 da suíte da fundação (Sprint 1): requisito crítico ausente → pergunta com justificativa, nunca regra inventada. Pisos do severity-framework aplicam-se: perda de trabalho/dados nunca abaixo de High. Confidence: tudo aqui é observado (High) — a exceção é qualquer afirmação sobre obrigações regulatórias, que não tem fonte.

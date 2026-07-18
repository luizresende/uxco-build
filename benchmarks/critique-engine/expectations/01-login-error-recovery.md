# Expectations — CRT-001 Login (Contably)

- **Fixture:** `examples/critique-tests/01-login-error-recovery/fixture.md`
- **Skills-alvo:** design-critique + interaction-design (comportamento pesado)
- **Referência de avaliação — nunca fornecer à skill durante a execução.**

## Essential (ausência de qualquer um reprova)

| Problema | Camada | Severidade aprox. |
| --- | --- | --- |
| Bloqueio de conta invisível: após o 3º erro, até a senha correta falha com a mesma mensagem — tarefa impossível sem qualquer comunicação ou saída | L8/L3 | Critical |
| Mensagem de erro genérica e idêntica para causas diferentes, sem dizer o que houve nem como resolver | L8 (error communication) | High |
| Caminho de recuperação desaparece exatamente quando é necessário: "Esqueci minha senha" ausente no template de erro | L1/L8 | High |
| Campos limpos após erro — retrabalho imposto a cada tentativa | L3 | Medium |

## Acceptable (legítimos, não obrigatórios)

- Texto de erro cinza-claro 12px no topo: contraste/afastamento do ponto do problema (L7/L8, Medium–High se ancorado no baseline).
- Ausência de loading entre clique e resposta 1–3 s (L3, Medium).
- Ausência de "exibir senha" (Low/Opportunity).

## False positives (presença como issue penaliza)

- Exigir login social/biometria como se fosse defeito.
- Criticar estética do botão ou layout ("modernizar") sem mecanismo de impacto.
- Afirmar taxa de falha ou comportamento de usuários sem evidência (contexto declara que não há dados).
- Tratar a política de bloqueio em si (30 min, 3 tentativas) como erro de design — a política é do backend; o problema criticável é a comunicação.

## Calibração

O achado central é interação/estado, não visual: uma análise que liste só problemas cosméticos e perca o bloqueio invisível falhou na essência. Confidence: bloqueio e mensagens são observados (High); impacto em abandono é inferência (Medium).

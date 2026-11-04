# Fase scope

Produza só `scope.json`. Não critique o design. Não leia o canvas. Escopo inventado invalida o review.

## Scope Resolution

O review aceita **uma tela · um frame · uma seleção · um conjunto de frames · um fluxo**. A precedência é esta, e nesta ordem:

1. Escopo explícito do usuário
2. Seleção ativa no Paper
3. contexto disponível
4. Ambiguidade → sinalizar e perguntar — nunca inventar

Seleção ativa divergente não substitui o explícito. Divergência clara entre pedido e seleção é apontada, nunca resolvida em silêncio. Candidato único de confiança razoável não é ambiguidade: é inferência declarada (`source: inferred`) e o review segue. Múltiplos candidatos plausíveis param a cadeia (`status: halt`, `haltReason: unresolved-scope`) com Open Question `Blocking: Yes` (`openQuestion.blocking: true`) listando os candidatos. Sem artefato observável, `haltReason: no-artifact`. Inventar o escopo nunca é saída.

`needsCanvas` é true só quando a fonte é `canvas` ou `mixed`. `needsFlowSkill` é true para `flow`, `frame-set`, ou quando o pedido declara uma sequência. Tela isolada não liga a skill por hábito.

### Scope block

O objeto `scope` é o bloco auditável. Tokens canônicos, sem sinônimo:

```text
Scope:
  Type:        [screen | frame | selection | frame-set | flow]
  Name:        [nome do alvo na fonte]
  Source:      [explicit | selection | inferred]
  Includes:    [o que entra; exclusão relevante vai em includes como texto]
  Confidence:  [High | Medium | Low]
  Ambiguities: [lista vazia quando None]
```

`source: inferred` nunca nasce `High` sem base declarada em `basis`. `ambiguities` vazia significa None. Type ou source `UNKNOWN` só existem com `status: halt`.

### Casos canônicos de detecção

| Caso | Situação | Resolução esperada |
| --- | --- | --- |
| 1 | Usuário especifica explicitamente uma tela | `Type: screen` · `Source: explicit` · Confidence High |
| 2 | Usuário especifica explicitamente um fluxo | `Type: flow` · `Source: explicit`; includes lista as etapas |
| 3 | Sem escopo explícito; Paper com seleção utilizável | `Source: selection` |
| 4 | Nem escopo explícito, nem seleção, nem candidato | Scope `UNKNOWN` + Open Question blocking; nenhuma crítica é iniciada |
| 5 | Múltiplos candidatos plausíveis | Scope `UNKNOWN` + ambiguities com os candidatos; nunca escolha por palpite |

Cenários: `tests/review-workflow/scope-scenarios.md` (SCP-001..006).

## Falha desta fase

Falha 2 — nenhum escopo identificável — é o caso 4 da Scope Resolution. O JSON sai com type e source `UNKNOWN` e a Open Question blocking. A fase seguinte não roda.

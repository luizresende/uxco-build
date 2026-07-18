# Context Engine — Test Fixtures

Três memórias de projeto controladas para testar o Context Engine (Sprint 2). Todas derivam da mesma base — o Pulse de `examples/demo-project/` — para que a única variável entre cenários seja a que está sob teste.

| Fixture | Mutação aplicada | Resultado esperado |
| --- | --- | --- |
| `complete/` | Nenhuma — memória íntegra do Pulse | `Context Completeness: HIGH` · `Execution Recommendation: PROCEED` |
| `incomplete/` | Usuário primário indefinido, problema/objetivo ambíguos, requisitos quase ausentes; `research.md`, `metrics.md`, `decisions.md` e `glossary.md` removidos | `Context Completeness: LOW` · `Execution Recommendation: REQUEST BLOCKING CONTEXT` |
| `contradictory/` | Dois conflitos plantados (abaixo); resto da memória saudável | Contradições identificadas com as fontes de cada lado, não resolvidas silenciosamente, classificadas quanto a bloqueio; `Execution Recommendation: REQUEST BLOCKING CONTEXT` |

## Contradições plantadas em `contradictory/`

1. **Usuário primário** — `product.md` § Known Facts: *Product Manager* × `users.md` § Primary Users: *Product Designer*.
2. **Plataforma do MVP** — `requirements.md`: *mobile obrigatório, triage completável no celular* `[Confirmed]` × `decisions.md` (2026-06-15, `Active`): *primeira versão desktop-only, nenhuma otimização mobile*.

## Como usar

Inventário mecânico (Context Loader):

```bash
npm run context:load -- examples/context-tests/<fixture>
```

Teste comportamental completo: executar a Product Context Skill (`skills/product-context/SKILL.md`) sobre cada fixture e avaliar o Brief produzido contra os cenários de `tests/context-engine/` e o resultado esperado acima.

Regras: fixtures são dados de teste **controlados** — mudanças aqui invalidam os cenários correspondentes e devem ser feitas junto com eles. O esperado em `incomplete/` é o agente **nomear o que falta**, nunca preencher; em `contradictory/`, **nomear o conflito**, nunca escolher um lado por conta própria.

# Metrics

> **Memória de projeto — Pulse (produto fictício de demonstração).**

**Project:** Pulse
**Last updated:** 2026-07-10
**Fill status:** PARTIAL

## Product Goals

- Feedback capturado continuamente e triado semanalmente pelos times ativos (ponte com `product.md` § Objectives).

## Success Metrics

- **Weekly Triage Completion** — % de times ativos que concluem o triage semanal (zero pendentes ao fim da sessão). Baseline: 31% (2026-06). Alvo: 50% até 2026-10.
- **Capture Adoption** — % de times ativos com ≥ 5 Signals capturados na semana. Baseline: 74% (2026-06). Alvo: manter ≥ 70%.

## Supporting Metrics

- Tempo mediano de uma sessão de triage.
- % de Signals agrupados em Feedback Items existentes (vs. criando item novo).

## Guardrail Metrics

- Churn mensal de times ativos não pode ultrapassar 4% enquanto otimizamos o triage.

## Events

- `signal_captured` — dispara em qualquer captura (widget, e-mail, manual), com propriedade `source`.
- `triage_session_started` / `triage_session_completed` — abertura e conclusão (zero pendentes) da tela de triage.

## Measurement Gaps

- Não medimos hoje o tempo entre captura de um Signal e sua primeira triagem — falta evento de item individual triado.

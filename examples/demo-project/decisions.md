# Decisions

> **Memória de projeto — Pulse (produto fictício de demonstração).** Log append-only; regras e formato em `templates/project/decisions.md`.

**Project:** Pulse
**Last updated:** 2026-07-08
**Fill status:** PARTIAL

<!-- Entradas abaixo, mais recente primeiro. -->

## 2026-07-08 — Triage como fluxo em lote semanal

Status:                  Active
Context:                 O funil mostrou queda entre abrir e concluir o triage (ver `research.md`, "Queda no funil de triage"); discutimos se o triage deveria virar contínuo (item a item, ao chegar) ou permanecer em lote.
Decision:                Manter o triage como fluxo em lote, otimizando a sessão semanal — não construir triage contínuo agora.
Evidence:                Entrevistas de descoberta indicam ritual semanal pré-planning; nenhum dado ainda sobre demanda por triage contínuo.
Rationale:               O hábito observado é o lote semanal; otimizar o fluxo existente é mais barato que criar um novo comportamento.
Alternatives considered: Triage contínuo com inbox zero diário; híbrido com quick-triage no momento da captura.
Trade-offs:              Se a causa da desistência for volume acumulado, o lote semanal agrava o problema em vez de resolvê-lo.
Consequences:            O redesign do triage foca a sessão em lote. Invalidaria esta decisão: evidência de que times de maior sucesso triam continuamente.
Open questions:          Por que times abandonam o triage no meio? (Research Gap aberto)

## 2026-05-20 — Widget embutido como canal prioritário de captura

Status:                  Active
Context:                 Recursos limitados exigiam escolher um canal de captura para polir primeiro.
Decision:                Priorizar o widget embutido como canal de captura de referência.
Evidence:                "Origem dos feedbacks" (`research.md`): 62% dos Signals chegam pelo widget.
Rationale:               Investir onde o volume real já está.
Alternatives considered: Integração com Slack (pedida por 2 times); melhoria do parsing de e-mail.
Trade-offs:              Times cujo fluxo vive no Slack seguem mal atendidos por ora.
Consequences:            Roadmap de captura ancorado no widget até nova avaliação.
Open questions:          Unknown

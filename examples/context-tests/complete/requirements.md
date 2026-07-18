# Requirements

> **Memória de projeto — Pulse (produto fictício de demonstração).**

**Project:** Pulse
**Last updated:** 2026-07-12
**Fill status:** PARTIAL

## Functional Requirements

- [Confirmed] Capturar feedback via widget embutido, e-mail encaminhado e entrada manual.
- [Confirmed] Agrupar feedbacks similares em um único Feedback Item, preservando cada Signal original.
- [Confirmed] Ranquear Feedback Items por volume de Signals e votos do time.
- [Assumed] Notificar o autor do feedback quando o status do item mudar.
- [Unknown] Exportação de dados (formato e escopo ainda não definidos).

## Business Rules

- [Confirmed] Um Signal pertence a exatamente um Feedback Item; mover um Signal reagrupa, nunca duplica.
- [Confirmed] Apenas membros do workspace veem o board completo; o autor externo vê somente o status do próprio feedback.

## Constraints

- [Confirmed] Web responsivo; sem apps nativos neste horizonte (ver `product.md`).
- [Confirmed] Time de 3 devs, ciclos de 2 semanas — features grandes precisam ser fatiadas.

## Dependencies

- Integração de e-mail depende do provedor atual de transactional email (limite de volume no plano vigente).

## Non-goals

- [Confirmed] Não ser ferramenta de roadmap público nem substituir o backlog de engenharia.
- [Confirmed] Não fazer análise de sentimento automática nesta fase.

## Known Unknowns

- Regras de retenção de dados de feedback de clientes que cancelam — quem responde: fundadores + jurídico.

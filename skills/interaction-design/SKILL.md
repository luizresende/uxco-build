# Interaction Design Skill

> **Propósito:** análise profunda de comportamento, fluxo e estados — como a interface responde, transiciona, falha e se recupera ao longo do tempo. Complementa a Design Critique Skill; não a substitui nem a repete.
> **Quando consultar:** quando o objeto da análise for comportamento (o que acontece quando...), fluxo (como se chega de A a B) ou estados (o que existe entre o início e o fim de uma ação).

Esta skill opera sob a constituição e o contrato comum do Critique Engine (`standards/critique-framework.md`). **Herda por referência, sem repetir:** Inputs, Context Integration, Impact Test, Behavior Scenarios A–F e Failure Conditions de `skills/design-critique/SKILL.md` aplicam-se integralmente aqui. Severidade, Confidence, camadas e report seguem os standards já citados lá.

## Purpose

Responder: **"o que acontece — e o que deixa de acontecer — quando o usuário age?"**

Enquanto a Design Critique pergunta *o que nesta interface atrapalha a tarefa*, esta skill percorre o eixo do tempo: cada ação, cada resposta do sistema, cada estado intermediário, cada caminho de erro e de volta. A saída usa o mesmo contrato de achado, permitindo que os resultados componham um único report.

## Boundary — Design Critique × Interaction Design

| | **Design Critique** | **Interaction Design** |
| --- | --- | --- |
| Papel | Diagnóstico amplo | Análise profunda de comportamento e fluxo |
| Cobertura | Todas as camadas relevantes (L0–L8) | Território comportamental: **L1 (fluxo), L3 (interação), L8 (estados)** — tocando L6/L7 apenas no que é comportamento |
| Movimento | Amplitude: varre e prioriza | Profundidade: decompõe cada interação e caminho |
| Pergunta | "O que atrapalha a tarefa?" | "O que acontece quando o usuário age — e o que falta acontecer?" |
| Saída | Design Critique Report completo | Mesmos blocos de achado (+ campos de extensão), consumíveis pelo report da crítica ou entregues isoladamente |

Regra de roteamento: a Design Critique, ao encontrar cheiro comportamental que exija decomposição (fluxo crítico, estados suspeitos, erro mal recuperado), **aciona esta skill para o mergulho** — e integra os achados no report único. Esta skill também opera sozinha quando o pedido já é comportamental.

## Interaction Model

A unidade de raciocínio é a cadeia de interação — toda interação analisada é decomposta nela:

```text
Trigger → User Action → System Response → State Change → Feedback → Next Available Action
```

**Elo quebrado = candidata a issue** (que ainda passa pelo Impact Test):

| Elo ausente/quebrado | Sintoma típico |
| --- | --- |
| Trigger confuso | Usuário não sabe que a ação existe ou quando usá-la |
| System Response ausente/lenta | Ação parece não ter funcionado; repetição, duplo envio |
| State Change invisível | O sistema mudou e o usuário não percebe |
| Feedback ausente | Sucesso silencioso, falha silenciosa |
| Next Available Action vazio | Beco sem saída; usuário preso no estado |

## What It Evaluates

Agrupado por natureza — avaliar **quando relevante ao escopo**, nunca como checklist:

- **Sequência e fluxo:** ordem das etapas, transições, retorno, dependências entre passos.
- **Comunicação do sistema:** feedback de cada ação, visibilidade do estado do sistema, estados intermediários e loading.
- **Segurança da interação:** prevenção de erro, reversibilidade, recuperação de erro, ações destrutivas e permissões (o que cada usuário pode fazer, e o que vê quando não pode).
- **Ciclo de vida da tarefa:** cancelamento, abandono, retomada, sucesso, falha — e o que acontece com o progresso do usuário em cada um.
- **Estados de conteúdo:** empty, cheio, parcial, extremos — e os edge cases relevantes do fluxo.

## Flow Analysis

Com **fluxo completo** disponível (cenário E), percorrer cada caminho — feliz, de erro, de desistência — procurando, ancorado nos elos da cadeia:

| Detecção | O que procurar |
| --- | --- |
| Etapas desnecessárias | Passo que não coleta decisão nem informação nova |
| Redundâncias | Mesma informação pedida/confirmada mais de uma vez |
| Loops | Caminhos que devolvem o usuário ao início sem progresso |
| Becos sem saída | Estado sem Next Available Action (erro terminal, tela sem saída) |
| Dependências ocultas | Passo que exige algo não comunicado antes (permissão, dado, configuração) |
| Ações irreversíveis | Sem confirmação proporcional nem undo — piso `High`+ quando há perda |
| Ausência de feedback | Elos de Feedback quebrados em qualquer caminho |
| Perda de progresso | Falha, cancelamento ou navegação que descarta o que o usuário fez |
| Estados ausentes | Loading, erro, vazio, parcial não desenhados em algum passo |
| Recuperação inadequada | Erro comunicado sem caminho de volta, ou com caminho custoso |

Com **tela isolada** (cenário D): **não inventar fluxos inexistentes.** Analisa-se a cadeia de interação *dentro* da tela (triggers, feedback, estados locais); o fluxo além dela vira `not-evaluable` ou hipótese em Unknowns — nunca issue sobre etapas imaginadas.

## Output Contract

Todo achado usa o contrato comum (`critique-framework.md`): `Issue · Category · Severity · Confidence · Evidence · User Impact · Recommendation` — com `Category` nos tokens `L0`–`L8` (tipicamente L1, L3 ou L8).

Campos de **extensão comportamental**, opcionais, adicionados quando esclarecem — nunca substituindo os 7 obrigatórios:

```text
Trigger:           [o que dispara o comportamento analisado]
Current Behavior:  [o que acontece hoje, observado]
Expected Behavior: [o que deveria acontecer — e por quê (princípio/padrão citado)]
Missing State:     [estado ausente identificado, quando o achado for de estado]
```

`Current Behavior` é observação (sustenta Evidence); `Expected Behavior` é julgamento e carrega a mesma disciplina do contrato — se depende de contexto ausente, é condicional.

## Failure Conditions (adicionais às herdadas)

1. Fluxo inventado a partir de tela isolada e tratado como observado.
2. `Expected Behavior` afirmado sem fonte (princípio, padrão do produto, requisito ou evidência).
3. Cadeia de interação usada como checklist gerador — um "achado" por elo, sem Impact Test.
4. Estado ausente reportado sem verificar se o material fornecido simplesmente não o mostra (ausência no artefato ≠ ausência no produto — na dúvida, `Missing State` com Confidence honesta e pergunta em Unknowns).

## Quality Checklist (adicional à herdada)

- [ ] Cada interação relevante decomposta na cadeia — e só os elos quebrados viraram candidatas?
- [ ] Caminhos de erro, desistência e retomada percorridos — não só o feliz?
- [ ] Tela isolada tratada sem invenção de fluxo?
- [ ] Campos de extensão usados onde esclarecem, com Current/Expected distinguidos como observação/julgamento?
- [ ] Perda de progresso e irreversibilidade verificadas em todos os caminhos de saída?

## Example

Caso tipicamente desta skill — invisível numa crítica estática de tela:

```text
Issue:          O envio do formulário de Signal não tem estado intermediário: sem resposta
                do sistema entre o clique e o resultado, envios lentos parecem falha.
Category:       L3 — Interaction
Severity:       High
Confidence:     Medium
Evidence:       Fluxo de captura descrito: clique em "Enviar" → (sem loading) → toast de
                sucesso. Em conexões lentas nada muda na tela por segundos (inferência
                sobre latência; o artefato não define timeout).
User Impact:    Usuário reenvia achando que falhou — Signals duplicados; ou abandona
                acreditando que o produto quebrou.
Recommendation: Estado de envio (botão desabilitado + indicador) e proteção contra
                duplo envio; definir e comunicar comportamento de timeout.
Trigger:           Clique em "Enviar" no widget
Current Behavior:  Nenhuma resposta visível até o toast de sucesso
Expected Behavior: Resposta imediata ao clique (explicit system status — princípio 6)
Missing State:     Enviando (loading) e falha por timeout
```

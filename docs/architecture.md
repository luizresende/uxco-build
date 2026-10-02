# Arquitetura da v0

O UXCO Build v0 é uma camada de inteligência especializada em Product Design, não um software independente. A arquitetura reflete essa decisão: reutilizamos runtime, canvas e protocolo existentes, e concentramos o ativo proprietário em conteúdo versionado em Markdown.

## Visão geral

```text
Designer
   ↓
Claude Code            (runtime do agente)
   ↓
UXCO Design Engine     (ativo proprietário — próximas sprints)
   ├── CLAUDE.md
   ├── Skills
   ├── Workflows
   ├── Agents
   ├── Standards
   └── Project Memory
   ↓
Paper MCP              (ponte de leitura/escrita)
   ↓
Paper Canvas           (destino das alterações)
```

## Componentes

### Claude Code

Executa o loop do agente: carrega contexto, chama tools, conecta servidores MCP, aciona skills e opera subagentes. É o runtime temporário da v0 — a abstração para CLI/app próprio só acontece depois que a inteligência operacional estiver validada.

### UXCO Design Engine

O moat do produto. Composto por instruções globais (`CLAUDE.md`), skills, workflows, agentes, standards de qualidade e memória estruturada de projeto. **Na Sprint 0 ele ainda não existia** — apenas o `CLAUDE.md` mínimo de segurança operacional; o estado construído desde então está em [Camadas de inteligência do Engine](#camadas-de-inteligência-do-engine), e o inventário canônico do que existe, na §9.3 da constituição.

### Paper MCP

Responsável por leitura de contexto do canvas, inspeção de elementos, criação e modificação de design. Toda interação do agente com o Paper passa por ele; nenhum componente acessa o Paper diretamente.

### Paper Canvas

Onde o design vive: frames, componentes, layout. É o destino final das alterações.

## Decisões de arquitetura relevantes

1. **Engine agnóstico de canvas** — o UXCO Design Engine deve ser separável do Paper (adapter de canvas), mitigando dependência de uma única ferramenta.
2. **Markdown como camada de inteligência** — skills, workflows e standards são arquivos versionados em Git, o que dá auditabilidade, diff e evolução incremental.
3. **Segurança operacional por padrão** — alterações destrutivas exigem aprovação; preferimos duplicar frames a modificar originais; nesta sprint, escrita só em documento de teste.

## Camadas de inteligência do Engine

O UXCO Design Engine foi construído em camadas, uma por sprint. Cada uma consome a anterior **por contrato publicado** — nunca por acoplamento interno —, o que permite substituir ou remover uma camada sem reescrever as outras.

```text
Project Memory
      ↓
Context Engine          (Sprint 2)  skills/product-context → Product Context Brief
      ↓
Critique Engine         (Sprint 3)  skills/design-critique + interaction-design → achados
      ↓
Adversarial Quality     (Sprint 5)  agents/design-critic → vereditos
Engine                              → Revision → agents/design-qa → Review QA Record
      ↓
Quality Gate                        standards/quality-framework → veredito do design
      ↓
Design Critique Report
```

O **Review Workflow** (Sprint 4, `workflows/uxco-review.md`) é o orquestrador dessa pilha; o comando `/uxco-review` é um roteador fino para ele. Nenhuma camada chama outra diretamente: o workflow aciona cada uma e passa adiante o artefato que ela produziu.

### Por que a camada adversarial existe

Até a Sprint 4, o pipeline era:

```text
Context → Paper inspection → Design Critique → Report
```

O primeiro diagnóstico produzido era o diagnóstico entregue. Isso carrega os vieses de quem o produziu — suposição que passou por fato, severidade inflada, recomendação que trata o sintoma, camada que ninguém notou que faltou. A constituição já exigia autocrítica antes de concluir (§3.11), mas regra sem momento próprio degenera em releitura do próprio texto.

A partir da Sprint 5:

```text
Context → Paper inspection → Initial Analysis → Adversarial Critique
        → Revision → Review QA → Final Report
```

A mudança é de **responsabilidade**, não de quantidade de agentes: três estágios novos, cada um com um objeto diferente.

| Estágio | Objeto | Pergunta | Produz |
| --- | --- | --- | --- |
| Initial Analysis | O design | Quais problemas existem? | Achados consolidados |
| Adversarial Critique | O diagnóstico | Onde ele não se sustenta? | Vereditos (`confirmed · revised · rejected · added`) |
| Revision | Os vereditos | Qual diagnóstico sobrevive? | **Um** conjunto de issues |
| Review QA | O review | É confiável para entregar? | Veredito + QA blockers |

Decisões de arquitetura que delimitam a camada:

1. **Ciclo único, como invariante.** Uma passada de cada estágio. Reflexão recursiva e agentes debatendo estão fora por decisão explícita: o ganho marginal da segunda passada não paga latência, verbosidade do report nem risco de diagnósticos divergentes. QA reprovando **declara** o blocker; não reprocessa.
2. **Dois blockers que nunca se confundem.** O Quality Gate reprova o **design**; o QA reprova o **review**. Um review impecável sobre um design ruim é `REVIEW READY` com gate reprovado — e o inverso também é representável.
3. **Nenhuma escala nova.** Severidade, Confidence e camadas continuam nos seus standards; o Critic desafia a *aplicação* delas. O QA usa `PASS/PARTIAL/FAIL/UNKNOWN` (a convenção dos harnesses de avaliação), **sem score composto** — somar tokens de conduta produziria a falsa precisão que a camada existe para combater.
4. **`agents/` em vez de `skills/`.** Critic e QA não são capacidades de uso livre: só existem acoplados a um estágio do review, com um artefato de entrada obrigatório. A camada `agents/` já estava declarada na hierarquia da constituição (§9) e esta é a sua primeira instância.
5. **Observabilidade sem chain-of-thought.** Cada estágio registra um marcador canônico (`INITIAL_ANALYSIS` · `ADVERSARIAL_REVIEW` · `REVISION` · `FINAL_QA`), e o report carrega um bloco compacto (`## Review Assurance`) com o trace, as contagens do desafio e o veredito do QA. O trace declara **que** o estágio aconteceu e o que mudou em números — nunca como se chegou lá.

Contratos completos em `standards/adversarial-quality.md`; o processo executável, nos STEPs 6–8 de `workflows/uxco-review.md`.

### O que ainda não está medido

O ganho da camada adversarial é, hoje, **arquitetural**: há contratos, invariantes testadas e cenários de conduta definidos, mas nenhuma execução comparativa registrada. O protocolo que decide se a camada fica, simplifica ou sai (BEFORE × AFTER, com contagens de ganho e de custo) está em `benchmarks/review-workflow/adversarial-protocol.md` e aguarda execução manual. Tratar a camada como validada antes disso seria exatamente o tipo de falsa precisão que ela existe para combater.

## Preflight em dois níveis

O UXCO Build formaliza duas camadas de verificação de prontidão, porque elas observam coisas diferentes e falham de formas diferentes.

### 1. Machine Preflight

Executado via:

```bash
npm run preflight
```

Verifica **apenas infraestrutura local observável pelo Node.js**: versão do Node, executáveis (Git, Claude Code, GitHub CLI), repositório e branch, arquivos essenciais e um diagnóstico de disponibilidade do endpoint HTTP do Paper MCP. É rápido, roda fora do Claude Code e não depende de sessão de agente.

O que ele **não** consegue ver: se o Claude Code tem o servidor MCP registrado, se as tools estão expostas na sessão atual, ou se há um documento ativo no Paper.

#### Dependências detectadas e classificação

| Dependência | Classificação | Ausência gera | Instalação |
| --- | --- | --- | --- |
| Node.js | REQUIRED | FAIL | Manual (https://nodejs.org) — nunca automatizada |
| Git | REQUIRED | FAIL | Manual (https://git-scm.com) — nunca automatizada |
| Claude Code | REQUIRED | FAIL | Manual (https://claude.com/claude-code, requer conta) — nunca automatizada |
| GitHub CLI | OPTIONAL | WARN | Comando conhecido (`winget install --id GitHub.cli`); candidata a instalação assistida futura |
| Paper MCP endpoint | OPTIONAL* | WARN | Não se "instala" pelo preflight: exige Paper Desktop aberto com documento; configuração do MCP acontece dentro do Claude Code |

\* O endpoint é opcional para o *trabalho local no repositório*; para trabalho com o Paper ele é pré-condição — mas quem decide isso é o **Agent Preflight**, não o Machine Preflight.

Regras de comportamento:

- **REQUIRED ausente** → `FAIL` + comando/passo de instalação recomendado quando existir opção segura e conhecida, ou instrução explícita de que a instalação é manual. Nunca instala silenciosamente.
- **OPTIONAL ausente** → `WARN` + explicação do impacto + instalação sugerida.
- **Nunca instalar automaticamente:** Node.js, Git, Claude Code e Paper Desktop.
- **MCP:** o preflight local apenas **diagnostica disponibilidade** do endpoint. A configuração real do MCP acontece dentro do Claude Code (plugin oficial ou `claude mcp add`), e uma porta HTTP respondendo **nunca** é tratada como prova de MCP funcional — isso é papel do Agent Preflight.

#### Modelo de ações: DETECT → RECOMMEND → INSTALL WITH USER APPROVAL

Toda dependência do UXCO Build é tratada por três ações possíveis, em escala crescente de intervenção:

1. **DETECT** — verificar se a dependência está presente e funcional. *Implementado hoje* no Machine Preflight.
2. **RECOMMEND** — mostrar ao usuário o comando ou passo de instalação recomendado, sem executá-lo. *Implementado hoje*: toda falha/aviso vem acompanhado de uma linha `RECOMMEND`.
3. **INSTALL WITH USER APPROVAL** — executar a instalação somente mediante aprovação explícita do usuário, e somente para dependências com comando seguro e conhecido. ***Não implementado*** — reservado para uma versão futura de instalação assistida. O código do preflight já prepara essa evolução: cada dependência carrega um `install.mode` (`manual` = nunca automatizar; `assisted-future` = candidata à instalação assistida).

Instalação automática silenciosa (sem aprovação) não existe em nenhum nível e não deve ser introduzida.

### 2. Agent Preflight

Executado **pelo Claude Code, dentro da sessão**, antes de qualquer trabalho com o Paper. Verifica, nesta ordem:

1. **Paper MCP registrado** na configuração do Claude Code (`claude mcp get paper` / `/mcp`);
2. **ferramentas Paper disponíveis** na sessão atual (as tools `paper` expostas ao agente);
3. **Paper Desktop acessível** (chamada MCP real não recusada);
4. **documento ativo acessível** (uma leitura como `get_basic_info` retorna um documento válido).

### Por que dois níveis — a cadeia de não-garantias

Cada condição satisfeita **não** implica a seguinte:

- um **endpoint local acessível** não garante que o Claude tenha MCP disponível na sessão (o servidor pode não estar registrado, ou a sessão pode ter iniciado antes da conexão);
- **MCP registrado** não garante que o Paper Desktop esteja aberto (a config existe mesmo com o app fechado);
- **Paper Desktop aberto** não garante que exista um documento ativo (sem documento, as leituras não têm alvo).

Por isso, o UXCO Build **só declara `PAPER_READY` quando todas as condições necessárias estiverem atendidas** — verificadas por chamadas reais, na ordem da cadeia.

### State machine de prontidão do Paper

```text
                       ┌─────────────────────────────┐
  MCP registrado no    │ não → PAPER_MCP_NOT_CONFIGURED
  Claude Code?         │        (registrar servidor: plugin oficial
        │ sim          │         ou claude mcp add)
        ▼              └─────────────────────────────┘
  Tools Paper           não → PAPER_MCP_UNAVAILABLE
  disponíveis na               (rodar /mcp para reconectar
  sessão?                       a sessão atual)
        │ sim
        ▼
  Chamada MCP real      recusada/timeout → PAPER_DESKTOP_NOT_RUNNING
  responde?                    (abrir o Paper Desktop)
        │ sim
        ▼
  Documento ativo       não → PAPER_DOCUMENT_NOT_OPEN
  retornado?                   (abrir um documento no Paper)
        │ sim
        ▼
   PAPER_READY

  erro inesperado em qualquer passo → PAPER_UNKNOWN_ERROR
        (reportar o erro bruto; não prosseguir com escrita)
```

Estados possíveis:

| Estado | Significado | Ação |
| --- | --- | --- |
| `PAPER_READY` | Todas as condições atendidas | Trabalho com Paper autorizado |
| `PAPER_MCP_NOT_CONFIGURED` | Servidor `paper` não registrado no Claude Code | Registrar (plugin oficial ou `claude mcp add`) |
| `PAPER_MCP_UNAVAILABLE` | Registrado, mas tools ausentes/sem resposta na sessão | `/mcp` para reconectar; reiniciar sessão se persistir |
| `PAPER_DESKTOP_NOT_RUNNING` | Conexão recusada — app fechado | Abrir o Paper Desktop |
| `PAPER_DOCUMENT_NOT_OPEN` | App aberto, mas sem documento ativo | Abrir um documento no Paper |
| `PAPER_UNKNOWN_ERROR` | Falha que não corresponde aos casos acima | Investigar antes de qualquer operação; não escrever |

Qualquer estado diferente de `PAPER_READY` **bloqueia operações de escrita** no Paper.

## `/uxco-status` — especificação inicial (protocolo conceitual)

> **Status na Sprint 0:** protocolo conceitual, não implementado como comando real. Nesta fase, o usuário pode simplesmente pedir ao Claude Code "execute o status do UXCO Build" e o agente deve seguir este protocolo. Futuramente ele poderá se tornar um **slash command real** (na família prevista pela PRD: `/uxco-review`, `/uxco-context` etc.), implementado como skill do Claude Code — a especificação abaixo é o contrato que essa implementação deverá cumprir.

### Comportamento

Ao ser acionado, o protocolo executa as duas camadas de preflight, em ordem:

1. **Machine Preflight** — roda `npm run preflight` e coleta os resultados (Node, Git, arquivos, endpoint);
2. **Agent Preflight** — percorre a state machine de prontidão do Paper (seção anterior) com chamadas MCP reais;
3. **Retorna o status consolidado do UXCO Build** no formato abaixo.

O protocolo é **somente leitura**: não corrige nada, não escreve no Paper, não altera configuração. Ele diagnostica e orienta.

### Formato de saída

```text
UXCO BUILD STATUS

Environment            [PASS/WARN/FAIL]  Node.js, versão mínima
Git repository         [PASS/WARN/FAIL]  repositório e branch atual
UXCO repository files  [PASS/WARN/FAIL]  arquivos essenciais presentes
Paper MCP              [PASS/WARN/FAIL]  registrado e tools disponíveis na sessão
Paper Desktop          [PASS/WARN/FAIL]  chamada MCP real respondendo
Active Paper document  [PASS/WARN/FAIL]  documento ativo acessível por leitura

FINAL STATUS: READY | ACTION REQUIRED | BLOCKED
```

Cada linha deve trazer um detalhe curto (valor observado ou causa da falha). Quando houver falha relacionada ao Paper, a saída deve incluir o estado da state machine (ex.: `PAPER_DESKTOP_NOT_RUNNING`) e a ação de correção correspondente.

### Semântica do FINAL STATUS

| Status | Condição | Consequência |
| --- | --- | --- |
| `READY` | Todas as verificações em PASS (equivale a Machine Preflight OK + `PAPER_READY`) | Trabalho completo autorizado, incluindo escrita no Paper |
| `ACTION REQUIRED` | Ambiente local OK, mas alguma condição do Paper não atendida (MCP, Desktop ou documento) — ou WARNs relevantes | Trabalho local permitido; **escrita no Paper bloqueada** até correção; a saída lista os passos de correção |
| `BLOCKED` | Falha no ambiente local (Node incompatível, sem Git, arquivos essenciais ausentes) ou `PAPER_UNKNOWN_ERROR` sem diagnóstico | Nenhum trabalho deve prosseguir até resolução |

A regra herdada dos preflights permanece: **só declarar prontidão com base em verificações reais**, nunca por inferência — um `READY` emitido sem executar as duas camadas é uma violação do protocolo.

## O que a Sprint 0 valida

Somente a camada inferior do diagrama: que Claude Code consegue, via Paper MCP, ler o canvas, listar elementos, identificar frames e criar/modificar um elemento de teste. Ver [`sprint-0.md`](sprint-0.md).

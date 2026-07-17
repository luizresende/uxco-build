# Paper MCP Smoke Test

Relatório consolidado dos testes de integração Claude Code ↔ Paper MCP ↔ Paper executados na Sprint 0.

- **Data de execução:** 2026-07-17 (todos os testes na mesma sessão)
- **Documento de teste:** `UXCO Build — MCP Playground` — ID `01KXS0MECS6HEYHR5C2GRT0QM8` — https://app.paper.design/file/01KXS0MECS6HEYHR5C2GRT0QM8/1-0
- **Regra respeitada:** toda escrita ocorreu exclusivamente no documento de teste; nenhum documento de produção foi tocado.

## Environment

- **OS:** Windows 11 Home Single Language (10.0.26200)
- **Node version:** v22.18.0
- **Claude Code:** CLI, sessão com modelo Claude Fable 5; tools do servidor `paper` expostas na sessão
- **Paper Desktop:** instalado e aberto com o documento de teste carregado (requisito para o servidor MCP local ficar ativo)
- **Connection method:** registro manual no escopo de usuário — `claude mcp add paper --transport http http://127.0.0.1:29979/mcp --scope user`; verificação via `/mcp` e `npm run preflight`

## Tests

### 1. MCP availability

- **Objetivo:** confirmar que o servidor Paper MCP está conectado e responde a chamadas reais (não apenas ao ping HTTP).
- **Resultado:** `get_basic_info` respondeu com o estado completo do documento; endpoint local também respondeu ao diagnóstico do preflight (HTTP 404 em GET simples, comportamento normal).
- **Status:** **PASS**
- **Observação:** endpoint responder ≠ MCP funcional — a validação foi feita por round-trip MCP real. Antes de o Paper Desktop estar aberto, o mesmo endpoint recusava conexão (`ConnectionRefused`), confirmando a dependência do app + documento aberto.

### 2. Document detection

- **Objetivo:** identificar o documento atualmente aberto no Paper.
- **Resultado:** documento identificado como `UXCO Build — MCP Playground`, página ativa `Page 1`, com URL e IDs retornados corretamente.
- **Status:** **PASS**
- **Observação:** o nome do documento foi confirmado como o documento de teste oficial da Sprint 0 (substituiu o nome provisório "UXCO Smoke Test" do plano original).

### 3. Frame listing

- **Objetivo:** listar os frames/artboards do canvas.
- **Resultado:** listagem correta em todas as fases: canvas vazio no início (0 artboards), 1 artboard após o primeiro teste de escrita, 3 artboards ao final — consistente entre `get_basic_info` e `get_tree_summary` em todas as leituras.
- **Status:** **PASS**
- **Observação:** a contagem e os nomes acompanharam cada mutação, sem estado obsoleto entre chamadas.

### 4. Element inspection

- **Objetivo:** localizar a camada `Existing Test Frame` (criada manualmente pelo usuário) e ler seu conteúdo.
- **Resultado:** camada localizada dentro do artboard `uxco-smoke-2026-07-17`; `textContent` lido como `UXCO Build MCP Test` — correspondência exata, caractere por caractere.
- **Status:** **PASS**
- **Observação:** apesar do nome, a camada é um node de **texto** (component `Text`), não um Frame — a inspeção reportou o tipo real, o que é o comportamento desejado para diagnósticos precisos.

### 5. Create operation

- **Objetivo:** criar elementos novos no canvas via MCP.
- **Resultado:** duas criações bem-sucedidas: (a) artboard `uxco-smoke-2026-07-17` (400×300) via `create_artboard`; (b) artboard `UXCO MCP — Write Test` com três camadas de texto — Title "UXCO Build", Subtitle "Paper MCP connected successfully", Status "WRITE TEST" — via `write_html` incremental.
- **Status:** **PASS**
- **Observação:** o posicionamento automático colocou os artboards em áreas vazias, sem sobreposição; a fonte foi verificada (`get_font_family_info`) antes da primeira estilização de texto, conforme o protocolo do Paper MCP.

### 6. Read after create

- **Objetivo:** confirmar por leitura que o conteúdo criado corresponde exatamente ao solicitado.
- **Resultado:** `get_tree_summary` retornou as três camadas com textos idênticos ao pedido (100% de correspondência); screenshot confirmou visualmente hierarquia e cores.
- **Status:** **PASS**
- **Observação:** round-trip escrita → leitura validado sem divergência.

### 7. Update operation

- **Objetivo:** modificar elementos existentes de forma cirúrgica.
- **Resultado:** duas modificações bem-sucedidas: (a) `update_styles` alterou o fundo do artboard de teste (#FFFFFF → #E8F4EA), confirmado por leitura e screenshot; (b) `set_text_content` alterou o Status de "WRITE TEST" para "UPDATE TEST PASSED", preservando ID, nome, posição e estilos do node.
- **Status:** **PASS**
- **Observação:** a leitura pós-update da árvore completa confirmou que nenhum outro elemento foi afetado em nenhuma das duas operações.

### 8. Duplicate operation

- **Objetivo:** duplicar uma área completa e trabalhar apenas na cópia.
- **Resultado:** `duplicate_nodes` clonou o artboard `UXCO MCP — Write Test` com todos os descendentes; a cópia foi renomeada para `UXCO MCP — Duplicate Test` e diferenciada visualmente (fundo âmbar #FFF6E5, borda tracejada, status "DUPLICATE TEST" em âmbar) — todas as alterações restritas à cópia.
- **Status:** **PASS**
- **Observação:** o `descendantIdMap` retornado permitiu referenciar os clones diretamente, sem buscas intermediárias — útil para os workflows futuros de "duplicar antes de alterar".

### 9. Original preservation

- **Objetivo:** garantir que nenhuma operação teve efeito colateral sobre conteúdo pré-existente.
- **Resultado:** verificações por árvore completa e screenshots ao final de cada teste confirmaram: o original `UXCO MCP — Write Test` permaneceu exatamente como o teste 7 o deixou; a camada manual `Existing Test Frame` permaneceu intacta durante todos os testes; o documento terminou com exatamente os 3 artboards esperados.
- **Status:** **PASS**
- **Observação:** este teste valida na prática a regra de segurança operacional da PRD (seção 17): duplicar → modificar a cópia → verificar o original.

## Summary

```text
MCP_CONNECTION:         PASS
CAN_READ_CANVAS:        PASS
CAN_INSPECT_FRAME:      PASS
CAN_CREATE:             PASS
CAN_UPDATE:             PASS
CAN_DUPLICATE:          PASS
ORIGINAL_PRESERVATION:  PASS

SPRINT_0_TECHNICAL_GATE: PASS
```

Todos os recursos essenciais da integração Paper ↔ Claude foram exercitados com sucesso em round-trip real (escrita sempre confirmada por leitura subsequente), sem nenhum efeito colateral sobre conteúdo pré-existente. O critério técnico da Fase 1 da PRD — "Integração técnica Paper ↔ Claude funcionando" — está atendido.

**Estado final do documento de teste:** 3 artboards — `uxco-smoke-2026-07-17` (com a camada manual `Existing Test Frame`), `UXCO MCP — Write Test` (original preservado) e `UXCO MCP — Duplicate Test` (cópia diferenciada). Podem ser mantidos como evidência ou removidos manualmente quando não forem mais necessários.

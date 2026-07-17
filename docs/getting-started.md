# Getting Started

Como preparar o ambiente local para trabalhar no UXCO Build (Sprint 0).

## Pré-requisitos

- **Node.js** 18 ou superior (`node --version`)
- **Git** (`git --version`)
- **Claude Code** instalado e autenticado
- **Paper Desktop** instalado
- **Paper MCP** disponível (ver [`../.mcp/README.md`](../.mcp/README.md))
- Terminal (PowerShell, bash ou equivalente)

## Passos

### 1. Clonar ou abrir o repositório

Nesta fase o projeto é privado e local. Abra o diretório raiz do repositório no terminal e no editor.

### 2. Rodar o Machine Preflight

```bash
npm run preflight
```

O **Machine Preflight** verifica apenas a infraestrutura local observável pelo Node.js: versão do Node, presença do Git, repositório/branch, arquivos essenciais e um diagnóstico de disponibilidade do endpoint do Paper MCP. Ele é somente leitura — não instala nem altera nada.

**Atenção:** ele não é suficiente para trabalhar com o Paper. Um endpoint acessível não garante que o Claude Code tenha as tools MCP disponíveis na sessão — isso é papel do Agent Preflight (passo 4).

### 3. Configurar o Paper MCP

Pré-requisitos: **Paper Desktop instalado** e **um documento aberto** — o servidor MCP local só fica ativo com o app aberto e um documento carregado.

- **Método recomendado:** instalar o plugin oficial do Paper para Claude Code.
- **Fallback (manual):**

  ```bash
  claude mcp add paper --transport http http://127.0.0.1:29979/mcp --scope user
  ```

Para verificar a conexão, rode `/mcp` dentro da sessão do Claude Code — o servidor `paper` deve aparecer como conectado.

Detalhes completos e troubleshooting em [`../.mcp/README.md`](../.mcp/README.md). Configurações locais com credenciais **não** devem ser versionadas — e note que `.mcp/` é documentação do projeto, não a fonte real da configuração (que vive na config do Claude Code).

### 4. Rodar o Agent Preflight

O **Agent Preflight** é executado pelo próprio Claude Code, dentro da sessão, antes de qualquer trabalho com o Paper. Peça ao agente para verificar a prontidão do Paper; ele deve checar, em ordem:

1. Paper MCP **registrado** na configuração do Claude Code;
2. ferramentas Paper **disponíveis na sessão** atual;
3. Paper Desktop **acessível** (chamada MCP real respondendo);
4. **documento ativo** acessível (leitura retorna um documento válido).

Cada condição não garante a seguinte: MCP registrado ≠ Paper Desktop aberto; Paper aberto ≠ documento ativo. O agente só declara **`PAPER_READY`** quando as quatro condições passam — qualquer outro estado (`PAPER_MCP_NOT_CONFIGURED`, `PAPER_MCP_UNAVAILABLE`, `PAPER_DESKTOP_NOT_RUNNING`, `PAPER_DOCUMENT_NOT_OPEN`, `PAPER_UNKNOWN_ERROR`) bloqueia operações de escrita. A state machine completa está em [`architecture.md`](architecture.md).

### 5. Validar a integração (smoke test)

Com o Agent Preflight em `PAPER_READY`, execute o smoke test descrito em [`../experiments/paper-mcp/smoke-test.md`](../experiments/paper-mcp/smoke-test.md). Ele valida leitura e escrita no canvas usando **apenas o documento de teste dedicado** — nunca documentos de produção.

## Solução de problemas

- **`npm run preflight` falha com erro de módulo** — confirme que está na raiz do repositório e que o Node é ≥ 18.
- **`ConnectionRefused` no Paper MCP** — o Paper Desktop está fechado ou sem documento aberto. Abra o app, abra um documento e rode `/mcp` para reconectar.
- **Endpoint responde, mas as tools do Paper não aparecem** — a sessão começou antes da conexão; rode `/mcp` na sessão atual.
- **HTTP 404 ao acessar o endereço no navegador** — comportamento normal do endpoint MCP em GET; não é erro.
- **Tabela completa de troubleshooting** — ver [`../.mcp/README.md`](../.mcp/README.md).
- **Dúvida sobre o escopo atual** — leia [`sprint-0.md`](sprint-0.md); nesta sprint não há skills, workflows nem agentes.

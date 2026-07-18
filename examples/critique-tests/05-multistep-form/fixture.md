# Fixture — Formulário multi-step (portal "TalentoJá")

Material de análise para o Critique Engine. Descrição factual do design; nenhuma avaliação embutida.

## Contexto

- **Produto:** TalentoJá, portal de vagas; este é o formulário de candidatura.
- **Usuário:** candidato a emprego, frequentemente no mobile, muitas vezes preenchendo com atenção dividida.
- **Tarefa:** completar e enviar a candidatura a uma vaga.
- **Contexto não disponível:** tempo médio real de preenchimento (estimado internamente em 15–25 min, sem medição); taxa de conclusão desconhecida.

## Fluxo: 4 etapas, com stepper visual no topo

1. **Dados pessoais** — nome, e-mail, telefone, cidade, pretensão salarial (obrigatório).
2. **Experiência** — cargos anteriores (formulário repetível: empresa, cargo, período, descrição).
3. **Anexos** — upload de currículo (PDF, obrigatório) e portfólio (opcional).
4. **Revisão e envio** — resumo das etapas e botão "Enviar candidatura".

## Comportamento

- Os dados digitados existem apenas na sessão do navegador; não há salvamento automático nem manual. A sessão expira após 20 minutos de inatividade e, ao expirar, o formulário retorna à etapa 1 vazio.
- O botão "Voltar" do navegador sai do formulário para a página da vaga; ao retornar, o formulário está na etapa 1, vazio.
- O stepper mostra as 4 etapas com a atual destacada; as etapas não são clicáveis (navegação apenas pelos botões "Avançar"/"Voltar" do formulário).
- **Upload (etapa 3):** ao selecionar o arquivo, não há indicador de progresso; a interface permanece idêntica até a conclusão (uploads típicos: 5–30 s em rede móvel). Em falha de upload, é exibido um `alert()` nativo do navegador com o texto "Upload failed".
- **Envio (etapa 4):** se uma validação falhar — inclusive de campo preenchido na etapa 1 —, é exibida a mensagem "Formulário inválido." acima do botão, sem indicação de qual campo ou etapa contém o problema.

## Estados conhecidos

- Apenas as 4 telas do caminho feliz foram desenhadas. Loading de envio, sucesso do envio, erro de servidor e estados parciais não foram especificados ("a definir", segundo o material).

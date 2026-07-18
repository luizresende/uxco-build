# Fixture — Empty state (app "Horas", tela única)

Material de análise para o Critique Engine. Descrição factual do design; nenhuma avaliação embutida.

## Contexto

- **Produto:** Horas, app de controle de tempo para freelancers.
- **Usuário:** freelancer recém-cadastrado, primeiro acesso após o signup.
- **Tarefa:** começar a registrar horas trabalhadas em um projeto.
- **Escopo:** apenas a tela abaixo está disponível — o restante do produto não foi fornecido.
- **Contexto não disponível:** fluxo de onboarding anterior a esta tela (se existe, não foi fornecido); dados de ativação.

## Tela: Registros (primeiro acesso, sem dados)

Elementos, de cima para baixo:

- Header com o título "Registros" e um campo de busca.
- Barra de ferramentas com quatro botões representados apenas por ícones (funil, calendário, colunas, e um botão "⋯" que abre menu com: "Novo registro", "Importar CSV", "Exportar", "Configurações da lista").
- Área central da tabela exibindo o texto "Nenhum registro encontrado." centralizado, em cinza.
- Rodapé com link "Central de ajuda" (fonte 11px).

## Comportamento

- A mesma área central com o mesmo texto "Nenhum registro encontrado." é exibida em duas situações: (a) usuário novo, sem nenhum registro criado; (b) busca ou filtro ativo que não retornou resultados.
- Criar o primeiro registro é feito por "⋯ → Novo registro". Não há outro caminho nesta tela.
- Os botões de ícone não têm rótulo visível; exibem tooltip após ~1 s de hover.

## Estados conhecidos

- Apenas o estado descrito. O estado da tabela com dados não foi fornecido.

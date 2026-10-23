# Fixture — Cadastro de paciente (web "Agenda Já")

Material de análise para as skills de profundidade. Descrição factual do design; nenhuma avaliação embutida.

## Contexto

- **Produto:** Agenda Já, agendamento online para clínicas médicas.
- **Usuário:** paciente agendando a primeira consulta, pelo celular. Segundo a clínica, cerca de 40% dos pacientes têm mais de 60 anos (dado operacional informado pelo time; não é pesquisa).
- **Tarefa:** criar o cadastro para confirmar a consulta já escolhida.
- **Contexto não disponível:** taxa de conclusão do cadastro; pesquisa com pacientes; a solução de CAPTCHA (fornecedor e alternativas) não foi documentada no material.

## Tela: Seus dados (mobile web, 390 de largura)

Elementos, de cima para baixo. Valores são os estilos definidos no arquivo de design.

- Título "Seus dados" — 20px semibold.
- Quatro campos de texto, 48px de altura, identificados **apenas por placeholder** (16px, cor #A0A0A0 sobre #FFFFFF): "Nome completo", "CPF", "Data de nascimento", "Celular". Ao digitar, o placeholder some; não há rótulo fora do campo.
- Abaixo do campo CPF, texto de ajuda "Somente números" — 12px, cor #A0A0A0 sobre #FFFFFF.
- Bloco de verificação: imagem com caracteres distorcidos e o campo "Digite os caracteres da imagem". O material não mostra outra forma de verificação.
- Botão de largura total "Continuar" — 48px de altura, fundo #2E7D32, texto branco 16px.

## Comportamento

1. Toque em "Continuar" com algum campo inválido → no topo da tela aparece o texto "Dados inválidos." (14px, #D32F2F sobre #FFFFFF); os campos inválidos recebem borda vermelha de 1px (#D32F2F). Nenhum texto ou ícone aparece junto aos campos.
2. "Data de nascimento" aceita apenas o formato dd/mm/aaaa; outro formato produz o comportamento do item 1.
3. Caracteres da verificação incorretos → o campo da verificação é limpo, uma nova imagem é carregada e o comportamento do item 1 se repete.
4. Toque em "Continuar" com todos os campos válidos → segue para a tela de confirmação da consulta (fora do escopo).

## Estados conhecidos

- Estado padrão e estado de erro (descritos acima). Estado de envio não foi desenhado.
- O material não especifica para onde vai o foco após o erro nem se a mensagem do topo é anunciada por leitores de tela.

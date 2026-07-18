# Fixture — Login (app "Contably")

Material de análise para o Critique Engine. Descrição factual do design; nenhuma avaliação embutida.

## Contexto

- **Produto:** Contably, SaaS de contabilidade para pequenos negócios.
- **Usuário:** dono de pequeno negócio, uso 2–3×/semana, majoritariamente desktop.
- **Tarefa:** entrar na conta para consultar pendências fiscais.
- **Contexto não disponível:** nenhuma pesquisa sobre login; taxa de falha de login desconhecida; políticas de segurança definidas pelo time de backend (documento não fornecido).

## Tela: Login

Elementos, de cima para baixo:

- Logo Contably.
- Campo "E-mail".
- Campo "Senha" (sem opção de exibir a senha).
- Link "Esqueci minha senha" (texto pequeno, abaixo do campo de senha).
- Botão primário "Entrar" (largura total).

## Comportamento

1. Submissão com credenciais válidas → redireciona ao dashboard.
2. Submissão com senha incorreta → a página recarrega; ambos os campos retornam vazios; no topo da página aparece o texto "Erro no login. Tente novamente." em cinza-claro sobre fundo branco, fonte 12px.
3. Submissão com e-mail não cadastrado → mesma mensagem e mesmo comportamento do caso 2.
4. Após a terceira tentativa incorreta, o backend bloqueia a conta por 30 minutos. A tela não muda: tentativas seguintes — inclusive com a senha correta — exibem a mesma mensagem "Erro no login. Tente novamente."
5. Na re-renderização após qualquer erro, o link "Esqueci minha senha" não é incluído no template de erro — a tela de erro exibe apenas logo, campos e botão.
6. Não há indicação de carregamento entre o clique em "Entrar" e a resposta (resposta típica: 1–3 s).

## Estados conhecidos

- Estado padrão e estado pós-erro (descritos acima). Nenhum outro estado foi desenhado.

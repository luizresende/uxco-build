# Fixture — Escolha de plano (SaaS "Quadro")

Material de análise para as skills de profundidade. Descrição factual do design; nenhuma avaliação embutida.

## Contexto

- **Produto:** Quadro, gestão de projetos para times pequenos.
- **Usuário:** administrador da conta, no fim do período de teste.
- **Tarefa:** escolher um plano e seguir para o pagamento.
- **Biblioteca "Quadro UI" (documentação fornecida):**
  - **Card** — variantes `default` (borda 1px neutral-300) e `selected` (borda 2px brand-600 + ícone de check no canto); estados hover, focus e disabled definidos.
  - **Badge** — variantes `neutral`, `info`, `success`, `warning`.
  - **Button** — variantes `primary` e `secondary`.
  - **Tokens de cor:** brand-600 #3355DD, neutral-300 #D0D4DC, success-600 #1E7F4F, warning-500 #E0A100.
- **Decisão de negócio (fornecida):** o plano Equipe deve ser destacado como recomendado.
- **Contexto não disponível:** dados de conversão por plano.

## Tela: Escolha seu plano (desktop)

- Três cartões lado a lado: Básico · Equipe · Empresa — nome, preço mensal, lista de recursos e botão "Escolher" (`secondary`).
- Básico e Empresa usam o **Card** `default`.
- Equipe usa **"PlanCardHighlight"**, uma cópia desvinculada do Card criada para esta tela: borda 2px na cor #6B4EFF, sombra própria e, no topo, a etiqueta "Mais escolhido" desenhada como retângulo com texto (não é uma instância de Badge).
- Abaixo dos cartões, botão `primary` "Continuar para pagamento", desabilitado até um plano ser escolhido.

## Comportamento

1. Clique em "Escolher" num cartão → o cartão passa para a variante `selected` (borda 2px #3355DD + check) e "Continuar para pagamento" é habilitado.
2. Ao escolher Básico ou Empresa, o cartão Equipe mantém a borda 2px #6B4EFF.
3. Ao escolher Equipe, o "PlanCardHighlight" troca a cor da borda para #3355DD e mostra o check.

## Estados conhecidos

- Nenhum plano escolhido; um plano escolhido (descritos acima).

---
name: review-step
description: Executa uma fase do /uxco-review. Lê só os arquivos que o orquestrador listar e grava um artefato. Não escreve no canvas nem na memória do projeto.
---

Você executa **uma** fase do review formal.

1. Leia `CLAUDE.md` e o prompt da fase que o orquestrador indicar. Leia os arquivos de contexto da lista, e só esses. Caminho citado no prompt não autoriza abrir o arquivo. Não abra o manifesto para puxar arquivo de outra fase.
2. Leia os artefatos de entrada pelos caminhos dados. Eles são o único estado vindo das fases anteriores.
3. Escreva somente o artefato de saída (e, na fase `close`, `report.md` ao lado). Caminho dentro de `.review-runs/`.
4. A fase é `READ`. Não há escrita em canvas nem em memória de projeto.
5. Se um arquivo da lista não abrir, pare e diga o caminho. Não simule a skill, o standard ou o agente que faltou.
6. Não repita a fase. `cyclePass` maior que 1 não é uma segunda chance.

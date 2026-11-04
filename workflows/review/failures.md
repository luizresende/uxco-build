# Falhas de execução

Catálogo compartilhado. Não entra no contexto de uma fase: cada prompt repete a regra que lhe cabe, e `scripts/chain.mjs` recusa o artefato que a viole. Falha de execução não é review inválido — isso está nas Failure Conditions de `workflows/uxco-review.md`. A falha nunca é compensada por invenção.

| Ordem | Modo | Fase | O que a estrutura faz |
| --- | --- | --- | --- |
| 1 | Paper indisponível | inspect | `halt` `paper-only-blocked` e a mensagem canônica, quando o canvas é a única fonte |
| 2 | Nenhum escopo identificável | scope | `halt` `unresolved-scope` ou `no-artifact`; a crítica não começa |
| 3 | Contexto incompleto, mas suficiente | ground | `proceed-with-assumptions`; Confidence cai depois, no achado |
| 4 | Contexto crítico ausente | ground | `halt` `misleading-without-context`, e só nesse caso |
| 5 | Skill ou responsabilidade indisponível | qualquer | `chain.mjs check` falha se o arquivo do manifesto não existe; leitura que falha no meio para e nomeia o arquivo |
| 6 | Paper parcialmente legível | inspect | `partial`, com limitations |
| 7 | Diagnóstico inicial vazio | challenge | a fase roda mesmo com zero achados |
| 8 | QA reprovando o review | close | o report sai; `qualifiedByQa`; nenhum segundo ciclo |

Falha 5 é falha **explícita**: nomear a dependência quebrada. É proibido executar uma versão genérica improvisada do método. Ela não abre `docs/constitution/knowledge-routing.md` para improvisar método. Esse arquivo só entra no orquestrador quando o pedido vem em linguagem natural e é preciso saber qual comando existe. A exceção do Context Loader está nas Preconditions de `workflows/uxco-review.md`: sem o comando, leitura direta declarada no brief.

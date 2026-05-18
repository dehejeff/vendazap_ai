# Integracao com Gemini - Proximo Passo

## Objetivo

Adicionar uma camada de inteligencia mais forte ao VendaZap AI para melhorar:

- entendimento de contexto;
- classificacao de intencao;
- resposta comercial;
- comportamento em casos ambiguos;
- preparacao para audio transcrito.

## Ponto de Partida Atual

Hoje o sistema ja possui:

- motor local de IA com regras deterministicas;
- leitura de contexto da conversa;
- classificacao de estagio comercial;
- urgencia e foco operacional;
- handoff humano;
- fallback seguro para o MVP.

Ou seja, o Gemini nao vai entrar para substituir tudo de uma vez.

Ele entra primeiro como camada superior, com fallback para a logica atual.

## Primeira Fase da Integracao

Escopo inicial:

1. receber as ultimas mensagens da conversa;
2. receber contexto resumido da loja;
3. receber status atual da conversa;
4. receber produtos relevantes do catalogo;
5. devolver resposta estruturada.

Resposta esperada do Gemini:

- `intent`
- `dealStage`
- `needsHuman`
- `missingData`
- `confidence`
- `suggestedReply`

## Regras de Seguranca

O Gemini nao pode:

- inventar estoque;
- inventar preco;
- inventar prazo;
- prometer desconto sem regra da loja;
- responder quando a conversa estiver em atendimento humano;
- ignorar status operacional da conversa.

## Arquitetura Sugerida

Arquivos esperados para esta frente:

- `lib/llm/gemini.ts`
- `lib/llm/build-conversation-prompt.ts`
- `lib/llm/parse-gemini-response.ts`
- ajuste em `lib/ai-assistant.ts`

Fluxo sugerido:

1. sistema monta contexto;
2. chama Gemini;
3. tenta interpretar resposta estruturada;
4. se der certo, usa o retorno;
5. se der erro, cai para a logica local atual.

## Contexto que Deve Ir Para o Modelo

Enviar somente o necessario:

- ultima mensagem do cliente;
- ultimas mensagens relevantes da conversa;
- resumo operacional da conversa;
- nome da loja e nicho;
- horario de atendimento, quando existir;
- produtos mais provaveis de responder aquele pedido.

Evitar:

- mandar catalogo inteiro;
- mandar historico bruto excessivo;
- mandar regras soltas sem instrucao de prioridade.

## Relacao com Audio

Depois da transcricao, o audio deve virar texto para esta mesma pipeline.

Ou seja:

- texto puro entra na camada Gemini;
- audio transcrito entra na mesma camada Gemini;
- a origem da mensagem continua registrada no historico.

## Resultado Esperado

Ao final da primeira integracao, esperamos:

- respostas mais naturais;
- melhor leitura de saudacoes e perguntas abertas;
- melhor entendimento de negociacao;
- melhor retomada de contexto;
- base pronta para evoluir com audio real.

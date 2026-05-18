# Backlog de Execucao - MVP VendaZap AI

## Objetivo do Documento

Este backlog transforma a estrategia do produto em frentes praticas de execucao.

Ele deve ajudar a responder:

- o que precisa ser feito agora;
- o que vem depois;
- o que depende de outra etapa;
- o que ja pode ser tratado como backlog futuro.

## Como Ler Este Backlog

Prioridades:

- P0 = essencial para o MVP funcionar
- P1 = importante para fortalecer o MVP
- P2 = importante para a evolucao comercial e operacional

Status sugeridos:

- nao iniciado
- em andamento
- pronto para fazer
- bloqueado
- concluido

## Status Atual Geral

Data de referencia:

- 17/05/2026

Frentes ja concluidas ou bem avancadas:

- autenticacao;
- multi-tenant;
- onboarding inicial;
- catalogo com busca e edicao;
- persistencia real com Supabase;
- painel de conversas;
- funil comercial inicial;
- handoff humano;
- base para audio no fluxo;
- refinamento premium do front mobile e web.

Frente prioritaria agora:

- integracao com Gemini para entendimento e resposta contextual.

## Bloco 1 - Aquisicao e Validacao Comercial

### P0 - Landing page de conversao

- headline final e copy principal
- CTA funcional
- simulacao do fluxo no WhatsApp
- secoes de beneficios
- FAQ
- captura de leads

### P0 - Captura real de leads

- formulario conectado a banco ou ferramenta
- armazenamento de nome, email, loja e nicho
- mensagem de confirmacao
- resolver bloqueio atual do Supabase antes da persistencia real [concluido]
- criar tabela de leads no Supabase [concluido]
- conectar o formulario da landing ao banco quando a infraestrutura estiver liberada [em andamento]

### P1 - Estrutura comercial inicial

- pagina ou mensagem de lista de espera
- definicao de nichos prioritarios
- roteiro basico para conversar com leads

## Bloco 2 - Fundacao do SaaS

### P0 - Estrutura do projeto

- base Next.js organizada
- convencoes de pastas
- configuracoes de ambiente
- preparacao para deploy

### P0 - Autenticacao

- cadastro [concluido]
- login [concluido]
- logout [concluido]
- protecao de rotas [concluido]

### P0 - Multi-tenant

- entidade loja [concluido]
- relacao usuario x loja [concluido]
- isolamento de dados por tenant [concluido]

### P1 - Onboarding inicial

- nome da loja [concluido]
- nicho [concluido]
- dados basicos [concluido]
- fluxo de primeiro acesso [concluido]

## Bloco 3 - Catalogo e Estoque

### P0 - Cadastro manual de produtos

- criar produto [concluido]
- editar produto [concluido]
- listar produtos [concluido]
- excluir ou inativar produto [parcial]

### P0 - Estoque basico

- quantidade disponivel [concluido]
- atualizacao de estoque [concluido]
- status de disponibilidade [concluido]

### P1 - Busca e filtros

- busca por nome [concluido]
- busca por categoria [parcial]
- busca por compatibilidade [concluido]

### P1 - Estrutura para nicho motopecas

- campo de compatibilidade [concluido]
- observacoes tecnicas [concluido]
- base para ano e modelo [parcial]

## Bloco 4 - WhatsApp e Conversas

### P0 - Conexao com WhatsApp Cloud API

- configuracao de credenciais [parcial]
- webhook [parcial]
- recebimento de mensagens [parcial]
- validacao basica da integracao [em andamento]

### P0 - Registro de conversas

- criar conversa por cliente [concluido]
- armazenar mensagens [concluido]
- manter historico minimo [concluido]
- status da conversa [concluido]

### P1 - Painel de conversas

- lista de conversas [concluido]
- status visivel [concluido]
- historico [concluido]
- ordenacao por prioridade [parcial]

## Bloco 5 - Motor de IA

### P0 - Interpretacao inicial

- detectar intencao [concluido]
- identificar pedido de produto [concluido]
- detectar falta de informacao [concluido]

### P0 - Perguntas complementares

- pedir ano, modelo, cor, voltagem ou contexto quando necessario [concluido]
- evitar respostas sem base [concluido]

### P0 - Consulta de estoque

- buscar produto relevante [concluido]
- validar disponibilidade [concluido]
- retornar preco e contexto [concluido]

### P0 - Resposta automatica

- tom natural [parcial]
- resposta objetiva [concluido]
- tentativa de avancar a conversa [concluido]

### P1 - Regras de seguranca

- evitar alucinacao [parcial]
- fallback para humano [concluido]
- limitar resposta em casos ambiguos [parcial]

### P1 - Funil comercial e automacoes

- definir estagios comerciais da conversa [concluido]
- refletir estagio no painel [concluido]
- definir urgencia e foco operacional [concluido]
- criar transicoes basicas por status [concluido]
- preparar follow-up de conversas paradas [parcial]

### P1 - Preparacao para audio

- aceitar conversa iniciada por audio [concluido na estrutura]
- aceitar conversa mista com texto e audio [concluido na estrutura]
- registrar origem da mensagem [concluido]
- preparar fluxo de transcricao para usar a mesma logica da IA [em andamento]

## Bloco 6 - Reserva e Fluxo Comercial

### P0 - Criacao de reserva

- vincular produto [concluido]
- vincular conversa [concluido]
- quantidade [concluido]
- status da reserva [concluido]

### P0 - Atualizacao do painel

- exibir reserva no painel [concluido]
- exibir conversa reservada [concluido]
- registrar data e status [concluido]

### P1 - Notificacao ao lojista

- aviso interno
- destaque de conversa quente

## Bloco 7 - Operacao do Lojista

### P0 - Assumir atendimento humano

- botao para assumir conversa [concluido]
- interrupcao da IA naquela conversa [concluido]
- historico preservado [concluido]

### P1 - Painel inicial

- resumo de conversas [concluido]
- resumo de reservas [concluido]
- atalhos rapidos [concluido]

### P1 - Melhorias mobile

- fluxo rapido no celular [concluido]
- leitura simples [concluido]
- acoes principais acessiveis [concluido]

## Bloco Prioritario Atual - Gemini

### P0 - Integracao inicial do Gemini

- criar provider do Gemini no backend
- configurar chave de ambiente
- enviar ultimas mensagens, contexto da loja e catalogo relevante
- receber resposta estruturada com intencao, estagio, precisa de humano e resposta sugerida
- manter fallback local se o Gemini falhar

### P0 - Uso do Gemini no motor de IA

- usar Gemini para classificar intencao
- usar Gemini para gerar resposta contextual
- impedir que o modelo invente preco, estoque ou politicas
- respeitar handoff humano e status operacional

### P1 - Gemini + audio

- reutilizar a mesma pipeline depois da transcricao
- tratar texto puro e texto transcrito com a mesma camada de entendimento
- guardar metadados da origem da mensagem

### P1 - Observabilidade da IA

- registrar quando a resposta veio do fallback local
- registrar quando veio do Gemini
- preparar base para medir qualidade das respostas

## Bloco 8 - Validacao com Pilotos

### P0 - Selecao de pilotos

- definir quantidade inicial
- definir nicho principal
- priorizar lojas com uso real de WhatsApp

### P0 - Onboarding assistido

- cadastrar primeiros clientes
- acompanhar configuracao
- observar uso real

### P0 - Coleta de feedback

- principais dores
- erros da IA
- dificuldade de uso
- valor percebido

### P1 - Ajustes rapidos

- corrigir gargalos da IA
- corrigir gargalos de UX
- simplificar onboarding

## Bloco 9 - Fortalecimento do Produto

### P1 - Importacao CSV

- modelo de planilha
- upload
- validacao de campos
- importacao de produtos

### P1 - Historico de clientes

- consolidar conversas por cliente
- mostrar interacoes anteriores

### P1 - Produtos similares

- sugerir alternativa
- melhorar continuidade da venda

### P1 - Fotos de produtos

- anexar imagem
- usar imagem no painel e no futuro na conversa

### P1 - Interpretacao de audio no WhatsApp

- receber audio enviado pelo cliente
- transcrever audio para texto
- usar a transcricao no mesmo fluxo de interpretacao da IA
- identificar pedido de produto, contexto e informacoes faltantes
- mostrar no painel que a mensagem original foi audio

### P1 - Notificacoes internas

- destaque de atendimento
- alerta de reserva
- alerta de conversa aguardando humano

## Bloco 10 - Comercial e Precificacao

### P0 - Definicao da oferta inicial

- texto comercial do MVP
- promessa principal
- o que nao prometer

### P0 - Faixa de preco piloto

- decidir valor inicial
- decidir se havera setup
- decidir condicoes beta

### P1 - Estrutura de planos

- piloto
- basico
- pro
- avancado

### P1 - Materiais de venda

- pagina de planos
- argumento de valor
- roteiro de demonstracao

## Ordem Recomendada de Execucao

1. landing page e captura real
2. autenticacao
3. multi-tenant
4. onboarding inicial
5. cadastro de produtos
6. estoque basico
7. painel de conversas
8. integracao WhatsApp
9. motor de IA
10. reserva
11. assumir atendimento humano
12. pilotos
13. importacao CSV
14. historico de clientes
15. planos comerciais

## Definicao de MVP Pronto

O MVP estara pronto quando uma loja piloto conseguir:

1. criar conta;
2. cadastrar produtos;
3. conectar o WhatsApp;
4. receber mensagens reais;
5. deixar a IA responder casos simples;
6. consultar estoque dentro do fluxo;
7. gerar reserva;
8. assumir atendimento humano;
9. perceber valor real no uso.

## Proxima Camada de Backlog

Depois deste backlog, o passo natural e quebrar cada bloco em:

- epicos;
- historias de usuario;
- tarefas tecnicas;
- criterios de aceite.

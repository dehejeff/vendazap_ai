# PRD do MVP - VendaZap AI

## Objetivo do Documento

Este PRD define o escopo do MVP do VendaZap AI de forma objetiva e executavel.

A ideia e transformar a visao do produto em uma primeira versao utilizavel, clara e validavel no mercado.

Este documento deve orientar:

- produto;
- design;
- arquitetura;
- desenvolvimento;
- validacao com clientes piloto.

## Resumo do MVP

O MVP do VendaZap AI sera uma plataforma SaaS simples para lojistas brasileiros conectarem seu atendimento de WhatsApp a uma IA que responde clientes, consulta estoque e ajuda a avancar a venda.

O foco nao e construir uma plataforma completa desde o inicio.

O foco e provar que:

- lojistas querem esse tipo de produto;
- a IA consegue ajudar em atendimentos reais;
- o fluxo de consulta e reserva gera valor;
- a experiencia pode ser simples o bastante para gerar adocao.

## Status Atual do MVP

Data de referencia:

- 17/05/2026

Ja implementado:

- autenticacao da loja;
- estrutura multi-tenant;
- onboarding inicial;
- catalogo com cadastro, busca e edicao;
- painel com versao mobile-first e desktop refinada;
- painel de conversas com timeline e simulacao;
- funil comercial inicial por conversa;
- handoff humano com pausa da IA;
- retorno manual para a IA;
- persistencia real com Supabase para usuarios, produtos, conversas, mensagens e leads;
- base estrutural para mensagens de audio e texto no mesmo fluxo.

Em andamento ou proximo da execucao:

- integracao com Gemini para entendimento e resposta contextual;
- webhook operacional mais proximo do fluxo real da WhatsApp Cloud API;
- transcricao real de audio;
- regras configuraveis de atendimento por loja.

## Problema Principal

Lojistas vendem pelo WhatsApp, mas perdem dinheiro porque:

- respondem tarde;
- deixam mensagens passarem;
- nao conseguem organizar conversas;
- dependem demais de atendimento manual;
- perdem tempo com perguntas repetitivas;
- nao transformam conversa em reserva ou venda com rapidez.

## Objetivo do MVP

Construir a menor versao do produto capaz de permitir que uma loja:

1. entre na plataforma;
2. cadastre seus produtos manualmente;
3. conecte o WhatsApp;
4. receba mensagens de clientes;
5. tenha a IA conduzindo perguntas iniciais;
6. consulte estoque;
7. responda com contexto;
8. registre reserva;
9. assuma o atendimento quando necessario.

## Resultado Esperado do MVP

Ao final do MVP, devemos ser capazes de colocar o produto na mao de alguns lojistas piloto e responder com seguranca:

- o fluxo central funciona?
- o lojista entende o produto?
- a IA ajuda de verdade?
- o produto economiza tempo?
- existe potencial real de cobranca?

## Escopo do MVP

### Incluido no MVP

- landing page;
- captura de leads;
- autenticacao basica;
- estrutura multi-tenant;
- onboarding inicial simples;
- cadastro manual de produtos;
- estoque basico;
- painel do lojista;
- painel de conversas;
- conexao com WhatsApp Cloud API;
- recebimento de mensagens;
- motor de atendimento com IA;
- identificacao de informacoes faltantes;
- consulta de estoque;
- resposta automatica;
- criacao de reserva;
- opcao de atendimento humano.

Observacao importante:

- o MVP ja esta usando Supabase como banco principal;
- o motor atual de IA ainda e local/deterministico, com Gemini previsto como proxima camada.

### Fora do MVP

- integracao com ERP;
- importacao CSV;
- promocoes automaticas avancadas;
- dashboard completo;
- campanhas;
- pagamentos PIX;
- voz;
- multiplas lojas na mesma conta;
- multiplos vendedores com regras complexas;
- analytics avancados;
- Instagram Direct.

Esclarecimento:

- audio nao esta mais completamente fora do MVP;
- o sistema ja foi preparado para receber texto e audio no mesmo fluxo;
- o que ainda falta e a transcricao real e a leitura comercial mais avancada desse audio.

## Perfil de Usuario

### Persona principal

Lojista ou gerente de pequena e media loja brasileira que vende pelo WhatsApp.

Caracteristicas:

- rotina corrida;
- pouco tempo para aprender software;
- forte foco em vendas;
- equipe enxuta;
- quer algo simples e util;
- normalmente usa celular o tempo todo.

### Nicho prioritario

Motopecas.

### Nichos secundarios

- autopecas;
- lojas de celular;
- material de construcao;
- informatica.

## Proposta de Valor do MVP

O MVP precisa comunicar e entregar isto:

"Sua loja responde mais rapido, perde menos clientes e organiza melhor o atendimento no WhatsApp com ajuda de IA."

## Hipoteses Que o MVP Precisa Validar

### Hipotese 1

Lojistas topam usar uma IA no WhatsApp se ela parecer util e humana.

### Hipotese 2

Mesmo com cadastro manual de produtos, o valor percebido compensa o esforco inicial.

### Hipotese 3

O maior valor esta em responder rapido, consultar estoque e avancar para reserva.

### Hipotese 4

O lojista aceita um painel simples, desde que consiga acompanhar conversas e assumir quando quiser.

## Principios do MVP

- simplicidade acima de completude;
- foco em fluxo comercial;
- mobile-first;
- linguagem humana;
- setup inicial sem excesso de complexidade;
- tecnologia escalavel, sem exagero de arquitetura na primeira entrega.

## Jornada Principal do Lojista

1. Descobre o produto pela landing page.
2. Demonstra interesse ou entra como piloto.
3. Cria conta.
4. Cadastra dados da loja.
5. Cadastra alguns produtos manualmente.
6. Conecta o WhatsApp.
7. Recebe a primeira conversa.
8. Acompanha a IA respondendo.
9. Visualiza consulta de estoque e possivel reserva.
10. Assume o atendimento se necessario.

## Jornada Principal do Cliente Final da Loja

1. Envia mensagem no WhatsApp da loja.
2. A IA interpreta a intencao.
3. A IA pede informacao faltante, se precisar.
4. O sistema consulta estoque.
5. A IA responde com disponibilidade e preco.
6. A IA tenta avancar para reserva ou continuidade da compra.
7. Se necessario, conversa e passada para um humano.

## Fluxo Central do MVP

### Fluxo 1 - Onboarding da loja

Objetivo:

colocar a loja em condicao minima de uso.

Passos:

1. cadastrar conta;
2. informar nome da loja;
3. informar nicho;
4. acessar painel inicial;
5. cadastrar produtos;
6. iniciar processo de conexao com WhatsApp.

### Fluxo 2 - Cadastro manual de produto

Objetivo:

dar base para respostas automatizadas.

Campos minimos esperados:

- nome do produto;
- categoria;
- descricao curta;
- preco;
- quantidade em estoque;
- SKU ou codigo interno opcional;
- observacoes de compatibilidade opcional.

### Fluxo 3 - Atendimento com IA

Objetivo:

responder com contexto sem parecer robo.

Estado atual:

- o fluxo ja identifica intencao, faltas de contexto, estagio comercial, urgencia e foco operacional;
- o sistema ja respeita atendimento humano e retomada manual para IA;
- o proximo salto de qualidade e passar a usar Gemini para classificar e responder melhor.

### Fluxo 4 - Handoff humano

Objetivo:

garantir que a IA nao fale por cima do vendedor.

Regras atuais:

1. quando a conversa vai para humano, a IA para de responder;
2. novas mensagens do cliente entram no historico sem disparar auto reply;
3. quando a conversa volta para a IA, o sistema tenta responder a ultima mensagem pendente do cliente;
4. se o vendedor responder pelo numero oficial conectado na Cloud API, a conversa deve ser levada para atendimento humano.

### Fluxo 5 - Audio no atendimento

Objetivo:

tratar conversas iniciadas ou continuadas por audio sem quebrar o fluxo comercial.

Estado atual:

1. a estrutura de mensagens ja aceita `texto` e `audio`;
2. o painel ja pode identificar origem da mensagem;
3. o webhook ja pode receber placeholder para audio.

Falta concluir:

1. transcrever o audio;
2. mandar o texto transcrito para o motor de IA;
3. guardar transcricao e origem original com clareza no historico.

## Proximo Passo Prioritario

Integrar Gemini com fallback local.

Objetivo do passo:

- melhorar leitura de contexto;
- classificar intencao com menos rigidez;
- responder melhor em saudacoes, horarios, negociacao e pedidos tecnicos;
- preparar a IA para trabalhar melhor depois da transcricao de audio.

Passos:

1. cliente envia mensagem;
2. sistema registra conversa;
3. IA classifica intencao;
4. IA detecta se faltam dados;
5. IA faz pergunta complementar;
6. sistema consulta estoque;
7. IA responde com disponibilidade;
8. IA sugere proximo passo comercial.

### Fluxo 4 - Reserva

Objetivo:

transformar conversa em acao pratica.

Passos:

1. cliente confirma interesse;
2. sistema cria reserva;
3. conversa recebe novo status;
4. lojista visualiza a reserva no painel;
5. atendimento pode seguir de forma humana ou automatizada.

### Fluxo 5 - Assumir conversa manualmente

Objetivo:

dar seguranca operacional ao lojista.

Passos:

1. lojista abre conversa;
2. clica em assumir atendimento;
3. sistema marca a conversa como humana;
4. IA deixa de responder automaticamente naquele contexto;
5. historico continua visivel.

## Funcionalidades do MVP

### 1. Landing page

Objetivo:

captar interesse comercial.

Requisitos:

- headline clara;
- proposta de valor;
- secoes de beneficios;
- demonstracao visual do fluxo;
- CTA principal;
- formulario de interesse.

### 2. Autenticacao

Objetivo:

permitir acesso seguro ao painel da loja.

Requisitos:

- cadastro;
- login;
- logout;
- recuperacao de acesso em etapa futura simples ou provisoria.

### 3. Estrutura multi-tenant

Objetivo:

garantir separacao de dados entre lojas.

Requisitos:

- cada conta vinculada a uma loja;
- produtos isolados por tenant;
- conversas isoladas por tenant;
- reservas isoladas por tenant;
- configuracoes isoladas por tenant.

### 4. Painel inicial

Objetivo:

servir como tela principal de operacao.

Requisitos:

- resumo basico;
- acesso rapido a produtos;
- acesso rapido a conversas;
- acesso rapido a reservas;
- interface clara no mobile.

### 5. Cadastro de produtos

Objetivo:

criar a base operacional do atendimento.

Requisitos:

- criar produto;
- editar produto;
- listar produtos;
- atualizar estoque;
- buscar produto por nome.

### 6. Conexao com WhatsApp

Objetivo:

habilitar trafego real de mensagens.

Requisitos:

- configuracao inicial de credenciais;
- webhook para recebimento de mensagens;
- identificacao do numero da loja;
- registro de mensagens recebidas.

### 7. Motor de IA

Objetivo:

interpretar e responder mensagens.

Requisitos:

- classificar intencao;
- identificar informacao faltante;
- montar contexto da conversa;
- consultar produtos relevantes;
- responder em tom humano;
- sugerir continuidade comercial;
- deixar espaco para transferencia humana.

### 8. Painel de conversas

Objetivo:

dar controle operacional ao lojista.

Requisitos:

- listar conversas;
- visualizar historico;
- exibir status;
- marcar como em atendimento humano;
- sinalizar conversa com reserva.

### 9. Reserva de produtos

Objetivo:

registrar intencao concreta do cliente.

Requisitos:

- criar reserva;
- vincular cliente, produto e conversa;
- informar quantidade;
- registrar data e status;
- permitir visualizacao no painel.

## Regras de Negocio do MVP

### Regra 1

A IA nao deve inventar disponibilidade quando nao houver dados suficientes.

### Regra 2

Quando faltar informacao essencial para identificar o produto, a IA deve perguntar antes de responder.

### Regra 3

Quando houver ambiguidade alta, o sistema deve priorizar seguranca e opcao de atendimento humano.

### Regra 4

Reserva so pode ser criada se houver produto identificado com clareza.

### Regra 5

Cada conversa pertence a uma loja e nao pode ser visivel para outra.

### Regra 6

Ao assumir atendimento humano, a resposta automatica deve ser interrompida naquela conversa.

### Regra 7

O sistema deve registrar historico minimo de mensagens e acoes importantes.

## Requisitos Nao Funcionais

### UX

- interface simples;
- boa experiencia em celular;
- baixa carga cognitiva;
- tom humano e comercial.

### Performance

- painel com carregamento rapido;
- interacoes principais sem travamentos perceptiveis;
- resposta da IA dentro de tempo aceitavel para conversa comercial.

### Seguranca

- autenticacao basica segura;
- isolamento multi-tenant;
- protecao de dados da loja;
- armazenamento organizado de credenciais e configuracoes.

### Escalabilidade Inicial

- base preparada para crescer por tenant;
- estrutura de dados pronta para futuras integracoes;
- desacoplamento razoavel entre canais, IA e catalogo.

## Dados Principais do MVP

Entidades minimas esperadas:

- usuario;
- loja;
- produto;
- estoque;
- conversa;
- mensagem;
- reserva;
- configuracao de integracao;
- log de eventos principais.

## Campos Minimos por Entidade

### Loja

- id;
- nome;
- nicho;
- telefone principal;
- created_at.

### Usuario

- id;
- loja_id;
- nome;
- email;
- role basica.

### Produto

- id;
- loja_id;
- nome;
- categoria;
- descricao;
- preco;
- estoque_atual;
- sku opcional;
- compatibilidade opcional;
- ativo.

### Conversa

- id;
- loja_id;
- identificador do cliente;
- status;
- origem;
- atendimento_humano ativo ou nao;
- created_at;
- updated_at.

### Mensagem

- id;
- conversa_id;
- tipo de autor;
- conteudo;
- timestamp.

### Reserva

- id;
- loja_id;
- conversa_id;
- produto_id;
- quantidade;
- status;
- observacao;
- created_at.

## Status Principais

### Conversa

- nova;
- aguardando_dados;
- respondida_pela_ia;
- aguardando_humano;
- em_atendimento_humano;
- reservada;
- encerrada.

### Reserva

- criada;
- confirmada;
- retirada;
- cancelada.

## Criterios de Aceitacao por Bloco

### Landing page

Pronto quando:

- comunica claramente o valor do produto;
- possui CTA funcional;
- pode captar interesse real.

### Autenticacao e tenant

Pronto quando:

- um lojista consegue criar conta e entrar;
- os dados ficam separados por loja.

### Cadastro de produtos

Pronto quando:

- o lojista consegue cadastrar, editar e visualizar produtos;
- a IA pode consultar esses dados.

### WhatsApp e conversas

Pronto quando:

- mensagens chegam ao sistema;
- conversas ficam registradas por loja;
- o historico basico fica acessivel.

### IA

Pronto quando:

- consegue interpretar pedidos simples;
- faz perguntas complementares relevantes;
- consulta estoque antes de responder com seguranca;
- mantem tom natural.

### Reservas

Pronto quando:

- uma conversa pode gerar reserva;
- a reserva aparece no painel;
- o lojista consegue acompanhar esse status.

## Indicadores de Sucesso do MVP

### Produto

- tempo medio de resposta reduzido;
- percentual de conversas respondidas pela IA;
- numero de reservas geradas;
- taxa de uso do painel.

### Negocio

- numero de leads captados;
- numero de lojas piloto ativas;
- interesse em continuar usando;
- sinais iniciais de disposicao para pagamento.

### Qualidade

- baixo numero de respostas erradas graves;
- boa compreensao de contexto nos casos basicos;
- facilidade de onboarding.

## Riscos do MVP

### Risco 1 - catalogo fraco prejudicar a IA

Resposta:

manter cadastro simples, mas com campos suficientes para consultas basicas.

### Risco 2 - experiencia parecer artificial

Resposta:

controlar tom da IA, evitar respostas roboticas e priorizar clareza.

### Risco 3 - lojista desistir no onboarding

Resposta:

reduzir ao maximo a configuracao inicial e focar no primeiro valor rapido.

### Risco 4 - fluxo comercial nao avancar

Resposta:

fazer a IA sempre buscar proximo passo util, como confirmar compatibilidade, disponibilidade ou reserva.

## Dependencias do MVP

- conta e projeto no Supabase;
- infraestrutura Next.js e Vercel;
- acesso a Gemini API;
- configuracao da Meta WhatsApp Cloud API;
- definicao de fluxo minimo de onboarding;
- base inicial de prompts e regras de atendimento.

## Ordem Recomendada de Implementacao do MVP

1. landing page com captura;
2. autenticacao;
3. modelagem multi-tenant;
4. painel inicial;
5. cadastro de produtos;
6. estoque basico;
7. painel de conversas;
8. integracao WhatsApp;
9. motor de IA;
10. reservas;
11. validacao com pilotos.

## Definicao de MVP Pronto

O MVP sera considerado pronto quando uma loja piloto conseguir:

1. entrar no sistema;
2. cadastrar seu catalogo basico;
3. conectar o WhatsApp;
4. receber mensagens reais;
5. deixar a IA responder casos simples;
6. acompanhar conversas no painel;
7. registrar pelo menos uma reserva;
8. assumir atendimento humano quando precisar.

## Proximo Documento Recomendado

Depois deste PRD, o passo mais util e criar um documento de arquitetura funcional e tecnica contendo:

- modulos do sistema;
- relacoes entre entidades;
- rotas principais;
- estrutura de banco;
- servicos e integracoes;
- estrategia do motor de IA;
- convencoes de implementacao.

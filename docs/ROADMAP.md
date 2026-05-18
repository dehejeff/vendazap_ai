# Roadmap do VendaZap AI

## Objetivo do Roadmap

Este roadmap existe para organizar o VendaZap AI como produto e como oferta comercial.

Ele precisa responder com clareza:

- o que vamos entregar no MVP;
- o que ainda nao entra no inicio;
- o que precisa ser aprimorado para o produto ficar realmente forte;
- como isso se transforma em planos e precos.

A logica principal e simples:

1. vender uma promessa clara;
2. entregar um MVP que gere valor real;
3. aprender com clientes piloto;
4. transformar o MVP em produto confiavel e escalavel;
5. evoluir para planos com mais profundidade e ticket maior.

## Norte do Produto

A pergunta central continua sendo:

"Isso ajuda a loja a vender mais no WhatsApp sem perder clientes?"

Se a resposta for fraca, nao e prioridade.

## Estado Atual do Produto

Data de referencia:

- 17/05/2026

O VendaZap AI ja saiu da fase de conceito visual e entrou numa base funcional de MVP.

Hoje o produto ja tem:

- autenticacao;
- estrutura multi-tenant;
- onboarding de loja;
- catalogo com persistencia real;
- painel de conversas;
- funil comercial inicial;
- atendimento humano com pausa da IA;
- Supabase como banco principal;
- base de webhook e simulacao para WhatsApp;
- preparacao estrutural para mensagens por audio.

O principal gargalo deixou de ser front e passou a ser inteligencia operacional.

Por isso, o proximo passo prioritario mudou para:

- integrar Gemini para melhorar entendimento de contexto e respostas.

## Principios de Priorizacao

Antes de construir qualquer funcionalidade, precisamos perguntar:

1. Isso ajuda o lojista a vender mais?
2. Isso reduz tempo de resposta ou evita perda de cliente?
3. Isso melhora a operacao diaria da loja?
4. Isso aumenta confianca no produto?
5. Isso precisa entrar agora ou pode esperar a validacao?

## Oferta Inicial do MVP

### O que o VendaZap AI vai oferecer no inicio

O MVP deve ser vendido como:

"Uma IA para responder clientes no WhatsApp, consultar estoque e ajudar a loja a nao perder vendas."

### Promessa comercial do MVP

No inicio, a promessa precisa ser objetiva e realista:

- responder clientes mais rapido;
- evitar conversas esquecidas;
- automatizar perguntas repetitivas;
- consultar estoque durante o atendimento;
- ajudar a avancar para reserva;
- permitir atendimento humano quando necessario.

### O que o MVP entrega de verdade

- landing page com captura de leads;
- autenticacao da loja;
- onboarding simples;
- ambiente multi-tenant;
- cadastro manual de produtos;
- estoque basico;
- conexao com WhatsApp;
- recebimento de mensagens;
- painel de conversas;
- IA interpretando mensagens;
- IA pedindo informacoes faltantes;
- consulta de estoque;
- resposta automatica;
- reserva de produtos;
- opcao de atendimento humano assumir a conversa.

O que ja esta efetivamente implementado nesta etapa:

- persistencia em Supabase para usuarios, produtos, conversas, mensagens e leads;
- painel refinado para mobile e desktop;
- catalogo com busca e edicao;
- estagios comerciais no painel;
- handoff humano com retorno manual para IA.

### O que o MVP nao promete ainda

No inicio, precisamos vender o produto sem inflar expectativa.

Por isso, o MVP nao deve prometer:

- integracao com ERP logo de cara;
- importacao em massa no primeiro momento;
- analytics profundos;
- automacoes comerciais avancadas;
- voz;
- omnichannel;
- campanhas automaticas;
- gestao complexa de equipe;
- operacao enterprise.

Atualizacao importante:

- a base para audio ja entrou no produto;
- o que ainda nao pode ser prometido e a transcricao real e a interpretacao comercial madura desse audio.

## Como o MVP Deve Ser Posicionado Comercialmente

O VendaZap AI nao deve ser vendido como:

- chatbot;
- automacao genérica;
- CRM;
- ERP;
- ferramenta tecnica.

O VendaZap AI deve ser vendido como:

- vendedor inteligente para WhatsApp;
- atendimento que responde rapido;
- sistema que ajuda a nao perder vendas;
- operacao simples para pequenas e medias lojas.

## Fase 0 - Fundacao e Direcao

Objetivo:

definir claramente o produto, publico, promessa e ordem de construcao.

Entregas:

- visao do produto;
- roadmap;
- PRD do MVP;
- posicionamento;
- publico-alvo inicial;
- diretrizes de UX, copy e marca.

Resultado esperado:

- base clara para construir sem dispersao.

## Fase 1 - Aquisicao e Captura de Interesse

Objetivo:

validar interesse comercial e gerar base de leads.

Entregas:

- landing page premium;
- copy forte;
- demonstracao simulada;
- CTA para lista de espera e demo;
- captura de leads;
- analytics basico.

Hipoteses validadas:

- lojistas entendem a proposta;
- a promessa gera interesse;
- existe demanda suficiente para lista de espera.

Metricas sugeridas:

- taxa de clique no CTA;
- taxa de envio de formulario;
- custo por lead no futuro;
- nichos com maior interesse.

## Fase 2 - MVP Operacional

Objetivo:

colocar de pe a primeira versao que entrega valor real.

Entregas:

- autenticacao;
- multi-tenant;
- painel inicial;
- cadastro de produtos;
- estoque basico;
- conexao com WhatsApp;
- painel de conversas;
- IA para atendimento inicial;
- consulta de estoque;
- reserva;
- atendimento humano.

Estado atual da fase:

- em andamento avancado;
- boa parte das entregas centrais ja foi implementada;
- o foco agora e elevar a qualidade de entendimento da IA e consolidar o fluxo real com WhatsApp.

Hipoteses validadas:

- o lojista consegue usar;
- a IA ajuda em casos reais;
- o produto economiza tempo;
- a loja enxerga valor pratico.

Metricas sugeridas:

- tempo medio de resposta;
- quantidade de conversas atendidas;
- reservas geradas;
- taxa de ativacao de lojas.

## Fase 3 - Validacao com Clientes Piloto

Objetivo:

entender se o MVP resolve uma dor forte o bastante para gerar recorrencia e cobranca.

Entregas:

- onboarding assistido;
- acompanhamento de uso;
- coleta de feedback;
- ajustes no produto;
- definicao inicial de planos;
- validacao de faixa de preco.

Hipoteses validadas:

- o fluxo central faz sentido no dia a dia;
- o lojista quer continuar usando;
- a percepcao de valor permite cobranca mensal.

Metricas sugeridas:

- lojas ativas por semana;
- quantidade de conversas por loja;
- taxa de permanencia;
- disposicao para pagar;
- principais objeções comerciais.

## Fase 4 - Produto Mais Forte e Mais Confiavel

Objetivo:

tirar o produto do status de MVP funcional e levar para uma operacao mais robusta.

Entregas prioritarias:

- importacao CSV;
- historico de clientes;
- produtos similares;
- fotos de produtos;
- interpretacao de audio no WhatsApp;
- promocoes automaticas simples;
- notificacoes internas;
- indicadores operacionais basicos;
- multiplos vendedores;
- melhorias na qualidade da IA;
- funil comercial por conversa;
- automacoes por status operacional;
- mais controle de regras de atendimento.

Observacao:

- algumas entregas dessa fase ja comecaram a entrar antes do previsto, como funil comercial por conversa e automacoes basicas por status;
- isso aconteceu porque essas camadas ficaram essenciais para o MVP funcionar de forma convincente.

## Proximo Passo Imediato - Gemini

Objetivo:

substituir parte da rigidez do motor local por uma camada de entendimento mais forte, sem perder previsibilidade operacional.

Escopo da primeira integracao:

- usar Gemini para classificar intencao;
- usar Gemini para sugerir estagio comercial;
- usar Gemini para gerar resposta contextual;
- mandar para o modelo apenas contexto util da conversa e catalogo relevante;
- manter fallback local quando houver falha, timeout ou resposta insegura.

Regras obrigatorias da integracao:

- nao inventar estoque;
- nao inventar preco;
- nao prometer desconto sem regra da loja;
- nao responder por cima do atendimento humano;
- respeitar horario e politicas quando essas configuracoes existirem.

Resultado esperado:

- respostas menos roboticas;
- melhor leitura de perguntas ambíguas;
- melhor comportamento em saudacoes, horarios, negociacao e retomada de contexto;
- base pronta para receber transcricao real de audio logo depois.

Resultado esperado:

- onboarding mais facil;
- menos dependencia de cadastro manual;
- mais utilidade diaria;
- maior confianca para cobrar planos mais altos.

## Fase 5 - Produto 100% Funcional na Pratica

Aqui "100% funcional" nao significa "produto final infinito".

Significa que o VendaZap AI ja cumpre muito bem sua proposta principal e pode operar de forma confiavel no dia a dia de uma loja real.

### O que o produto precisa ter para ser considerado maduro

- onboarding simples e rapido;
- catalogo facil de alimentar;
- IA consistente nos casos principais;
- historico e contexto por cliente;
- reservas confiaveis;
- painel bom no celular;
- multiplos usuarios;
- notificacoes basicas;
- indicadores essenciais;
- fluxo claro para assumir atendimento humano;
- estabilidade nas integracoes principais;
- menos friccao operacional para a loja.

### O que entra nessa etapa de maturidade

- importacao CSV refinada;
- regras de compatibilidade melhores;
- promocoes e ofertas basicas;
- historico de interacoes por cliente;
- transcricao e leitura de pedidos enviados por audio;
- filtros melhores no painel;
- mais visibilidade sobre reservas e status;
- controles de equipe;
- melhoria continua do motor de IA;
- configuracoes por nicho;
- relatorios simples de operacao e conversao.

## Fase 6 - Escala e Expansao de Ticket

Objetivo:

reduzir trabalho manual e aumentar profundidade do produto.

Entregas:

- integracao Tiny ERP;
- integracao Bling;
- integracao Omie;
- pagamentos PIX;
- interpretacao de audio com mais contexto comercial;
- resposta por voz no futuro, se fizer sentido para o lojista;
- campanhas automaticas;
- recuperacao de carrinho;
- IA de upsell e cross-sell;
- dashboard de vendas;
- metricas mais avancadas;
- multi-loja;
- multi-unidade;
- novos canais no futuro.

Resultado esperado:

- aumento de ticket medio;
- maior retencao;
- mais barreira competitiva;
- posicionamento mais forte no mercado.

## O Que Vamos Vender Inicialmente

### Oferta de entrada

No comeco, o mais inteligente e vender uma oferta simples:

"IA para sua loja responder clientes no WhatsApp, consultar estoque e nao perder vendas."

### Estrategia de entrada

No inicio, nao vale abrir muitos planos complexos.

O melhor caminho e:

1. validar com lista de espera;
2. onboardar poucos clientes piloto;
3. cobrar de forma simples;
4. aprender uso, volume e valor percebido;
5. depois estruturar os planos definitivos.

## Planos Iniciais Recomendados

### Plano 1 - Piloto

Objetivo:

colocar as primeiras lojas para dentro e aprender rapido.

Publico:

primeiros clientes validadores.

Faixa de preco sugerida:

- R$97 a R$197 por mes

O que incluir:

- 1 loja;
- 1 numero de WhatsApp;
- cadastro manual de produtos;
- estoque basico;
- painel de conversas;
- IA respondendo casos simples;
- reserva de produtos;
- suporte mais proximo.

Observacao:

esse plano existe mais para aprender e gerar prova social do que para maximizar margem.

### Plano 2 - Basico

Objetivo:

ser a porta de entrada comercial apos a validacao inicial.

Publico:

pequenos lojistas.

Faixa de preco sugerida:

- R$197 a R$297 por mes

O que incluir:

- 1 loja;
- 1 numero de WhatsApp;
- painel completo do MVP;
- cadastro manual de produtos;
- estoque basico;
- IA para atendimento e reserva;
- atendimento humano;
- suporte padrao.

### Plano 3 - Pro

Objetivo:

atender lojas com volume maior e mais necessidade operacional.

Publico:

lojas com operacao mais intensa no WhatsApp.

Faixa de preco sugerida:

- R$397 a R$597 por mes

O que incluir:

- tudo do Basico;
- multiplos usuarios;
- importacao CSV;
- historico de clientes;
- produtos similares;
- notificacoes internas;
- indicadores basicos;
- prioridade de suporte.

### Plano 4 - Avancado

Objetivo:

capturar lojas mais estruturadas e com necessidade de integracao.

Publico:

operacoes com maior volume e maior dependencia do canal.

Faixa de preco sugerida:

- R$797 a R$1.497 por mes

O que incluir:

- tudo do Pro;
- integracoes com ERP quando prontas;
- promocoes automáticas;
- mais controles de equipe;
- regras mais avancadas;
- onboarding assistido;
- suporte prioritario.

## Estrategia de Preco Recomendada

### Curto prazo

No curto prazo, o ideal nao e discutir detalhe de franquia complexa.

O ideal e vender valor percebido:

- menos cliente perdido;
- mais velocidade;
- mais organizacao;
- mais atendimento sem aumentar equipe.

### Modelo de cobranca sugerido no inicio

Inicialmente, o mais simples e:

- mensalidade fixa por loja

Depois, podemos evoluir para:

- mensalidade + limite de conversas;
- mensalidade + usuarios extras;
- mensalidade + modulos;
- setup de onboarding em casos avancados.

### Faixa de setup recomendada

Quando houver onboarding assistido ou configuracao mais pesada, pode fazer sentido cobrar:

- R$300 a R$1.000 de setup

Isso depende do nivel de apoio necessario para colocar a loja em operacao.

## O Que Aprimorar Para o Produto Ficar Forte de Verdade

As principais frentes de evolucao devem ser:

### 1. Qualidade da IA

- entender melhor contexto;
- perguntar menos e melhor;
- errar menos em ambiguidades;
- vender com mais naturalidade;
- interpretar texto e audio com consistencia.

### 2. Facilidade de onboarding

- menos configuracao manual;
- importacao mais simples;
- templates por nicho;
- inicio de uso mais rapido.

### 3. Operacao do lojista

- painel mais claro;
- filtros melhores;
- reservas mais visiveis;
- historico por cliente;
- mais controle sobre equipe e status.

### 4. Confiabilidade

- menos falhas na integracao;
- mais estabilidade no atendimento;
- logs melhores;
- rastreabilidade das conversas e reservas.

### 5. Valor comercial

- promocoes;
- produtos similares;
- upsell;
- cross-sell;
- metricas de conversao.

## Ordem Recomendada de Execucao Imediata

Para manter foco, a ordem mais saudavel agora e:

1. landing page e captura real;
2. autenticacao e multi-tenant;
3. cadastro de produtos;
4. estoque basico;
5. painel de conversas;
6. integracao WhatsApp;
7. motor de IA;
8. reservas;
9. pilotos pagos ou semi-pagos;
10. importacao CSV e historico;
11. estrutura de planos comerciais;
12. integracoes e expansao.

## O Que Nao Deve Entrar Agora

Itens importantes, mas fora do foco imediato:

- ERP logo no inicio;
- dashboard complexo;
- campanhas sofisticadas;
- resposta por voz no inicio;
- multi-unidade cedo demais;
- omnichannel;
- automacoes muito profundas antes da validacao.

## Definicao de Pronto Por Estagio

### MVP pronto

quando a loja consegue:

- entrar no sistema;
- cadastrar produtos;
- conectar o WhatsApp;
- receber mensagens;
- deixar a IA responder casos simples;
- consultar estoque;
- gerar reserva;
- assumir atendimento humano.

### Produto forte

quando a loja consegue:

- operar diariamente com confianca;
- alimentar o catalogo sem friccao excessiva;
- acompanhar conversas e reservas com clareza;
- perceber ganho real de velocidade e organizacao.

### Produto maduro

quando alem de funcionar bem, o sistema:

- reduz atrito operacional;
- melhora conversao;
- suporta mais volume;
- permite planos com ticket maior;
- cria barreira competitiva.

## Riscos Principais

### Risco 1 - parecer chatbot barato

Mitigacao:

- copy correta;
- UX premium;
- foco em vendas;
- tom humano.

### Risco 2 - prometer mais do que o MVP entrega

Mitigacao:

- promessa comercial clara;
- escopo bem definido;
- onboarding transparente.

### Risco 3 - preco errado no inicio

Mitigacao:

- comecar simples;
- validar com pilotos;
- ajustar faixa de cobranca com base em uso e valor percebido.

### Risco 4 - excesso de complexidade antes da hora

Mitigacao:

- priorizar valor imediato;
- deixar integracoes e profundidade para depois da validacao.

## Fechamento

O VendaZap AI deve nascer como um produto simples de entender e forte de perceber valor.

Primeiro, ele precisa provar que ajuda a loja a responder mais rapido e perder menos clientes.

Depois, precisa evoluir para um sistema mais completo, confiavel e dificil de substituir.

O caminho mais inteligente nao e tentar ser tudo no inicio.

O caminho mais inteligente e:

- vender bem;
- entregar o essencial;
- aprender rapido;
- melhorar com base em uso real;
- transformar esse MVP em um produto cada vez mais indispensavel.

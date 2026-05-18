# Supabase Setup

## Objetivo

Preparar o VendaZap AI para sair da persistência local em JSON e passar a usar Supabase como banco principal do MVP.

## Status Atual

Data de referencia:

- 17/05/2026

Esta etapa ja foi executada no projeto atual.

Ja concluido:

- projeto Supabase criado;
- variaveis de ambiente configuradas localmente;
- schema SQL aplicado;
- migracao inicial executada;
- `auth`, `products`, `conversations` e `leads` lendo e escrevendo no Supabase.

O fallback local continua no codigo como contingencia de desenvolvimento.

## Variáveis de ambiente

Crie um arquivo `.env.local` com:

```env
NEXT_PUBLIC_SUPABASE_URL=https://dgksvsxzbwrmgaiuvljg.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua_publishable_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
```

## O que já ficou preparado

- dependência oficial `@supabase/supabase-js`
- configuração pública e server-side em:
  - `lib/supabase/config.ts`
  - `lib/supabase/browser.ts`
  - `lib/supabase/server.ts`
- schema inicial em `supabase/schema.sql`

## Estruturas previstas no banco

- `users`
- `products`
- `conversations`
- `conversation_messages`
- `leads`

## Estado atual

O sistema ainda continua com fallback local, para nao quebrar o MVP enquanto a migracao definitiva amadurece.

## Próximo passo para concluir a migração

1. aplicar `supabase/schema.sql` no SQL Editor do projeto
2. adicionar a `SUPABASE_SERVICE_ROLE_KEY` no `.env.local`
3. executar `npm run migrate:supabase` se quiser importar os JSONs locais atuais
4. migrar `auth`, `products`, `conversations` e `leads` para ler/escrever no Supabase [concluido]
5. manter fallback local apenas como contingência temporária

## Observação importante

A `publishable key` sozinha nao e suficiente para a camada server do MVP, porque hoje o sistema faz escrita administrativa de usuarios, produtos, conversas e mensagens no backend.

## Proximo Passo Depois do Supabase

Com a persistencia real pronta, a proxima frente tecnica prioritária passa a ser:

- integrar Gemini como camada de entendimento e resposta contextual;
- depois conectar essa camada ao fluxo de audio transcrito;
- e por fim consolidar o fluxo operacional real da WhatsApp Cloud API.

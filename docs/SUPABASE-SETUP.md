# Supabase Setup

## Objetivo

Preparar o VendaZap AI para sair da persistência local em JSON e passar a usar Supabase como banco principal do MVP.

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

O sistema ainda continua com fallback local, para não quebrar o MVP enquanto a migração está em andamento.

## Próximo passo para concluir a migração

1. aplicar `supabase/schema.sql` no SQL Editor do projeto
2. adicionar a `SUPABASE_SERVICE_ROLE_KEY` no `.env.local`
3. executar `npm run migrate:supabase` se quiser importar os JSONs locais atuais
4. migrar `auth`, `products`, `conversations` e `leads` para ler/escrever no Supabase
5. manter fallback local apenas como contingência temporária

## Observação importante

A `publishable key` sozinha não é suficiente para a camada server do MVP, porque hoje o sistema faz escrita administrativa de usuários, produtos, conversas e mensagens no backend.

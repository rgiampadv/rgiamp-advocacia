# Publicar o site RGF Advocacia

Guia simples para publicar o site em **www.rgiamp.adv.br** e permitir que amigos e família testem como usuários.

---

## Opção A: Publicar na Vercel (recomendado)

### 1. Subir o código para GitHub

1. Crie um repositório em [github.com](https://github.com/new) (ex.: `rgiamp-advocacia`).
2. Na pasta do projeto, rode:

```bash
git init
git add .
git commit -m "Site RGF Advocacia"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/rgiamp-advocacia.git
git push -u origin main
```

### 2. Conectar à Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login (pode usar sua conta GitHub).
2. Clique em **Add New** → **Project**.
3. Importe o repositório do GitHub.
4. **Não altere** o Framework (Next.js deve ser detectado).
5. Configure as variáveis de ambiente (veja seção abaixo).
6. Clique em **Deploy**.

Após o deploy, o site ficará em `https://seu-projeto.vercel.app`.

### 3. Variáveis de ambiente na Vercel

No projeto Vercel: **Settings** → **Environment Variables**. Adicione:

| Variável | Obrigatório | Valor |
|----------|-------------|-------|
| `DATABASE_URL` | Sim* | `postgresql://...` (Supabase ou Neon) |
| `NEXTAUTH_SECRET` | Sim* | Gere com: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Sim | `https://www.rgiamp.adv.br` |
| `NEXT_PUBLIC_SITE_URL` | Recomendado | `https://www.rgiamp.adv.br` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Opcional | `5511974367189` |
| `OPENAI_API_KEY` | Opcional (chat) | `sk-...` |
| `ADMIN_EMAILS` | Blog (publicar posts) | `seu@email.com` (vírgula para vários) |

\* Obrigatório se usar agendamento, login ou área do cliente.

### 4. Configurar o domínio www.rgiamp.adv.br

1. No projeto Vercel: **Settings** → **Domains**.
2. Clique em **Add** e digite: `www.rgiamp.adv.br`.
3. A Vercel mostrará os registros DNS que você precisa configurar no seu provedor de domínio (.adv.br).

**Onde configurar o DNS**

- Se o domínio **rgiamp.adv.br** está em um provedor (ex.: Registro.br, GoDaddy, Hostinger), acesse o painel de DNS desse provedor.
- Adicione um registro **CNAME** apontando `www` para `cname.vercel-dns.com`.
- Ou use os registros A que a Vercel sugerir (geralmente 76.76.21.21).

4. Depois de salvar, use os mesmos valores em `NEXTAUTH_URL` e `NEXT_PUBLIC_SITE_URL`:
   - `NEXTAUTH_URL` = `https://www.rgiamp.adv.br`
   - `NEXT_PUBLIC_SITE_URL` = `https://www.rgiamp.adv.br`

5. Aguarde a propagação do DNS (pode levar alguns minutos até 48h).

---

## Opção B: Testar com URL da Vercel (sem domínio próprio)

1. Siga os passos 1 e 2 da Opção A (GitHub + Vercel).
2. Use `NEXTAUTH_URL` e `NEXT_PUBLIC_SITE_URL` com a URL gerada pela Vercel, por exemplo:
   - `https://seu-projeto.vercel.app`
3. Compartilhe esse link com amigos e família para testes.

Quando o domínio estiver pronto, adicione-o na Vercel (passo 4) e atualize essas variáveis para `https://www.rgiamp.adv.br`.

---

## Banco de dados (para agendamento, login e área do cliente)

1. Crie um banco PostgreSQL gratuito em [Supabase](https://supabase.com) ou [Neon](https://neon.tech).
2. Copie a string de conexão (Connection String) e coloque em `DATABASE_URL`.
3. No seu PC, com o `.env` apontando para esse banco, rode:

```bash
npx prisma db push
```

Isso cria as tabelas necessárias. Não é preciso repetir depois de cada deploy.

### Admin do blog

Para criar e editar posts do blog, configure `ADMIN_EMAILS` no `.env` com o(s) e-mail(s) que terão permissão (separados por vírgula). Depois de logado, acesse `/admin/blog` (ex.: `https://www.rgiamp.adv.br/pt/admin/blog`).

---

## Checklist antes de publicar

- [ ] Código no GitHub
- [ ] Projeto importado na Vercel
- [ ] `NEXTAUTH_SECRET` e `NEXTAUTH_URL` configurados
- [ ] `NEXT_PUBLIC_SITE_URL` = URL final do site
- [ ] Banco criado e `DATABASE_URL` configurado (se usar agendamento/login)
- [ ] Tabelas criadas com `npx prisma db push`
- [ ] Domínio **www.rgiamp.adv.br** configurado (DNS) e adicionado na Vercel

---

## Testar local em modo produção

```bash
npm run build
npm run start
```

Abra `http://localhost:3000` no navegador.

---

**RGF Advocacia** — Next.js, TypeScript, Prisma, next-intl. Conformidade OAB e LGPD.

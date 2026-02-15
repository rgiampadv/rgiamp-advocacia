# Publicar o site (deploy)

## 1. Vercel (recomendado)

1. Crie uma conta em [vercel.com](https://vercel.com) e conecte o repositório Git do projeto.
2. Na importação do projeto, **não** mude o Framework Preset (Next.js já é detectado).
3. Configure as **variáveis de ambiente** (Environment Variables) no painel do projeto:

| Variável | Obrigatório | Exemplo / Observação |
|----------|-------------|----------------------|
| `DATABASE_URL` | Sim (para agendamento, login, área do cliente) | `postgresql://...` (Supabase ou Neon) |
| `NEXTAUTH_SECRET` | Sim (se usar área do cliente) | Gere com: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Sim | `https://www.rgiamp.adv.com` |
| `NEXT_PUBLIC_SITE_URL` | Recomendado (SEO) | `https://www.rgiamp.adv.com` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Opcional | `5511974367189` (já é o padrão) |
| `OPENAI_API_KEY` | Opcional (chat IA) | `sk-...` |
| Demais | Opcional | Veja `.env.example` |

4. Clique em **Deploy**. Após o build, o site ficará em `https://seu-projeto.vercel.app`.

5. **Domínio:** o site está configurado para **www.rgiamp.adv.com**. Em Settings → Domains na Vercel, adicione esse domínio e garanta `NEXTAUTH_URL` e `NEXT_PUBLIC_SITE_URL` com o mesmo valor.

---

## 2. Antes de publicar

- [ ] Banco PostgreSQL criado (Supabase/Neon) e `DATABASE_URL` no .env da Vercel.
- [ ] **Criar tabelas no banco:** com `DATABASE_URL` de produção no .env, rode **uma vez** no seu PC: `npx prisma db push` (ou `npx prisma migrate dev` para gerar migrations e depois `npx prisma migrate deploy` em produção).
- [ ] `NEXTAUTH_SECRET` e `NEXTAUTH_URL` configurados.
- [ ] Se for usar chat: `OPENAI_API_KEY` configurado.
- [ ] Quando tiver Instagram profissional: `NEXT_PUBLIC_INSTAGRAM_URL` no .env.

---

## 3. Rodar local em modo produção

```bash
npm run build
npm run start
```

Abre em `http://localhost:3000`.

---

**RGF Advocacia** — Next.js 16, TypeScript, Prisma, next-intl, conformidade OAB e LGPD.

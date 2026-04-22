# Configuração de Autenticação com Google

## Passo 1: Criar Credenciais do Google OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá para "Credenciais" (Credentials)
4. Clique em "Criar Credenciais" > "ID do Cliente OAuth"
5. Selecione "Aplicativo da Web"
6. Configure os URIs autorizados:
   - **Origem JavaScript autorizada:**
     - `http://localhost:3000` (desenvolvimento)
     - `https://seu-dominio.com` (produção)
   - **URI de redirecionamento autorizados:**
     - `http://localhost:3000/api/auth/callback/google` (desenvolvimento)
     - `https://seu-dominio.com/api/auth/callback/google` (produção)
7. Copie o **Client ID** e **Client Secret**


## Passo 2: Configurar Variáveis de Ambiente

1. Abra o arquivo `.env.local` na raiz do projeto
2. Preencha com suas credenciais:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=gera-uma-chave-segura-aqui-use-openssl-rand-hex-32
GOOGLE_CLIENT_ID=seu-client-id-aqui
GOOGLE_CLIENT_SECRET=seu-client-secret-aqui
```

### Para gerar NEXTAUTH_SECRET:
```bash
openssl rand -hex 32
```

## Passo 3: Emails Autorizados

Os seguintes emails têm permissão para acessar a aplicação:
- `alysson@arcom.com.br`
- `cleber@arcom.com.br`

Para adicionar mais emails, edite o arquivo `app/api/auth/[...nextauth]/route.ts`:

```typescript
const AUTHORIZED_EMAILS = ['email1@arcom.com.br', 'email2@arcom.com.br'];
```

## Passo 4: Rodar a Aplicação

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## Produção

Para fazer deploy em produção:

1. Atualize `NEXTAUTH_URL` com seu domínio real
2. Gere um novo `NEXTAUTH_SECRET` seguro
3. Configure as variáveis no seu serviço de hosting (Vercel, Netlify, etc.)
4. Atualize as URLs autorizadas no Google Cloud Console

## Troubleshooting

### "Acesso Negado"
- Verifique se o email da sua conta Google está autorizado
- Certifique-se de que está usando um dos emails autorizados

### "Erro ao fazer login"
- Verifique se `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` estão corretos
- Verifique se as URIs de redirecionamento estão configuradas no Google Cloud Console
- Limpe o cache do navegador e tente novamente

### Variáveis de ambiente não carregadas
- Reinicie o servidor de desenvolvimento (`npm run dev`)
- Certifique-se de que o arquivo `.env.local` existe e está no diretório raiz

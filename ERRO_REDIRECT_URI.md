# 🔑 Erro: redirect_uri_mismatch

## O Problema
A aplicação está tentando fazer login com Google, mas o URI não está registrado.

```
Tentando usar: http://localhost:3000/api/auth/callback/google
Erro: Não encontrado no Google Cloud Console ❌
```

## ✅ Solução em 5 Passos

### PASSO 1️⃣: Abra o Google Cloud Console
👉 https://console.cloud.google.com/

### PASSO 2️⃣: Vá para Credenciais
- Menu esquerdo → **Credenciais**
- Procure pelo **Client ID** tipo "Aplicativo da Web"
- **Clique nele** para editar

### PASSO 3️⃣: Adicione o URI de Redirecionamento
Na seção **"URIs de redirecionamento autorizados"**, adicione:
```
http://localhost:3000/api/auth/callback/google
```

👉 **Clique em "Salvar"**

### PASSO 4️⃣: Copie as Credenciais
- **Client ID** → copie
- **Client Secret** → copie

### PASSO 5️⃣: Atualize o .env.local
Abra o arquivo `.env.local` na raiz do projeto:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=seu-secret-de-32-caracteres
GOOGLE_CLIENT_ID=seu-client-id-aqui
GOOGLE_CLIENT_SECRET=seu-client-secret-aqui
```

---

## 🚀 Para Gerar NEXTAUTH_SECRET

No terminal, execute:
```bash
openssl rand -hex 32
```

Copie o resultado e coloque em `NEXTAUTH_SECRET=`

---

## ⏳ Aguarde e Teste

1. **Aguarde 5-10 minutos** para Google propagar as mudanças
2. **Limpe o cache do navegador** (Ctrl+Shift+Delete)
3. **Reinicie o servidor:**
   ```bash
   npm run dev
   ```
4. **Acesse** http://localhost:3000

---

## 🔍 Verificar Configuração

Para verificar se tudo está correto:
```bash
./check-env.sh
```

---

## 📋 Checklist

- [ ] Registrei o URI: `http://localhost:3000/api/auth/callback/google` no Google Cloud Console
- [ ] Copiei o Client ID para `.env.local`
- [ ] Copiei o Client Secret para `.env.local`
- [ ] Criei NEXTAUTH_SECRET com `openssl rand -hex 32`
- [ ] Atualizei NEXTAUTH_URL para `http://localhost:3000`
- [ ] Aguardei 5-10 minutos
- [ ] Limpei o cache do navegador
- [ ] Reiniciei o servidor (npm run dev)

---

## ❓ FAQ

**P: Recebi 400 novamente depois de tudo?**
R: Aguarde mais 5 minutos. Às vezes o Google demora mais para propagar as mudanças.

**P: Onde encontro meu Client ID e Secret?**
R: 
1. https://console.cloud.google.com/
2. Credenciais (menu esquerdo)
3. Procure "OAuth 2.0 Client ID"
4. Clique nele

**P: Como adiciono um segundo URI para produção?**
R: Na mesma seção "URIs de redirecionamento autorizados", adicione uma nova linha:
```
https://seu-dominio.com/api/auth/callback/google
```

**P: Meu navegador não está aceitando os cookies?**
R: Tente em uma aba privada (incógnito). Alguns navegadores bloqueiam cookies em localhost.

---

## 🎯 Resumo Visual

```
Google Cloud Console
    ↓
Credenciais → OAuth Client
    ↓
Adicionar URI: http://localhost:3000/api/auth/callback/google
    ↓
Salvar
    ↓
Copiar Client ID e Secret
    ↓
Atualizar .env.local
    ↓
Aguardar 5-10 minutos
    ↓
Teste: npm run dev
```

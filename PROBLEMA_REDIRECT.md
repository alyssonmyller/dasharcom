# Problema: Não está indo para a página principal após login

## Possíveis Causas e Soluções

### 1️⃣ Verificar se o Email é Autorizado

Se você está recebendo erro ou ficando preso na tela de login:

**Emails Autorizados:**
- ✅ `alysson@arcom.com.br`
- ✅ `cleber@arcom.com.br`

Se você está usando outro email, será redirecionado para `/auth/error`.

### 2️⃣ Limpar Cache e Cookies

1. **Abra as DevTools** (F12 ou Cmd+Option+I)
2. **Vá para "Application" → "Cookies"**
3. **Delete todos os cookies de localhost:3000**
4. **Recarregue a página** (Ctrl+R ou Cmd+R)

### 3️⃣ Testar em Modo Incógnito

Às vezes o navegador bloqueia cookies em localhost:

1. Abra uma aba **Privada/Incógnito** (Ctrl+Shift+N ou Cmd+Shift+N)
2. Acesse `http://localhost:3000`
3. Tente fazer login

### 4️⃣ Verificar Console do Navegador

1. Abra DevTools (F12)
2. Vá para **"Console"**
3. Procure por erros vermelhos
4. Copie qualquer mensagem de erro

### 5️⃣ Reiniciar o Servidor

```bash
# No terminal, pressione Ctrl+C
# Depois execute:
npm run dev
```

### 6️⃣ Verificar Variáveis de Ambiente

Execute no terminal:
```bash
./check-env.sh
```

Certifique-se de que:
- ✅ NEXTAUTH_URL está definida
- ✅ NEXTAUTH_SECRET está definida
- ✅ GOOGLE_CLIENT_ID está definida
- ✅ GOOGLE_CLIENT_SECRET está definida

### 7️⃣ Verificar Logs do Servidor

Quando você tenta fazer login, procure no terminal por:
- `GET /api/auth/callback/google?code=...`
- Se houver erro, ele aparecerá

---

## 🔍 Fluxo Esperado

```
1. Clique em "Entrar com Google"
   ↓
2. Você é redirecionado para accounts.google.com
   ↓
3. Faz login com seu email
   ↓
4. Google redireciona para:
   http://localhost:3000/api/auth/callback/google?code=...&state=...
   ↓
5. NextAuth valida o código
   ↓
6. Se email autorizado → Redireciona para /
   ↓
7. Se email NÃO autorizado → Redireciona para /auth/error
```

---

## 📋 Checklist de Troubleshooting

- [ ] Email está na lista de autorizados?
- [ ] Limpei cookies do navegador?
- [ ] Testei em modo incógnito?
- [ ] Reiniciei o servidor (npm run dev)?
- [ ] Variáveis de ambiente estão todas preenchidas?
- [ ] Aguardei as mudanças do Google propagarem (5-10 min)?

---

## 💬 Se Ainda Não Funcionar

Verifique no console do navegador:

**Abra DevTools (F12) → Console** e procure por:

```
- "Error" em vermelho
- "401" ou "403" em laranja
- Qualquer mensagem sobre auth
```

Se houver erro, compartilhe a mensagem para debug.

---

## 🚀 Para Limpar Completamente

Se nada funcionar:

```bash
# 1. Parar o servidor (Ctrl+C)

# 2. Limpar cache Next.js
rm -rf .next

# 3. Reinstalar dependências
npm ci

# 4. Reiniciar
npm run dev
```

---

## ✅ Teste Rápido

1. Acesse: http://localhost:3000
2. Clique em "Entrar com Google"
3. Faça login com seu email @arcom.com.br
4. Você deveria ver o dashboard em segundos

Se vir a página de login novamente, algo errou no fluxo de autenticação.

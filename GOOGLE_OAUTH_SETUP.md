# Como Registrar o Redirect URI no Google Cloud Console

## O que está faltando:

O erro mostra que a aplicação está tentando usar:
```
http://localhost:3000/api/auth/callback/google
```

Mas este URI não foi registrado no Google Cloud Console.

## Solução Passo-a-Passo:

### 1. Acesse o Google Cloud Console
- Vá para: https://console.cloud.google.com/

### 2. Selecione seu Projeto
- Escolha o projeto que criou as credenciais OAuth

### 3. Vá para Credenciais
- No menu lateral esquerdo, clique em **"Credenciais"**
- Você verá uma lista de suas credenciais

### 4. Abra o Client ID OAuth
- Procure por **"OAuth 2.0 Client ID"** tipo "Aplicativo da Web"
- Clique nele para editar

### 5. Configure os URIs de Redirecionamento

Na seção **"URIs de redirecionamento autorizados"**, adicione:

**Para Desenvolvimento (localhost):**
```
http://localhost:3000/api/auth/callback/google
```

**Para Produção (substitua pelo seu domínio):**
```
https://seu-dominio.com/api/auth/callback/google
```

### 6. Salve as Alterações
- Clique em **"Salvar"**

### 7. Copie as Credenciais
- Localize o mesmo Client ID
- Clique nele e copie:
  - **Client ID**
  - **Client Secret**

### 8. Atualize o .env.local
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua-chave-secreta-aqui
GOOGLE_CLIENT_ID=seu-client-id-aqui
GOOGLE_CLIENT_SECRET=seu-client-secret-aqui
```

### 9. Reinicie o servidor
```bash
npm run dev
```

---

## Instruções Detalhadas com Screenshots:

### Passo 1: No Google Cloud Console

1. Vá para https://console.cloud.google.com/
2. Crie um novo projeto ou selecione o existente
3. Clique em **"Credenciais"** no menu esquerdo

### Passo 2: Criar/Editar OAuth Client

1. Clique em **"Criar Credenciais"** > **"ID do Cliente OAuth"**
2. Se já tem, clique no existente para editar
3. Selecione **"Aplicativo da Web"**

### Passo 3: Configure os URIs

Na seção **"Origem JavaScript autorizada":**
```
http://localhost:3000
```

Na seção **"URIs de redirecionamento autorizados":**
```
http://localhost:3000/api/auth/callback/google
```

### Passo 4: Salve e Copie as Credenciais

Depois de salvar, você verá:
- Client ID (copie)
- Client Secret (copie)

### Passo 5: Atualize o .env.local

Arquivo: `.env.local`
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=gera-uma-chave-segura-aqui-use-openssl-rand-hex-32
GOOGLE_CLIENT_ID=seu-id-aqui
GOOGLE_CLIENT_SECRET=seu-secret-aqui
```

Para gerar a NEXTAUTH_SECRET, execute no terminal:
```bash
openssl rand -hex 32
```

### Passo 6: Reinicie o Servidor

```bash
npm run dev
```

Agora acesse: `http://localhost:3000`

---

## Troubleshooting

### Ainda recebo o erro 400?
- Aguarde 5-10 minutos para as alterações no Google Cloud se propagarem
- Limpe o cache do navegador (Ctrl+Shift+Delete)
- Reinicie o servidor (Ctrl+C e execute `npm run dev` novamente)

### Onde encontro o Client ID e Secret?
1. Vá para https://console.cloud.google.com/
2. Menu esquerdo > "Credenciais"
3. Procure por "OAuth 2.0 Client ID" tipo "Aplicativo da Web"
4. Clique nele

### Preciso adicionar localhost?
Sim, adicione:
- **Origem JavaScript:** `http://localhost:3000`
- **URI de Redirecionamento:** `http://localhost:3000/api/auth/callback/google`

### E em produção?
Substitua `localhost:3000` pelo seu domínio real:
- **Origem JavaScript:** `https://seu-dominio.com`
- **URI de Redirecionamento:** `https://seu-dominio.com/api/auth/callback/google`
- **NEXTAUTH_URL:** `https://seu-dominio.com`

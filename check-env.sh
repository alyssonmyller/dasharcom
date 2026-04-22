#!/bin/bash

echo "🔍 Verificando Configuração do NextAuth..."
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verifica se .env.local existe
if [ ! -f .env.local ]; then
  echo -e "${RED}❌ Arquivo .env.local não encontrado!${NC}"
  echo "   Crie o arquivo: touch .env.local"
  exit 1
fi

# Verifica NEXTAUTH_URL
if grep -q "NEXTAUTH_URL=" .env.local; then
  NEXTAUTH_URL=$(grep "NEXTAUTH_URL=" .env.local | cut -d '=' -f2)
  echo -e "${GREEN}✓ NEXTAUTH_URL configurada:${NC} $NEXTAUTH_URL"
else
  echo -e "${RED}❌ NEXTAUTH_URL não configurada${NC}"
fi

# Verifica NEXTAUTH_SECRET
if grep -q "NEXTAUTH_SECRET=" .env.local; then
  NEXTAUTH_SECRET=$(grep "NEXTAUTH_SECRET=" .env.local | cut -d '=' -f2)
  if [ -z "$NEXTAUTH_SECRET" ] || [ "$NEXTAUTH_SECRET" == "your-secret-key-change-this" ]; then
    echo -e "${RED}❌ NEXTAUTH_SECRET vazia ou com valor padrão${NC}"
  else
    echo -e "${GREEN}✓ NEXTAUTH_SECRET configurada${NC}"
  fi
else
  echo -e "${RED}❌ NEXTAUTH_SECRET não configurada${NC}"
fi

# Verifica GOOGLE_CLIENT_ID
if grep -q "GOOGLE_CLIENT_ID=" .env.local; then
  GOOGLE_CLIENT_ID=$(grep "GOOGLE_CLIENT_ID=" .env.local | cut -d '=' -f2)
  if [ -z "$GOOGLE_CLIENT_ID" ] || [ "$GOOGLE_CLIENT_ID" == "your-google-client-id" ]; then
    echo -e "${RED}❌ GOOGLE_CLIENT_ID vazia ou com valor padrão${NC}"
  else
    echo -e "${GREEN}✓ GOOGLE_CLIENT_ID configurada:${NC} ${GOOGLE_CLIENT_ID:0:20}..."
  fi
else
  echo -e "${RED}❌ GOOGLE_CLIENT_ID não configurada${NC}"
fi

# Verifica GOOGLE_CLIENT_SECRET
if grep -q "GOOGLE_CLIENT_SECRET=" .env.local; then
  GOOGLE_CLIENT_SECRET=$(grep "GOOGLE_CLIENT_SECRET=" .env.local | cut -d '=' -f2)
  if [ -z "$GOOGLE_CLIENT_SECRET" ] || [ "$GOOGLE_CLIENT_SECRET" == "your-google-client-secret" ]; then
    echo -e "${RED}❌ GOOGLE_CLIENT_SECRET vazia ou com valor padrão${NC}"
  else
    echo -e "${GREEN}✓ GOOGLE_CLIENT_SECRET configurada${NC}"
  fi
else
  echo -e "${RED}❌ GOOGLE_CLIENT_SECRET não configurada${NC}"
fi

echo ""
echo -e "${YELLOW}⚠️  IMPORTANTE:${NC}"
echo "   1. Verifique o arquivo GOOGLE_OAUTH_SETUP.md para configurar no Google Cloud"
echo "   2. Registre este URI no Google Cloud Console:"
echo "      ${GREEN}http://localhost:3000/api/auth/callback/google${NC}"
echo "   3. Aguarde 5-10 minutos para as mudanças se propagarem"
echo "   4. Execute 'npm run dev' novamente"

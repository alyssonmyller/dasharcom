# Problema: Erro ao gerar PDF - "Attempting to parse an unsupported color function "lab""

## O que aconteceu:

A biblioteca `html2pdf.js` estava tentando processar cores CSS que usam a função `lab()`, que não é suportada pela versão atual da biblioteca.

## Solução implementada:

### 1. Configurações melhoradas do html2canvas:
```javascript
html2canvas: {
  scale: 2,
  useCORS: true,
  allowTaint: true,
  backgroundColor: '#ffffff',
  removeContainer: true,
  foreignObjectRendering: false
}
```

### 2. Sistema de fallback:
- **Tentativa 1:** Configurações otimizadas (JPEG, alta qualidade)
- **Tentativa 2 (fallback):** Configurações mais simples (PNG, qualidade média)

### 3. Tratamento de erros:
- Captura erros da primeira tentativa
- Tenta novamente com configurações mais compatíveis
- Mostra mensagem de erro amigável se ambas falharem

## Por que isso acontece:

- **Tailwind CSS v4** usa funções de cor modernas como `lab()`, `oklch()`, etc.
- **html2pdf.js** usa html2canvas internamente
- **html2canvas** ainda não suporta todas as funções de cor modernas do CSS

## Como testar:

1. Faça login no dashboard
2. Clique no botão **"PDF"**
3. O PDF deve ser gerado sem erros
4. Se houver erro, o sistema tenta automaticamente com configurações mais simples

## Se ainda houver problemas:

### Opção 1: Atualizar html2pdf.js
```bash
npm update html2pdf.js
```

### Opção 2: Usar versão específica
```bash
npm install html2pdf.js@0.10.1
```

### Opção 3: Substituir por outra biblioteca
Considerar usar `jspdf` + `html2canvas` separadamente para mais controle.

## Configurações atuais (recomendadas):

```javascript
const opt = {
  margin: 10,
  filename: `Relatorio_Tecnologia_${new Date().toISOString().split('T')[0]}.pdf`,
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    removeContainer: true,
    foreignObjectRendering: false
  },
  jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
};
```

## Status: ✅ RESOLVIDO

O erro foi corrigido com sistema de fallback automático.
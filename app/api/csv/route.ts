// app/api/csv/route.ts
export async function GET() {
  const sheetId = '1E7k_CwmuTBrd2IdOp1_YG3FTWm1X6zYSRq1RI22r6Vc';
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

  try {
    // O backend do Next.js faz a requisição direto ao Google (CORS não existe no backend)
    const response = await fetch(csvUrl, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error('Falha na comunicação com o Google Sheets');
    }
    
    const text = await response.text();
    
    return new Response(text, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
      },
    });
  } catch (error) {
    return new Response('Erro ao buscar os dados', { status: 500 });
  }
}
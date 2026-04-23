"use client";

import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { FileTextIcon, AlertTriangleIcon, LandmarkIcon, UserCircleIcon, CheckCircle2, Rocket, Search, Hourglass, Octagon, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

// Tipagem dos dados
interface Task {
  Categoria: string;
  'Tarefa/Projeto': string;
  Status: string;
}

const statusMeta: Record<string, { icon: React.ReactNode; color: string }> = {
  'FEITO': { icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-green-600' },
  'EM HOMOLOGAÇÃO': { icon: <Search className="w-4 h-4" />, color: 'text-purple-600' },
  'ESTEIRA': { icon: <Rocket className="w-4 h-4" />, color: 'text-blue-600' },
  'FILA': { icon: <Hourglass className="w-4 h-4" />, color: 'text-gray-500' },
  'AGUARDANDO DEFINIÇÃO DE REGRAS': { icon: <Hourglass className="w-4 h-4" />, color: 'text-amber-600' },
  'AGUARDANDO DEFINIÇÃO PRÓXIMA SPRINT': { icon: <Hourglass className="w-4 h-4" />, color: 'text-amber-600' },
  'INTERROMPIDO': { icon: <Octagon className="w-4 h-4" />, color: 'text-red-600' },
};

export default function Dashboard() {
  const { data: session } = useSession();
  const [data, setData] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('');

  const sheetId = '1E7k_CwmuTBrd2IdOp1_YG3FTWm1X6zYSRq1RI22r6Vc';
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

  const fetchData = async () => {
    setLoading(true);
    try {
      // Agora chamamos a nossa própria API local, totalmente livre de CORS
      const response = await fetch('/api/csv');
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setData(results.data as Task[]);
          setLoading(false);
        },
      });
    } catch (error) {
      console.error("Erro ao sincronizar:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setDate(new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(new Date()));
  }, []);

  const downloadPDF = async () => {
    const html2pdf = (await import('html2pdf.js')).default;
    const element = document.getElementById('dashboard-content');
    if (!element) return;

    // Clone do elemento para manipular sem afetar o DOM
    const clonedElement = element.cloneNode(true) as HTMLElement;

    // Função para limpar apenas cores problemáticas, mantendo o layout
    const cleanStylesForPDF = (el: Element) => {
      if (el instanceof HTMLElement) {
        const computedStyle = window.getComputedStyle(el);

        // Lista de propriedades de cor que podem causar problemas
        const colorProperties = ['color', 'backgroundColor', 'borderColor'];

        colorProperties.forEach(prop => {
          const value = computedStyle[prop as any];
          if (value && (value.includes('lab') || value.includes('oklch') || value.includes('lch'))) {
            // Substitui apenas cores problemáticas por equivalentes seguros
            if (prop === 'color') {
              el.style.color = '#000000';
            } else if (prop === 'backgroundColor') {
              // Mantém backgrounds importantes, apenas substitui cores problemáticas
              if (value !== 'rgba(0, 0, 0, 0)' && value !== 'transparent') {
                el.style.backgroundColor = '#ffffff';
              }
            } else if (prop === 'borderColor') {
              el.style.borderColor = '#cccccc';
            }
          }
        });

        // Mantém classes essenciais, remove apenas as problemáticas
        const classes = el.className?.toString().split(' ') || [];
        const essentialClasses = classes.filter(cls => {
          // Mantém classes de layout e espaçamento, remove apenas cores
          return !cls.match(/^(bg-|text-|border-)/) ||
                 cls.match(/^(bg-white|text-black|text-gray-|border-gray-)/);
        });
        el.className = essentialClasses.join(' ');

        // Garante que elementos de texto sejam visíveis
        if (el.tagName === 'P' || el.tagName === 'SPAN' || el.tagName === 'DIV' ||
            el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3' ||
            el.tagName === 'TD' || el.tagName === 'TH') {
          el.style.color = el.style.color || '#000000';
          el.style.backgroundColor = el.style.backgroundColor || 'transparent';
        }

        // Garante que tabelas sejam visíveis
        if (el.tagName === 'TABLE') {
          el.style.borderCollapse = 'collapse';
          el.style.width = '100%';
        }

        if (el.tagName === 'TD' || el.tagName === 'TH') {
          el.style.border = '1px solid #cccccc';
          el.style.padding = '8px';
        }
      }

      // Processa filhos recursivamente
      Array.from(el.children).forEach(child => cleanStylesForPDF(child));
    };

    // Aplica limpeza seletiva
    cleanStylesForPDF(clonedElement);

    // Cria container temporário visível para debug
    const tempContainer = document.createElement('div');
    tempContainer.style.cssText = `
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: 100%;
      background: white;
      color: black;
      font-family: Arial, sans-serif;
    `;
    document.body.appendChild(tempContainer);
    tempContainer.appendChild(clonedElement);

    // Configurações otimizadas para PDF
    const opt = {
      margin: 10,
      filename: `Relatorio_Tecnologia_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'png' as const, quality: 0.95 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        removeContainer: true,
        foreignObjectRendering: false,
        ignoreElements: (element: Element) => {
          const classes = element.className?.toString() || '';
          return classes.includes('no-pdf') || classes.includes('hidden');
        },
        onclone: (clonedDoc: Document) => {
          // Adiciona estilos de impressão CSS
          const printStyle = clonedDoc.createElement('style');
          printStyle.textContent = `
            @media print {
              * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
            }

            /* Estilos base para garantir visibilidade */
            body {
              background: white !important;
              color: black !important;
              font-family: Arial, sans-serif !important;
              font-size: 12px !important;
              line-height: 1.4 !important;
            }

            /* Cabeçalho */
            header {
              background: #f8f9fa !important;
              color: #1B4D3E !important;
              padding: 20px !important;
              border-bottom: 2px solid #1B4D3E !important;
            }

            /* Títulos */
            h1, h2, h3 {
              color: #1B4D3E !important;
              background: transparent !important;
              font-weight: bold !important;
            }

            /* Tabelas */
            table {
              border-collapse: collapse !important;
              width: 100% !important;
              margin: 10px 0 !important;
            }

            th, td {
              border: 1px solid #cccccc !important;
              padding: 8px !important;
              text-align: left !important;
              color: black !important;
              background: white !important;
            }

            th {
              background: #f8f9fa !important;
              font-weight: bold !important;
            }

            /* Status indicators */
            .text-green-600 { color: #16a34a !important; }
            .text-purple-600 { color: #9333ea !important; }
            .text-blue-600 { color: #2563eb !important; }
            .text-gray-500 { color: #6b7280 !important; }
            .text-amber-600 { color: #d97706 !important; }
            .text-red-600 { color: #dc2626 !important; }

            /* Layout */
            .grid { display: block !important; }
            .md\\:grid-cols-2 { display: block !important; }
            .lg\\:grid-cols-3 { display: block !important; }

            /* Espaçamento */
            .p-6 { padding: 15px !important; }
            .gap-6 > * { margin-bottom: 20px !important; }

            /* Remove elementos não essenciais */
            .print\\:hidden { display: none !important; }
            button { display: none !important; }
          `;
          clonedDoc.head.appendChild(printStyle);
        }
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' as const }
    };

    try {
      console.log('Iniciando geração de PDF...');
      await html2pdf().set(opt).from(clonedElement).save();
      console.log('✓ PDF gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF - Tentando fallback...', error);

      // Fallback: versão mais simples mas funcional
      try {
        const fallbackOpt = {
          margin: 10,
          filename: `Relatorio_Tecnologia_${new Date().toISOString().split('T')[0]}.pdf`,
          image: { type: 'png' as const, quality: 0.8 },
          html2canvas: {
            scale: 1.5,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            removeContainer: true,
            onclone: (clonedDoc: Document) => {
              // Estilos mínimos mas funcionais
              const style = clonedDoc.createElement('style');
              style.textContent = `
                * {
                  color: black !important;
                  background: white !important;
                  font-family: Arial, sans-serif !important;
                }
                body {
                  background: white !important;
                  color: black !important;
                  padding: 20px !important;
                }
                table {
                  border-collapse: collapse !important;
                  width: 100% !important;
                  margin: 20px 0 !important;
                }
                th, td {
                  border: 1px solid #000 !important;
                  padding: 8px !important;
                  text-align: left !important;
                }
                th {
                  background: #f0f0f0 !important;
                  font-weight: bold !important;
                }
                h1, h2, h3 {
                  color: #1B4D3E !important;
                  margin: 20px 0 10px 0 !important;
                }
                .text-green-600 { color: #008000 !important; }
                .text-red-600 { color: #ff0000 !important; }
                .text-blue-600 { color: #0000ff !important; }
                .text-purple-600 { color: #800080 !important; }
                .text-gray-500 { color: #808080 !important; }
                .text-amber-600 { color: #ff8c00 !important; }
              `;
              clonedDoc.head.appendChild(style);
            }
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' as const }
        };

        await html2pdf().set(fallbackOpt).from(clonedElement).save();
        console.log('✓ PDF gerado com sucesso (fallback)!');
      } catch (fallbackError) {
        console.error('Fallback também falhou:', fallbackError);
        alert('❌ Erro ao gerar PDF. Tente novamente ou entre em contato com o suporte.');
      }
    } finally {
      // Remove o container temporário
      if (document.body.contains(tempContainer)) {
        document.body.removeChild(tempContainer);
      }
    }
  };

  // Agrupamento
  const categories = data.reduce((acc: Record<string, Task[]>, row) => {
    const cat = row.Categoria || 'Outros';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(row);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div id="dashboard-content" className="max-w-7xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        
        {/* Header Institucional Arcom */}
        <header className="bg-[#1B4D3E] text-white p-6 border-b-4 border-[#B8D500] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded">
              <span className="text-3xl font-black text-[#1B4D3E] tracking-tighter">DASH ARCOM</span>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold uppercase italic">Painel de Tarefas</h1>
              <p className="text-blue-200 text-xs">Sincronização em Tempo Real</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 items-center print:hidden">
            {session?.user && (
              <div className="flex items-center gap-2 text-sm  px-3 py-2 rounded-lg">
                <UserCircleIcon className="w-5 h-5" />
                <div className="flex flex-col">
                  <span className="font-semibold text-white">{session.user.name}</span>
                  <span className="text-xs text-blue-200">{session.user.email}</span>
                </div>
              </div>
            )}
            
            <button 
              onClick={() => signOut({ redirect: true, callbackUrl: '/auth/signin' })}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded shadow-md flex items-center gap-2 transition-all"
            >
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
        </header>

        <div className="px-6 py-2 bg-gray-50 border-b text-[10px] text-gray-400 flex justify-between">
          <span>{date}</span>
          <span className="text-[#1B4D3E] font-bold uppercase">● Conexão Ativa</span>
        </div>

        {/* Dashboard Grid */}
        <main className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-20 text-center text-gray-400 animate-pulse">
              Carregando dados da Arcom...
            </div>
          ) : (
            Object.entries(categories).map(([cat, tasks]) => (
              <section 
                key={cat} 
                className={`border rounded-lg overflow-hidden flex flex-col `}
              >
                <div className="bg-gray-100 p-3 border-b flex justify-between items-center">
                  <h3 className="font-bold text-[#1B4D3E] text-sm flex items-center gap-2 uppercase">
                    {cat === 'GOVERNO' ? <LandmarkIcon size={16}/> : <UserCircleIcon size={16}/>}
                    {cat}
                  </h3>
                  <span className="bg-[#1B4D3E] text-white text-[10px] px-2 rounded-full font-bold">{tasks.length}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <tbody>
                      {tasks.map((task, i) => {
                        const meta = statusMeta[task.Status] || { icon: null, color: '' };
                        return (
                          <tr key={i} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                            <td className={`p-3 font-bold w-40 flex items-center gap-2 ${meta.color}`}>
                              {meta.icon} {task.Status}
                            </td>
                            <td className="p-3 text-gray-700 font-medium">{task['Tarefa/Projeto']}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            ))
          )}
        </main>

        <footer className="p-6 text-center border-t" style={{borderTopColor: '#1B4D3E'}}>
          <p className="font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2" style={{color: '#E40B5B'}}>
            <AlertTriangleIcon size={14} /> Uso Interno - Não Compartilhar
          </p>
        </footer>
      </div>
    </div>
  );
}
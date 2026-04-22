"use client";

import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { FileTextIcon, AlertTriangleIcon, LandmarkIcon, UserCircleIcon, CheckCircle2, Rocket, Search, Hourglass, Octagon } from 'lucide-react';

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
    const opt = {
      margin: 10,
      filename: `Relatorio_Tecnologia_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' as const }
    };
    html2pdf().set(opt).from(element).save();
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
              <h1 className="text-2xl font-extrabold uppercase italic">Dashboard Tecnologia</h1>
              <p className="text-blue-200 text-xs">Sincronização em Tempo Real</p>
            </div>
          </div>
          
          <div className="flex gap-3 print:hidden">
            <button 
              onClick={fetchData}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all"
              title="Sincronizar"
            >
              Refresh
            </button>
            <button 
              onClick={downloadPDF}
              className="bg-[#B8D500] text-[#1B4D3E] font-bold px-4 py-2 rounded shadow-md flex items-center gap-2 hover:opacity-90 transition-all"
            >
              <FileTextIcon className="w-4 h-4" /> PDF
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
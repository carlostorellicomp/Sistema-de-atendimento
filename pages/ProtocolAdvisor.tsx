import React, { useState } from 'react';
import { Sparkles, CheckCircle, ShieldAlert, HeartHandshake, Loader2, ArrowRight } from 'lucide-react';
import { getProtocolAdvice } from '../services/geminiService';
import { AIAdviceResponse } from '../types';

const ProtocolAdvisor: React.FC = () => {
  const [situation, setSituation] = useState('');
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<AIAdviceResponse | null>(null);

  const handleAnalyze = async () => {
    if (!situation.trim()) return;
    setLoading(true);
    setAdvice(null);
    try {
      const result = await getProtocolAdvice(situation);
      setAdvice(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-8 max-w-7xl mx-auto bg-brand-50 min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Sparkles className="text-brand-500" />
          Consultor de Protocolo
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Descreva uma situação do cliente para obter orientação imediata, scripts e checklists compatíveis com o protocolo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-6">
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Qual é a situação?
            </label>
            <textarea
              className="w-full h-48 p-4 !bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none !text-slate-900 placeholder:text-slate-500 mb-4 shadow-sm text-base leading-relaxed"
              placeholder='ex: "Cliente está irritado porque a IA não responde no WhatsApp e quer reembolso imediato."'
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
            ></textarea>
            
            <button
              onClick={handleAnalyze}
              disabled={loading || !situation}
              className={`w-full py-3 rounded-lg font-bold text-brand-900 flex items-center justify-center gap-2 transition-all ${
                loading || !situation 
                  ? 'bg-slate-300 cursor-not-allowed text-slate-600' 
                  : 'bg-brand-500 hover:bg-brand-600 shadow-md hover:shadow-lg'
              }`}
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
              {loading ? 'Analisando Protocolo...' : 'Gerar Orientação'}
            </button>
            
            <div className="mt-6 text-xs text-slate-400">
              <p className="font-semibold mb-1">Motor de Protocolo de IA v1.0</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Verifica Política de Reembolso</li>
                <li>Determina Nível de Suporte</li>
                <li>Gera Scripts Seguros</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="lg:col-span-2">
          {advice ? (
            <div className="space-y-6 animate-fade-in-up">
              
              {/* Top Summary Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 md:items-center justify-between bg-gradient-to-r from-white to-brand-50/50">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold
                    ${advice.analysis.urgency.toLowerCase().includes('alta') || advice.analysis.urgency.toLowerCase().includes('crítica') ? 'bg-red-100 text-red-600' : 'bg-brand-100 text-brand-900'}
                  `}>
                    {advice.analysis.level.includes('0') ? 'N0' : advice.analysis.level.includes('1') ? 'N1' : advice.analysis.level.includes('2') ? 'N2' : 'N3'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{advice.analysis.level}</h3>
                    <p className="text-slate-500">{advice.analysis.rootCause}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                   <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-sm font-medium text-slate-600">
                     Urgência: <span className="text-slate-900">{advice.analysis.urgency}</span>
                   </div>
                   <div className={`px-4 py-2 border rounded-lg shadow-sm text-sm font-medium
                     ${advice.retention.refundRisk === 'Alto' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}
                   `}>
                     Risco de Reembolso: {advice.retention.refundRisk}
                   </div>
                </div>
              </div>

              {/* Action Plan Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Internal Checklist */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <CheckCircle className="text-brand-500" size={20} />
                    Checklist Interno (Faça isso PRIMEIRO)
                  </h3>
                  <div className="space-y-3">
                    {advice.protocol.checklist.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                         <input type="checkbox" className="mt-1 w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500 bg-white" />
                         <span className="text-slate-700 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Internal Actions */}
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <ArrowRight className="text-brand-500" size={20} />
                    Próximas Ações
                  </h3>
                   <div className="space-y-3">
                    {advice.protocol.internalActions.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 bg-brand-50 p-2 rounded border border-brand-100">
                         <span className="text-brand-700 font-bold text-xs mt-0.5">{i+1}.</span>
                         <span className="text-slate-700 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Communication Script */}
              <div className="bg-white rounded-xl shadow-sm border border-brand-200 overflow-hidden ring-4 ring-brand-50/50">
                 <div className="bg-brand-50 px-6 py-4 border-b border-brand-100 flex justify-between items-center">
                    <h3 className="font-bold text-brand-900 flex items-center gap-2">
                      <HeartHandshake size={20} />
                      Script Recomendado
                    </h3>
                    <span className="text-xs font-semibold uppercase text-brand-900 bg-brand-200 px-2 py-1 rounded border border-brand-300">
                      Tom: {advice.communication.tone}
                    </span>
                 </div>
                 <div className="p-6 bg-white">
                    <pre className="whitespace-pre-wrap font-sans text-slate-800 leading-relaxed text-base border-l-4 border-brand-500 pl-4 py-1">
                      {advice.communication.script}
                    </pre>
                 </div>
              </div>

              {/* Retention & Warnings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                  <h3 className="font-bold text-red-800 flex items-center gap-2 mb-3">
                    <ShieldAlert size={20} />
                    NUNCA Diga
                  </h3>
                  <ul className="space-y-2">
                    {advice.communication.neverSay.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                         <span className="font-bold text-red-400">×</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
                  <h3 className="font-bold text-emerald-800 flex items-center gap-2 mb-3">
                    <Sparkles size={20} />
                    Estratégia de Retenção
                  </h3>
                  <p className="text-sm text-emerald-800 leading-relaxed">
                    {advice.retention.strategy}
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 min-h-[500px]">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                 <Sparkles className="text-slate-300" size={40} />
              </div>
              <p className="text-lg font-medium">Pronto para ajudar</p>
              <p className="text-sm max-w-xs text-center mt-2">Insira um cenário à esquerda para gerar uma resposta de protocolo profissional.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProtocolAdvisor;
import React, { useState } from 'react';
import { Search, Copy, Check, FileText, UploadCloud, BookOpen, MessageSquare, Download, BrainCircuit, RefreshCw, GraduationCap, PlayCircle } from 'lucide-react';
import { addKnowledgeToAI } from '../services/geminiService';

type Tab = 'responses' | 'documents' | 'training';

const KnowledgeBase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('training'); // Default to training per user focus
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingTraining, setIsUploadingTraining] = useState(false);

  // Mock Data for Canned Responses (Scripts)
  const scripts = [
    {
      id: 'S-01',
      title: 'Tutorial: API do WhatsApp',
      content: 'Olá! Para conectar sua API do WhatsApp, siga este passo a passo em vídeo que preparamos: [Link da Aula]. Se tiver dúvidas no passo 3, me avise!',
      tags: ['Instalação', 'Vídeo']
    },
    {
      id: 'S-02',
      title: 'Explicação: Erro 500',
      content: 'Esse erro geralmente ocorre por instabilidade momentânea no servidor. Por favor, aguarde 5 minutos e tente novamente. Se persistir, verifique seus logs em [Link].',
      tags: ['Técnico', 'Erro']
    },
    {
      id: 'S-03',
      title: 'Financeiro: Ciclo de Cobrança',
      content: 'Seu ciclo de cobrança fecha todo dia 05. A nota fiscal é enviada automaticamente para seu e-mail de cadastro no dia seguinte.',
      tags: ['Cobrança']
    },
  ];

  // AI Knowledge Base Docs
  const [documents, setDocuments] = useState([
    { id: '1', name: 'Manual_Conduta_Suporte_2024.pdf', size: '2.4 MB', type: 'PDF', status: 'Sincronizado' },
    { id: '2', name: 'Scripts_Retencao_Churn.docx', size: '500 KB', type: 'DOCX', status: 'Pendente' },
  ]);

  // Team Training Docs (Human Study)
  const [trainingDocs, setTrainingDocs] = useState([
    { id: 'T-1', name: 'Onboarding_Agentes_N1.pdf', size: '5.1 MB', type: 'PDF', category: 'Onboarding' },
    { id: 'T-2', name: 'Cultura_e_Valores_2024.pdf', size: '1.2 MB', type: 'PDF', category: 'Institucional' },
    { id: 'T-3', name: 'Curso_Atendimento_Empatico.pdf', size: '8.5 MB', type: 'PDF', category: 'Soft Skills' },
  ]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSimulateUpload = () => {
    setIsUploading(true);
    
    // Simulate reading a file and updating the AI
    setTimeout(() => {
      const newDoc = { 
        id: Date.now().toString(), 
        name: 'Nova_Politica_Reembolso_2025.pdf', 
        size: '1.2 MB', 
        type: 'PDF', 
        status: 'Sincronizado' 
      };
      
      setDocuments([newDoc, ...documents]);
      
      // Inject content into Gemini Service
      const mockFileContent = `
        NOVA POLÍTICA DE REEMBOLSO 2025:
        1. Reembolsos acima de R$ 500 agora exigem aprovação do Gerente (Nível 3).
        2. O prazo para estorno no cartão mudou de 5 para 10 dias úteis.
        3. Para clientes ameaçando churn, oferecer 2 meses grátis antes de aceitar o cancelamento.
      `;
      addKnowledgeToAI(mockFileContent);
      
      setIsUploading(false);
    }, 2000);
  };

  const handleSimulateTrainingUpload = () => {
    setIsUploadingTraining(true);
    setTimeout(() => {
      const newDoc = {
        id: Date.now().toString(),
        name: 'Novo_Treinamento_Tecnico_V2.pdf',
        size: '3.4 MB',
        type: 'PDF',
        category: 'Técnico'
      };
      setTrainingDocs([newDoc, ...trainingDocs]);
      setIsUploadingTraining(false);
    }, 1500);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col bg-brand-50 min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <BookOpen className="text-brand-500" />
          Hub de Conhecimento
        </h1>
        <p className="text-slate-500 mt-2">
          Central unificada para scripts, treinamento da IA e capacitação da equipe.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-slate-200 mb-8 overflow-x-auto">
         <button
          onClick={() => setActiveTab('training')}
          className={`pb-4 px-2 font-medium text-sm transition-colors relative whitespace-nowrap ${
            activeTab === 'training' 
              ? 'text-brand-600 border-b-2 border-brand-500' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <GraduationCap size={18} />
            Treinamento da Equipe
          </div>
        </button>
        <button
          onClick={() => setActiveTab('responses')}
          className={`pb-4 px-2 font-medium text-sm transition-colors relative whitespace-nowrap ${
            activeTab === 'responses' 
              ? 'text-brand-600 border-b-2 border-brand-500' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <MessageSquare size={18} />
            Scripts Rápidos
          </div>
        </button>
         <button
          onClick={() => setActiveTab('documents')}
          className={`pb-4 px-2 font-medium text-sm transition-colors relative whitespace-nowrap ${
            activeTab === 'documents' 
              ? 'text-brand-600 border-b-2 border-brand-500' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <BrainCircuit size={18} />
            Treinamento da IA
          </div>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder={
            activeTab === 'responses' ? "Buscar scripts..." : 
            activeTab === 'documents' ? "Buscar regras da IA..." :
            "Buscar materiais de estudo..."
          }
          className="w-full pl-12 pr-4 py-3 !bg-white border border-slate-200 rounded-xl shadow-sm text-base focus:ring-2 focus:ring-brand-500 focus:outline-none !text-slate-900 placeholder:text-slate-400"
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        
        {/* TAB 1: SCRIPTS */}
        {activeTab === 'responses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scripts.map((script) => (
              <div key={script.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-slate-800">{script.title}</h3>
                  <span className="text-xs bg-brand-50 text-brand-700 px-2 py-1 rounded font-medium border border-brand-100">
                    {script.tags[0]}
                  </span>
                </div>
                <div className="bg-brand-50 p-3 rounded-lg border border-brand-100 mb-4 flex-1">
                  <p className="text-sm text-slate-600 italic leading-relaxed">"{script.content}"</p>
                </div>
                <button 
                  onClick={() => handleCopy(script.content, script.id)}
                  className={`w-full py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                    copiedId === script.id 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {copiedId === script.id ? <Check size={16} /> : <Copy size={16} />}
                  {copiedId === script.id ? 'Copiado!' : 'Copiar Script'}
                </button>
              </div>
            ))}
            
            <button className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:text-brand-600 hover:border-brand-300 transition-colors min-h-[250px] gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                <PlusIcon />
              </div>
              <span className="font-medium">Criar Novo Script</span>
            </button>
          </div>
        )}

        {/* TAB 2: AI TRAINING DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-brand-200 bg-brand-50/50 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all hover:bg-brand-50">
              <div className={`w-16 h-16 rounded-full shadow-sm flex items-center justify-center mb-4 text-brand-900 ${isUploading ? 'bg-brand-200' : 'bg-white'}`}>
                {isUploading ? <RefreshCw className="animate-spin" size={32} /> : <UploadCloud size={32} />}
              </div>
              <h3 className="text-lg font-bold text-slate-800">Abastecer o Consultor de Protocolo</h3>
              <p className="text-slate-500 max-w-lg mt-1 mb-4">
                Arraste manuais PDF, DOCX ou TXT aqui. O conteúdo será lido automaticamente e passará a influenciar as respostas da IA imediatamente.
              </p>
              <button 
                onClick={handleSimulateUpload}
                disabled={isUploading}
                className="bg-brand-500 text-brand-900 px-8 py-3 rounded-lg font-bold hover:bg-brand-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Processando Documento...' : 'Selecionar Arquivos para IA'}
              </button>
            </div>

            {/* Document List */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-brand-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                  <BrainCircuit size={18} className="text-brand-500"/>
                  Memória Ativa da IA
                </h3>
                <span className="text-xs text-slate-500">{documents.length} documentos ativos</span>
              </div>
              <div className="divide-y divide-slate-100">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-brand-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded bg-red-50 text-red-600 flex items-center justify-center">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{doc.name}</p>
                        <p className="text-xs text-slate-500">{doc.size} • {doc.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-bold border flex items-center gap-1 ${
                        doc.status === 'Sincronizado' 
                          ? 'bg-green-50 text-green-700 border-green-100' 
                          : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                      }`}>
                         {doc.status === 'Sincronizado' && <Check size={12} />}
                        {doc.status === 'Sincronizado' ? 'Ativo na IA' : 'Processando'}
                      </span>
                      <button className="p-2 text-slate-400 hover:text-brand-600 transition-colors">
                        <Download size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TEAM TRAINING */}
        {activeTab === 'training' && (
          <div className="space-y-6 animate-fade-in">
             {/* Upload Area for Training */}
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                   <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <GraduationCap className="text-brand-500" size={24} />
                      Materiais de Estudo
                   </h3>
                   <p className="text-slate-500 text-sm mt-1">
                      Adicione PDFs de onboarding, cultura e cursos técnicos para a equipe acessar.
                   </p>
                </div>
                <button 
                  onClick={handleSimulateTrainingUpload}
                  disabled={isUploadingTraining}
                  className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  {isUploadingTraining ? <RefreshCw className="animate-spin" size={18} /> : <UploadCloud size={18} />}
                  {isUploadingTraining ? 'Enviando...' : 'Adicionar Novo Material'}
                </button>
             </div>

             {/* Categories Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainingDocs.map((doc) => (
                  <div key={doc.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-1 h-full bg-brand-500"></div>
                     <div className="flex justify-between items-start mb-3">
                        <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-brand-900 transition-colors">
                           <FileText size={20} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                          {doc.category}
                        </span>
                     </div>
                     <h4 className="font-bold text-slate-800 mb-1 group-hover:text-brand-600 transition-colors line-clamp-2">
                       {doc.name.replace(/_/g, ' ').replace('.pdf', '')}
                     </h4>
                     <p className="text-xs text-slate-400 mb-4">{doc.size} • PDF</p>
                     
                     <div className="flex gap-2">
                        <button className="flex-1 bg-slate-50 hover:bg-brand-50 text-slate-600 hover:text-brand-700 text-xs font-bold py-2 rounded border border-slate-200 hover:border-brand-200 transition-colors">
                           Visualizar
                        </button>
                        <button className="px-3 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded border border-slate-200 transition-colors">
                           <Download size={16} />
                        </button>
                     </div>
                  </div>
                ))}
                
                {/* Video Course Mock */}
                <div className="bg-gradient-to-br from-brand-900 to-slate-800 p-5 rounded-xl border border-slate-700 shadow-sm hover:shadow-xl transition-all group cursor-pointer text-white relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                      <PlayCircle size={80} />
                   </div>
                   <div className="flex justify-between items-start mb-3">
                        <div className="w-10 h-10 rounded-lg bg-white/10 text-white flex items-center justify-center backdrop-blur-sm">
                           <PlayCircle size={20} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 bg-white/10 px-2 py-1 rounded">
                          Vídeo Aula
                        </span>
                     </div>
                     <h4 className="font-bold text-white mb-1 line-clamp-2">
                       Masterclass: Gestão de Crise Nível 3
                     </h4>
                     <p className="text-xs text-white/50 mb-4">45 min • MP4</p>
                     <button className="w-full bg-brand-500 hover:bg-brand-400 text-brand-900 text-xs font-bold py-2 rounded transition-colors shadow-lg">
                        Assistir Agora
                     </button>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default KnowledgeBase;
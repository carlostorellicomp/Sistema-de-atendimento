
import React, { useState, useRef, useEffect } from 'react';
import { Users, Mail, Activity, Search, Plus, Trash2, CheckCircle2, UploadCloud, Image as ImageIcon, X, Palette, Type, Layout, Link2, MessageCircle, Smartphone, Send } from 'lucide-react';
import { TeamMember, SystemLog, ThemeConfig, Ticket, DefaultStatus, SupportLevel, Urgency } from '../types';

const MOCK_TEAM: TeamMember[] = [
  { id: '1', name: 'Ana Silva', email: 'ana@fluxo.com', role: 'Admin', status: 'Ativo', lastActive: '2 min atrás' },
  { id: '2', name: 'Carlos Souza', email: 'carlos@fluxo.com', role: 'Agente', status: 'Ativo', lastActive: '1h atrás' },
  { id: '3', name: 'Mariana Lima', email: 'mari@fluxo.com', role: 'Agente', status: 'Ativo', lastActive: '5h atrás' },
];

const MOCK_LOGS: SystemLog[] = [
  { id: 'L-001', action: 'STATUS_UPDATE', target: 'Ticket T-1024', user: 'Ana Silva', timestamp: '10:42', details: 'Movido para Resolvido' },
  { id: 'L-002', action: 'LOGIN', target: 'Sistema', user: 'Carlos Souza', timestamp: '09:15', details: 'IP 192.168.1.1' },
  { id: 'L-003', action: 'COLUMN_EDIT', target: 'Quadro Kanban', user: 'Ana Silva', timestamp: 'Ontem, 16:00', details: 'Adicionou coluna "Revisão"' },
  { id: 'L-004', action: 'INVITE_SENT', target: 'pedro@fluxo.com', user: 'Ana Silva', timestamp: 'Ontem, 14:30', details: 'Role: Observador' },
  { id: 'L-005', action: 'TICKET_CREATE', target: 'Ticket T-1027', user: 'Sistema', timestamp: 'Ontem, 10:00', details: 'Via Email Inbound' },
];

const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#33d3b1',
  sidebarColor: '#0e1d33',
  bgColor: '#f2f4f7',
  fontFamily: 'Inter',
};

type SettingsTab = 'team' | 'appearance' | 'integrations' | 'logs';

const TeamSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('team');
  const [team, setTeam] = useState<TeamMember[]>(MOCK_TEAM);
  const [logs] = useState<SystemLog[]>(MOCK_LOGS);
  
  // Theme State
  const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME);
  const [showThemeSaveSuccess, setShowThemeSaveSuccess] = useState(false);
  
  // Invite State
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Agente');
  const [showInviteSuccess, setShowInviteSuccess] = useState(false);

  // Logo Upload State
  const [logoPreview, setLogoPreview] = useState<string | null>(localStorage.getItem('customLogo'));
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Integration State
  const [waConnected, setWaConnected] = useState(false);
  const [waNumber, setWaNumber] = useState('');
  const [waMessage, setWaMessage] = useState('');
  const [showWaSuccess, setShowWaSuccess] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('themeConfig');
    if (savedTheme) {
      setTheme(JSON.parse(savedTheme));
    }
  }, []);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: 'Pendente...',
      email: inviteEmail,
      role: inviteRole as any,
      status: 'Pendente',
      lastActive: '-'
    };

    setTeam([...team, newMember]);
    setInviteEmail('');
    setShowInviteSuccess(true);
    setTimeout(() => setShowInviteSuccess(false), 3000);
  };

  const handleRemoveMember = (id: string) => {
    if (confirm('Remover este usuário da equipe?')) {
      setTeam(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogoPreview(base64String);
        localStorage.setItem('customLogo', base64String);
        window.dispatchEvent(new Event('logoChange'));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    localStorage.removeItem('customLogo');
    window.dispatchEvent(new Event('logoChange'));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const updateTheme = (key: keyof ThemeConfig, value: string) => {
    const newTheme = { ...theme, [key]: value };
    setTheme(newTheme);
    
    // Apply immediately to CSS variables for live preview
    const root = document.documentElement;
    if (key === 'bgColor') root.style.setProperty('--brand-50', value);
    if (key === 'primaryColor') root.style.setProperty('--brand-500', value);
    if (key === 'sidebarColor') root.style.setProperty('--brand-900', value);
    if (key === 'fontFamily') root.style.setProperty('--font-main', value);

    localStorage.setItem('themeConfig', JSON.stringify(newTheme));
    
    setShowThemeSaveSuccess(true);
    setTimeout(() => setShowThemeSaveSuccess(false), 2000);
  };

  const resetTheme = () => {
    setTheme(DEFAULT_THEME);
    localStorage.removeItem('themeConfig');
    const root = document.documentElement;
    root.style.setProperty('--brand-50', DEFAULT_THEME.bgColor);
    root.style.setProperty('--brand-500', DEFAULT_THEME.primaryColor);
    root.style.setProperty('--brand-900', DEFAULT_THEME.sidebarColor);
    root.style.setProperty('--font-main', DEFAULT_THEME.fontFamily);
  };

  // WhatsApp Simulator
  const handleSimulateWhatsApp = () => {
    if (!waNumber || !waMessage) return;

    // Create a new Ticket
    const newTicket: Ticket = {
      id: `T-${Math.floor(Math.random() * 10000)}`,
      customerName: `Cliente WhatsApp (${waNumber})`,
      phoneNumber: waNumber,
      source: 'WhatsApp',
      title: waMessage.length > 30 ? waMessage.substring(0, 30) + '...' : waMessage,
      description: waMessage,
      status: DefaultStatus.OPEN,
      level: SupportLevel.L0, // Starts at L0 or L1 usually
      urgency: Urgency.MEDIUM,
      createdAt: new Date().toISOString(),
      tags: [{ id: 'tag-wa', label: 'WhatsApp', color: 'bg-green-100 text-green-700 border-green-200' }],
      checklist: [
        { item: 'Verificar Histórico de Conversa', completed: false },
        { item: 'Validar Cadastro pelo Número', completed: false }
      ]
    };

    // Save to LocalStorage to mock backend persistence
    const existingTicketsStr = localStorage.getItem('tickets');
    const existingTickets = existingTicketsStr ? JSON.parse(existingTicketsStr) : []; // We will handle merging in TicketSystem
    const updatedTickets = [newTicket, ...existingTickets]; // Add to top for local storage logic, but TicketSystem handles merge
    
    // Dispatch event so TicketSystem updates live
    localStorage.setItem('latestWhatsAppTicket', JSON.stringify(newTicket));
    window.dispatchEvent(new Event('ticketUpdate'));

    setWaMessage('');
    setShowWaSuccess(true);
    setTimeout(() => setShowWaSuccess(false), 4000);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in bg-brand-50 min-h-full transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Administração & Equipe</h1>
          <p className="text-slate-500 mt-1">Gerencie a identidade da marca, aparência, acessos e integrações.</p>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex gap-6 border-b border-slate-200 overflow-x-auto">
         {[
           { id: 'team', label: 'Gestão de Equipe', icon: Users },
           { id: 'appearance', label: 'Aparência & Marca', icon: Palette },
           { id: 'integrations', label: 'Integrações', icon: Link2 },
           { id: 'logs', label: 'Logs de Auditoria', icon: Activity },
         ].map((tab) => {
           const Icon = tab.icon;
           return (
             <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`pb-4 px-2 font-medium text-sm transition-colors relative whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id 
                  ? 'text-brand-600 border-b-2 border-brand-500' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
           )
         })}
      </div>

      <div className="mt-6">
        
        {/* TAB: TEAM MANAGEMENT */}
        {activeTab === 'team' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Invite Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Mail className="text-brand-500" size={20} />
                  Convidar Colaborador
                </h2>
                <form onSubmit={handleInvite} className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Email Profissional</label>
                    <input 
                      type="email" 
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="usuario@empresa.com"
                      className="w-full px-4 py-2 !bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none !text-slate-800"
                      required
                    />
                  </div>
                  <div className="w-full md:w-48">
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Permissão</label>
                    <select 
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none !bg-white !text-slate-800"
                    >
                      <option value="Agente">Agente (N1/N2)</option>
                      <option value="Admin">Admin (Total)</option>
                      <option value="Observador">Observador (Leitura)</option>
                    </select>
                  </div>
                  <button 
                    type="submit"
                    className="w-full md:w-auto px-6 py-2 bg-brand-500 text-brand-900 font-bold rounded-lg hover:bg-brand-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={18} /> Enviar Convite
                  </button>
                </form>
                {showInviteSuccess && (
                  <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 text-sm border border-green-200 animate-pulse">
                    <CheckCircle2 size={16} /> Convite enviado com sucesso!
                  </div>
                )}
              </div>

              {/* Team List */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <Users className="text-blue-500" size={20} />
                      Membros da Equipe
                    </h2>
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">{team.length} usuários</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {team.map(member => (
                    <div key={member.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-brand-900 font-bold ${
                            member.role === 'Admin' ? 'bg-purple-300' : 'bg-brand-500'
                          }`}>
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{member.name}</p>
                            <p className="text-sm text-slate-500">{member.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="text-right hidden sm:block">
                              <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                                member.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                              }`}>
                                {member.status}
                              </span>
                              <p className="text-xs text-slate-400 mt-1">Ativo: {member.lastActive}</p>
                          </div>
                          <div className="text-right min-w-[80px]">
                              <span className="text-sm font-medium text-slate-700 block">{member.role}</span>
                          </div>
                          <button 
                            onClick={() => handleRemoveMember(member.id)}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            title="Remover usuário"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
               {/* Quick Tips or Info for Team */}
               <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                  <h3 className="font-bold text-blue-800 mb-2">Sobre Funções</h3>
                  <ul className="text-sm text-blue-700 space-y-2">
                    <li>• <strong>Admin:</strong> Acesso total a configurações, equipe e financeiro.</li>
                    <li>• <strong>Agente:</strong> Pode atender tickets e ver a base de conhecimento.</li>
                    <li>• <strong>Observador:</strong> Apenas visualiza relatórios.</li>
                  </ul>
               </div>
            </div>
          </div>
        )}

        {/* TAB: APPEARANCE */}
        {activeTab === 'appearance' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 max-w-4xl">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               
               {/* Color & Font Settings */}
               <div>
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-6">Cores & Tipografia</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-2">Cor Principal (Destaques)</label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="color" 
                          value={theme.primaryColor}
                          onChange={(e) => updateTheme('primaryColor', e.target.value)}
                          className="h-10 w-20 rounded cursor-pointer border border-slate-200 p-1"
                        />
                        <span className="text-sm font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">{theme.primaryColor}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-2">Cor do Menu (Sidebar)</label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="color" 
                          value={theme.sidebarColor}
                          onChange={(e) => updateTheme('sidebarColor', e.target.value)}
                          className="h-10 w-20 rounded cursor-pointer border border-slate-200 p-1"
                        />
                        <span className="text-sm font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">{theme.sidebarColor}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                         <Type size={14} /> Fonte do Sistema
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Inter', 'Roboto', 'Poppins', 'Lato'].map((font) => (
                          <button
                            key={font}
                            onClick={() => updateTheme('fontFamily', font)}
                            className={`px-3 py-2 rounded border text-sm text-left transition-all ${
                              theme.fontFamily === font 
                                ? 'border-brand-500 bg-brand-50 text-brand-900 ring-1 ring-brand-500' 
                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                            }`}
                            style={{ fontFamily: font }}
                          >
                            {font}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
               </div>

               {/* Logo Upload */}
               <div>
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-6">Logo da Empresa</h3>
                  <div className="border-2 border-dashed border-brand-200 rounded-xl bg-brand-50/50 p-6 flex flex-col items-center justify-center text-center">
                    {logoPreview ? (
                      <div className="relative group">
                         <img src={logoPreview} alt="Logo Preview" className="h-16 object-contain" />
                         <button 
                            onClick={handleRemoveLogo}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                          >
                            <X size={14} />
                          </button>
                      </div>
                    ) : (
                      <div className="text-slate-400">
                        <ImageIcon size={40} className="mx-auto mb-2 opacity-50" />
                        <span className="text-xs">Nenhum logo carregado</span>
                      </div>
                    )}
                    
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-6 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-bold flex items-center gap-2"
                    >
                      <UploadCloud size={16} /> Carregar Imagem
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/png, image/jpeg, image/svg+xml"
                      onChange={handleLogoUpload}
                    />
                    <p className="text-[10px] text-slate-400 mt-2">Recomendado: PNG Transparente (200x60px)</p>
                  </div>

                  <div className="mt-8 flex justify-end">
                      <button 
                        onClick={resetTheme}
                        className="text-xs text-red-500 hover:text-red-700 underline"
                      >
                        Restaurar Padrões de Fábrica
                      </button>
                  </div>
               </div>

             </div>
             {showThemeSaveSuccess && (
                <div className="mt-6 p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 text-sm border border-green-200 animate-pulse justify-center">
                  <CheckCircle2 size={16} /> Configurações visuais aplicadas com sucesso!
                </div>
             )}
          </div>
        )}

        {/* TAB: INTEGRATIONS (WHATSAPP) */}
        {activeTab === 'integrations' && (
           <div className="space-y-6">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center gap-8">
                 <div className="w-16 h-16 bg-[#25D366] rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg">
                    <MessageCircle size={32} />
                 </div>
                 <div className="flex-1">
                    <h2 className="text-xl font-bold text-slate-800">WhatsApp Business API</h2>
                    <p className="text-slate-500 mt-1">
                       Conecte seu número oficial para transformar mensagens em tickets automaticamente.
                       Responda diretamente do painel.
                    </p>
                 </div>
                 <button 
                   onClick={() => setWaConnected(!waConnected)}
                   className={`px-6 py-2 rounded-lg font-bold transition-all border ${
                     waConnected 
                       ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                       : 'bg-green-600 text-white border-green-600 hover:bg-green-700'
                   }`}
                 >
                   {waConnected ? 'Desconectar' : 'Conectar Conta'}
                 </button>
              </div>

              {waConnected && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up">
                   {/* Configuration */}
                   <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 opacity-60 pointer-events-none grayscale">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800">Configuração do Webhook</h3>
                        <span className="text-xs bg-slate-100 px-2 py-1 rounded">Simulação</span>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">Callback URL</label>
                          <input type="text" value="https://api.fluxo.com/wh/v1/whatsapp" readOnly className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-500" />
                        </div>
                         <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">Verify Token</label>
                          <input type="password" value="******************" readOnly className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm text-slate-500" />
                        </div>
                      </div>
                   </div>

                   {/* Simulator */}
                   <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 ring-4 ring-[#25D366]/10">
                      <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                           <Smartphone size={18} className="text-slate-400" />
                           Simulador de Recebimento
                        </h3>
                        <span className="text-[10px] font-bold text-white bg-[#25D366] px-2 py-1 rounded-full uppercase">Ao Vivo</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-4">
                        Teste o fluxo: envie uma mensagem aqui e veja ela aparecer como um Ticket no quadro Kanban instantaneamente.
                      </p>
                      
                      <div className="space-y-4">
                         <div>
                           <label className="block text-xs font-bold text-slate-700 mb-1">Número do Cliente</label>
                           <input 
                              type="text" 
                              placeholder="+55 11 99999-9999" 
                              value={waNumber}
                              onChange={(e) => setWaNumber(e.target.value)}
                              className="w-full !bg-white border border-slate-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#25D366] outline-none !text-slate-900"
                           />
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-slate-700 mb-1">Mensagem</label>
                           <textarea 
                              placeholder="Ex: Olá, meu boleto venceu e preciso de ajuda..." 
                              value={waMessage}
                              onChange={(e) => setWaMessage(e.target.value)}
                              className="w-full h-24 !bg-white border border-slate-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#25D366] outline-none resize-none !text-slate-900"
                           />
                         </div>
                         <button 
                            onClick={handleSimulateWhatsApp}
                            disabled={!waNumber || !waMessage}
                            className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                            <Send size={16} /> Simular Mensagem
                         </button>

                         {showWaSuccess && (
                            <div className="p-3 bg-green-50 text-green-800 text-xs font-bold rounded border border-green-200 flex items-center gap-2">
                               <CheckCircle2 size={14} /> Ticket criado! Verifique o quadro.
                            </div>
                         )}
                      </div>
                   </div>
                </div>
              )}
           </div>
        )}

        {/* TAB: AUDIT LOGS */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Activity className="text-brand-500" size={20} />
                Histórico de Atividades
              </h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Filtrar por usuário ou ação..." 
                  className="w-full pl-9 pr-3 py-2 !bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 !text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto max-h-[600px] p-2 space-y-2">
              {logs.map(log => (
                <div key={log.id} className="p-4 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-all flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-800">
                      <span className="font-bold text-brand-600">{log.user}</span> {log.action.toLowerCase().replace('_', ' ')}: <span className="text-slate-600">{log.details}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                       <span className="bg-slate-100 px-1 rounded">{log.target}</span> • {log.timestamp}
                    </p>
                  </div>
                  <div className="text-xs font-mono text-slate-300 border border-slate-100 px-2 py-1 rounded">
                    {log.id}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TeamSettings;

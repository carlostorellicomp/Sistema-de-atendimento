
import React, { useState, useEffect } from 'react';
import { 
  Search, CheckSquare, MessageCircle, 
  User, Send, Paperclip, X, MoreHorizontal, Clock, Plus, Trash2, Settings, GripVertical, UserPlus, AlertCircle, Tag as TagIcon, Palette, Smartphone, Mail 
} from 'lucide-react';
import { SupportLevel, Ticket, DefaultStatus, Urgency, TeamMember, TicketTag } from '../types';

// Mock Team Data (Simulating DB)
const MOCK_TEAM: TeamMember[] = [
  { id: '1', name: 'Ana Silva', email: 'ana@fluxo.com', role: 'Admin', status: 'Ativo' },
  { id: '2', name: 'Carlos Souza', email: 'carlos@fluxo.com', role: 'Agente', status: 'Ativo' },
  { id: '3', name: 'Mariana Lima', email: 'mari@fluxo.com', role: 'Agente', status: 'Ativo' },
];

// Predefined Tags
const INITIAL_TAGS: TicketTag[] = [
  { id: 'tag1', label: 'API', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { id: 'tag2', label: 'Integração', color: 'bg-violet-100 text-violet-700 border-violet-200' },
  { id: 'tag3', label: 'Cobrança', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { id: 'tag4', label: 'Plano', color: 'bg-sky-100 text-sky-700 border-sky-200' },
  { id: 'tag5', label: 'WhatsApp', color: 'bg-green-100 text-green-700 border-green-200' },
  { id: 'tag6', label: 'Bug', color: 'bg-red-100 text-red-700 border-red-200' },
  { id: 'tag7', label: 'Financeiro', color: 'bg-teal-100 text-teal-700 border-teal-200' },
  { id: 'tag8', label: 'Acesso', color: 'bg-slate-100 text-slate-700 border-slate-200' },
];

const TAG_COLORS = [
  { label: 'Azul', value: 'bg-blue-100 text-blue-700 border-blue-200' },
  { label: 'Vermelho', value: 'bg-red-100 text-red-700 border-red-200' },
  { label: 'Verde', value: 'bg-green-100 text-green-700 border-green-200' },
  { label: 'Roxo', value: 'bg-purple-100 text-purple-700 border-purple-200' },
  { label: 'Laranja', value: 'bg-orange-100 text-orange-700 border-orange-200' },
  { label: 'Cinza', value: 'bg-slate-100 text-slate-700 border-slate-200' },
  { label: 'Rosa', value: 'bg-pink-100 text-pink-700 border-pink-200' },
];

// Mock Data
const MOCK_TICKETS: Ticket[] = [
  {
    id: 'T-1024',
    customerName: 'Acme Corp (João)',
    source: 'Email',
    title: 'API retornando erro 500',
    description: 'Estamos tentando conectar ao endpoint do WhatsApp, mas recebemos erro interno do servidor.',
    status: DefaultStatus.OPEN,
    level: SupportLevel.L2,
    urgency: Urgency.HIGH,
    createdAt: new Date().toISOString(), // Created just now
    tags: [INITIAL_TAGS[0], INITIAL_TAGS[1]],
    checklist: [
      { item: 'Verificar Página de Status', completed: true },
      { item: 'Verificar Token do Cliente', completed: false },
      { item: 'Checar Logs do Servidor', completed: false },
    ],
    assignee: MOCK_TEAM[1] // Carlos
  },
  {
    id: 'T-1025',
    customerName: 'Sarah Souza',
    source: 'Manual',
    title: 'Como altero meu plano?',
    description: 'Quero mudar do plano mensal para o anual.',
    status: DefaultStatus.OPEN,
    level: SupportLevel.L1,
    urgency: Urgency.LOW,
    createdAt: new Date().toISOString(),
    tags: [INITIAL_TAGS[2], INITIAL_TAGS[3]],
    checklist: [
      { item: 'Verificar Permissões', completed: false },
      { item: 'Checar status assinatura', completed: false },
    ]
  },
  {
    id: 'T-1026',
    customerName: 'Tech Solutions',
    source: 'WhatsApp',
    phoneNumber: '+55 11 99999-0000',
    title: 'Integração Zap não conecta',
    description: 'QR Code não carrega na tela de configuração.',
    status: DefaultStatus.IN_PROGRESS,
    level: SupportLevel.L2,
    urgency: Urgency.MEDIUM,
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), // Created 20 hours ago
    tags: [INITIAL_TAGS[4], INITIAL_TAGS[5]],
    checklist: [
      { item: 'Limpar Cache', completed: true },
      { item: 'Reiniciar Instância', completed: true },
      { item: 'Testar conexão celular', completed: false },
    ],
    assignee: MOCK_TEAM[0] // Ana
  },
  {
    id: 'T-1027',
    customerName: 'Mario Bros ME',
    source: 'Email',
    title: 'Nota fiscal não chegou',
    description: 'Paguei ontem e não recebi a NF.',
    status: DefaultStatus.WAITING_CUSTOMER,
    level: SupportLevel.L1,
    urgency: Urgency.LOW,
    createdAt: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString(), // 40h ago
    tags: [INITIAL_TAGS[6]],
    checklist: [
      { item: 'Verificar Gateway', completed: true },
      { item: 'Reenviar Email', completed: true },
    ]
  },
  {
    id: 'T-1020',
    customerName: 'Ana Silva',
    source: 'Manual',
    title: 'Login bloqueado',
    description: 'Errei a senha 3 vezes.',
    status: DefaultStatus.RESOLVED,
    level: SupportLevel.L0,
    urgency: Urgency.LOW,
    createdAt: new Date(Date.now() - 300000000).toISOString(),
    tags: [INITIAL_TAGS[7]],
    checklist: [
      { item: 'Reset de Senha', completed: true },
    ]
  }
];

interface Column {
  id: string;
  label: string;
  color: string;
  bg: string;
}

const INITIAL_COLUMNS: Column[] = [
  { id: DefaultStatus.OPEN, label: 'Aberto', color: 'border-blue-500', bg: 'bg-blue-50' },
  { id: DefaultStatus.IN_PROGRESS, label: 'Em Progresso', color: 'border-yellow-500', bg: 'bg-yellow-50' },
  { id: DefaultStatus.WAITING_CUSTOMER, label: 'Aguardando Cliente', color: 'border-purple-500', bg: 'bg-purple-50' },
  { id: DefaultStatus.RESOLVED, label: 'Resolvido', color: 'border-green-500', bg: 'bg-green-50' },
];

const TicketSystem: React.FC = () => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [columns, setColumns] = useState<Column[]>(INITIAL_COLUMNS);
  const [availableTags, setAvailableTags] = useState<TicketTag[]>(INITIAL_TAGS);
  
  // Tag Management State
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0].value);
  
  // Column Editing State
  const [isEditMode, setIsEditMode] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');

  // Drag and Drop State
  const [draggedColId, setDraggedColId] = useState<string | null>(null);
  const [draggedTicketId, setDraggedTicketId] = useState<string | null>(null);
  
  // Notification Simulation
  const [showAssignToast, setShowAssignToast] = useState(false);
  const [assigneeName, setAssigneeName] = useState('');

  // Initialize Tickets from LocalStorage or Mock
  useEffect(() => {
    // Check if we have tickets in LS
    const savedTickets = localStorage.getItem('tickets');
    if (savedTickets) {
      // Merge with mocks just in case to ensure we have data for demo
      const parsed = JSON.parse(savedTickets);
      // We prioritize LS, but if empty, use MOCK
      if (parsed.length > 0) {
        setTickets(parsed);
      } else {
        setTickets(MOCK_TICKETS);
      }
    } else {
      setTickets(MOCK_TICKETS);
      localStorage.setItem('tickets', JSON.stringify(MOCK_TICKETS));
    }

    // Listen for updates from Integration (WhatsApp Simulator)
    const handleTicketUpdate = () => {
      const latest = localStorage.getItem('latestWhatsAppTicket');
      const all = localStorage.getItem('tickets'); // Or grab the list if we managed it fully in LS
      
      // Since we want to merge:
      if (latest) {
         const newTicket = JSON.parse(latest);
         setTickets(prev => [newTicket, ...prev]);
         // Clear latest to avoid double add if re-trigger (though useEffect handles)
         localStorage.removeItem('latestWhatsAppTicket');
      }
    };

    window.addEventListener('ticketUpdate', handleTicketUpdate);
    return () => window.removeEventListener('ticketUpdate', handleTicketUpdate);
  }, []);

  // Sync tickets to LocalStorage on change
  useEffect(() => {
    if (tickets.length > 0) {
      localStorage.setItem('tickets', JSON.stringify(tickets));
    }
  }, [tickets]);


  const getLevelBadge = (level: SupportLevel) => {
      if (level.includes('0')) return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">N0</span>;
      if (level.includes('1')) return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-600 border border-blue-200">N1</span>;
      if (level.includes('2')) return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-600 border border-amber-200">N2</span>;
      return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-600 border border-red-200">N3</span>;
  };

  const getSourceIcon = (source?: string) => {
    switch(source) {
      case 'WhatsApp': return <Smartphone size={14} className="text-[#25D366]" />;
      case 'Email': return <Mail size={14} className="text-blue-400" />;
      default: return null;
    }
  }

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  // --- SLA Logic ---
  const getSLAStatus = (createdAt: string, urgency: Urgency, status: string) => {
    if (status === DefaultStatus.RESOLVED || status === DefaultStatus.CLOSED) return { text: 'Concluído', color: 'text-green-600', bg: 'bg-green-50' };

    const created = new Date(createdAt).getTime();
    const now = new Date().getTime();
    const elapsedHours = (now - created) / (1000 * 60 * 60);
    
    let limitHours = 48; // Low
    if (urgency === Urgency.MEDIUM) limitHours = 24;
    if (urgency === Urgency.HIGH) limitHours = 8;
    if (urgency === Urgency.CRITICAL) limitHours = 4;

    const remaining = limitHours - elapsedHours;

    if (remaining < 0) return { text: `Atrasado ${Math.abs(Math.round(remaining))}h`, color: 'text-red-600', bg: 'bg-red-50' };
    if (remaining < 2) return { text: `Vence em ${remaining.toFixed(1)}h`, color: 'text-orange-600', bg: 'bg-orange-50' };
    
    return { text: `${Math.round(remaining)}h restantes`, color: 'text-slate-400', bg: 'bg-slate-50' };
  };

  const updateTicketStatus = (id: string, newStatus: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const updateTicketAssignee = (id: string, memberId: string) => {
    const member = MOCK_TEAM.find(m => m.id === memberId);
    if (member) {
      setTickets(prev => prev.map(t => t.id === id ? { ...t, assignee: member } : t));
      if (selectedTicket && selectedTicket.id === id) {
        setSelectedTicket(prev => prev ? { ...prev, assignee: member } : null);
      }
      setAssigneeName(member.name);
      setShowAssignToast(true);
      setTimeout(() => setShowAssignToast(false), 3000);
    } else if (memberId === '') {
       // Unassign
       setTickets(prev => prev.map(t => {
         if (t.id === id) {
            const { assignee, ...rest } = t;
            return rest;
         }
         return t;
       }));
       if (selectedTicket && selectedTicket.id === id) {
          setSelectedTicket(prev => {
             if (!prev) return null;
             const { assignee, ...rest } = prev;
             return rest;
          });
       }
    }
  };

  // --- Tag Management ---
  const handleRemoveTag = (ticketId: string, tagId: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;
      return { ...t, tags: t.tags.filter(tag => tag.id !== tagId) };
    }));
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(prev => {
        if (!prev) return null;
        return { ...prev, tags: prev.tags.filter(tag => tag.id !== tagId) };
      });
    }
  };

  const handleAddTag = (ticketId: string, tag: TicketTag) => {
    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;
      if (t.tags.find(existing => existing.id === tag.id)) return t; // Avoid duplicates
      return { ...t, tags: [...t.tags, tag] };
    }));
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(prev => {
        if (!prev) return null;
        if (prev.tags.find(existing => existing.id === tag.id)) return prev;
        return { ...prev, tags: [...prev.tags, tag] };
      });
    }
    setShowTagMenu(false);
  };

  const handleCreateTag = () => {
    if (!newTagName.trim()) return;
    const newTag: TicketTag = {
      id: `tag-${Date.now()}`,
      label: newTagName,
      color: newTagColor
    };
    setAvailableTags([...availableTags, newTag]);
    if (selectedTicket) {
      handleAddTag(selectedTicket.id, newTag);
    }
    setNewTagName('');
  };

  const toggleChecklistItem = (ticketId: string, idx: number) => {
    setTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;
      const newChecklist = [...t.checklist];
      newChecklist[idx].completed = !newChecklist[idx].completed;
      return { ...t, checklist: newChecklist };
    }));
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket(prev => {
        if (!prev) return null;
        const newChecklist = [...prev.checklist];
        newChecklist[idx].completed = !newChecklist[idx].completed;
        return { ...prev, checklist: newChecklist };
      });
    }
  };

  // --- Column Management ---

  const handleAddColumn = () => {
    if (!newColumnName.trim()) return;
    const id = newColumnName.toLowerCase().replace(/\s+/g, '_');
    const newCol: Column = {
      id,
      label: newColumnName,
      color: 'border-slate-400',
      bg: 'bg-slate-50'
    };
    setColumns([...columns, newCol]);
    setNewColumnName('');
  };

  const handleDeleteColumn = (colId: string) => {
    if (confirm('Tem certeza? Tickets nesta coluna serão movidos para "Aberto".')) {
      // Move tickets to open
      setTickets(prev => prev.map(t => t.status === colId ? { ...t, status: DefaultStatus.OPEN } : t));
      setColumns(prev => prev.filter(c => c.id !== colId));
    }
  };

  const updateColumnLabel = (colId: string, newLabel: string) => {
    setColumns(prev => prev.map(c => c.id === colId ? { ...c, label: newLabel } : c));
  };

  // --- Drag and Drop Handlers ---
  const handleColumnDragStart = (e: React.DragEvent, colId: string) => {
    setDraggedColId(colId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('type', 'column');
  };

  const handleTicketDragStart = (e: React.DragEvent, ticketId: string) => {
    e.stopPropagation(); 
    setDraggedTicketId(ticketId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('type', 'ticket');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
  };

  const handleDrop = (e: React.DragEvent, targetColId: string) => {
    e.preventDefault();

    if (draggedTicketId) {
      updateTicketStatus(draggedTicketId, targetColId);
      setDraggedTicketId(null);
      return;
    }

    if (draggedColId) {
      if (draggedColId === targetColId) return;
      const oldIndex = columns.findIndex(c => c.id === draggedColId);
      const newIndex = columns.findIndex(c => c.id === targetColId);
      const newCols = [...columns];
      const [movedCol] = newCols.splice(oldIndex, 1);
      newCols.splice(newIndex, 0, movedCol);
      setColumns(newCols);
      setDraggedColId(null);
      return;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-brand-50">
      
      {/* Toast Notification */}
      {showAssignToast && (
        <div className="fixed top-20 right-10 z-[60] bg-brand-900 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-fade-in-up">
           <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-brand-900">
             <User size={16} />
           </div>
           <div>
             <p className="font-bold text-sm">Responsável Atualizado</p>
             <p className="text-xs text-brand-200">Notificação enviada para {assigneeName}</p>
           </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="px-8 py-5 border-b border-slate-200 bg-white flex justify-between items-center shrink-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quadro de Atendimento</h1>
          <p className="text-sm text-slate-500">Gerencie o fluxo de tickets arrastando entre as colunas.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar tickets..." 
              className="pl-10 pr-4 py-2 !bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-64 !text-slate-800 placeholder:text-slate-400"
            />
          </div>
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors border ${
              isEditMode 
                ? 'bg-brand-50 border-brand-200 text-brand-700' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Settings size={16} />
            {isEditMode ? 'Concluir Edição' : 'Editar Quadro'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-brand-900 rounded-lg hover:bg-brand-600 font-bold text-sm transition-colors shadow-sm">
            <Plus size={18} /> Novo Ticket
          </button>
        </div>
      </div>

      {/* Edit Mode Panel */}
      {isEditMode && (
        <div className="px-8 py-3 bg-brand-50 border-b border-brand-100 flex items-center gap-4 animate-fade-in">
          <span className="text-sm font-bold text-brand-800">Adicionar Coluna:</span>
          <input 
            type="text" 
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            placeholder="Nome da coluna..."
            className="px-3 py-1.5 text-sm rounded border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-500 !bg-white !text-slate-900"
          />
          <button 
            onClick={handleAddColumn}
            className="px-3 py-1.5 bg-brand-500 text-brand-900 font-bold rounded text-sm hover:bg-brand-600"
          >
            Adicionar
          </button>
        </div>
      )}

      {/* Kanban Board Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <div className="flex gap-6 h-full min-w-[1000px]">
          {columns.map(col => {
            const colTickets = tickets.filter(t => t.status === col.id);
            const isDraggingThisCol = draggedColId === col.id;

            return (
              <div 
                key={col.id} 
                className={`flex flex-col w-80 shrink-0 h-full transition-opacity ${isDraggingThisCol ? 'opacity-40' : 'opacity-100'}`}
                draggable
                onDragStart={(e) => handleColumnDragStart(e, col.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                {/* Column Header */}
                <div className={`group flex items-center justify-between mb-4 p-3 rounded-lg border-t-4 bg-white shadow-sm cursor-grab active:cursor-grabbing ${col.color}`}>
                   <div className="flex items-center gap-2 flex-1 min-w-0">
                     <GripVertical size={16} className="text-slate-300" />
                     {isEditMode ? (
                        <input 
                          type="text" 
                          value={col.label}
                          onChange={(e) => updateColumnLabel(col.id, e.target.value)}
                          className="font-bold !text-slate-900 !bg-white border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-brand-500 outline-none w-full text-sm"
                          autoFocus={false}
                          onMouseDown={e => e.stopPropagation()} 
                        />
                     ) : (
                       <span className="font-bold text-slate-700 truncate select-none">{col.label}</span>
                     )}
                     <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-full ml-2 shrink-0">{colTickets.length}</span>
                   </div>
                   {isEditMode && col.id !== DefaultStatus.OPEN && col.id !== DefaultStatus.RESOLVED && (
                     <button 
                      onClick={() => handleDeleteColumn(col.id)}
                      className="text-red-400 hover:text-red-600 ml-2"
                      title="Excluir Coluna"
                     >
                       <Trash2 size={16} />
                     </button>
                   )}
                </div>

                {/* Column Drop Area */}
                <div className="flex-1 overflow-y-auto pr-2 pb-10 space-y-3">
                   {colTickets.map(ticket => {
                     const isDraggingThisTicket = draggedTicketId === ticket.id;
                     const sla = getSLAStatus(ticket.createdAt, ticket.urgency, ticket.status);
                     
                     return (
                       <div 
                          key={ticket.id}
                          onClick={() => setSelectedTicket(ticket)}
                          draggable
                          onDragStart={(e) => handleTicketDragStart(e, ticket.id)}
                          className={`bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-pointer hover:shadow-md hover:border-brand-300 transition-all group relative ${isDraggingThisTicket ? 'opacity-40 ring-2 ring-brand-300 rotate-2' : ''}`}
                       >
                          <div className="flex justify-between items-start mb-2">
                             <div className="flex items-center gap-2">
                               <span className="text-xs text-slate-400 font-mono">{ticket.id}</span>
                               {getSourceIcon(ticket.source)}
                             </div>
                             <MoreHorizontal size={16} className="text-slate-300 group-hover:text-slate-500" />
                          </div>
                          <h4 className="font-semibold text-slate-800 text-sm mb-2 leading-snug">{ticket.title}</h4>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {ticket.tags.map(tag => (
                              <span key={tag.id} className={`text-[10px] px-1.5 py-0.5 rounded border border-transparent ${tag.color}`}>
                                {tag.label}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                             <div className="flex items-center gap-1.5">
                                {getLevelBadge(ticket.level)}
                                <span className={`w-2 h-2 rounded-full ${
                                  ticket.urgency === Urgency.CRITICAL ? 'bg-red-500' :
                                  ticket.urgency === Urgency.HIGH ? 'bg-orange-500' :
                                  ticket.urgency === Urgency.MEDIUM ? 'bg-yellow-500' : 'bg-green-500'
                                }`}></span>
                             </div>
                             
                             {/* Assignee & SLA */}
                             <div className="flex items-center gap-2">
                               {/* SLA Badge */}
                               <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${sla.bg} ${sla.color}`}>
                                 <Clock size={10} />
                                 {sla.text}
                               </div>

                               {ticket.assignee ? (
                                 <div className="w-6 h-6 rounded-full bg-brand-500 text-brand-900 text-[10px] flex items-center justify-center font-bold border-2 border-white shadow-sm" title={`Responsável: ${ticket.assignee.name}`}>
                                   {getInitials(ticket.assignee.name)}
                                 </div>
                               ) : (
                                 <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-300 flex items-center justify-center border border-slate-200">
                                   <User size={12} />
                                 </div>
                               )}
                             </div>
                          </div>
                       </div>
                     )
                   })}
                   {!isEditMode && (
                      <button className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-sm hover:border-brand-300 hover:text-brand-600 transition-colors flex items-center justify-center gap-1">
                        <Plus size={16} /> Adicionar
                      </button>
                   )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slide-over Detail Panel */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedTicket(null)}
          ></div>
          
          {/* Panel */}
          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
             {/* Header */}
             <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
                <div className="flex-1 mr-8">
                   <div className="flex items-center gap-3 mb-2">
                     <h2 className="text-xl font-bold text-slate-800">{selectedTicket.title}</h2>
                     <span className="text-xs text-slate-400 font-mono bg-white px-2 py-1 rounded border border-slate-200">{selectedTicket.id}</span>
                     {getSourceIcon(selectedTicket.source) && (
                       <span className={`text-[10px] px-2 py-0.5 rounded border flex items-center gap-1 ${
                         selectedTicket.source === 'WhatsApp' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                       }`}>
                         {getSourceIcon(selectedTicket.source)}
                         {selectedTicket.source}
                       </span>
                     )}
                   </div>
                   <div className="flex gap-4 text-sm text-slate-600 items-center flex-wrap">
                     <span className="flex items-center gap-1.5 font-medium">
                       <User size={14}/> 
                       {selectedTicket.customerName}
                       {selectedTicket.phoneNumber && <span className="text-slate-400 text-xs font-normal ml-1">({selectedTicket.phoneNumber})</span>}
                     </span>
                     {getLevelBadge(selectedTicket.level)}
                     
                     {/* Assignee Dropdown */}
                     <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-slate-300 shadow-sm ml-auto">
                        <UserPlus size={14} className="text-slate-400" />
                        <select 
                          value={selectedTicket.assignee?.id || ''}
                          onChange={(e) => updateTicketAssignee(selectedTicket.id, e.target.value)}
                          className="text-xs font-semibold !bg-white focus:outline-none !text-slate-700 min-w-[100px]"
                        >
                          <option value="">Sem responsável</option>
                          {MOCK_TEAM.map(member => (
                            <option key={member.id} value={member.id}>{member.name}</option>
                          ))}
                        </select>
                     </div>

                     <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold uppercase text-slate-400">Status:</label>
                        <select 
                          value={selectedTicket.status}
                          onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value)}
                          className="text-xs font-bold uppercase !bg-white border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-brand-500 outline-none max-w-[150px] !text-slate-700"
                        >
                          {columns.map(col => (
                            <option key={col.id} value={col.id}>{col.label}</option>
                          ))}
                        </select>
                     </div>
                   </div>
                </div>
                <button 
                  onClick={() => setSelectedTicket(null)}
                  className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
                >
                  <X size={20} />
                </button>
             </div>

             {/* Content */}
             <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-8">
                   
                   {/* Description */}
                   <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <p className="text-slate-800 text-sm leading-relaxed">{selectedTicket.description}</p>
                   </div>

                   {/* Tags Manager */}
                   <div className="flex items-start gap-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-700 mt-1">
                        <TagIcon size={16} /> Etiquetas:
                      </div>
                      <div className="flex flex-wrap gap-2 items-center flex-1 relative">
                        {selectedTicket.tags.map(tag => (
                          <span key={tag.id} className={`text-xs px-2 py-1 rounded border flex items-center gap-1 ${tag.color}`}>
                            {tag.label}
                            <button onClick={() => handleRemoveTag(selectedTicket.id, tag.id)} className="hover:text-red-700">
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                        <button 
                          onClick={() => setShowTagMenu(!showTagMenu)}
                          className="text-xs px-2 py-1 rounded border border-dashed border-slate-300 text-slate-500 hover:text-brand-600 hover:border-brand-300 transition-colors flex items-center gap-1"
                        >
                          <Plus size={12} /> Adicionar
                        </button>

                        {/* Tag Selection Popup */}
                        {showTagMenu && (
                          <div className="absolute top-8 left-0 z-10 w-64 bg-white rounded-lg shadow-xl border border-slate-200 p-3 animate-fade-in">
                             <p className="text-xs font-bold text-slate-400 mb-2 uppercase">Selecionar Etiqueta</p>
                             <div className="max-h-40 overflow-y-auto space-y-1 mb-3">
                               {availableTags.map(tag => {
                                 const isSelected = selectedTicket.tags.some(t => t.id === tag.id);
                                 if (isSelected) return null;
                                 return (
                                   <button 
                                     key={tag.id}
                                     onClick={() => handleAddTag(selectedTicket.id, tag)}
                                     className="w-full text-left text-xs px-2 py-1.5 rounded hover:bg-slate-50 flex items-center gap-2"
                                   >
                                     <span className={`w-3 h-3 rounded-full ${tag.color.split(' ')[0]}`}></span>
                                     <span className="text-slate-700">{tag.label}</span>
                                   </button>
                                 )
                               })}
                             </div>
                             
                             <div className="pt-2 border-t border-slate-100">
                               <p className="text-xs font-bold text-slate-400 mb-2 uppercase">Criar Nova</p>
                               <div className="flex gap-2 mb-2">
                                 <input 
                                   type="text" 
                                   value={newTagName}
                                   onChange={(e) => setNewTagName(e.target.value)}
                                   placeholder="Nome da tag..."
                                   className="flex-1 text-xs px-2 py-1 border border-slate-300 rounded !bg-white !text-slate-900 focus:ring-1 focus:ring-brand-500 outline-none"
                                 />
                               </div>
                               <div className="flex gap-1 mb-2">
                                 {TAG_COLORS.map(c => (
                                   <button
                                     key={c.label}
                                     onClick={() => setNewTagColor(c.value)}
                                     className={`w-5 h-5 rounded-full border ${c.value.split(' ')[0]} ${newTagColor === c.value ? 'ring-2 ring-slate-400' : ''}`}
                                     title={c.label}
                                   />
                                 ))}
                               </div>
                               <button 
                                 onClick={handleCreateTag}
                                 className="w-full bg-brand-500 text-brand-900 text-xs py-1.5 rounded font-bold hover:bg-brand-600 disabled:opacity-50"
                                 disabled={!newTagName}
                               >
                                 Criar e Adicionar
                               </button>
                             </div>
                          </div>
                        )}
                      </div>
                   </div>
                   
                   {/* SLA Status Details */}
                   {selectedTicket.status !== DefaultStatus.RESOLVED && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                        <AlertCircle className="text-blue-500" size={18} />
                        <div>
                          <p className="text-xs font-bold text-blue-700">Monitoramento de SLA</p>
                          <p className="text-xs text-blue-600">
                            Ticket de prioridade <span className="font-bold uppercase">{selectedTicket.urgency}</span>. 
                            Certifique-se de resolver dentro do prazo para evitar escalonamento.
                          </p>
                        </div>
                      </div>
                   )}

                   {/* Protocol Checklist */}
                   <div>
                      <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                         <CheckSquare size={18} className="text-brand-500" />
                         Protocolo de Atendimento
                      </h3>
                      <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100">
                        {selectedTicket.checklist.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors">
                            <input 
                              type="checkbox" 
                              checked={item.completed}
                              onChange={() => toggleChecklistItem(selectedTicket.id, idx)}
                              className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 cursor-pointer bg-white" 
                            />
                            <span className={`text-sm ${item.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                              {item.item}
                            </span>
                          </div>
                        ))}
                      </div>
                   </div>

                   {/* Response Area */}
                   <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                           <MessageCircle size={18} className="text-blue-500" />
                           Comunicação
                        </h3>
                        <button className="text-xs text-brand-600 hover:underline flex items-center gap-1">
                           <MessageCircle size={12} /> Gerar Script IA
                        </button>
                      </div>
                      <div className="border border-slate-300 rounded-lg shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-brand-500 transition-all bg-white">
                        <textarea 
                          className="w-full p-4 min-h-[120px] resize-none focus:outline-none !text-slate-900 !bg-white placeholder:text-slate-400 text-sm"
                          placeholder="Digite sua resposta aqui..."
                        ></textarea>
                        <div className="bg-slate-50 p-2 flex justify-between items-center border-t border-slate-100">
                           <div className="flex gap-2 text-slate-400 px-2">
                             <Paperclip size={18} className="hover:text-slate-600 cursor-pointer" />
                           </div>
                           <button className="bg-brand-500 text-brand-900 px-4 py-1.5 rounded-md flex items-center gap-2 text-sm font-bold hover:bg-brand-600 transition-colors">
                             <Send size={14} /> Enviar
                           </button>
                        </div>
                      </div>
                   </div>

                   {/* History Timeline Mock */}
                   <div>
                      <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                         <Clock size={18} className="text-slate-400" />
                         Histórico
                      </h3>
                      <div className="border-l-2 border-slate-200 ml-2 space-y-6 pl-4 pb-2">
                         <div className="relative">
                            <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-slate-300 border-2 border-white"></span>
                            <p className="text-xs text-slate-500 mb-1">Hoje, 10:30</p>
                            <p className="text-sm text-slate-700">Ticket criado pelo cliente via Email.</p>
                         </div>
                         <div className="relative">
                            <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white"></span>
                            <p className="text-xs text-slate-500 mb-1">Hoje, 10:35</p>
                            <p className="text-sm text-slate-700">Status alterado para <span className="font-bold">Aberto</span>.</p>
                         </div>
                      </div>
                   </div>

                </div>
             </div>
          </div>
        </div>
      )}

      <style>{`
        .animate-slide-in-right {
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default TicketSystem;

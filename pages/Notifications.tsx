import React, { useState } from 'react';
import { Bell, CheckCircle2, UserPlus, AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import { Notification } from '../types';

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    userId: 'u1',
    type: 'ASSIGNMENT',
    title: 'Nova Tarefa Atribuída',
    message: 'Ana Silva te marcou como responsável pelo ticket T-1024: "API retornando erro 500".',
    read: false,
    timestamp: '5 min atrás',
    link: '/tickets'
  },
  {
    id: '2',
    userId: 'u1',
    type: 'SLA_WARNING',
    title: 'Atenção ao Prazo (SLA)',
    message: 'O Ticket T-1026 está próximo do limite de resolução de 24h.',
    read: false,
    timestamp: '1 hora atrás',
    link: '/tickets'
  },
  {
    id: '3',
    userId: 'u1',
    type: 'MENTION',
    title: 'Menção em Comentário',
    message: 'Carlos Souza mencionou você: "@Voce consegue verificar o log desse cliente?"',
    read: true,
    timestamp: '3 horas atrás',
    link: '/tickets'
  },
  {
    id: '4',
    userId: 'u1',
    type: 'SYSTEM',
    title: 'Backup Concluído',
    message: 'O backup semanal da base de conhecimento foi finalizado com sucesso.',
    read: true,
    timestamp: 'Ontem',
    link: '/knowledge'
  }
];

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ASSIGNMENT': return <UserPlus className="text-blue-500" size={24} />;
      case 'SLA_WARNING': return <AlertTriangle className="text-red-500" size={24} />;
      case 'MENTION': return <Bell className="text-orange-500" size={24} />;
      default: return <CheckCircle2 className="text-brand-500" size={24} />;
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto h-full flex flex-col animate-fade-in bg-brand-50 min-h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Bell className="text-brand-500" />
            Minhas Notificações
          </h1>
          <p className="text-slate-500 mt-2">
            Acompanhe tarefas atribuídas e alertas importantes do sistema.
          </p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="text-sm text-brand-600 hover:text-brand-800 font-medium"
        >
          Marcar todas como lidas
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-6 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer group ${!notif.read ? 'bg-brand-50/50' : ''}`}
              onClick={() => markAsRead(notif.id)}
            >
              <div className={`p-3 rounded-full shrink-0 ${!notif.read ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
                {getIcon(notif.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className={`text-base font-bold ${!notif.read ? 'text-slate-900' : 'text-slate-600'}`}>
                    {notif.title}
                    {!notif.read && <span className="ml-2 inline-block w-2 h-2 bg-red-500 rounded-full"></span>}
                  </h3>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={12} /> {notif.timestamp}
                  </span>
                </div>
                <p className="text-slate-600 mt-1 text-sm leading-relaxed">{notif.message}</p>
                {notif.link && (
                  <div className="mt-3 flex items-center gap-1 text-xs font-bold text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Ver detalhes <ArrowRight size={12} />
                  </div>
                )}
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <CheckCircle2 className="mx-auto mb-4 text-slate-300" size={48} />
              <p>Tudo limpo! Você não tem novas notificações.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
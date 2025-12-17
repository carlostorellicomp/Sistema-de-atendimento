import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie 
} from 'recharts';
import { AlertTriangle, CheckCircle2, Clock, Users, Timer, Shield } from 'lucide-react';

const dataStatus = [
  { name: 'Aberto', value: 12 },
  { name: 'Em Progresso', value: 8 },
  { name: 'Resolvido', value: 45 },
  { name: 'Aguardando', value: 5 },
];

const dataLevel = [
  { name: 'N1 (Básico)', count: 65 },
  { name: 'N2 (Técnico)', count: 25 },
  { name: 'N3 (Eng)', count: 10 },
];

// Updated colors to match brand palette
const COLORS = ['#33d3b1', '#f59e0b', '#0e1d33', '#94a3b8'];

const Dashboard: React.FC = () => {
  return (
    <div className="p-8 space-y-8 animate-fade-in bg-brand-50 min-h-full">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Visão Geral Operacional</h2>
          <p className="text-slate-500 mt-1">Métricas de suporte em tempo real e rastreamento de SLA.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Sistemas Operacionais
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Tickets Pendentes', value: '25', icon: Clock, color: 'text-brand-900', bg: 'bg-brand-500/20' },
          { label: 'Violações de SLA', value: '2', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Resolução Média', value: '4.2h', icon: CheckCircle2, color: 'text-brand-600', bg: 'bg-brand-50' },
          { label: 'Pontuação CSAT', value: '4.8/5', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, idx) => {
           const Icon = stat.icon;
           return (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <Icon className={stat.color} size={24} />
              </div>
            </div>
           )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Charts Area */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Volume de Tickets por Nível</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataLevel} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {dataLevel.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#33d3b1' : index === 1 ? '#f59e0b' : '#0e1d33'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Status Atual dos Tickets</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dataStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4 text-sm text-slate-500">
              {dataStatus.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[idx % COLORS.length]}}></span>
                    {item.name}
                  </div>
              ))}
            </div>
          </div>
        </div>

        {/* SLA Explanation Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full">
             <div className="flex items-center gap-2 mb-4">
                <Shield className="text-brand-500" size={24} />
                <h3 className="text-lg font-bold text-slate-800">Regras de SLA</h3>
             </div>
             <p className="text-sm text-slate-500 mb-6">
               O SLA (Acordo de Nível de Serviço) define o tempo máximo que temos para responder e resolver tickets baseado na urgência.
             </p>
             
             <div className="space-y-4">
                {[
                  { urgency: 'Crítica', time: '4 horas', color: 'bg-red-100 text-red-700 border-red-200' },
                  { urgency: 'Alta', time: '8 horas', color: 'bg-orange-100 text-orange-700 border-orange-200' },
                  { urgency: 'Média', time: '24 horas', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
                  { urgency: 'Baixa', time: '48 horas', color: 'bg-blue-100 text-blue-700 border-blue-200' },
                ].map((rule, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border flex justify-between items-center ${rule.color}`}>
                     <span className="font-bold">{rule.urgency}</span>
                     <div className="flex items-center gap-1.5 bg-white/50 px-2 py-1 rounded">
                       <Timer size={14} />
                       <span className="text-sm font-mono font-bold">{rule.time}</span>
                     </div>
                  </div>
                ))}
             </div>

             <div className="mt-6 p-4 bg-brand-50 rounded-lg border border-brand-100">
                <h4 className="font-bold text-brand-900 text-sm mb-2">Por que isso importa?</h4>
                <p className="text-xs text-brand-800 leading-relaxed">
                  Manter o SLA verde garante retenção de clientes. Tickets atrasados (vermelhos) disparam alertas para a gerência automaticamente.
                </p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
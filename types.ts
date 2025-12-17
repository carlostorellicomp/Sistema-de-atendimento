
export enum SupportLevel {
  L0 = 'Nível 0 - Autoatendimento',
  L1 = 'Nível 1 - Suporte Básico',
  L2 = 'Nível 2 - Suporte Técnico',
  L3 = 'Nível 3 - Engenharia',
}

// Alterado para string para permitir colunas personalizadas no Kanban
export type TicketStatus = string;

export const DefaultStatus = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  WAITING_CUSTOMER: 'waiting_customer',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};

export enum Urgency {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface TicketTag {
  id: string;
  label: string;
  color: string; // Tailwind classes, ex: 'bg-red-100 text-red-700'
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Agente' | 'Observador';
  status: 'Ativo' | 'Pendente';
  lastActive?: string;
  avatar?: string; // URL or initials logic
}

export interface Ticket {
  id: string;
  customerName: string;
  phoneNumber?: string; // Novo: Para tickets de WhatsApp
  source?: 'WhatsApp' | 'Email' | 'Manual'; // Novo: Origem do ticket
  title: string;
  description: string;
  status: TicketStatus;
  level: SupportLevel;
  urgency: Urgency;
  createdAt: string; // ISO date
  tags: TicketTag[]; // Updated to use TicketTag objects
  checklist: { item: string; completed: boolean }[];
  assignee?: TeamMember; // Novo campo: Responsável
}

export interface Notification {
  id: string;
  userId: string;
  type: 'ASSIGNMENT' | 'MENTION' | 'SLA_WARNING' | 'SYSTEM';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  link?: string;
}

export interface AIAdviceResponse {
  analysis: {
    level: string;
    urgency: string;
    rootCause: string;
  };
  protocol: {
    checklist: string[];
    internalActions: string[];
  };
  communication: {
    script: string;
    tone: string;
    neverSay: string[];
  };
  retention: {
    strategy: string; // How to avoid refund/churn
    refundRisk: 'Baixo' | 'Médio' | 'Alto';
  };
}

export interface SystemLog {
  id: string;
  action: string;
  target: string; // O que foi alterado (ex: Ticket T-1024)
  user: string;
  timestamp: string;
  details?: string;
}

export interface ThemeConfig {
  primaryColor: string;
  sidebarColor: string;
  bgColor: string;
  fontFamily: string;
}

import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AIAdviceResponse } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize only if key exists (handled in UI if missing)
const ai = new GoogleGenAI({ apiKey });

// Armazena o contexto dinâmico carregado via Base de Conhecimento
let dynamicKnowledgeBaseContext = "";

export const addKnowledgeToAI = (content: string) => {
  dynamicKnowledgeBaseContext += `\n\n--- DOCUMENTO INTERNO ADICIONADO ---\n${content}\n------------------------------------\n`;
  console.log("Contexto da IA atualizado com novos documentos.");
};

export const clearAIKnowledge = () => {
  dynamicKnowledgeBaseContext = "";
};

const ADVICE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    analysis: {
      type: Type.OBJECT,
      properties: {
        level: { type: Type.STRING, description: "Nível de Suporte Sugerido (Nível 0, 1, 2 ou 3)" },
        urgency: { type: Type.STRING, description: "Urgência Sugerida (Baixa, Média, Alta, Crítica)" },
        rootCause: { type: Type.STRING, description: "Breve diagnóstico do problema em português" },
      },
    },
    protocol: {
      type: Type.OBJECT,
      properties: {
        checklist: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Itens de checklist de diagnóstico técnico em português",
        },
        internalActions: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Passos que o agente deve realizar no sistema em português",
        },
      },
    },
    communication: {
      type: Type.OBJECT,
      properties: {
        script: { type: Type.STRING, description: "O texto exato para enviar ao usuário em português" },
        tone: { type: Type.STRING, description: "Tom recomendado (Empático, Técnico, Firme)" },
        neverSay: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Frases ou desculpas a serem estritamente evitadas em português",
        },
      },
    },
    retention: {
      type: Type.OBJECT,
      properties: {
        strategy: { type: Type.STRING, description: "Tática específica para manter o cliente (ex: oferecer upgrade, ligação, ajudar na configuração)" },
        refundRisk: { type: Type.STRING, enum: ["Baixo", "Médio", "Alto"] },
      },
    },
  },
  required: ["analysis", "protocol", "communication", "retention"],
};

const BASE_SYSTEM_INSTRUCTION = `
Você é o Líder Sênior de Suporte de uma plataforma SaaS. Seu trabalho é orientar agentes de suporte sobre como lidar com tickets com base em um protocolo rigoroso de 4 níveis.

**IMPORTANTE:** Toda a sua resposta deve ser estritamente em Português do Brasil.

**Níveis de Suporte:**
- Nível 0 (Autoatendimento): Tutoriais, FAQ, Configuração Básica. Objetivo: Defletir tickets.
- Nível 1 (Básico): Agentes não técnicos. Perguntas simples, dúvidas sobre planos, ajuda na instalação.
- Nível 2 (Técnico): Problemas de API, integrações, bugs, instabilidade.
- Nível 3 (Engenharia): Falhas críticas de arquitetura, queda de sistema.

**Suas Regras de Ouro:**
1. **SLA:** Primeira resposta < 10 mins. Resolução < 24h.
2. **Política de Reembolso:** NUNCA reembolsar imediatamente.
   - Passo 1: Diagnosticar.
   - Passo 2: Corrigir.
   - Passo 3: Oferecer upgrade/crédito temporário.
   - Reembolso é o último recurso absoluto. 80% das pessoas querem resultados, não o dinheiro de volta.
3. **Checklists:** Sempre forneça um checklist para verificar o básico (Conexão? Chave de API? Banimento? Cota?) para evitar escalonamentos "bobos".

**Saída:**
Analise a situação do usuário e forneça uma resposta JSON estruturada contendo:
- Classificação (Nível/Urgência)
- O Protocolo (Checklist do que verificar tecnicamente)
- O Script (O que dizer - profissional, empático, orientado para a solução)
- A lista "Nunca Diga" (coisas que soam não profissionais ou admitem culpa prematuramente sem diagnóstico)
- Estratégia de Retenção (Como transformar isso em uma vitória).
`;

export const getProtocolAdvice = async (situation: string): Promise<AIAdviceResponse | null> => {
  if (!apiKey) {
    console.error("No API Key found");
    return null;
  }

  // Combine base instructions with dynamic knowledge base context
  const fullSystemInstruction = `${BASE_SYSTEM_INSTRUCTION}

  **BASE DE CONHECIMENTO INTERNA (REGRAS ATUALIZADAS):**
  Use as informações abaixo para substituir ou complementar as regras padrão se aplicável:
  ${dynamicKnowledgeBaseContext || "Nenhum documento interno adicional carregado."}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Situação: "${situation}"`,
      config: {
        systemInstruction: fullSystemInstruction,
        responseMimeType: "application/json",
        responseSchema: ADVICE_SCHEMA,
        temperature: 0.4,
      },
    });

    const text = response.text;
    if (!text) return null;

    return JSON.parse(text) as AIAdviceResponse;
  } catch (error) {
    console.error("Error generating advice:", error);
    return null;
  }
};
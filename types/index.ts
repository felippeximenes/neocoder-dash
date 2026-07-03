export type EsteiraStatus = "Em andamento" | "Aprovado" | "Concluído";
export type Prioridade = "Alta" | "Média" | "Baixa";

export interface EsteiraItem {
  id: string;
  nomeTarefa: string;
  status: EsteiraStatus;
  responsavel: string;
  retrabalho: number;
  percentualConcluido: number;
  diasAtraso: number;
  prioridade: Prioridade;
  dataEntrega: string | null;
}

export type DesignCliente = "LIBERPAY" | "NEOCODER";
export type DesignStatus =
  | "Em andamento"
  | "Aprovado"
  | "Aguardando aprovação"
  | "Em Ajuste";
export type Complexidade = "Alta" | "Média" | "Baixa";

export interface DesignItem {
  id: string;
  job: string;
  cliente: DesignCliente;
  status: DesignStatus;
  responsavelExterno: string;
  percentualConclusao: number;
  alteracoes: number;
  complexidade: Complexidade;
  prazo: string | null;
  entrega: string | null;
}

export type SmmStatus =
  | "Não iniciada"
  | "Em andamento"
  | "Em revisão"
  | "Em agendamento"
  | "Em standby"
  | "Concluído";
export type Plataforma = "Instagram" | "LinkedIn" | "Twitter/X";

export interface SmmItem {
  id: string;
  name: string;
  status: SmmStatus;
  assign: string;
  plataforma: Plataforma;
  startData: string | null;
  finalData: string | null;
}

export interface StatusCount {
  name: string;
  value: number;
}

export interface ScorecardData {
  label: string;
  value: number;
}

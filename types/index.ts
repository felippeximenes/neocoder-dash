export type Cliente = "LIBERPAY" | "NEOCODER" | "KOTAI";
export type Recorrencia = "A cada 15 dias" | "A cada 30 dias";

export type EsteiraStatus = "Não iniciado" | "Em andamento" | "Aprovado" | "Concluído";
export type Prioridade = "Alta" | "Média" | "Baixa";

export interface EsteiraItem {
  id: string;
  nomeTarefa: string;
  status: EsteiraStatus;
  responsavel: string;
  cliente: Cliente | null;
  recorrencia: Recorrencia | null;
  retrabalho: number;
  percentualConcluido: number;
  percentualEscopoConcluido: number;
  percentualAgendado: number;
  diasAtraso: number;
  prioridade: Prioridade;
  dataEntrega: string | null;
}

export type DesignCliente = Cliente;
export type DesignStatus =
  | "Em andamento"
  | "Aprovado"
  | "Aguardando aprovação"
  | "Aguardando informações"
  | "Em Ajuste";
export type Complexidade = "Alta" | "Média" | "Baixa";
export type Risco = "Baixo" | "Médio" | "Alto";
export type SolicitanteArea = "Marketing" | "Produto" | "Comercial" | "CX";

export interface DesignItem {
  id: string;
  job: string;
  cliente: DesignCliente;
  status: DesignStatus;
  responsavelExterno: string;
  solicitanteArea: SolicitanteArea | null;
  percentualConclusao: number;
  alteracoes: number;
  complexidade: Complexidade;
  risco: Risco | null;
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

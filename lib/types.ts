export type ActivityStatus = 'Nao iniciado' | 'Em andamento' | 'Concluido' | 'Atrasado';

export interface Activity {
  id: string;
  edt: string;
  nome: string;
  duracaoDias: number;
  inicioLB: string;
  terminoLB: string;
  inicioReal?: string;
  terminoReal?: string;
  previstoPct: number;
  realizadoPct: number;
  desvioPrevPct?: number;
  desvioRealPct?: number;
  status: ActivityStatus;
}

export interface DailyEntry {
  id: string;
  dataLancamento: string;
  usuario: string;
  idAtividade: string;
  edt: string;
  nomeAtividade: string;
  inicioPlanejado: string;
  terminoPlanejado: string;
  inicioReal?: string;
  terminoReal?: string;
  previstoPct: number;
  realizadoPctAnterior: number;
  realizadoPctNovo: number;
  avancoDoDiaPct: number;
  observacao: string;
  status: ActivityStatus;
  evidencia?: string;
  timestamp: string;
  poeira: boolean;
  neblina: boolean;
  chuvas: boolean;
  pluviometriaMm: number;
}

export interface MicroActivity {
  id: string;
  dataLancamento: string;
  usuario: string;
  idAtividadePai: string;
  edtPai: string;
  nomeAtividadePai: string;
  descricaoMicro: string;
  equipamento: string;
  quantidade: number;
  unidade: string;
  horasTrabalhadas: number;
  status: string;
  observacao: string;
  timestamp: string;
  isAvulsa?: boolean;
}

export interface Equipment {
  codigo: string;
  descricao: string;
  ativo: boolean;
}

export interface DayClimate {
  data: string;
  poeira: boolean;
  neblina: boolean;
  chuvas: boolean;
  pluviometriaMm: number;
  registradoPor: string;
}

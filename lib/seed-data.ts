import { Activity, Equipment } from './types';

export const SEED_ACTIVITIES: Activity[] = [
  {
    id: '1', edt: '1', nome: 'Descaracterizacao Barragem Alto Jacutinga',
    duracaoDias: 392, inicioLB: '2025-05-09', terminoLB: '2026-12-18',
    inicioReal: '2025-05-09', previstoPct: 16.74, realizadoPct: 16.75,
    desvioPrevPct: 0.01, desvioRealPct: 0.01, status: 'Em andamento',
  },
  {
    id: '2', edt: '1.1', nome: 'Descaracterizacao Barragem Alto Jacutinga',
    duracaoDias: 392, inicioLB: '2025-05-09', terminoLB: '2026-12-18',
    inicioReal: '2025-05-09', previstoPct: 16.74, realizadoPct: 16.75,
    desvioPrevPct: 0.01, desvioRealPct: 0.01, status: 'Em andamento',
  },
  {
    id: '3', edt: '1.1.1', nome: 'Marcos Gerenciais',
    duracaoDias: 392, inicioLB: '2025-05-09', terminoLB: '2026-12-18',
    inicioReal: '2025-05-09', previstoPct: 0, realizadoPct: 0, status: 'Em andamento',
  },
  {
    id: '4', edt: '1.1.1.1', nome: 'Marco de Inicio GMOC',
    duracaoDias: 0, inicioLB: '2025-05-09', terminoLB: '2025-05-09',
    inicioReal: '2025-05-09', terminoReal: '2025-05-09',
    previstoPct: 0, realizadoPct: 0, status: 'Concluido',
  },
  {
    id: '5', edt: '1.1.1.2', nome: 'Restricoes para Inicio de Obra',
    duracaoDias: 139, inicioLB: '2025-05-30', terminoLB: '2025-12-19',
    inicioReal: '2025-05-30', terminoReal: '2025-12-19',
    previstoPct: 0, realizadoPct: 0, status: 'Concluido',
  },
  {
    id: '6', edt: '1.1.1.2.1', nome: 'Marco - Entrega do Projeto Conceitual',
    duracaoDias: 0, inicioLB: '2025-05-30', terminoLB: '2025-05-30',
    inicioReal: '2025-05-30', terminoReal: '2025-05-30',
    previstoPct: 0, realizadoPct: 0, status: 'Concluido',
  },
  {
    id: '7', edt: '1.1.1.2.2', nome: 'Marco - Inicio RIPLA',
    duracaoDias: 0, inicioLB: '2025-06-25', terminoLB: '2025-06-25',
    inicioReal: '2025-06-25', terminoReal: '2025-06-25',
    previstoPct: 0, realizadoPct: 0, status: 'Concluido',
  },
  {
    id: '8', edt: '1.1.1.2.3', nome: 'Marco - Entrega do Projeto Executivo',
    duracaoDias: 0, inicioLB: '2025-10-24', terminoLB: '2025-10-24',
    inicioReal: '2025-10-24', terminoReal: '2025-10-24',
    previstoPct: 0, realizadoPct: 0, status: 'Concluido',
  },
  {
    id: '9', edt: '1.1.1.2.4', nome: 'Marco - Inicio HIRA',
    duracaoDias: 0, inicioLB: '2025-09-09', terminoLB: '2025-09-09',
    inicioReal: '2025-09-09', terminoReal: '2025-09-09',
    previstoPct: 0, realizadoPct: 0, status: 'Concluido',
  },
  {
    id: '10', edt: '1.1.1.2.5', nome: 'Marco - Protocolado Pedido Emergencial junto aos Orgaos Publicos',
    duracaoDias: 0, inicioLB: '2025-12-02', terminoLB: '2025-12-02',
    inicioReal: '2025-12-02', terminoReal: '2025-12-02',
    previstoPct: 0, realizadoPct: 0, status: 'Concluido',
  },
  {
    id: '11', edt: '1.1.1.2.6', nome: 'Marco de Comunicacao Previa (RC e RI)',
    duracaoDias: 0, inicioLB: '2025-12-19', terminoLB: '2025-12-19',
    inicioReal: '2025-12-19', terminoReal: '2025-12-19',
    previstoPct: 0, realizadoPct: 0, status: 'Concluido',
  },
  {
    id: '12', edt: '1.1.1.3', nome: 'Marcos de Controle Cronograma',
    duracaoDias: 338, inicioLB: '2025-07-28', terminoLB: '2026-12-18',
    inicioReal: '2025-07-28', previstoPct: 0, realizadoPct: 0, status: 'Em andamento',
  },
  {
    id: '13', edt: '1.1.1.3.1', nome: 'Marco - Inicio da Mobilizacao Terrabel',
    duracaoDias: 0, inicioLB: '2025-07-28', terminoLB: '2025-07-28',
    inicioReal: '2025-07-28', terminoReal: '2025-07-28',
    previstoPct: 0, realizadoPct: 0, status: 'Concluido',
  },
  {
    id: '14', edt: '1.1.1.3.2', nome: 'Marco Inicio da Obra',
    duracaoDias: 0, inicioLB: '2025-12-03', terminoLB: '2025-12-03',
    inicioReal: '2025-12-03', terminoReal: '2025-12-03',
    previstoPct: 0, realizadoPct: 0, status: 'Concluido',
  },
  {
    id: '15', edt: '1.1.1.3.3', nome: 'Marco de Termino da Obra',
    duracaoDias: 0, inicioLB: '2026-12-18', terminoLB: '2026-12-18',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '16', edt: '1.1.2', nome: 'Fase 01: Servicos Preliminares',
    duracaoDias: 128, inicioLB: '2025-05-30', terminoLB: '2025-12-02',
    inicioReal: '2025-05-30', terminoReal: '2025-12-02',
    previstoPct: 100, realizadoPct: 100, status: 'Concluido',
  },
  {
    id: '17', edt: '1.1.2.1', nome: 'Projeto',
    duracaoDias: 103, inicioLB: '2025-05-30', terminoLB: '2025-10-24',
    inicioReal: '2025-05-30', terminoReal: '2025-10-24',
    previstoPct: 100, realizadoPct: 100, status: 'Concluido',
  },
  {
    id: '18', edt: '1.1.2.1.1', nome: 'Entrega Projeto Conceitual',
    duracaoDias: 1, inicioLB: '2025-05-30', terminoLB: '2025-05-30',
    inicioReal: '2025-05-30', terminoReal: '2025-05-30',
    previstoPct: 100, realizadoPct: 100, status: 'Concluido',
  },
  {
    id: '19', edt: '1.1.2.1.2', nome: 'Revisao Projeto Conceitual',
    duracaoDias: 1, inicioLB: '2025-07-25', terminoLB: '2025-07-25',
    inicioReal: '2025-07-25', terminoReal: '2025-07-25',
    previstoPct: 100, realizadoPct: 100, status: 'Concluido',
  },
  {
    id: '20', edt: '1.1.2.1.3', nome: 'Entrega do Projeto Executivo',
    duracaoDias: 37, inicioLB: '2025-09-04', terminoLB: '2025-10-24',
    inicioReal: '2025-09-04', terminoReal: '2025-10-24',
    previstoPct: 100, realizadoPct: 100, status: 'Concluido',
  },
  {
    id: '21', edt: '1.1.2.2', nome: 'RIPLA',
    duracaoDias: 112, inicioLB: '2025-06-25', terminoLB: '2025-12-02',
    inicioReal: '2025-06-25', terminoReal: '2025-12-02',
    previstoPct: 100, realizadoPct: 100, status: 'Concluido',
  },
  {
    id: '22', edt: '1.1.2.2.1', nome: 'Entrega RIPLA',
    duracaoDias: 37, inicioLB: '2025-06-25', terminoLB: '2025-08-15',
    inicioReal: '2025-06-25', terminoReal: '2025-08-15',
    previstoPct: 100, realizadoPct: 100, status: 'Concluido',
  },
  {
    id: '23', edt: '1.1.2.2.2', nome: 'Parecer da RIPLA',
    duracaoDias: 12, inicioLB: '2025-08-16', terminoLB: '2025-08-27',
    inicioReal: '2025-08-16', terminoReal: '2025-08-27',
    previstoPct: 100, realizadoPct: 100, status: 'Concluido',
  },
  {
    id: '24', edt: '1.1.2.2.3', nome: 'Inventario Ambiental',
    duracaoDias: 51, inicioLB: '2025-08-28', terminoLB: '2025-10-17',
    inicioReal: '2025-08-28', terminoReal: '2025-10-17',
    previstoPct: 100, realizadoPct: 100, status: 'Concluido',
  },
  {
    id: '25', edt: '1.1.2.2.4', nome: 'Envio do Pedido de Emergencialidade ao Orgao de Licenciamento Ambiental',
    duracaoDias: 47, inicioLB: '2025-10-17', terminoLB: '2025-12-02',
    inicioReal: '2025-10-17', terminoReal: '2025-12-02',
    previstoPct: 100, realizadoPct: 100, status: 'Concluido',
  },
  {
    id: '26', edt: '1.1.2.3', nome: 'Riscos',
    duracaoDias: 13, inicioLB: '2025-09-09', terminoLB: '2025-09-25',
    inicioReal: '2025-09-09', terminoReal: '2025-09-25',
    previstoPct: 100, realizadoPct: 100, status: 'Concluido',
  },
  {
    id: '27', edt: '1.1.2.3.1', nome: 'HIRA',
    duracaoDias: 13, inicioLB: '2025-09-09', terminoLB: '2025-09-25',
    inicioReal: '2025-09-09', terminoReal: '2025-09-25',
    previstoPct: 100, realizadoPct: 100, status: 'Concluido',
  },
  {
    id: '28', edt: '1.1.2.3.1.1', nome: 'Forum de Discussao',
    duracaoDias: 3, inicioLB: '2025-09-09', terminoLB: '2025-09-11',
    inicioReal: '2025-09-09', terminoReal: '2025-09-11',
    previstoPct: 100, realizadoPct: 100, status: 'Concluido',
  },
  {
    id: '29', edt: '1.1.2.3.1.2', nome: 'Elaboracao do Relatorio de Riscos HIRA',
    duracaoDias: 10, inicioLB: '2025-09-12', terminoLB: '2025-09-25',
    inicioReal: '2025-09-12', terminoReal: '2025-09-25',
    previstoPct: 100, realizadoPct: 100, status: 'Concluido',
  },
  {
    id: '30', edt: '1.1.2.4', nome: 'Mobilizacao Equipe Obras',
    duracaoDias: 49, inicioLB: '2025-07-28', terminoLB: '2025-10-03',
    inicioReal: '2025-07-28', terminoReal: '2025-10-03',
    previstoPct: 100, realizadoPct: 100, status: 'Concluido',
  },
  {
    id: '31', edt: '1.1.2.4.1', nome: 'Mobilizacao Mao de Obra + Equipamentos Obras (Terrabel)',
    duracaoDias: 49, inicioLB: '2025-07-28', terminoLB: '2025-10-03',
    inicioReal: '2025-07-28', terminoReal: '2025-10-03',
    previstoPct: 100, realizadoPct: 100, status: 'Concluido',
  },
  {
    id: '32', edt: '1.1.2.5', nome: 'Ponto de Apoio para Regularizacao de Acessos',
    duracaoDias: 42, inicioLB: '2025-09-01', terminoLB: '2025-10-28',
    inicioReal: '2025-09-01', terminoReal: '2025-10-28',
    previstoPct: 100, realizadoPct: 100, status: 'Concluido',
  },
  {
    id: '33', edt: '1.1.2.5.1', nome: 'Instalacao do Ponto de Apoio para Regularizacao de Acessos (tenda)',
    duracaoDias: 6, inicioLB: '2025-09-04', terminoLB: '2025-09-11',
    inicioReal: '2025-09-04', terminoReal: '2025-09-11',
    previstoPct: 100, realizadoPct: 100, status: 'Concluido',
  },
  {
    id: '34', edt: '1.1.2.5.2', nome: 'Mobilizacao Banheiros Quimicos',
    duracaoDias: 1, inicioLB: '2025-09-01', terminoLB: '2025-09-01',
    inicioReal: '2025-09-01', terminoReal: '2025-09-01',
    previstoPct: 100, realizadoPct: 100, status: 'Concluido',
  },
  {
    id: '35', edt: '1.1.2.5.3', nome: 'Icamento Containers (canteiro avancado)',
    duracaoDias: 12, inicioLB: '2025-09-23', terminoLB: '2025-10-08',
    inicioReal: '2025-09-23', terminoReal: '2025-10-08',
    previstoPct: 100, realizadoPct: 100, status: 'Concluido',
  },
  {
    id: '36', edt: '1.1.2.5.4', nome: 'Manutencao/Regularizacao de Acessos ja Existentes (Sem Supressao Vegetal)',
    duracaoDias: 30, inicioLB: '2025-09-17', terminoLB: '2025-10-28',
    inicioReal: '2025-09-17', terminoReal: '2025-10-28',
    previstoPct: 100, realizadoPct: 100, status: 'Concluido',
  },
  {
    id: '37', edt: '1.1.2.6', nome: 'Rebaixamento Reservatorio (Fase 01)',
    duracaoDias: 23, inicioLB: '2026-01-01', terminoLB: '2026-02-01',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '38', edt: '1.1.2.6.1', nome: 'Inicio do Rebaixamento do Nivel Dagua do Reservatorio',
    duracaoDias: 23, inicioLB: '2026-01-01', terminoLB: '2026-02-01',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '39', edt: '1.1.3', nome: 'Protocolado Pedido Emergencial junto aos Orgaos Publicos',
    duracaoDias: 72, inicioLB: '2025-12-02', terminoLB: '2026-03-31',
    inicioReal: '2025-12-02', previstoPct: 9.1, realizadoPct: 9.1, status: 'Em andamento',
  },
  {
    id: '40', edt: '1.1.3.1', nome: 'Protocolado Pedido Emergencial junto aos Orgaos Publicos',
    duracaoDias: 0, inicioLB: '2025-12-02', terminoLB: '2025-12-02',
    inicioReal: '2025-12-02', terminoReal: '2025-12-02',
    previstoPct: 0, realizadoPct: 0, status: 'Concluido',
  },
  {
    id: '41', edt: '1.1.3.2', nome: 'Meio Ambiente',
    duracaoDias: 70, inicioLB: '2025-12-04', terminoLB: '2026-03-31',
    inicioReal: '2025-12-04', previstoPct: 9.1, realizadoPct: 9.1, status: 'Em andamento',
  },
  {
    id: '42', edt: '1.1.3.2.1', nome: 'Resgate de Flora',
    duracaoDias: 1, inicioLB: '2025-12-04', terminoLB: '2025-12-04',
    inicioReal: '2025-12-04', terminoReal: '2025-12-04',
    previstoPct: 100, realizadoPct: 100, status: 'Concluido',
  },
  {
    id: '43', edt: '1.1.3.2.2', nome: 'Supressao Vegetal',
    duracaoDias: 59, inicioLB: '2026-01-05', terminoLB: '2026-03-31',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '44', edt: '1.1.4', nome: 'Fase 02: Obras',
    duracaoDias: 264, inicioLB: '2025-11-10', terminoLB: '2026-12-18',
    inicioReal: '2025-11-10', previstoPct: 1.31, realizadoPct: 1.33,
    desvioPrevPct: 0.02, desvioRealPct: 0.02, status: 'Em andamento',
  },
  {
    id: '45', edt: '1.1.4.1', nome: 'Canteiro de Obras',
    duracaoDias: 149, inicioLB: '2025-11-10', terminoLB: '2026-07-03',
    inicioReal: '2025-11-10', previstoPct: 27.29, realizadoPct: 27.61,
    desvioPrevPct: 0.32, desvioRealPct: 0.32, status: 'Em andamento',
  },
  {
    id: '46', edt: '1.1.4.1.1', nome: 'Construcao de Canteiro + Estacionamentos - Terraplenagem',
    duracaoDias: 42, inicioLB: '2025-11-10', terminoLB: '2026-01-23',
    inicioReal: '2025-11-10', previstoPct: 52.38, realizadoPct: 53,
    desvioPrevPct: 0.62, desvioRealPct: 0.62, status: 'Em andamento',
  },
  {
    id: '47', edt: '1.1.4.1.2', nome: 'Regularizacao de Acessos',
    duracaoDias: 60, inicioLB: '2026-03-31', terminoLB: '2026-07-03',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '48', edt: '1.1.4.2', nome: 'Rebaixamento Reservatorio',
    duracaoDias: 170, inicioLB: '2026-01-07', terminoLB: '2026-09-14',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '49', edt: '1.1.4.2.1', nome: 'Rebaixamento do Reservatorio com Implantacao de Sistema de Clarificacao',
    duracaoDias: 170, inicioLB: '2026-01-07', terminoLB: '2026-09-14',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '50', edt: '1.1.4.3', nome: 'Aterro de Conquista',
    duracaoDias: 25, inicioLB: '2026-02-04', terminoLB: '2026-03-13',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '51', edt: '1.1.4.3.1', nome: 'Implantacao do Aterro de Conquista Ao Redor do Reservatorio',
    duracaoDias: 25, inicioLB: '2026-02-04', terminoLB: '2026-03-13',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '52', edt: '1.1.4.4', nome: 'Escavacao/Remocao de Sedimentos do Reservatorio (aprox. 70.000 m3)',
    duracaoDias: 110, inicioLB: '2026-02-11', terminoLB: '2026-07-24',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '53', edt: '1.1.4.4.1', nome: 'Escavacao/Remocao de Sedimentos do Reservatorio',
    duracaoDias: 110, inicioLB: '2026-02-11', terminoLB: '2026-07-24',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '54', edt: '1.1.4.5', nome: 'Instrumentacao na Area de Interferencia',
    duracaoDias: 80, inicioLB: '2026-07-27', terminoLB: '2026-11-18',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '55', edt: '1.1.4.5.1', nome: 'Remocao de Instrumentacao na Area de Interferencia do Macico da Estrutura',
    duracaoDias: 80, inicioLB: '2026-07-27', terminoLB: '2026-11-18',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '56', edt: '1.1.4.6', nome: 'Remocao do Enrocamento e Demolicao de Canaleta',
    duracaoDias: 15, inicioLB: '2026-07-27', terminoLB: '2026-08-14',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '57', edt: '1.1.4.6.1', nome: 'Remocao do Enrocamento de Protecao no Talude de Montante e no Pe do Talude',
    duracaoDias: 15, inicioLB: '2026-07-27', terminoLB: '2026-08-14',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '58', edt: '1.1.4.6.2', nome: 'Demolicao da Canaleta de Berma de Concreto',
    duracaoDias: 15, inicioLB: '2026-07-27', terminoLB: '2026-08-14',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '59', edt: '1.1.4.7', nome: 'Escavacao do Macico da Barragem com Rebaixamento da Soleira do Extravasor',
    duracaoDias: 20, inicioLB: '2026-08-17', terminoLB: '2026-09-14',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '60', edt: '1.1.4.7.1', nome: 'Escavacao do Macico da Barragem',
    duracaoDias: 20, inicioLB: '2026-08-17', terminoLB: '2026-09-14',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '61', edt: '1.1.4.7.2', nome: 'Rebaixamento da Soleira do Extravasor',
    duracaoDias: 20, inicioLB: '2026-08-17', terminoLB: '2026-09-14',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '62', edt: '1.1.4.8', nome: 'Desvio do Corrego do Meio',
    duracaoDias: 10, inicioLB: '2026-09-15', terminoLB: '2026-09-28',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '63', edt: '1.1.4.8.1', nome: 'Implantacao de Sistema Provisorio para Desvio do Curso Dagua Local',
    duracaoDias: 10, inicioLB: '2026-09-15', terminoLB: '2026-09-28',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '64', edt: '1.1.4.9', nome: 'Construcao da Espinha de Peixe',
    duracaoDias: 30, inicioLB: '2026-09-29', terminoLB: '2026-11-11',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '65', edt: '1.1.4.9.1', nome: 'Construcao Estruturas Hidraulicas - Espinha de Peixe para Captacao e Conducao do Escoamento Superficial',
    duracaoDias: 30, inicioLB: '2026-09-29', terminoLB: '2026-11-11',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '66', edt: '1.1.4.9.2', nome: 'Construcao da Caixa de Confluencia',
    duracaoDias: 30, inicioLB: '2026-09-29', terminoLB: '2026-11-11',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '67', edt: '1.1.4.10', nome: 'ADME - Bota-espera',
    duracaoDias: 200, inicioLB: '2026-02-11', terminoLB: '2026-12-03',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '68', edt: '1.1.4.10.1', nome: 'ADME - Espalhamento, Empilhamento e Secamento do Material de Solo Mole',
    duracaoDias: 110, inicioLB: '2026-02-11', terminoLB: '2026-07-24',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '69', edt: '1.1.4.10.2', nome: 'Carga e Transporte do Material Seco para a ADMF',
    duracaoDias: 90, inicioLB: '2026-07-27', terminoLB: '2026-12-03',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '70', edt: '1.1.4.11', nome: 'ADMF',
    duracaoDias: 100, inicioLB: '2026-07-27', terminoLB: '2026-12-18',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '71', edt: '1.1.4.11.1', nome: 'ADMF - Espalhamento, Empilhamento, Aterro e Esteiramento do Material Escavado',
    duracaoDias: 100, inicioLB: '2026-07-27', terminoLB: '2026-12-18',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '72', edt: '1.1.4.11.2', nome: 'ADMF - Compactacao de Solo e Face',
    duracaoDias: 100, inicioLB: '2026-07-27', terminoLB: '2026-12-18',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '73', edt: '1.1.4.12', nome: 'Fechamento e Revegetacao na Area de Supressao Vegetal com Hidrossemeadura',
    duracaoDias: 10, inicioLB: '2026-11-12', terminoLB: '2026-11-26',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '74', edt: '1.1.4.12.1', nome: 'Protecao Vegetal',
    duracaoDias: 10, inicioLB: '2026-11-12', terminoLB: '2026-11-26',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '75', edt: '1.1.4.12.1.1', nome: 'Protecao Vegetal',
    duracaoDias: 10, inicioLB: '2026-11-12', terminoLB: '2026-11-26',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '76', edt: '1.1.4.12.2', nome: 'Adequacoes de Finalizacao da Obra',
    duracaoDias: 10, inicioLB: '2026-11-12', terminoLB: '2026-11-26',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '77', edt: '1.1.4.12.2.1', nome: 'Adequacoes de Finalizacao da Obra',
    duracaoDias: 10, inicioLB: '2026-11-12', terminoLB: '2026-11-26',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '78', edt: '1.1.5', nome: 'Desmobilizacao - Equipamento + Mao de Obra',
    duracaoDias: 30, inicioLB: '2026-11-05', terminoLB: '2026-12-18',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '79', edt: '1.1.5.1', nome: 'Desmobilizacao Mao de Obra + Equipamentos Obras (Terrabel)',
    duracaoDias: 30, inicioLB: '2026-11-05', terminoLB: '2026-12-18',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '80', edt: '1.1.6', nome: 'Entrega da Obra',
    duracaoDias: 0, inicioLB: '2026-12-18', terminoLB: '2026-12-18',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
  {
    id: '81', edt: '1.1.6.1', nome: 'Entrega da Descaracterizacao da Barragem Alto Jacutinga',
    duracaoDias: 0, inicioLB: '2026-12-18', terminoLB: '2026-12-18',
    previstoPct: 0, realizadoPct: 0, status: 'Nao iniciado',
  },
];

export const SEED_EQUIPMENT: Equipment[] = [
  { codigo: '23120', descricao: 'Caminhao basculante', ativo: true },
  { codigo: 'MQ2616', descricao: 'Caminhao Pipa', ativo: true },
  { codigo: '0913', descricao: 'Retroescavadeira', ativo: true },
  { codigo: 'EX350', descricao: 'Escavadeira hidraulica', ativo: true },
  { codigo: 'PA930', descricao: 'Pa carregadeira', ativo: true },
  { codigo: 'RL120', descricao: 'Rolo compactador', ativo: true },
  { codigo: 'MT700', descricao: 'Motoniveladora', ativo: true },
  { codigo: 'DR200', descricao: 'Draga de succao', ativo: true },
  { codigo: 'BB100', descricao: 'Bomba submersa', ativo: true },
  { codigo: 'GR050', descricao: 'Guindaste', ativo: true },
];

export const UNITS = ['m3', 'm2', 'm', 't', 'un', 'h', 'km', 'L', 'vg'];

export const PROJECT_NAME = 'Descaracterizacao da Barragem Alto Jacutinga';

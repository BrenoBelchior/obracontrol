export function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

export function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export function statusColor(status: string): string {
  switch (status) {
    case 'Concluido': return '#10B981';
    case 'Em andamento': return '#3B82F6';
    case 'Atrasado': return '#EF4444';
    case 'Nao iniciado': return '#94A3B8';
    default: return '#64748B';
  }
}

export function statusLabel(status: string): string {
  switch (status) {
    case 'Concluido': return 'Concluido';
    case 'Em andamento': return 'Em andamento';
    case 'Atrasado': return 'Atrasado';
    case 'Nao iniciado': return 'Nao iniciado';
    default: return status;
  }
}

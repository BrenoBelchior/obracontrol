import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  RefreshControl,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import Colors from '@/constants/colors';
import { getActivities, getEntriesByDate, getMicroByDate, getClimate } from '@/lib/storage';
import { todayStr, formatDate, statusColor, statusLabel } from '@/lib/helpers';
import { PROJECT_NAME } from '@/lib/seed-data';
import { DailyEntry, Activity } from '@/lib/types';

export default function ReportScreen() {
  const [dateRef, setDateRef] = useState(todayStr());

  const { data: activities = [], refetch: rAct } = useQuery({
    queryKey: ['activities'],
    queryFn: getActivities,
  });

  const { data: entries = [], refetch: rEntries } = useQuery({
    queryKey: ['entries', dateRef],
    queryFn: () => getEntriesByDate(dateRef),
  });

  const { data: micros = [], refetch: rMicro } = useQuery({
    queryKey: ['micros', dateRef],
    queryFn: () => getMicroByDate(dateRef),
  });

  const { data: climate, refetch: rClimate } = useQuery({
    queryKey: ['climate', dateRef],
    queryFn: () => getClimate(dateRef),
  });

  const refresh = () => { rAct(); rEntries(); rMicro(); rClimate(); };

  const summary = useMemo(() => {
    const totalAdvance = entries.reduce((s, e) => s + e.avancoDoDiaPct, 0);
    const users = [...new Set(entries.map(e => e.usuario))];
    const delayed = activities.filter(a => a.status === 'Atrasado');
    const delayedImpacted = delayed.filter(d => entries.some(e => e.idAtividade === d.id));
    const totalHours = micros.reduce((s, m) => s + m.horasTrabalhadas, 0);
    return { totalAdvance, users, delayed, delayedImpacted, totalHours };
  }, [entries, activities, micros]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, Platform.OS === 'web' && { paddingTop: 67, paddingBottom: 84 + 34 }]}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} tintColor={Colors.accent} />}
    >
      <View style={styles.titleRow}>
        <Ionicons name="document-text" size={24} color={Colors.accent} />
        <Text style={styles.title}>Relatorio Diario</Text>
      </View>

      <View style={styles.datePickerRow}>
        <Text style={styles.label}>Data de referencia</Text>
        <TextInput
          style={styles.dateInput}
          value={dateRef}
          onChangeText={setDateRef}
          placeholder="AAAA-MM-DD"
          placeholderTextColor={Colors.textTertiary}
        />
      </View>

      <View style={styles.headerCard}>
        <Text style={styles.headerProject}>{PROJECT_NAME}</Text>
        <Text style={styles.headerDate}>{formatDate(dateRef)}</Text>
        <View style={styles.climateRow}>
          <View style={styles.climatePill}>
            <Ionicons name="partly-sunny-outline" size={14} color={climate?.poeira ? Colors.warning : Colors.textTertiary} />
            <Text style={styles.climateText}>Poeira: {climate?.poeira ? 'Sim' : 'Nao'}</Text>
          </View>
          <View style={styles.climatePill}>
            <Ionicons name="water-outline" size={14} color={climate?.neblina ? Colors.info : Colors.textTertiary} />
            <Text style={styles.climateText}>Neblina: {climate?.neblina ? 'Sim' : 'Nao'}</Text>
          </View>
          <View style={styles.climatePill}>
            <Ionicons name="rainy-outline" size={14} color={climate?.chuvas ? Colors.danger : Colors.textTertiary} />
            <Text style={styles.climateText}>Chuvas: {climate?.chuvas ? 'Sim' : 'Nao'}</Text>
          </View>
        </View>
        {climate?.pluviometriaMm !== undefined && climate.pluviometriaMm > 0 && (
          <Text style={styles.pluvio}>Pluviometria: {climate.pluviometriaMm} mm</Text>
        )}
        {summary.users.length > 0 && (
          <Text style={styles.usersText}>Usuarios: {summary.users.join(', ')}</Text>
        )}
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.sectionTitle}>Resumo executivo</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{entries.length}</Text>
            <Text style={styles.summaryLabel}>Lancamentos</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{summary.totalAdvance.toFixed(1)}%</Text>
            <Text style={styles.summaryLabel}>Avanco total</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{summary.totalHours.toFixed(1)}h</Text>
            <Text style={styles.summaryLabel}>Horas</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: Colors.danger }]}>{summary.delayed.length}</Text>
            <Text style={styles.summaryLabel}>Atrasadas</Text>
          </View>
        </View>
      </View>

      {entries.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lancamentos do dia</Text>
          {entries.map((e, i) => (
            <View key={i} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryEdt}>{e.edt}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusColor(e.status) + '18' }]}>
                  <Text style={[styles.statusText, { color: statusColor(e.status) }]}>{statusLabel(e.status)}</Text>
                </View>
              </View>
              <Text style={styles.entryName}>{e.nomeAtividade}</Text>
              <View style={styles.entryDetail}>
                <Text style={styles.detailLabel}>Anterior: {e.realizadoPctAnterior}%</Text>
                <Ionicons name="arrow-forward" size={12} color={Colors.textTertiary} />
                <Text style={styles.detailLabel}>Novo: {e.realizadoPctNovo}%</Text>
                <Text style={[styles.detailAdvance, { color: Colors.success }]}>+{e.avancoDoDiaPct.toFixed(1)}%</Text>
              </View>
              {e.observacao ? <Text style={styles.obs}>{e.observacao}</Text> : null}
            </View>
          ))}
        </View>
      )}

      {entries.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="file-tray-outline" size={40} color={Colors.textTertiary} />
          <Text style={styles.emptyText}>Nenhum lancamento para esta data</Text>
        </View>
      )}

      {summary.delayed.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors.danger }]}>Pendencias / Atrasos</Text>
          {summary.delayed.map((a, i) => (
            <View key={i} style={[styles.delayCard]}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryEdt}>{a.edt}</Text>
                <Text style={[styles.detailAdvance, { color: Colors.danger }]}>{a.realizadoPct}%</Text>
              </View>
              <Text style={styles.entryName}>{a.nome}</Text>
              <Text style={styles.detailLabel}>Termino planejado: {formatDate(a.terminoLB)}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 120 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text },
  datePickerRow: { marginBottom: 16 },
  label: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600', marginBottom: 6 },
  dateInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    fontWeight: '600',
  },
  headerCard: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
  },
  headerProject: { fontSize: 14, color: Colors.white + 'CC', fontWeight: '600' },
  headerDate: { fontSize: 22, fontWeight: '800', color: Colors.white, marginTop: 4, marginBottom: 12 },
  climateRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  climatePill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.white + '15', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  climateText: { fontSize: 11, color: Colors.white + 'CC', fontWeight: '500' },
  pluvio: { fontSize: 12, color: Colors.white + 'BB', marginTop: 8 },
  usersText: { fontSize: 12, color: Colors.white + 'BB', marginTop: 4 },
  summaryCard: { backgroundColor: Colors.surface, borderRadius: 14, padding: 18, marginBottom: 20, borderWidth: 1, borderColor: Colors.border },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryItem: { alignItems: 'center' },
  summaryValue: { fontSize: 22, fontWeight: '800', color: Colors.text },
  summaryLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 2, fontWeight: '500' },
  section: { marginBottom: 20 },
  entryCard: { backgroundColor: Colors.surface, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: Colors.border },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  entryEdt: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '600' },
  entryName: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 6 },
  entryDetail: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailLabel: { fontSize: 12, color: Colors.textSecondary },
  detailAdvance: { fontSize: 13, fontWeight: '700', marginLeft: 'auto' },
  obs: { fontSize: 12, color: Colors.textSecondary, marginTop: 6, fontStyle: 'italic' },
  emptyState: { alignItems: 'center', paddingVertical: 40, gap: 10 },
  emptyText: { fontSize: 14, color: Colors.textTertiary },
  delayCard: { backgroundColor: Colors.dangerLight, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: Colors.danger + '30' },
});

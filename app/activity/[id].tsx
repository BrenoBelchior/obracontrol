import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { getActivity, updateActivity, getEntriesByActivity, getMicroByActivity } from '@/lib/storage';
import { formatDate, statusColor, statusLabel, todayStr } from '@/lib/helpers';

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: activity, refetch, isLoading } = useQuery({
    queryKey: ['activity', id],
    queryFn: () => getActivity(id),
  });

  const { data: entries = [] } = useQuery({
    queryKey: ['activityEntries', id],
    queryFn: () => getEntriesByActivity(id),
  });

  const { data: micros = [] } = useQuery({
    queryKey: ['activityMicros', id],
    queryFn: () => getMicroByActivity(id),
  });

  if (!activity) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.textTertiary} />
        <Text style={styles.emptyText}>Atividade nao encontrada</Text>
      </View>
    );
  }

  const markStart = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const updated = { ...activity, inicioReal: todayStr() };
    await updateActivity(updated);
    queryClient.invalidateQueries({ queryKey: ['activities'] });
    refetch();
  };

  const markEnd = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const updated = { ...activity, terminoReal: todayStr(), realizadoPct: 100 };
    await updateActivity(updated);
    queryClient.invalidateQueries({ queryKey: ['activities'] });
    refetch();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={Colors.accent} />}
    >
      <View style={styles.topCard}>
        <View style={styles.topRow}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor(activity.status) + '18' }]}>
            <View style={[styles.dot, { backgroundColor: statusColor(activity.status) }]} />
            <Text style={[styles.statusText, { color: statusColor(activity.status) }]}>{statusLabel(activity.status)}</Text>
          </View>
          <Text style={styles.edtBig}>{activity.edt}</Text>
        </View>
        <Text style={styles.actName}>{activity.nome}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datas planejadas</Text>
        <View style={styles.row}>
          <InfoBox label="Inicio LB" value={formatDate(activity.inicioLB)} icon="calendar-outline" />
          <InfoBox label="Termino LB" value={formatDate(activity.terminoLB)} icon="calendar-outline" />
          <InfoBox label="Duracao" value={`${activity.duracaoDias}d`} icon="time-outline" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datas reais</Text>
        <View style={styles.row}>
          <InfoBox label="Inicio real" value={activity.inicioReal ? formatDate(activity.inicioReal) : '-'} icon="flag-outline" color={Colors.success} />
          <InfoBox label="Termino real" value={activity.terminoReal ? formatDate(activity.terminoReal) : '-'} icon="flag-outline" color={Colors.danger} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progresso</Text>
        <View style={styles.progressCard}>
          <View style={styles.pctRow}>
            <View style={styles.pctBox}>
              <Text style={styles.pctLabel}>Previsto</Text>
              <Text style={styles.pctValue}>{activity.previstoPct}%</Text>
            </View>
            <View style={styles.pctBox}>
              <Text style={styles.pctLabel}>Realizado</Text>
              <Text style={[styles.pctValue, { color: Colors.accent }]}>{activity.realizadoPct}%</Text>
            </View>
            <View style={styles.pctBox}>
              <Text style={styles.pctLabel}>Desvio</Text>
              <Text style={[styles.pctValue, { color: activity.realizadoPct >= activity.previstoPct ? Colors.success : Colors.danger }]}>
                {(activity.realizadoPct - activity.previstoPct).toFixed(1)}%
              </Text>
            </View>
          </View>
          <View style={styles.barBg}>
            <View style={[styles.barPrev, { width: `${Math.min(activity.previstoPct, 100)}%` }]} />
            <View style={[styles.barReal, { width: `${Math.min(activity.realizadoPct, 100)}%` }]} />
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.primary + '40' }]} />
              <Text style={styles.legendText}>Previsto</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.accent }]} />
              <Text style={styles.legendText}>Realizado</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.actionsSection}>
        <Pressable
          style={({ pressed }) => [styles.actionBtn, { backgroundColor: Colors.success }, pressed && { opacity: 0.8 }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push({ pathname: '/progress-entry', params: { activityId: activity.id } });
          }}
        >
          <Ionicons name="trending-up" size={20} color={Colors.white} />
          <Text style={styles.actionBtnText}>Lancar Progresso</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.actionBtn, { backgroundColor: Colors.info }, pressed && { opacity: 0.8 }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push({ pathname: '/micro-entry', params: { activityId: activity.id } });
          }}
        >
          <Ionicons name="construct-outline" size={20} color={Colors.white} />
          <Text style={styles.actionBtnText}>Microatividade</Text>
        </Pressable>

        {!activity.inicioReal && (
          <Pressable
            style={({ pressed }) => [styles.actionBtn, { backgroundColor: Colors.warning }, pressed && { opacity: 0.8 }]}
            onPress={markStart}
          >
            <Ionicons name="flag-outline" size={20} color={Colors.white} />
            <Text style={styles.actionBtnText}>Marcar Inicio Real</Text>
          </Pressable>
        )}

        {!activity.terminoReal && activity.inicioReal && (
          <Pressable
            style={({ pressed }) => [styles.actionBtn, { backgroundColor: Colors.danger }, pressed && { opacity: 0.8 }]}
            onPress={markEnd}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color={Colors.white} />
            <Text style={styles.actionBtnText}>Marcar Termino Real</Text>
          </Pressable>
        )}
      </View>

      {entries.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ultimos lancamentos ({entries.length})</Text>
          {entries.slice(-5).reverse().map((e, i) => (
            <View key={i} style={styles.entryItem}>
              <Text style={styles.entryDate}>{formatDate(e.dataLancamento)}</Text>
              <Text style={styles.entryAdv}>+{e.avancoDoDiaPct.toFixed(1)}%</Text>
              <Text style={styles.entryTo}>{e.realizadoPctNovo}%</Text>
            </View>
          ))}
        </View>
      )}

      {micros.length > 0 && (
        <View style={[styles.section, { paddingBottom: 40 }]}>
          <Text style={styles.sectionTitle}>Microatividades ({micros.length})</Text>
          {micros.slice(-5).reverse().map((m, i) => (
            <View key={i} style={styles.entryItem}>
              <Text style={styles.entryDate}>{formatDate(m.dataLancamento)}</Text>
              <Text style={[styles.entryAdv, { color: Colors.text }]} numberOfLines={1}>{m.equipamento}</Text>
              <Text style={styles.entryTo}>{m.horasTrabalhadas}h</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function InfoBox({ label, value, icon, color }: { label: string; value: string; icon: string; color?: string }) {
  return (
    <View style={ibStyles.box}>
      <Ionicons name={icon as any} size={16} color={color || Colors.textTertiary} />
      <Text style={ibStyles.label}>{label}</Text>
      <Text style={ibStyles.value}>{value}</Text>
    </View>
  );
}

const ibStyles = StyleSheet.create({
  box: { flex: 1, alignItems: 'center', gap: 4 },
  label: { fontSize: 11, color: Colors.textTertiary, fontWeight: '500' },
  value: { fontSize: 14, fontWeight: '700', color: Colors.text },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyText: { fontSize: 15, color: Colors.textTertiary },
  topCard: { backgroundColor: Colors.surface, borderRadius: 14, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '600' },
  edtBig: { fontSize: 16, fontWeight: '800', color: Colors.primary },
  actName: { fontSize: 18, fontWeight: '700', color: Colors.text },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 10 },
  row: { flexDirection: 'row', gap: 8, backgroundColor: Colors.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: Colors.border },
  progressCard: { backgroundColor: Colors.surface, borderRadius: 14, padding: 18, borderWidth: 1, borderColor: Colors.border },
  pctRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 14 },
  pctBox: { alignItems: 'center' },
  pctLabel: { fontSize: 11, color: Colors.textTertiary, fontWeight: '500', marginBottom: 4 },
  pctValue: { fontSize: 22, fontWeight: '800', color: Colors.primary },
  barBg: { height: 8, backgroundColor: Colors.surfaceAlt, borderRadius: 4, overflow: 'hidden', marginBottom: 10 },
  barPrev: { position: 'absolute', height: 8, backgroundColor: Colors.primary + '40', borderRadius: 4 },
  barReal: { position: 'absolute', height: 8, backgroundColor: Colors.accent, borderRadius: 4 },
  legendRow: { flexDirection: 'row', gap: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: Colors.textSecondary },
  actionsSection: { gap: 10, marginBottom: 20 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 12 },
  actionBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
  entryItem: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.surface, padding: 12, borderRadius: 10, marginBottom: 6, borderWidth: 1, borderColor: Colors.border },
  entryDate: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500', width: 80 },
  entryAdv: { flex: 1, fontSize: 13, fontWeight: '600', color: Colors.success },
  entryTo: { fontSize: 14, fontWeight: '700', color: Colors.primary },
});

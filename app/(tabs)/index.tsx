import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { getActivities, getMicroActivities } from '@/lib/storage';
import { todayStr } from '@/lib/helpers';
import { PROJECT_NAME } from '@/lib/seed-data';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { data: activities = [], refetch: refetchAct, isLoading: loadAct } = useQuery({
    queryKey: ['activities'],
    queryFn: getActivities,
  });
  const { data: micros = [], refetch: refetchMicro, isLoading: loadMicro } = useQuery({
    queryKey: ['microActivities'],
    queryFn: getMicroActivities,
  });

  const stats = useMemo(() => {
    const total = activities.length;
    const avgPrev = total ? activities.reduce((s, a) => s + a.previstoPct, 0) / total : 0;
    const avgReal = total ? activities.reduce((s, a) => s + a.realizadoPct, 0) / total : 0;
    const notStarted = activities.filter(a => a.status === 'Nao iniciado').length;
    const inProgress = activities.filter(a => a.status === 'Em andamento').length;
    const completed = activities.filter(a => a.status === 'Concluido').length;
    const delayed = activities.filter(a => a.status === 'Atrasado').length;

    const today = todayStr();
    const todayMicros = micros.filter(m => m.dataLancamento === today);
    const todayHours = todayMicros.reduce((s, m) => s + m.horasTrabalhadas, 0);

    const equipHours: Record<string, { hours: number; qty: number; desc: string }> = {};
    micros.forEach(m => {
      if (!equipHours[m.equipamento]) {
        equipHours[m.equipamento] = { hours: 0, qty: 0, desc: m.equipamento };
      }
      equipHours[m.equipamento].hours += m.horasTrabalhadas;
      equipHours[m.equipamento].qty += m.quantidade;
    });
    const topEquip = Object.values(equipHours).sort((a, b) => b.hours - a.hours).slice(0, 5);

    return { avgPrev, avgReal, notStarted, inProgress, completed, delayed, todayHours, topEquip, total };
  }, [activities, micros]);

  const refreshAll = () => { refetchAct(); refetchMicro(); };

  const nav = (path: string, params?: Record<string, string>) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (params) {
      router.push({ pathname: path as any, params });
    } else {
      router.push(path as any);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, Platform.OS === 'web' && { paddingTop: 67, paddingBottom: 84 + 34 }]}
      refreshControl={<RefreshControl refreshing={loadAct || loadMicro} onRefresh={refreshAll} tintColor={Colors.accent} />}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <MaterialCommunityIcons name="hard-hat" size={28} color={Colors.accent} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.projLabel}>Projeto</Text>
          <Text style={styles.projName} numberOfLines={1}>{PROJECT_NAME}</Text>
        </View>
      </View>

      <View style={styles.kpiRow}>
        <View style={[styles.kpiCard, { backgroundColor: Colors.primary }]}>
          <Text style={styles.kpiLabel}>Previsto</Text>
          <Text style={styles.kpiValue}>{stats.avgPrev.toFixed(1)}%</Text>
          <View style={styles.kpiBar}>
            <View style={[styles.kpiBarFill, { width: `${Math.min(stats.avgPrev, 100)}%`, backgroundColor: Colors.white + '50' }]} />
          </View>
        </View>
        <View style={[styles.kpiCard, { backgroundColor: Colors.accent }]}>
          <Text style={[styles.kpiLabel, { color: Colors.primary }]}>Realizado</Text>
          <Text style={[styles.kpiValue, { color: Colors.primary }]}>{stats.avgReal.toFixed(1)}%</Text>
          <View style={styles.kpiBar}>
            <View style={[styles.kpiBarFill, { width: `${Math.min(stats.avgReal, 100)}%`, backgroundColor: Colors.primary + '40' }]} />
          </View>
        </View>
      </View>

      <View style={styles.statusGrid}>
        <View style={[styles.statusCard, { borderLeftColor: Colors.statusNotStarted }]}>  
          <Text style={styles.statusCount}>{stats.notStarted}</Text>
          <Text style={styles.statusLabel}>Nao iniciado</Text>
        </View>
        <View style={[styles.statusCard, { borderLeftColor: Colors.statusInProgress }]}>
          <Text style={styles.statusCount}>{stats.inProgress}</Text>
          <Text style={styles.statusLabel}>Em andamento</Text>
        </View>
        <View style={[styles.statusCard, { borderLeftColor: Colors.statusCompleted }]}>
          <Text style={styles.statusCount}>{stats.completed}</Text>
          <Text style={styles.statusLabel}>Concluido</Text>
        </View>
        <View style={[styles.statusCard, { borderLeftColor: Colors.statusDelayed }]}>
          <Text style={styles.statusCount}>{stats.delayed}</Text>
          <Text style={styles.statusLabel}>Atrasado</Text>
        </View>
      </View>

      <View style={styles.hoursCard}>
        <Ionicons name="time-outline" size={22} color={Colors.accent} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.hoursLabel}>Horas hoje</Text>
          <Text style={styles.hoursValue}>{stats.todayHours.toFixed(1)}h</Text>
        </View>
        <Text style={styles.totalAct}>{stats.total} atividades</Text>
      </View>

      <Text style={styles.sectionTitle}>Acoes rapidas</Text>
      <View style={styles.actionsGrid}>
        <Pressable style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]} onPress={() => nav('/progress-entry')}>
          <Ionicons name="trending-up" size={24} color={Colors.success} />
          <Text style={styles.actionText}>Lancar Progresso</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]} onPress={() => nav('/micro-entry')}>
          <Ionicons name="construct-outline" size={24} color={Colors.info} />
          <Text style={styles.actionText}>Microatividade</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]} onPress={() => nav('/climate')}>
          <Ionicons name="cloud-outline" size={24} color={Colors.warning} />
          <Text style={styles.actionText}>Clima do Dia</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.navigate('/(tabs)/report'); }}>
          <Ionicons name="document-text-outline" size={24} color={Colors.danger} />
          <Text style={styles.actionText}>Relatorio</Text>
        </Pressable>
      </View>

      {stats.topEquip.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Top equipamentos (horas)</Text>
          {stats.topEquip.map((eq, i) => (
            <View key={i} style={styles.equipRow}>
              <View style={styles.equipRank}>
                <Text style={styles.equipRankText}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.equipName}>{eq.desc}</Text>
                <View style={styles.equipBar}>
                  <View style={[styles.equipBarFill, { width: `${Math.min((eq.hours / (stats.topEquip[0]?.hours || 1)) * 100, 100)}%` }]} />
                </View>
              </View>
              <Text style={styles.equipHours}>{eq.hours.toFixed(1)}h</Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 120 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, backgroundColor: Colors.surface, padding: 16, borderRadius: 14, borderWidth: 1, borderColor: Colors.border },
  projLabel: { fontSize: 11, color: Colors.textTertiary, fontWeight: '500' },
  projName: { fontSize: 15, fontWeight: '700', color: Colors.text, marginTop: 2 },
  kpiRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  kpiCard: { flex: 1, borderRadius: 14, padding: 16 },
  kpiLabel: { fontSize: 12, color: Colors.white + 'BB', fontWeight: '600' },
  kpiValue: { fontSize: 28, fontWeight: '800', color: Colors.white, marginTop: 4 },
  kpiBar: { height: 4, backgroundColor: Colors.white + '20', borderRadius: 2, marginTop: 10 },
  kpiBarFill: { height: 4, borderRadius: 2 },
  statusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statusCard: { width: '47%', backgroundColor: Colors.surface, borderRadius: 12, padding: 14, borderLeftWidth: 4, borderWidth: 1, borderColor: Colors.border },
  statusCount: { fontSize: 24, fontWeight: '800', color: Colors.text },
  statusLabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 2, fontWeight: '500' },
  hoursCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, padding: 16, borderRadius: 14, marginBottom: 20, borderWidth: 1, borderColor: Colors.border },
  hoursLabel: { fontSize: 12, color: Colors.textTertiary, fontWeight: '500' },
  hoursValue: { fontSize: 20, fontWeight: '800', color: Colors.text },
  totalAct: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  actionBtn: { width: '47%', backgroundColor: Colors.surface, borderRadius: 14, padding: 18, alignItems: 'center', gap: 8, borderWidth: 1, borderColor: Colors.border },
  actionBtnPressed: { opacity: 0.7, transform: [{ scale: 0.97 }] },
  actionText: { fontSize: 13, fontWeight: '600', color: Colors.text, textAlign: 'center' },
  equipRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10, backgroundColor: Colors.surface, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: Colors.border },
  equipRank: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  equipRankText: { color: Colors.white, fontSize: 12, fontWeight: '700' },
  equipName: { fontSize: 13, fontWeight: '600', color: Colors.text, marginBottom: 4 },
  equipBar: { height: 4, backgroundColor: Colors.surfaceAlt, borderRadius: 2 },
  equipBarFill: { height: 4, backgroundColor: Colors.accent, borderRadius: 2 },
  equipHours: { fontSize: 14, fontWeight: '700', color: Colors.accent },
});

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Platform,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { getActivities } from '@/lib/storage';
import { formatDate, statusColor, statusLabel } from '@/lib/helpers';
import { Activity, ActivityStatus } from '@/lib/types';

const STATUS_FILTERS: (ActivityStatus | 'Todos')[] = ['Todos', 'Nao iniciado', 'Em andamento', 'Concluido', 'Atrasado'];

export default function ScheduleScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ActivityStatus | 'Todos'>('Todos');

  const { data: activities = [], refetch, isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: getActivities,
  });

  const filtered = useMemo(() => {
    return activities.filter(a => {
      if (statusFilter !== 'Todos' && a.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return a.nome.toLowerCase().includes(q) || a.edt.toLowerCase().includes(q);
      }
      return true;
    });
  }, [activities, statusFilter, search]);

  const handlePress = useCallback((item: Activity) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: '/activity/[id]', params: { id: item.id } });
  }, []);

  const renderItem = useCallback(({ item }: { item: Activity }) => (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => handlePress(item)}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.statusDot, { backgroundColor: statusColor(item.status) }]} />
        <Text style={styles.edtText}>{item.edt}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor(item.status) + '18' }]}>
          <Text style={[styles.statusBadgeText, { color: statusColor(item.status) }]}>{statusLabel(item.status)}</Text>
        </View>
      </View>
      <Text style={styles.actName} numberOfLines={2}>{item.nome}</Text>
      <View style={styles.cardRow}>
        <View style={styles.cardCol}>
          <Text style={styles.cardLabel}>Planejado</Text>
          <Text style={styles.cardValue}>{formatDate(item.inicioLB)} - {formatDate(item.terminoLB)}</Text>
        </View>
        <View style={styles.cardCol}>
          <Text style={styles.cardLabel}>Duracao</Text>
          <Text style={styles.cardValue}>{item.duracaoDias}d</Text>
        </View>
      </View>
      <View style={styles.progressRow}>
        <View style={styles.progressInfo}>
          <Text style={styles.cardLabel}>Previsto</Text>
          <Text style={styles.pctText}>{item.previstoPct}%</Text>
        </View>
        <View style={styles.progressInfo}>
          <Text style={styles.cardLabel}>Realizado</Text>
          <Text style={[styles.pctText, { color: Colors.accent }]}>{item.realizadoPct}%</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.barBg}>
            <View style={[styles.barPrev, { width: `${Math.min(item.previstoPct, 100)}%` }]} />
            <View style={[styles.barReal, { width: `${Math.min(item.realizadoPct, 100)}%` }]} />
          </View>
        </View>
      </View>
    </Pressable>
  ), [handlePress]);

  return (
    <View style={[styles.container, Platform.OS === 'web' && { paddingTop: 67 }]}>
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar EDT ou atividade..."
            placeholderTextColor={Colors.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textTertiary} />
            </Pressable>
          )}
        </View>
      </View>
      <FlatList
        horizontal
        data={STATUS_FILTERS}
        style={styles.filterList}
        contentContainerStyle={styles.filterContent}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.filterChip, statusFilter === item && styles.filterChipActive]}
            onPress={() => {
              Haptics.selectionAsync();
              setStatusFilter(item);
            }}
          >
            <Text style={[styles.filterText, statusFilter === item && styles.filterTextActive]}>{item === 'Todos' ? 'Todos' : statusLabel(item)}</Text>
          </Pressable>
        )}
      />
      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.listContent, Platform.OS === 'web' && { paddingBottom: 84 + 34 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={Colors.accent} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="file-tray-outline" size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyText}>Nenhuma atividade encontrada</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchRow: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15, color: Colors.text },
  filterList: { maxHeight: 44, minHeight: 44 },
  filterContent: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  filterTextActive: { color: Colors.white },
  listContent: { padding: 16, gap: 12, paddingBottom: 120 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardPressed: { opacity: 0.7, transform: [{ scale: 0.98 }] },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  edtText: { fontSize: 13, fontWeight: '700', color: Colors.primary, flex: 1 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  statusBadgeText: { fontSize: 11, fontWeight: '600' },
  actName: { fontSize: 15, fontWeight: '600', color: Colors.text, marginBottom: 10 },
  cardRow: { flexDirection: 'row', gap: 16, marginBottom: 10 },
  cardCol: {},
  cardLabel: { fontSize: 11, color: Colors.textTertiary, fontWeight: '500', marginBottom: 2 },
  cardValue: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  progressInfo: { alignItems: 'center' },
  pctText: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  barBg: { height: 6, backgroundColor: Colors.surfaceAlt, borderRadius: 3, overflow: 'hidden' },
  barPrev: { position: 'absolute', height: 6, backgroundColor: Colors.primary + '40', borderRadius: 3 },
  barReal: { position: 'absolute', height: 6, backgroundColor: Colors.accent, borderRadius: 3 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, color: Colors.textTertiary },
});

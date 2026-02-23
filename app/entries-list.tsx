import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Platform,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import { getEntriesByDate } from '@/lib/storage';
import { todayStr, formatDate, statusColor, statusLabel } from '@/lib/helpers';
import { DailyEntry } from '@/lib/types';

export default function EntriesListScreen() {
  const today = todayStr();
  const { data: entries = [], refetch, isLoading } = useQuery({
    queryKey: ['entries', today],
    queryFn: () => getEntriesByDate(today),
  });

  const renderItem = ({ item }: { item: DailyEntry }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.edt}>{item.edt}</Text>
        <View style={[styles.badge, { backgroundColor: statusColor(item.status) + '18' }]}>
          <Text style={[styles.badgeText, { color: statusColor(item.status) }]}>{statusLabel(item.status)}</Text>
        </View>
      </View>
      <Text style={styles.name}>{item.nomeAtividade}</Text>
      <View style={styles.detailRow}>
        <Text style={styles.detail}>Anterior: {item.realizadoPctAnterior}%</Text>
        <Ionicons name="arrow-forward" size={12} color={Colors.textTertiary} />
        <Text style={styles.detail}>Novo: {item.realizadoPctNovo}%</Text>
        <Text style={[styles.advance, { color: Colors.success }]}>+{item.avancoDoDiaPct.toFixed(1)}%</Text>
      </View>
      {item.observacao ? <Text style={styles.obs}>{item.observacao}</Text> : null}
      <Text style={styles.time}>{item.timestamp.split('T')[1]?.substring(0, 5)} - {item.usuario}</Text>
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      data={entries}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContent}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={Colors.accent} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Lancamentos de {formatDate(today)}</Text>
          <Text style={styles.headerCount}>{entries.length} registro(s)</Text>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Ionicons name="file-tray-outline" size={48} color={Colors.textTertiary} />
          <Text style={styles.emptyText}>Nenhum lancamento hoje</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  listContent: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 16 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  headerCount: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  card: { backgroundColor: Colors.surface, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: Colors.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  edt: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  name: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 6 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  detail: { fontSize: 12, color: Colors.textSecondary },
  advance: { fontSize: 13, fontWeight: '700', marginLeft: 'auto' },
  obs: { fontSize: 12, color: Colors.textSecondary, marginTop: 4, fontStyle: 'italic' },
  time: { fontSize: 11, color: Colors.textTertiary, marginTop: 6 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, color: Colors.textTertiary },
});

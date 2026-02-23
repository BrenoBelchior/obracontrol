import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import { getMicroByDate } from '@/lib/storage';
import { todayStr, formatDate } from '@/lib/helpers';
import { MicroActivity } from '@/lib/types';

export default function MicroListScreen() {
  const today = todayStr();
  const { data: micros = [], refetch, isLoading } = useQuery({
    queryKey: ['micros', today],
    queryFn: () => getMicroByDate(today),
  });

  const renderItem = ({ item }: { item: MicroActivity }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="construct" size={16} color={Colors.info} />
        <Text style={styles.edt}>{item.edtPai}</Text>
        <Text style={styles.hours}>{item.horasTrabalhadas}h</Text>
      </View>
      <Text style={styles.desc}>{item.descricaoMicro}</Text>
      <View style={styles.metaRow}>
        <View style={styles.metaPill}>
          <Text style={styles.metaText}>{item.equipamento}</Text>
        </View>
        {item.quantidade > 0 && (
          <View style={styles.metaPill}>
            <Text style={styles.metaText}>{item.quantidade} {item.unidade}</Text>
          </View>
        )}
      </View>
      {item.observacao ? <Text style={styles.obs}>{item.observacao}</Text> : null}
      <Text style={styles.time}>{item.usuario}</Text>
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      data={micros}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContent}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={Colors.accent} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Microatividades de {formatDate(today)}</Text>
          <Text style={styles.headerCount}>{micros.length} registro(s)</Text>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Ionicons name="construct-outline" size={48} color={Colors.textTertiary} />
          <Text style={styles.emptyText}>Nenhuma microatividade hoje</Text>
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
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  edt: { fontSize: 13, fontWeight: '700', color: Colors.primary, flex: 1 },
  hours: { fontSize: 15, fontWeight: '800', color: Colors.accent },
  desc: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 6 },
  metaPill: { backgroundColor: Colors.surfaceAlt, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  metaText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  obs: { fontSize: 12, color: Colors.textSecondary, fontStyle: 'italic', marginBottom: 4 },
  time: { fontSize: 11, color: Colors.textTertiary },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, color: Colors.textTertiary },
});

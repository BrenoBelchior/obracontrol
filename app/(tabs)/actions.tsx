import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { PROJECT_NAME } from '@/lib/seed-data';
import { todayStr, formatDate } from '@/lib/helpers';

const actions = [
  { icon: 'trending-up' as const, label: 'Lancar Progresso', desc: 'Registrar avanco de atividade', color: Colors.success, route: '/progress-entry' },
  { icon: 'construct-outline' as const, label: 'Registrar Microatividade', desc: 'Equipamentos e horas', color: Colors.info, route: '/micro-entry' },
  { icon: 'cloud-outline' as const, label: 'Registrar Clima do Dia', desc: 'Poeira, neblina, chuvas', color: Colors.warning, route: '/climate' },
  { icon: 'document-text-outline' as const, label: 'Gerar Relatorio Diario', desc: 'Relatorio consolidado', color: Colors.danger, route: '/(tabs)/report' },
];

export default function ActionsScreen() {
  const today = todayStr();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, Platform.OS === 'web' && { paddingTop: 67, paddingBottom: 84 + 34 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.dateCard}>
        <Ionicons name="calendar-outline" size={22} color={Colors.accent} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.dateLabel}>Hoje</Text>
          <Text style={styles.dateValue}>{formatDate(today)}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Registros</Text>

      {actions.map((action, i) => (
        <Pressable
          key={i}
          style={({ pressed }) => [styles.actionCard, pressed && styles.actionPressed]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            if (action.route.startsWith('/(tabs)')) {
              router.navigate(action.route as any);
            } else {
              router.push(action.route as any);
            }
          }}
        >
          <View style={[styles.iconBox, { backgroundColor: action.color + '15' }]}>
            <Ionicons name={action.icon} size={26} color={action.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionLabel}>{action.label}</Text>
            <Text style={styles.actionDesc}>{action.desc}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
        </Pressable>
      ))}

      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Consultar</Text>

      <Pressable
        style={({ pressed }) => [styles.actionCard, pressed && styles.actionPressed]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push('/entries-list');
        }}
      >
        <View style={[styles.iconBox, { backgroundColor: Colors.primary + '15' }]}>
          <Ionicons name="list-outline" size={26} color={Colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.actionLabel}>Lancamentos do dia</Text>
          <Text style={styles.actionDesc}>Ver todos os lancamentos de hoje</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.actionCard, pressed && styles.actionPressed]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push('/micro-list');
        }}
      >
        <View style={[styles.iconBox, { backgroundColor: Colors.primary + '15' }]}>
          <MaterialCommunityIcons name="wrench-outline" size={26} color={Colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.actionLabel}>Microatividades do dia</Text>
          <Text style={styles.actionDesc}>Ver equipamentos e horas</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 120 },
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dateLabel: { fontSize: 11, color: Colors.textTertiary, fontWeight: '500' },
  dateValue: { fontSize: 18, fontWeight: '800', color: Colors.text, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 14,
  },
  actionPressed: { opacity: 0.7, transform: [{ scale: 0.98 }] },
  iconBox: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: 15, fontWeight: '600', color: Colors.text },
  actionDesc: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
});

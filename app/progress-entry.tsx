import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Platform,
  Switch,
  KeyboardAvoidingView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Crypto from 'expo-crypto';
import Colors from '@/constants/colors';
import { getActivities, getActivity, addEntry, updateActivity, getClimate } from '@/lib/storage';
import { todayStr, formatDate, statusColor, statusLabel } from '@/lib/helpers';
import { Activity, DailyEntry } from '@/lib/types';
import { calcStatus } from '@/lib/storage';

export default function ProgressEntryScreen() {
  const params = useLocalSearchParams<{ activityId?: string }>();
  const queryClient = useQueryClient();

  const { data: activities = [] } = useQuery({
    queryKey: ['activities'],
    queryFn: getActivities,
  });

  const [selectedId, setSelectedId] = useState(params.activityId || '');
  const [date, setDate] = useState(todayStr());
  const [newPct, setNewPct] = useState('');
  const [obs, setObs] = useState('');
  const [poeira, setPoeira] = useState(false);
  const [neblina, setNeblina] = useState(false);
  const [chuvas, setChuvas] = useState(false);
  const [pluvio, setPluvio] = useState('');
  const [showActivityPicker, setShowActivityPicker] = useState(!params.activityId);
  const [saving, setSaving] = useState(false);

  const selected = activities.find(a => a.id === selectedId);

  useEffect(() => {
    (async () => {
      const climate = await getClimate(date);
      if (climate) {
        setPoeira(climate.poeira);
        setNeblina(climate.neblina);
        setChuvas(climate.chuvas);
        setPluvio(climate.pluviometriaMm.toString());
      }
    })();
  }, [date]);

  const handleSave = async () => {
    if (!selected) {
      Alert.alert('Erro', 'Selecione uma atividade');
      return;
    }
    const pct = parseFloat(newPct);
    if (isNaN(pct) || pct < 0 || pct > 100) {
      Alert.alert('Erro', '% realizado deve ser entre 0 e 100');
      return;
    }
    if (pct < selected.realizadoPct) {
      Alert.alert('Erro', 'Nao e permitido reduzir o progresso');
      return;
    }
    const advance = pct - selected.realizadoPct;
    if (advance === 0 && !obs.trim()) {
      Alert.alert('Erro', 'Observacao obrigatoria quando avanco e 0%');
      return;
    }

    setSaving(true);
    try {
      const entry: DailyEntry = {
        id: Crypto.randomUUID(),
        dataLancamento: date,
        usuario: 'Apontador',
        idAtividade: selected.id,
        edt: selected.edt,
        nomeAtividade: selected.nome,
        inicioPlanejado: selected.inicioLB,
        terminoPlanejado: selected.terminoLB,
        inicioReal: selected.inicioReal,
        terminoReal: selected.terminoReal,
        previstoPct: selected.previstoPct,
        realizadoPctAnterior: selected.realizadoPct,
        realizadoPctNovo: pct,
        avancoDoDiaPct: advance,
        observacao: obs,
        status: 'Em andamento',
        timestamp: new Date().toISOString(),
        poeira,
        neblina,
        chuvas,
        pluviometriaMm: parseFloat(pluvio) || 0,
      };

      await addEntry(entry);

      const updatedActivity: Activity = {
        ...selected,
        realizadoPct: pct,
        inicioReal: selected.inicioReal || (pct > 0 ? date : undefined),
        terminoReal: pct >= 100 ? date : selected.terminoReal,
      };
      updatedActivity.status = calcStatus(updatedActivity);
      await updateActivity(updatedActivity);

      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['activity', selected.id] });
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['activityEntries', selected.id] });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (err) {
      Alert.alert('Erro', 'Falha ao salvar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {showActivityPicker ? (
          <View style={styles.section}>
            <Text style={styles.label}>Selecione a atividade</Text>
            {activities.filter(a => a.status !== 'Concluido').map(a => (
              <Pressable
                key={a.id}
                style={[styles.activityOption, selectedId === a.id && styles.activitySelected]}
                onPress={() => {
                  setSelectedId(a.id);
                  setShowActivityPicker(false);
                  Haptics.selectionAsync();
                }}
              >
                <View style={[styles.dot, { backgroundColor: statusColor(a.status) }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.actOptionName}>{a.edt} - {a.nome}</Text>
                  <Text style={styles.actOptionPct}>Realizado: {a.realizadoPct}%</Text>
                </View>
              </Pressable>
            ))}
          </View>
        ) : selected ? (
          <>
            <Pressable style={styles.selectedCard} onPress={() => setShowActivityPicker(true)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.selectedEdt}>{selected.edt}</Text>
                <Text style={styles.selectedName}>{selected.nome}</Text>
                <Text style={styles.selectedPct}>Realizado atual: {selected.realizadoPct}%</Text>
              </View>
              <Ionicons name="swap-horizontal" size={20} color={Colors.textTertiary} />
            </Pressable>

            <View style={styles.section}>
              <Text style={styles.label}>Data do lancamento</Text>
              <TextInput
                style={styles.input}
                value={date}
                onChangeText={setDate}
                placeholder="AAAA-MM-DD"
                placeholderTextColor={Colors.textTertiary}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>% Realizado novo</Text>
              <TextInput
                style={[styles.input, styles.bigInput]}
                value={newPct}
                onChangeText={setNewPct}
                placeholder={`${selected.realizadoPct} - 100`}
                placeholderTextColor={Colors.textTertiary}
                keyboardType="numeric"
              />
              {newPct && !isNaN(parseFloat(newPct)) && (
                <Text style={styles.advancePreview}>
                  Avanco do dia: +{(parseFloat(newPct) - selected.realizadoPct).toFixed(1)}%
                </Text>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Observacao</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                value={obs}
                onChangeText={setObs}
                placeholder="Descreva o progresso do dia..."
                placeholderTextColor={Colors.textTertiary}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Condicoes de clima</Text>
              <View style={styles.climateGrid}>
                <SwitchRow label="Poeira" value={poeira} onToggle={setPoeira} icon="partly-sunny-outline" />
                <SwitchRow label="Neblina" value={neblina} onToggle={setNeblina} icon="water-outline" />
                <SwitchRow label="Chuvas" value={chuvas} onToggle={setChuvas} icon="rainy-outline" />
              </View>
              {chuvas && (
                <View style={{ marginTop: 8 }}>
                  <Text style={styles.subLabel}>Pluviometria (mm)</Text>
                  <TextInput
                    style={styles.input}
                    value={pluvio}
                    onChangeText={setPluvio}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={Colors.textTertiary}
                  />
                </View>
              )}
            </View>

            <Pressable
              style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.8 }, saving && { opacity: 0.5 }]}
              onPress={handleSave}
              disabled={saving}
            >
              <Ionicons name="checkmark-circle" size={22} color={Colors.white} />
              <Text style={styles.saveBtnText}>{saving ? 'Salvando...' : 'Salvar Lancamento'}</Text>
            </Pressable>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="alert-circle-outline" size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyText}>Selecione uma atividade</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function SwitchRow({ label, value, onToggle, icon }: { label: string; value: boolean; onToggle: (v: boolean) => void; icon: string }) {
  return (
    <View style={switchStyles.row}>
      <Ionicons name={icon as any} size={18} color={value ? Colors.accent : Colors.textTertiary} />
      <Text style={switchStyles.label}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: Colors.border, true: Colors.accent + '60' }}
        thumbColor={value ? Colors.accent : Colors.textTertiary}
      />
    </View>
  );
}

const switchStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  label: { flex: 1, fontSize: 14, color: Colors.text, fontWeight: '500' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  section: { marginBottom: 18 },
  label: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600', marginBottom: 6 },
  subLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500', marginBottom: 4 },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bigInput: { fontSize: 22, fontWeight: '700', textAlign: 'center', paddingVertical: 18 },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  activityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activitySelected: { borderColor: Colors.accent, borderWidth: 2 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  actOptionName: { fontSize: 14, fontWeight: '600', color: Colors.text },
  actOptionPct: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  selectedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
  },
  selectedEdt: { fontSize: 12, color: Colors.accent, fontWeight: '700' },
  selectedName: { fontSize: 15, fontWeight: '700', color: Colors.white, marginTop: 2 },
  selectedPct: { fontSize: 13, color: Colors.white + 'BB', marginTop: 4 },
  advancePreview: { fontSize: 14, color: Colors.success, fontWeight: '700', marginTop: 8, textAlign: 'center' },
  climateGrid: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.success,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 8,
  },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, color: Colors.textTertiary },
});

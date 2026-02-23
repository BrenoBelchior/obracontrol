import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Crypto from 'expo-crypto';
import Colors from '@/constants/colors';
import { getActivities, getEquipment, addMicroActivity } from '@/lib/storage';
import { todayStr, statusColor } from '@/lib/helpers';
import { UNITS } from '@/lib/seed-data';
import { MicroActivity } from '@/lib/types';

export default function MicroEntryScreen() {
  const params = useLocalSearchParams<{ activityId?: string }>();
  const queryClient = useQueryClient();

  const { data: activities = [] } = useQuery({ queryKey: ['activities'], queryFn: getActivities });
  const { data: equipment = [] } = useQuery({ queryKey: ['equipment'], queryFn: getEquipment });

  const [selectedId, setSelectedId] = useState(params.activityId || '');
  const [date, setDate] = useState(todayStr());
  const [descricao, setDescricao] = useState('');
  const [selectedEquip, setSelectedEquip] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [unidade, setUnidade] = useState('m3');
  const [horas, setHoras] = useState('');
  const [obs, setObs] = useState('');
  const [showActPicker, setShowActPicker] = useState(!params.activityId);
  const [showEquipPicker, setShowEquipPicker] = useState(false);
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const selected = activities.find(a => a.id === selectedId);
  const equip = equipment.find(e => `${e.codigo} - ${e.descricao}` === selectedEquip);

  const handleSave = async () => {
    if (!selected) { Alert.alert('Erro', 'Selecione uma atividade'); return; }
    if (!descricao.trim()) { Alert.alert('Erro', 'Descricao obrigatoria'); return; }
    if (!selectedEquip) { Alert.alert('Erro', 'Selecione um equipamento'); return; }
    if (!horas || isNaN(parseFloat(horas))) { Alert.alert('Erro', 'Informe as horas trabalhadas'); return; }

    setSaving(true);
    try {
      const micro: MicroActivity = {
        id: Crypto.randomUUID(),
        dataLancamento: date,
        usuario: 'Apontador',
        idAtividadePai: selected.id,
        edtPai: selected.edt,
        nomeAtividadePai: selected.nome,
        descricaoMicro: descricao,
        equipamento: selectedEquip,
        quantidade: parseFloat(quantidade) || 0,
        unidade,
        horasTrabalhadas: parseFloat(horas),
        status: 'Registrado',
        observacao: obs,
        timestamp: new Date().toISOString(),
      };

      await addMicroActivity(micro);
      queryClient.invalidateQueries({ queryKey: ['microActivities'] });
      queryClient.invalidateQueries({ queryKey: ['activityMicros', selected.id] });

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
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {showActPicker ? (
          <View style={styles.section}>
            <Text style={styles.label}>Selecione a atividade pai</Text>
            {activities.map(a => (
              <Pressable
                key={a.id}
                style={[styles.optionRow, selectedId === a.id && styles.optionSelected]}
                onPress={() => { setSelectedId(a.id); setShowActPicker(false); Haptics.selectionAsync(); }}
              >
                <View style={[styles.dot, { backgroundColor: statusColor(a.status) }]} />
                <Text style={styles.optionText} numberOfLines={1}>{a.edt} - {a.nome}</Text>
              </Pressable>
            ))}
          </View>
        ) : selected ? (
          <>
            <Pressable style={styles.selectedCard} onPress={() => setShowActPicker(true)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.selectedEdt}>{selected.edt}</Text>
                <Text style={styles.selectedName}>{selected.nome}</Text>
              </View>
              <Ionicons name="swap-horizontal" size={20} color={Colors.textTertiary} />
            </Pressable>

            <View style={styles.section}>
              <Text style={styles.label}>Data</Text>
              <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="AAAA-MM-DD" placeholderTextColor={Colors.textTertiary} />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Descricao da microatividade</Text>
              <TextInput style={styles.input} value={descricao} onChangeText={setDescricao} placeholder="Ex: Transporte de material" placeholderTextColor={Colors.textTertiary} />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Equipamento</Text>
              {showEquipPicker ? (
                <View style={styles.pickerBox}>
                  {equipment.filter(e => e.ativo).map(e => (
                    <Pressable
                      key={e.codigo}
                      style={[styles.optionRow, selectedEquip === `${e.codigo} - ${e.descricao}` && styles.optionSelected]}
                      onPress={() => {
                        setSelectedEquip(`${e.codigo} - ${e.descricao}`);
                        setShowEquipPicker(false);
                        Haptics.selectionAsync();
                      }}
                    >
                      <Ionicons name="construct" size={16} color={Colors.info} />
                      <Text style={styles.optionText}>{e.codigo} - {e.descricao}</Text>
                    </Pressable>
                  ))}
                </View>
              ) : (
                <Pressable style={styles.pickerBtn} onPress={() => setShowEquipPicker(true)}>
                  <Text style={selectedEquip ? styles.pickerValue : styles.pickerPlaceholder}>
                    {selectedEquip || 'Selecionar equipamento'}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color={Colors.textTertiary} />
                </Pressable>
              )}
            </View>

            <View style={styles.rowFields}>
              <View style={[styles.section, { flex: 1 }]}>
                <Text style={styles.label}>Quantidade</Text>
                <TextInput style={styles.input} value={quantidade} onChangeText={setQuantidade} keyboardType="numeric" placeholder="0" placeholderTextColor={Colors.textTertiary} />
              </View>
              <View style={[styles.section, { flex: 1 }]}>
                <Text style={styles.label}>Unidade</Text>
                {showUnitPicker ? (
                  <View style={styles.pickerBox}>
                    {UNITS.map(u => (
                      <Pressable key={u} style={[styles.optionRow, unidade === u && styles.optionSelected]} onPress={() => { setUnidade(u); setShowUnitPicker(false); }}>
                        <Text style={styles.optionText}>{u}</Text>
                      </Pressable>
                    ))}
                  </View>
                ) : (
                  <Pressable style={styles.pickerBtn} onPress={() => setShowUnitPicker(true)}>
                    <Text style={styles.pickerValue}>{unidade}</Text>
                    <Ionicons name="chevron-down" size={18} color={Colors.textTertiary} />
                  </Pressable>
                )}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Horas trabalhadas</Text>
              <TextInput style={[styles.input, styles.bigInput]} value={horas} onChangeText={setHoras} keyboardType="numeric" placeholder="0" placeholderTextColor={Colors.textTertiary} />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Observacao</Text>
              <TextInput style={[styles.input, styles.multiline]} value={obs} onChangeText={setObs} placeholder="Observacoes..." placeholderTextColor={Colors.textTertiary} multiline numberOfLines={3} />
            </View>

            <Pressable
              style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.8 }, saving && { opacity: 0.5 }]}
              onPress={handleSave}
              disabled={saving}
            >
              <Ionicons name="checkmark-circle" size={22} color={Colors.white} />
              <Text style={styles.saveBtnText}>{saving ? 'Salvando...' : 'Salvar Microatividade'}</Text>
            </Pressable>
          </>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  section: { marginBottom: 18 },
  label: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: Colors.surface, borderRadius: 12, padding: 14, fontSize: 15, color: Colors.text, borderWidth: 1, borderColor: Colors.border },
  bigInput: { fontSize: 22, fontWeight: '700', textAlign: 'center', paddingVertical: 18 },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, backgroundColor: Colors.surface, borderRadius: 10, marginBottom: 4, borderWidth: 1, borderColor: Colors.border },
  optionSelected: { borderColor: Colors.accent, borderWidth: 2 },
  optionText: { fontSize: 14, color: Colors.text, fontWeight: '500', flex: 1 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  selectedCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary, borderRadius: 14, padding: 16, marginBottom: 18 },
  selectedEdt: { fontSize: 12, color: Colors.accent, fontWeight: '700' },
  selectedName: { fontSize: 15, fontWeight: '700', color: Colors.white, marginTop: 2 },
  rowFields: { flexDirection: 'row', gap: 12 },
  pickerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: Colors.border },
  pickerValue: { fontSize: 15, color: Colors.text, fontWeight: '500' },
  pickerPlaceholder: { fontSize: 15, color: Colors.textTertiary },
  pickerBox: { backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, padding: 4, maxHeight: 200 },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.info, paddingVertical: 16, borderRadius: 14, marginTop: 8 },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },
});

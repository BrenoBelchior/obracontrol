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

  const [isAvulsa, setIsAvulsa] = useState(false);
  const [selectedId, setSelectedId] = useState(params.activityId || '');
  const [date, setDate] = useState(todayStr());
  const [descricao, setDescricao] = useState('');
  const [descricaoAvulsa, setDescricaoAvulsa] = useState('');
  const [selectedEquip, setSelectedEquip] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [unidade, setUnidade] = useState('m3');
  const [horas, setHoras] = useState('');
  const [obs, setObs] = useState('');
  const [showActPicker, setShowActPicker] = useState(!params.activityId);
  const [showEquipPicker, setShowEquipPicker] = useState(false);
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actSearch, setActSearch] = useState('');

  const selected = activities.find(a => a.id === selectedId);

  const filteredActivities = actSearch.trim()
    ? activities.filter(a =>
        a.nome.toLowerCase().includes(actSearch.toLowerCase()) ||
        a.edt.toLowerCase().includes(actSearch.toLowerCase())
      )
    : activities;

  const handleSave = async () => {
    if (!isAvulsa && !selected) { Alert.alert('Erro', 'Selecione uma atividade'); return; }
    if (isAvulsa && !descricaoAvulsa.trim()) { Alert.alert('Erro', 'Informe a descricao da atividade avulsa'); return; }
    if (!descricao.trim()) { Alert.alert('Erro', 'Descricao da microatividade obrigatoria'); return; }
    if (!selectedEquip) { Alert.alert('Erro', 'Selecione um equipamento'); return; }
    if (!horas || isNaN(parseFloat(horas))) { Alert.alert('Erro', 'Informe as horas trabalhadas'); return; }

    setSaving(true);
    try {
      const micro: MicroActivity = {
        id: Crypto.randomUUID(),
        dataLancamento: date,
        usuario: 'Apontador',
        idAtividadePai: isAvulsa ? '' : (selected?.id || ''),
        edtPai: isAvulsa ? 'AVULSA' : (selected?.edt || ''),
        nomeAtividadePai: isAvulsa ? descricaoAvulsa : (selected?.nome || ''),
        descricaoMicro: descricao,
        equipamento: selectedEquip,
        quantidade: parseFloat(quantidade) || 0,
        unidade,
        horasTrabalhadas: parseFloat(horas),
        status: 'Registrado',
        observacao: obs,
        timestamp: new Date().toISOString(),
        isAvulsa,
      };

      await addMicroActivity(micro);
      queryClient.invalidateQueries({ queryKey: ['microActivities'] });
      if (!isAvulsa && selected) {
        queryClient.invalidateQueries({ queryKey: ['activityMicros', selected.id] });
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (err) {
      Alert.alert('Erro', 'Falha ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const renderForm = () => (
    <>
      <View style={styles.section}>
        <Text style={styles.label}>Data</Text>
        <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="AAAA-MM-DD" placeholderTextColor={Colors.textTertiary} />
      </View>

      {isAvulsa && (
        <View style={styles.section}>
          <Text style={styles.label}>Nome da atividade avulsa</Text>
          <TextInput style={styles.input} value={descricaoAvulsa} onChangeText={setDescricaoAvulsa} placeholder="Ex: Apoio logistico, Manutencao preventiva..." placeholderTextColor={Colors.textTertiary} />
        </View>
      )}

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
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.toggleRow}>
          <Pressable
            style={[styles.toggleBtn, !isAvulsa && styles.toggleActive]}
            onPress={() => { setIsAvulsa(false); Haptics.selectionAsync(); }}
          >
            <Ionicons name="git-branch-outline" size={18} color={!isAvulsa ? Colors.white : Colors.textSecondary} />
            <Text style={[styles.toggleText, !isAvulsa && styles.toggleTextActive]}>Vinculada ao Cronograma</Text>
          </Pressable>
          <Pressable
            style={[styles.toggleBtn, isAvulsa && styles.toggleActiveAvulsa]}
            onPress={() => { setIsAvulsa(true); setShowActPicker(false); Haptics.selectionAsync(); }}
          >
            <Ionicons name="add-circle-outline" size={18} color={isAvulsa ? Colors.white : Colors.textSecondary} />
            <Text style={[styles.toggleText, isAvulsa && styles.toggleTextActive]}>Atividade Avulsa</Text>
          </Pressable>
        </View>

        {isAvulsa ? (
          <View style={styles.avulsaBanner}>
            <Ionicons name="information-circle" size={20} color={Colors.warning} />
            <Text style={styles.avulsaBannerText}>Atividade nao vinculada ao cronograma (apoio, manutencao, logistica, etc.)</Text>
          </View>
        ) : null}

        {!isAvulsa && showActPicker ? (
          <View style={styles.section}>
            <Text style={styles.label}>Selecione a atividade pai</Text>
            <TextInput
              style={[styles.input, { marginBottom: 8 }]}
              value={actSearch}
              onChangeText={setActSearch}
              placeholder="Buscar por nome ou EDT..."
              placeholderTextColor={Colors.textTertiary}
            />
            {filteredActivities.map(a => (
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
        ) : !isAvulsa && selected ? (
          <>
            <Pressable style={styles.selectedCard} onPress={() => setShowActPicker(true)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.selectedEdt}>{selected.edt}</Text>
                <Text style={styles.selectedName}>{selected.nome}</Text>
              </View>
              <Ionicons name="swap-horizontal" size={20} color={Colors.textTertiary} />
            </Pressable>
            {renderForm()}
          </>
        ) : !isAvulsa ? null : null}

        {isAvulsa && renderForm()}
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
  toggleRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 12, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  toggleActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  toggleActiveAvulsa: { backgroundColor: Colors.warning, borderColor: Colors.warning },
  toggleText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  toggleTextActive: { color: Colors.white },
  avulsaBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FEF3C7', borderRadius: 10, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#FDE68A' },
  avulsaBannerText: { fontSize: 13, color: '#92400E', flex: 1, fontWeight: '500' },
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { getClimate, saveClimate } from '@/lib/storage';
import { todayStr, formatDate } from '@/lib/helpers';
import { DayClimate } from '@/lib/types';

export default function ClimateScreen() {
  const queryClient = useQueryClient();
  const [date, setDate] = useState(todayStr());
  const [poeira, setPoeira] = useState(false);
  const [neblina, setNeblina] = useState(false);
  const [chuvas, setChuvas] = useState(false);
  const [pluvio, setPluvio] = useState('0');
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const climate = await getClimate(date);
      if (climate) {
        setPoeira(climate.poeira);
        setNeblina(climate.neblina);
        setChuvas(climate.chuvas);
        setPluvio(climate.pluviometriaMm.toString());
      } else {
        setPoeira(false);
        setNeblina(false);
        setChuvas(false);
        setPluvio('0');
      }
      setLoaded(true);
    })();
  }, [date]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const climate: DayClimate = {
        data: date,
        poeira,
        neblina,
        chuvas,
        pluviometriaMm: parseFloat(pluvio) || 0,
        registradoPor: 'Apontador',
      };
      await saveClimate(climate);
      queryClient.invalidateQueries({ queryKey: ['climate'] });
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
        <View style={styles.iconRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="cloud" size={40} color={Colors.accent} />
          </View>
          <Text style={styles.title}>Condicoes Climaticas</Text>
          <Text style={styles.subtitle}>Registre as condicoes do dia na obra</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Data</Text>
          <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="AAAA-MM-DD" placeholderTextColor={Colors.textTertiary} />
        </View>

        <View style={styles.conditionsCard}>
          <ClimateRow
            icon="partly-sunny"
            label="Poeira"
            desc="Presenca de poeira no ar"
            value={poeira}
            onToggle={setPoeira}
            color={Colors.warning}
          />
          <View style={styles.divider} />
          <ClimateRow
            icon="water"
            label="Neblina"
            desc="Visibilidade reduzida"
            value={neblina}
            onToggle={setNeblina}
            color={Colors.info}
          />
          <View style={styles.divider} />
          <ClimateRow
            icon="rainy"
            label="Chuvas"
            desc="Precipitacao no periodo"
            value={chuvas}
            onToggle={setChuvas}
            color={Colors.statusInProgress}
          />
        </View>

        {chuvas && (
          <View style={styles.section}>
            <Text style={styles.label}>Pluviometria (mm)</Text>
            <TextInput
              style={[styles.input, styles.bigInput]}
              value={pluvio}
              onChangeText={setPluvio}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={Colors.textTertiary}
            />
          </View>
        )}

        <Pressable
          style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.8 }, saving && { opacity: 0.5 }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Ionicons name="checkmark-circle" size={22} color={Colors.white} />
          <Text style={styles.saveBtnText}>{saving ? 'Salvando...' : 'Salvar Clima do Dia'}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function ClimateRow({ icon, label, desc, value, onToggle, color }: {
  icon: string; label: string; desc: string; value: boolean; onToggle: (v: boolean) => void; color: string;
}) {
  return (
    <View style={crStyles.row}>
      <View style={[crStyles.iconBox, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon as any} size={22} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={crStyles.label}>{label}</Text>
        <Text style={crStyles.desc}>{desc}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: Colors.border, true: Colors.accent + '60' }}
        thumbColor={value ? Colors.accent : Colors.textTertiary}
      />
    </View>
  );
}

const crStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 15, fontWeight: '600', color: Colors.text },
  desc: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  iconRow: { alignItems: 'center', marginBottom: 24, paddingTop: 8 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.accent + '15', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text },
  subtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  section: { marginBottom: 18 },
  label: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: Colors.surface, borderRadius: 12, padding: 14, fontSize: 15, color: Colors.text, borderWidth: 1, borderColor: Colors.border },
  bigInput: { fontSize: 22, fontWeight: '700', textAlign: 'center', paddingVertical: 18 },
  conditionsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  divider: { height: 1, backgroundColor: Colors.border },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.warning,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 8,
  },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },
});

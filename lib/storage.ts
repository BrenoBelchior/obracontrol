import AsyncStorage from '@react-native-async-storage/async-storage';
import { Activity, DailyEntry, MicroActivity, Equipment, DayClimate, ActivityStatus } from './types';
import { SEED_ACTIVITIES, SEED_EQUIPMENT } from './seed-data';

const KEYS = {
  ACTIVITIES: '@obra_activities',
  ENTRIES: '@obra_entries',
  MICRO: '@obra_micro',
  EQUIPMENT: '@obra_equipment',
  CLIMATE: '@obra_climate',
  SEEDED: '@obra_seeded',
};

async function ensureSeeded() {
  const seeded = await AsyncStorage.getItem(KEYS.SEEDED);
  if (!seeded) {
    await AsyncStorage.setItem(KEYS.ACTIVITIES, JSON.stringify(SEED_ACTIVITIES));
    await AsyncStorage.setItem(KEYS.EQUIPMENT, JSON.stringify(SEED_EQUIPMENT));
    await AsyncStorage.setItem(KEYS.ENTRIES, JSON.stringify([]));
    await AsyncStorage.setItem(KEYS.MICRO, JSON.stringify([]));
    await AsyncStorage.setItem(KEYS.CLIMATE, JSON.stringify([]));
    await AsyncStorage.setItem(KEYS.SEEDED, 'true');
  }
}

export function calcStatus(activity: Activity): ActivityStatus {
  if (activity.realizadoPct >= 100 || activity.terminoReal) return 'Concluido';
  if (activity.realizadoPct === 0 && !activity.inicioReal) return 'Nao iniciado';
  const today = new Date().toISOString().split('T')[0];
  if (today > activity.terminoLB && activity.realizadoPct < 100) return 'Atrasado';
  return 'Em andamento';
}

export async function getActivities(): Promise<Activity[]> {
  await ensureSeeded();
  const data = await AsyncStorage.getItem(KEYS.ACTIVITIES);
  const activities: Activity[] = data ? JSON.parse(data) : [];
  return activities.map(a => ({ ...a, status: calcStatus(a) }));
}

export async function getActivity(id: string): Promise<Activity | undefined> {
  const activities = await getActivities();
  return activities.find(a => a.id === id);
}

export async function updateActivity(updated: Activity): Promise<void> {
  const activities = await getActivities();
  const idx = activities.findIndex(a => a.id === updated.id);
  if (idx >= 0) {
    activities[idx] = { ...updated, status: calcStatus(updated) };
    await AsyncStorage.setItem(KEYS.ACTIVITIES, JSON.stringify(activities));
  }
}

export async function getEntries(): Promise<DailyEntry[]> {
  await ensureSeeded();
  const data = await AsyncStorage.getItem(KEYS.ENTRIES);
  return data ? JSON.parse(data) : [];
}

export async function getEntriesByDate(date: string): Promise<DailyEntry[]> {
  const entries = await getEntries();
  return entries.filter(e => e.dataLancamento === date);
}

export async function getEntriesByActivity(activityId: string): Promise<DailyEntry[]> {
  const entries = await getEntries();
  return entries.filter(e => e.idAtividade === activityId);
}

export async function addEntry(entry: DailyEntry): Promise<void> {
  const entries = await getEntries();
  entries.push(entry);
  await AsyncStorage.setItem(KEYS.ENTRIES, JSON.stringify(entries));
}

export async function getMicroActivities(): Promise<MicroActivity[]> {
  await ensureSeeded();
  const data = await AsyncStorage.getItem(KEYS.MICRO);
  return data ? JSON.parse(data) : [];
}

export async function getMicroByDate(date: string): Promise<MicroActivity[]> {
  const all = await getMicroActivities();
  return all.filter(m => m.dataLancamento === date);
}

export async function getMicroByActivity(activityId: string): Promise<MicroActivity[]> {
  const all = await getMicroActivities();
  return all.filter(m => m.idAtividadePai === activityId);
}

export async function addMicroActivity(micro: MicroActivity): Promise<void> {
  const all = await getMicroActivities();
  all.push(micro);
  await AsyncStorage.setItem(KEYS.MICRO, JSON.stringify(all));
}

export async function getEquipment(): Promise<Equipment[]> {
  await ensureSeeded();
  const data = await AsyncStorage.getItem(KEYS.EQUIPMENT);
  return data ? JSON.parse(data) : [];
}

export async function getClimate(date: string): Promise<DayClimate | undefined> {
  await ensureSeeded();
  const data = await AsyncStorage.getItem(KEYS.CLIMATE);
  const all: DayClimate[] = data ? JSON.parse(data) : [];
  return all.find(c => c.data === date);
}

export async function getAllClimates(): Promise<DayClimate[]> {
  await ensureSeeded();
  const data = await AsyncStorage.getItem(KEYS.CLIMATE);
  return data ? JSON.parse(data) : [];
}

export async function saveClimate(climate: DayClimate): Promise<void> {
  const data = await AsyncStorage.getItem(KEYS.CLIMATE);
  const all: DayClimate[] = data ? JSON.parse(data) : [];
  const idx = all.findIndex(c => c.data === climate.data);
  if (idx >= 0) {
    all[idx] = climate;
  } else {
    all.push(climate);
  }
  await AsyncStorage.setItem(KEYS.CLIMATE, JSON.stringify(all));
}

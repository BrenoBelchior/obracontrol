# ObraControl - Construction Operations Management App

## Overview
Mobile app for construction site operations control, focused on schedule tracking, daily progress entries, micro-activities with equipment tracking, weather conditions, and daily reports. Reference project: "Descaracterizacao da Barragem Alto Jacutinga".

## Architecture
- **Frontend**: Expo Router with file-based routing, React Native
- **Data**: AsyncStorage for local persistence (no backend database)
- **State**: React Query for data fetching, AsyncStorage for persistence
- **Design**: Navy blue (#1B2838) primary with amber (#F59E0B) accents
- **Font**: Inter (Google Fonts)

## Project Structure
- `app/(tabs)/` - 4 tabs: Dashboard, Cronograma, Registros, Relatorio
- `app/activity/[id].tsx` - Activity detail screen
- `app/progress-entry.tsx` - Progress logging modal
- `app/micro-entry.tsx` - Micro-activity entry modal
- `app/climate.tsx` - Weather conditions modal
- `app/entries-list.tsx` - Daily entries list
- `app/micro-list.tsx` - Micro-activities list
- `lib/types.ts` - TypeScript interfaces
- `lib/storage.ts` - AsyncStorage CRUD operations
- `lib/seed-data.ts` - Real schedule data with 81 activities (from CR_BL Rev05) and 10 equipment
- `lib/helpers.ts` - Formatting and utility functions
- `constants/colors.ts` - Theme colors

## Key Features
- Dashboard with KPIs (planned vs actual %, status counts, equipment hours)
- Activity schedule with search/filter
- Activity detail with progress tracking
- Daily progress entry with business rules (no regression)
- Micro-activity tracking with equipment and hours
- Weather conditions registration
- Daily report with executive summary and delays

## Seed Data
- Seed version key: `@obra_seeded_v2` - increment suffix when changing seed data to force re-seed
- 81 activities from the real CR_BL_Desc._Barragem_Alto_Jacutinga_Rev05 schedule PDF
- Activities include EDT hierarchy, planned dates, actual dates, % previsto/realizado, desvio
- Status auto-calculated: Concluido, Em andamento, Nao iniciado, Atrasado

## Recent Changes
- 2026-02-23: Updated seed data with complete 81-activity real schedule from PDF (Rev05)
- 2026-02-23: Initial build with full feature set

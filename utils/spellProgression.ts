// utils/spellProgression.ts

type SlotsConfig = { [level: number]: number };

// 1. FULL CASTERS (Barde, Clerc, Druide, Ensorceleur, Magicien)
const FULL_CASTER_TABLE: SlotsConfig[] = [
  {}, 
  { 1: 2 },
  { 1: 3 },
  { 1: 4, 2: 2 },
  { 1: 4, 2: 3 },
  { 1: 4, 2: 3, 3: 2 },
  { 1: 4, 2: 3, 3: 3 },
  { 1: 4, 2: 3, 3: 3, 4: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 2 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1, 9: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 1, 7: 1, 8: 1, 9: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 1, 8: 1, 9: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 2, 8: 1, 9: 1 },
];

// 2. HALF CASTERS (Paladin)
const HALF_CASTER_TABLE: SlotsConfig[] = [
  {}, 
  {}, // Niv 1 : Rien
  { 1: 2 }, // Niv 2 : Début
  { 1: 3 },
  { 1: 3 },
  { 1: 4, 2: 2 },
  { 1: 4, 2: 2 },
  { 1: 4, 2: 3 },
  { 1: 4, 2: 3 },
  { 1: 4, 2: 3, 3: 2 },
  { 1: 4, 2: 3, 3: 2 },
  { 1: 4, 2: 3, 3: 3 },
  { 1: 4, 2: 3, 3: 3 },
  { 1: 4, 2: 3, 3: 3, 4: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 2 },
  { 1: 4, 2: 3, 3: 3, 4: 2 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
];

// 3. PACT MAGIC (Occultiste / Warlock)
const WARLOCK_TABLE: SlotsConfig[] = [
  {},
  { 1: 1 },
  { 1: 2 },
  { 2: 2 },
  { 2: 2 },
  { 3: 2 },
  { 3: 2 },
  { 4: 2 },
  { 4: 2 },
  { 5: 2 },
  { 5: 2 },
  { 5: 3 },
  { 5: 3 },
  { 5: 3 },
  { 5: 3 },
  { 5: 3 },
  { 5: 3 },
  { 5: 4 },
  { 5: 4 },
  { 5: 4 },
  { 5: 4 },
];

export function getSlotsForClass(className: string, level: number): SlotsConfig {
  const c = className.toLowerCase();
  
  // Mapping spécifique pour ta liste
  if (c === 'occultiste') { 
    return WARLOCK_TABLE[level] || {};
  }
  
  if (c === 'paladin') {
    return HALF_CASTER_TABLE[level] || {};
  }
  
  // Tous les autres (Barde, Clerc, Druide, Ensorceleur, Magicien) sont Full Caster
  return FULL_CASTER_TABLE[level] || {};
}
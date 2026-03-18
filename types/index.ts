
export interface DomainData {
  id: string
  label: string
  description: string
  spells: { [level: number]: string[] }
}

export interface OathData {
  id: string
  label: string
  description: string
  channelDivinity: { title: string; description: string }[]
  spells: { [level: number]: string[] }
}

export interface OriginData {
  id: string
  label: string
  description: string
  features: { level: number; title: string; description: string }[]
}

export interface TraditionData {
  id: string
  label: string
  description: string
  features: { level: number; title: string; description: string }[]
}

export interface ApiSpell {
  name: string;
  castingTime?: string;
  scope?: string;        // Portée
  v?: boolean;           // Verbal
  s?: boolean;           // Somatique
  m?: boolean;           // Matériel
  r?: boolean;           // Rituel
  c?: boolean;           // Concentration
  materials?: string;
  duration?: string;
  level?: number;
  class?: string;
  school?: string;
  description?: string;
  source?: string;
  ogl?: boolean;
}

export interface Spell {
  id: string;
  nameFr: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string;    // "V, S, M"
  duration: string;
  concentration: boolean;
  ritual: boolean;
  classes: string[];
  descriptionFr: string;
}

export interface Character {
  id: string
  user_id: string
  name: string
  class: string
  level: number
  subclass: string
  ability_mod: number
  avatar: string
  prepared_spell_ids: string[]
  current_slots: number[]
  sorcery_points: number | null
  channel_divinity_uses: number | null
  created_at: string
  updated_at: string
}

export interface CharacterCreate {
  name: string
  class: string
  level: number
  subclass: string
  ability_mod: number
  avatar: string
}

export interface GameTable {
  id: string
  code: string
  name: string
  owner_id: string
  created_at: string
}

export interface TableMember {
  id: string
  table_id: string
  user_id: string
  character_id: string
  joined_at: string
  character?: Character
  profile?: { username: string }
}

export interface CharacterSessionState {
  level: number
  subclass: string
  ability_mod: number
  prepared_spell_ids: string[]
  current_slots: number[]
  sorcery_points: number | null
  channel_divinity_uses: number | null
}

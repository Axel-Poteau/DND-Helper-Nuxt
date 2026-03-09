
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

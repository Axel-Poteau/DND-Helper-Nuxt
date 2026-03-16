export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row:    { id: string; username: string; is_premium: boolean }
        Insert: { id: string; username: string; is_premium?: boolean }
        Update: { username?: string; is_premium?: boolean }
      }
      characters: {
        Row: {
          id: string
          user_id: string
          name: string
          class: string
          level: number
          subclass: string
          ability_mod: number
          avatar: string
          prepared_spell_ids: Json
          current_slots: Json
          sorcery_points: number | null
          channel_divinity_uses: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          name: string
          class: string
          level?: number
          subclass?: string
          ability_mod?: number
          avatar?: string
          prepared_spell_ids?: Json
          current_slots?: Json
          sorcery_points?: number | null
          channel_divinity_uses?: number | null
        }
        Update: {
          name?: string
          class?: string
          level?: number
          subclass?: string
          ability_mod?: number
          avatar?: string
          prepared_spell_ids?: Json
          current_slots?: Json
          sorcery_points?: number | null
          channel_divinity_uses?: number | null
        }
      }
      domains: {
        Row:    { id: string; label: string; description: string }
        Insert: { id: string; label: string; description: string }
        Update: { id?: string; label?: string; description?: string }
      }
      domain_spells: {
        Row:    { id: number; domain_id: string; level: number; spell_slug: string }
        Insert: { domain_id: string; level: number; spell_slug: string }
        Update: { domain_id?: string; level?: number; spell_slug?: string }
      }
      oaths: {
        Row:    { id: string; label: string; description: string }
        Insert: { id: string; label: string; description: string }
        Update: { id?: string; label?: string; description?: string }
      }
      oath_channel_divinity: {
        Row:    { id: number; oath_id: string; sort_order: number; title: string; description: string }
        Insert: { oath_id: string; sort_order?: number; title: string; description: string }
        Update: { oath_id?: string; sort_order?: number; title?: string; description?: string }
      }
      oath_spells: {
        Row:    { id: number; oath_id: string; level: number; spell_slug: string }
        Insert: { oath_id: string; level: number; spell_slug: string }
        Update: { oath_id?: string; level?: number; spell_slug?: string }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

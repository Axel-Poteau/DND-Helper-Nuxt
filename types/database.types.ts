export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
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
      origins: {
        Row:    { id: string; label: string; description: string }
        Insert: { id: string; label: string; description: string }
        Update: { id?: string; label?: string; description?: string }
      }
      origin_features: {
        Row:    { id: number; origin_id: string; level: number; title: string; description: string; sort_order: number }
        Insert: { origin_id: string; level: number; title: string; description: string; sort_order?: number }
        Update: { origin_id?: string; level?: number; title?: string; description?: string; sort_order?: number }
      }
      traditions: {
        Row:    { id: string; label: string; description: string }
        Insert: { id: string; label: string; description: string }
        Update: { id?: string; label?: string; description?: string }
      }
      tradition_features: {
        Row:    { id: number; tradition_id: string; level: number; title: string; description: string; sort_order: number }
        Insert: { tradition_id: string; level: number; title: string; description: string; sort_order?: number }
        Update: { tradition_id?: string; level?: number; title?: string; description?: string; sort_order?: number }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

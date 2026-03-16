import type { DomainData, OathData, OriginData, TraditionData } from '~/types'

function groupSpellsByLevel(rows: { level: number; spell_slug: string }[]): { [level: number]: string[] } {
  const map: { [level: number]: string[] } = {}
  for (const { level, spell_slug } of rows) {
    (map[level] ??= []).push(spell_slug)
  }
  return map
}

export function useSubclassData() {
  const supabase = useSupabaseClient() as any

  const { data: domains } = useAsyncData('domains', async () => {
    const { data } = await supabase
      .from('domains')
      .select('id, label, description, domain_spells(level, spell_slug)')

    if (!data) return {} as Record<string, DomainData>

    const result: Record<string, DomainData> = {}
    for (const d of data as any[]) {
      result[d.id] = {
        id: d.id,
        label: d.label,
        description: d.description,
        spells: groupSpellsByLevel(d.domain_spells ?? []),
      }
    }
    return result
  })

  const { data: oaths } = useAsyncData('oaths', async () => {
    const { data } = await supabase
      .from('oaths')
      .select('id, label, description, oath_channel_divinity(sort_order, title, description), oath_spells(level, spell_slug)')

    if (!data) return {} as Record<string, OathData>

    const result: Record<string, OathData> = {}
    for (const o of data as any[]) {
      result[o.id] = {
        id: o.id,
        label: o.label,
        description: o.description,
        channelDivinity: [...(o.oath_channel_divinity ?? [])]
          .sort((a: any, b: any) => a.sort_order - b.sort_order)
          .map(({ title, description }: any) => ({ title, description })),
        spells: groupSpellsByLevel(o.oath_spells ?? []),
      }
    }
    return result
  })

  const { data: origins } = useAsyncData('origins', async () => {
    const { data } = await supabase
      .from('origins')
      .select('id, label, description, origin_features(level, title, description, sort_order)')

    if (!data) return {} as Record<string, OriginData>

    const result: Record<string, OriginData> = {}
    for (const o of data as any[]) {
      result[o.id] = {
        id: o.id,
        label: o.label,
        description: o.description,
        features: [...(o.origin_features ?? [])]
          .sort((a: any, b: any) => a.level - b.level || a.sort_order - b.sort_order)
          .map(({ level, title, description }: any) => ({ level, title, description })),
      }
    }
    return result
  })

  const { data: traditions } = useAsyncData('traditions', async () => {
    const { data } = await supabase
      .from('traditions')
      .select('id, label, description, tradition_features(level, title, description, sort_order)')

    if (!data) return {} as Record<string, TraditionData>

    const result: Record<string, TraditionData> = {}
    for (const t of data as any[]) {
      result[t.id] = {
        id: t.id,
        label: t.label,
        description: t.description,
        features: [...(t.tradition_features ?? [])]
          .sort((a: any, b: any) => a.level - b.level || a.sort_order - b.sort_order)
          .map(({ level, title, description }: any) => ({ level, title, description })),
      }
    }
    return result
  })

  return { domains, oaths, origins, traditions }
}

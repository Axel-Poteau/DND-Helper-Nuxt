import type { GameTable, TableMember } from '~/types'

export function useGameTables() {
  const supabase = useSupabaseClient() as any

  const ownedTables = ref<GameTable[]>([])
  const joinedTables = ref<(GameTable & { my_member_id: string; character_id: string })[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function getUid(): Promise<string | null> {
    const { data } = await supabase.auth.getUser()
    return data?.user?.id ?? null
  }

  async function fetchOwnedTables() {
    const uid = await getUid()
    if (!uid) return
    const { data, error: err } = await supabase
      .from('game_tables')
      .select('*')
      .eq('owner_id', uid)
      .order('created_at', { ascending: false })
    if (err) { error.value = err.message; return }
    ownedTables.value = data ?? []
  }

  async function fetchJoinedTables() {
    const uid = await getUid()
    if (!uid) return
    const { data: memberships, error: err } = await supabase
      .from('table_members')
      .select('id, table_id, character_id, game_tables(*)')
      .eq('user_id', uid)
    if (err) { error.value = err.message; return }
    joinedTables.value = (memberships ?? [])
      .filter((m: any) => m.game_tables)
      .map((m: any) => ({
        ...m.game_tables,
        my_member_id: m.id,
        character_id: m.character_id,
      }))
  }

  async function createTable(name: string, characterId?: string): Promise<GameTable | null> {
    const uid = await getUid()
    if (!uid) { error.value = 'Non connecte.'; return null }
    error.value = null
    const { data, error: err } = await supabase
      .from('game_tables')
      .insert({ name, owner_id: uid })
      .select()
      .single()
    if (err) {
      error.value = err.message
      return null
    }
    // Add owner as table member with selected character
    if (characterId) {
      const { error: memberErr } = await supabase
        .from('table_members')
        .insert({ table_id: data.id, user_id: uid, character_id: characterId })
      if (memberErr) {
        error.value = memberErr.message
      }
    }
    await fetchOwnedTables()
    return data as GameTable
  }

  async function deleteTable(id: string) {
    error.value = null
    const { error: err } = await supabase
      .from('game_tables')
      .delete()
      .eq('id', id)
    if (err) { error.value = err.message; return }
    await Promise.all([fetchOwnedTables(), fetchJoinedTables()])
  }

  async function joinTable(code: string, characterId: string): Promise<boolean> {
    const uid = await getUid()
    if (!uid) { error.value = 'Non connecte.'; return false }
    error.value = null

    const { error: joinErr } = await supabase
      .rpc('join_table_by_code', { p_code: code, p_character_id: characterId })
    if (joinErr) {
      error.value = joinErr.message
      return false
    }
    await fetchJoinedTables()
    return true
  }

  async function leaveTable(memberId: string) {
    error.value = null
    const { error: err } = await supabase
      .from('table_members')
      .delete()
      .eq('id', memberId)
    if (err) { error.value = err.message; return }
    await fetchJoinedTables()
  }

  async function fetchTableMembers(tableId: string): Promise<TableMember[]> {
    const { data, error: err } = await supabase
      .rpc('get_table_members', { p_table_id: tableId })
    if (err) { error.value = err.message; return [] }
    return data ?? []
  }

  async function kickMember(memberId: string, tableId: string) {
    error.value = null
    const { error: err } = await supabase
      .rpc('kick_table_member', { p_member_id: memberId, p_table_id: tableId })
    if (err) { error.value = err.message }
  }

  return {
    ownedTables,
    joinedTables,
    isLoading,
    error,
    fetchOwnedTables,
    fetchJoinedTables,
    createTable,
    deleteTable,
    joinTable,
    leaveTable,
    fetchTableMembers,
    kickMember,
  }
}
import type { Character, CharacterCreate, CharacterSessionState } from '~/types'

export function useCharacters() {
  const supabase = useSupabaseClient() as any

  const characters = ref<Character[]>([])
  const activeCharacter = ref<Character | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function getUid(): Promise<string | null> {
    const { data } = await supabase.auth.getUser()
    return data?.user?.id ?? null
  }

  async function fetchCharacters() {
    const uid = await getUid()
    if (!uid) return
    isLoading.value = true
    error.value = null
    const { data, error: err } = await supabase
      .from('characters')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: true })
    isLoading.value = false
    if (err) {
      error.value = err.message
      return
    }
    characters.value = (data ?? []).map((row: any) => ({
      ...row,
      prepared_spell_ids: (row.prepared_spell_ids as string[]) ?? [],
      current_slots: (row.current_slots as number[]) ?? [0, 0, 0, 0, 0, 0, 0, 0, 0],
    }))
  }

  async function createCharacter(input: CharacterCreate): Promise<Character | null> {
    const uid = await getUid()
    if (!uid) {
      error.value = 'Utilisateur non connecté.'
      return null
    }
    error.value = null
    const payload = {
      user_id: uid,
      name: input.name,
      class: input.class,
      level: input.level,
      subclass: input.subclass,
      ability_mod: input.ability_mod,
      avatar: input.avatar,
      prepared_spell_ids: [],
      current_slots: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    }
    const { data, error: err } = await supabase
      .from('characters')
      .insert(payload)
      .select()
      .single()
    if (err) {
      if (err.message.includes('Character limit reached')) {
        error.value = 'Limite de personnages atteinte.'
      } else {
        error.value = err.message
      }
      return null
    }
    await fetchCharacters()
    return data as unknown as Character
  }

  async function deleteCharacter(id: string) {
    error.value = null
    const { error: err } = await supabase
      .from('characters')
      .delete()
      .eq('id', id)
    if (err) { error.value = err.message; return }
    if (activeCharacter.value?.id === id) {
      activeCharacter.value = null
    }
    await fetchCharacters()
  }

  async function saveCharacterState(id: string, state: CharacterSessionState) {
    const { error: err } = await supabase
      .from('characters')
      .update({
        level: state.level,
        subclass: state.subclass,
        ability_mod: state.ability_mod,
        prepared_spell_ids: state.prepared_spell_ids as any,
        current_slots: state.current_slots as any,
        sorcery_points: state.sorcery_points,
        channel_divinity_uses: state.channel_divinity_uses,
      })
      .eq('id', id)
    if (err) console.error('Auto-save failed:', err.message)
  }

  function selectCharacter(char: Character) {
    activeCharacter.value = char
  }

  return {
    characters,
    activeCharacter,
    isLoading,
    error,
    fetchCharacters,
    createCharacter,
    deleteCharacter,
    saveCharacterState,
    selectCharacter,
  }
}

export function useProfile() {
  const supabase = useSupabaseClient() as any

  const isPremium = ref(false)
  const username = ref<string | null>(null)
  const loaded = ref(false)

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.id) return
    const { data } = await supabase
      .from('profiles')
      .select('username, is_premium')
      .eq('id', user.id)
      .single()
    username.value = data?.username ?? null
    isPremium.value = data?.is_premium ?? false
    loaded.value = true
  }

  if (import.meta.client) {
    fetchProfile()
  }

  return { isPremium, username, fetchProfile }
}

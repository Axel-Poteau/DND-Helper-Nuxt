<script setup lang="ts">
const props = defineProps<{
  selectedClass: string
}>()

const emit = defineEmits<{
  selectClass: [className: string]
}>()

const CLASSES = [
  { id: 'clerc', label: 'Clerc', icon: '✨' },
  { id: 'barde', label: 'Barde', icon: '🎵' },
  { id: 'druide', label: 'Druide', icon: '🌿' },
  { id: 'ensorceleur', label: 'Ensorceleur', icon: '🔥' },
  { id: 'magicien', label: 'Magicien', icon: '🔮' },
  { id: 'occultiste', label: 'Occultiste', icon: '👁️' },
  { id: 'paladin', label: 'Paladin', icon: '🛡️' },
]

const scrollRef = ref<HTMLDivElement | null>(null)

watch(
  () => props.selectedClass,
  () => {
    if (scrollRef.value) {
      const selectedBtn = scrollRef.value.querySelector(`[data-active="true"]`) as HTMLElement
      if (selectedBtn) {
        const containerCenter = scrollRef.value.offsetWidth / 2
        const btnCenter = selectedBtn.offsetLeft + selectedBtn.offsetWidth / 2
        scrollRef.value.scrollTo({ left: btnCenter - containerCenter, behavior: 'smooth' })
      }
    }
  }
)

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const username = ref<string | null>(null)

watch(user, async (u) => {
  if (!u) { username.value = null; return }
  const { data } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', u.id)
    .single()
  username.value = data?.username ?? null
}, { immediate: true })

const displayName = computed(() =>
  username.value || user.value?.email?.split('@')[0] || null
)

async function handleLogout() {
  await supabase.auth.signOut()
  navigateTo('/')
}
</script>

<template>
  <nav class="fixed top-0 left-0 w-full z-50 bg-dnd-dark/95 backdrop-blur-md border-b border-dnd-gold/30 shadow-lg">
    <div class="w-full max-w-6xl mx-auto px-4">
      <div class="flex items-center h-16 md:h-20 gap-4">
        <div class="hidden md:block flex-shrink-0 mr-4">
          <NuxtLink
            to="/"
            class="font-serif text-dnd-gold font-bold text-xl tracking-widest border border-dnd-gold/50 px-2 py-1 rounded select-none cursor-pointer hover:bg-dnd-gold/10 transition-colors inline-block"
          >
            D&amp;D
          </NuxtLink>
        </div>

        <div
          ref="scrollRef"
          class="flex-1 overflow-x-auto min-w-0 py-3 no-scrollbar"
        >
          <div class="flex items-center space-x-3 px-2">
            <button
              v-for="classe in CLASSES"
              :key="classe.id"
              :data-active="selectedClass === classe.id"
              :class="[
                'relative px-4 py-2 rounded transition-all duration-200 whitespace-nowrap flex-shrink-0 flex items-center gap-2',
                'font-serif text-sm md:text-base tracking-wide select-none border',
                selectedClass === classe.id
                  ? 'bg-dnd-red text-dnd-parchment border-dnd-gold translate-y-[1px] shadow-md'
                  : 'bg-transparent border-transparent text-dnd-gold-dim hover:text-dnd-gold hover:bg-dnd-leather/50',
              ]"
              @click="emit('selectClass', classe.id)"
            >
              <span class="opacity-80 text-lg">{{ classe.icon }}</span>
              <span>{{ classe.label }}</span>
            </button>
          </div>
        </div>

        <div class="flex items-center gap-3 flex-shrink-0 pl-3 border-l border-dnd-gold/20">
          <span
            v-if="displayName"
            class="hidden md:block text-dnd-parchment/50 font-serif text-xs uppercase tracking-wider max-w-[120px] truncate"
            :title="displayName"
          >
            {{ displayName }}
          </span>
          <button
            class="px-3 py-1.5 border border-dnd-gold/20 text-dnd-gold-dim hover:text-dnd-red hover:border-dnd-red/40 hover:bg-dnd-red/10 rounded font-serif text-xs uppercase tracking-wider transition-all duration-200 whitespace-nowrap"
            @click="handleLogout"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

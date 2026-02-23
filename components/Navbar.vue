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
</script>

<template>
  <nav class="fixed top-0 left-0 w-full z-50 bg-dnd-dark/95 backdrop-blur-md border-b border-dnd-gold/30 shadow-lg">
    <div class="w-full max-w-6xl mx-auto px-4">
      <div class="flex items-center h-16 md:h-20 gap-4">
        <div class="hidden md:block flex-shrink-0 mr-4">
          <span class="font-serif text-dnd-gold font-bold text-xl tracking-widest border border-dnd-gold/50 px-2 py-1 rounded select-none cursor-default hover:bg-dnd-gold/10 transition-colors">
            D&amp;D
          </span>
        </div>

        <!-- ZONE DE SCROLL -->
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
      </div>
    </div>
  </nav>
</template>

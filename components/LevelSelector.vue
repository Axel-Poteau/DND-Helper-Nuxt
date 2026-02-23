<script setup lang="ts">
const props = defineProps<{
  currentLevel: number
}>()

const emit = defineEmits<{
  levelChange: [level: number]
}>()

const levels = Array.from({ length: 20 }, (_, i) => i + 1)
const scrollRef = ref<HTMLDivElement | null>(null)

watch(
  () => props.currentLevel,
  () => {
    if (scrollRef.value) {
      const selectedBtn = scrollRef.value.children[props.currentLevel - 1] as HTMLElement
      if (selectedBtn) {
        const container = scrollRef.value
        const scrollPosition = selectedBtn.offsetLeft - (container.clientWidth / 2) + (selectedBtn.clientWidth / 2)
        container.scrollTo({ left: scrollPosition, behavior: 'smooth' })
      }
    }
  }
)
</script>

<template>
  <div class="w-full max-w-4xl mx-auto mb-8 select-none">
    <h2 class="text-center font-serif text-dnd-gold text-xl mb-3 tracking-widest uppercase opacity-90">
      — Niveau du Personnage —
    </h2>

    <div class="w-full bg-dnd-dark border-y-2 border-dnd-gold/40 shadow-2xl relative rounded-lg overflow-hidden">
      <div class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-dnd-dark to-transparent z-10 pointer-events-none" />
      <div class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-dnd-dark to-transparent z-10 pointer-events-none" />

      <div
        ref="scrollRef"
        class="flex w-full overflow-x-auto no-scrollbar scroll-smooth snap-x"
      >
        <button
          v-for="level in levels"
          :key="level"
          :class="[
            'flex-none w-14 py-3 relative group transition-all duration-200 snap-center',
            'font-serif font-bold text-lg border-r border-dnd-gold/10',
            currentLevel === level
              ? 'bg-dnd-red text-dnd-parchment shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]'
              : 'bg-transparent text-dnd-gold-dim hover:bg-dnd-leather-light hover:text-dnd-gold',
          ]"
          @click="emit('levelChange', level)"
        >
          <div :class="['text-[10px] mb-1 uppercase tracking-wider', currentLevel === level ? 'text-dnd-gold' : 'text-dnd-gold-dim/50']">
            Niv
          </div>
          <span class="relative z-10 text-xl">{{ level }}</span>
          <span v-if="currentLevel === level" class="absolute bottom-0 left-0 w-full h-1 bg-dnd-gold shadow-glow" />
        </button>
      </div>
    </div>
  </div>
</template>

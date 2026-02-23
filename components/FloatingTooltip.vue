<script setup lang="ts">
import type { Spell } from '~/types'

const props = defineProps<{
  spell: Spell | null
  position: { x: number; y: number } | null
  side: 'left' | 'right'
}>()

const containerRef = ref<HTMLDivElement | null>(null)
const adjustedTop = ref(0)

watch(
  () => [props.spell, props.position],
  async () => {
    if (!containerRef.value || !props.position) return

    await nextTick()

    const tooltip = containerRef.value
    const rect = tooltip.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const margin = 20

    let newTop = Math.max(10, props.position.y - 40)

    if (newTop + rect.height > windowHeight - margin) {
      newTop = windowHeight - rect.height - margin
    }

    adjustedTop.value = newTop
  },
  { flush: 'post' }
)

const rightOffset = computed(() => {
  if (props.side === 'left' && props.position) {
    return (window.innerWidth - props.position.x) + 20
  }
  return undefined
})

const arrowTop = computed(() => {
  if (!props.position || !containerRef.value) return 20
  return Math.min(
    Math.max(20, props.position.y - adjustedTop.value),
    containerRef.value ? containerRef.value.clientHeight - 30 : 500
  )
})
</script>

<template>
  <div
    v-if="spell && position"
    ref="containerRef"
    class="fixed z-[9999] pointer-events-none w-[450px] p-5 rounded-xl shadow-2xl bg-[#1a1510]/95 border border-dnd-gold/60 text-dnd-parchment backdrop-blur-xl animate-fadeIn"
    :style="{
      top: adjustedTop + 'px',
      left: side === 'right' ? (position.x + 20) + 'px' : 'auto',
      right: side === 'left' ? rightOffset + 'px' : 'auto',
      maxHeight: '90vh',
      overflow: 'hidden',
    }"
  >
    <!-- En-tête -->
    <div class="border-b border-dnd-gold/40 pb-3 mb-3">
      <h3 class="font-serif font-bold text-2xl text-dnd-gold leading-none mb-2">
        {{ spell.nameFr }}
      </h3>
      <div class="flex justify-between text-sm text-dnd-gold-dim italic font-medium">
        <span class="uppercase tracking-wider">Niveau {{ spell.level }} • {{ spell.school }}</span>
        <span>{{ spell.components }}</span>
      </div>
    </div>

    <!-- Détails techniques -->
    <div class="grid grid-cols-2 gap-y-2 text-xs text-dnd-parchment/80 mb-4 font-mono border-b border-dnd-gold/10 pb-3">
      <div><span class="text-dnd-gold font-bold">Temps:</span> {{ spell.castingTime }}</div>
      <div><span class="text-dnd-gold font-bold">Durée:</span> {{ spell.duration }}</div>
      <div class="col-span-2"><span class="text-dnd-gold font-bold">Portée:</span> {{ spell.range }}</div>
    </div>

    <!-- Description avec HTML -->
    <div
      class="text-sm text-justify leading-relaxed opacity-95 relative [&_strong]:text-dnd-gold [&_strong]:font-bold [&_em]:text-dnd-parchment/70 [&_em]:italic [&_p]:mb-2 [&_br]:block [&_br]:content-[''] [&_br]:mt-2"
      v-html="spell.descriptionFr"
    />

    <!-- Flèche décorative -->
    <div
      :class="[
        'absolute w-4 h-4 bg-[#1a1510] border-t border-l border-dnd-gold/60 transform rotate-45 transition-all duration-75',
        side === 'right'
          ? '-left-2'
          : '-right-2 border-t-dnd-gold/60 border-r-dnd-gold/60 border-l-0 border-b-0',
      ]"
      :style="{ top: arrowTop + 'px' }"
    />
  </div>
</template>

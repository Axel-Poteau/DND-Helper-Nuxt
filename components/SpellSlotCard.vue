<script setup lang="ts">
const props = defineProps<{
  level: number
  current: number
  max: number
}>()

const emit = defineEmits<{
  increment: []
  decrement: []
}>()

const isDisabled = computed(() => props.max === 0)
const isEmpty = computed(() => props.current === 0 && props.max > 0)
</script>

<template>
  <div
    v-if="isDisabled"
    class="bg-dnd-dark/30 border border-dnd-gold/10 rounded-xl p-4 flex flex-col items-center justify-center opacity-40 grayscale select-none h-40"
  >
    <span class="text-dnd-gold-dim font-serif text-xl">NIV {{ level }}</span>
    <span class="text-xs text-dnd-parchment/30 mt-2">Indisponible</span>
  </div>

  <div
    v-else
    :class="[
      'relative overflow-hidden rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-between p-4 h-40 shadow-lg group',
      'hover:border-dnd-gold hover:shadow-[0_0_15px_rgba(200,170,110,0.2)]',
      isEmpty ? 'border-dnd-red/50 bg-dnd-red/10' : 'border-dnd-gold/60 bg-dnd-leather/80',
    ]"
  >
    <div class="absolute -top-10 -right-10 text-9xl font-serif text-black/20 pointer-events-none select-none">
      {{ level }}
    </div>

    <h3 class="font-serif text-dnd-gold text-2xl font-bold drop-shadow-md z-10">
      NIVEAU {{ level }}
    </h3>

    <div class="flex items-end gap-2 z-10 my-2">
      <span :class="['text-5xl font-bold font-serif leading-none', isEmpty ? 'text-dnd-red' : 'text-dnd-parchment']">
        {{ current }}
      </span>
      <span class="text-lg text-dnd-gold-dim font-serif mb-1">
        / {{ max }}
      </span>
    </div>

    <div class="flex items-center gap-4 w-full z-10">
      <button
        :disabled="current <= 0"
        class="flex-1 bg-dnd-dark border border-dnd-gold/30 hover:border-dnd-red hover:bg-dnd-red/20 text-dnd-parchment rounded py-1 font-bold text-xl disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        @click="emit('decrement')"
      >
        -
      </button>
      <button
        :disabled="current >= max"
        class="flex-1 bg-dnd-dark border border-dnd-gold/30 hover:border-dnd-gold hover:bg-dnd-gold/20 text-dnd-gold rounded py-1 font-bold text-xl disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        @click="emit('increment')"
      >
        +
      </button>
    </div>
  </div>
</template>

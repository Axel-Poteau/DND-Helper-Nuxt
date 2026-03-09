<script setup lang="ts">
import type { Spell } from '~/types'

defineProps<{
  spell: Spell | null
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <div
    v-if="spell"
    class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
    @click="emit('close')"
  >
    <div
      class="relative w-full max-w-lg max-h-[85vh] overflow-y-auto custom-scrollbar p-5 rounded-xl shadow-2xl bg-[#1a1510]/95 border border-dnd-gold/60 text-dnd-parchment"
      @click.stop
    >
      <button
        class="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 border border-dnd-gold/30 text-dnd-gold hover:bg-dnd-red/30 hover:border-dnd-red/50 hover:text-dnd-parchment transition-all"
        @click="emit('close')"
      >
        ✕
      </button>

      <div class="border-b border-dnd-gold/40 pb-3 mb-3 pr-8">
        <h3 class="font-serif font-bold text-2xl text-dnd-gold leading-none mb-2">
          {{ spell.nameFr }}
        </h3>
        <div class="flex justify-between text-sm text-dnd-gold-dim italic font-medium">
          <span class="uppercase tracking-wider">Niveau {{ spell.level }} • {{ spell.school }}</span>
          <span>{{ spell.components }}</span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-y-2 text-xs text-dnd-parchment/80 mb-4 font-mono border-b border-dnd-gold/10 pb-3">
        <div><span class="text-dnd-gold font-bold">Temps:</span> {{ spell.castingTime }}</div>
        <div><span class="text-dnd-gold font-bold">Durée:</span> {{ spell.duration }}</div>
        <div class="col-span-2"><span class="text-dnd-gold font-bold">Portée:</span> {{ spell.range }}</div>
      </div>

      <div
        class="text-sm text-justify leading-relaxed opacity-95
        [&_strong]:text-dnd-gold [&_strong]:font-bold
        [&_em]:text-dnd-parchment/70 [&_em]:italic
        [&_p]:mb-2 [&_br]:block [&_br]:content-[''] [&_br]:mt-2"
        v-html="spell.descriptionFr"
      />
    </div>
  </div>
</template>

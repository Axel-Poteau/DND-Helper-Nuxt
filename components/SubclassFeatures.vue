<script setup lang="ts">
const props = defineProps<{
  playerLevel: number
  features: { level: number; title: string; description: string }[]
  title: string
  icon: string
  customClass?: string
}>()
</script>

<template>
  <div
    v-if="features.filter(f => playerLevel >= f.level).length > 0"
    :class="customClass ?? 'mt-6 border-t border-dnd-gold/20 pt-6'"
  >
    <h3 class="text-dnd-gold font-serif text-lg tracking-widest flex items-center gap-2 mb-4">
      <span>{{ icon }}</span> {{ title }}
    </h3>

    <div class="bg-dnd-dark/40 p-4 rounded-lg border border-dnd-gold/10 space-y-3">
      <div
        v-for="(feat, idx) in features"
        :key="idx"
        :class="[
          'text-left border-l-2 pl-3 transition-colors',
          playerLevel >= feat.level
            ? 'border-dnd-gold/30 hover:border-dnd-gold'
            : 'border-dnd-gold/10 opacity-30 grayscale',
        ]"
      >
        <div class="flex items-center gap-2">
          <span
            :class="[
              'text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border',
              playerLevel >= feat.level
                ? 'text-dnd-gold bg-dnd-gold/10 border-dnd-gold/30'
                : 'text-dnd-parchment/30 bg-black/20 border-dnd-gold/10',
            ]"
          >
            Niv {{ feat.level }}
          </span>
          <span
            :class="[
              'font-bold text-sm uppercase tracking-wide',
              playerLevel >= feat.level ? 'text-dnd-gold' : 'text-dnd-parchment/30',
            ]"
          >
            {{ feat.title }}
          </span>
        </div>
        <div
          v-if="playerLevel >= feat.level"
          class="text-dnd-parchment/70 text-xs italic leading-relaxed text-justify mt-1"
        >
          {{ feat.description }}
        </div>
      </div>
    </div>
  </div>
</template>

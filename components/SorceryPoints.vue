<script setup lang="ts">
const props = defineProps<{
  playerLevel: number
  playerClass: string
}>()

const SORCERY_POINTS_BY_LEVEL = [
  0, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
]

const SLOT_CREATION_COST: Record<number, number> = {
  1: 2,
  2: 3,
  3: 5,
  4: 6,
  5: 7,
}

const isSorcerer = computed(() => props.playerClass.toLowerCase() === 'ensorceleur')
const maxPoints = computed(() => isSorcerer.value ? SORCERY_POINTS_BY_LEVEL[props.playerLevel - 1] : 0)

const pointsLeft = ref(0)

watch(
  () => [props.playerLevel, props.playerClass],
  () => {
    pointsLeft.value = maxPoints.value
  },
  { immediate: true }
)
</script>

<template>
  <div v-if="isSorcerer && playerLevel >= 2">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-dnd-gold font-serif text-lg tracking-widest flex items-center gap-2">
        <span>✦</span> SOURCE DE MAGIE
      </h3>
      <button
        class="text-[10px] uppercase tracking-wider text-dnd-gold-dim border border-dnd-gold/20 px-2 py-1 rounded hover:bg-dnd-gold/10 hover:text-dnd-gold transition-colors"
        @click="pointsLeft = maxPoints"
      >
        Repos Long
      </button>
    </div>

    <div class="bg-dnd-dark/40 p-4 rounded-lg border border-dnd-gold/10 space-y-5">
      <div class="flex flex-col items-center gap-3">
        <div class="flex items-center gap-3">
          <button
            class="w-8 h-8 flex items-center justify-center rounded border border-dnd-gold/30 text-dnd-gold hover:bg-dnd-gold/10 transition-colors text-lg font-bold"
            @click="pointsLeft = Math.max(0, pointsLeft - 1)"
          >
            -
          </button>
          <div class="flex items-baseline gap-1">
            <span class="text-3xl font-bold text-dnd-gold tabular-nums">{{ pointsLeft }}</span>
            <span class="text-sm text-dnd-parchment/40">/ {{ maxPoints }}</span>
          </div>
          <button
            class="w-8 h-8 flex items-center justify-center rounded border border-dnd-gold/30 text-dnd-gold hover:bg-dnd-gold/10 transition-colors text-lg font-bold"
            @click="pointsLeft = Math.min(maxPoints, pointsLeft + 1)"
          >
            +
          </button>
        </div>
        <div class="text-[10px] text-dnd-parchment/40 uppercase tracking-widest">
          Points de Sorcellerie
        </div>
      </div>

      <div class="border-t border-dnd-gold/10 pt-4">
        <h4 class="text-xs font-bold text-dnd-gold uppercase tracking-widest mb-3 text-center">
          Flexibilité des sorts
        </h4>
        <p class="text-[10px] text-dnd-parchment/50 italic text-center mb-3">
          Action bonus : convertir points ↔ emplacements
        </p>
        <div class="grid grid-cols-5 gap-1 text-center">
          <div
            v-for="(cost, slotLevel) in SLOT_CREATION_COST"
            :key="slotLevel"
            class="bg-black/30 rounded border border-dnd-gold/10 py-1.5 px-1"
          >
            <div class="text-[9px] text-dnd-parchment/40 uppercase">Niv {{ slotLevel }}</div>
            <div class="text-sm font-bold text-dnd-gold">{{ cost }} pts</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

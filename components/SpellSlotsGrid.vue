<script setup lang="ts">
import { getSlotsForClass } from '~/utils/spellProgression'

const props = defineProps<{
  playerLevel: number
  playerClass: string
}>()

const slotsConfig = computed(() => getSlotsForClass(props.playerClass, props.playerLevel))

function getMaxSlotsArray() {
  return Array.from({ length: 9 }, (_, i) => {
    const level = i + 1
    return slotsConfig.value[level] || 0
  })
}

const currentSlots = ref<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0])

watch(
  () => [props.playerLevel, props.playerClass],
  () => {
    currentSlots.value = getMaxSlotsArray()
  },
  { immediate: true }
)

function handleModify(levelIndex: number, change: number) {
  const level = levelIndex + 1
  const max = slotsConfig.value[level] || 0
  const newVal = currentSlots.value[levelIndex] + change
  if (newVal >= 0 && newVal <= max) {
    currentSlots.value[levelIndex] = newVal
  }
}

function handleLongRest() {
  currentSlots.value = getMaxSlotsArray()
}
</script>

<template>
  <div class="w-full">
    <!-- Grille 3x3 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <template v-for="index in 9" :key="index">
        <SpellSlotCard
          v-if="(slotsConfig[index] || 0) > 0"
          :level="index"
          :max="slotsConfig[index] || 0"
          :current="currentSlots[index - 1] || 0"
          @increment="handleModify(index - 1, 1)"
          @decrement="handleModify(index - 1, -1)"
        />
      </template>
    </div>

    <!-- Info Spéciale Occultiste -->
    <div v-if="playerClass.toLowerCase() === 'occultiste'" class="mb-6 text-center text-dnd-purple/80 text-sm italic">
      Magie de Pacte : Récupération après un repos court.
    </div>

    <!-- Bouton global de reset -->
    <div class="flex justify-center">
      <button
        class="bg-dnd-leather border-2 border-dnd-gold text-dnd-gold px-8 py-3 rounded font-serif uppercase tracking-widest hover:bg-dnd-red hover:text-white hover:border-transparent transition-all shadow-lg active:scale-95"
        @click="handleLongRest"
      >
        Repos Long (Tout Restaurer)
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Spell } from '~/types'

const props = defineProps<{
  spell: Spell
  actionIcon?: string
}>()

const emit = defineEmits<{
  action: []
  spellEnter: [e: MouseEvent, spell: Spell]
  spellLeave: []
}>()

const isAddMode = computed(() => props.actionIcon === '+')
const isRemoveMode = computed(() => props.actionIcon === '✕')
const isLocked = computed(() => props.actionIcon === '🔒')
const isDomain = computed(() => props.actionIcon === '✦')

function handleCardClick() {
  if (isAddMode.value && !isLocked.value) {
    emit('action')
  }
}

function handleMouseEnter(e: MouseEvent) {
  emit('spellEnter', e, props.spell)
}
</script>

<template>
  <div
    :class="[
      'group relative flex items-center justify-between',
      'bg-black/40 border border-dnd-gold/10 rounded px-3 py-2',
      'transition-all duration-200',
      isAddMode && !isLocked ? 'cursor-pointer hover:bg-dnd-gold/10 hover:border-dnd-gold/50 active:scale-[0.99]' : '',
      isLocked ? 'opacity-50 cursor-not-allowed grayscale' : '',
      isRemoveMode ? 'cursor-default hover:border-dnd-red/30' : '',
    ]"
    @click="handleCardClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="emit('spellLeave')"
  >
    <div class="flex-1 min-w-0 mr-3 pointer-events-none">
      <div class="flex items-baseline justify-between mb-0.5">
        <h4 :class="['font-bold text-sm truncate pr-2', isRemoveMode ? 'text-dnd-parchment' : 'text-dnd-gold']">
          {{ spell.nameFr }}
        </h4>
        <span class="text-[9px] uppercase tracking-widest text-dnd-gold-dim opacity-70 flex-shrink-0">
          {{ spell.school }}
        </span>
      </div>

      <div class="flex items-center gap-3 text-[10px] text-dnd-parchment/60 font-mono">
        <span title="Temps d'incantation">⏱ {{ spell.castingTime === '1 action' ? '1 Act' : spell.castingTime.replace('action bonus', 'Bonus') }}</span>
        <span class="opacity-40">|</span>
        <span title="Portée" class="truncate max-w-[80px]">📏 {{ spell.range }}</span>

        <div class="flex gap-1 ml-auto">
          <span
            v-if="spell.concentration"
            class="flex items-center justify-center w-4 h-4 bg-dnd-gold/20 text-dnd-gold text-[9px] font-bold rounded-sm border border-dnd-gold/30"
          >C</span>
          <span
            v-if="spell.ritual"
            class="flex items-center justify-center w-4 h-4 bg-white/10 text-dnd-parchment text-[9px] font-bold rounded-sm border border-white/20"
          >R</span>
        </div>
      </div>
    </div>

    <div v-if="isAddMode && !isLocked" class="text-dnd-gold/50 text-xl font-light group-hover:text-dnd-gold transition-colors">+</div>
    <div v-if="isLocked" class="text-dnd-red/50 text-xs">🔒</div>
    <div v-if="isDomain" class="text-dnd-gold text-xs">✦</div>

    <button
      v-if="isRemoveMode"
      class="w-6 h-6 flex items-center justify-center rounded hover:bg-dnd-red/20 text-dnd-parchment/50 hover:text-dnd-red transition-all pointer-events-auto"
      @click.stop="emit('action')"
    >
      ✕
    </button>
  </div>
</template>

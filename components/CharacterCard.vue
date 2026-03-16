<script setup lang="ts">
import type { Character } from '~/types'
import { getAvatarEmoji } from '~/data/avatars'

const props = defineProps<{
  character: Character
}>()

const emit = defineEmits<{
  select: []
  delete: []
}>()

const CLASS_LABELS: Record<string, string> = {
  clerc: 'Clerc',
  paladin: 'Paladin',
  ensorceleur: 'Ensorceleur',
  magicien: 'Magicien',
  barde: 'Barde',
  occultiste: 'Occultiste',
}

const confirmDelete = ref(false)

function handleDelete() {
  if (!confirmDelete.value) {
    confirmDelete.value = true
    setTimeout(() => { confirmDelete.value = false }, 3000)
    return
  }
  emit('delete')
}
</script>

<template>
  <div
    class="group relative flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dnd-gold/30 bg-dnd-leather/40 backdrop-blur-sm hover:border-dnd-gold hover:bg-dnd-leather/60 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(200,170,110,0.15)]"
    @click="emit('select')"
  >
    <!-- Delete button -->
    <button
      class="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
      :class="confirmDelete ? 'bg-dnd-red/80 text-white border border-dnd-red' : 'bg-black/40 text-dnd-parchment/50 hover:text-dnd-red hover:bg-dnd-red/20 border border-transparent'"
      :title="confirmDelete ? 'Confirmer la suppression' : 'Supprimer'"
      @click.stop="handleDelete"
    >
      {{ confirmDelete ? '?' : '✕' }}
    </button>

    <!-- Avatar -->
    <div class="w-16 h-16 rounded-full bg-dnd-dark/60 border-2 border-dnd-gold/40 flex items-center justify-center text-3xl group-hover:border-dnd-gold group-hover:scale-105 transition-all">
      {{ getAvatarEmoji(character.avatar) }}
    </div>

    <!-- Name -->
    <h3 class="font-serif font-bold text-dnd-gold text-lg tracking-wide text-center leading-tight">
      {{ character.name }}
    </h3>

    <!-- Class + Level -->
    <div class="flex items-center gap-2">
      <span class="text-xs font-serif text-dnd-parchment/70 uppercase tracking-wider">
        {{ CLASS_LABELS[character.class] || character.class }}
      </span>
      <span class="text-[10px] font-bold text-dnd-gold bg-dnd-gold/10 border border-dnd-gold/30 px-1.5 py-0.5 rounded">
        Niv {{ character.level }}
      </span>
    </div>

    <!-- Spell count -->
    <div class="text-[10px] text-dnd-parchment/40 italic">
      {{ character.prepared_spell_ids.length }} sort{{ character.prepared_spell_ids.length > 1 ? 's' : '' }}
    </div>
  </div>
</template>

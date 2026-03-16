<script setup lang="ts">
import type { CharacterCreate } from '~/types'
import { AVATARS } from '~/data/avatars'

const emit = defineEmits<{
  close: []
  created: [character: CharacterCreate]
}>()

const CLASSES = [
  { id: 'clerc', label: 'Clerc' },
  { id: 'ensorceleur', label: 'Ensorceleur' },
  { id: 'magicien', label: 'Magicien' },
  { id: 'paladin', label: 'Paladin' },
]

const DEFAULT_SUBCLASS: Record<string, string> = {
  clerc: 'vie',
  paladin: 'devotion',
  ensorceleur: 'draconique',
  magicien: 'evocation',
}

const name = ref('')
const selectedClass = ref('clerc')
const level = ref(1)
const abilityMod = ref(3)
const avatar = ref('default')

const selectedSubclass = computed({
  get: () => DEFAULT_SUBCLASS[selectedClass.value] || '',
  set: () => {},
})

const error = ref<string | null>(null)
const isSubmitting = ref(false)

function handleSubmit() {
  error.value = null
  if (!name.value.trim()) {
    error.value = 'Donnez un nom a votre personnage.'
    return
  }
  if (name.value.trim().length > 30) {
    error.value = 'Le nom ne peut pas depasser 30 caracteres.'
    return
  }

  isSubmitting.value = true
  emit('created', {
    name: name.value.trim(),
    class: selectedClass.value,
    level: level.value,
    subclass: DEFAULT_SUBCLASS[selectedClass.value] || '',
    ability_mod: abilityMod.value,
    avatar: avatar.value,
  })
}
</script>

<template>
  <div
    class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
    @click="emit('close')"
  >
    <div
      class="relative w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar p-6 rounded-xl shadow-2xl bg-[#1a1510]/95 border border-dnd-gold/60 text-dnd-parchment"
      @click.stop
    >
      <button
        class="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 border border-dnd-gold/30 text-dnd-gold hover:bg-dnd-red/30 hover:border-dnd-red/50 hover:text-dnd-parchment transition-all"
        @click="emit('close')"
      >
        ✕
      </button>

      <h2 class="font-serif font-bold text-2xl text-dnd-gold tracking-widest uppercase mb-6 text-center">
        Nouveau Personnage
      </h2>

      <form class="space-y-5" @submit.prevent="handleSubmit">
        <!-- Nom -->
        <div>
          <label class="block text-dnd-gold-dim text-[10px] uppercase tracking-[0.2em] mb-1">Nom</label>
          <input
            v-model="name"
            type="text"
            placeholder="Gandalf, Elara..."
            maxlength="30"
            class="w-full bg-black/40 border border-dnd-gold/30 rounded px-4 py-2.5 text-dnd-parchment placeholder:text-dnd-parchment/30 focus:outline-none focus:border-dnd-gold focus:ring-1 focus:ring-dnd-gold/50"
          />
        </div>

        <!-- Classe -->
        <div>
          <label class="block text-dnd-gold-dim text-[10px] uppercase tracking-[0.2em] mb-1">Classe</label>
          <select
            v-model="selectedClass"
            style="color-scheme: dark"
            class="w-full bg-black/40 border border-dnd-gold/30 rounded px-4 py-2.5 text-dnd-gold font-serif focus:outline-none focus:border-dnd-gold focus:ring-1 focus:ring-dnd-gold/50 cursor-pointer"
          >
            <option
              v-for="c in CLASSES"
              :key="c.id"
              :value="c.id"
              class="bg-[#1a1510] text-dnd-parchment"
            >
              {{ c.label }}
            </option>
          </select>
        </div>

        <!-- Niveau -->
        <div>
          <label class="block text-dnd-gold-dim text-[10px] uppercase tracking-[0.2em] mb-1">
            Niveau : {{ level }}
          </label>
          <input
            v-model.number="level"
            type="range"
            min="1"
            max="20"
            class="w-full accent-amber-600"
          />
        </div>

        <!-- Mod Caractéristique -->
        <div>
          <label class="block text-dnd-gold-dim text-[10px] uppercase tracking-[0.2em] mb-1">
            Mod. Caracteristique : +{{ abilityMod }}
          </label>
          <input
            v-model.number="abilityMod"
            type="range"
            min="0"
            max="10"
            class="w-full accent-amber-600"
          />
        </div>

        <!-- Avatar -->
        <div>
          <label class="block text-dnd-gold-dim text-[10px] uppercase tracking-[0.2em] mb-2">Avatar</label>
          <div class="grid grid-cols-6 gap-2">
            <button
              v-for="av in AVATARS"
              :key="av.id"
              type="button"
              :class="[
                'w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xl transition-all',
                avatar === av.id
                  ? 'border-dnd-gold bg-dnd-gold/20 scale-110'
                  : 'border-dnd-gold/20 bg-black/30 hover:border-dnd-gold/50 hover:bg-dnd-gold/10',
              ]"
              :title="av.label"
              @click="avatar = av.id"
            >
              {{ av.emoji }}
            </button>
          </div>
        </div>

        <!-- Error -->
        <div v-if="error" class="bg-dnd-red/20 border border-dnd-red/40 rounded px-4 py-2 text-sm">
          {{ error }}
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full py-3 rounded border-2 border-dnd-gold bg-dnd-gold/20 text-dnd-gold font-serif font-bold tracking-widest uppercase hover:bg-dnd-gold/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? 'Creation...' : 'Creer le personnage' }}
        </button>
      </form>
    </div>
  </div>
</template>

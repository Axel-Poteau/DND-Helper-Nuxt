<script setup lang="ts">
const { oaths } = useSubclassData()

const props = defineProps<{
  playerLevel: number
  playerClass: string
  selectedSubclass: string
}>()

const usesLeft = ref(0)

const maxUses = computed(() => {
  const pClass = props.playerClass.toLowerCase()

  if (pClass === 'clerc') {
    if (props.playerLevel < 2) return 0
    if (props.playerLevel < 6) return 1
    if (props.playerLevel < 18) return 2
    return 3
  }

  if (pClass === 'paladin') {
    if (props.playerLevel < 3) return 0
    return 1
  }

  return 0
})

watch(maxUses, (val) => {
  usesLeft.value = val
}, { immediate: true })

const features = computed(() => {
  const result: { name: string; desc: string }[] = []
  const pClass = props.playerClass.toLowerCase()

  if (pClass === 'clerc') {
    if (props.playerLevel >= 2) {
      const isDestroy = props.playerLevel >= 5
      result.push({
        name: isDestroy ? 'Destruction des morts-vivants' : 'Renvoi des morts-vivants',
        desc: isDestroy
          ? 'Les morts-vivants (FP faible) sont instantanément détruits au lieu d\'être renvoyés.'
          : 'Action. 9m. JDS Sagesse. Les morts-vivants sont forcés de fuir pendant 1 minute.',
      })
    }

    if (props.playerLevel >= 2) {
      switch (props.selectedSubclass) {
        case 'duperie':
          result.push({ name: 'Invocation de réplique', desc: 'Illusion parfaite de vous (1 min). Lancez des sorts depuis sa position. Avantage aux attaques si vous êtes deux au contact.' })
          break
        case 'guerre':
          result.push({ name: 'Frappe guidée', desc: '+10 au toucher à l\'un de vos jets d\'attaque (après le jet, avant le résultat).' })
          break
        case 'lumiere':
          result.push({ name: 'Radiance de l\'aube', desc: 'Action. 9m. Dissipe ténèbres magiques. 2d10 + Niv dégâts radiants (JDS Con moitié).' })
          break
        case 'nature':
          result.push({ name: 'Charme animaux/plantes', desc: 'Action. 9m. JDS Sagesse. Charme les bêtes et plantes pour 1 min.' })
          break
        case 'savoir':
          result.push({ name: 'Savoir ancestral', desc: 'Action. Gagnez la maîtrise d\'une compétence ou d\'un outil pour 10 min.' })
          break
        case 'tempete':
          result.push({ name: 'Fureur destructrice', desc: 'Maximilisez les dégâts de foudre ou de tonnerre au lieu de lancer les dés.' })
          break
        case 'vie':
          result.push({ name: 'Préservation de la vie', desc: 'Action. Soignez (5 x Niv) PV répartis entre créatures à 9m (Max 50% des PV max).' })
          break
        case 'forge':
          result.push({ name: 'Bénédiction de l\'artisan', desc: 'Rituel 1h. Créez un objet non magique en métal (valeur max 100po).' })
          break
      }
    }

    if (props.playerLevel >= 6) {
      switch (props.selectedSubclass) {
        case 'duperie':
          result.push({ name: 'Linceul d\'ombre', desc: 'Action. Vous devenez invisible jusqu\'à la fin de votre prochain tour (ou attaque/sort).' })
          break
        case 'guerre':
          result.push({ name: 'Bénédiction de guerre', desc: 'Réaction. +10 au toucher pour une créature alliée à 9m.' })
          break
        case 'savoir':
          result.push({ name: 'Lecture des pensées', desc: 'Action. Lisez les pensées et lancez Suggestion sans slot.' })
          break
      }
    }
  }

  else if (pClass === 'paladin' && props.playerLevel >= 3) {
    const oathData = (oaths.value ?? {})[props.selectedSubclass]
    if (oathData && oathData.channelDivinity) {
      oathData.channelDivinity.forEach((feat) => {
        result.push({ name: feat.title, desc: feat.description })
      })
    }
  }

  return result
})

function toggleCharge(index: number) {
  const isAvailable = index < usesLeft.value
  if (isAvailable) {
    usesLeft.value--
  } else {
    usesLeft.value++
  }
}
</script>

<template>
  <div v-if="maxUses > 0 && features.length > 0" class="mt-6 border-t border-dnd-gold/20 pt-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-dnd-gold font-serif text-lg tracking-widest flex items-center gap-2">
        <span>⚡</span> CONDUIT DIVIN
      </h3>
      <div class="flex items-center gap-2">
        <span class="text-[10px] text-dnd-parchment/40 uppercase tracking-widest hidden sm:inline">Recharge :</span>
        <button
          class="text-[10px] uppercase tracking-wider text-dnd-gold-dim border border-dnd-gold/20 px-2 py-1 rounded hover:bg-dnd-gold/10 hover:text-dnd-gold transition-colors"
          @click="usesLeft = maxUses"
        >
          Repos Court / Long
        </button>
      </div>
    </div>

    <div class="bg-dnd-dark/40 p-4 rounded-lg border border-dnd-gold/10 flex flex-col items-center gap-4">
      <div class="flex gap-4">
        <button
          v-for="(_, i) in maxUses"
          :key="i"
          :class="[
            'w-12 h-12 rounded-full border-2 flex items-center justify-center text-2xl transition-all duration-300',
            i < usesLeft
              ? 'bg-dnd-gold/20 border-dnd-gold text-dnd-gold shadow-[0_0_15px_rgba(218,165,32,0.4)] scale-100 hover:scale-105'
              : 'bg-black/40 border-dnd-gold/20 text-dnd-gold/10 scale-95 grayscale',
          ]"
          :title="i < usesLeft ? 'Utiliser une charge' : 'Restaurer une charge'"
          @click="toggleCharge(i)"
        >
          ☀
        </button>
      </div>

      <div class="text-[10px] text-dnd-parchment/40 uppercase tracking-widest mb-2">
        {{ usesLeft }} / {{ maxUses }} Utilisations disponibles
      </div>

      <div class="w-full space-y-3 mt-2">
        <div
          v-for="(feat, idx) in features"
          :key="idx"
          class="text-left border-l-2 border-dnd-gold/30 pl-3 group hover:border-dnd-gold transition-colors"
        >
          <div class="text-dnd-gold font-bold text-sm uppercase tracking-wide group-hover:text-dnd-parchment transition-colors">
            {{ feat.name }}
          </div>
          <div class="text-dnd-parchment/70 text-xs italic leading-relaxed text-justify mt-1">
            {{ feat.desc }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

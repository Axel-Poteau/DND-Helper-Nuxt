<script setup lang="ts">
const props = defineProps<{
  playerLevel: number
  playerClass: string
}>()

const METAMAGIC_OPTIONS = [
  {
    name: 'Sort accéléré',
    cost: '2 pts',
    desc: 'Lorsque vous lancez un sort dont le temps d\'incantation est de 1 action, vous pouvez dépenser 2 points de sorcellerie pour le lancer en tant qu\'action bonus à la place. Idéal pour lancer un sort puissant tout en gardant votre action pour autre chose.',
  },
  {
    name: 'Sort ample',
    cost: '1 pt',
    desc: 'Lorsque vous lancez un sort dont la portée est de 1,50 mètre ou plus, dépensez 1 point pour doubler sa portée. Si le sort a une portée de contact, sa portée passe à 9 mètres. Parfait pour rester en sécurité tout en frappant à distance.',
  },
  {
    name: 'Sort étendu',
    cost: '1 pt',
    desc: 'Lorsque vous lancez un sort dont la durée est de 1 minute ou plus, dépensez 1 point pour doubler sa durée, jusqu\'à un maximum de 24 heures. Utile pour les buffs et sorts de concentration prolongés.',
  },
  {
    name: 'Sort intensifié',
    cost: '3 pts',
    desc: 'Lorsque vous lancez un sort qui impose un jet de sauvegarde, dépensez 3 points pour imposer le désavantage à une cible sur son premier JdS contre ce sort. Puissant pour garantir l\'effet de sorts à haute valeur comme Bannissement ou Immobilisation.',
  },
  {
    name: 'Sort jumeau',
    cost: 'Niv pts',
    desc: 'Lorsque vous lancez un sort qui ne cible qu\'une seule créature et n\'a pas une portée personnelle, dépensez un nombre de points égal au niveau du sort (1 pt pour un cantrip) pour cibler une seconde créature à portée. Le sort ne doit pas pouvoir cibler plus d\'une créature au niveau lancé. Ex : Hâte sur 2 alliés, Rayon de givre sur 2 ennemis.',
  },
  {
    name: 'Sort prévenant',
    cost: '1 pt',
    desc: 'Lorsque vous lancez un sort imposant un JdS aux créatures, dépensez 1 point pour protéger un nombre de créatures égal à votre mod. de Charisme (min 1). Ces créatures réussissent automatiquement leur sauvegarde et ne subissent aucun dégât du sort. Idéal pour les sorts de zone (Boule de feu) quand vos alliés sont au contact.',
  },
  {
    name: 'Sort renforcé',
    cost: '1 pt',
    desc: 'Lorsque vous lancez les dégâts d\'un sort, dépensez 1 point pour relancer un nombre de dés de dégâts ne dépassant pas votre mod. de Charisme (min 1). Vous devez garder les nouveaux résultats. Exception : cette option est cumulable avec une autre métamagie sur le même sort.',
  },
  {
    name: 'Sort subtil',
    cost: '1 pt',
    desc: 'Lorsque vous lancez un sort, dépensez 1 point pour le lancer sans aucune composante verbale ni somatique. Le sort est indétectable par les observateurs. Essentiel pour lancer des sorts en situation sociale, en furtivité, ou quand vous êtes bâillonné/entravé.',
  },
]

const isSorcerer = computed(() => props.playerClass.toLowerCase() === 'ensorceleur')
const metamagicKnown = computed(() => props.playerLevel < 10 ? 2 : props.playerLevel < 17 ? 3 : 4)
</script>

<template>
  <div v-if="isSorcerer && playerLevel >= 3">
    <h3 class="text-dnd-gold font-serif text-lg tracking-widest flex items-center gap-2 mb-4">
      <span>✨</span> MÉTAMAGIE
    </h3>

    <div class="bg-dnd-dark/40 p-4 rounded-lg border border-dnd-gold/10">
      <p class="text-[10px] text-dnd-parchment/50 italic text-center mb-4">
        {{ metamagicKnown }} options connues au choix • 1 seule par sort (sauf Sort renforcé)
      </p>
      <div class="space-y-3">
        <div
          v-for="(meta, idx) in METAMAGIC_OPTIONS"
          :key="idx"
          class="text-left border-l-2 border-dnd-gold/20 pl-3 group hover:border-dnd-gold transition-colors"
        >
          <div class="flex items-center justify-between gap-2">
            <span class="text-dnd-gold font-bold text-xs uppercase tracking-wide group-hover:text-dnd-parchment transition-colors">
              {{ meta.name }}
            </span>
            <span class="text-[9px] font-mono text-dnd-gold-dim bg-black/30 px-1.5 py-0.5 rounded border border-dnd-gold/10 whitespace-nowrap flex-shrink-0">
              {{ meta.cost }}
            </span>
          </div>
          <div class="text-dnd-parchment/60 text-[11px] italic leading-relaxed text-justify mt-1">
            {{ meta.desc }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

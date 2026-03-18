<script setup lang="ts">
import type { Spell, DomainData, OathData, OriginData, TraditionData, CharacterSessionState } from '~/types'
import { getSlotsForClass } from '~/utils/spellProgression'

const route = useRoute()
const { domains, oaths, origins, traditions } = useSubclassData()
const { characters, activeCharacter, fetchCharacters, saveCharacterState } = useCharacters()

// --- CHARACTER LOADING ---
const characterId = computed(() => route.query.character as string | undefined)
const readonly = computed(() => route.query.readonly === 'true')
const characterLoaded = ref(false)

const SPELLS_KNOWN_BY_CLASS: Record<string, number[]> = {
  barde:       [4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22],
  ensorceleur: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15],
  occultiste:  [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15],
}

// --- STATE ---
const playerLevel = ref(1)
const selectedClass = ref('clerc')
const preparedSpells = ref<Spell[]>([])
const abilityMod = ref(3)
const searchQuery = ref('')
const selectedSubclass = ref('vie')
const currentSlots = ref<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0])
const sorceryPoints = ref<number | null>(null)
const channelDivinityUses = ref<number | null>(null)

const spellsList = ref<Spell[]>([])
const allSpells = ref<Spell[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const pendingSpellIds = ref<string[]>([])

const hoveredSpell = ref<Spell | null>(null)
const tooltipPos = ref<{ x: number; y: number } | null>(null)
const tooltipSide = ref<'left' | 'right'>('right')
const modalSpell = ref<Spell | null>(null)
const libScrollRef = ref<HTMLDivElement | null>(null)
let hideTimeout: ReturnType<typeof setTimeout> | null = null

// --- LOAD CHARACTER ON MOUNT ---
onMounted(async () => {
  if (!characterId.value) {
    navigateTo('/dashboard')
    return
  }

  let char
  if (readonly.value) {
    // Load shared character via RPC
    const supabase = useSupabaseClient() as any
    const { data, error: err } = await supabase.rpc('get_shared_character', { p_character_id: characterId.value })
    if (err || !data) {
      navigateTo('/dashboard')
      return
    }
    char = {
      ...data,
      prepared_spell_ids: Array.isArray(data.prepared_spell_ids) ? data.prepared_spell_ids : JSON.parse(data.prepared_spell_ids || '[]'),
      current_slots: Array.isArray(data.current_slots) ? data.current_slots : JSON.parse(data.current_slots || '[]'),
    }
  } else {
    await fetchCharacters()
    char = characters.value.find(c => c.id === characterId.value)
    if (!char) {
      navigateTo('/dashboard')
      return
    }
  }

  activeCharacter.value = char
  playerLevel.value = char.level
  selectedClass.value = char.class
  abilityMod.value = char.ability_mod
  selectedSubclass.value = char.subclass
  currentSlots.value = [...char.current_slots]
  sorceryPoints.value = char.sorcery_points
  channelDivinityUses.value = char.channel_divinity_uses
  pendingSpellIds.value = [...char.prepared_spell_ids]

  // Fetch spells for this class
  await fetchSpells()
  await fetchAllSpells()

  // Resolve spell IDs once data is available
  resolveSpellIds()

  characterLoaded.value = true
})

// --- SPELL FETCHING ---
async function fetchSpells() {
  isLoading.value = true
  error.value = null
  spellsList.value = []

  try {
    const data = await $fetch<Spell[]>(`/api/spells`, {
      params: { class: selectedClass.value },
    })
    spellsList.value = data
  } catch (err) {
    console.error(err)
    error.value = 'La connexion avec la trame magique est perturbee...'
  } finally {
    isLoading.value = false
  }
}

async function fetchAllSpells() {
  try {
    const data = await $fetch<Spell[]>(`/api/spells`)
    allSpells.value = data
  } catch (err) {
    console.error('Erreur chargement sorts global:', err)
  }
}

function resolveSpellIds() {
  if (pendingSpellIds.value.length === 0) return
  const all = [...allSpells.value, ...spellsList.value]
  const unique = new Map(all.map(s => [s.id, s]))
  preparedSpells.value = pendingSpellIds.value
    .map(id => unique.get(id))
    .filter((s): s is Spell => !!s)
  pendingSpellIds.value = []
}

// --- AUTO-SAVE (debounced) ---
let saveTimeout: ReturnType<typeof setTimeout> | null = null

const sessionState = computed<CharacterSessionState>(() => ({
  level: playerLevel.value,
  subclass: selectedSubclass.value,
  ability_mod: abilityMod.value,
  prepared_spell_ids: preparedSpells.value.map(s => s.id),
  current_slots: [...currentSlots.value],
  sorcery_points: sorceryPoints.value,
  channel_divinity_uses: channelDivinityUses.value,
}))

watch(sessionState, (newState) => {
  if (!activeCharacter.value || !characterLoaded.value || readonly.value) return
  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    saveCharacterState(activeCharacter.value!.id, newState)
  }, 1500)
}, { deep: true })

onBeforeUnmount(() => {
  if (saveTimeout) clearTimeout(saveTimeout)
  if (activeCharacter.value && characterLoaded.value && !readonly.value) {
    saveCharacterState(activeCharacter.value.id, sessionState.value)
  }
})

// --- LOGIQUE METIER ---
const slotsConfig = computed(() => getSlotsForClass(selectedClass.value, playerLevel.value))
const availableLevels = computed(() => Object.keys(slotsConfig.value).map(Number))
const maxSpellLevel = computed(() => availableLevels.value.length > 0 ? Math.max(...availableLevels.value) : 0)

const subClassDataList = computed<(DomainData | OathData | OriginData | TraditionData)[]>(() => {
  if (selectedClass.value === 'clerc') return Object.values(domains.value ?? {})
  if (selectedClass.value === 'paladin') return Object.values(oaths.value ?? {})
  if (selectedClass.value === 'ensorceleur') return Object.values(origins.value ?? {})
  if (selectedClass.value === 'magicien') return Object.values(traditions.value ?? {})
  return []
})

const subclassLabel = computed(() => {
  if (selectedClass.value === 'clerc') return 'Domaine Divin'
  if (selectedClass.value === 'paladin') return 'Serment Sacre'
  if (selectedClass.value === 'ensorceleur') return 'Origine Magique'
  if (selectedClass.value === 'magicien') return 'Tradition Arcane'
  return ''
})

const subclassDesc = computed(() => {
  if (selectedClass.value === 'clerc') return (domains.value ?? {})[selectedSubclass.value]?.description || ''
  if (selectedClass.value === 'paladin') return (oaths.value ?? {})[selectedSubclass.value]?.description || ''
  if (selectedClass.value === 'ensorceleur') return (origins.value ?? {})[selectedSubclass.value]?.description || ''
  if (selectedClass.value === 'magicien') return (traditions.value ?? {})[selectedSubclass.value]?.description || ''
  return ''
})

const subclassSpellsList = computed(() => {
  let spells: Spell[] = []
  let currentData: DomainData | OathData | undefined

  if (selectedClass.value === 'clerc') currentData = (domains.value ?? {})[selectedSubclass.value]
  else if (selectedClass.value === 'paladin') currentData = (oaths.value ?? {})[selectedSubclass.value]

  if (currentData) {
    Object.entries(currentData.spells).forEach(([levelReq, ids]) => {
      if (playerLevel.value >= Number(levelReq)) {
        const found = allSpells.value.filter(s => ids.includes(s.id))
        spells.push(...found)
      }
    })
  }

  return Array.from(new Map(spells.map(s => [s.id, s])).values())
})

const subclassFeatures = computed(() => {
  if (selectedClass.value === 'ensorceleur') return (origins.value ?? {})[selectedSubclass.value]?.features || []
  if (selectedClass.value === 'magicien') return (traditions.value ?? {})[selectedSubclass.value]?.features || []
  return []
})

const subclassFeaturesTitle = computed(() => {
  if (selectedClass.value === 'ensorceleur') return 'ORIGINE MAGIQUE'
  if (selectedClass.value === 'magicien') return 'TRADITION ARCANE'
  return ''
})

const subclassFeaturesIcon = computed(() => {
  if (selectedClass.value === 'ensorceleur') return '🔮'
  if (selectedClass.value === 'magicien') return '📖'
  return ''
})

const isKnownCaster = computed(() => ['barde', 'ensorceleur', 'occultiste'].includes(selectedClass.value.toLowerCase()))

const maxPreparedSpells = computed(() => {
  const c = selectedClass.value.toLowerCase()
  if (isKnownCaster.value) {
    const table = SPELLS_KNOWN_BY_CLASS[c]
    return table ? table[playerLevel.value - 1] : 0
  } else if (c === 'paladin') {
    const val = Math.floor(playerLevel.value / 2) + abilityMod.value
    return val < 1 ? 1 : val
  } else {
    return playerLevel.value + abilityMod.value
  }
})

const currentLeveledCount = computed(() => preparedSpells.value.filter(s => s.level > 0).length)
const isFull = computed(() => !isKnownCaster.value && currentLeveledCount.value >= maxPreparedSpells.value)

function isSlotDepleted(spellLevel: number): boolean {
  if (spellLevel === 0) return false
  for (let lvl = spellLevel; lvl <= 9; lvl++) {
    if (currentSlots.value[lvl - 1] > 0) return false
  }
  return (slotsConfig.value[spellLevel] || 0) > 0
}

const availableSpells = computed(() => {
  return spellsList.value
    .filter(s => {
      const isLevelOk = s.level === 0 || s.level <= maxSpellLevel.value
      const isNotPrepared = !preparedSpells.value.find(p => p.id === s.id)
      const isNotSubclass = !subclassSpellsList.value.find(d => d.id === s.id)
      const isNameMatch = s.nameFr.toLowerCase().includes(searchQuery.value.toLowerCase())
      return isLevelOk && isNotPrepared && isNotSubclass && isNameMatch
    })
    .sort((a, b) => a.level - b.level || a.nameFr.localeCompare(b.nameFr))
})

const myCantrips = computed(() =>
  preparedSpells.value.filter(s => s.level === 0).sort((a, b) => a.nameFr.localeCompare(b.nameFr))
)

const myLeveledSpells = computed(() =>
  preparedSpells.value.filter(s => s.level > 0).sort((a, b) => a.level - b.level || a.nameFr.localeCompare(b.nameFr))
)

// --- ACTIONS ---
function addSpell(s: Spell) {
  if (readonly.value) return
  if (s.level > 0 && isFull.value) return
  preparedSpells.value = [...preparedSpells.value, s]
}

function removeSpell(id: string) {
  if (readonly.value) return
  preparedSpells.value = preparedSpells.value.filter(s => s.id !== id)
}

function clearHideTimeout() {
  if (hideTimeout) { clearTimeout(hideTimeout); hideTimeout = null }
}

function handleSpellEnter(e: MouseEvent, spell: Spell, side: 'left' | 'right') {
  clearHideTimeout()
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  tooltipPos.value = { x: side === 'right' ? rect.right : rect.left, y: rect.top }
  tooltipSide.value = side
  hoveredSpell.value = spell
}

function handleSpellLeave() {
  hideTimeout = setTimeout(() => { hoveredSpell.value = null; tooltipPos.value = null }, 150)
}

function handleTooltipEnter() { clearHideTimeout() }
function handleTooltipLeave() { handleSpellLeave() }

function spellLevelHeaders(spells: Spell[]) {
  return [...new Set(spells.map(s => s.level))].sort((a, b) => a - b)
}

function scrollToLevel(lvl: number) {
  const el = document.getElementById(`lib-level-${lvl}`)
  const container = libScrollRef.value
  if (el && container) container.scrollTo({ top: el.offsetTop - container.offsetTop, behavior: 'smooth' })
}

function getPrevLevel(index: number): number {
  return index > 0 ? availableSpells.value[index - 1].level : -1
}
</script>

<template>
  <div class="min-h-screen font-sans text-dnd-parchment flex flex-col">
    <Navbar
      :character-name="activeCharacter?.name"
      :character-class="selectedClass"
      :character-avatar="activeCharacter?.avatar"
    />

    <!-- Loading state -->
    <div v-if="!characterLoaded" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="w-10 h-10 border-4 border-dnd-gold/30 border-t-dnd-gold rounded-full animate-spin mx-auto mb-4" />
        <p class="text-dnd-gold font-serif tracking-widest uppercase text-sm">Chargement du grimoire...</p>
      </div>
    </div>

    <main v-else class="relative w-full overflow-x-hidden pt-24 pb-12 px-2 md:px-6 flex-1">
      <div class="max-w-[1600px] mx-auto">
        <!-- HEADER -->
        <div class="backdrop-blur-sm bg-dnd-leather/30 border-y-4 border-double border-dnd-gold/40 rounded-xl p-6 relative mb-8">
          <header class="text-center relative">
            <h1 class="text-4xl md:text-5xl font-serif font-bold text-dnd-gold tracking-widest uppercase">
              Grimoire <span class="text-dnd-red">Arcanique</span>
            </h1>
            <div class="mt-2 text-dnd-parchment/60 font-serif text-lg uppercase tracking-widest">
              — {{ activeCharacter?.name }} &bull; {{ selectedClass }} &bull; Niv {{ playerLevel }} —
            </div>
            <div v-if="readonly" class="mt-3 inline-block bg-dnd-gold/20 border border-dnd-gold/40 text-dnd-gold font-serif text-xs uppercase tracking-widest px-4 py-1.5 rounded-full">
              Lecture seule
            </div>
          </header>

          <div v-if="!readonly" class="mt-6 flex flex-col items-center gap-4">
            <LevelSelector :current-level="playerLevel" @level-change="playerLevel = $event" />

            <!-- SELECTEUR SOUS-CLASSE -->
            <div
              v-if="selectedClass === 'clerc' || selectedClass === 'paladin' || selectedClass === 'ensorceleur' || selectedClass === 'magicien'"
              class="flex flex-col items-center gap-2 animate-fadeIn mt-2"
            >
              <label class="text-dnd-gold-dim text-[10px] uppercase tracking-[0.2em]">
                {{ subclassLabel }}
              </label>

              <div class="relative group min-w-[250px]">
                <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-dnd-gold/70 group-hover:text-dnd-gold transition-colors text-xs">▼</div>
                <select
                  v-model="selectedSubclass"
                  style="color-scheme: dark"
                  class="appearance-none w-full bg-black/60 border border-dnd-gold/30 text-dnd-gold font-serif text-lg py-2 pl-4 pr-10 rounded shadow-inner focus:outline-none focus:border-dnd-gold focus:ring-1 focus:ring-dnd-gold/50 cursor-pointer hover:bg-dnd-gold/5 transition-all text-center"
                >
                  <option
                    v-for="item in subClassDataList"
                    :key="item.id"
                    :value="item.id"
                    class="bg-[#1a1510] text-dnd-parchment py-2"
                  >
                    {{ item.label }}
                  </option>
                </select>
              </div>
              <p class="text-[11px] text-dnd-gold-dim/60 italic max-w-md text-center leading-tight mt-1 min-h-[1.5em]">
                {{ subclassDesc }}
              </p>
            </div>

            <div
              v-if="!isKnownCaster"
              class="flex items-center gap-3 text-dnd-parchment font-serif bg-black/40 px-4 py-2 rounded-full border border-dnd-gold/20 mt-2"
            >
              <span class="text-dnd-gold-dim text-xs uppercase tracking-wider mr-2">Mod. Caracteristique</span>
              <button
                class="w-6 h-6 flex items-center justify-center hover:text-dnd-gold hover:bg-white/10 rounded"
                @click="abilityMod = Math.max(0, abilityMod - 1)"
              >-</button>
              <span class="w-6 text-center font-bold text-dnd-gold text-lg">+{{ abilityMod }}</span>
              <button
                class="w-6 h-6 flex items-center justify-center hover:text-dnd-gold hover:bg-white/10 rounded"
                @click="abilityMod = Math.min(10, abilityMod + 1)"
              >+</button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- 1. GAUCHE : MON GRIMOIRE -->
          <div :class="[
            'flex flex-col backdrop-blur-md bg-dnd-parchment/5 border-2 border-dnd-gold/30 rounded-xl overflow-hidden relative sticky top-28 z-30 lg:max-h-[calc(100vh-140px)]',
            readonly ? 'lg:col-span-4 order-2 lg:order-1' : 'lg:col-span-3 order-2 lg:order-1'
          ]">
            <div class="bg-dnd-leather/80 p-3 border-b border-dnd-gold/40 sticky top-0 z-10 text-center">
              <h3 class="text-dnd-gold font-serif font-bold">Mon Grimoire</h3>
            </div>

            <div class="flex-1 overflow-y-auto overflow-x-hidden p-2 custom-scrollbar space-y-4">
              <!-- Sorts de sous-classe -->
              <div v-if="subclassSpellsList.length > 0">
                <h4 class="text-xs font-bold text-dnd-gold bg-dnd-gold/5 border border-dnd-gold/20 py-1 px-2 rounded uppercase tracking-widest mb-2 flex justify-between items-center">
                  <span>✦ {{ selectedClass === 'paladin' ? 'Serment' : 'Domaine' }}</span>
                  <span class="text-[10px] opacity-70 italic">Toujours Prets</span>
                </h4>
                <div class="space-y-1 mb-4">
                  <div
                    v-for="spell in subclassSpellsList"
                    :key="spell.id"
                    :class="isSlotDepleted(spell.level) ? 'opacity-40 grayscale relative' : ''"
                  >
                    <span v-if="isSlotDepleted(spell.level)" class="absolute right-10 top-1/2 -translate-y-1/2 text-[10px] text-dnd-red/70 z-10">🔒</span>
                    <SpellItem
                      :spell="spell"
                      action-icon="✦"
                      @action="() => {}"
                      @spell-enter="(e, s) => handleSpellEnter(e, s, 'right')"
                      @spell-leave="handleSpellLeave"
                      @eye-click="modalSpell = $event"
                    />
                  </div>
                </div>
                <div class="border-b border-dnd-gold/10 mx-4 mb-2" />
              </div>

              <!-- Cantrips -->
              <div v-if="myCantrips.length > 0">
                <h4 class="text-xs font-bold text-dnd-gold-dim uppercase tracking-widest mb-2 px-2 flex justify-between items-center">
                  <span>Cantrips</span>
                  <span class="bg-dnd-gold/10 px-1.5 rounded">{{ myCantrips.length }}</span>
                </h4>
                <div class="space-y-1">
                  <SpellItem
                    v-for="spell in myCantrips"
                    :key="spell.id"
                    :spell="spell"
                    :action-icon="readonly ? '' : '✕'"
                    @action="!readonly && removeSpell(spell.id)"
                    @spell-enter="(e, s) => handleSpellEnter(e, s, 'right')"
                    @spell-leave="handleSpellLeave"
                    @eye-click="modalSpell = $event"
                  />
                </div>
              </div>

              <!-- Sorts prepares -->
              <div>
                <h4
                  :class="[
                    'text-xs font-bold py-1 rounded uppercase tracking-widest mb-2 px-2 border flex justify-between items-center shadow-sm transition-colors',
                    isFull ? 'text-dnd-parchment bg-dnd-red/40 border-dnd-red/60' : 'text-dnd-parchment bg-dnd-red/20 border-dnd-red/30',
                  ]"
                >
                  <span>{{ isKnownCaster ? 'Sorts Connus' : 'Prepares' }}</span>
                  <span
                    v-if="!isKnownCaster"
                    :class="['px-1.5 rounded text-white', isFull ? 'bg-dnd-red' : 'bg-dnd-red/40']"
                  >
                    {{ currentLeveledCount }} / {{ maxPreparedSpells }}
                  </span>
                </h4>
                <div v-if="myLeveledSpells.length === 0" class="text-center opacity-30 text-xs italic">Aucun...</div>
                <div class="space-y-1">
                  <div
                    v-for="spell in myLeveledSpells"
                    :key="spell.id"
                    :class="isSlotDepleted(spell.level) ? 'opacity-40 grayscale relative' : ''"
                  >
                    <span v-if="isSlotDepleted(spell.level)" class="absolute right-10 top-1/2 -translate-y-1/2 text-[10px] text-dnd-red/70 z-10">🔒</span>
                    <SpellItem
                      :spell="spell"
                      action-icon="✕"
                      @action="removeSpell(spell.id)"
                      @spell-enter="(e, s) => handleSpellEnter(e, s, 'right')"
                      @spell-leave="handleSpellLeave"
                      @eye-click="modalSpell = $event"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. CENTRE : RESSOURCES -->
          <div :class="[readonly ? 'lg:col-span-8' : 'lg:col-span-6', 'order-1 lg:order-2 flex flex-col']">
            <div class="h-full backdrop-blur-sm bg-black/20 border border-dnd-gold/10 rounded-xl p-4 md:p-8 flex flex-col">
              <h3 class="text-center font-serif text-dnd-gold text-2xl mb-6 tracking-widest flex-shrink-0">
                RESSOURCES
              </h3>
              <div class="flex-1">
                <SpellSlotsGrid :player-level="playerLevel" :player-class="selectedClass" v-model:current-slots="currentSlots" />

                <ChannelDivinity
                  :player-level="playerLevel"
                  :player-class="selectedClass"
                  :selected-subclass="selectedSubclass"
                  v-model:channel-divinity-uses="channelDivinityUses"
                />

                <div
                  v-if="selectedClass === 'ensorceleur' && playerLevel >= 2"
                  class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6 border-t border-dnd-gold/20 pt-6"
                >
                  <div>
                    <SorceryPoints
                      :player-level="playerLevel"
                      :player-class="selectedClass"
                      v-model:sorcery-points="sorceryPoints"
                    />
                    <SubclassFeatures
                      v-if="subclassFeatures.length > 0"
                      :player-level="playerLevel"
                      :features="subclassFeatures"
                      :title="subclassFeaturesTitle"
                      :icon="subclassFeaturesIcon"
                      custom-class="mt-4"
                    />
                  </div>
                  <div>
                    <Metamagic :player-level="playerLevel" :player-class="selectedClass" />
                  </div>
                </div>

                <SubclassFeatures
                  v-if="selectedClass === 'magicien' && subclassFeatures.length > 0"
                  :player-level="playerLevel"
                  :features="subclassFeatures"
                  :title="subclassFeaturesTitle"
                  :icon="subclassFeaturesIcon"
                />
              </div>
            </div>
          </div>

          <!-- 3. DROITE : BIBLIOTHEQUE API -->
          <div v-if="!readonly" class="lg:col-span-3 flex flex-col backdrop-blur-md bg-dnd-dark/40 border-2 border-dnd-gold/20 rounded-xl overflow-hidden relative order-3 sticky top-28 z-30 lg:max-h-[calc(100vh-140px)]">
            <div class="bg-dnd-dark/90 border-b border-dnd-gold/20 sticky top-0 z-10">
              <div class="flex items-center gap-3 px-3 pt-2 pb-1">
                <h3 class="text-dnd-gold-dim font-serif font-bold hidden xl:block">📚</h3>
                <div class="relative flex-1">
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Rechercher..."
                    class="w-full bg-black/40 border border-dnd-gold/30 rounded px-2 py-1 text-sm text-dnd-parchment focus:outline-none focus:border-dnd-gold/80 placeholder:text-dnd-parchment/20 transition-colors"
                  />
                  <button
                    v-if="searchQuery"
                    class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-dnd-gold-dim hover:text-white"
                    @click="searchQuery = ''"
                  >✕</button>
                </div>
              </div>
              <div v-if="availableSpells.length > 0" class="flex flex-wrap gap-1 px-3 pb-2 pt-1">
                <button
                  v-for="lvl in spellLevelHeaders(availableSpells)"
                  :key="lvl"
                  class="text-[9px] font-bold uppercase tracking-wider text-dnd-gold-dim hover:text-dnd-gold bg-black/30 hover:bg-dnd-gold/10 border border-dnd-gold/15 hover:border-dnd-gold/40 px-2 py-0.5 rounded transition-all cursor-pointer"
                  @click="scrollToLevel(lvl)"
                >
                  {{ lvl === 0 ? 'C' : `N${lvl}` }}
                </button>
              </div>
            </div>

            <div ref="libScrollRef" class="flex-1 overflow-y-auto overflow-x-hidden p-2 custom-scrollbar space-y-1">
              <div v-if="isLoading" class="flex flex-col items-center justify-center mt-20 opacity-70">
                <div class="w-8 h-8 border-4 border-dnd-gold/30 border-t-dnd-gold rounded-full animate-spin mb-4" />
                <p class="text-xs text-dnd-gold tracking-widest uppercase">Incantation...</p>
              </div>

              <div v-else-if="error" class="text-center mt-20 px-4">
                <p class="text-dnd-red font-bold mb-2">Erreur</p>
                <p class="text-xs opacity-60 italic">{{ error }}</p>
              </div>

              <div v-else-if="availableSpells.length === 0" class="text-center opacity-30 mt-10 italic text-sm">
                {{ searchQuery ? 'Aucun sort trouve...' : 'Aucun sort disponible.' }}
              </div>

              <template v-else>
                <div v-for="(spell, i) in availableSpells" :key="spell.id">
                  <div
                    v-if="spell.level !== getPrevLevel(i)"
                    :id="`lib-level-${spell.level}`"
                    class="text-[10px] font-bold uppercase tracking-widest text-dnd-gold-dim border-b border-dnd-gold/15 px-2 py-1.5 mt-2"
                  >
                    {{ spell.level === 0 ? 'Cantrips' : `Niveau ${spell.level}` }}
                  </div>

                  <div :class="spell.level > 0 && isFull ? 'opacity-50 grayscale' : ''">
                    <SpellItem
                      :spell="spell"
                      :action-icon="spell.level > 0 && isFull ? '🔒' : '+'"
                      @action="!(spell.level > 0 && isFull) && addSpell(spell)"
                      @spell-enter="(e, s) => handleSpellEnter(e, s, 'left')"
                      @spell-leave="handleSpellLeave"
                      @eye-click="modalSpell = $event"
                    />
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>

        <div class="hidden lg:block">
          <FloatingTooltip
            :spell="hoveredSpell"
            :position="tooltipPos"
            :side="tooltipSide"
            @mouseenter="handleTooltipEnter"
            @mouseleave="handleTooltipLeave"
          />
        </div>

        <SpellModal :spell="modalSpell" @close="modalSpell = null" />
      </div>
    </main>

    <AppFooter />
  </div>
</template>

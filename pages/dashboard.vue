<script setup lang="ts">
import type { CharacterCreate } from '~/types'

const { characters, isLoading, error, fetchCharacters, createCharacter, deleteCharacter } = useCharacters()
const { isPremium, username } = useProfile()
const {
  ownedTables, joinedTables,
  error: tableError,
  fetchOwnedTables, fetchJoinedTables,
  createTable, deleteTable, leaveTable, joinTable,
} = useGameTables()

const showCreateModal = ref(false)
const showCreateTableModal = ref(false)
const showJoinTableModal = ref(false)

const maxCharacters = computed(() => isPremium.value ? 10 : 4)
const canCreateMore = computed(() => characters.value.length < maxCharacters.value)

// Create table
const newTableName = ref('')
const createTableCharacterId = ref('')
const createTableLoading = ref(false)

async function handleCreateTable() {
  if (!newTableName.value.trim()) return
  createTableLoading.value = true
  const table = await createTable(newTableName.value.trim(), createTableCharacterId.value || undefined)
  createTableLoading.value = false
  if (table) {
    newTableName.value = ''
    createTableCharacterId.value = ''
    showCreateTableModal.value = false
    navigateTo(`/table/${table.code}`)
  }
}

// Join table
const joinCode = ref('')
const joinCharacterId = ref('')
const joinLoading = ref(false)
const joinError = ref<string | null>(null)

async function handleJoinTable() {
  if (!joinCode.value.trim() || !joinCharacterId.value) {
    joinError.value = 'Renseignez le code et choisissez un personnage.'
    return
  }
  joinError.value = null
  joinLoading.value = true
  const ok = await joinTable(joinCode.value.trim(), joinCharacterId.value)
  joinLoading.value = false
  if (ok) {
    const normalizedCode = joinCode.value.trim().toUpperCase()
    joinCode.value = ''
    joinCharacterId.value = ''
    showJoinTableModal.value = false
    navigateTo(`/table/${normalizedCode}`)
  } else {
    joinError.value = tableError.value
  }
}

// Delete table (with confirm)
const confirmDeleteTableId = ref<string | null>(null)
function handleDeleteTable(id: string) {
  if (confirmDeleteTableId.value !== id) {
    confirmDeleteTableId.value = id
    setTimeout(() => { confirmDeleteTableId.value = null }, 3000)
    return
  }
  deleteTable(id)
  confirmDeleteTableId.value = null
}

if (import.meta.client) {
  fetchCharacters()
  fetchOwnedTables()
  fetchJoinedTables()
}

async function handleCreate(input: CharacterCreate) {
  const char = await createCharacter(input)
  showCreateModal.value = false
  if (char) {
    navigateTo({ path: '/grimoire', query: { character: char.id } })
  }
}

async function handleDelete(id: string) {
  await deleteCharacter(id)
}

function openGrimoire(characterId: string) {
  navigateTo({ path: '/grimoire', query: { character: characterId } })
}

const supabase = useSupabaseClient()
async function handleLogout() {
  await supabase.auth.signOut()
  navigateTo('/')
}
</script>

<template>
  <div class="min-h-screen font-sans text-dnd-parchment flex flex-col">
    <!-- Navbar -->
    <nav class="fixed top-0 left-0 w-full z-50 bg-dnd-dark/95 backdrop-blur-md border-b border-dnd-gold/30 shadow-lg">
      <div class="w-full max-w-6xl mx-auto px-4">
        <div class="flex items-center justify-between h-16 md:h-20">
          <NuxtLink
            to="/dashboard"
            class="font-serif text-dnd-gold font-bold text-xl tracking-widest border border-dnd-gold/50 px-2 py-1 rounded select-none hover:bg-dnd-gold/10 transition-colors"
          >
            D&amp;D
          </NuxtLink>

          <div class="flex items-center gap-4">
            <NuxtLink
              to="/abonnement"
              class="text-dnd-gold-dim hover:text-dnd-gold font-serif text-xs uppercase tracking-wider transition-colors"
            >
              {{ isPremium ? '⭐ Premium' : 'Mon abonnement' }}
            </NuxtLink>
            <span
              v-if="username"
              class="hidden md:block text-dnd-parchment/50 font-serif text-xs uppercase tracking-wider max-w-[120px] truncate"
            >
              {{ username }}
            </span>
            <button
              class="px-3 py-1.5 border border-dnd-gold/20 text-dnd-gold-dim hover:text-dnd-red hover:border-dnd-red/40 hover:bg-dnd-red/10 rounded font-serif text-xs uppercase tracking-wider transition-all"
              @click="handleLogout"
            >
              Se deconnecter
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="flex-1 pt-28 pb-12 px-4 md:px-8">
      <div class="max-w-4xl mx-auto">
        <!-- ==================== PERSONNAGES ==================== -->
        <header class="text-center mb-10">
          <h1 class="text-4xl md:text-5xl font-serif font-bold text-dnd-gold tracking-widest uppercase">
            Mes <span class="text-dnd-red">Personnages</span>
          </h1>
          <p class="mt-2 text-dnd-parchment/60 font-serif text-lg">
            {{ characters.length }} / {{ maxCharacters }} personnages
            <span v-if="!isPremium" class="text-dnd-gold-dim/50 text-sm ml-1">(gratuit)</span>
            <span v-else class="text-dnd-gold text-sm ml-1">⭐ Premium</span>
          </p>
        </header>

        <!-- Loading -->
        <div v-if="isLoading" class="flex justify-center py-20">
          <div class="w-8 h-8 border-4 border-dnd-gold/30 border-t-dnd-gold rounded-full animate-spin" />
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-center py-10">
          <p class="text-dnd-red font-bold mb-2">Erreur</p>
          <p class="text-xs opacity-60 italic">{{ error }}</p>
        </div>

        <!-- Character grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <CharacterCard
            v-for="char in characters"
            :key="char.id"
            :character="char"
            @select="openGrimoire(char.id)"
            @delete="handleDelete(char.id)"
          />

          <!-- Create new card -->
          <button
            v-if="canCreateMore"
            class="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-dnd-gold/20 bg-dnd-dark/20 hover:border-dnd-gold/50 hover:bg-dnd-leather/20 transition-all duration-200 cursor-pointer min-h-[200px] group"
            @click="showCreateModal = true"
          >
            <div class="w-16 h-16 rounded-full bg-dnd-dark/40 border-2 border-dnd-gold/20 flex items-center justify-center text-3xl text-dnd-gold/30 group-hover:text-dnd-gold group-hover:border-dnd-gold/50 transition-all">
              +
            </div>
            <span class="font-serif text-dnd-gold-dim text-sm uppercase tracking-wider group-hover:text-dnd-gold transition-colors">
              Nouveau personnage
            </span>
          </button>

          <!-- Locked slots -->
          <div
            v-if="!canCreateMore && !isPremium"
            class="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-dnd-gold/10 bg-dnd-dark/10 min-h-[200px] opacity-50"
          >
            <div class="text-3xl">🔒</div>
            <NuxtLink to="/abonnement" class="font-serif text-dnd-gold-dim text-xs uppercase tracking-wider hover:text-dnd-gold transition-colors underline underline-offset-2">
              Passer Premium
            </NuxtLink>
          </div>
        </div>

        <!-- ==================== TABLES DE JEU ==================== -->
        <section class="mt-20">
          <header class="text-center mb-8">
            <h2 class="text-3xl md:text-4xl font-serif font-bold text-dnd-gold tracking-widest uppercase">
              Tables de <span class="text-dnd-red">Jeu</span>
            </h2>
            <p class="mt-2 text-dnd-parchment/60 font-serif">
              Creez ou rejoignez une table pour jouer ensemble.
            </p>
          </header>

          <!-- Action buttons -->
          <div class="flex flex-wrap items-center justify-center gap-4 mb-8">
            <!-- Create table (premium only) -->
            <button
              v-if="isPremium"
              class="px-5 py-2.5 border-2 border-dnd-gold bg-dnd-gold/20 text-dnd-gold font-serif font-bold tracking-widest uppercase rounded-lg hover:bg-dnd-gold/30 transition-all text-sm"
              @click="showCreateTableModal = true"
            >
              + Creer une table
            </button>
            <NuxtLink
              v-else
              to="/abonnement"
              class="px-5 py-2.5 border-2 border-dnd-gold/20 bg-dnd-dark/20 text-dnd-gold-dim font-serif tracking-widest uppercase rounded-lg hover:border-dnd-gold/40 transition-all text-sm flex items-center gap-2"
            >
              🔒 Creer une table (Premium)
            </NuxtLink>

            <!-- Join table -->
            <button
              class="px-5 py-2.5 border-2 border-dnd-gold/40 bg-dnd-leather/20 text-dnd-gold font-serif font-bold tracking-widest uppercase rounded-lg hover:bg-dnd-leather/40 hover:border-dnd-gold/60 transition-all text-sm"
              @click="showJoinTableModal = true"
            >
              Rejoindre une table
            </button>
          </div>

          <!-- Owned tables -->
          <div v-if="ownedTables.length > 0" class="mb-8">
            <h3 class="font-serif text-dnd-gold-dim text-sm uppercase tracking-widest mb-4">Mes tables</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="t in ownedTables"
                :key="t.id"
                class="group relative flex flex-col gap-2 p-5 rounded-xl border-2 border-dnd-gold/30 bg-dnd-leather/40 backdrop-blur-sm hover:border-dnd-gold hover:bg-dnd-leather/60 transition-all cursor-pointer shadow-lg"
                @click="navigateTo(`/table/${t.code}`)"
              >
                <!-- Delete button -->
                <button
                  class="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  :class="confirmDeleteTableId === t.id ? 'bg-dnd-red/80 text-white border border-dnd-red' : 'bg-black/40 text-dnd-parchment/50 hover:text-dnd-red hover:bg-dnd-red/20 border border-transparent'"
                  @click.stop="handleDeleteTable(t.id)"
                >
                  {{ confirmDeleteTableId === t.id ? '?' : '✕' }}
                </button>

                <h4 class="font-serif font-bold text-dnd-gold text-lg tracking-wide">
                  {{ t.name }}
                </h4>
                <div class="flex items-center gap-2">
                  <span class="font-mono text-xs text-dnd-gold/70 bg-dnd-dark/40 border border-dnd-gold/20 px-2 py-0.5 rounded tracking-widest">
                    {{ t.code }}
                  </span>
                  <span class="text-[10px] text-dnd-parchment/40 font-serif uppercase">Proprietaire</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Joined tables -->
          <div v-if="joinedTables.length > 0">
            <h3 class="font-serif text-dnd-gold-dim text-sm uppercase tracking-widest mb-4">Tables rejointes</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="t in joinedTables"
                :key="t.id"
                class="group relative flex flex-col gap-2 p-5 rounded-xl border border-dnd-gold/20 bg-dnd-leather/20 backdrop-blur-sm hover:border-dnd-gold/50 hover:bg-dnd-leather/40 transition-all cursor-pointer"
                @click="navigateTo(`/table/${t.code}`)"
              >
                <!-- Leave button -->
                <button
                  class="absolute top-2 right-2 px-2 py-1 text-[10px] font-serif text-dnd-parchment/30 hover:text-dnd-red hover:bg-dnd-red/10 border border-transparent hover:border-dnd-red/30 rounded opacity-0 group-hover:opacity-100 transition-all"
                  @click.stop="leaveTable(t.my_member_id)"
                >
                  Quitter
                </button>

                <h4 class="font-serif font-bold text-dnd-gold text-lg tracking-wide">
                  {{ t.name }}
                </h4>
                <div class="flex items-center gap-2">
                  <span class="font-mono text-xs text-dnd-gold/70 bg-dnd-dark/40 border border-dnd-gold/20 px-2 py-0.5 rounded tracking-widest">
                    {{ t.code }}
                  </span>
                  <span class="text-[10px] text-dnd-parchment/40 font-serif uppercase">Membre</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div
            v-if="ownedTables.length === 0 && joinedTables.length === 0"
            class="text-center py-10 text-dnd-parchment/40 font-serif italic"
          >
            Vous n'avez pas encore de table de jeu.
          </div>
        </section>
      </div>
    </main>

    <AppFooter />

    <!-- Create character modal -->
    <CharacterCreateModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handleCreate"
    />

    <!-- Create table modal -->
    <Teleport to="body">
      <div
        v-if="showCreateTableModal"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
        @click.self="showCreateTableModal = false"
      >
        <div class="w-full max-w-md mx-4 bg-dnd-dark border-2 border-dnd-gold/40 rounded-2xl p-8 shadow-2xl">
          <h2 class="font-serif text-dnd-gold font-bold text-xl tracking-widest uppercase mb-6 text-center">
            Nouvelle Table
          </h2>
          <form class="space-y-4" @submit.prevent="handleCreateTable">
            <div>
              <label class="block text-dnd-gold-dim text-sm font-serif uppercase tracking-wider mb-1">
                Nom de la table
              </label>
              <input
                v-model="newTableName"
                type="text"
                placeholder="Ex: La Quete du Dragon"
                maxlength="50"
                class="w-full bg-black/40 border border-dnd-gold/30 rounded px-4 py-2.5 text-dnd-parchment placeholder:text-dnd-parchment/30 focus:outline-none focus:border-dnd-gold focus:ring-1 focus:ring-dnd-gold/50"
              />
            </div>
            <div>
              <label class="block text-dnd-gold-dim text-sm font-serif uppercase tracking-wider mb-1">
                Mon personnage <span class="text-dnd-parchment/40 normal-case">(optionnel)</span>
              </label>
              <select
                v-model="createTableCharacterId"
                class="w-full bg-black/40 border border-dnd-gold/30 rounded px-4 py-2.5 text-dnd-parchment focus:outline-none focus:border-dnd-gold focus:ring-1 focus:ring-dnd-gold/50"
              >
                <option value="">Aucun (MJ sans personnage)</option>
                <option
                  v-for="char in characters"
                  :key="char.id"
                  :value="char.id"
                >
                  {{ char.name }} ({{ char.class }} niv. {{ char.level }})
                </option>
              </select>
            </div>
            <div v-if="tableError" class="bg-dnd-red/20 border border-dnd-red/40 rounded px-4 py-2 text-dnd-parchment text-sm font-serif">
              {{ tableError }}
            </div>
            <div class="flex gap-3">
              <button
                type="button"
                class="flex-1 py-2.5 rounded border border-dnd-gold/20 text-dnd-gold-dim font-serif uppercase tracking-wider text-sm hover:bg-dnd-gold/10 transition-all"
                @click="showCreateTableModal = false"
              >
                Annuler
              </button>
              <button
                type="submit"
                :disabled="createTableLoading || !newTableName.trim()"
                class="flex-1 py-2.5 rounded border-2 border-dnd-gold bg-dnd-gold/20 text-dnd-gold font-serif font-bold uppercase tracking-wider text-sm hover:bg-dnd-gold/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ createTableLoading ? 'Creation...' : 'Creer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Join table modal -->
    <Teleport to="body">
      <div
        v-if="showJoinTableModal"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
        @click.self="showJoinTableModal = false"
      >
        <div class="w-full max-w-md mx-4 bg-dnd-dark border-2 border-dnd-gold/40 rounded-2xl p-8 shadow-2xl">
          <h2 class="font-serif text-dnd-gold font-bold text-xl tracking-widest uppercase mb-6 text-center">
            Rejoindre une Table
          </h2>
          <form class="space-y-4" @submit.prevent="handleJoinTable">
            <div>
              <label class="block text-dnd-gold-dim text-sm font-serif uppercase tracking-wider mb-1">
                Code de la table
              </label>
              <input
                v-model="joinCode"
                type="text"
                placeholder="Ex: A3K7P"
                maxlength="5"
                class="w-full bg-black/40 border border-dnd-gold/30 rounded px-4 py-2.5 text-dnd-parchment placeholder:text-dnd-parchment/30 focus:outline-none focus:border-dnd-gold focus:ring-1 focus:ring-dnd-gold/50 font-mono text-center text-xl tracking-[0.3em] uppercase"
              />
            </div>
            <div>
              <label class="block text-dnd-gold-dim text-sm font-serif uppercase tracking-wider mb-1">
                Personnage
              </label>
              <select
                v-model="joinCharacterId"
                class="w-full bg-black/40 border border-dnd-gold/30 rounded px-4 py-2.5 text-dnd-parchment focus:outline-none focus:border-dnd-gold focus:ring-1 focus:ring-dnd-gold/50"
              >
                <option value="" disabled>Choisir un personnage</option>
                <option
                  v-for="char in characters"
                  :key="char.id"
                  :value="char.id"
                >
                  {{ char.name }} ({{ char.class }} niv. {{ char.level }})
                </option>
              </select>
            </div>
            <div v-if="joinError" class="bg-dnd-red/20 border border-dnd-red/40 rounded px-4 py-2 text-dnd-parchment text-sm font-serif">
              {{ joinError }}
            </div>
            <div class="flex gap-3">
              <button
                type="button"
                class="flex-1 py-2.5 rounded border border-dnd-gold/20 text-dnd-gold-dim font-serif uppercase tracking-wider text-sm hover:bg-dnd-gold/10 transition-all"
                @click="showJoinTableModal = false"
              >
                Annuler
              </button>
              <button
                type="submit"
                :disabled="joinLoading || !joinCode.trim() || !joinCharacterId"
                class="flex-1 py-2.5 rounded border-2 border-dnd-gold bg-dnd-gold/20 text-dnd-gold font-serif font-bold uppercase tracking-wider text-sm hover:bg-dnd-gold/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ joinLoading ? 'Connexion...' : 'Rejoindre' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>
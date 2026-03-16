<script setup lang="ts">
import type { CharacterCreate } from '~/types'

const { characters, isLoading, error, fetchCharacters, createCharacter, deleteCharacter } = useCharacters()
const { isPremium, username } = useProfile()

const showCreateModal = ref(false)

const maxCharacters = computed(() => isPremium.value ? 10 : 4)
const canCreateMore = computed(() => characters.value.length < maxCharacters.value)

if (import.meta.client) {
  fetchCharacters()
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
    <!-- Navbar simple -->
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

          <!-- Locked slots (if at limit and not premium) -->
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
      </div>
    </main>

    <AppFooter />

    <!-- Create modal -->
    <CharacterCreateModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handleCreate"
    />
  </div>
</template>

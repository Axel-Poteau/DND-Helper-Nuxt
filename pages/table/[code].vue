<script setup lang="ts">
import type { GameTable, TableMember } from '~/types'
import { getAvatarEmoji } from '~/data/avatars'

const route = useRoute()
const code = (route.params.code as string).toUpperCase()
const supabase = useSupabaseClient() as any

const { fetchTableMembers, kickMember, error } = useGameTables()
const { username } = useProfile()

const table = ref<GameTable | null>(null)
const members = ref<TableMember[]>([])
const isLoading = ref(true)
const isOwner = ref(false)
const copied = ref(false)
const currentUserId = ref<string | null>(null)
const confirmKickId = ref<string | null>(null)

const CLASS_LABELS: Record<string, string> = {
  clerc: 'Clerc',
  paladin: 'Paladin',
  ensorceleur: 'Ensorceleur',
  magicien: 'Magicien',
  barde: 'Barde',
  occultiste: 'Occultiste',
}

async function loadTable() {
  isLoading.value = true
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { navigateTo('/'); return }

  const { data, error: err } = await supabase
    .from('game_tables')
    .select('*')
    .eq('code', code)
    .single()

  if (err || !data) {
    navigateTo('/dashboard')
    return
  }

  table.value = data as GameTable
  currentUserId.value = user.id
  isOwner.value = data.owner_id === user.id
  members.value = await fetchTableMembers(data.id)
  isLoading.value = false
}

async function handleKick(memberId: string) {
  if (!table.value) return
  if (confirmKickId.value !== memberId) {
    confirmKickId.value = memberId
    setTimeout(() => { confirmKickId.value = null }, 3000)
    return
  }
  confirmKickId.value = null
  await kickMember(memberId, table.value.id)
  members.value = await fetchTableMembers(table.value.id)
}

async function copyCode() {
  try {
    await navigator.clipboard.writeText(code)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // Fallback silencieux si clipboard non disponible
  }
}

if (import.meta.client) {
  loadTable()
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
          <NuxtLink
            to="/dashboard"
            class="text-dnd-gold-dim hover:text-dnd-gold font-serif text-xs uppercase tracking-wider transition-colors"
          >
            Retour au dashboard
          </NuxtLink>
        </div>
      </div>
    </nav>

    <main class="flex-1 pt-28 pb-12 px-4 md:px-8">
      <div class="max-w-3xl mx-auto">
        <!-- Loading -->
        <div v-if="isLoading" class="flex justify-center py-20">
          <div class="w-8 h-8 border-4 border-dnd-gold/30 border-t-dnd-gold rounded-full animate-spin" />
        </div>

        <template v-else-if="table">
          <!-- Header -->
          <header class="text-center mb-10">
            <h1 class="text-3xl md:text-4xl font-serif font-bold text-dnd-gold tracking-widest uppercase">
              {{ table.name }}
            </h1>
            <div class="mt-4 flex items-center justify-center gap-3">
              <span class="font-mono text-2xl tracking-[0.3em] text-dnd-gold bg-dnd-dark/60 border-2 border-dnd-gold/40 px-4 py-2 rounded-lg select-all">
                {{ table.code }}
              </span>
              <button
                class="px-3 py-2 border border-dnd-gold/30 rounded-lg text-dnd-gold-dim hover:text-dnd-gold hover:border-dnd-gold/60 transition-all text-sm font-serif"
                @click="copyCode"
              >
                {{ copied ? 'Copie !' : 'Copier' }}
              </button>
            </div>
            <p class="mt-2 text-dnd-parchment/50 text-sm font-serif">
              Partagez ce code pour inviter des joueurs
            </p>
          </header>

          <!-- Members list -->
          <section>
            <h2 class="font-serif text-dnd-gold font-bold text-xl tracking-widest uppercase mb-6">
              Joueurs ({{ members.length }})
            </h2>

            <div v-if="members.length === 0" class="text-center py-10 text-dnd-parchment/40 font-serif italic">
              Aucun joueur n'a encore rejoint cette table.
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="member in members"
                :key="member.id"
                class="flex items-center gap-4 p-4 rounded-xl border border-dnd-gold/20 bg-dnd-leather/30 backdrop-blur-sm cursor-pointer hover:border-dnd-gold/50 hover:bg-dnd-leather/50 transition-all"
                @click="member.character && navigateTo({ path: '/grimoire', query: { character: member.character_id, readonly: 'true' } })"
              >
                <!-- Avatar -->
                <div class="w-12 h-12 rounded-full bg-dnd-dark/60 border-2 border-dnd-gold/30 flex items-center justify-center text-2xl flex-shrink-0">
                  {{ member.character ? getAvatarEmoji(member.character.avatar) : '?' }}
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <div class="font-serif font-bold text-dnd-gold truncate">
                    {{ member.character?.name || 'Personnage inconnu' }}
                  </div>
                  <div class="flex items-center gap-2 text-xs text-dnd-parchment/60">
                    <span class="font-serif uppercase tracking-wider">
                      {{ CLASS_LABELS[member.character?.class ?? ''] || member.character?.class }}
                    </span>
                    <span v-if="member.character" class="font-bold text-dnd-gold/60 bg-dnd-gold/10 px-1.5 py-0.5 rounded text-[10px]">
                      Niv {{ member.character.level }}
                    </span>
                    <span class="text-dnd-parchment/40">
                      — {{ member.profile?.username || 'Joueur' }}
                    </span>
                  </div>
                </div>

                <!-- Kick button (owner only, can't kick self) -->
                <button
                  v-if="isOwner && member.user_id !== currentUserId"
                  class="px-2 py-1 text-xs font-serif rounded transition-all"
                  :class="confirmKickId === member.id ? 'text-white bg-dnd-red/80 border border-dnd-red' : 'text-dnd-parchment/40 hover:text-dnd-red hover:bg-dnd-red/10 border border-transparent hover:border-dnd-red/30'"
                  @click.stop="handleKick(member.id)"
                >
                  {{ confirmKickId === member.id ? 'Confirmer ?' : 'Retirer' }}
                </button>
              </div>
            </div>
          </section>
        </template>
      </div>
    </main>

    <AppFooter />
  </div>
</template>
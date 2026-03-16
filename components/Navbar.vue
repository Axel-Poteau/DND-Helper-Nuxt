<script setup lang="ts">
import { getAvatarEmoji } from '~/data/avatars'

const props = defineProps<{
  characterName?: string
  characterClass?: string
  characterAvatar?: string
}>()

const { username } = useProfile()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const displayName = computed(() =>
  username.value || user.value?.email?.split('@')[0] || null
)

async function handleLogout() {
  await supabase.auth.signOut()
  navigateTo('/')
}
</script>

<template>
  <nav class="fixed top-0 left-0 w-full z-50 bg-dnd-dark/95 backdrop-blur-md border-b border-dnd-gold/30 shadow-lg">
    <div class="w-full max-w-6xl mx-auto px-4">
      <div class="flex items-center h-16 md:h-20 gap-4">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <NuxtLink
            to="/dashboard"
            class="font-serif text-dnd-gold font-bold text-xl tracking-widest border border-dnd-gold/50 px-2 py-1 rounded select-none cursor-pointer hover:bg-dnd-gold/10 transition-colors inline-block"
          >
            D&amp;D
          </NuxtLink>
        </div>

        <!-- Character info (grimoire mode) -->
        <div v-if="characterName" class="flex-1 flex items-center gap-3 min-w-0">
          <NuxtLink
            to="/dashboard"
            class="text-dnd-gold-dim hover:text-dnd-gold text-xs font-serif uppercase tracking-wider transition-colors flex-shrink-0"
          >
            ← Retour
          </NuxtLink>
          <div class="flex items-center gap-2 min-w-0">
            <span class="text-xl">{{ getAvatarEmoji(characterAvatar || 'default') }}</span>
            <span class="font-serif font-bold text-dnd-gold truncate">{{ characterName }}</span>
            <span class="text-xs text-dnd-parchment/50 uppercase tracking-wider flex-shrink-0">{{ characterClass }}</span>
          </div>
        </div>

        <!-- Spacer when no character -->
        <div v-else class="flex-1" />

        <!-- User section -->
        <div class="flex items-center gap-3 flex-shrink-0 pl-3 border-l border-dnd-gold/20">
          <span
            v-if="displayName"
            class="hidden md:block text-dnd-parchment/50 font-serif text-xs uppercase tracking-wider max-w-[120px] truncate"
            :title="displayName"
          >
            {{ displayName }}
          </span>
          <button
            class="px-3 py-1.5 border border-dnd-gold/20 text-dnd-gold-dim hover:text-dnd-red hover:border-dnd-red/40 hover:bg-dnd-red/10 rounded font-serif text-xs uppercase tracking-wider transition-all duration-200 whitespace-nowrap"
            @click="handleLogout"
          >
            Se deconnecter
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

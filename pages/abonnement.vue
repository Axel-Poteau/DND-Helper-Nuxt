<script setup lang="ts">
const { isPremium, username } = useProfile()

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
              to="/dashboard"
              class="text-dnd-gold-dim hover:text-dnd-gold font-serif text-xs uppercase tracking-wider transition-colors"
            >
              ← Tableau de bord
            </NuxtLink>
            <span
              v-if="username"
              class="hidden md:block text-dnd-parchment/50 font-serif text-xs uppercase tracking-wider"
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
      <div class="max-w-2xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-serif font-bold text-dnd-gold tracking-widest uppercase mb-10 text-center">
          Mon <span class="text-dnd-red">Abonnement</span>
        </h1>

        <!-- Current status -->
        <div class="backdrop-blur-sm bg-dnd-leather/30 border-2 border-dnd-gold/40 rounded-xl p-8 shadow-xl mb-8">
          <div v-if="isPremium" class="text-center">
            <div class="text-5xl mb-4">⭐</div>
            <h2 class="font-serif font-bold text-2xl text-dnd-gold uppercase tracking-widest mb-2">Premium</h2>
            <p class="text-dnd-parchment/70 font-serif">Vous beneficiez de tous les avantages Premium.</p>
          </div>
          <div v-else class="text-center">
            <div class="text-5xl mb-4">📜</div>
            <h2 class="font-serif font-bold text-2xl text-dnd-gold-dim uppercase tracking-widest mb-2">Gratuit</h2>
            <p class="text-dnd-parchment/70 font-serif">Vous utilisez la version gratuite du Grimoire.</p>
          </div>
        </div>

        <!-- Comparison -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Free tier -->
          <div class="backdrop-blur-sm bg-black/20 border border-dnd-gold/20 rounded-xl p-6">
            <h3 class="font-serif font-bold text-lg text-dnd-gold-dim uppercase tracking-widest mb-4 text-center">
              Gratuit
            </h3>
            <ul class="space-y-3 text-sm text-dnd-parchment/70">
              <li class="flex items-start gap-2">
                <span class="text-dnd-gold flex-shrink-0">✓</span>
                <span>Jusqu'a <strong class="text-dnd-parchment">4 personnages</strong></span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-dnd-gold flex-shrink-0">✓</span>
                <span>Grimoire complet avec sauvegarde</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-dnd-gold flex-shrink-0">✓</span>
                <span>Sorts et sous-classes du <strong class="text-dnd-parchment">livre de base</strong> uniquement</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-dnd-gold flex-shrink-0">✓</span>
                <span>Suivi des emplacements et ressources</span>
              </li>
            </ul>
            <div v-if="!isPremium" class="mt-6 text-center">
              <span class="text-xs text-dnd-gold-dim uppercase tracking-widest">Plan actuel</span>
            </div>
          </div>

          <!-- Premium tier -->
          <div class="backdrop-blur-sm bg-dnd-gold/5 border-2 border-dnd-gold/40 rounded-xl p-6 relative">
            <div v-if="isPremium" class="absolute -top-3 left-1/2 -translate-x-1/2 bg-dnd-gold text-dnd-dark text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              Actif
            </div>
            <h3 class="font-serif font-bold text-lg text-dnd-gold uppercase tracking-widest mb-1 text-center">
              Premium ⭐
            </h3>
            <p class="text-center text-dnd-gold font-serif font-bold text-2xl mb-4">4.99€<span class="text-sm text-dnd-parchment/50 font-normal">/mois</span></p>
            <ul class="space-y-3 text-sm text-dnd-parchment/70">
              <li class="flex items-start gap-2">
                <span class="text-dnd-gold flex-shrink-0">✓</span>
                <span>Jusqu'a <strong class="text-dnd-parchment">10 personnages</strong></span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-dnd-gold flex-shrink-0">✓</span>
                <span>Tout le plan gratuit inclus</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-dnd-gold flex-shrink-0">✓</span>
                <span>Creation de <strong class="text-dnd-parchment">tables de jeu</strong></span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-dnd-gold/40 flex-shrink-0">◇</span>
                <span class="text-dnd-parchment/40 italic">Plus de fonctionnalites a venir...</span>
              </li>
            </ul>
            <div v-if="!isPremium" class="mt-6 text-center">
              <p class="text-xs text-dnd-parchment/40 italic">Bientot disponible</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

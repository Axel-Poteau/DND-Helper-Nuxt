<script setup lang="ts">
const email = ref('')
const password = ref('')

// Formulaire d'inscription
const surnom = ref('')
const registerEmail = ref('')
const registerPassword = ref('')
const registerPasswordConfirm = ref('')

// Afficher connexion (true) ou inscription (false)
const isLoginForm = ref(true)
</script>

<template>
  <div class="min-h-screen font-sans text-dnd-parchment flex flex-col">
    <header class="fixed top-0 left-0 w-full z-50 bg-dnd-dark/95 backdrop-blur-md border-b border-dnd-gold/30 shadow-lg">
      <div class="w-full max-w-6xl mx-auto px-4 h-16 md:h-20 flex items-center">
        <span class="font-serif text-dnd-gold font-bold text-xl tracking-widest border border-dnd-gold/50 px-2 py-1 rounded select-none">
          D&amp;D
        </span>
      </div>
    </header>

    <main class="flex-1 pt-24 pb-12 px-4 md:px-8">
      <div class="max-w-md mx-auto">
        <!-- Titre principal -->
        <h1 class="font-serif font-bold text-4xl md:text-5xl text-dnd-gold tracking-widest uppercase mb-4 text-center">
          Grimoire <span class="text-dnd-red">Arcanique</span>
        </h1>
        <p class="text-dnd-parchment/80 font-serif text-lg tracking-wide mb-10 text-center">
          Gérez vos emplacements de sorts et votre grimoire pour vos parties de <strong>Donjons &amp; Dragons</strong>.
        </p>

        <!-- Une seule carte : Connexion OU Inscription -->
        <div class="backdrop-blur-sm bg-dnd-leather/30 border-2 border-dnd-gold/40 rounded-2xl p-8 shadow-xl">
          <!-- Connexion -->
          <template v-if="isLoginForm">
            <h2 class="font-serif text-dnd-gold font-bold text-xl tracking-widest uppercase mb-6 text-center">
              Connexion
            </h2>
            <form class="space-y-4" @submit.prevent>
              <div>
                <label for="email" class="block text-dnd-gold-dim text-sm font-serif uppercase tracking-wider mb-1">
                  Email
                </label>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="votre@email.com"
                  class="w-full bg-black/40 border border-dnd-gold/30 rounded px-4 py-2.5 text-dnd-parchment placeholder:text-dnd-parchment/30 focus:outline-none focus:border-dnd-gold focus:ring-1 focus:ring-dnd-gold/50"
                />
              </div>
              <div>
                <label for="password" class="block text-dnd-gold-dim text-sm font-serif uppercase tracking-wider mb-1">
                  Mot de passe
                </label>
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  placeholder="••••••••"
                  class="w-full bg-black/40 border border-dnd-gold/30 rounded px-4 py-2.5 text-dnd-parchment placeholder:text-dnd-parchment/30 focus:outline-none focus:border-dnd-gold focus:ring-1 focus:ring-dnd-gold/50"
                />
              </div>
              <button
                type="submit"
                class="w-full py-3 rounded border-2 border-dnd-gold bg-dnd-gold/20 text-dnd-gold font-serif font-bold tracking-widest uppercase hover:bg-dnd-gold/30 hover:border-dnd-gold transition-all"
              >
                Connexion
              </button>
            </form>
          </template>

          <!-- Inscription -->
          <template v-else>
            <h2 class="font-serif text-dnd-gold font-bold text-xl tracking-widest uppercase mb-6 text-center">
              Créer un compte
            </h2>
            <form class="space-y-4" @submit.prevent>
              <div>
                <label for="surnom" class="block text-dnd-gold-dim text-sm font-serif uppercase tracking-wider mb-1">
                  Pseudo
                </label>
                <input
                  id="surnom"
                  v-model="surnom"
                  type="text"
                  placeholder="Votre surnom ou pseudo"
                  class="w-full bg-black/40 border border-dnd-gold/30 rounded px-4 py-2.5 text-dnd-parchment placeholder:text-dnd-parchment/30 focus:outline-none focus:border-dnd-gold focus:ring-1 focus:ring-dnd-gold/50"
                />
              </div>
              <div>
                <label for="register-email" class="block text-dnd-gold-dim text-sm font-serif uppercase tracking-wider mb-1">
                  Email
                </label>
                <input
                  id="register-email"
                  v-model="registerEmail"
                  type="email"
                  placeholder="votre@email.com"
                  class="w-full bg-black/40 border border-dnd-gold/30 rounded px-4 py-2.5 text-dnd-parchment placeholder:text-dnd-parchment/30 focus:outline-none focus:border-dnd-gold focus:ring-1 focus:ring-dnd-gold/50"
                />
              </div>
              <div>
                <label for="register-password" class="block text-dnd-gold-dim text-sm font-serif uppercase tracking-wider mb-1">
                  Mot de passe
                </label>
                <input
                  id="register-password"
                  v-model="registerPassword"
                  type="password"
                  placeholder="••••••••"
                  class="w-full bg-black/40 border border-dnd-gold/30 rounded px-4 py-2.5 text-dnd-parchment placeholder:text-dnd-parchment/30 focus:outline-none focus:border-dnd-gold focus:ring-1 focus:ring-dnd-gold/50"
                />
              </div>
              <div>
                <label for="register-password-confirm" class="block text-dnd-gold-dim text-sm font-serif uppercase tracking-wider mb-1">
                  Confirmer le mot de passe
                </label>
                <input
                  id="register-password-confirm"
                  v-model="registerPasswordConfirm"
                  type="password"
                  placeholder="••••••••"
                  class="w-full bg-black/40 border border-dnd-gold/30 rounded px-4 py-2.5 text-dnd-parchment placeholder:text-dnd-parchment/30 focus:outline-none focus:border-dnd-gold focus:ring-1 focus:ring-dnd-gold/50"
                />
              </div>
              <button
                type="submit"
                class="w-full py-3 rounded border-2 border-dnd-gold bg-dnd-gold/20 text-dnd-gold font-serif font-bold tracking-widest uppercase hover:bg-dnd-gold/30 hover:border-dnd-gold transition-all"
              >
                S'enregistrer
              </button>
            </form>
          </template>

          <!-- Bouton pour changer de formulaire -->
          <div class="mt-6 pt-6 border-t border-dnd-gold/20 text-center">
            <button
              type="button"
              class="text-dnd-gold-dim hover:text-dnd-gold font-serif text-sm tracking-wide transition-colors underline underline-offset-2"
              @click="isLoginForm = !isLoginForm"
            >
              {{ isLoginForm ? "Pas encore de compte ? S'enregistrer" : 'Déjà un compte ? Se connecter' }}
            </button>
          </div>

          <!-- Explication : à quoi sert la connexion -->
          <div class="mt-6 pt-6 border-t border-dnd-gold/20">
            <p class="text-dnd-gold-dim/90 text-sm font-sans leading-relaxed">
              <span class="text-dnd-gold font-serif font-bold uppercase tracking-wider">À quoi sert la connexion ?</span><br />
              En vous connectant, vous pourrez <strong class="text-dnd-parchment">sauvegarder vos grimoires</strong> (sorts préparés par personnage), <strong class="text-dnd-parchment">y accéder depuis plusieurs appareils</strong> et retrouver vos préférences à chaque partie. Sans compte, vous pouvez tout de même utiliser le Grimoire en bas de page.
            </p>
          </div>
        </div>

        <p class="mt-6 text-dnd-gold-dim/70 text-sm font-sans text-center">
          Le Grimoire reste accessible via le bouton en bas de page.
        </p>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

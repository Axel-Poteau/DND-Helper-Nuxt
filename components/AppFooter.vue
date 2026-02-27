<script setup lang="ts">
const route = useRoute()
const isGrimoire = computed(() => route.path === '/grimoire')
</script>

<template>
  <footer class="mt-auto border-t border-dnd-gold/30 bg-dnd-dark/95 backdrop-blur-md">
    <div class="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <span class="font-serif text-dnd-gold-dim text-sm tracking-wide">
        D&amp;D Helper — Grimoire Arcanique
      </span>
      <div class="flex items-center gap-4">
        <NuxtLink
          v-if="isGrimoire"
          to="/"
          class="text-dnd-gold-dim hover:text-dnd-gold text-sm font-serif tracking-wide transition-colors"
        >
          ← Retour à l'accueil
        </NuxtLink>
        <NuxtLink
          v-if="!isGrimoire"
          to="/grimoire"
          class="inline-flex items-center gap-2 px-4 py-2 rounded border border-dnd-gold/50 bg-dnd-gold/10 text-dnd-gold font-serif font-bold text-sm tracking-widest uppercase hover:bg-dnd-gold/20 hover:border-dnd-gold transition-all"
        >
          <span>📖</span>
          Ouvrir le Grimoire
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>

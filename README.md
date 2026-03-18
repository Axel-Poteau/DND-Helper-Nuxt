# Grimoire Arcanique — D&D Helper

Application web de gestion de sorts et d'emplacements pour **Donjons & Dragons 5e**, construite avec Nuxt 3, Supabase et TailwindCSS.

## Fonctionnalites

- **Authentification** — Inscription / connexion via Supabase (email + mot de passe)
- **Gestion de personnages** — Creation, sauvegarde et suppression (4 max gratuit, 10 en premium)
- **Grimoire interactif** — Preparation de sorts, suivi des emplacements par niveau
- **Points de sorcellerie** — Tracker pour les Ensorceleurs avec conversion emplacement/points
- **Conduit divin** — Suivi des utilisations pour Clercs et Paladins
- **Sous-classes** — Domaines (Clerc), Serments (Paladin), Origines (Ensorceleur), Traditions (Magicien)
- **Auto-sauvegarde** — Les modifications sont sauvegardees automatiquement sur Supabase
- **Systeme Premium** — Limite de personnages etendue et fonctionnalites a venir

## Classes supportees

| Classe | Sous-classes |
|---|---|
| Clerc | Duperie, Guerre, Lumiere, Nature, Savoir, Tempete, Vie, Forge |
| Paladin | Devotion, Anciens, Vengeance |
| Ensorceleur | Draconique, Magie Sauvage |
| Magicien | Abjuration, Divination, Enchantement, Evocation, Illusion, Invocation, Necromancie, Transmutation |

## Tech Stack

- **Framework** — [Nuxt 3](https://nuxt.com) (Vue 3 + TypeScript)
- **BDD & Auth** — [Supabase](https://supabase.com) (`@nuxtjs/supabase`)
- **CSS** — [TailwindCSS](https://tailwindcss.com) avec palette D&D custom
- **Polices** — Cinzel (titres) + Lora (corps) via Google Fonts
- **API externe** — [histoiresdetrolls.fr](https://histoiresdetrolls.fr) pour la base de sorts

## Installation

```bash
# Cloner le repo
git clone https://github.com/votre-user/D-D-Helper-Nuxt.git
cd D-D-Helper-Nuxt

# Installer les dependances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Remplir SUPABASE_URL, SUPABASE_KEY et NUXT_TROLLS_API_TOKEN
```

## Variables d'environnement

| Variable | Description |
|---|---|
| `SUPABASE_URL` | URL du projet Supabase |
| `SUPABASE_KEY` | Cle publique (anon key) Supabase |
| `NUXT_TROLLS_API_TOKEN` | Token API pour la base de sorts |

## Base de donnees

Executer la migration dans le SQL Editor de Supabase :

```bash
# Fichier : supabase/migrations/20260316_add_characters.sql
```

Tables :
- **profiles** — `id`, `username`, `is_premium`
- **characters** — Donnees completes du personnage (classe, niveau, sorts prepares, emplacements, etc.)
- **domains / oaths** — Sous-classes avec sorts associes

RLS active : chaque utilisateur ne voit que ses propres donnees.

## Developpement

```bash
# Serveur de dev
npm run dev

# Build production
npm run build

# Previsualiser le build
npm run preview

# Verifier les types
npx nuxi typecheck
```

## Structure du projet

```
pages/
  index.vue          # Login / inscription
  dashboard.vue      # Liste des personnages
  grimoire.vue       # Grimoire interactif
  abonnement.vue     # Page abonnement

components/
  CharacterCard.vue         # Carte personnage (dashboard)
  CharacterCreateModal.vue  # Modal de creation
  SpellSlotsGrid.vue        # Grille d'emplacements
  SpellItem.vue / SpellModal.vue  # Affichage des sorts
  SorceryPoints.vue         # Points de sorcellerie
  ChannelDivinity.vue       # Conduit divin
  SubclassFeatures.vue      # Capacites de sous-classe
  Navbar.vue / AppFooter.vue

composables/
  useCharacters.ts    # CRUD personnages
  useProfile.ts       # Profil utilisateur
  useSubclassData.ts  # Donnees sous-classes

data/
  avatars.ts       # Avatars emoji


utils/
  spellProgression.ts  # Tables de progression des emplacements
```

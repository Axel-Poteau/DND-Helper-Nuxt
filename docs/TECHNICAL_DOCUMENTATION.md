# Documentation Technique — Grimoire Arcanique (D&D Helper Nuxt)

---

## Table des matières

1. [Guide d'installation](#1-guide-dinstallation)
2. [Application Architecture Diagram](#2-application-architecture-diagram)
3. [Modèle de données](#3-modèle-de-données)
4. [Infrastructure Architecture Diagram](#4-infrastructure-architecture-diagram)

---

## 1. Guide d'installation

### Prérequis

| Outil        | Version minimale | Rôle                          |
|--------------|------------------|-------------------------------|
| Node.js      | 18.x             | Runtime JavaScript            |
| npm          | 9.x              | Gestionnaire de paquets       |
| Git          | 2.x              | Gestion de version            |
| Compte Supabase | —            | Base de données & authentification |

### 1.1 Cloner le dépôt

```bash
git clone https://github.com/<votre-organisation>/D-D-Helper-Nuxt.git
cd D-D-Helper-Nuxt
```

### 1.2 Installer les dépendances

```bash
npm install
```

### 1.3 Configurer les variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
# URL de votre projet Supabase
SUPABASE_URL=https://<votre-projet>.supabase.co

# Clé publique (anon key) Supabase
SUPABASE_KEY=<votre-cle-publique-supabase>

# Token API pour le service externe de sorts (histoiresdetrolls.fr)
NUXT_TROLLS_API_TOKEN=<votre-token-api>
```

> **Note :** Ne jamais committer le fichier `.env` dans le dépôt. Il est déjà listé dans `.gitignore`.

### 1.4 Configurer Supabase

#### a) Créer les tables

Créer les tables suivantes dans le dashboard Supabase (SQL Editor) :

- `profiles` — Profils utilisateurs
- `characters` — Personnages joueurs
- `domains`, `domain_spells` — Domaines de clerc et sorts associés
- `oaths`, `oath_spells`, `oath_channel_divinity` — Serments de paladin
- `origins`, `origin_features` — Origines de l'ensorceleur
- `traditions`, `tradition_features` — Traditions du magicien
- `game_tables` — Tables de jeu
- `table_members` — Membres des tables

> Le schéma exact de chaque table est décrit dans la section [Modèle de données](#3-modèle-de-données).

#### b) Activer les Row Level Security (RLS)

Chaque table doit avoir des politiques RLS pour isoler les données par utilisateur (`auth.uid()`).

#### c) Créer les fonctions RPC

Créer les fonctions stockées PostgreSQL suivantes :

- `join_table_by_code(p_code TEXT, p_character_id UUID)` — Rejoindre une table via code d'invitation
- `get_table_members(p_table_id UUID)` — Récupérer les membres avec données de personnage
- `kick_table_member(p_member_id UUID, p_table_id UUID)` — Expulser un joueur
- `get_shared_character(p_character_id UUID)` — Vue lecture seule d'un personnage

### 1.5 Lancer le serveur de développement

```bash
npm run dev
```

L'application est accessible sur `http://localhost:3000`.

### 1.6 Build de production

```bash
# Build SSR (Server-Side Rendering)
npm run build

# Prévisualiser le build
npm run preview
```

```bash
# OU génération statique (SSG)
npm run generate
```

### 1.7 Structure des scripts npm

| Commande             | Description                                   |
|----------------------|-----------------------------------------------|
| `npm run dev`        | Serveur de développement avec hot reload       |
| `npm run build`      | Build de production (SSR via Nitro)            |
| `npm run generate`   | Génération statique du site                    |
| `npm run preview`    | Prévisualisation du build de production        |
| `npm run postinstall`| Préparation Nuxt (exécuté automatiquement)     |

---

## 2. Application Architecture Diagram

### 2.1 Architecture logicielle globale

```mermaid
graph TB
    subgraph Client["🖥️ Client (Navigateur)"]
        App["app.vue<br/>Composant racine"]
        Pages["Pages Nuxt"]
        Components["Composants Vue"]
        Composables["Composables"]
        Utils["Utilitaires"]
    end

    subgraph Pages
        Index["index.vue<br/>Authentification"]
        Dashboard["dashboard.vue<br/>Hub personnages & tables"]
        Grimoire["grimoire.vue<br/>Grimoire de sorts"]
        Abonnement["abonnement.vue<br/>Abonnement premium"]
        TableView["table/[code].vue<br/>Vue table de jeu"]
    end

    subgraph Composables
        UseCharacters["useCharacters()<br/>CRUD personnages"]
        UseProfile["useProfile()<br/>Profil utilisateur"]
        UseSubclass["useSubclassData()<br/>Sous-classes D&D"]
        UseGameTables["useGameTables()<br/>Tables de jeu"]
    end

    subgraph Server["⚙️ Serveur Nitro (SSR)"]
        API["server/api/spells.get.ts<br/>Proxy API sorts"]
    end

    subgraph External["🌐 Services Externes"]
        Supabase["Supabase<br/>PostgreSQL + Auth + RLS"]
        TrollsAPI["histoiresdetrolls.fr<br/>API de sorts D&D 5e"]
    end

    App --> Pages
    Pages --> Components
    Pages --> Composables
    Composables --> Supabase
    API --> TrollsAPI
    Grimoire --> API
    Index --> Supabase
```

### 2.2 Flux de données

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant P as Pages Vue
    participant C as Composables
    participant N as Serveur Nitro
    participant S as Supabase
    participant T as API Trolls

    Note over U,T: Flux d'authentification
    U->>P: Saisie email/mot de passe
    P->>S: signInWithPassword() / signUp()
    S-->>P: Session JWT
    P->>P: Redirection → /dashboard

    Note over U,T: Flux de chargement des personnages
    P->>C: fetchCharacters()
    C->>S: SELECT * FROM characters WHERE user_id = auth.uid()
    S-->>C: Liste de personnages
    C-->>P: Mise à jour réactive (ref)

    Note over U,T: Flux du grimoire de sorts
    U->>P: Ouvre /grimoire?character=ID
    P->>N: GET /api/spells?class=clerc
    N->>T: GET /api/spells (avec token)
    T-->>N: Sorts bruts (JSON)
    N-->>P: Sorts normalisés
    P->>C: Sauvegarde automatique (debounce 1.5s)
    C->>S: UPDATE characters SET prepared_spell_ids = [...]

    Note over U,T: Flux des tables de jeu
    U->>P: Créer / Rejoindre table
    P->>C: createTable() / joinTable(code)
    C->>S: INSERT game_tables / RPC join_table_by_code()
    S-->>C: Confirmation
    C-->>P: Mise à jour liste tables
```

### 2.3 Architecture des composants

```mermaid
graph LR
    subgraph "Pages"
        Dashboard
        Grimoire
        TablePage["table/[code]"]
    end

    subgraph "Composants partagés"
        Navbar
        AppFooter
    end

    subgraph "Composants Dashboard"
        CharacterCard
        CharacterCreateModal
    end

    subgraph "Composants Grimoire"
        LevelSelector
        SpellSlotsGrid --> SpellSlotCard
        SpellItem
        SpellModal
        FloatingTooltip
        SubclassFeatures
        SorceryPoints
        ChannelDivinity
        Metamagic
    end

    Dashboard --> CharacterCard
    Dashboard --> CharacterCreateModal
    Dashboard --> Navbar
    Dashboard --> AppFooter
    Grimoire --> LevelSelector
    Grimoire --> SpellSlotsGrid
    Grimoire --> SpellItem
    Grimoire --> SpellModal
    Grimoire --> FloatingTooltip
    Grimoire --> SubclassFeatures
    Grimoire --> SorceryPoints
    Grimoire --> ChannelDivinity
    Grimoire --> Metamagic
    Grimoire --> Navbar
    TablePage --> Navbar
```

---

## 3. Modèle de données

### 3.1 Diagramme Entité-Relation (UML)

```mermaid
erDiagram
    profiles {
        UUID id PK
        TEXT username
        BOOLEAN is_premium
    }

    characters {
        BIGINT id PK
        UUID user_id FK
        TEXT name
        TEXT class
        SMALLINT level
        TEXT subclass
        SMALLINT ability_mod
        TEXT avatar
        JSON prepared_spell_ids
        JSON current_slots
        SMALLINT sorcery_points
        SMALLINT channel_divinity_uses
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    game_tables {
        BIGINT id PK
        TEXT code UK
        TEXT name
        UUID owner_id FK
        TIMESTAMPTZ created_at
    }

    table_members {
        BIGINT id PK
        BIGINT table_id FK
        UUID user_id FK
        BIGINT character_id FK
        TIMESTAMPTZ joined_at
    }

    domains {
        BIGINT id PK
        TEXT label
        TEXT description
    }

    domain_spells {
        BIGINT id PK
        BIGINT domain_id FK
        SMALLINT level
        TEXT spell_slug
    }

    oaths {
        BIGINT id PK
        TEXT label
        TEXT description
    }

    oath_spells {
        BIGINT id PK
        BIGINT oath_id FK
        SMALLINT level
        TEXT spell_slug
    }

    oath_channel_divinity {
        BIGINT id PK
        BIGINT oath_id FK
        SMALLINT sort_order
        TEXT title
        TEXT description
    }

    origins {
        BIGINT id PK
        TEXT label
        TEXT description
    }

    origin_features {
        BIGINT id PK
        BIGINT origin_id FK
        SMALLINT level
        TEXT title
        TEXT description
        SMALLINT sort_order
    }

    traditions {
        BIGINT id PK
        TEXT label
        TEXT description
    }

    tradition_features {
        BIGINT id PK
        BIGINT tradition_id FK
        SMALLINT level
        TEXT title
        TEXT description
        SMALLINT sort_order
    }

    profiles ||--o{ characters : "possède"
    profiles ||--o{ game_tables : "crée"
    profiles ||--o{ table_members : "rejoint"
    game_tables ||--o{ table_members : "contient"
    characters ||--o{ table_members : "assigné à"
    domains ||--o{ domain_spells : "inclut"
    oaths ||--o{ oath_spells : "inclut"
    oaths ||--o{ oath_channel_divinity : "possède"
    origins ||--o{ origin_features : "possède"
    traditions ||--o{ tradition_features : "possède"
```

### 3.2 Description des tables

#### `profiles`
Stocke les informations de profil de chaque utilisateur. L'`id` correspond au `auth.uid()` de Supabase Auth.

| Colonne      | Type    | Contraintes      | Description                    |
|-------------|---------|------------------|--------------------------------|
| `id`        | UUID    | PK               | ID utilisateur (= auth.uid())  |
| `username`  | TEXT    | NOT NULL         | Nom d'affichage                |
| `is_premium`| BOOLEAN | DEFAULT false    | Statut d'abonnement premium    |

#### `characters`
Personnages D&D créés par les utilisateurs. Limité à 4 (gratuit) ou 10 (premium).

| Colonne               | Type        | Contraintes      | Description                           |
|------------------------|-------------|------------------|---------------------------------------|
| `id`                  | BIGINT      | PK, auto         | Identifiant unique                     |
| `user_id`             | UUID        | FK → profiles.id | Propriétaire                           |
| `name`                | TEXT        | NOT NULL         | Nom du personnage                      |
| `class`               | TEXT        | NOT NULL         | Classe (clerc, paladin, etc.)          |
| `level`               | SMALLINT    | 1-20             | Niveau du personnage                   |
| `subclass`            | TEXT        | NULLABLE         | Sous-classe (domaine, serment, etc.)   |
| `ability_mod`         | SMALLINT    | DEFAULT 0        | Modificateur de caractéristique        |
| `avatar`              | TEXT        | NULLABLE         | ID de l'avatar (emoji)                 |
| `prepared_spell_ids`  | JSON        | DEFAULT []       | Liste des slugs de sorts préparés      |
| `current_slots`       | JSON        | DEFAULT []       | Emplacements de sorts utilisés         |
| `sorcery_points`      | SMALLINT    | DEFAULT 0        | Points de sorcellerie (ensorceleur)    |
| `channel_divinity_uses`| SMALLINT   | DEFAULT 0        | Utilisations de conduit divin          |
| `created_at`          | TIMESTAMPTZ | auto             | Date de création                       |
| `updated_at`          | TIMESTAMPTZ | auto             | Dernière modification                  |

#### `game_tables`
Tables de jeu pour les sessions multijoueur. Fonctionnalité premium.

| Colonne    | Type        | Contraintes         | Description                      |
|-----------|-------------|---------------------|----------------------------------|
| `id`      | BIGINT      | PK, auto            | Identifiant unique                |
| `code`    | TEXT        | UNIQUE, NOT NULL    | Code alphanumérique d'invitation  |
| `name`    | TEXT        | NOT NULL            | Nom de la table                   |
| `owner_id`| UUID        | FK → profiles.id    | Créateur de la table              |
| `created_at`| TIMESTAMPTZ | auto              | Date de création                  |

#### `table_members`
Associe les joueurs et leurs personnages aux tables de jeu.

| Colonne        | Type        | Contraintes           | Description                    |
|---------------|-------------|-----------------------|--------------------------------|
| `id`          | BIGINT      | PK, auto              | Identifiant unique              |
| `table_id`    | BIGINT      | FK → game_tables.id   | Table de jeu                    |
| `user_id`     | UUID        | FK → profiles.id      | Joueur                          |
| `character_id`| BIGINT      | FK → characters.id    | Personnage assigné              |
| `joined_at`   | TIMESTAMPTZ | auto                  | Date d'ajout                    |

#### Tables de sous-classes

Les tables `domains`, `oaths`, `origins` et `traditions` suivent le même pattern :
- Une table principale avec `id`, `label`, `description`
- Une table de liaison pour les sorts (`domain_spells`, `oath_spells`) avec `level` et `spell_slug`
- Une table de features (`origin_features`, `tradition_features`, `oath_channel_divinity`) avec `level`, `title`, `description`, `sort_order`

### 3.3 Fonctions RPC (Stored Procedures)

| Fonction                   | Paramètres                          | Retour         | Description                              |
|---------------------------|-------------------------------------|----------------|------------------------------------------|
| `join_table_by_code`      | `p_code TEXT, p_character_id UUID`  | VOID           | Rejoindre une table via son code         |
| `get_table_members`       | `p_table_id UUID`                   | TABLE (rows)   | Membres avec données personnage          |
| `kick_table_member`       | `p_member_id UUID, p_table_id UUID` | VOID           | Retirer un joueur (propriétaire seul)    |
| `get_shared_character`    | `p_character_id UUID`               | JSON           | Lecture seule d'un personnage partagé    |

---

## 4. Infrastructure Architecture Diagram

### 4.1 Architecture de déploiement

```mermaid
graph TB
    subgraph Users["👥 Utilisateurs"]
        Browser["Navigateur Web<br/>(Desktop / Mobile)"]
    end

    subgraph Hosting["☁️ Hébergement (Vercel / Netlify / Node)"]
        CDN["CDN<br/>Assets statiques<br/>(JS, CSS, images)"]
        Nitro["Serveur Nitro<br/>(Node.js SSR)<br/>Port 3000"]
    end

    subgraph Supabase["🟢 Supabase Cloud"]
        Auth["Supabase Auth<br/>JWT / Email-Password"]
        PostgREST["PostgREST<br/>API REST auto-générée"]
        Postgres["PostgreSQL<br/>Base de données"]
        RLS["Row Level Security<br/>Isolation par utilisateur"]
    end

    subgraph ExternalAPI["🌐 API Externe"]
        Trolls["histoiresdetrolls.fr<br/>API de sorts D&D 5e"]
    end

    Browser -->|"HTTPS"| CDN
    Browser -->|"HTTPS"| Nitro
    Browser -->|"HTTPS (JWT)"| Auth
    Browser -->|"HTTPS (JWT)"| PostgREST
    Nitro -->|"HTTPS (Token)"| Trolls
    PostgREST --> Postgres
    Postgres --> RLS
    Auth --> Postgres
```

### 4.2 Flux réseau détaillé

```mermaid
flowchart LR
    subgraph Client
        A["Navigateur"]
    end

    subgraph "Plateforme d'hébergement"
        B["CDN / Edge"]
        C["Serveur Nitro<br/>(SSR + API)"]
    end

    subgraph "Supabase"
        D["Auth"]
        E["PostgREST"]
        F["PostgreSQL"]
    end

    subgraph "Externe"
        G["API Trolls"]
    end

    A -- "GET /" --> B
    B -- "HTML SSR" --> C
    A -- "POST /auth" --> D
    D -- "JWT Token" --> A
    A -- "GET/POST /rest/v1/*" --> E
    E -- "SQL + RLS" --> F
    C -- "GET /api/spells" --> G
    G -- "JSON sorts" --> C
    C -- "JSON normalisé" --> A
```

### 4.3 Environnements

| Environnement  | URL                          | Base de données        | Usage                          |
|----------------|------------------------------|------------------------|--------------------------------|
| Développement  | `http://localhost:3000`      | Supabase (dev/staging) | Développement local            |
| Production     | `https://<domaine>`          | Supabase (production)  | Utilisateurs finaux            |

### 4.4 Sécurité

```mermaid
graph LR
    subgraph "Couche Client"
        A["Supabase Auth<br/>JWT signé"]
    end

    subgraph "Couche Transport"
        B["HTTPS / TLS<br/>Chiffrement en transit"]
    end

    subgraph "Couche Données"
        C["RLS PostgreSQL<br/>auth.uid() = user_id"]
        D["Clés API<br/>Stockées côté serveur"]
    end

    A --> B --> C
    B --> D
```

**Mesures de sécurité en place :**

| Couche             | Mécanisme                                         |
|--------------------|---------------------------------------------------|
| Authentification   | Supabase Auth (email/password, JWT)                |
| Autorisation       | Row Level Security sur toutes les tables           |
| Transport          | HTTPS obligatoire (Supabase + hébergeur)           |
| Secrets            | Variables d'environnement (`.env`, non committé)   |
| API externe        | Token stocké uniquement côté serveur (runtime config) |
| Isolation          | Chaque utilisateur ne voit que ses propres données |

### 4.5 Stack technologique résumée

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND                          │
│  Nuxt 3 · Vue 3 · TypeScript · TailwindCSS         │
│  Cinzel + Lora (Google Fonts)                       │
├─────────────────────────────────────────────────────┤
│                   BACKEND                           │
│  Nitro (SSR + API Routes) · Node.js                 │
├─────────────────────────────────────────────────────┤
│                   DONNÉES                           │
│  Supabase (PostgreSQL + Auth + RLS + PostgREST)     │
├─────────────────────────────────────────────────────┤
│                   EXTERNE                           │
│  histoiresdetrolls.fr (API sorts D&D 5e)            │
└─────────────────────────────────────────────────────┘
```
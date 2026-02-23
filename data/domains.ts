// data/domains.ts

export interface DomainData {
  id: string;
  label: string;
  description: string;
  spells: { [level: number]: string[] };
}

export const CLERIC_DOMAINS: Record<string, DomainData> = {
  duperie: {
    id: 'duperie',
    label: 'Domaine de la Duperie',
    description: 'Les clercs de la Duperie privilégient la tromperie, l\'illusion et la furtivité aux confrontations directes.',
    spells: {
      1: ['charme-personne', 'deguisement'],
      3: ['image-miroir', 'passage-sans-trace'],
      5: ['clignotement', 'dissipation-de-la-magie'],
      7: ['metamorphose', 'porte-dimensionnelle'],
      9: ['domination-de-personne', 'modification-de-memoire'],
    },
  },
  guerre: {
    id: 'guerre',
    label: 'Domaine de la Guerre',
    description: 'Le clergé de la Guerre vénère les dieux du combat et récompense les guerriers justes et glorieux.',
    spells: {
      1: ['bouclier-de-la-foi', 'faveur-divine'],
      3: ['arme-magique', 'arme-spirituelle'],
      5: ['aura-du-croise', 'esprits-gardiens'],
      7: ['liberte-de-mouvement', 'peau-de-pierre'],
      9: ['colonne-de-flamme', 'immobilisation-de-monstre'],
    },
  },
  lumiere: {
    id: 'lumiere',
    label: 'Domaine de la Lumière',
    description: 'Les dieux de la Lumière promeuvent les idéaux de renaissance et de vérité, vigilant contre les ténèbres.',
    spells: {
      1: ['lueurs-feeriques', 'mains-brulantes'],
      3: ['rayon-ardent', 'sphere-de-feu'],
      5: ['boule-de-feu', 'lumiere-du-jour'],
      7: ['gardien-de-la-foi', 'mur-de-feu'],
      9: ['colonne-de-flamme', 'scrutation'],
    },
  },
  nature: {
    id: 'nature',
    label: 'Domaine de la Nature',
    description: 'Les dieux de la Nature sont aussi variés que le monde naturel, des forêts impénétrables aux montagnes escarpées.',
    spells: {
      1: ['amitie-avec-les-animaux', 'communication-avec-les-animaux'],
      3: ['croissance-d\'epines', 'peau-d\'ecorce'],
      5: ['croissance-vegetale', 'mur-de-vent'],
      7: ['domination-de-bete', 'liane-avide'],
      9: ['fleau-d\'insectes', 'passage-par-les-arbres'],
    },
  },
  savoir: {
    id: 'savoir',
    label: 'Domaine du Savoir',
    description: 'Les dieux du Savoir valorisent l\'apprentissage et la compréhension par-dessus tout.',
    spells: {
      1: ['identification', 'injonction'],
      3: ['augure', 'suggestion'],
      5: ['antidetection', 'communication-avec-les-morts'],
      7: ['confusion', 'oeil-magique'],
      9: ['mythes-et-legendes', 'scrutation'],
    },
  },
  tempete: {
    id: 'tempete',
    label: 'Domaine de la Tempête',
    description: 'Les dieux de la Tempête gouvernent les orages, la mer et le ciel, inspirant la crainte par leur fureur.',
    spells: {
      1: ['nappe-de-brouillard', 'vague-tonnante'],
      3: ['bourrasque', 'fracassement'],
      5: ['appel-de-la-foudre', 'tempete-de-neige'],
      7: ['controle-de-l\'eau', 'tempete-de-grele'],
      9: ['fleau-d\'insectes', 'vague-destructrice'],
    },
  },
  vie: {
    id: 'vie',
    label: 'Domaine de la Vie',
    description: 'Le domaine de la Vie se concentre sur l\'énergie positive vibrante, l\'une des forces fondamentales de l\'univers.',
    spells: {
      1: ['benediction', 'soins'],
      3: ['arme-spirituelle', 'restauration-partielle'],
      5: ['lueur-d\'espoir', 'retour-a-la-vie'],
      7: ['gardien-de-la-foi', 'protection-contre-la-mort'],
      9: ['rappel-a-la-vie', 'soins-de-groupe'],
    },
  },
  forge: {
    id: 'forge',
    label: 'Domaine de la Forge',
    description: 'Les dieux de la Forge sont les patrons des artisans qui travaillent le métal, de l\'humble forgeron à l\'inventeur inspiré.',
    spells: {
      1: ['chatiment-calcinant', 'identification'],
      3: ['arme-magique', 'metal-brulant'],
      5: ['arme-elementaire', 'protection-contre-une-energie'],
      7: ['fabrication', 'mur-de-feu'],
      9: ['animation-d\'objets', 'creation'],
    },
  },
};
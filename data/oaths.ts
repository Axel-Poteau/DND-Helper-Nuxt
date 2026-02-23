// data/oaths.ts

export interface OathData {
  id: string;
  label: string;
  description: string;
  channelDivinity: {
    title: string;
    description: string;
  }[];
  spells: { [level: number]: string[] };
}

export const PALADIN_OATHS: Record<string, OathData> = {
  devotion: {
    id: 'devotion',
    label: 'Serment de Dévotion',
    description: 'Le serment de dévotion lie un paladin aux idéaux les plus élevés de la justice, de la vertu, et de l\'ordre.',
    channelDivinity: [
      {
        title: "Arme sacrée",
        description: "Action. Ajoute votre modificateur de Charisme aux jets d'attaque d'une arme tenue (min +1) et elle émet de la lumière (6m vive + 6m faible) pendant 1 minute. L'arme devient magique."
      },
      {
        title: "Renvoi des impies",
        description: "Action. Présentez votre symbole sacré. Chaque mort-vivant ou fiélon à 9m doit réussir un JdS Sagesse ou être renvoyé (fuite forcée) pendant 1 minute."
      }
    ],
    spells: {
      3: ['protection-contre-le-mal-et-le-bien', 'sanctuaire'],
      5: ['restauration-partielle', 'zone-de-verite'],
      9: ['dissipation-de-la-magie', 'lueur-despoir'], // Attention aux apostrophes selon ton API
      13: ['gardien-de-la-foi', 'liberte-de-mouvement'],
      17: ['colonne-de-flamme', 'communion'],
    },
  },
  anciens: {
    id: 'anciens',
    label: 'Serment des Anciens',
    description: 'Les paladins qui jurent ce serment aiment les choses belles et vivifiantes du monde, préservant la vie et la lumière.',
    channelDivinity: [
      {
        title: "Courroux de la nature",
        description: "Action. Des vignes spectrales entravent une créature à 3m (JdS Force ou Dextérité). Si échec, la créature est Entravée. JdS à chaque tour pour se libérer."
      },
      {
        title: "Renvoi des infidèles",
        description: "Action. Chaque fée ou fiélon à 9m doit réussir un JdS Sagesse ou être renvoyé pendant 1 minute. Révèle la vraie forme des créatures cachées."
      }
    ],
    spells: {
      3: ['communication-avec-les-animaux', 'frappe-piegeuse'],
      5: ['foulee-brumeuse', 'rayon-de-lune'],
      9: ['croissance-vegetale', 'protection-contre-une-energie'],
      13: ['peau-de-pierre', 'tempete-de-grele'],
      17: ['communion-avec-la-nature', 'passage-par-les-arbres'],
    },
  },
  vengeance: {
    id: 'vengeance',
    label: 'Serment de Vengeance',
    description: 'Un engagement solennel de punir ceux qui ont commis de graves crimes, par tous les moyens nécessaires.',
    channelDivinity: [
      {
        title: "Conspuer l'ennemi",
        description: "Action. Une créature à 18m fait un JdS Sagesse (désavantage si fiélon/mort-vivant). Échec : Effrayée (vitesse 0). Réussite : Vitesse / 2. Durée 1 min."
      },
      {
        title: "Vœu d'hostilité",
        description: "Action Bonus. Vous gagnez l'Avantage aux jets d'attaque contre une créature à 3m pendant 1 minute."
      }
    ],
    spells: {
      3: ['fleau', 'marque-du-chasseur'],
      5: ['foulee-brumeuse', 'immobilisation-de-personne'],
      9: ['hate', 'protection-contre-une-energie'],
      13: ['bannissement', 'porte-dimensionnelle'],
      17: ['immobilisation-de-monstre', 'scrutation'],
    },
  },
};
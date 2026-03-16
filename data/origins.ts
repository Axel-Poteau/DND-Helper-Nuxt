export interface OriginFeature {
  level: number;
  title: string;
  description: string;
}

export interface OriginData {
  id: string;
  label: string;
  description: string;
  features: OriginFeature[];
}

export const SORCERER_ORIGINS: Record<string, OriginData> = {
  draconique: {
    id: 'draconique',
    label: 'Lignée Draconique',
    description: 'Votre magie innée provient d\'un héritage draconique mêlé à votre sang ou celui de vos ancêtres.',
    features: [
      {
        level: 1,
        title: 'Ancêtre dragon',
        description: 'Choisissez un type de dragon. Vous parlez le draconique et doublez votre bonus de maîtrise pour les tests de Charisme envers les dragons.',
      },
      {
        level: 1,
        title: 'Résistance draconique',
        description: 'Vos PV max augmentent de 1 par niveau d\'ensorceleur. Sans armure, votre CA = 13 + modificateur de Dextérité.',
      },
      {
        level: 6,
        title: 'Affinité élémentaire',
        description: 'Ajoutez votre modificateur de Charisme aux dégâts des sorts correspondant au type de votre dragon. Dépensez 1 point de sorcellerie pour obtenir la résistance à ce type de dégâts pendant 1 heure.',
      },
      {
        level: 14,
        title: 'Ailes de dragon',
        description: 'Action bonus. Vous faites apparaître des ailes de dragon, obtenant une vitesse de vol égale à votre vitesse actuelle. Nécessite de ne pas porter d\'armure lourde.',
      },
      {
        level: 18,
        title: 'Présence draconique',
        description: 'Dépensez 5 points de sorcellerie pour émettre une aura de terreur ou de fascination dans un rayon de 18m pendant 1 minute. JdS Sagesse ou Effrayé/Charmé.',
      },
    ],
  },
  sauvage: {
    id: 'sauvage',
    label: 'Magie Sauvage',
    description: 'Votre magie innée provient des forces du chaos, peut-être d\'une exposition aux plans ou d\'une bénédiction féerique.',
    features: [
      {
        level: 1,
        title: 'Sursaut de magie sauvage',
        description: 'Après avoir lancé un sort d\'ensorceleur de niveau 1+, le MJ peut vous demander de lancer un d20. Sur un 1, un effet aléatoire se déclenche depuis la table des sursauts.',
      },
      {
        level: 1,
        title: 'Marées du chaos',
        description: 'Vous pouvez obtenir l\'avantage sur un jet d\'attaque, de caractéristique ou de sauvegarde. Récupéré après un repos long ou après un sursaut de magie sauvage.',
      },
      {
        level: 6,
        title: 'Flexion de la chance',
        description: 'Réaction. Dépensez 2 points de sorcellerie pour ajouter ou retrancher 1d4 au jet d\'attaque, de caractéristique ou de sauvegarde d\'une créature visible.',
      },
      {
        level: 14,
        title: 'Chaos contrôlé',
        description: 'Quand vous déclenchez un sursaut de magie sauvage, lancez deux fois sur la table et choisissez le résultat que vous préférez.',
      },
      {
        level: 18,
        title: 'Bombardement de sorts',
        description: 'Quand un dé de dégâts d\'un sort affiche son maximum, relancez ce dé et ajoutez le résultat aux dégâts totaux (1 fois par tour).',
      },
    ],
  },
};

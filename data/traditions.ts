export interface TraditionFeature {
  level: number;
  title: string;
  description: string;
}

export interface TraditionData {
  id: string;
  label: string;
  description: string;
  features: TraditionFeature[];
}

export const WIZARD_TRADITIONS: Record<string, TraditionData> = {
  abjuration: {
    id: 'abjuration',
    label: 'École d\'Abjuration',
    description: 'L\'abjuration met l\'accent sur la magie de protection, de blocage et de bannissement.',
    features: [
      {
        level: 2,
        title: 'Abjuration savante',
        description: 'Le temps et l\'or pour copier un sort d\'abjuration dans votre grimoire sont divisés par deux.',
      },
      {
        level: 2,
        title: 'Protection arcanique',
        description: 'Quand vous lancez un sort d\'abjuration de niv 1+, vous créez un sceau magique avec des PV = 2 × niv Magicien + mod Intelligence. Il absorbe les dégâts à votre place. Relancer un sort d\'abjuration le restaure de 2 × niveau du sort.',
      },
      {
        level: 6,
        title: 'Protection projetée',
        description: 'Réaction. Quand une créature à 9m subit des dégâts, votre Protection arcanique les absorbe à sa place.',
      },
      {
        level: 10,
        title: 'Abjuration améliorée',
        description: 'Quand vous lancez un sort d\'abjuration nécessitant un test de caractéristique (ex : Contresort), ajoutez votre bonus de maîtrise au test.',
      },
      {
        level: 14,
        title: 'Résistance aux sorts',
        description: 'Vous avez l\'avantage aux JdS contre les sorts. De plus, vous avez la résistance aux dégâts des sorts.',
      },
    ],
  },
  divination: {
    id: 'divination',
    label: 'École de Divination',
    description: 'La divination cherche à percer les voiles du temps, de l\'espace et de la conscience.',
    features: [
      {
        level: 2,
        title: 'Divination savante',
        description: 'Le temps et l\'or pour copier un sort de divination dans votre grimoire sont divisés par deux.',
      },
      {
        level: 2,
        title: 'Présage',
        description: 'Après un repos long, lancez 2d20 et notez les résultats. Vous pouvez remplacer n\'importe quel jet d\'attaque, JdS ou test de caractéristique (vous ou une créature visible) par l\'un de ces résultats.',
      },
      {
        level: 6,
        title: 'Divination experte',
        description: 'Quand vous lancez un sort de divination de niv 2+ avec un emplacement, vous récupérez un emplacement de niveau inférieur (max niv 5).',
      },
      {
        level: 10,
        title: 'Le troisième œil',
        description: 'Action. Gagnez un bénéfice au choix : compréhension de toutes les langues, vision dans le noir 18m, vision éthérée 18m, ou détection de l\'invisibilité 3m. Durée jusqu\'au repos. 1 utilisation par repos long.',
      },
      {
        level: 14,
        title: 'Présage supérieur',
        description: 'Vous lancez 3d20 au lieu de 2 pour votre capacité Présage.',
      },
    ],
  },
  enchantement: {
    id: 'enchantement',
    label: 'École d\'Enchantement',
    description: 'L\'enchantement permet d\'influencer et de contrôler les esprits des autres créatures.',
    features: [
      {
        level: 2,
        title: 'Enchantement savant',
        description: 'Le temps et l\'or pour copier un sort d\'enchantement dans votre grimoire sont divisés par deux.',
      },
      {
        level: 2,
        title: 'Regard hypnotique',
        description: 'Action. Une créature à 1,5m qui vous voit fait un JdS Sagesse ou est Charmée (vitesse 0, incapacité). Maintenu tant que vous restez à 1,5m et utilisez votre action. 1 utilisation par créature par repos long.',
      },
      {
        level: 6,
        title: 'Charme instinctif',
        description: 'Réaction. Quand une créature à 9m vous attaque, elle fait un JdS Sagesse. Échec : elle doit choisir une autre cible. 1 utilisation par repos long.',
      },
      {
        level: 10,
        title: 'Enchantement partagé',
        description: 'Quand vous lancez un sort d\'enchantement de niv 1+ ciblant une seule créature, vous pouvez cibler une seconde créature.',
      },
      {
        level: 14,
        title: 'Altération des souvenirs',
        description: 'Quand vous charmez avec un sort d\'enchantement, la cible ne sait pas qu\'elle a été charmée. Vous pouvez lui faire oublier 1 + mod Charisme heures (minimum 1h). JdS Intelligence pour résister.',
      },
    ],
  },
  evocation: {
    id: 'evocation',
    label: 'École d\'Évocation',
    description: 'L\'évocation canalise l\'énergie magique pour produire des effets dévastateurs : feu, foudre, froid, acide.',
    features: [
      {
        level: 2,
        title: 'Évocation savante',
        description: 'Le temps et l\'or pour copier un sort d\'évocation dans votre grimoire sont divisés par deux.',
      },
      {
        level: 2,
        title: 'Sculter les sorts',
        description: 'Quand vous lancez un sort d\'évocation affectant d\'autres créatures visibles, choisissez-en jusqu\'à 1 + niveau du sort. Elles réussissent automatiquement leur JdS et ne subissent aucun dégât.',
      },
      {
        level: 6,
        title: 'Cantrip puissant',
        description: 'Vos cantrips infligeant des dégâts affectent même les créatures qui réussissent leur JdS : elles subissent la moitié des dégâts.',
      },
      {
        level: 10,
        title: 'Évocation renforcée',
        description: 'Ajoutez votre modificateur d\'Intelligence à un jet de dégâts de vos sorts d\'évocation.',
      },
      {
        level: 14,
        title: 'Surcharge',
        description: 'Quand vous lancez un sort d\'évocation de magicien de niv 1-5 infligeant des dégâts, maximisez tous les dés de dégâts. 1ère utilisation gratuite par repos long, les suivantes infligent 2d12 nécrotiques par niveau du sort.',
      },
    ],
  },
  illusion: {
    id: 'illusion',
    label: 'École d\'Illusion',
    description: 'L\'illusion trompe les sens et l\'esprit, créant des images, sons et sensations fictives.',
    features: [
      {
        level: 2,
        title: 'Illusion savante',
        description: 'Le temps et l\'or pour copier un sort d\'illusion dans votre grimoire sont divisés par deux.',
      },
      {
        level: 2,
        title: 'Illusion mineure améliorée',
        description: 'Vous apprenez le cantrip Illusion mineure (ne compte pas dans vos cantrips). Quand vous le lancez, vous pouvez créer son ET image simultanément.',
      },
      {
        level: 6,
        title: 'Illusions malléables',
        description: 'Quand vous lancez une illusion durant 1 min+, utilisez votre action pour en changer la nature (dans les limites du sort).',
      },
      {
        level: 10,
        title: 'Alter ego illusoire',
        description: 'Réaction. Quand une créature vous attaque, interposez un double illusoire. L\'attaque rate automatiquement. 1 utilisation par repos court/long.',
      },
      {
        level: 14,
        title: 'Réalité illusoire',
        description: 'Action bonus. Quand vous lancez une illusion de niv 1+, rendez un objet inanimé non-magique de l\'illusion réel pendant 1 minute. L\'objet ne peut pas infliger de dégâts directement.',
      },
    ],
  },
  invocation: {
    id: 'invocation',
    label: 'École d\'Invocation',
    description: 'L\'invocation permet de téléporter des objets, des créatures et de l\'énergie magique d\'un endroit à un autre.',
    features: [
      {
        level: 2,
        title: 'Invocation savante',
        description: 'Le temps et l\'or pour copier un sort d\'invocation dans votre grimoire sont divisés par deux.',
      },
      {
        level: 2,
        title: 'Invocation mineure',
        description: 'Action. Invoquez un objet non-magique inanimé dans votre main (max 1m de côté, 5 kg). Il brille faiblement et disparaît après 1h ou si endommagé.',
      },
      {
        level: 6,
        title: 'Transposition bienveillante',
        description: 'Action. Téléportez-vous à 9m dans un espace inoccupé visible, ou échangez votre place avec une créature consentante de taille P ou M. 1 utilisation par repos long ou sort d\'invocation niv 1+.',
      },
      {
        level: 10,
        title: 'Invocation concentrée',
        description: 'Votre concentration sur les sorts d\'invocation ne peut pas être brisée par des dégâts subis.',
      },
      {
        level: 14,
        title: 'Invocations durables',
        description: 'Les créatures que vous invoquez ou créez avec des sorts d\'invocation gagnent 30 points de vie temporaires.',
      },
    ],
  },
  necromancie: {
    id: 'necromancie',
    label: 'École de Nécromancie',
    description: 'La nécromancie explore les forces cosmiques de la vie, de la mort et de la non-mort.',
    features: [
      {
        level: 2,
        title: 'Nécromancie savante',
        description: 'Le temps et l\'or pour copier un sort de nécromancie dans votre grimoire sont divisés par deux.',
      },
      {
        level: 2,
        title: 'Sinistre moisson',
        description: '1 fois par tour, quand vous tuez une créature avec un sort de niv 1+, récupérez des PV = 2 × niveau du sort (3× si nécromancie). Ne fonctionne pas sur les artificiels et morts-vivants.',
      },
      {
        level: 6,
        title: 'Serviteurs morts-vivants',
        description: 'Animation des morts cible un cadavre supplémentaire. Vos morts-vivants de nécromancie gagnent : PV max + niv Magicien, bonus de maîtrise aux dégâts d\'armes.',
      },
      {
        level: 10,
        title: 'Habitué de la non-mort',
        description: 'Vous avez la résistance aux dégâts nécrotiques. Votre maximum de PV ne peut pas être réduit.',
      },
      {
        level: 14,
        title: 'Contrôle des morts-vivants',
        description: 'Action. Un mort-vivant visible à 18m fait un JdS Charisme. Échec : il vous obéit. Les morts-vivants intelligents (Int 8+) ont l\'avantage ; ceux avec Int 12+ peuvent retenter chaque heure.',
      },
    ],
  },
  transmutation: {
    id: 'transmutation',
    label: 'École de Transmutation',
    description: 'La transmutation modifie l\'énergie et la matière, transformant les propriétés fondamentales des choses.',
    features: [
      {
        level: 2,
        title: 'Transmutation savante',
        description: 'Le temps et l\'or pour copier un sort de transmutation dans votre grimoire sont divisés par deux.',
      },
      {
        level: 2,
        title: 'Alchimie mineure',
        description: 'Transmutez un objet non-magique en bois, pierre, fer, cuivre ou argent en un autre de ces matériaux. 10 min de travail par cube de 30 cm. Revient à l\'original après 1h ou perte de concentration.',
      },
      {
        level: 6,
        title: 'Pierre du transmutateur',
        description: '8h de travail pour créer une pierre octroyant un bénéfice au choix : +3m de vitesse, maîtrise des JdS Constitution, résistance à un type de dégâts, ou vision dans le noir 18m. Changeable à chaque sort de transmutation.',
      },
      {
        level: 10,
        title: 'Changeur de forme',
        description: 'Vous ajoutez Métamorphose à votre grimoire. Lancez-le sans emplacement en vous ciblant uniquement (bête FP 1 max). 1 utilisation par repos court/long.',
      },
      {
        level: 14,
        title: 'Maître transmutateur',
        description: 'Action. Consumez votre pierre pour un effet au choix : Jeunesse (rajeunir de 3d10 ans, min 13), Panacée (guérir maladies/malédictions/poisons + tous les PV), Restauration de la vie (Retour à la vie sans composantes), ou Transformation majeure (transmuter un objet non-magique de 1,5m³).',
      },
    ],
  },
};

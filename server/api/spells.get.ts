import type { ApiSpell, Spell } from '~/types';

const API_URL = 'https://histoiresdetrolls.fr/api/spells';

const ALLOWED_CLASSES = [
  'barde', 'clerc', 'ensorceleur', 'magicien', 'occultiste', 'paladin',
];

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const className = query.class as string | undefined;

  const config = useRuntimeConfig();

  if (!config.trollsApiToken) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Configuration serveur manquante (Token)',
    });
  }

  if (className && !ALLOWED_CLASSES.includes(className.toLowerCase())) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Classe invalide.',
    });
  }

  try {
    const targetUrl = className
      ? `${API_URL}?class=${encodeURIComponent(className)}`
      : API_URL;

    const rawData = await $fetch<ApiSpell[]>(targetUrl, {
      headers: {
        'Authorization': `Bearer ${config.trollsApiToken}`,
        'Content-Type': 'application/json',
      },
    });

    const adaptedSpells: Spell[] = rawData.map((s) => {
      const comps = [];
      if (s.v) comps.push('V');
      if (s.s) comps.push('S');
      if (s.m) comps.push(`M${s.materials ? ` (${s.materials})` : ''}`);

      return {
        id: s.name.toLowerCase().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        nameFr: s.name,
        level: s.level || 0,
        school: s.school || 'Universel',
        castingTime: s.castingTime || 'Inconnu',
        range: s.scope || 'Inconnue',
        components: comps.join(', ') || 'Aucun',
        duration: s.duration || 'Instantanée',
        concentration: s.c || false,
        ritual: s.r || false,
        classes: s.class ? [s.class] : [],
        descriptionFr: s.description || 'Pas de description disponible.',
      };
    });

    return adaptedSpells;
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Impossible de récupérer les sorts du grimoire distant.',
    });
  }
});

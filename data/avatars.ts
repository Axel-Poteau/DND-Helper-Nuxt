export interface AvatarOption {
  id: string
  label: string
  emoji: string
}

export const AVATARS: AvatarOption[] = [
  { id: 'default', label: 'Aventurier', emoji: '⚔️' },
  { id: 'wizard', label: 'Magicien', emoji: '🧙' },
  { id: 'knight', label: 'Chevalier', emoji: '🛡️' },
  { id: 'priest', label: 'Pretre', emoji: '✨' },
  { id: 'fire', label: 'Flamme', emoji: '🔥' },
  { id: 'skull', label: 'Crane', emoji: '💀' },
  { id: 'dragon', label: 'Dragon', emoji: '🐉' },
  { id: 'crown', label: 'Couronne', emoji: '👑' },
  { id: 'star', label: 'Etoile', emoji: '⭐' },
  { id: 'moon', label: 'Lune', emoji: '🌙' },
  { id: 'book', label: 'Grimoire', emoji: '📖' },
  { id: 'crystal', label: 'Cristal', emoji: '🔮' },
]

export function getAvatarEmoji(id: string): string {
  return AVATARS.find(a => a.id === id)?.emoji ?? '⚔️'
}

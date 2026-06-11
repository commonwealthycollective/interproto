import { useTheme } from 'tamagui'
import type { AccentColorDef } from '../types'

export function useAccent() {
  const theme = useTheme()

  const accent = theme.color12.val as string
  const accentMuted = accent + '20'
  const accentLight = accent + '12'
  const def: AccentColorDef = {
    name: '',
    hex: accent,
    gradient: [accent, accent] as [string, string],
  }

  return {
    accent,
    accentMuted,
    accentLight,
    def,
    isGradient: true as const,
  }
}
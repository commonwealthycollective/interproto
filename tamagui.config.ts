import { createTamagui } from 'tamagui'
import { config as baseConfig } from '@tamagui/config'

const config = createTamagui({
  ...baseConfig,
  themes: {
    ...baseConfig.themes,
    light: {
      ...baseConfig.themes.light,
      background: '#FFFCF9',
      color1: '#FFFCF9',
      color2: '#F5F0EB',
      color4: '#E8E0D8',
      color6: '#D4CCC4',
      color8: '#C0B8B0',
      color11: '#8B8580',
      color12: '#1C1917',
      color: '#1C1917',
      borderColor: '#E8E0D8',
    },
    dark: {
      ...baseConfig.themes.dark,
      background: '#0D0B0F',
      color1: '#0D0B0F',
      color2: '#1A171C',
      color4: '#2A2530',
      color6: '#3B3540',
      color8: '#4D4550',
      color11: '#8B8580',
      color12: '#E8E0D8',
      color: '#E8E0D8',
      borderColor: '#2A2530',
    },
  },
})

export default config
export type AppConfig = typeof config
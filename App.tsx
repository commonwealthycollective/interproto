import { useEffect, useState } from 'react'
import { View, useColorScheme } from 'react-native'
import { TamaguiProvider, Theme } from 'tamagui'
import tamaguiConfig from './tamagui.config'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationProvider, useNavigation } from './src/context/NavigationContext'
import * as Font from 'expo-font'
import { DMSans_400Regular, DMSans_600SemiBold, DMSans_700Bold } from '@expo-google-fonts/dm-sans'
import AppShell from './src/components/AppShell'

function ThemedApp() {
  const { state } = useNavigation()
  const systemScheme = useColorScheme()
  const themeName = state.themeOverride ?? systemScheme ?? 'light'

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={themeName}>
      <Theme name={themeName}>
        <AppShell />
      </Theme>
    </TamaguiProvider>
  )
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false)

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({ 'DM Sans': DMSans_400Regular })
      await Font.loadAsync({ 'DM Sans': DMSans_600SemiBold })
      await Font.loadAsync({ 'DM Sans': DMSans_700Bold })
      setFontsLoaded(true)
    }
    loadFonts()
  }, [])

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#fff' }} />
  }

  return (
    <SafeAreaProvider>
      <NavigationProvider>
        <ThemedApp />
      </NavigationProvider>
    </SafeAreaProvider>
  )
}

import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Text, useTheme } from 'tamagui'
import { useNavigation } from '../context/NavigationContext'
import { useAccent } from '../hooks/useAccent'
import { MOCK_VAULTS } from '../constants'
import Icon from '../components/Icon'

export function getTypeIcon(type: string): string {
  switch (type) {
    case 'community': return 'people'
    case 'workspace': return 'store-outline'
    case 'club': return 'star'
    case 'organization': return 'globe-outline'
    default: return 'people'
  }
}

export function getTypeColor(type: string, accent: string): string {
  return accent
}

export default React.memo(function VaultsView() {
  const theme = useTheme()
  const { accent, accentMuted } = useAccent()
  const { state, setVaultFilter } = useNavigation()

  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
      {MOCK_VAULTS.length === 0 && (
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 60 }}>
          <Icon name="layers-outline" size={48} color={accentMuted} />
          <Text style={{ color: accent, fontSize: 14, marginTop: 12 }}>No vaults yet</Text>
        </View>
      )}

      {MOCK_VAULTS.map((vault, index) => (
          <TouchableOpacity key={vault.id}
            onPress={() => setVaultFilter(vault.id === state.currentVaultId ? null : vault.id)}
            activeOpacity={0.8}
          >
            <View style={{
              backgroundColor: theme.color1.val,
              borderRadius: 14,
              padding: 16,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: state.currentVaultId === vault.id ? accent : accentMuted,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
            }}>
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: accentMuted,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Icon name={getTypeIcon(vault.type)} size={24} color={accent} strokeWidth={1.875} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.color12.val, fontWeight: '700', fontSize: 16 }}>{vault.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <Text style={{ color: accent, fontSize: 13, textTransform: 'capitalize' }}>{vault.type}</Text>
                  <Text style={{ color: accentMuted, fontSize: 13 }}> · {vault.fileCount} files</Text>
                </View>
              </View>
              {state.currentVaultId === vault.id && (
                <Icon name="checkmark" size={20} color={accent} strokeWidth={2.4} />
              )}
            </View>
          </TouchableOpacity>
      ))}
    </View>
  )
})
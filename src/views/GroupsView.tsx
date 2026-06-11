import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Text, useTheme } from 'tamagui'
import { useNavigation } from '../context/NavigationContext'
import { useAccent } from '../hooks/useAccent'
import { MOCK_GROUPS } from '../constants'
import Icon from '../components/Icon'

export default React.memo(function GroupsView() {
  const theme = useTheme()
  const { accent, accentMuted } = useAccent()
  const { state, setVaultFilter } = useNavigation()

  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
      {MOCK_GROUPS.length === 0 && (
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 60 }}>
          <Icon name="people" size={48} color={accentMuted} />
          <Text style={{ color: accent, fontSize: 14, marginTop: 12 }}>No groups yet</Text>
        </View>
      )}

      {MOCK_GROUPS.map((group) => (
          <TouchableOpacity key={group.id} onPress={() => setVaultFilter(group.id === state.currentVaultId ? null : group.id)} activeOpacity={0.8}>
            <View style={{
              backgroundColor: theme.color1.val,
              borderRadius: 14,
              padding: 16,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: accentMuted,
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
                <Icon name={group.type === 'community' ? 'people' : group.type === 'workspace' ? 'store-outline' : group.type === 'club' ? 'star' : 'globe-outline'} size={24} color={accent} strokeWidth={1.875} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.color12.val, fontWeight: '700', fontSize: 16 }}>{group.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <Text style={{ color: accent, fontSize: 13 }}>{group.members} members</Text>
                  <Text style={{ color: accentMuted, fontSize: 13 }}> · {group.lastActive}</Text>
                </View>
              </View>
              {group.unread > 0 && (
                <View style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: accent,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{group.unread}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
      ))}
    </View>
  )
})
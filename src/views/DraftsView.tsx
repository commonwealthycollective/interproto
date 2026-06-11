import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Text, useTheme } from 'tamagui'
import { useAccent } from '../hooks/useAccent'
import { MOCK_DRAFTS } from '../constants'
import Icon from '../components/Icon'

export default React.memo(function DraftsView() {
  const theme = useTheme()
  const { accent, accentMuted } = useAccent()

  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
      {MOCK_DRAFTS.length === 0 && (
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 60 }}>
          <Icon name="edit-pencil" size={48} color={accentMuted} />
          <Text style={{ color: accent, fontSize: 14, marginTop: 12 }}>No drafts</Text>
        </View>
      )}

      {MOCK_DRAFTS.map((draft, index) => (
          <View key={draft.id} style={{
            backgroundColor: theme.color1.val,
            borderRadius: 14,
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: accentMuted,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Text style={{ color: theme.color12.val, fontSize: 15, flex: 1, marginRight: 8 }} numberOfLines={3}>{draft.text}</Text>
              <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: accentMuted }}>
                <Text style={{ color: accent, fontWeight: '600', fontSize: 11, textTransform: 'capitalize' }}>{draft.visibility}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 }}>
              <Icon name="edit-pencil" size={16} color={accent} />
              <Text style={{ color: accent, fontSize: 12 }}>{draft.time}</Text>
            </View>
          </View>
      ))}
    </View>
  )
})
import React, { useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Text, useTheme } from 'tamagui'
import { useNavigation } from '../context/NavigationContext'
import { useAccent } from '../hooks/useAccent'
import { MOCK_LIKED, MOCK_PROFILES } from '../constants'
import Icon from '../components/Icon'
import Avatar from '../components/Avatar'

export default React.memo(function LikedView() {
  const theme = useTheme()
  const { accent, accentMuted } = useAccent()
  const { openDetail } = useNavigation()

  const [unliked, setUnliked] = useState<Record<string, boolean>>({})

  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
      {MOCK_LIKED.length === 0 && (
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 60 }}>
          <Icon name="heart-solid" size={48} color={accentMuted} />
          <Text style={{ color: accent, fontSize: 14, marginTop: 12 }}>No liked posts yet</Text>
        </View>
      )}

      {MOCK_LIKED.map((item, index) => {
        const isUnliked = unliked[item.id]
        const author = MOCK_PROFILES[item.author]
        const displayName = author?.displayName ?? item.author
        return (
            <TouchableOpacity key={item.id} onPress={() => { const post = MOCK_LIKED.find((p) => p.originalId === item.id); if (post) openDetail('social', post) }} activeOpacity={0.8}>
              <View style={{
                backgroundColor: theme.color1.val,
                borderRadius: 14,
                padding: 14,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: accentMuted,
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 12,
              }}>
                <Avatar seed={item.author} size={44} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: accent, fontWeight: '700', fontSize: 14 }}>{displayName}</Text>
                  <Text style={{ color: theme.color12.val, fontSize: 14, marginTop: 2 }} numberOfLines={2}>{item.text}</Text>
                  <Text style={{ color: accent, fontSize: 12, marginTop: 4 }}>{item.time}</Text>
                </View>
                <TouchableOpacity onPress={() => setUnliked((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}>
                  <Icon name={isUnliked ? 'heart-outline' : 'heart-solid'} size={22} color={isUnliked ? accent : '#ff3b30'} strokeWidth={2.4} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
        )
      })}
    </View>
  )
})
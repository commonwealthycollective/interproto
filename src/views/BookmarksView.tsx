import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Text, useTheme } from 'tamagui'
import { useNavigation } from '../context/NavigationContext'
import { useAccent } from '../hooks/useAccent'
import { MOCK_BOOKMARKS } from '../constants'
import Icon from '../components/Icon'

export default React.memo(function BookmarksView() {
  const theme = useTheme()
  const { accent, accentMuted } = useAccent()
  const { openDetail } = useNavigation()

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'post': return 'chatbubble-outline'
      case 'event': return 'calendar-outline'
      case 'commerce': return 'shopping-bag'
      default: return 'bookmark'
    }
  }

  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
      {MOCK_BOOKMARKS.length === 0 && (
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 60 }}>
          <Icon name="bookmark" size={48} color={accentMuted} />
          <Text style={{ color: accent, fontSize: 14, marginTop: 12 }}>No bookmarks</Text>
        </View>
      )}

      {MOCK_BOOKMARKS.map((bookmark, index) => (
          <TouchableOpacity key={bookmark.id} onPress={() => openDetail(bookmark.type, bookmark)} activeOpacity={0.8}>
            <View style={{
              backgroundColor: theme.color1.val,
              borderRadius: 14,
              padding: 14,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: accentMuted,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}>
              <View style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: accentMuted,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Icon name={getTypeIcon(bookmark.type)} size={22} color={accent} strokeWidth={1.875} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.color12.val, fontWeight: '700', fontSize: 15 }} numberOfLines={2}>{bookmark.text}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: accentMuted }}>
                    <Text style={{ color: accent, fontWeight: '600', fontSize: 11, textTransform: 'capitalize' }}>{bookmark.type}</Text>
                  </View>
                  {'author' in bookmark && (
                    <Text style={{ color: accent, fontSize: 12 }}>by @{bookmark.author}</Text>
                  )}
                  <Text style={{ color: accentMuted, fontSize: 12 }}>{bookmark.time}</Text>
                </View>
              </View>
              <Icon name="chevron-forward" size={20} color={accentMuted} strokeWidth={1.875} />
            </View>
          </TouchableOpacity>
      ))}
    </View>
  )
})
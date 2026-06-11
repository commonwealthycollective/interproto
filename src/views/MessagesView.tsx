import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Text, useTheme } from 'tamagui'
import { useNavigation } from '../context/NavigationContext'
import { useAccent } from '../hooks/useAccent'
import { MOCK_MESSAGES, MOCK_PROFILES } from '../constants'
import Icon from '../components/Icon'
import Avatar from '../components/Avatar'

export default React.memo(function MessagesView() {
  const theme = useTheme()
  const { accent, accentMuted } = useAccent()
  const { openDetail } = useNavigation()

  const conversations = Object.keys(MOCK_MESSAGES).map((username) => {
    const messages = MOCK_MESSAGES[username]
    const lastMessage = messages[messages.length - 1]
    const profile = MOCK_PROFILES[username]
    return {
      username,
      displayName: profile?.displayName ?? username,
      lastMessage,
      unread: messages.filter((m) => !m.isOutgoing && m.status !== 'read').length,
      lastTime: lastMessage.time,
    }
  })

  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
      {conversations.length === 0 && (
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 60 }}>
          <Icon name="chatbubble-outline" size={48} color={accentMuted} />
          <Text style={{ color: accent, fontSize: 14, marginTop: 12 }}>No conversations yet</Text>
        </View>
      )}

      {conversations.map((conv, index) => (
          <TouchableOpacity key={conv.username} onPress={() => openDetail('messages', conv)} activeOpacity={0.8}>
            <View style={{
              backgroundColor: theme.color1.val,
              borderRadius: 14,
              padding: 14,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: accentMuted,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}>
              <Avatar seed={conv.username} size={48} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: theme.color12.val, fontWeight: '700', fontSize: 15 }}>{conv.displayName}</Text>
                  <Text style={{ color: accent, fontSize: 12 }}>{conv.lastTime}</Text>
                </View>
                <Text style={{ color: accent, fontSize: 13, marginTop: 2 }} numberOfLines={1}>{conv.lastMessage.text}</Text>
              </View>
              {conv.unread > 0 && (
                <View style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: accent,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{conv.unread}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
      ))}
    </View>
  )
})
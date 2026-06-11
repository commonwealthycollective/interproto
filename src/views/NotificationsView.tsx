import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Text, useTheme } from 'tamagui'
import { useNavigation } from '../context/NavigationContext'
import { useAccent } from '../hooks/useAccent'
import { MOCK_NOTIFICATIONS, MOCK_PROFILES } from '../constants'
import Icon from '../components/Icon'
import Avatar from '../components/Avatar'

export default React.memo(function NotificationsView() {
  const theme = useTheme()
  const { accent, accentMuted } = useAccent()
  const { state } = useNavigation()

  const filteredNotifications = state.currentVaultId
    ? MOCK_NOTIFICATIONS.filter(() => true)
    : MOCK_NOTIFICATIONS

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return 'heart-outline'
      case 'comment': return 'chatbubble-outline'
      case 'repost': return 'repeat'
      case 'rsvp': return 'calendar-outline'
      default: return 'bell'
    }
  }

  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
      {filteredNotifications.length === 0 && (
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 60 }}>
          <Icon name="bell" size={48} color={accentMuted} />
          <Text style={{ color: accent, fontSize: 14, marginTop: 12 }}>No notifications</Text>
        </View>
      )}

      {filteredNotifications.map((notification, index) => {
        const user = MOCK_PROFILES[notification.fromUser]
        const displayName = user?.displayName ?? notification.fromUser
        return (
            <View key={notification.id} style={{
              backgroundColor: theme.color1.val,
              borderRadius: 14,
              padding: 14,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: accentMuted,
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 12,
            }}>
              <TouchableOpacity>
                <Avatar seed={notification.fromUser} size={44} />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ color: accent, fontWeight: '700', fontSize: 14 }}>{displayName}</Text>
                  <Text style={{ color: accent, fontSize: 14 }}>{notification.text}</Text>
                </View>
                <Text style={{ color: accentMuted, fontSize: 12, marginTop: 2 }}>{notification.time}</Text>
              </View>
              <Icon name={getNotificationIcon(notification.type)} size={20} color={accent} strokeWidth={2.4} />
            </View>
        )
      })}
    </View>
  )
})
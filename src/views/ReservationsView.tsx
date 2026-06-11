import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Text, useTheme } from 'tamagui'
import { useAccent } from '../hooks/useAccent'
import { MOCK_RESERVATIONS } from '../constants'
import Icon from '../components/Icon'

export default React.memo(function ReservationsView() {
  const theme = useTheme()
  const { accent, accentMuted } = useAccent()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#10B981'
      case 'pending': return '#D97706'
      case 'cancelled': return '#DC2626'
      default: return accent
    }
  }

  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
      {MOCK_RESERVATIONS.length === 0 && (
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 60 }}>
          <Icon name="calendar-outline" size={48} color={accentMuted} />
          <Text style={{ color: accent, fontSize: 14, marginTop: 12 }}>No reservations</Text>
        </View>
      )}

      {MOCK_RESERVATIONS.map((reservation, index) => (
          <View key={reservation.id} style={{
            backgroundColor: theme.color1.val,
            borderRadius: 14,
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: accentMuted,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.color12.val, fontWeight: '700', fontSize: 16 }}>{reservation.title}</Text>
                <Text style={{ color: accent, fontSize: 13, marginTop: 4 }}>{reservation.date} · {reservation.time}</Text>
              </View>
              <View style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 12,
                backgroundColor: getStatusColor(reservation.status) + '20',
              }}>
                <Text style={{ color: getStatusColor(reservation.status), fontWeight: '600', fontSize: 12, textTransform: 'capitalize' }}>{reservation.status}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 }}>
              <Icon name="calendar-check" size={16} color={accent} />
              <Text style={{ color: accent, fontSize: 13 }}>View ticket</Text>
            </View>
          </View>
      ))}
    </View>
  )
})
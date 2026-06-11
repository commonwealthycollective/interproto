import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Text, useTheme } from 'tamagui'
import { useAccent } from '../hooks/useAccent'
import { MOCK_ORDERS, MOCK_PROFILES } from '../constants'
import Icon from '../components/Icon'
import Avatar from '../components/Avatar'

export default React.memo(function OrdersView() {
  const theme = useTheme()
  const { accent, accentMuted } = useAccent()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'shipped': return 'truck'
      case 'delivered': return 'checkmark-circle'
      case 'processing': return 'clock'
      default: return 'package'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'shipped': return '#0891B2'
      case 'delivered': return '#10B981'
      case 'processing': return '#D97706'
      default: return accent
    }
  }

  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
      {MOCK_ORDERS.length === 0 && (
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 60 }}>
          <Icon name="shopping-bag" size={48} color={accentMuted} />
          <Text style={{ color: accent, fontSize: 14, marginTop: 12 }}>No orders</Text>
        </View>
      )}

      {MOCK_ORDERS.map((order, index) => (
          <View key={order.id} style={{
            backgroundColor: theme.color1.val,
            borderRadius: 14,
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: accentMuted,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.color12.val, fontWeight: '700', fontSize: 16 }}>{order.item}</Text>
                <Text style={{ color: accent, fontSize: 14, fontWeight: '700', marginTop: 4 }}>{order.price}</Text>
              </View>
              <View style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 12,
                backgroundColor: getStatusColor(order.status) + '20',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}>
                <Icon name={getStatusIcon(order.status)} size={14} color={getStatusColor(order.status)} />
                <Text style={{ color: getStatusColor(order.status), fontWeight: '600', fontSize: 12, textTransform: 'capitalize' }}>{order.status}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 }}>
              <Avatar seed={order.seller} size={20} />
              <Text style={{ color: accent, fontSize: 12 }}>from @{order.seller}</Text>
              <Text style={{ color: accentMuted, fontSize: 12 }}> · {order.date}</Text>
            </View>
          </View>
      ))}
    </View>
  )
})
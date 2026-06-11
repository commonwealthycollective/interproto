import React, { useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Text, useTheme } from 'tamagui'
import { useAccent } from '../hooks/useAccent'
import { MOCK_FAQ } from '../constants'
import Icon from '../components/Icon'

export default React.memo(function HelpView() {
  const theme = useTheme()
  const { accent, accentMuted } = useAccent()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
      <Text style={{ color: accent, fontSize: 14, marginBottom: 16 }}>Frequently asked questions</Text>

      {MOCK_FAQ.map((faq, index) => (
          <TouchableOpacity key={faq.id} onPress={() => toggleExpand(faq.id)} activeOpacity={0.8}>
            <View style={{
              backgroundColor: theme.color1.val,
              borderRadius: 14,
              padding: 16,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: accentMuted,
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: theme.color12.val, fontWeight: '700', fontSize: 15, flex: 1, marginRight: 12 }}>{faq.question}</Text>
                <Icon
                  name={expanded[faq.id] ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={accent}
                  strokeWidth={1.875}
                />
              </View>
              {expanded[faq.id] && (
                <Text style={{ color: accent, fontSize: 14, marginTop: 10, lineHeight: 20 }}>{faq.answer}</Text>
              )}
            </View>
          </TouchableOpacity>
      ))}
    </View>
  )
})
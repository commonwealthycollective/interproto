import React, { useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Text, useTheme } from 'tamagui'
import { useAccent } from '../hooks/useAccent'
import { MOCK_LANGUAGES } from '../constants'
import Icon from '../components/Icon'

export default React.memo(function LanguageView() {
  const theme = useTheme()
  const { accent, accentMuted } = useAccent()
  const [languages, setLanguages] = useState(MOCK_LANGUAGES)

  const selectLanguage = (id: string) => {
    setLanguages((prev) => prev.map((l) => ({ ...l, selected: l.id === id })))
  }

  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
      <Text style={{ color: accent, fontSize: 14, marginBottom: 16 }}>Select your preferred language</Text>
      {languages.map((lang, index) => (
          <TouchableOpacity key={lang.id} onPress={() => selectLanguage(lang.id)} activeOpacity={0.8}>
            <View style={{
              backgroundColor: theme.color1.val,
              borderRadius: 14,
              padding: 16,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: lang.selected ? accent : accentMuted,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Icon name="globe-outline" size={22} color={lang.selected ? accent : accentMuted} strokeWidth={1.875} />
                <View>
                  <Text style={{ color: theme.color12.val, fontWeight: '600', fontSize: 16 }}>{lang.label}</Text>
                  <Text style={{ color: accent, fontSize: 12 }}>{lang.code.toUpperCase()}</Text>
                </View>
              </View>
              {lang.selected && (
                <Icon name="checkmark" size={22} color={accent} strokeWidth={2.4} />
              )}
            </View>
          </TouchableOpacity>
      ))}
    </View>
  )
})
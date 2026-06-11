import React, { useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Text, useTheme } from 'tamagui'
import { useAccent } from '../hooks/useAccent'
import Icon from '../components/Icon'

interface ToggleRowProps {
  label: string
  description: string
  value: boolean
  onToggle: () => void
  accent: string
  accentMuted: string
  color1: string
  color12: string
}

function ToggleSwitch({ value, onToggle, accent, accentMuted, color12 }: { value: boolean; onToggle: () => void; accent: string; accentMuted: string; color12: string }) {
  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.8}>
      <View style={{
        width: 48,
        height: 28,
        borderRadius: 14,
        backgroundColor: value ? accent : accentMuted,
        padding: 2,
        justifyContent: value ? 'flex-end' : 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <View style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: color12,
        }} />
      </View>
    </TouchableOpacity>
  )
}

function ToggleRow({ label, description, value, onToggle, accent, accentMuted, color1, color12 }: ToggleRowProps) {
  return (
    <View style={{ backgroundColor: color1, borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: accentMuted }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1, marginRight: 16 }}>
          <Text style={{ color: color12, fontSize: 16, fontWeight: '600' }}>{label}</Text>
          <Text style={{ color: accent, fontSize: 12, marginTop: 2 }}>{description}</Text>
        </View>
        <ToggleSwitch value={value} onToggle={onToggle} accent={accent} accentMuted={accentMuted} color12={color12} />
      </View>
    </View>
  )
}

export default React.memo(function AccessibilityView() {
  const theme = useTheme()
  const { accent, accentMuted } = useAccent()
  const [reduceMotion, setReduceMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [largerText, setLargerText] = useState(false)

  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
      <Text style={{ color: accent, fontSize: 14, marginBottom: 16 }}>Adjust display settings for accessibility</Text>

      <ToggleRow
        label="Reduce Motion"
        description="Minimize animations and transitions"
        value={reduceMotion}
        onToggle={() => setReduceMotion(!reduceMotion)}
        accent={accent}
        accentMuted={accentMuted}
        color1={theme.color1.val}
        color12={theme.color12.val}
      />

      <ToggleRow
        label="High Contrast"
        description="Increase contrast between text and background"
        value={highContrast}
        onToggle={() => setHighContrast(!highContrast)}
        accent={accent}
        accentMuted={accentMuted}
        color1={theme.color1.val}
        color12={theme.color12.val}
      />

      <ToggleRow
        label="Larger Text"
        description="Increase default text size throughout the app"
        value={largerText}
        onToggle={() => setLargerText(!largerText)}
        accent={accent}
        accentMuted={accentMuted}
        color1={theme.color1.val}
        color12={theme.color12.val}
      />
    </View>
  )
})
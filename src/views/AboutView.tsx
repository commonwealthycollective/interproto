import React from 'react'
import { View, TouchableOpacity, Linking } from 'react-native'
import { Text, useTheme } from 'tamagui'
import { useAccent } from '../hooks/useAccent'
import Icon from '../components/Icon'

export default React.memo(function AboutView() {
  const theme = useTheme()
  const { accent, accentMuted } = useAccent()

  const links = [
    { label: 'Terms of Service', icon: 'shield', url: 'https://example.com/terms' },
    { label: 'Privacy Policy', icon: 'lock-closed-outline', url: 'https://example.com/privacy' },
    { label: 'Open Source Licenses', icon: 'globe-outline', url: 'https://example.com/licenses' },
    { label: 'Report a Bug', icon: 'warning-circle', url: 'https://github.com/example/interproto/issues' },
    { label: 'Website', icon: 'link-outline', url: 'https://interproto.app' },
  ]

  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
      <View style={{ alignItems: 'center', paddingTop: 20, paddingBottom: 24 }}>
        <Text style={{ color: theme.color12.val, fontWeight: '700', fontSize: 24 }}>Interproto</Text>
        <Text style={{ color: accent, fontSize: 14, marginTop: 4 }}>Version 1.0.0</Text>
        <Text style={{ color: accent, fontSize: 12, marginTop: 2 }}>Local-first community platform</Text>
      </View>

      {links.map((link, index) => (
          <TouchableOpacity key={link.label} onPress={() => Linking.openURL(link.url).catch(() => {})} activeOpacity={0.7}>
            <View style={{
              backgroundColor: theme.color1.val,
              borderRadius: 14,
              padding: 16,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: accentMuted,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
            }}>
              <Icon name={link.icon} size={22} color={accent} strokeWidth={1.875} />
              <Text style={{ color: theme.color12.val, fontWeight: '600', fontSize: 15, flex: 1 }}>{link.label}</Text>
              <Icon name="chevron-forward" size={20} color={accentMuted} strokeWidth={1.875} />
            </View>
          </TouchableOpacity>
      ))}

        <View style={{ alignItems: 'center', paddingTop: 24 }}>
          <Text style={{ color: accent, fontSize: 12 }}>Built with React Native & Expo</Text>
          <Text style={{ color: accentMuted, fontSize: 11, marginTop: 4 }}>Data stored locally as markdown files</Text>
        </View>
    </View>
  )
})
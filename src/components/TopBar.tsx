import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Text, useTheme } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '../context/NavigationContext'
import { useAccent } from '../hooks/useAccent'
import { MOCK_VAULTS, TOP_BAR_HEIGHT, PILL_HEIGHT, PILL_MARGIN_BOTTOM } from '../constants'
import Icon from './Icon'

const TopBar = React.memo(function TopBar() {
  const theme = useTheme()
  const { accent } = useAccent()
  const { state, toggleMenu, toggleSearch, toggleFeedPicker } = useNavigation()
  const insets = useSafeAreaInsets()

  const vaultName = state.currentVaultId
    ? MOCK_VAULTS.find(v => v.id === state.currentVaultId)?.name ?? 'All Communities'
    : 'All Communities'

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          height: insets.top + TOP_BAR_HEIGHT,
        },
      ]}
    >
      <View style={styles.row}>
        <TouchableOpacity onPress={toggleMenu} style={styles.iconBtn}>
          <Icon name="menu" size={22} color={accent} strokeWidth={1.875} />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleFeedPicker} style={styles.pill}>
          <Text style={[styles.pillText, { color: accent }]} numberOfLines={1}>
            {vaultName}
          </Text>
        </TouchableOpacity>

        <View style={styles.rightIcons}>
          {state.showFeedPicker ? (
            <TouchableOpacity onPress={toggleSearch} style={styles.iconBtn}>
              <Icon name="plus" size={22} color={accent} strokeWidth={1.875} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={toggleSearch} style={styles.iconBtn}>
              <Icon name={state.showSearch ? 'close' : 'search'} size={22} color={accent} strokeWidth={1.875} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'transparent',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    backgroundColor: '#FFFCF9CC',
    height: PILL_HEIGHT,
    paddingHorizontal: 16,
    borderRadius: PILL_HEIGHT / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: PILL_MARGIN_BOTTOM,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '700',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export default TopBar
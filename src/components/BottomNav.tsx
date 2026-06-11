import React, { useEffect, useMemo, useRef } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View, useColorScheme } from 'react-native'
import { Animated } from 'react-native'
import { Text, useTheme } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '../context/NavigationContext'
import { useNavCollapse } from '../context/NavCollapseContext'
import { useAccent } from '../hooks/useAccent'
import { MAIN_VIEW_IDS, SUB_VIEW_IDS } from '../constants'
import type { ViewId } from '../types'
import Icon from './Icon'

const NAV_HEIGHT = 40
const PILL_H_MARGIN = 16
const PILL_BORDER_RADIUS = 24

const LIGHT_BG = '#FFFCF9'
const DARK_BG = '#0D0B0F'

const BottomNav = React.memo(function BottomNav() {
  const theme = useTheme()
  const colorScheme = useColorScheme()
  const oppositeBg = colorScheme === 'dark' ? LIGHT_BG : DARK_BG
  const oppositeFg = colorScheme === 'dark' ? '#1C1917' : '#E8E0D8'
  const { accent, accentMuted } = useAccent()
  const { state, switchView, toggleActionDrawer } = useNavigation()
  const { navCollapseAnim } = useNavCollapse()
  const insets = useSafeAreaInsets()
  const totalNavHeight = NAV_HEIGHT + 8

  const scrollViewRef = useRef<ScrollView>(null)
  const fadeAnim = useRef(new Animated.Value(1)).current
  const detailAnim = useRef(new Animated.Value(1)).current
  const drawerAnim = useRef(new Animated.Value(1)).current
  const navAnim = useRef(new Animated.Value(0)).current
  const menuNavAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(navAnim, {
      toValue: state.forceNavHidden ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start()
  }, [state.forceNavHidden])

  useEffect(() => {
    Animated.timing(detailAnim, {
      toValue: state.detail ? 0 : 1,
      duration: 150,
      useNativeDriver: true,
    }).start()
  }, [state.detail])

  useEffect(() => {
    Animated.timing(drawerAnim, {
      toValue: state.showActionDrawer ? 0 : 1,
      duration: 150,
      useNativeDriver: true,
    }).start()
  }, [state.showActionDrawer])

  useEffect(() => {
    Animated.timing(menuNavAnim, {
      toValue: state.showMenu ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start()
  }, [state.showMenu])

  const baseOpacity = useMemo(() => Animated.multiply(
    Animated.multiply(
      Animated.multiply(fadeAnim, detailAnim),
      drawerAnim,
    ),
    menuNavAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
  ), [fadeAnim, detailAnim, drawerAnim, menuNavAnim])

  const navOpacity = useMemo(() => Animated.multiply(
    baseOpacity,
    Animated.multiply(
      navCollapseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
      navAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
    ),
  ), [baseOpacity, navCollapseAnim, navAnim])

  const actionBtnSize = 40

  if (SUB_VIEW_IDS.includes(state.currentView as ViewId)) return null

  return (
    <View style={{ position: 'absolute', left: PILL_H_MARGIN, right: PILL_H_MARGIN, bottom: insets.bottom + 8, flexDirection: 'row', alignItems: 'center', zIndex: 999 }}>
      <Animated.View style={{ flex: 1, height: totalNavHeight, borderRadius: PILL_BORDER_RADIUS, overflow: 'hidden', opacity: navOpacity, backgroundColor: oppositeBg + 'E6' }}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          contentContainerStyle={styles.scrollContent}
        >
          {MAIN_VIEW_IDS.map((id) => {
            const isActive = id === state.currentView
            return (
              <TouchableOpacity
                key={id}
                onPress={() => switchView(id as any)}
                style={{ height: totalNavHeight, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: oppositeFg,
                    opacity: isActive ? 1 : 0.7,
                    textTransform: 'lowercase' as const,
                  }}
                  numberOfLines={1}
                >
                  {id}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </Animated.View>
      <View style={{ width: 24 }} />
      <Animated.View style={{ opacity: baseOpacity }}>
        <TouchableOpacity
          onPress={() => toggleActionDrawer('post')}
          style={{ width: actionBtnSize, height: actionBtnSize, borderRadius: actionBtnSize / 2, borderWidth: 1, borderColor: accentMuted, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: oppositeBg + 'E6' }}
        >
          <Icon name="plus" size={20} color={oppositeFg} strokeWidth={1.875} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
})

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
  },
})

export default BottomNav
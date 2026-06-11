import React, { useState, useMemo, useRef } from 'react'
import { View, TouchableOpacity, StyleSheet, Animated, Modal, ScrollView, Dimensions } from 'react-native'
import { Text, useTheme } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '../context/NavigationContext'
import { useAccent } from '../hooks/useAccent'
import { SUB_VIEW_IDS } from '../constants'
import Icon from './Icon'
import Avatar from './Avatar'
import type { ViewId } from '../types'

const SCREEN_WIDTH = Dimensions.get('window').width

interface MenuDrawerProps {
  menuAnim: Animated.Value
}

const MENU_ITEMS: { label: string; viewId: ViewId }[] = [
  { label: 'Vaults', viewId: 'vaults' },
  { label: 'Liked', viewId: 'liked' },
  { label: 'Reservations', viewId: 'reservations' },
  { label: 'Bookmarks', viewId: 'bookmarks' },
  { label: 'Drafts', viewId: 'drafts' },
  { label: 'Orders', viewId: 'orders' },
  { label: 'Language', viewId: 'language' },
  { label: 'Accessibility', viewId: 'accessibility' },
  { label: 'Help', viewId: 'help' },
  { label: 'About', viewId: 'about' },
]

const PROFILE_OPTIONS = ['screennam3', 'alex_c', 'mayalee']

const MenuDrawer = React.memo(function MenuDrawer({ menuAnim }: MenuDrawerProps) {
  const theme = useTheme()
  const { accent, accentMuted } = useAccent()
  const { state, dispatch, switchView, hideMenu, openDetail, openDrawer } = useNavigation()
  const insets = useSafeAreaInsets()
  const prevViewRef = useRef<ViewId | null>(null)
  const [showProfiles, setShowProfiles] = useState(false)

  const backdropOpacity = useMemo(() => menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  }), [menuAnim])

  const contentTranslateX = useMemo(() => menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, 0],
  }), [menuAnim])

  const handleMenuItem = (viewId: ViewId) => {
    if (SUB_VIEW_IDS.includes(viewId)) {
      prevViewRef.current = state.currentView
    }
    hideMenu()
    switchView(viewId)
  }

  const handleClose = () => {
    hideMenu()
    if (prevViewRef.current && SUB_VIEW_IDS.includes(state.currentView as ViewId)) {
      switchView(prevViewRef.current)
      prevViewRef.current = null
    }
  }

  const handleEditProfile = () => {
    hideMenu()
    openDrawer('editProfile')
  }

  const handleOpenProfile = () => {
    hideMenu()
    const profile = { username: 'screennam3', displayName: 'Jordan Rivera', bio: 'Running trails & river views. Eastside Runners co-organizer.', followers: 312, following: 189, communities: ['Eastside Runners', 'Downtown Hub'] }
    openDetail('profile', profile)
  }

  const handleThemeToggle = () => {
    const isDark = (state.themeOverride ?? 'light') === 'dark'
    dispatch({ type: 'SET_THEME_OVERRIDE', theme: isDark ? 'light' : 'dark' })
  }

  if (!state.showMenu) return null

  const isDark = (state.themeOverride ?? 'light') === 'dark'

  return (
    <View style={styles.container} pointerEvents={state.showMenu ? 'auto' : 'none'}>
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={hideMenu}
        />
      </Animated.View>

      <Animated.View style={[styles.content, { transform: [{ translateX: contentTranslateX }], backgroundColor: theme.background.val, paddingTop: insets.top }]}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Icon name="close" size={22} color={accent} strokeWidth={1.875} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleOpenProfile} style={styles.avatarWrap}>
              <Avatar seed="screennam3" size={72} />
            </TouchableOpacity>

            <Text style={[styles.username, { color: theme.color12.val }]}>screennam3</Text>
            <Text style={[styles.bio, { color: accent }]}>Running trails & river views</Text>

            <View style={styles.pillRow}>
              <TouchableOpacity onPress={handleEditProfile} style={[styles.pill, { backgroundColor: accentMuted }]}>
                <Text style={[styles.pillText, { color: accent }]}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleOpenProfile} style={[styles.pill, { backgroundColor: accentMuted }]}>
                <Text style={[styles.pillText, { color: accent }]}>Share Profile</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.separator, { backgroundColor: accentMuted }]} />

          {MENU_ITEMS.map(item => (
            <TouchableOpacity
              key={item.viewId}
              onPress={() => handleMenuItem(item.viewId)}
              style={styles.menuItem}
            >
              <Text style={[styles.menuItemText, { color: theme.color12.val }]}>{item.label}</Text>
            </TouchableOpacity>
          ))}

          <View style={{ flex: 1 }} />

          <View style={[styles.separator, { backgroundColor: accentMuted }]} />

          <TouchableOpacity
            onPress={() => setShowProfiles(true)}
            style={styles.menuItem}
          >
            <Text style={[styles.menuItemText, { color: theme.color12.val }]}>Switch Profiles</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={[styles.bottomSection, { paddingBottom: insets.bottom }]}>
          <View style={styles.bottomRow}>
            <TouchableOpacity style={styles.logoutBtn}>
              <Text style={styles.logoutText}>Log out</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleThemeToggle} style={[styles.themeToggleBtn, { backgroundColor: isDark ? '#fff' : '#000' }]}>
              <Text style={[styles.themeToggleText, { color: isDark ? '#000' : '#fff' }]}>{isDark ? 'Light' : 'Dark'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <Modal visible={showProfiles} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => setShowProfiles(false)} />
          <View style={[styles.modalContent, { backgroundColor: theme.color1.val, paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.color12.val }]}>Switch Profile</Text>
              <TouchableOpacity onPress={() => setShowProfiles(false)}>
                <Icon name="close" size={24} color={accent} />
              </TouchableOpacity>
            </View>
            {PROFILE_OPTIONS.map(username => (
              <TouchableOpacity
                key={username}
                onPress={() => {
                  setShowProfiles(false)
                  hideMenu()
                  const profileMap: Record<string, any> = {
                    screennam3: { username: 'screennam3', displayName: 'Jordan Rivera', bio: 'Running trails & river views. Eastside Runners co-organizer.', followers: 312, following: 189, communities: ['Eastside Runners', 'Downtown Hub'] },
                    alex_c: { username: 'alex_c', displayName: 'Alex Chen', bio: 'Community organizer. Garden enthusiast. Building one bed at a time.', followers: 524, following: 203, communities: ['Downtown Hub', 'Green Initiative'] },
                    mayalee: { username: 'mayalee', displayName: 'Maya Lee', bio: 'Bike commuter. Neighborhood safety advocate. Always asking for recs.', followers: 278, following: 145, communities: ['Downtown Hub'] },
                  }
                  openDetail('profile', profileMap[username])
                }}
                style={styles.profileItem}
              >
                <Avatar seed={username} size={36} />
                <Text style={[styles.profileName, { color: theme.color12.val }]}>@{username}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 500,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: SCREEN_WIDTH,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  closeBtn: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  avatarWrap: {
    marginBottom: 8,
  },
  username: {
    fontWeight: '700',
    fontSize: 20,
    textAlign: 'center',
  },
  bio: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 12,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    padding: 8,
    borderRadius: 20,
  },
  pillText: {
    fontWeight: '600',
    fontSize: 13,
  },
  separator: {
    height: 1,
    marginHorizontal: 16,
  },
  menuItem: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '400',
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeToggleBtn: {
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeToggleText: {
    fontWeight: '700',
    fontSize: 15,
  },
  logoutBtn: {
    paddingVertical: 8,
  },
  logoutText: {
    color: '#ff3b30',
    fontWeight: '600',
    fontSize: 15,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontWeight: '700',
    fontSize: 18,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  profileName: {
    fontWeight: '600',
    fontSize: 15,
  },
})

export default MenuDrawer

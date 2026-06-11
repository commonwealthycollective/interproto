import React, { useState, useMemo } from 'react'
import { View, TouchableOpacity, StyleSheet, Animated, Modal, ScrollView } from 'react-native'
import { Text, useTheme } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '../context/NavigationContext'
import { useAccent } from '../hooks/useAccent'
import Icon from './Icon'
import Avatar from './Avatar'
import type { ViewId } from '../types'

interface MenuDrawerProps {
  menuAnim: Animated.Value
}

const MENU_ITEMS: { label: string; viewId: ViewId; icon: string }[] = [
  { label: 'Liked', viewId: 'liked', icon: 'heart-outline' },
  { label: 'Reservations', viewId: 'reservations', icon: 'calendar-outline' },
  { label: 'Bookmarks', viewId: 'bookmarks', icon: 'pin' },
  { label: 'Drafts', viewId: 'drafts', icon: 'layers-outline' },
  { label: 'Orders', viewId: 'orders', icon: 'store-outline' },
  { label: 'Language', viewId: 'language', icon: 'globe-outline' },
  { label: 'Accessibility', viewId: 'accessibility', icon: 'accessibility' },
  { label: 'Help', viewId: 'help', icon: 'help-circle' },
  { label: 'About', viewId: 'about', icon: 'chatbubble-outline' },
]

const PROFILE_OPTIONS = ['screennam3', 'alex_c', 'mayalee']

const MenuDrawer = React.memo(function MenuDrawer({ menuAnim }: MenuDrawerProps) {
  const theme = useTheme()
  const { accent, accentMuted, def } = useAccent()
  const { state, dispatch, switchView, hideMenu, openDetail, openDrawer } = useNavigation()
  const insets = useSafeAreaInsets()
  const [showProfiles, setShowProfiles] = useState(false)

  const backdropOpacity = useMemo(() => menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  }), [menuAnim])

  const contentScale = useMemo(() => menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  }), [menuAnim])

  const handleMenuItem = (viewId: ViewId) => {
    hideMenu()
    switchView(viewId)
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

  const handleThemeToggle = (themeOverride: 'light' | 'dark' | null) => {
    dispatch({ type: 'SET_THEME_OVERRIDE', theme: themeOverride })
  }

  if (!state.showMenu) return null

  return (
    <View style={styles.container} pointerEvents={state.showMenu ? 'auto' : 'none'}>
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={hideMenu}
        />
      </Animated.View>

      <Animated.View style={[styles.content, { transform: [{ scale: contentScale }], backgroundColor: theme.background.val, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <TouchableOpacity onPress={handleOpenProfile} style={styles.headerLeft}>
                <Avatar seed="screennam3" size={48} />
                <Text style={[styles.username, { color: theme.color12.val }]}>screennam3</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={hideMenu}>
                <Icon name="close" size={24} color={accent} />
              </TouchableOpacity>
            </View>

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
              <Icon name={item.icon} size={22} color={accent} strokeWidth={1.875} />
              <Text style={[styles.menuItemText, { color: theme.color12.val }]}>{item.label}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={() => setShowProfiles(true)}
            style={styles.menuItem}
          >
            <Icon name="people" size={22} color={accent} strokeWidth={1.875} />
            <Text style={[styles.menuItemText, { color: theme.color12.val }]}>Switch Profiles</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={[styles.bottomSeparator, { backgroundColor: accentMuted }]} />

        <View style={styles.bottomSection}>
          <View style={styles.themeRow}>
            <View style={styles.themeToggle}>
              <TouchableOpacity
                onPress={() => handleThemeToggle(state.themeOverride === 'light' ? null : 'light')}
                style={[styles.themeBtn, styles.themeBtnLeft, { backgroundColor: state.themeOverride === 'light' ? 'transparent' : accentMuted, overflow: 'hidden' }]}
              >
                {state.themeOverride === 'light' && (
                  <View style={StyleSheet.absoluteFill}>
                    <LinearGradient colors={def.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
                  </View>
                )}
                <Text style={[styles.themeBtnText, { color: state.themeOverride === 'light' ? (def.name === 'White' ? theme.color12.val : '#fff') : accent }]}>Light</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleThemeToggle(state.themeOverride === 'dark' ? null : 'dark')}
                style={[styles.themeBtn, styles.themeBtnRight, { backgroundColor: state.themeOverride === 'dark' ? 'transparent' : accentMuted, overflow: 'hidden' }]}
              >
                {state.themeOverride === 'dark' && (
                  <View style={StyleSheet.absoluteFill}>
                    <LinearGradient colors={def.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
                  </View>
                )}
                <Text style={[styles.themeBtnText, { color: state.themeOverride === 'dark' ? (def.name === 'White' ? theme.color12.val : '#fff') : accent }]}>Dark</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.accentCircle, { backgroundColor: accent }]} />
          </View>

          <TouchableOpacity style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
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
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    marginBottom: 4,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  username: {
    fontWeight: '700',
    fontSize: 18,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSeparator: {
    height: 1,
    marginHorizontal: 16,
  },
  bottomSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  themeToggle: {
    flexDirection: 'row',
    height: 40,
    borderRadius: 10,
    overflow: 'hidden',
  },
  themeBtn: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeBtnLeft: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  themeBtnRight: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  themeBtnText: {
    fontWeight: '700',
    fontSize: 14,
    zIndex: 1,
  },
  accentCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
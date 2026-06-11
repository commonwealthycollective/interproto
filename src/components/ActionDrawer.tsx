import React, { useRef, useState, useCallback, useEffect, useLayoutEffect } from 'react'
import {
  View,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { YStack, XStack, Text } from 'tamagui'
import { useTheme } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '../context/NavigationContext'
import { useAccent } from '../hooks/useAccent'
import { ACCENT_COLORS, MOCK_VAULTS } from '../constants'
import Icon from './Icon'
import Avatar from './Avatar'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height
const DRAWER_FULL_HEIGHT = SCREEN_HEIGHT
const DRAWER_COMPACT_HEIGHT = 60

interface ActionDrawerProps {
  drawerAnim: Animated.Value
}

export default function ActionDrawer({ drawerAnim }: ActionDrawerProps) {
  const { state, dispatch, hideActionDrawer, toggleActionDrawer, openDrawer, hideViewMenu, setPostContentPresent, setPostVisibility, setQuotedPost, setMapsAction, setPreselectMapsSection, setForceNavHidden } = useNavigation()
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const { accent, accentMuted, accentLight, def, isGradient } = useAccent()

  const [postText, setPostText] = useState('')
  const [threadPosts, setThreadPosts] = useState<string[]>([])
  const [isPrivate, setIsPrivate] = useState(false)
  const [isLongForm, setIsLongForm] = useState(false)
  const [longFormTitle, setLongFormTitle] = useState('')
  const [isSchedule, setIsSchedule] = useState(false)
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [showSchedulePicker, setShowSchedulePicker] = useState(false)

  const [mapsSearchQuery, setMapsSearchQuery] = useState('')
  const [mapsMode, setMapsMode] = useState<'search' | 'directions' | 'addPin'>('search')
  const [selectedEmoji, setSelectedEmoji] = useState('📍')
  const [pinText, setPinText] = useState('')
  const [directionsFrom, setDirectionsFrom] = useState('')
  const [directionsTo, setDirectionsTo] = useState('')
  const [directionsMode, setDirectionsMode] = useState('car')

  const [editName, setEditName] = useState('Jordan Rivera')
  const [editUsername, setEditUsername] = useState('screennam3')
  const [editBio, setEditBio] = useState('Running trails & river views.')
  const [editImage, setEditImage] = useState<string | null>(null)

  const [autocompleteResults, setAutocompleteResults] = useState<{ name: string; address: string }[]>([])

  const drawerY = useRef(new Animated.Value(DRAWER_FULL_HEIGHT)).current
  const backdropOpacity = useRef(new Animated.Value(0)).current
  const panStartY = useRef(0)
  const isAnimating = useRef(false)

  const hideActionDrawerLocal = useCallback(() => {
    if (isAnimating.current) return
    isAnimating.current = true
    Animated.parallel([
      Animated.timing(drawerY, { toValue: DRAWER_FULL_HEIGHT, duration: 200, useNativeDriver: false }),
      Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: false }),
    ]).start(() => {
      isAnimating.current = false
      hideActionDrawer()
    })
  }, [hideActionDrawer])

  const expandDrawer = useCallback(() => {
    if (isAnimating.current) return
    isAnimating.current = true
    Animated.parallel([
      Animated.timing(drawerY, { toValue: 0, duration: 200, useNativeDriver: false }),
      Animated.timing(backdropOpacity, { toValue: 0.5, duration: 200, useNativeDriver: false }),
    ]).start(() => { isAnimating.current = false })
  }, [])

  const collapseToCompact = useCallback(() => {
    if (isAnimating.current) return
    isAnimating.current = true
    Animated.parallel([
      Animated.timing(drawerY, { toValue: DRAWER_FULL_HEIGHT - DRAWER_COMPACT_HEIGHT, duration: 200, useNativeDriver: false }),
      Animated.timing(backdropOpacity, { toValue: 0.3, duration: 200, useNativeDriver: false }),
    ]).start(() => { isAnimating.current = false })
  }, [])

  const fnRefs = useRef({ hide: hideActionDrawerLocal, expand: expandDrawer, collapse: collapseToCompact })
  useLayoutEffect(() => {
    fnRefs.current = { hide: hideActionDrawerLocal, expand: expandDrawer, collapse: collapseToCompact }
  })

  useEffect(() => {
    if (state.showActionDrawer) {
      expandDrawer()
    }
  }, [state.showActionDrawer])

  useEffect(() => {
    contentInputRef.current?.focus()
  }, [state.showActionDrawer])

  useEffect(() => {
    if (state.quotedPost) {
      setPostText('')
      setThreadPosts([])
    }
  }, [state.quotedPost])

  useEffect(() => {
    if (state.preselectMapsSection === 'addPin') {
      setMapsMode('addPin')
    }
  }, [state.preselectMapsSection])

  useEffect(() => {
    if (state.drawerContent === 'editProfile') {
      setEditName('Jordan Rivera')
      setEditUsername('screennam3')
      setEditBio('Running trails & river views.')
    }
  }, [state.drawerContent])

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dy) > 10,
      onPanResponderGrant: (_, gs) => {
        panStartY.current = drawerY._value
      },
      onPanResponderMove: (_, gs) => {
        const newY = Math.max(0, Math.min(DRAWER_FULL_HEIGHT, panStartY.current + gs.dy))
        drawerY.setValue(newY)
        const progress = 1 - newY / DRAWER_FULL_HEIGHT
        backdropOpacity.setValue(Math.min(0.5, progress * 0.5))
      },
      onPanResponderRelease: (_, gs) => {
        const velocity = gs.vy
        const currentY = drawerY._value
        if (velocity > 0.5 || currentY > DRAWER_FULL_HEIGHT * 0.5) {
          fnRefs.current.hide()
        } else if (velocity < -0.5 || currentY < DRAWER_FULL_HEIGHT * 0.3) {
          fnRefs.current.expand()
        } else {
          fnRefs.current.collapse()
        }
      },
    })
  ).current

  const handlePublish = useCallback(() => {
    console.log('Publish:', {
      text: postText,
      threadPosts,
      isPrivate,
      isLongForm,
      longFormTitle,
      scheduledAt: isSchedule ? `${scheduledDate} ${scheduledTime}` : null,
      quotedPost: state.quotedPost,
    })
    setPostText('')
    setThreadPosts([])
    setIsPrivate(false)
    setIsLongForm(false)
    setLongFormTitle('')
    setIsSchedule(false)
    setScheduledDate('')
    setScheduledTime('')
    setShowSchedulePicker(false)
    setQuotedPost(null)
    hideActionDrawerLocal()
  }, [postText, threadPosts, isPrivate, isLongForm, longFormTitle, isSchedule, scheduledDate, scheduledTime, state.quotedPost, setQuotedPost])

  const addThreadPost = useCallback(() => {
    setThreadPosts(prev => [...prev, ''])
  }, [])

  const removeThreadPost = useCallback((index: number) => {
    setThreadPosts(prev => prev.filter((_, i) => i !== index))
  }, [])

  const updateThreadPost = useCallback((index: number, text: string) => {
    setThreadPosts(prev => prev.map((p, i) => i === index ? text : p))
  }, [])

  const EMOJI_OPTIONS = ['📍', '☕', '🍕', '🎒', '🏠', '🌳', '🎵', '📖', '💊', '🛒', '⛽', '🏀', '🐶', '❤️', '🔧', '🎨']

  const handleSavePin = useCallback(() => {
    setMapsAction({ type: 'addPin', pin: { emoji: selectedEmoji, text: pinText } })
    setPinText('')
    setSelectedEmoji('📍')
    hideActionDrawerLocal()
  }, [selectedEmoji, pinText, setMapsAction])

  const handleSearchLocation = useCallback(() => {
    setMapsAction({ type: 'search', searchQuery: mapsSearchQuery })
    hideActionDrawerLocal()
  }, [mapsSearchQuery, setMapsAction])

  const handleGetDirections = useCallback(() => {
    setMapsAction({
      type: 'directions',
      directions: { from: undefined as any, to: undefined as any, mode: directionsMode },
    })
    hideActionDrawerLocal()
  }, [directionsMode, setMapsAction])

  const contentInputRef = useRef<TextInput>(null)

  const AccentButton = ({ onPress, title, style }: { onPress: () => void; title: string; style?: any }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[{ height: 44, borderRadius: 10, overflow: 'hidden' }, style]}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <LinearGradient colors={def.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: def.name === 'White' ? theme.color12.val : '#fff', fontWeight: '700', fontSize: 16 }}>{title}</Text>
      </View>
    </TouchableOpacity>
  )

  const PillToggle = ({ active, onPress, label }: { active: boolean; onPress: () => void; label: string }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: active ? 'transparent' : accentMuted,
        overflow: 'hidden',
      }}
    >
      {active && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <LinearGradient colors={def.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
        </View>
      )}
      <Text style={{ color: active ? (def.name === 'White' ? theme.color12.val : '#fff') : accent, fontWeight: '700', fontSize: 13, zIndex: 1 }}>
        {label}
      </Text>
    </TouchableOpacity>
  )

  const renderPostContent = () => (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ padding: 16, paddingTop: insets.top + 16 }}>
          <View style={{ position: 'absolute', top: insets.top + 8, right: 12, zIndex: 10 }}>
            <TouchableOpacity onPress={hideActionDrawerLocal} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="close" size={24} color={accent} strokeWidth={1.875} />
            </TouchableOpacity>
          </View>
          <Text style={{ color: theme.color12.val, fontWeight: '700', fontSize: 18, marginBottom: 16 }}>New Post</Text>

          {state.quotedPost && (
            <View style={{ marginBottom: 12, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: accentMuted }}>
              <XStack style={{ alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Avatar seed={state.quotedPost.author} size={16} />
                <Text style={{ color: accent, fontWeight: '600', fontSize: 13 }}>@{state.quotedPost.author}</Text>
              </XStack>
              <Text style={{ color: theme.color12.val, fontSize: 13 }}>{state.quotedPost.text}</Text>
              <TouchableOpacity
                style={{ position: 'absolute', top: 4, right: 4 }}
                onPress={() => setQuotedPost(null)}
              >
                <Icon name="xmark" size={14} color={accent} />
              </TouchableOpacity>
            </View>
          )}

          <XStack style={{ gap: 10 }}>
            <Avatar seed="screennam3" size={28} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: accent, fontWeight: '600', fontSize: 13, marginBottom: 4 }}>@screennam3</Text>
              <TextInput
                ref={contentInputRef}
                style={{
                  color: theme.color12.val,
                  fontSize: 16,
                  minHeight: isLongForm ? 200 : 80,
                  textAlignVertical: 'top',
                  padding: 0,
                }}
                placeholder="What's happening?"
                placeholderTextColor={accentMuted}
                value={postText}
                onChangeText={(text) => {
                  setPostText(text)
                  if (!text.trim()) {
                    setPostContentPresent(false)
                  } else {
                    setPostContentPresent(true)
                  }
                }}
                multiline
              />
            </View>
          </XStack>

          {threadPosts.map((threadText, index) => (
            <View key={index} style={{ marginTop: 12, paddingLeft: 0 }}>
              <XStack style={{ gap: 10, alignItems: 'center' }}>
                <Avatar seed="screennam3" size={28} />
                <Text style={{ color: accent, fontWeight: '600', fontSize: 13 }}>@screennam3</Text>
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={() => removeThreadPost(index)}>
                  <Icon name="xmark" size={16} color={accent} />
                </TouchableOpacity>
              </XStack>
              <TextInput
                style={{
                  color: theme.color12.val,
                  fontSize: 16,
                  minHeight: 40,
                  textAlignVertical: 'top',
                  padding: 0,
                  marginTop: 4,
                  marginLeft: 38,
                }}
                placeholder="Add to thread..."
                placeholderTextColor={accentMuted}
                value={threadText}
                onChangeText={(text) => updateThreadPost(index, text)}
                multiline
              />
            </View>
          ))}

          {postText.trim().length > 0 && (
            <TouchableOpacity
              onPress={addThreadPost}
              style={{ marginTop: 8 }}
            >
              <Text style={{ color: accent, fontWeight: '600', fontSize: 14 }}>+ Add to thread</Text>
            </TouchableOpacity>
          )}

          <XStack style={{ gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            <PillToggle active={isPrivate} onPress={() => { setIsPrivate(!isPrivate); if (!isPrivate) setPostVisibility('private'); else setPostVisibility('public') }} label="Private" />
            <PillToggle active={isLongForm} onPress={() => setIsLongForm(!isLongForm)} label="Long Form" />
            <PillToggle active={isSchedule} onPress={() => setIsSchedule(!isSchedule)} label="Schedule" />
          </XStack>

          {isLongForm && (
            <TextInput
              style={{
                color: theme.color12.val,
                fontSize: 18,
                fontWeight: '700',
                marginTop: 12,
                padding: 0,
                borderBottomWidth: 1,
                borderBottomColor: accentMuted,
              }}
              placeholder="Title"
              placeholderTextColor={accentMuted}
              value={longFormTitle}
              onChangeText={setLongFormTitle}
            />
          )}

          {isSchedule && (
            <TouchableOpacity onPress={() => setShowSchedulePicker(true)} style={{ marginTop: 12 }}>
              <XStack style={{ alignItems: 'center', gap: 8 }}>
                <Icon name="calendar" size={16} color={accent} />
                <Text style={{ color: accent, fontSize: 14 }}>
                  {scheduledDate && scheduledTime ? `${scheduledDate} at ${scheduledTime}` : 'Pick date & time'}
                </Text>
              </XStack>
            </TouchableOpacity>
          )}

          <XStack style={{ marginTop: 16, gap: 16 }}>
            <TouchableOpacity>
              <Icon name="image" size={22} color={accent} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="link" size={22} color={accent} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="bar-chart" size={22} color={accent} />
            </TouchableOpacity>
          </XStack>

          <View style={{ marginTop: 8 }}>
            <Text style={{ color: accentMuted, fontSize: 12 }}>{MOCK_VAULTS.find(v => v.id === state.currentVaultId)?.name || 'All Communities'}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={{ padding: 16, paddingBottom: insets.bottom + 8 }}>
        <AccentButton onPress={handlePublish} title="Post" />
      </View>

      {showSchedulePicker && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: theme.background.val,
          justifyContent: 'flex-end',
          zIndex: 100,
        }}>
          <TouchableWithoutFeedback onPress={() => setShowSchedulePicker(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
          <View style={{ backgroundColor: theme.color1.val, borderRadius: 16, padding: 20, paddingBottom: insets.bottom + 20 }}>
            <XStack style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ color: theme.color12.val, fontWeight: '700', fontSize: 18 }}>Schedule</Text>
              <TouchableOpacity onPress={() => setShowSchedulePicker(false)}>
                <Icon name="xmark" size={24} color={accent} />
              </TouchableOpacity>
            </XStack>

            <Text style={{ color: accent, fontWeight: '600', fontSize: 14, marginBottom: 8 }}>Date</Text>
            <XStack style={{ gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {['Today', 'Tomorrow', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <TouchableOpacity
                  key={day}
                  onPress={() => setScheduledDate(day)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: scheduledDate === day ? accent : accentMuted,
                    overflow: 'hidden',
                  }}
                >
                  {scheduledDate === day && (
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                      <LinearGradient colors={def.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
                    </View>
                  )}
                  <Text style={{ color: scheduledDate === day ? (def.name === 'White' ? theme.color12.val : '#fff') : accent, fontWeight: '600', fontSize: 13, zIndex: 1 }}>{day}</Text>
                </TouchableOpacity>
              ))}
            </XStack>

            <Text style={{ color: accent, fontWeight: '600', fontSize: 14, marginBottom: 8 }}>Time</Text>
            <XStack style={{ gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {['8:00am', '9:00am', '10:00am', '12:00pm', '2:00pm', '4:00pm', '6:00pm', '8:00pm', '10:00pm'].map(time => (
                <TouchableOpacity
                  key={time}
                  onPress={() => setScheduledTime(time)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: scheduledTime === time ? accent : accentMuted,
                    overflow: 'hidden',
                  }}
                >
                  {scheduledTime === time && (
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                      <LinearGradient colors={def.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
                    </View>
                  )}
                  <Text style={{ color: scheduledTime === time ? (def.name === 'White' ? theme.color12.val : '#fff') : accent, fontWeight: '600', fontSize: 13, zIndex: 1 }}>{time}</Text>
                </TouchableOpacity>
              ))}
            </XStack>

            <AccentButton
              onPress={() => {
                setIsSchedule(true)
                setShowSchedulePicker(false)
              }}
              title="Confirm"
            />
          </View>
        </View>
      )}
    </View>
  )

  const renderMapsContent = () => (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ padding: 16, paddingTop: insets.top + 16 }}>
          <XStack style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ color: theme.color12.val, fontWeight: '700', fontSize: 18 }}>Maps</Text>
            <TouchableOpacity onPress={hideActionDrawerLocal}>
              <Icon name="xmark" size={24} color={accent} />
            </TouchableOpacity>
          </XStack>

          <XStack style={{ gap: 8, marginBottom: 16 }}>
            {(['search', 'directions', 'addPin'] as const).map(mode => (
              <View key={mode} style={{ overflow: 'hidden', borderRadius: 20 }}>
                <TouchableOpacity
                  onPress={() => setMapsMode(mode)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: mapsMode === mode ? 'transparent' : accentMuted,
                    overflow: 'hidden',
                  }}
                >
                  {mapsMode === mode && (
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                      <LinearGradient colors={def.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
                    </View>
                  )}
                  <Text style={{ color: mapsMode === mode ? (def.name === 'White' ? theme.color12.val : '#fff') : accent, fontWeight: '700', fontSize: 13, zIndex: 1 }}>
                    {mode === 'search' ? 'Search' : mode === 'directions' ? 'Directions' : 'Add Pin'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </XStack>

          {mapsMode === 'search' && (
            <View>
              <XStack style={{ alignItems: 'center', backgroundColor: theme.color2.val, borderRadius: 10, paddingHorizontal: 12, marginBottom: 12 }}>
                <Icon name="search" size={18} color={accent} />
                <TextInput
                  style={{ flex: 1, height: 44, color: theme.color12.val, fontSize: 15, marginLeft: 8 }}
                  placeholder="Search locations..."
                  placeholderTextColor={accentMuted}
                  value={mapsSearchQuery}
                  onChangeText={setMapsSearchQuery}
                  onSubmitEditing={handleSearchLocation}
                  returnKeyType="search"
                />
                {mapsSearchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setMapsSearchQuery('')}>
                    <Icon name="xmark-circle" size={18} color={accent} />
                  </TouchableOpacity>
                )}
              </XStack>

              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 }}
                onPress={handleSearchLocation}
              >
                <Icon name="nav-marker" size={18} color={accent} />
                <View>
                  <Text style={{ color: theme.color12.val, fontWeight: '600', fontSize: 14 }}>Your Location</Text>
                  <Text style={{ color: accent, fontSize: 12 }}>Use current position</Text>
                </View>
              </TouchableOpacity>

              <View style={{ borderTopWidth: 1, borderTopColor: accentMuted, marginTop: 8, paddingTop: 8 }}>
                <Text style={{ color: accent, fontWeight: '600', fontSize: 13, marginBottom: 8 }}>Recent</Text>
                {['Downtown Hub', 'Maker Space', 'Midtown Arts Center'].map(place => (
                  <TouchableOpacity
                    key={place}
                    onPress={() => { setMapsSearchQuery(place); handleSearchLocation() }}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 }}
                  >
                    <Icon name="clock" size={16} color={accent} />
                    <Text style={{ color: theme.color12.val, fontSize: 14 }}>{place}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ borderTopWidth: 1, borderTopColor: accentMuted, marginTop: 8, paddingTop: 8 }}>
                <Text style={{ color: accent, fontWeight: '600', fontSize: 13, marginBottom: 8 }}>Popular</Text>
                {['Community Garden', 'Riverside Trail', 'Founders Park'].map(place => (
                  <TouchableOpacity
                    key={place}
                    onPress={() => { setMapsSearchQuery(place); handleSearchLocation() }}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 }}
                  >
                    <Icon name="star" size={16} color={accent} />
                    <Text style={{ color: theme.color12.val, fontSize: 14 }}>{place}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {mapsMode === 'directions' && (
            <View>
              <View style={{ backgroundColor: theme.color2.val, borderRadius: 10, paddingHorizontal: 12, marginBottom: 12 }}>
                <XStack style={{ alignItems: 'center' }}>
                  <Icon name="nav-arrow-up" size={18} color={accent} />
                  <TextInput
                    style={{ flex: 1, height: 44, color: theme.color12.val, fontSize: 15, marginLeft: 8 }}
                    placeholder="From (current location)"
                    placeholderTextColor={accentMuted}
                    value={directionsFrom}
                    onChangeText={setDirectionsFrom}
                  />
                </XStack>
                <View style={{ height: 1, backgroundColor: accentMuted }} />
                <XStack style={{ alignItems: 'center' }}>
                  <Icon name="nav-arrow-down" size={18} color={accent} />
                  <TextInput
                    style={{ flex: 1, height: 44, color: theme.color12.val, fontSize: 15, marginLeft: 8 }}
                    placeholder="To..."
                    placeholderTextColor={accentMuted}
                    value={directionsTo}
                    onChangeText={setDirectionsTo}
                  />
                </XStack>
              </View>

              <XStack style={{ gap: 8, marginBottom: 16 }}>
                {(['car', 'bike', 'walk'] as const).map(mode => (
                  <View key={mode} style={{ overflow: 'hidden', borderRadius: 20 }}>
                    <TouchableOpacity
                      onPress={() => setDirectionsMode(mode)}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 20,
                        backgroundColor: directionsMode === mode ? 'transparent' : accentMuted,
                        overflow: 'hidden',
                      }}
                    >
                      {directionsMode === mode && (
                        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                          <LinearGradient colors={def.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
                        </View>
                      )}
                      <Text style={{ color: directionsMode === mode ? (def.name === 'White' ? theme.color12.val : '#fff') : accent, fontWeight: '600', fontSize: 13, zIndex: 1 }}>
                        {mode === 'car' ? 'Car' : mode === 'bike' ? 'Bike' : 'Walk'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </XStack>

              <AccentButton onPress={handleGetDirections} title="Get Route" />
            </View>
          )}

          {mapsMode === 'addPin' && (
            <View>
              <Text style={{ color: accent, fontWeight: '600', fontSize: 14, marginBottom: 8 }}>Emoji</Text>
              <XStack style={{ flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {EMOJI_OPTIONS.map(emoji => (
                  <TouchableOpacity
                    key={emoji}
                    onPress={() => setSelectedEmoji(emoji)}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      backgroundColor: selectedEmoji === emoji ? accent : accentMuted,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 20 }}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </XStack>

              <TextInput
                style={{
                  color: theme.color12.val,
                  fontSize: 15,
                  height: 44,
                  backgroundColor: theme.color2.val,
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  marginBottom: 16,
                }}
                placeholder="Pin label..."
                placeholderTextColor={accentMuted}
                value={pinText}
                onChangeText={setPinText}
              />

              <AccentButton onPress={handleSavePin} title="Save Pin" />
            </View>
          )}

          {mapsMode === 'search' && (
            <View style={{ marginTop: 16 }}>
              <XStack style={{ gap: 8 }}>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: accentMuted }}
                >
                  <Icon name="share" size={16} color={accent} />
                  <Text style={{ color: accent, fontWeight: '600', fontSize: 13 }}>Share Location</Text>
                </TouchableOpacity>
              </XStack>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )

  const renderEditProfileContent = () => (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ padding: 16, paddingTop: insets.top + 16 }}>
          <XStack style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ color: theme.color12.val, fontWeight: '700', fontSize: 18 }}>Edit Profile</Text>
            <TouchableOpacity onPress={hideActionDrawerLocal}>
              <Icon name="xmark" size={24} color={accent} />
            </TouchableOpacity>
          </XStack>

          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <TouchableOpacity
              onPress={async () => {
                try {
                  const DocumentPicker = (await import('expo-document-picker')).default
                  const result = await DocumentPicker.getDocumentAsync({ type: 'image/*' })
                  if (!result.canceled && result.assets?.[0]) {
                    setEditImage(result.assets[0].uri)
                  }
                } catch (e) {}
              }}
            >
              <Avatar seed="screennam3" size={80} />
              <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: accent, borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }}>
                <Icon name="camera" size={14} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>

          <Text style={{ color: accent, fontWeight: '600', fontSize: 13, marginBottom: 4 }}>Name</Text>
          <TextInput
            style={{
              color: theme.color12.val,
              fontSize: 16,
              height: 44,
              backgroundColor: theme.color2.val,
              borderRadius: 10,
              paddingHorizontal: 12,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: accentMuted,
            }}
            value={editName}
            onChangeText={setEditName}
          />

          <Text style={{ color: accent, fontWeight: '600', fontSize: 13, marginBottom: 4 }}>Username</Text>
          <TextInput
            style={{
              color: theme.color12.val,
              fontSize: 16,
              height: 44,
              backgroundColor: theme.color2.val,
              borderRadius: 10,
              paddingHorizontal: 12,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: accentMuted,
            }}
            value={editUsername}
            onChangeText={setEditUsername}
          />

          <Text style={{ color: accent, fontWeight: '600', fontSize: 13, marginBottom: 4 }}>Bio</Text>
          <TextInput
            style={{
              color: theme.color12.val,
              fontSize: 16,
              minHeight: 80,
              backgroundColor: theme.color2.val,
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingTop: 12,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: accentMuted,
              textAlignVertical: 'top',
            }}
            value={editBio}
            onChangeText={setEditBio}
            multiline
          />
        </View>
      </ScrollView>

      <View style={{ padding: 16, paddingBottom: insets.bottom + 8 }}>
        <AccentButton onPress={hideActionDrawerLocal} title="Save" />
      </View>
    </View>
  )

  if (!state.showActionDrawer) return null

  const drawerContent = state.drawerContent || 'post'

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }} pointerEvents={state.showActionDrawer ? 'auto' : 'none'}>
      <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', opacity: backdropOpacity }}>
        <TouchableWithoutFeedback onPress={hideActionDrawerLocal}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
      </Animated.View>

      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transform: [{ translateY: drawerY }],
          backgroundColor: theme.background.val,
        }}
        {...panResponder.panHandlers}
      >
        {drawerContent === 'post' && renderPostContent()}
        {drawerContent === 'maps' && renderMapsContent()}
        {drawerContent === 'editProfile' && renderEditProfileContent()}
      </Animated.View>
    </View>
  )
}
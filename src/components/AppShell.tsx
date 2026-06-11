import React, { useRef, useCallback, useEffect, useState, useMemo } from 'react'
import { View, ScrollView, StatusBar, Animated, Easing, Dimensions } from 'react-native'
import { YStack, XStack, Text } from 'tamagui'
import { useTheme } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '../context/NavigationContext'
import { NavCollapseContext } from '../context/NavCollapseContext'
import { useAccent } from '../hooks/useAccent'
import { SCROLL_THRESHOLD, TOP_BAR_HEIGHT, PILL_MARGIN_BOTTOM, PILL_HEIGHT } from '../constants'
import SocialView from '../views/SocialView'
import EventsView from '../views/EventsView'
import NewsView from '../views/NewsView'
import CommerceView from '../views/CommerceView'
import VaultsView from '../views/VaultsView'
import MessagesView from '../views/MessagesView'
import MapsView from '../views/MapsView'
import NotificationsView from '../views/NotificationsView'
import LikedView from '../views/LikedView'
import ReservationsView from '../views/ReservationsView'
import BookmarksView from '../views/BookmarksView'
import DraftsView from '../views/DraftsView'
import OrdersView from '../views/OrdersView'
import LanguageView from '../views/LanguageView'
import AccessibilityView from '../views/AccessibilityView'
import HelpView from '../views/HelpView'
import AboutView from '../views/AboutView'
import TopBar from './TopBar'
import BottomNav from './BottomNav'
import DetailView from './DetailView'
import MenuDrawer from './MenuDrawer'
import ActionDrawer from './ActionDrawer'
import SearchScreen from './SearchScreen'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

interface FilterViewProps {
  isSearching: boolean
  searchQuery: string
  activeFilters: string[]
  setFilterSearching: (searching: boolean) => void
  setFilterSearchQuery: (query: string) => void
  toggleFilterPill: (pill: string) => void
}

export default function AppShell() {
  const { state, dispatch, switchView, openDetail, closeDetail, toggleMenu, hideMenu, toggleActionDrawer, hideActionDrawer, openDrawer, toggleSearch, hideSearch, toggleFeedPicker, hideFeedPicker, setVaultFilter, setPostVisibility, setPostContentPresent, setQuotedPost, setMapsAction, setPreselectMapsSection, setForceNavHidden, toggleTheme } = useNavigation()
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const { accent, accentMuted } = useAccent()

  const isNavCollapsed = useRef(false)
  const navCollapseAnim = useRef(new Animated.Value(0)).current
  const prevScrollY = useRef(0)

  const navCollapseContextValue = useMemo(() => ({
    isNavCollapsed,
    navCollapseAnim,
  }), [navCollapseAnim])

  const [commerceFilter, setCommerceFilter] = useState<FilterViewProps>({
    isSearching: false,
    searchQuery: '',
    activeFilters: [],
    setFilterSearching: () => {},
    setFilterSearchQuery: () => {},
    toggleFilterPill: () => {},
  })
  const [eventsFilter, setEventsFilter] = useState<FilterViewProps>({
    isSearching: false,
    searchQuery: '',
    activeFilters: [],
    setFilterSearching: () => {},
    setFilterSearchQuery: () => {},
    toggleFilterPill: () => {},
  })
  const [newsFilter, setNewsFilter] = useState<FilterViewProps>({
    isSearching: false,
    searchQuery: '',
    activeFilters: [],
    setFilterSearching: () => {},
    setFilterSearchQuery: () => {},
    toggleFilterPill: () => {},
  })

  const menuAnim = useRef(new Animated.Value(0)).current
  const feedSlideAnim = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(1)).current
  const detailAnim = useRef(new Animated.Value(1)).current
  const drawerAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (state.showMenu) {
      Animated.timing(menuAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start()
    } else {
      Animated.timing(menuAnim, { toValue: 0, duration: 100, useNativeDriver: true }).start()
    }
  }, [state.showMenu])

  useEffect(() => {
    Animated.timing(detailAnim, { toValue: state.detail ? 0 : 1, duration: 150, useNativeDriver: true }).start()
  }, [state.detail])

  useEffect(() => {
    if (state.showActionDrawer) {
      Animated.spring(drawerAnim, { toValue: 0, damping: 22, stiffness: 200, useNativeDriver: true }).start()
    } else {
      Animated.timing(drawerAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start()
    }
  }, [state.showActionDrawer])

  useEffect(() => {
    if (state.showFeedPicker) {
      Animated.timing(feedSlideAnim, {
        toValue: 1,
        duration: 188,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(feedSlideAnim, { toValue: 0, duration: 188, useNativeDriver: true }).start()
    }
  }, [state.showFeedPicker])

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 140, useNativeDriver: true }).start()
  }, [state.currentView])

  const handleScroll = useCallback((event: any) => {
    const yOffset = event.nativeEvent.contentOffset.y
    const scrollingDown = yOffset > prevScrollY.current && yOffset > SCROLL_THRESHOLD
    const scrollingUp = yOffset < prevScrollY.current
    prevScrollY.current = yOffset
    if (scrollingDown && !isNavCollapsed.current) {
      isNavCollapsed.current = true
      Animated.timing(navCollapseAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start()
    } else if (scrollingUp && isNavCollapsed.current) {
      isNavCollapsed.current = false
      Animated.timing(navCollapseAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start()
    }
  }, [navCollapseAnim])

const makeFilterProps = useCallback((
    filter: FilterViewProps,
    setFilter: React.Dispatch<React.SetStateAction<FilterViewProps>>
  ): FilterViewProps => ({
    isSearching: filter.isSearching,
    searchQuery: filter.searchQuery,
    activeFilters: filter.activeFilters,
    setFilterSearching: (searching: boolean) => setFilter(f => ({ ...f, isSearching: searching })),
    setFilterSearchQuery: (query: string) => setFilter(f => ({ ...f, searchQuery: query })),
    toggleFilterPill: (pill: string) => setFilter(f => ({
      ...f,
      activeFilters: f.activeFilters.includes(pill)
        ? f.activeFilters.filter(p => p !== pill)
        : [...f.activeFilters, pill],
    })),
  }), [])

  const commerceFilterProps = makeFilterProps(commerceFilter, setCommerceFilter)
  const eventsFilterProps = makeFilterProps(eventsFilter, setEventsFilter)
  const newsFilterProps = makeFilterProps(newsFilter, setNewsFilter)

  const renderView = useCallback(() => {
    switch (state.currentView) {
      case 'social':
        return <SocialView />
      case 'events':
        return <EventsView filterProps={eventsFilterProps} />
      case 'news':
        return <NewsView filterProps={newsFilterProps} />
      case 'commerce':
        return <CommerceView filterProps={commerceFilterProps} />
      case 'vaults':
        return <VaultsView />
      case 'messages':
        return <MessagesView />
      case 'locations':
        return null
      case 'notifications':
        return <NotificationsView />
      case 'liked':
        return <LikedView />
      case 'reservations':
        return <ReservationsView />
      case 'bookmarks':
        return <BookmarksView />
      case 'drafts':
        return <DraftsView />
      case 'orders':
        return <OrdersView />
      case 'language':
        return <LanguageView />
      case 'accessibility':
        return <AccessibilityView />
      case 'help':
        return <HelpView />
      case 'about':
        return <AboutView />
      case 'profile':
        return null
      default:
        return <SocialView />
    }
  }, [state.currentView, commerceFilterProps, eventsFilterProps, newsFilterProps])

  const isMaps = state.currentView === 'locations'

  const menuTranslateX = useMemo(() => menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCREEN_WIDTH],
  }), [menuAnim])

  const outerOpacity = useMemo(() => Animated.multiply(
    Animated.multiply(fadeAnim, detailAnim),
    drawerAnim
  ), [fadeAnim, detailAnim, drawerAnim])

  if (isMaps) {
    return (
      <NavCollapseContext.Provider value={navCollapseContextValue}>
        <View style={{ flex: 1 }}>
          <StatusBar translucent backgroundColor="transparent" />
          <MapsView />
          <TopBar />
          {state.showSearch && <SearchScreen />}
          <BottomNav />
          <ActionDrawer drawerAnim={drawerAnim} />
          <MenuDrawer menuAnim={menuAnim} />
          <DetailView detailAnim={detailAnim} />
        </View>
      </NavCollapseContext.Provider>
    )
  }

  const contentOffset = insets.top + TOP_BAR_HEIGHT + PILL_MARGIN_BOTTOM + PILL_HEIGHT

  return (
    <NavCollapseContext.Provider value={navCollapseContextValue}>
      <View style={{ flex: 1, backgroundColor: theme.background.val }}>
        <StatusBar translucent backgroundColor="transparent" />
        <TopBar />
        <ScrollView
          style={{ flex: 1 }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingTop: contentOffset }}
        >
          <Animated.View style={{ opacity: outerOpacity }}>
            {renderView()}
          </Animated.View>
        </ScrollView>
        {state.showSearch && <SearchScreen />}
        <BottomNav />
        <ActionDrawer drawerAnim={drawerAnim} />
        <MenuDrawer menuAnim={menuAnim} />
        <DetailView detailAnim={detailAnim} />
      </View>
    </NavCollapseContext.Provider>
  )
}
import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react'
import type { NavState, ViewId, MapsAction, QuotedPost } from '../types'

type Action =
  | { type: 'SET_CURRENT_VIEW'; viewId: ViewId }
  | { type: 'OPEN_DETAIL'; viewId: string; item: any }
  | { type: 'CLOSE_DETAIL' }
  | { type: 'TOGGLE_MENU' }
  | { type: 'HIDE_MENU' }
  | { type: 'TOGGLE_ACTION_DRAWER'; content?: 'post' | 'maps' | 'editProfile' }
  | { type: 'HIDE_ACTION_DRAWER' }
  | { type: 'OPEN_ACTION_DRAWER'; content: 'post' | 'maps' | 'editProfile' }
  | { type: 'TOGGLE_SEARCH' }
  | { type: 'HIDE_SEARCH' }
  | { type: 'TOGGLE_FEED_PICKER' }
  | { type: 'HIDE_FEED_PICKER' }
  | { type: 'SET_VAULT_FILTER'; vaultId: string | null }
  | { type: 'SET_FORCE_NAV_HIDDEN'; hidden: boolean }
  | { type: 'SET_POST_VISIBILITY'; visibility: 'public' | 'private' }
  | { type: 'SET_POST_CONTENT_PRESENT'; present: boolean }
  | { type: 'SET_QUOTED_POST'; post: QuotedPost | null }
  | { type: 'HIDE_VIEW_MENU' }
  | { type: 'SET_MAPS_ACTION'; action: MapsAction }
  | { type: 'SET_PRESELECT_MAPS_SECTION'; section: 'addPin' | null }
  | { type: 'SET_THEME_OVERRIDE'; theme: 'light' | 'dark' | null }

const initialState: NavState = {
  currentView: 'social',
  detail: null,
  showMenu: false,
  showActionDrawer: false,
  showSearch: false,
  showFeedPicker: false,
  currentVaultId: null,
  forceNavHidden: false,
  postVisibility: 'public',
  postContentPresent: false,
  quotedPost: null,
  drawerContent: null,
  themeOverride: null,
  mapsAction: { type: 'search' },
  preselectMapsSection: null,
}

function reducer(state: NavState, action: Action): NavState {
  switch (action.type) {
    case 'SET_CURRENT_VIEW':
      return { ...state, currentView: action.viewId }
    case 'OPEN_DETAIL':
      return { ...state, detail: { viewId: action.viewId, item: action.item } }
    case 'CLOSE_DETAIL':
      return { ...state, detail: null }
    case 'TOGGLE_MENU':
      return { ...state, showMenu: !state.showMenu }
    case 'HIDE_MENU':
      return { ...state, showMenu: false }
    case 'TOGGLE_ACTION_DRAWER':
      return {
        ...state,
        showActionDrawer: !state.showActionDrawer,
        ...(action.content != null ? { drawerContent: action.content } : {}),
      }
    case 'HIDE_ACTION_DRAWER':
      return { ...state, showActionDrawer: false, drawerContent: null }
    case 'OPEN_ACTION_DRAWER':
      return { ...state, showActionDrawer: true, drawerContent: action.content }
    case 'TOGGLE_SEARCH':
      return { ...state, showSearch: !state.showSearch }
    case 'HIDE_SEARCH':
      return { ...state, showSearch: false }
    case 'TOGGLE_FEED_PICKER':
      return { ...state, showFeedPicker: !state.showFeedPicker }
    case 'HIDE_FEED_PICKER':
      return { ...state, showFeedPicker: false }
    case 'SET_VAULT_FILTER':
      return { ...state, currentVaultId: action.vaultId }
    case 'SET_FORCE_NAV_HIDDEN':
      return { ...state, forceNavHidden: action.hidden }
    case 'SET_POST_VISIBILITY':
      return { ...state, postVisibility: action.visibility }
    case 'SET_POST_CONTENT_PRESENT':
      return { ...state, postContentPresent: action.present }
    case 'SET_QUOTED_POST':
      return { ...state, quotedPost: action.post }
    case 'HIDE_VIEW_MENU':
      return { ...state, showMenu: false, showActionDrawer: false, showFeedPicker: false }
    case 'SET_MAPS_ACTION':
      return { ...state, mapsAction: action.action }
    case 'SET_PRESELECT_MAPS_SECTION':
      return { ...state, preselectMapsSection: action.section }
    case 'SET_THEME_OVERRIDE':
      return { ...state, themeOverride: action.theme }
    default:
      return state
  }
}

interface NavigationContextValue {
  state: NavState
  dispatch: React.Dispatch<Action>
  switchView: (viewId: ViewId) => void
  openDetail: (viewId: string, item: any) => void
  closeDetail: () => void
  toggleMenu: () => void
  hideMenu: () => void
  toggleActionDrawer: (content?: 'post' | 'maps' | 'editProfile') => void
  hideActionDrawer: () => void
  openDrawer: (content: 'post' | 'maps' | 'editProfile') => void
  toggleSearch: () => void
  hideSearch: () => void
  toggleFeedPicker: () => void
  hideFeedPicker: () => void
  setVaultFilter: (vaultId: string | null) => void
  setForceNavHidden: (hidden: boolean) => void
  setPostVisibility: (visibility: 'public' | 'private') => void
  setPostContentPresent: (present: boolean) => void
  setQuotedPost: (post: QuotedPost | null) => void
  hideViewMenu: () => void
  setMapsAction: (action: MapsAction) => void
  setPreselectMapsSection: (section: 'addPin' | null) => void
  toggleTheme: () => void
  currentViewDef: { viewId: ViewId } | undefined
}

const NavigationContext = createContext<NavigationContextValue | null>(null)

export function useNavigation() {
  const ctx = useContext(NavigationContext)
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider')
  return ctx
}

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const switchView = useCallback((viewId: ViewId) => dispatch({ type: 'SET_CURRENT_VIEW', viewId }), [])
  const openDetail = useCallback((viewId: string, item: any) => dispatch({ type: 'OPEN_DETAIL', viewId, item }), [])
  const closeDetail = useCallback(() => dispatch({ type: 'CLOSE_DETAIL' }), [])
  const toggleMenu = useCallback(() => dispatch({ type: 'TOGGLE_MENU' }), [])
  const hideMenu = useCallback(() => dispatch({ type: 'HIDE_MENU' }), [])
  const toggleActionDrawer = useCallback((content?: 'post' | 'maps' | 'editProfile') => dispatch({ type: 'TOGGLE_ACTION_DRAWER', content }), [])
  const hideActionDrawer = useCallback(() => dispatch({ type: 'HIDE_ACTION_DRAWER' }), [])
  const openDrawer = useCallback((content: 'post' | 'maps' | 'editProfile') => dispatch({ type: 'OPEN_ACTION_DRAWER', content }), [])
  const toggleSearch = useCallback(() => dispatch({ type: 'TOGGLE_SEARCH' }), [])
  const hideSearch = useCallback(() => dispatch({ type: 'HIDE_SEARCH' }), [])
  const toggleFeedPicker = useCallback(() => dispatch({ type: 'TOGGLE_FEED_PICKER' }), [])
  const hideFeedPicker = useCallback(() => dispatch({ type: 'HIDE_FEED_PICKER' }), [])
  const setVaultFilter = useCallback((vaultId: string | null) => dispatch({ type: 'SET_VAULT_FILTER', vaultId }), [])
  const setForceNavHidden = useCallback((hidden: boolean) => dispatch({ type: 'SET_FORCE_NAV_HIDDEN', hidden }), [])
  const setPostVisibility = useCallback((visibility: 'public' | 'private') => dispatch({ type: 'SET_POST_VISIBILITY', visibility }), [])
  const setPostContentPresent = useCallback((present: boolean) => dispatch({ type: 'SET_POST_CONTENT_PRESENT', present }), [])
  const setQuotedPost = useCallback((post: QuotedPost | null) => dispatch({ type: 'SET_QUOTED_POST', post }), [])
  const hideViewMenu = useCallback(() => dispatch({ type: 'HIDE_VIEW_MENU' }), [])
  const setMapsAction = useCallback((action: MapsAction) => dispatch({ type: 'SET_MAPS_ACTION', action }), [])
  const setPreselectMapsSection = useCallback((section: 'addPin' | null) => dispatch({ type: 'SET_PRESELECT_MAPS_SECTION', section }), [])
  const toggleTheme = useCallback(() => {
    const next: 'light' | 'dark' | null =
      state.themeOverride === null ? 'dark' : state.themeOverride === 'dark' ? 'light' : null
    dispatch({ type: 'SET_THEME_OVERRIDE', theme: next })
  }, [state.themeOverride])

  const value = useMemo(
    () => ({
      state,
      dispatch,
      switchView,
      openDetail,
      closeDetail,
      toggleMenu,
      hideMenu,
      toggleActionDrawer,
      hideActionDrawer,
      openDrawer,
      toggleSearch,
      hideSearch,
      toggleFeedPicker,
      hideFeedPicker,
      setVaultFilter,
      setForceNavHidden,
      setPostVisibility,
      setPostContentPresent,
      setQuotedPost,
      hideViewMenu,
      setMapsAction,
      setPreselectMapsSection,
      toggleTheme,
      currentViewDef: { viewId: state.currentView },
    }),
    [state, dispatch, switchView, openDetail, closeDetail, toggleMenu, hideMenu, toggleActionDrawer, hideActionDrawer, openDrawer, toggleSearch, hideSearch, toggleFeedPicker, hideFeedPicker, setVaultFilter, setForceNavHidden, setPostVisibility, setPostContentPresent, setQuotedPost, hideViewMenu, setMapsAction, setPreselectMapsSection, toggleTheme]
  )

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}
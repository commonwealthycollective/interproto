export type ViewId =
  | 'social'
  | 'events'
  | 'news'
  | 'commerce'
  | 'vaults'
  | 'messages'
  | 'notifications'
  | 'locations'
  | 'liked'
  | 'reservations'
  | 'bookmarks'
  | 'drafts'
  | 'orders'
  | 'language'
  | 'accessibility'
  | 'help'
  | 'about'
  | 'profile'

export type MediaType = 'image' | 'video'

export interface PostMedia {
  type: MediaType
  uri: string
}

export interface QuotedPost {
  author: string
  text: string
  media: PostMedia[]
}

export interface MessageData {
  id: string
  text: string
  time: string
  isOutgoing: boolean
  status?: 'sent' | 'delivered' | 'read'
}

export interface MapsAction {
  type: 'search' | 'directions' | 'addPin'
  searchQuery?: string
  directions?: { from: undefined; to: { lat: number; lng: number }; mode: string }
  pin?: { emoji: string; text: string }
}

export interface NavState {
  currentView: ViewId
  detail: { viewId: string; item: any } | null
  showMenu: boolean
  showActionDrawer: boolean
  showSearch: boolean
  showFeedPicker: boolean
  currentVaultId: string | null
  forceNavHidden: boolean
  postVisibility: 'public' | 'private'
  postContentPresent: boolean
  quotedPost: QuotedPost | null
  drawerContent: 'post' | 'maps' | 'editProfile' | null
  themeOverride: 'light' | 'dark' | null
  mapsAction: MapsAction
  preselectMapsSection: 'addPin' | null
}

export interface ProfileData {
  username: string
  displayName: string
  bio: string
  followers: number
  following: number
  communities: string[]
}

export interface AccentColorDef {
  name: string
  hex: string
  gradient: [string, string]
}
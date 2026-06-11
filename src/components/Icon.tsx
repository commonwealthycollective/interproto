import React from 'react'
import { SvgProps } from 'react-native-svg'
import * as Icons from 'iconoir-react-native'

const ICON_MAP: Record<string, React.FC<SvgProps>> = {
  'menu': Icons.Menu,
  'arrow-back': Icons.NavArrowLeft,
  'bell': Icons.Bell,
  'bookmark': Icons.Bookmark,
  'calendar-outline': Icons.Calendar,
  'calendar-check': Icons.CalendarCheck,
  'camera': Icons.Camera,
  'cart': Icons.Cart,
  'chatbubble-outline': Icons.ChatBubble,
  'checkmark': Icons.Check,
  'checkmark-circle': Icons.CheckCircle,
  'chevron-back': Icons.NavArrowLeft,
  'chevron-down': Icons.NavArrowDown,
  'chevron-forward': Icons.NavArrowRight,
  'chevron-up': Icons.NavArrowUp,
  'clock': Icons.Clock,
  'close': Icons.Xmark,
  'edit-pencil': Icons.EditPencil,
  'eye': Icons.Eye,
  'eye-off': Icons.EyeClosed,
  'filter': Icons.Filter,
  'globe-outline': Icons.Globe,
  'heart-outline': Icons.Heart,
  'heart-solid': Icons.HeartSolid,
  'help-circle': Icons.HelpCircle,
  'home-outline': Icons.HomeSimple,
  'image-outline': Icons.MediaImage,
  'info-circle': Icons.InfoCircle,
  'layers-outline': Icons.ViewGrid,
  'link-outline': Icons.Link,
  'location': Icons.MapPin,
  'location-outline': Icons.MapPin,
  'lock-closed-outline': Icons.Lock,
  'map': Icons.Map,
  'medal': Icons.Medal,
  'minus': Icons.Minus,
  'more-vert': Icons.MoreVert,
  'navigate': Icons.Navigator,
  'navigate-outline': Icons.Navigator,
  'nfc': Icons.Contactless,
  'package': Icons.Package,
  'people': Icons.Group,
  'person-outline': Icons.User,
  'person-circle-outline': Icons.ProfileCircle,
  'pin': Icons.Pin,
  'plus': Icons.Plus,
  'pricetag-outline': Icons.Label,
  'quote-message': Icons.QuoteMessage,
  'refresh': Icons.Refresh,
  'repeat': Icons.Repeat,
  'search': Icons.Search,
  'send': Icons.Send,
  'settings': Icons.Settings,
  'share': Icons.ShareIos,
  'shield': Icons.Shield,
  'shopping-bag': Icons.ShoppingBag,
  'star': Icons.Star,
  'store-outline': Icons.Shop,
  'swap': Icons.Shuffle,
  'tag-outline': Icons.Label,
  'time-outline': Icons.Clock,
  'truck': Icons.Truck,
  'volume-off': Icons.SoundOff,
  'volume-high': Icons.SoundHigh,
  'warning-circle': Icons.WarningCircle,
  'accessibility': Icons.Accessibility,
  'triangle-solid': Icons.Triangle,
  'triangle': Icons.Triangle,
  'xmark-circle': Icons.XmarkCircle,
}

interface IconProps {
  name: string
  size?: number
  color?: string
  strokeWidth?: number
  style?: any
}

export default function Icon({ name, size = 24, color, strokeWidth, style }: IconProps) {
  const Component = ICON_MAP[name]
  if (!Component) return null
  return (
    <Component
      width={size}
      height={size}
      color={color}
      strokeWidth={strokeWidth}
      style={style}
    />
  )
}
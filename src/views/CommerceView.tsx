import React, { useMemo } from 'react'
import { View, TouchableOpacity, Image, TextInput } from 'react-native'
import { Text, useTheme } from 'tamagui'
import { useNavigation } from '../context/NavigationContext'
import { useAccent } from '../hooks/useAccent'
import { MOCK_COMMERCE, MOCK_PROFILES } from '../constants'
import Icon from '../components/Icon'
import Avatar from '../components/Avatar'

interface FilterViewProps {
  isSearching: boolean
  searchQuery: string
  activeFilters: string[]
  setFilterSearching: (searching: boolean) => void
  setFilterSearchQuery: (query: string) => void
  toggleFilterPill: (pill: string) => void
}

const COMMERCE_FILTERS = ['All', 'Home', 'Services', 'Food', 'Sports', 'Tech', 'Garden']

export default React.memo(function CommerceView({ filterProps }: { filterProps?: FilterViewProps }) {
  const theme = useTheme()
  const { accent, accentMuted } = useAccent()
  const { state, openDetail } = useNavigation()
  const { isSearching, searchQuery, activeFilters, setFilterSearching, setFilterSearchQuery, toggleFilterPill } = filterProps ?? {
    isSearching: false, searchQuery: '', activeFilters: [],
    setFilterSearching: () => {}, setFilterSearchQuery: () => {}, toggleFilterPill: () => {},
  }

  const filteredItems = useMemo(() => {
    let items = MOCK_COMMERCE
    if (searchQuery) {
      items = items.filter((i) => i.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    if (activeFilters.length > 0 && !activeFilters.includes('All')) {
      items = items.filter((i) => activeFilters.some((f) => f.toLowerCase() === i.category.toLowerCase()))
    }
    return items
  }, [searchQuery, activeFilters])

  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        {isSearching ? (
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: theme.color2.val, borderRadius: 10, paddingHorizontal: 12 }}>
            <Icon name="search" size={18} color={accent} />
            <TextInput
              style={{ flex: 1, height: 40, color: theme.color12.val, fontSize: 15, marginLeft: 8 }}
              placeholder="Search items..."
              placeholderTextColor={accentMuted}
              value={searchQuery}
              onChangeText={setFilterSearchQuery}
              autoFocus
            />
            <TouchableOpacity onPress={() => { setFilterSearching(false); setFilterSearchQuery('') }}>
              <Icon name="close" size={18} color={accent} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setFilterSearching(true)}>
            <Icon name="search" size={20} color={accent} strokeWidth={1.875} />
          </TouchableOpacity>
        )}
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {COMMERCE_FILTERS.map((pill) => (
          <TouchableOpacity
            key={pill}
            onPress={() => toggleFilterPill(pill)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 20,
              backgroundColor: activeFilters.includes(pill) ? accent : accentMuted,
            }}
          >
            <Text style={{ color: activeFilters.includes(pill) ? '#fff' : accent, fontWeight: '600', fontSize: 13 }}>{pill}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredItems.length === 0 && (
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 60 }}>
          <Icon name="store-outline" size={48} color={accentMuted} />
          <Text style={{ color: accent, fontSize: 14, marginTop: 12 }}>No items found</Text>
        </View>
      )}

      {filteredItems.map((item, index) => {
        const seller = MOCK_PROFILES[item.person]
        return (
            <TouchableOpacity key={item.id} onPress={() => openDetail('commerce', item)} activeOpacity={0.8}>
              <View style={{ backgroundColor: theme.color1.val, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: accentMuted, padding: 14, flexDirection: 'row', gap: 12 }}>
                <Image source={{ uri: item.image }} style={{ width: 80, height: 80, borderRadius: 10 }} resizeMode="cover" />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.color12.val, fontWeight: '700', fontSize: 15 }} numberOfLines={2}>{item.title}</Text>
                  <Text style={{ color: accent, fontWeight: '700', fontSize: 16, marginTop: 4 }}>{item.price}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <Avatar seed={item.person} size={16} />
                    <Text style={{ color: accent, fontSize: 12 }}>@{item.person}</Text>
                    <Text style={{ color: accentMuted, fontSize: 12 }}> · {item.condition}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
        )
      })}
    </View>
  )
})
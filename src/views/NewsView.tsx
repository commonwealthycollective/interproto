import React, { useMemo } from 'react'
import { View, TouchableOpacity, Image, TextInput } from 'react-native'
import { Text, useTheme } from 'tamagui'
import { useNavigation } from '../context/NavigationContext'
import { useAccent } from '../hooks/useAccent'
import { MOCK_NEWS } from '../constants'
import Icon from '../components/Icon'

interface FilterViewProps {
  isSearching: boolean
  searchQuery: string
  activeFilters: string[]
  setFilterSearching: (searching: boolean) => void
  setFilterSearchQuery: (query: string) => void
  toggleFilterPill: (pill: string) => void
}

const NEWS_FILTERS = ['All', 'Transportation', 'Environment', 'Arts', 'Community', 'Education', 'Recreation']

export default React.memo(function NewsView({ filterProps }: { filterProps?: FilterViewProps }) {
  const theme = useTheme()
  const { accent, accentMuted } = useAccent()
  const { state, openDetail } = useNavigation()
  const { isSearching, searchQuery, activeFilters, setFilterSearching, setFilterSearchQuery, toggleFilterPill } = filterProps ?? {
    isSearching: false, searchQuery: '', activeFilters: [],
    setFilterSearching: () => {}, setFilterSearchQuery: () => {}, toggleFilterPill: () => {},
  }

  const filteredNews = useMemo(() => {
    let news = MOCK_NEWS
    if (searchQuery) {
      news = news.filter((n) => n.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    if (activeFilters.length > 0 && !activeFilters.includes('All')) {
      news = news.filter((n) => activeFilters.some((f) => n.category.toLowerCase() === f.toLowerCase()))
    }
    return news
  }, [searchQuery, activeFilters])

  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        {isSearching ? (
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: theme.color2.val, borderRadius: 10, paddingHorizontal: 12 }}>
            <Icon name="search" size={18} color={accent} />
            <TextInput
              style={{ flex: 1, height: 40, color: theme.color12.val, fontSize: 15, marginLeft: 8 }}
              placeholder="Search news..."
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
        {NEWS_FILTERS.map((pill) => (
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

      {filteredNews.length === 0 && (
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 60 }}>
          <Icon name="globe-outline" size={48} color={accentMuted} />
          <Text style={{ color: accent, fontSize: 14, marginTop: 12 }}>No news found</Text>
        </View>
      )}

      {filteredNews.map((item, index) => {
        const isFeatured = index === 0
        return (
            <TouchableOpacity key={item.id} onPress={() => openDetail('news', item)} activeOpacity={0.8}>
              {isFeatured ? (
                <View style={{ backgroundColor: theme.color1.val, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: accentMuted, overflow: 'hidden' }}>
                  {item.image && (
                    <Image source={{ uri: item.image }} style={{ width: '100%', height: 180, resizeMode: 'cover' }} />
                  )}
                  <View style={{ padding: 14 }}>
                    <Text style={{ color: accent, fontSize: 12, fontWeight: '600', marginBottom: 4 }}>{item.source} · {item.date}</Text>
                    <Text style={{ color: theme.color12.val, fontWeight: '700', fontSize: 17, marginBottom: 6 }} numberOfLines={2}>{item.title}</Text>
                    <Text style={{ color: accent, fontSize: 12 }}>{item.readingTime}</Text>
                  </View>
                </View>
              ) : (
                <View style={{ backgroundColor: theme.color1.val, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: accentMuted, padding: 14, flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: accent, fontSize: 12, fontWeight: '600', marginBottom: 4 }}>{item.source} · {item.date}</Text>
                    <Text style={{ color: theme.color12.val, fontWeight: '700', fontSize: 15, lineHeight: 20 }} numberOfLines={3}>{item.title}</Text>
                    <Text style={{ color: accent, fontSize: 12, marginTop: 4 }}>{item.readingTime}</Text>
                  </View>
                  {item.image && (
                    <Image source={{ uri: item.image }} style={{ width: 80, height: 80, borderRadius: 10 }} resizeMode="cover" />
                  )}
                </View>
              )}
            </TouchableOpacity>
        )
      })}
    </View>
  )
})
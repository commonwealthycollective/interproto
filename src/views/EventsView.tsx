import React, { useMemo } from 'react'
import { View, TouchableOpacity, Share, TextInput, Image } from 'react-native'
import { Text, useTheme } from 'tamagui'
import { useNavigation } from '../context/NavigationContext'
import { useAccent } from '../hooks/useAccent'
import { MOCK_EVENTS } from '../constants'
import Icon from '../components/Icon'

interface FilterViewProps {
  isSearching: boolean
  searchQuery: string
  activeFilters: string[]
  setFilterSearching: (searching: boolean) => void
  setFilterSearchQuery: (query: string) => void
  toggleFilterPill: (pill: string) => void
}

const EVENT_FILTERS = ['Today', 'This Week', 'This Month', 'Online', 'Free']

export default React.memo(function EventsView({ filterProps }: { filterProps?: FilterViewProps }) {
  const theme = useTheme()
  const { accent, accentMuted } = useAccent()
  const { state, openDetail } = useNavigation()
  const { isSearching, searchQuery, activeFilters, setFilterSearching, setFilterSearchQuery, toggleFilterPill } = filterProps ?? {
    isSearching: false, searchQuery: '', activeFilters: [],
    setFilterSearching: () => {}, setFilterSearchQuery: () => {}, toggleFilterPill: () => {},
  }

  const filteredEvents = useMemo(() => {
    let events = MOCK_EVENTS
    if (state.currentVaultId) {
      const vault = state.currentVaultId
      events = events.filter(() => true)
    }
    if (searchQuery) {
      events = events.filter((e) => e.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    if (activeFilters.length > 0) {
      if (activeFilters.includes('Free')) events = events.filter((e) => e.price === 'Free')
      if (activeFilters.includes('Online')) events = events.filter((e) => e.category === 'tech')
      if (activeFilters.includes('Today')) events = events.filter((e) => e.date === 'Jun 10')
      if (activeFilters.includes('This Week')) events = events.filter((e) => ['Jun 10', 'Jun 11', 'Jun 12', 'Jun 13', 'Jun 14', 'Jun 15', 'Jun 16'].includes(e.date))
      if (activeFilters.includes('This Month')) events = events.filter((e) => e.date.startsWith('Jun'))
    }
    return events
  }, [state.currentVaultId, searchQuery, activeFilters])

  const handleShare = async (event: typeof MOCK_EVENTS[0]) => {
    await Share.share({ message: `${event.title} — ${event.date} at ${event.venue}. ${event.description}` })
  }

  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        {isSearching ? (
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: theme.color2.val, borderRadius: 10, paddingHorizontal: 12 }}>
            <Icon name="search" size={18} color={accent} />
            <TextInput
              style={{ flex: 1, height: 40, color: theme.color12.val, fontSize: 15, marginLeft: 8 }}
              placeholder="Search events..."
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
        {EVENT_FILTERS.map((pill) => (
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

      {filteredEvents.length === 0 && (
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 60 }}>
          <Icon name="calendar-outline" size={48} color={accentMuted} />
          <Text style={{ color: accent, fontSize: 14, marginTop: 12 }}>No events found</Text>
        </View>
      )}

      {filteredEvents.map((event, index) => (
          <TouchableOpacity
            key={event.id}
            onPress={() => openDetail('events', event)}
            activeOpacity={0.8}
          >
            <View style={{ backgroundColor: theme.color1.val, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: accentMuted, overflow: 'hidden' }}>
              <View style={{ height: 160, backgroundColor: theme.color2.val, overflow: 'hidden' }}>
                <Image source={{ uri: event.image }} style={{ width: '100%', height: 160, resizeMode: 'cover' }} />
              </View>
              <View style={{ padding: 14 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Text style={{ color: theme.color12.val, fontWeight: '700', fontSize: 16, flex: 1, marginRight: 8 }} numberOfLines={2}>
                    {event.title}
                  </Text>
                  <TouchableOpacity onPress={() => handleShare(event)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Icon name="more-vert" size={20} color={accent} strokeWidth={1.875} />
                  </TouchableOpacity>
                </View>
                <View style={{ marginTop: 9, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
                  <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: accentMuted }}>
                    <Text style={{ color: theme.color12.val, fontSize: 12, fontWeight: '600' }}>{event.price}</Text>
                  </View>
                  <Text style={{ color: accent, fontSize: 14 }}> · {event.date} · {event.time} · {event.venue}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
      ))}
    </View>
  )
})
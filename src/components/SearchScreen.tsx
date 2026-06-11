import React, { useRef, useEffect, useState } from 'react'
import { View, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native'
import { Text, useTheme } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '../context/NavigationContext'
import { useAccent } from '../hooks/useAccent'
import Icon from './Icon'

const SCREEN_HEIGHT = Dimensions.get('window').height

const RECENT_SEARCHES = ['Community garden', 'Bike repair', 'Pottery class', 'Farmers market', 'Running trails']
const SUGGESTED_SEARCHES = ['Events this weekend', 'New near downtown', 'Popular this week', 'Running groups', 'Art classes', 'Local coffee shops', 'Volunteer opportunities', 'Live music']

const SearchScreen = React.memo(function SearchScreen() {
  const theme = useTheme()
  const { accent, accentMuted } = useAccent()
  const { hideSearch } = useNavigation()
  const insets = useSafeAreaInsets()
  const inputRef = useRef<TextInput>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background.val }]}>
      <View style={styles.searchRow}>
        <View style={[styles.searchInputWrap, { backgroundColor: theme.color2.val }]}>
          <Icon name="search" size={18} color={accent} />
          <TextInput
            ref={inputRef}
            style={[styles.searchInput, { color: theme.color12.val }]}
            placeholder="Search..."
            placeholderTextColor={accentMuted}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Icon name="close" size={16} color={accent} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={hideSearch} style={styles.cancelBtn}>
          <Text style={[styles.cancelText, { color: accent }]}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: accent }]}>Recent</Text>
          {RECENT_SEARCHES.map(term => (
            <TouchableOpacity
              key={term}
              onPress={() => setQuery(term)}
              style={styles.searchItem}
            >
              <Icon name="time-outline" size={16} color={accent} />
              <Text style={[styles.searchItemText, { color: theme.color12.val }]}>{term}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.separator, { backgroundColor: accentMuted }]} />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: accent }]}>Suggested</Text>
          {SUGGESTED_SEARCHES.map(term => (
            <TouchableOpacity
              key={term}
              onPress={() => setQuery(term)}
              style={styles.searchItem}
            >
              <Icon name="search" size={16} color={accent} />
              <Text style={[styles.searchItemText, { color: theme.color12.val }]}>{term}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    zIndex: 400,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
    height: 44,
    marginTop: 8,
    marginBottom: 12,
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    marginLeft: 8,
  },
  cancelBtn: {
    paddingHorizontal: 4,
    height: 44,
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  searchItemText: {
    fontSize: 15,
  },
  separator: {
    height: 1,
    marginHorizontal: 16,
    marginVertical: 12,
  },
})

export default SearchScreen
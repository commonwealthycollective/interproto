import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, TouchableOpacity, Text, Dimensions, StyleSheet } from 'react-native'
import { useTheme } from 'tamagui'
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps'
import * as Location from 'expo-location'
import { useNavigation } from '../context/NavigationContext'
import { useAccent } from '../hooks/useAccent'
import Icon from '../components/Icon'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const DEFAULT_REGION = {
  latitude: 40.7128,
  longitude: -74.006,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
}

interface Pin {
  id: string
  coordinate: { latitude: number; longitude: number }
  emoji: string
  text: string
}

interface RouteInfo {
  distance: number
  duration: number
  coordinates: { latitude: number; longitude: number }[]
}

export default React.memo(function MapsView() {
  const theme = useTheme()
  const { accent, accentMuted, def } = useAccent()
  const { state, setMapsAction } = useNavigation()
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [pins, setPins] = useState<Pin[]>([])
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null)
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([])
  const [routeVisible, setRouteVisible] = useState(false)
  const mapRef = useRef<MapView>(null)
  const locationSubscription = useRef<Location.LocationSubscription | null>(null)

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') return
      const loc = await Location.getCurrentPositionAsync({})
      setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude })
      mapRef.current?.animateToRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      })
      locationSubscription.current = await Location.watchPositionAsync({}, (pos) => {
        setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude })
      })
    })()
    return () => {
      locationSubscription.current?.remove()
    }
  }, [])

  const fetchRoute = useCallback(async (fromLat: number, fromLng: number, toLat: number, toLng: number, mode: string) => {
    const profile = mode === 'car' ? 'driving' : mode === 'bike' ? 'cycling' : 'foot'
    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/${profile}/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`
      )
      const data = await res.json()
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0]
        const coords = route.geometry.coordinates.map(([lng, lat]: [number, number]) => ({ latitude: lat, longitude: lng }))
        setRouteCoords(coords)
        setRouteInfo({
          distance: Math.round(route.distance),
          duration: Math.round(route.duration / 60),
          coordinates: coords,
        })
        setRouteVisible(true)
        if (coords.length > 0) {
          mapRef.current?.fitToCoordinates(coords, { edgePadding: { top: 80, right: 40, bottom: 120, left: 40 }, animated: true })
        }
      }
    } catch (e) {
      console.error('Route fetch error', e)
    }
  }, [])

  useEffect(() => {
    const action = state.mapsAction
    if (action.type === 'addPin' && action.pin) {
      const center = location ?? { latitude: DEFAULT_REGION.latitude, longitude: DEFAULT_REGION.longitude }
      setPins((prev) => [
        ...prev,
        { id: `pin-${Date.now()}`, coordinate: { latitude: center.latitude + (Math.random() - 0.5) * 0.002, longitude: center.longitude + (Math.random() - 0.5) * 0.002 }, emoji: action.pin!.emoji, text: action.pin!.text },
      ])
      setMapsAction({ type: 'search' })
    } else if (action.type === 'search' && action.searchQuery) {
      setMapsAction({ type: 'search' })
    } else if (action.type === 'directions' && location) {
      const to = action.directions?.to ?? { lat: location.latitude + 0.01, lng: location.longitude + 0.01 }
      fetchRoute(location.latitude, location.longitude, to.lat, to.lng, action.directions?.mode ?? 'car')
      setMapsAction({ type: 'search' })
    }
  }, [state.mapsAction])

  const handleLongPress = (e: any) => {
    const coord = e.nativeEvent.coordinate
    setPins((prev) => [
      ...prev,
      { id: `pin-${Date.now()}`, coordinate: { latitude: coord.latitude, longitude: coord.longitude }, emoji: '📍', text: 'Dropped pin' },
    ])
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={StyleSheet.absoluteFill}
        initialRegion={DEFAULT_REGION}
        showsUserLocation
        onLongPress={handleLongPress}
      >
        {location && (
          <Marker coordinate={location} title="You">
            <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: accent, borderWidth: 3, borderColor: '#fff' }} />
          </Marker>
        )}
        {pins.map((pin) => (
          <Marker key={pin.id} coordinate={pin.coordinate} title={pin.text}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24 }}>{pin.emoji}</Text>
              {pin.text ? (
                <Text style={{ fontSize: 10, color: '#333', fontWeight: '600', marginTop: 2 }}>{pin.text}</Text>
              ) : null}
            </View>
          </Marker>
        ))}
        {routeVisible && routeCoords.length > 0 && (
          <Polyline coordinates={routeCoords} strokeColor={accent} strokeWidth={4} />
        )}
      </MapView>

      {routeVisible && routeInfo && (
        <View style={{ position: 'absolute', bottom: 100, left: 16, right: 16, backgroundColor: theme.color1.val, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: accentMuted }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ color: theme.color12.val, fontWeight: '700', fontSize: 16 }}>
                {(routeInfo.distance / 1000).toFixed(1)} km · {routeInfo.duration} min
              </Text>
              <Text style={{ color: accent, fontSize: 13, marginTop: 2 }}>Route info</Text>
            </View>
            <TouchableOpacity
              onPress={() => { setRouteVisible(false); setRouteCoords([]); setRouteInfo(null) }}
              style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: accentMuted }}
            >
              <Text style={{ color: accent, fontWeight: '600', fontSize: 13 }}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  )
})
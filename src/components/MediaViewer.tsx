import React, { useRef, useState } from 'react'
import { Dimensions, Modal, FlatList, TouchableOpacity, View } from 'react-native'
import { useVideoPlayer, VideoView } from 'expo-video'
import type { PostMedia } from '../types'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

interface MediaViewerProps {
  media: PostMedia[]
  initialIndex: number
  onClose: () => void
}

export default function MediaViewer({ media, initialIndex, onClose }: MediaViewerProps) {
  const flatListRef = useRef<FlatList>(null)

  return (
    <Modal visible animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <TouchableOpacity
          onPress={onClose}
          style={{ position: 'absolute', top: 60, right: 16, zIndex: 10, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
        >
          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 14, height: 2, backgroundColor: '#fff', position: 'absolute', transform: [{ rotate: '45deg' }] }} />
            <View style={{ width: 14, height: 2, backgroundColor: '#fff', position: 'absolute', transform: [{ rotate: '-45deg' }] }} />
          </View>
        </TouchableOpacity>
        <FlatList
          ref={flatListRef}
          data={media}
          keyExtractor={(_, i) => String(i)}
          horizontal
          pagingEnabled
          initialScrollIndex={initialIndex}
          getItemLayout={(_, index) => ({ length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index })}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) =>
            item.type === 'video' ? (
              <VideoPlayerItem uri={item.uri} />
            ) : (
              <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ width: '100%', height: '100%', backgroundColor: '#000' }} />
              </View>
            )
          }
        />
      </View>
    </Modal>
  )
}

function VideoPlayerItem({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true
    p.muted = true
    p.play()
  })

  return (
    <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, alignItems: 'center', justifyContent: 'center' }}>
      <VideoView
        player={player}
        style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.7 }}
        nativeControls
      />
    </View>
  )
}
import React, { useRef, useState } from 'react'
import { Dimensions, Modal, FlatList, TouchableOpacity, View, Image } from 'react-native'
import { Text, useTheme } from 'tamagui'
import { useVideoPlayer, VideoView } from 'expo-video'
import { useAccent } from '../hooks/useAccent'
import type { PostMedia } from '../types'
import Icon from './Icon'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

interface MediaViewerProps {
  media: PostMedia[]
  initialIndex: number
  onClose: () => void
  post?: {
    id: string
    likes: number
    comments: number
    reposts: number
  }
  isLiked?: boolean
  currentLikes?: number
  currentReposts?: number
  onLike?: () => void
  onComment?: () => void
  onQuote?: () => void
  onRepostOnly?: () => void
}

export default function MediaViewer({ media, initialIndex, onClose, post, isLiked, currentLikes, currentReposts, onLike, onComment, onQuote, onRepostOnly }: MediaViewerProps) {
  const theme = useTheme()
  const { accent } = useAccent()
  const flatListRef = useRef<FlatList>(null)
  const [showRepostModal, setShowRepostModal] = useState(false)

  const handleRepostPress = () => {
    setShowRepostModal(true)
  }

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
                <Image source={{ uri: item.uri }} style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.6 }} resizeMode="contain" />
              </View>
            )
          }
        />

        {post && onLike && onComment && (
          <View style={{ position: 'absolute', bottom: 100, left: 0, right: 0, alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 24, paddingHorizontal: 20, paddingVertical: 10 }}>
              <TouchableOpacity onPress={onLike} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon
                  name={isLiked ? 'heart-solid' : 'heart-outline'}
                  size={22}
                  color={isLiked ? '#ff3b30' : '#fff'}
                  strokeWidth={2.4}
                />
                <Text style={{ color: isLiked ? '#ff3b30' : '#fff', fontSize: 14, fontWeight: '600' }}>{currentLikes ?? post.likes}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={onComment} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon name="chatbubble-outline" size={22} color="#fff" strokeWidth={2.4} />
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>{post.comments}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleRepostPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon name="repeat" size={22} color="#fff" strokeWidth={2.4} />
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>{currentReposts ?? post.reposts}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Modal visible={showRepostModal} transparent animationType="fade" onRequestClose={() => setShowRepostModal(false)}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setShowRepostModal(false)}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0.4)', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#1C1C1E', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20, paddingBottom: 40 }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 18, marginBottom: 16 }}>Repost</Text>
              <TouchableOpacity
                onPress={() => { setShowRepostModal(false); onQuote?.() }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' }}
              >
                <Icon name="quote-message" size={22} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 16 }}>Quote</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setShowRepostModal(false); onRepostOnly?.() }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 }}
              >
                <Icon name="repeat" size={22} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 16 }}>Repost Only</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
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
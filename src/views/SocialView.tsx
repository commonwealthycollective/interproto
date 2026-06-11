import React, { useState, useMemo } from 'react'
import { View, TouchableOpacity, Modal, FlatList, Dimensions, Image } from 'react-native'
import { Text, useTheme } from 'tamagui'
import { useVideoPlayer, VideoView } from 'expo-video'
import { useNavigation } from '../context/NavigationContext'
import { useAccent } from '../hooks/useAccent'
import { MOCK_POSTS, MOCK_PROFILES } from '../constants'
import type { PostMedia } from '../types'
import Icon from '../components/Icon'
import Avatar from '../components/Avatar'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CONTENT_WIDTH = SCREEN_WIDTH - 32

function FeedVideo({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true
    p.muted = true
    p.play()
  })
  const [muted, setMuted] = useState(true)

  return (
    <View style={{ position: 'relative' }}>
      <VideoView
        player={player}
        style={{ width: CONTENT_WIDTH - 68, height: 220, borderRadius: 10 }}
        nativeControls={false}
      />
      <TouchableOpacity
        onPress={() => {
          setMuted(!muted)
          player.muted = !muted
        }}
        style={{ position: 'absolute', bottom: 8, right: 8, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}
      >
        <Icon name={muted ? 'volume-off' : 'volume-high'} size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

export default React.memo(function SocialView() {
  const theme = useTheme()
  const { accent, accentMuted } = useAccent()
  const { state, openDetail, openDrawer, setQuotedPost } = useNavigation()

  const [liked, setLiked] = useState<Record<string, boolean>>({})
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({})
  const [repostCounts, setRepostCounts] = useState<Record<string, number>>({})
  const [repostModal, setRepostModal] = useState<string | null>(null)
  const [mediaModal, setMediaModal] = useState<{ media: PostMedia[]; index: number } | null>(null)

  const filteredPosts = useMemo(() => {
    if (!state.currentVaultId) return MOCK_POSTS
    return MOCK_POSTS.filter((p) => p.vaultId === state.currentVaultId)
  }, [state.currentVaultId])

  const toggleLike = (id: string) => {
    const wasLiked = liked[id] ?? false
    const baseLikes = MOCK_POSTS.find((p) => p.id === id)?.likes ?? 0
    setLiked((prev) => ({ ...prev, [id]: !wasLiked }))
    setLikeCounts((prev) => ({
      ...prev,
      [id]: (prev[id] ?? baseLikes) + (wasLiked ? -1 : 1),
    }))
  }

  const handleQuote = (postId: string) => {
    const post = MOCK_POSTS.find((p) => p.id === postId)
    if (post) {
      setQuotedPost({ author: post.author, text: post.text, media: post.media ?? [] })
      openDrawer('post')
    }
    setRepostModal(null)
  }

  const handleRepostOnly = (postId: string) => {
    setRepostCounts((prev) => ({
      ...prev,
      [postId]: (prev[postId] ?? MOCK_POSTS.find((p) => p.id === postId)?.reposts ?? 0) + 1,
    }))
    setRepostModal(null)
  }

  const renderMedia = (media: PostMedia[]) => {
    if (media.length === 1) {
      return media[0].type === 'video' ? (
        <FeedVideo uri={media[0].uri} />
      ) : (
        <Image
          source={{ uri: media[0].uri }}
          style={{ width: CONTENT_WIDTH - 68, height: 220, borderRadius: 10 }}
          resizeMode="cover"
        />
      )
    }
    return (
      <View style={{ flexDirection: 'row', gap: 4 }}>
        {media.slice(0, 3).map((m, i) => (
          m.type === 'video' ? (
            <View key={i} style={{ flex: 1, height: 140, borderRadius: 8, overflow: 'hidden' }}>
              <FeedVideo uri={m.uri} />
            </View>
          ) : (
            <Image
              key={i}
              source={{ uri: m.uri }}
              style={{ flex: 1, height: 140, borderRadius: 8 }}
              resizeMode="cover"
            />
          )
        ))}
      </View>
    )
  }

  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
      {filteredPosts.length === 0 && (
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 60 }}>
          <Icon name="chatbubble-outline" size={48} color={accentMuted} />
          <Text style={{ color: accent, fontSize: 14, marginTop: 12 }}>No posts in this vault</Text>
        </View>
      )}
      {filteredPosts.map((post, index) => {
        const isLiked = liked[post.id] ?? false
        const currentLikes = likeCounts[post.id] ?? post.likes
        const currentReposts = repostCounts[post.id] ?? post.reposts
        const author = MOCK_PROFILES[post.author]
        const displayName = author?.displayName ?? post.author

        return (
          <React.Fragment key={post.id}>
            <View
              style={{
                backgroundColor: theme.color1.val,
                borderRadius: 14,
                padding: 14,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                <TouchableOpacity onPress={() => openDetail('profile', { username: post.author })}>
                  <Avatar seed={post.author} size={48} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity onPress={() => openDetail('profile', { username: post.author })}>
                    <Text style={{ color: accent, fontWeight: '700', fontSize: 15 }}>{displayName}</Text>
                    <Text style={{ color: accentMuted, fontSize: 12 }}>@{post.author} · {post.time}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => openDetail('social', post)}
                    activeOpacity={0.7}
                  >
                    {post.text ? (
                      <Text style={{ color: theme.color12.val, fontSize: 15, marginTop: 4, marginBottom: (post.media?.length || post.quotedPost || post.linkUrl) ? 8 : 4 }}>
                        {post.text}
                      </Text>
                    ) : null}
                  </TouchableOpacity>

                  {post.quotedPost && (
                    <TouchableOpacity
                      onPress={() => {
                        const src = MOCK_POSTS.find((p) => p.author === post.quotedPost!.author)
                        if (src) openDetail('social', src)
                      }}
                      style={{
                        padding: 12,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: accentMuted,
                        marginBottom: 8,
                        width: CONTENT_WIDTH - 68,
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <Avatar seed={post.quotedPost.author} size={16} />
                        <Text style={{ color: accent, fontWeight: '600', fontSize: 13 }}>@{post.quotedPost.author}</Text>
                      </View>
                      <Text style={{ color: theme.color12.val, fontSize: 13 }}>{post.quotedPost.text}</Text>
                    </TouchableOpacity>
                  )}

                  {post.media && post.media.length > 0 && (
                    <TouchableOpacity
                      onPress={() => setMediaModal({ media: post.media, index: 0 })}
                      activeOpacity={0.9}
                      style={{ marginBottom: post.linkUrl ? 8 : 8, marginTop: 4 }}
                    >
                      {renderMedia(post.media)}
                    </TouchableOpacity>
                  )}

                  {post.linkUrl && (
                    <TouchableOpacity onPress={() => {}} style={{ marginBottom: 4 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: accentMuted }}>
                        <Icon name="link-outline" size={16} color={accent} />
                        <Text style={{ color: accent, fontSize: 13, flex: 1 }} numberOfLines={1}>{post.linkUrl}</Text>
                      </View>
                    </TouchableOpacity>
                  )}

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 4 }}>
                    <TouchableOpacity
                      onPress={() => toggleLike(post.id)}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                    >
                      <Icon
                        name={isLiked ? 'heart-solid' : 'heart-outline'}
                        size={18}
                        color={isLiked ? '#ff3b30' : accent}
                        strokeWidth={2.4}
                      />
                      <Text style={{ color: isLiked ? '#ff3b30' : accent, fontSize: 13 }}>{currentLikes}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => openDetail('social', post)}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                    >
                      <Icon name="chatbubble-outline" size={18} color={accent} strokeWidth={2.4} />
                      <Text style={{ color: accent, fontSize: 13 }}>{post.comments}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setRepostModal(post.id)}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                    >
                      <Icon name="repeat" size={18} color={accent} strokeWidth={2.4} />
                      <Text style={{ color: accent, fontSize: 13 }}>{currentReposts}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            {index < filteredPosts.length - 1 && (
              <View style={{ height: 1, backgroundColor: accentMuted, marginVertical: 6, marginLeft: 14 }} />
            )}
          </React.Fragment>
        )
      })}

      <Modal visible={repostModal !== null} transparent animationType="fade" onRequestClose={() => setRepostModal(null)}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setRepostModal(null)}>
          <View style={{ backgroundColor: 'rgba(0,0,0,0.4)', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: theme.color1.val, borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20, paddingBottom: 40 }}>
            <Text style={{ color: theme.color12.val, fontWeight: '700', fontSize: 18, marginBottom: 16 }}>Repost</Text>
            <TouchableOpacity
              onPress={() => repostModal && handleQuote(repostModal)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: accentMuted }}
            >
              <Icon name="quote-message" size={22} color={accent} />
              <Text style={{ color: theme.color12.val, fontSize: 16 }}>Quote</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => repostModal && handleRepostOnly(repostModal)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 }}
            >
              <Icon name="repeat" size={22} color={accent} />
              <Text style={{ color: theme.color12.val, fontSize: 16 }}>Repost Only</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {mediaModal && (
        <Modal visible animationType="fade" onRequestClose={() => setMediaModal(null)}>
          <View style={{ flex: 1, backgroundColor: '#000' }}>
            <TouchableOpacity
              onPress={() => setMediaModal(null)}
              style={{ position: 'absolute', top: 60, right: 16, zIndex: 10, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
            >
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ width: 14, height: 2, backgroundColor: '#fff', position: 'absolute', transform: [{ rotate: '45deg' }] }} />
                <View style={{ width: 14, height: 2, backgroundColor: '#fff', position: 'absolute', transform: [{ rotate: '-45deg' }] }} />
              </View>
            </TouchableOpacity>
            <FlatList
              data={mediaModal.media}
              keyExtractor={(_, i) => String(i)}
              horizontal
              pagingEnabled
              initialScrollIndex={mediaModal.index}
              getItemLayout={(_, index) => ({ length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index })}
              renderItem={({ item }) =>
                item.type === 'video' ? (
                  <View style={{ width: SCREEN_WIDTH, height: Dimensions.get('window').height, alignItems: 'center', justifyContent: 'center' }}>
                    <FeedVideo uri={item.uri} />
                  </View>
                ) : (
                  <View style={{ width: SCREEN_WIDTH, height: Dimensions.get('window').height, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={{ uri: item.uri }} style={{ width: SCREEN_WIDTH, height: 300 }} resizeMode="contain" />
                  </View>
                )
              }
            />
          </View>
        </Modal>
      )}
    </View>
  )
})
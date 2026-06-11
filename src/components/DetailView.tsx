import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { View, ScrollView, TouchableOpacity, TextInput, Animated, Dimensions, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { Text, useTheme } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useVideoPlayer, VideoView } from 'expo-video'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '../context/NavigationContext'
import { useAccent } from '../hooks/useAccent'
import { MOCK_POSTS, MOCK_PROFILES, MOCK_MESSAGES, MOCK_EVENTS, MOCK_NEWS, MOCK_COMMERCE } from '../constants'
import type { PostMedia } from '../types'
import Icon from './Icon'
import Avatar from './Avatar'
import MediaViewer from './MediaViewer'

const SCREEN_WIDTH = Dimensions.get('window').width
const CONTENT_WIDTH = SCREEN_WIDTH - 32

const MOCK_REPLIES = [
  { id: 'reply1', author: 'mayalee', text: 'This is great! Count me in.', time: '1h ago', likes: 3 },
  { id: 'reply2', author: 'djkimo', text: 'Awesome work!', time: '45m ago', likes: 1 },
  { id: 'reply3', author: 'sarah_oh', text: 'Love to see this happening in our community.', time: '30m ago', likes: 5 },
]

function DetailVideo({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (p: any) => {
    p.loop = true
    p.muted = true
    p.play()
  })
  return (
    <View style={{ width: '100%', aspectRatio: 16 / 9 }}>
      <VideoView player={player} style={{ width: '100%', height: '100%' }} nativeControls />
    </View>
  )
}

interface DetailViewProps {
  detailAnim: Animated.Value
}

const DetailView = React.memo(function DetailView({ detailAnim }: DetailViewProps) {
  const theme = useTheme()
  const { accent, accentMuted, def } = useAccent()
  const { state, openDetail, closeDetail, setQuotedPost, openDrawer } = useNavigation()
  const insets = useSafeAreaInsets()

  const [activeDetail, setActiveDetail] = useState<{ viewId: string; item: any } | null>(null)
  const [detailLiked, setDetailLiked] = useState<Record<string, boolean>>({})
  const [detailLikeCounts, setDetailLikeCounts] = useState<Record<string, number>>({})
  const [commentText, setCommentText] = useState('')
  const [messageText, setMessageText] = useState('')
  const [qty, setQty] = useState(1)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [mediaViewerIndex, setMediaViewerIndex] = useState<number | null>(null)
  const [mediaViewerVisible, setMediaViewerVisible] = useState(false)
  const [repostModalVisible, setRepostModalVisible] = useState(false)
  const [repostTarget, setRepostTarget] = useState<string | null>(null)
  const messageListRef = useRef<ScrollView>(null)
  const actionOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (state.detail) {
      setActiveDetail(state.detail)
      const item = state.detail.item
      if (state.detail.viewId === 'social' || state.detail.viewId === 'profile') {
        const post = item
        const initialLiked: Record<string, boolean> = {}
        const initialCounts: Record<string, number> = {}
        const prefix = state.detail.viewId === 'profile' ? 'profile_' : ''
        initialLiked[prefix + post.id] = false
        initialCounts[prefix + post.id] = post.likes || 0
        MOCK_REPLIES.forEach(r => {
          initialLiked[prefix + r.id] = false
          initialCounts[prefix + r.id] = r.likes || 0
        })
        if (state.detail.viewId === 'profile') {
          const profilePosts = MOCK_POSTS.filter(p => p.author === item.username)
          profilePosts.forEach(p => {
            if (!initialLiked['profile_' + p.id]) {
              initialLiked['profile_' + p.id] = false
              initialCounts['profile_' + p.id] = p.likes || 0
            }
          })
        }
        setDetailLiked(initialLiked)
        setDetailLikeCounts(initialCounts)
      }
      Animated.timing(actionOpacity, { toValue: 1, duration: 150, useNativeDriver: true }).start()
      setQty(1)
      setOrderPlaced(false)
      setCommentText('')
      setMessageText('')
      setMediaViewerVisible(false)
      setMediaViewerIndex(null)
    } else {
      Animated.timing(actionOpacity, { toValue: 0, duration: 150, useNativeDriver: true }).start()
    }
  }, [state.detail])

  useEffect(() => {
    if (state.detail?.viewId === 'messages' && activeDetail?.viewId === 'messages') {
      setTimeout(() => messageListRef.current?.scrollToEnd({ animated: true }), 100)
    }
  }, [state.detail, activeDetail])

  const toggleLike = useCallback((id: string) => {
    setDetailLiked(prev => {
      const liked = prev[id]
      setDetailLikeCounts(cnts => ({ ...cnts, [id]: Math.max(0, (cnts[id] || 0) + (liked ? -1 : 1)) }))
      return { ...prev, [id]: !liked }
    })
  }, [])

  const handleClose = useCallback(() => {
    closeDetail()
  }, [closeDetail])

  const slideX = useMemo(() => detailAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCREEN_WIDTH],
  }), [detailAnim])

  const handleRepost = useCallback((postId: string) => {
    setRepostTarget(postId)
    setRepostModalVisible(true)
  }, [])

  const handleRepostOnly = useCallback(() => {
    if (repostTarget) {
      setDetailLikeCounts(prev => ({
        ...prev,
        [repostTarget]: (prev[repostTarget] || 0) + 1,
      }))
    }
    setRepostModalVisible(false)
    setRepostTarget(null)
  }, [repostTarget])

  const handleQuotePost = useCallback(() => {
    if (repostTarget) {
      const post = MOCK_POSTS.find(p => p.id === repostTarget)
      if (post) {
        setQuotedPost({ author: post.author, text: post.text, media: post.media || [] })
        closeDetail()
        setTimeout(() => {
          openDrawer('post')
        }, 200)
      }
    }
    setRepostModalVisible(false)
    setRepostTarget(null)
  }, [repostTarget, closeDetail, setQuotedPost, openDrawer])

  const AccentButton = ({ onPress, title, style }: { onPress: () => void; title: string; style?: any }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[{ height: 44, borderRadius: 10, overflow: 'hidden' }, style]}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <LinearGradient colors={def.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: def.name === 'White' ? theme.color12.val : '#fff', fontWeight: '700', fontSize: 16 }}>{title}</Text>
      </View>
    </TouchableOpacity>
  )

  const renderSocialContent = (post: any) => {
    const prefix = activeDetail?.viewId === 'profile' ? 'profile_' : ''
    const postId = prefix + post.id
    const isLiked = detailLiked[postId] || false
    const likeCount = detailLikeCounts[postId] || post.likes || 0
    const profile = MOCK_PROFILES[post.author]

    return (
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 16, paddingBottom: 80 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 4 }}>
            <TouchableOpacity onPress={() => profile && openDetail('profile', profile)}>
              <Avatar seed={post.author} size={36} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <TouchableOpacity onPress={() => profile && openDetail('profile', profile)}>
                <Text style={{ color: accent, fontWeight: '600', fontSize: 15 }}>@{post.author}</Text>
              </TouchableOpacity>
              <Text style={{ color: accentMuted, fontSize: 13, marginTop: 2, textAlign: 'left' }}>{post.time}</Text>
            </View>
          </View>

          <Text style={{ color: theme.color12.val, fontSize: 16, lineHeight: 22, marginTop: 4, marginBottom: 8 }}>
            {post.text}
          </Text>

          {post.quotedPost && (
            <View style={{ padding: 12, borderRadius: 8, borderWidth: 1, borderColor: accentMuted, width: CONTENT_WIDTH, marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                <Avatar seed={post.quotedPost.author} size={16} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: accent, fontWeight: '600', fontSize: 13 }}>@{post.quotedPost.author}</Text>
                  <Text style={{ color: theme.color12.val, fontSize: 13, marginTop: 4 }}>{post.quotedPost.text}</Text>
                </View>
              </View>
            </View>
          )}

          {post.media && post.media.length > 0 && (
            <View style={{ marginBottom: 12 }}>
              {post.media.length === 1 ? (
                <TouchableOpacity onPress={() => { setMediaViewerIndex(0); setMediaViewerVisible(true) }} activeOpacity={0.9}>
                  {post.media[0].type === 'video' ? (
                    <DetailVideo uri={post.media[0].uri} />
                  ) : (
                    <View style={{ width: '100%', aspectRatio: 3 / 2, borderRadius: 10, overflow: 'hidden', backgroundColor: theme.color2.val }}>
                      <Avatar seed={post.media[0].uri} size={1} />
                    </View>
                  )}
                </TouchableOpacity>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                  {post.media.map((m: PostMedia, i: number) => (
                    <TouchableOpacity key={i} onPress={() => { setMediaViewerIndex(i); setMediaViewerVisible(true) }} activeOpacity={0.9} style={{ marginRight: 8 }}>
                      <View style={{ width: SCREEN_WIDTH * 0.6, aspectRatio: 3 / 2, borderRadius: 10, overflow: 'hidden', backgroundColor: theme.color2.val }}>
                        <Avatar seed={m.uri} size={1} />
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          )}

          {post.linkUrl && (
            <TouchableOpacity style={{ padding: 10, borderRadius: 8, borderWidth: 1, borderColor: accentMuted, marginBottom: 12 }}>
              <Text style={{ color: accent, fontSize: 13 }} numberOfLines={1}>{post.linkUrl}</Text>
            </TouchableOpacity>
          )}

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 16 }}>
            <TouchableOpacity onPress={() => toggleLike(postId)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name={isLiked ? 'heart-solid' : 'heart-outline'} size={20} color={isLiked ? '#ff3b30' : accent} />
              <Text style={{ color: isLiked ? '#ff3b30' : accent, fontWeight: '600', fontSize: 14 }}>{likeCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="chatbubble-outline" size={18} color={accent} />
              <Text style={{ color: accent, fontWeight: '600', fontSize: 14 }}>{post.comments || 0}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRepost(post.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="repeat" size={18} color={accent} />
              <Text style={{ color: accent, fontWeight: '600', fontSize: 14 }}>{post.reposts || 0}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 1, backgroundColor: accentMuted, marginBottom: 16 }} />

          <Text style={{ color: accent, fontWeight: '700', fontSize: 15, marginBottom: 12 }}>Replies</Text>

          {MOCK_REPLIES.map(reply => {
            const replyId = prefix + reply.id
            const replyLiked = detailLiked[replyId] || false
            const replyLikes = detailLikeCounts[replyId] || reply.likes || 0
            const replyProfile = MOCK_PROFILES[reply.author]
            return (
              <View key={reply.id} style={{ marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                  <TouchableOpacity onPress={() => replyProfile && openDetail('profile', replyProfile)}>
                    <Avatar seed={reply.author} size={24} />
                  </TouchableOpacity>
                  <View style={{ flex: 1 }}>
                    <TouchableOpacity onPress={() => replyProfile && openDetail('profile', replyProfile)}>
                      <Text style={{ color: accent, fontWeight: '600', fontSize: 14 }}>@{reply.author}</Text>
                    </TouchableOpacity>
                    <Text style={{ color: theme.color12.val, fontSize: 14, lineHeight: 20, marginTop: 2, textAlign: 'left' }}>{reply.text}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6 }}>
                      <TouchableOpacity onPress={() => toggleLike(replyId)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Icon name={replyLiked ? 'heart-solid' : 'heart-outline'} size={14} color={replyLiked ? '#ff3b30' : accent} />
                        <Text style={{ color: replyLiked ? '#ff3b30' : accent, fontSize: 12, fontWeight: '600' }}>{replyLikes}</Text>
                      </TouchableOpacity>
                      <Text style={{ color: accentMuted, fontSize: 12 }}>{reply.time}</Text>
                    </View>
                  </View>
                </View>
              </View>
            )
          })}
        </View>

        {mediaViewerVisible && post.media && (
          <MediaViewer
            media={post.media}
            initialIndex={mediaViewerIndex || 0}
            onClose={() => setMediaViewerVisible(false)}
            post={post}
            isLiked={isLiked}
            currentLikes={likeCount}
            currentReposts={post.reposts || 0}
            onLike={() => toggleLike(postId)}
            onComment={() => {}}
            onQuote={() => {
              setQuotedPost({ author: post.author, text: post.text, media: post.media || [] })
              closeDetail()
              setTimeout(() => openDrawer('post'), 200)
            }}
            onRepostOnly={() => {}}
          />
        )}
      </ScrollView>
    )
  }

  const renderProfileContent = (profile: any) => {
    const profilePosts = MOCK_POSTS.filter(p => p.author === profile.username)

    return (
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 16, paddingBottom: 80 }}>
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Avatar seed={profile.username} size={80} />
            <Text style={{ color: theme.color12.val, fontWeight: '700', fontSize: 20, marginTop: 8 }}>{profile.displayName}</Text>
            <Text style={{ color: accent, fontWeight: '600', fontSize: 14 }}>@{profile.username}</Text>
            <Text style={{ color: theme.color12.val, fontSize: 14, textAlign: 'center', marginTop: 6, lineHeight: 20 }}>{profile.bio}</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 24, marginBottom: 16 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: theme.color12.val, fontWeight: '700', fontSize: 18 }}>{profilePosts.length}</Text>
              <Text style={{ color: accent, fontSize: 13 }}>Posts</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: theme.color12.val, fontWeight: '700', fontSize: 18 }}>{profile.followers}</Text>
              <Text style={{ color: accent, fontSize: 13 }}>Followers</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: theme.color12.val, fontWeight: '700', fontSize: 18 }}>{profile.following}</Text>
              <Text style={{ color: accent, fontSize: 13 }}>Following</Text>
            </View>
          </View>

          {profile.communities && profile.communities.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20, justifyContent: 'center' }}>
              {profile.communities.map((c: string) => (
                <View key={c} style={{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, backgroundColor: accentMuted }}>
                  <Text style={{ color: accent, fontWeight: '600', fontSize: 12 }}>{c}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={{ height: 1, backgroundColor: accentMuted, marginBottom: 16 }} />

          {profilePosts.map(post => {
            const postId = 'profile_' + post.id
            const isLiked = detailLiked[postId] || false
            const likeCount = detailLikeCounts[postId] || post.likes || 0

            return (
              <View key={post.id} style={{ marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: accentMuted }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 4 }}>
                  <TouchableOpacity onPress={() => openDetail('profile', profile)}>
                    <Avatar seed={post.author} size={32} />
                  </TouchableOpacity>
                  <View style={{ flex: 1 }}>
                    <TouchableOpacity onPress={() => openDetail('profile', profile)}>
                      <Text style={{ color: accent, fontWeight: '600', fontSize: 14 }}>@{post.author}</Text>
                    </TouchableOpacity>
                    <Text style={{ color: theme.color12.val, fontSize: 14, lineHeight: 20, marginTop: 4, textAlign: 'left' }}>{post.text}</Text>
                  </View>
                </View>

                {post.media && post.media.length > 0 && (
                  <View style={{ marginLeft: 42, marginBottom: 8 }}>
                    <TouchableOpacity onPress={() => openDetail('social', post)} activeOpacity={0.9}>
                      <View style={{ width: '100%', aspectRatio: 3 / 2, borderRadius: 8, overflow: 'hidden', backgroundColor: theme.color2.val }}>
                        <Avatar seed={post.media[0].uri} size={1} />
                      </View>
                    </TouchableOpacity>
                  </View>
                )}

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginLeft: 42 }}>
                  <TouchableOpacity onPress={() => toggleLike(postId)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Icon name={isLiked ? 'heart-solid' : 'heart-outline'} size={16} color={isLiked ? '#ff3b30' : accent} />
                    <Text style={{ color: isLiked ? '#ff3b30' : accent, fontSize: 13 }}>{likeCount}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Icon name="chatbubble-outline" size={14} color={accent} />
                    <Text style={{ color: accent, fontSize: 13 }}>{post.comments || 0}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRepost(post.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Icon name="repeat" size={14} color={accent} />
                    <Text style={{ color: accent, fontSize: 13 }}>{post.reposts || 0}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          })}
        </View>
      </ScrollView>
    )
  }

  const renderEventsContent = (event: any) => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={{ paddingBottom: 80 }}>
        <View style={{ width: '100%', aspectRatio: 16 / 9, backgroundColor: theme.color2.val }}>
          <Avatar seed={event.image || event.id} size={1} />
        </View>
        <View style={{ padding: 16 }}>
          <Text style={{ color: theme.color12.val, fontWeight: '700', fontSize: 20, marginBottom: 8 }}>{event.title}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Icon name="calendar-outline" size={14} color={accent} />
            <Text style={{ color: accent, fontSize: 14 }}>{event.date} · {event.time}</Text>
          </View>
          <Text style={{ color: accent, fontSize: 14, marginBottom: 12 }}>{event.venue} · {event.price}</Text>
          <Text style={{ color: theme.color12.val, fontSize: 15, lineHeight: 22 }}>{event.description}</Text>
        </View>
      </View>
    </ScrollView>
  )

  const renderNewsContent = (news: any) => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={{ padding: 16, paddingBottom: 80 }}>
        <Text style={{ color: theme.color12.val, fontWeight: '700', fontSize: 20, marginBottom: 8 }}>{news.title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          <Text style={{ color: accent, fontSize: 13 }}>{news.source}</Text>
          <Text style={{ color: accentMuted, fontSize: 13 }}>·</Text>
          <Text style={{ color: accent, fontSize: 13 }}>{news.date}</Text>
          <Text style={{ color: accentMuted, fontSize: 13 }}>·</Text>
          <Text style={{ color: accent, fontSize: 13 }}>{news.readingTime}</Text>
        </View>
        {news.image && (
          <View style={{ width: '100%', aspectRatio: 16 / 9, borderRadius: 10, overflow: 'hidden', marginBottom: 16, backgroundColor: theme.color2.val }}>
            <Avatar seed={news.image} size={1} />
          </View>
        )}
        <Text style={{ color: theme.color12.val, fontSize: 16, lineHeight: 24 }}>{news.body}</Text>
      </View>
    </ScrollView>
  )

  const renderCommerceContent = (item: any) => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={{ paddingBottom: 80 }}>
        <View style={{ width: '100%', aspectRatio: 1, backgroundColor: theme.color2.val }}>
          <Avatar seed={item.image || item.id} size={1} />
        </View>
        <View style={{ padding: 16 }}>
          <Text style={{ color: theme.color12.val, fontWeight: '700', fontSize: 20, marginBottom: 4 }}>{item.title}</Text>
          <Text style={{ color: accent, fontWeight: '700', fontSize: 18, marginBottom: 12 }}>{item.price}</Text>
          <Text style={{ color: theme.color12.val, fontSize: 15, lineHeight: 22, marginBottom: 16 }}>{item.description}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Avatar seed={item.person} size={20} />
            <Text style={{ color: accent, fontSize: 14 }}>@{item.person}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )

  const renderMessagesContent = (conversationPartner: any) => {
    const messages = MOCK_MESSAGES[conversationPartner.username || conversationPartner] || []
    return (
      <View style={{ flex: 1 }}>
        <ScrollView ref={messageListRef} style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={{ padding: 16, paddingBottom: 80 }}>
            {messages.map((msg: any) => (
              <View key={msg.id} style={{ marginBottom: 8, alignItems: msg.isOutgoing ? 'flex-end' : 'flex-start' }}>
                <View style={{
                  maxWidth: '75%',
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  backgroundColor: msg.isOutgoing ? '#50A8B7' : theme.color2.val as string,
                  borderTopLeftRadius: msg.isOutgoing ? 18 : 18,
                  borderTopRightRadius: msg.isOutgoing ? 18 : 18,
                  borderBottomLeftRadius: msg.isOutgoing ? 18 : 4,
                  borderBottomRightRadius: msg.isOutgoing ? 4 : 18,
                }}>
                  <Text style={{ color: msg.isOutgoing ? '#0D0B0F' : theme.color12.val as string, fontSize: 15, lineHeight: 21 }}>{msg.text}</Text>
                </View>
                <Text style={{ color: accentMuted, fontSize: 11, marginTop: 2, textAlign: msg.isOutgoing ? 'right' : 'left' }}>{msg.time}</Text>
              </View>
            ))}
            {messages.length > 0 && messages[messages.length - 1].isOutgoing && messages[messages.length - 1].status && (
              <View style={{ alignSelf: 'flex-end', marginBottom: 8, marginTop: 4, borderWidth: 1, borderColor: accent, borderStyle: 'dashed', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 }}>
                <Text style={{ color: accent, fontSize: 11 }}>
                  {messages[messages.length - 1].status === 'read' ? 'Read' : messages[messages.length - 1].status === 'delivered' ? 'Delivered' : 'Sent'}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    )
  }

  const renderLocationsContent = (location: any) => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={{ padding: 16, paddingBottom: 80 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Icon name="location" size={24} color={accent} />
          <Text style={{ color: theme.color12.val, fontWeight: '700', fontSize: 20 }}>{location.name || location.title}</Text>
        </View>
        {location.address && (
          <Text style={{ color: accent, fontSize: 14, marginBottom: 12 }}>{location.address}</Text>
        )}
        {location.description && (
          <Text style={{ color: theme.color12.val, fontSize: 15, lineHeight: 22 }}>{location.description}</Text>
        )}
      </View>
    </ScrollView>
  )

  const renderNotificationsContent = (notification: any) => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={{ padding: 16, paddingBottom: 80 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Avatar seed={notification.fromUser} size={40} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: accent, fontWeight: '600', fontSize: 15 }}>@{notification.fromUser}</Text>
            <Text style={{ color: theme.color12.val, fontSize: 14 }}>{notification.text}</Text>
          </View>
        </View>
        <Text style={{ color: accentMuted, fontSize: 13 }}>{notification.time}</Text>
      </View>
    </ScrollView>
  )

  const renderDefaultContent = (item: any) => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={{ padding: 16, paddingBottom: 80 }}>
        <Text style={{ color: theme.color12.val, fontSize: 16, lineHeight: 22 }}>
          {item.text || item.description || item.body || 'Detail content'}
        </Text>
      </View>
    </ScrollView>
  )

  const renderContent = () => {
    if (!activeDetail) return null
    const { viewId, item } = activeDetail

    switch (viewId) {
      case 'social':
        return renderSocialContent(item)
      case 'profile':
        return renderProfileContent(item)
      case 'events':
        return renderEventsContent(item)
      case 'news':
        return renderNewsContent(item)
      case 'commerce':
        return renderCommerceContent(item)
      case 'messages':
        return renderMessagesContent(item)
      case 'locations':
        return renderLocationsContent(item)
      case 'notifications':
        return renderNotificationsContent(item)
      default:
        return renderDefaultContent(item)
    }
  }

  const renderActionBar = () => {
    if (!activeDetail) return null
    const { viewId, item } = activeDetail

    switch (viewId) {
      case 'social':
      case 'profile':
        return (
          <View style={[styles.actionBarInner, { backgroundColor: theme.background.val, paddingBottom: insets.bottom + 8 }]}>
            <View style={[styles.commentInputWrap, { backgroundColor: theme.color2.val, borderColor: accentMuted }]}>
              <TextInput
                style={[styles.commentInput, { color: theme.color12.val }]}
                placeholder="Add a comment..."
                placeholderTextColor={accentMuted}
                value={commentText}
                onChangeText={setCommentText}
              />
              <TouchableOpacity onPress={() => setCommentText('')}>
                <Icon name="send" size={20} color={commentText.trim() ? accent : accentMuted} />
              </TouchableOpacity>
            </View>
          </View>
        )
      case 'commerce':
        if (item.status) {
          return (
            <View style={[styles.actionBarInner, { backgroundColor: theme.background.val, paddingBottom: insets.bottom + 8 }]}>
              <AccentButton onPress={() => {}} title="Track Order" />
            </View>
          )
        }
        return (
          <View style={[styles.actionBarInner, { backgroundColor: theme.background.val, paddingBottom: insets.bottom + 8 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: accentMuted, borderRadius: 8, paddingHorizontal: 8 }}>
                <TouchableOpacity onPress={() => setQty(Math.max(1, qty - 1))}>
                  <Icon name="minus" size={16} color={accent} />
                </TouchableOpacity>
                <Text style={{ color: theme.color12.val, fontWeight: '700', fontSize: 16, minWidth: 24, textAlign: 'center' }}>{qty}</Text>
                <TouchableOpacity onPress={() => setQty(qty + 1)}>
                  <Icon name="plus" size={16} color={accent} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <AccentButton onPress={() => setOrderPlaced(true)} title={orderPlaced ? 'Added!' : 'Add to Cart'} />
            </View>
          </View>
        )
      case 'events':
        return (
          <View style={[styles.actionBarInner, { backgroundColor: theme.background.val, paddingBottom: insets.bottom + 8 }]}>
            <AccentButton onPress={() => {}} title="Get Tickets" style={{ marginHorizontal: 0 }} />
          </View>
        )
      case 'locations':
        return (
          <View style={[styles.actionBarInner, { backgroundColor: theme.background.val, paddingBottom: insets.bottom + 8 }]}>
            <AccentButton onPress={() => {}} title="Get Directions" style={{ marginHorizontal: 0 }} />
          </View>
        )
      case 'messages':
        return (
          <View style={[styles.actionBarInner, { backgroundColor: theme.background.val, paddingBottom: insets.bottom + 8 }]}>
            <View style={[styles.commentInputWrap, { backgroundColor: theme.color2.val, borderColor: accentMuted }]}>
              <TextInput
                style={[styles.commentInput, { color: theme.color12.val }]}
                placeholder="Message..."
                placeholderTextColor={accentMuted}
                value={messageText}
                onChangeText={setMessageText}
              />
              <TouchableOpacity onPress={() => setMessageText('')}>
                <Icon name="send" size={20} color={messageText.trim() ? accent : accentMuted} />
              </TouchableOpacity>
            </View>
          </View>
        )
      default:
        return null
    }
  }

  if (!activeDetail) return null

  const { viewId } = activeDetail
  const actionBar = renderActionBar()

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: slideX }], backgroundColor: theme.background.val }]}>
      <View style={{ paddingTop: insets.top, backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: insets.top + 44 }}>
        <TouchableOpacity onPress={handleClose} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color={accent} strokeWidth={1.875} />
        </TouchableOpacity>
        <Text style={{ color: theme.color12.val, fontWeight: '700', fontSize: 17, marginLeft: 8 }}>
          {viewId === 'social' ? 'Post' : viewId === 'profile' ? activeDetail.item.displayName || activeDetail.item.username : viewId === 'messages' ? `@${activeDetail.item.username || activeDetail.item}` : viewId === 'events' ? 'Event' : viewId === 'news' ? 'Article' : viewId === 'commerce' ? 'Product' : viewId === 'locations' ? 'Location' : viewId === 'notifications' ? 'Notification' : viewId.charAt(0).toUpperCase() + viewId.slice(1)}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        {renderContent()}
      </View>

      {actionBar && (
        <Animated.View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000, opacity: actionOpacity }}>
          {actionBar}
        </Animated.View>
      )}

      {repostModalVisible && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000, justifyContent: 'flex-end' }} pointerEvents="box-none">
          <TouchableWithoutFeedback onPress={() => setRepostModalVisible(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
          <View style={{ backgroundColor: theme.color1.val, borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20, paddingBottom: insets.bottom + 20 }}>
            <TouchableOpacity onPress={handleQuotePost} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 }}>
              <Icon name="quote-message" size={22} color={accent} />
              <Text style={{ color: theme.color12.val, fontWeight: '600', fontSize: 16 }}>Quote</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRepostOnly} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 }}>
              <Icon name="repeat" size={22} color={accent} />
              <Text style={{ color: theme.color12.val, fontWeight: '600', fontSize: 16 }}>Repost Only</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Animated.View>
  )
})

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 200,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flex: 1,
  },
  commentInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
  },
  commentInput: {
    flex: 1,
    height: 40,
    fontSize: 15,
  },
  actionBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'transparent',
  },
})

export default DetailView
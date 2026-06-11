import { ViewId, PostMedia, AccentColorDef, MessageData } from './types'

export const TOP_BAR_HEIGHT = 44
export const PILL_HEIGHT = 36
export const PILL_MARGIN_BOTTOM = 0
export const SCROLL_THRESHOLD = 80

export const DEFAULT_RECENT_VIEWS: ViewId[] = [
  'social',
  'events',
  'news',
  'notifications',
]

export const ACCENT_COLORS: AccentColorDef[] = [
  { name: 'White', hex: '#FFF5ED', gradient: ['#FFF5ED', '#FFF0E0'] },
  { name: 'Gray', hex: '#8B8580', gradient: ['#8B8580', '#6B6560'] },
  { name: 'Dark Gray', hex: '#3D3D3D', gradient: ['#3D3D3D', '#1C1917'] },
  { name: 'Emerald', hex: '#10B981', gradient: ['#10B981', '#059669'] },
  { name: 'Royal Purple', hex: '#8B5CF6', gradient: ['#8B5CF6', '#7C3AED'] },
  { name: 'Deep Red', hex: '#DC2626', gradient: ['#DC2626', '#B91C1C'] },
  { name: 'Teal', hex: '#14B8A6', gradient: ['#14B8A6', '#0D9488'] },
  { name: 'Cerulean', hex: '#0891B2', gradient: ['#0891B2', '#0E7490'] },
  { name: 'Goldenrod', hex: '#D97706', gradient: ['#D97706', '#B45309'] },
  { name: 'Burnt Orange', hex: '#EA580C', gradient: ['#EA580C', '#C2410C'] },
]

export const VIEW_DEFINITIONS: Record<ViewId, { label: string }> = {
  social: { label: 'social' },
  events: { label: 'events' },
  news: { label: 'news' },
  commerce: { label: 'commerce' },
  vaults: { label: 'vaults' },
  messages: { label: 'messages' },
  notifications: { label: 'notifications' },
  locations: { label: 'locations' },
  liked: { label: 'liked' },
  reservations: { label: 'reservations' },
  bookmarks: { label: 'bookmarks' },
  drafts: { label: 'drafts' },
  orders: { label: 'orders' },
  language: { label: 'language' },
  accessibility: { label: 'accessibility' },
  help: { label: 'help' },
  about: { label: 'about' },
  profile: { label: 'profile' },
}

export const SUB_VIEW_IDS: ViewId[] = [
  'liked',
  'reservations',
  'bookmarks',
  'drafts',
  'orders',
  'language',
  'accessibility',
  'help',
  'about',
  'vaults',
]

export const MAIN_VIEW_IDS: ViewId[] = [
  'social',
  'locations',
  'events',
  'news',
  'commerce',
  'messages',
]

export const ALL_VIEW_IDS: ViewId[] = [
  ...MAIN_VIEW_IDS,
  ...SUB_VIEW_IDS,
]

export const MOCK_VAULTS = [
  { id: 'v1', name: 'Downtown Hub', type: 'community', fileCount: 24 },
  { id: 'v2', name: 'Maker Space', type: 'workspace', fileCount: 12 },
  { id: 'v3', name: 'Midtown Arts', type: 'community', fileCount: 38 },
  { id: 'v4', name: 'Eastside Runners', type: 'club', fileCount: 8 },
  { id: 'v5', name: 'Green Initiative', type: 'organization', fileCount: 16 },
]

export const MOCK_POSTS = [
  {
    id: 'p1',
    author: 'alex_c',
    text: 'Just wrapped up the community garden cleanup. Incredible turnout — over 40 volunteers showed up this morning. The beds are ready for spring planting! 🌱',
    time: '2m ago',
    likes: 23,
    comments: 4,
    reposts: 2,
    media: [
      { type: 'image', uri: 'https://picsum.photos/seed/garden1/600/400' } as PostMedia,
    ],
    vaultId: 'v1',
    replyCount: 0,
  },
  {
    id: 'p2',
    author: 'mayalee',
    text: 'Can someone recommend a good bike shop near downtown? My derailleur needs adjusting and I don\'t trust the chain cleaners at BigBox.',
    time: '15m ago',
    likes: 8,
    comments: 11,
    reposts: 0,
    media: [],
    quotedPost: {
      author: 'djkimo',
      text: 'Quick tip: Spoke & Wheel on 5th Ave does walk-in adjustments on Saturdays. Tell them Kimo sent you.',
      media: [] as PostMedia[],
    },
    linkUrl: undefined,
    vaultId: 'v1',
    replyCount: 0,
  },
  {
    id: 'p3',
    author: 'djkimo',
    text: 'Friday night lineup at The Basement just dropped 🔥 Three local bands + a DJ set. Doors at 8.',
    time: '1h ago',
    likes: 56,
    comments: 12,
    reposts: 18,
    media: [
      { type: 'image', uri: 'https://picsum.photos/seed/concert2/600/400' } as PostMedia,
    ],
    linkUrl: 'https://example.com/basement-friday',
    vaultId: 'v1',
    replyCount: 0,
  },
  {
    id: 'p4',
    author: 'sarah_oh',
    text: 'New mural going up on Oak Street — artist is half done and it already looks amazing. Supporting public art one wall at a time.',
    time: '2h ago',
    likes: 91,
    comments: 7,
    reposts: 5,
    media: [
      { type: 'image', uri: 'https://picsum.photos/seed/mural3/600/400' } as PostMedia,
      { type: 'image', uri: 'https://picsum.photos/seed/mural4/600/400' } as PostMedia,
    ],
    vaultId: 'v3',
    replyCount: 0,
  },
  {
    id: 'p5',
    author: 'tom_builds',
    text: 'Finished the new workbench for the maker space. All reclaimed lumber from the old warehouse on Elm. Come check it out tomorrow.',
    time: '3h ago',
    likes: 34,
    comments: 6,
    reposts: 1,
    media: [],
    vaultId: 'v2',
    replyCount: 0,
  },
  {
    id: 'p6',
    author: 'jenwren',
    text: 'Farmers market report: the stand at the east entrance has the best heirloom tomatoes I\'ve ever tasted. Get there early — they sell out by 10.',
    time: '4h ago',
    likes: 47,
    comments: 9,
    reposts: 3,
    media: [
      { type: 'image', uri: 'https://picsum.photos/seed/tomato5/600/400' } as PostMedia,
    ],
    vaultId: 'v1',
    replyCount: 0,
  },
  {
    id: 'p7',
    author: 'mayalee',
    text: 'Repost from last week but still relevant — our neighborhood watch meeting is Wednesday at 7pm in the community center.',
    time: '5h ago',
    likes: 19,
    comments: 3,
    reposts: 8,
    media: [],
    quotedPost: {
      author: 'alex_c',
      text: 'Neighborhood watch meeting this Wednesday 7pm. Please come if you can — we need more block captains.',
      media: [] as PostMedia[],
    },
    vaultId: 'v1',
    replyCount: 0,
  },
  {
    id: 'p8',
    author: 'screennam3',
    text: 'Beautiful morning for a run along the river trail. Saw three herons and a turtle. This is why I love this neighborhood.',
    time: '6h ago',
    likes: 62,
    comments: 5,
    reposts: 4,
    media: [
      { type: 'image', uri: 'https://picsum.photos/seed/river8/600/400' } as PostMedia,
    ],
    vaultId: 'v4',
    replyCount: 0,
  },
  {
    id: 'p9',
    author: 'sarah_oh',
    text: 'Pop-up pottery class this Saturday at Midtown Arts. Beginners welcome — all materials provided. Sign up through the link.',
    time: '8h ago',
    likes: 28,
    comments: 2,
    reposts: 6,
    media: [
      { type: 'image', uri: 'https://picsum.photos/seed/pottery9/600/400' } as PostMedia,
    ],
    linkUrl: 'https://example.com/pottery-signup',
    vaultId: 'v3',
    replyCount: 0,
  },
  {
    id: 'p10',
    author: 'tom_builds',
    text: 'Prototyping a new Arduino-based irrigation controller for the community garden. Soil moisture sensor + scheduled valve control. Open source, of course.',
    time: '10h ago',
    likes: 41,
    comments: 15,
    reposts: 7,
    media: [],
    linkUrl: 'https://github.com/example/irrigate',
    vaultId: 'v2',
    replyCount: 0,
  },
]

export const MOCK_PROFILES: Record<string, import('./types').ProfileData> = {
  screennam3: {
    username: 'screennam3',
    displayName: 'Jordan Rivera',
    bio: 'Running trails & river views. Eastside Runners co-organizer.',
    followers: 312,
    following: 189,
    communities: ['Eastside Runners', 'Downtown Hub'],
  },
  alex_c: {
    username: 'alex_c',
    displayName: 'Alex Chen',
    bio: 'Community organizer. Garden enthusiast. Building one bed at a time.',
    followers: 524,
    following: 203,
    communities: ['Downtown Hub', 'Green Initiative'],
  },
  mayalee: {
    username: 'mayalee',
    displayName: 'Maya Lee',
    bio: 'Bike commuter. Neighborhood safety advocate. Always asking for recs.',
    followers: 278,
    following: 145,
    communities: ['Downtown Hub'],
  },
  djkimo: {
    username: 'djkimo',
    displayName: 'Kimo Johnson',
    bio: 'DJ. Show promoter. Your Friday night curator.',
    followers: 1203,
    following: 89,
    communities: ['Downtown Hub', 'Midtown Arts'],
  },
  sarah_oh: {
    username: 'sarah_oh',
    displayName: 'Sarah O\'Hara',
    bio: 'Muralist. Public art fan. Pop-up class instigator.',
    followers: 891,
    following: 167,
    communities: ['Midtown Arts'],
  },
  tom_builds: {
    username: 'tom_builds',
    displayName: 'Tom Walsh',
    bio: 'Maker. Woodworker. Arduino tinkerer. Open source everything.',
    followers: 346,
    following: 112,
    communities: ['Maker Space', 'Downtown Hub'],
  },
  jenwren: {
    username: 'jenwren',
    displayName: 'Jen Wren',
    bio: 'Market explorer. Tomato connoisseur. Morning person.',
    followers: 198,
    following: 234,
    communities: ['Downtown Hub', 'Green Initiative'],
  },
}

export const MOCK_EVENTS = [
  {
    id: 'e1',
    title: 'Community Garden Spring Planting',
    date: 'Jun 15',
    time: '6:00pm',
    venue: 'Downtown Hub Community Garden',
    address: '142 Elm Street, Downtown',
    organizer: 'alex_c',
    description: 'Join us for our annual spring planting day! We\'ll be setting up new raised beds, planting seedlings, and enjoying fresh lemonade. Bring gloves if you have them — we\'ll provide everything else.',
    price: 'Free',
    category: 'community',
    image: 'https://picsum.photos/seed/event-garden/600/400',
  },
  {
    id: 'e2',
    title: 'Friday Night Live at The Basement',
    date: 'Jun 20',
    time: '8:00pm',
    venue: 'The Basement',
    address: '89 5th Avenue, Midtown',
    organizer: 'djkimo',
    description: 'Three local bands + DJ Kimo closing out the night. $5 suggested donation at the door. 21+ after 10pm.',
    price: '$5',
    category: 'music',
    image: 'https://picsum.photos/seed/event-concert/600/400',
  },
  {
    id: 'e3',
    title: 'Pop-Up Pottery Workshop',
    date: 'Jun 22',
    time: '10:00am',
    venue: 'Midtown Arts Center',
    address: '305 Oak Street, Midtown',
    organizer: 'sarah_oh',
    description: 'Beginner-friendly pottery class with all materials provided. You\'ll take home your own hand-thrown bowl. Space is limited to 12 people.',
    price: '$25',
    category: 'arts',
    image: 'https://picsum.photos/seed/event-pottery/600/400',
  },
  {
    id: 'e4',
    title: 'Eastside 5K Fun Run',
    date: 'Jun 28',
    time: '7:30am',
    venue: 'Riverside Trail',
    address: 'Riverside Trailhead, Eastside',
    organizer: 'screennam3',
    description: 'Casual 5K along the river trail. All paces welcome — this is a fun run, not a race! Post-run coffee at the trailhead cafe.',
    price: 'Free',
    category: 'fitness',
    image: 'https://picsum.photos/seed/event-run/600/400',
  },
  {
    id: 'e5',
    title: 'Maker Space Open House',
    date: 'Jul 3',
    time: '2:00pm',
    venue: 'Maker Space',
    address: '78 Industrial Blvd, Westside',
    organizer: 'tom_builds',
    description: 'Tour the space, see demos of ongoing projects, and learn about membership. 3D printing, woodworking, electronics — we have it all.',
    price: 'Free',
    category: 'tech',
    image: 'https://picsum.photos/seed/event-maker/600/400',
  },
]

export const MOCK_NEWS = [
  {
    id: 'n1',
    title: 'City Approves New Protected Bike Lane on 5th Avenue',
    source: 'Downtown Gazette',
    date: 'Jun 8',
    readingTime: '4 min read',
    body: 'The city council voted 7-2 to approve a protected bike lane along 5th Avenue, running from the riverfront to Central Park. Construction is expected to begin in September with completion by spring of next year. The project has been championed by local cycling advocates including the Downtown Hub cycling collective.',
    category: 'transportation',
    image: 'https://picsum.photos/seed/news-bike/600/400',
  },
  {
    id: 'n2',
    title: 'Community Garden Wins City Sustainability Award',
    source: 'Green City Chronicle',
    date: 'Jun 6',
    readingTime: '3 min read',
    body: 'The Downtown Hub Community Garden has been recognized with the city\'s annual sustainability award for its innovative rainwater collection system and volunteer-driven composting program. The garden produced over 2,000 pounds of fresh produce for local food banks last year.',
    category: 'environment',
    image: 'https://picsum.photos/seed/news-garden/600/400',
  },
  {
    id: 'n3',
    title: 'New Mural Program Expands to Eastside',
    source: 'Midtown Arts Review',
    date: 'Jun 4',
    readingTime: '5 min read',
    body: 'Following the success of the Oak Street mural project, the city is expanding its public art initiative to Eastside. Local artist Sarah O\'Hara will lead the first wave of installations, bringing five new murals to vacant walls along River Road.',
    category: 'arts',
    image: 'https://picsum.photos/seed/news-mural/600/400',
  },
  {
    id: 'n4',
    title: 'Pop-Up Market Returns to Founders Park This Weekend',
    source: 'Community Pulse',
    date: 'Jun 3',
    readingTime: '2 min read',
    body: 'The weekend pop-up market at Founders Park is back with 30 vendor stalls featuring local produce, handmade crafts, and artisanal foods. Saturday 8am–1pm. Free entry.',
    category: 'community',
    image: 'https://picsum.photos/seed/news-market/600/400',
  },
  {
    id: 'n5',
    title: 'Maker Space Launches Youth Coding Program',
    source: 'Tech Local',
    date: 'Jun 1',
    readingTime: '3 min read',
    body: 'The Maker Space on Industrial Blvd is launching a free Saturday coding program for teens aged 13–17. The 8-week course covers web development fundamentals and Arduino programming. Registration opens next week.',
    category: 'education',
  },
  {
    id: 'n6',
    title: 'River Trail Extension Gets Green Light',
    source: 'Downtown Gazette',
    date: 'May 29',
    readingTime: '4 min read',
    body: 'Plans to extend the Riverside Trail by 2.3 miles northward have been approved after a two-year community campaign. The extension will connect the existing trailhead to the new Lakeside Park, expected to open next summer.',
    category: 'recreation',
  },
]

export const MOCK_COMMERCE = [
  {
    id: 'c1',
    title: 'Handmade Ceramic Planter',
    image: 'https://picsum.photos/seed/commerce-planter/400/400',
    price: '$28',
    description: 'Wheel-thrown stoneware planter with drainage hole. Approx 5" diameter. Glazed in speckled white.',
    person: 'sarah_oh',
    condition: 'New',
    category: 'home',
    status: 'available',
  },
  {
    id: 'c2',
    title: 'Custom Bike Tune-Up Service',
    image: 'https://picsum.photos/seed/commerce-bike/400/400',
    price: '$45',
    description: 'Full tune-up: derailleur adjustment, brake bleed, wheel true, and chain lube. Turnaround 2 days.',
    person: 'djkimo',
    condition: 'Service',
    category: 'services',
    status: 'available',
  },
  {
    id: 'c3',
    title: 'Locally Roasted Coffee — Dark Blend',
    image: 'https://picsum.photos/seed/commerce-coffee/400/400',
    price: '$14',
    description: '12oz bag of our signature dark roast. Beans sourced from a cooperative in Honduras, roasted fresh weekly right here in the neighborhood.',
    person: 'jenwren',
    condition: 'New',
    category: 'food',
    status: 'available',
  },
  {
    id: 'c4',
    title: 'Reclaimed Wood Shelf Unit',
    image: 'https://picsum.photos/seed/commerce-shelf/400/400',
    price: '$120',
    description: '5-tier shelf unit made from reclaimed warehouse pine. 36" wide × 72" tall. Natural finish, no stain. Pick-up only.',
    person: 'tom_builds',
    condition: 'New',
    category: 'home',
    status: 'available',
  },
  {
    id: 'c5',
    title: 'Vintage Road Bike — 1980s Schwinn',
    image: 'https://picsum.photos/seed/commerce-vintage/400/400',
    price: '$180',
    description: 'Classic steel frame road bike, recently serviced. New cables, bar tape, and tires. 56cm frame. Great for commuting.',
    person: 'mayalee',
    condition: 'Used — Good',
    category: 'sports',
    status: 'available',
  },
  {
    id: 'c6',
    title: 'Arduino Starter Kit',
    image: 'https://picsum.photos/seed/commerce-arduino/400/400',
    price: '$35',
    description: 'Unopened Arduino Uno R3 starter kit with breadboard, LEDs, sensors, and servo motor. Perfect for beginners.',
    person: 'tom_builds',
    condition: 'New',
    category: 'tech',
    status: 'available',
  },
  {
    id: 'c7',
    title: 'Organic Seedling Variety Pack',
    image: 'https://picsum.photos/seed/commerce-seeds/400/400',
    price: '$8',
    description: '6-pack of organic seedlings: cherry tomato, basil, jalapeño, cilantro, lettuce, and kale. Ready for transplant.',
    person: 'alex_c',
    condition: 'New',
    category: 'garden',
    status: 'available',
  },
]

export const MOCK_GROUPS = [
  { id: 'g1', name: 'Downtown Hub', members: 342, lastActive: '2m ago', unread: 5, type: 'community', description: 'The central community space for downtown neighbors.' },
  { id: 'g2', name: 'Maker Space', members: 87, lastActive: '15m ago', unread: 0, type: 'workspace', description: 'Builders, tinkerers, and creators sharing tools and ideas.' },
  { id: 'g3', name: 'Midtown Arts', members: 156, lastActive: '1h ago', unread: 3, type: 'community', description: 'Artists, musicians, and creatives in the Midtown district.' },
  { id: 'g4', name: 'Eastside Runners', members: 64, lastActive: '3h ago', unread: 1, type: 'club', description: 'Running group — all paces welcome. Morning and weekend runs.' },
  { id: 'g5', name: 'Green Initiative', members: 112, lastActive: '6h ago', unread: 0, type: 'organization', description: 'Sustainability projects, cleanups, and community gardening.' },
]

export const MOCK_NOTIFICATIONS = [
  { id: 'nt1', type: 'like' as const, fromUser: 'djkimo', text: 'liked your post about the community garden', time: '5m ago' },
  { id: 'nt2', type: 'comment' as const, fromUser: 'sarah_oh', text: 'commented on your mural photo: "This looks amazing!"', time: '20m ago' },
  { id: 'nt3', type: 'repost' as const, fromUser: 'jenwren', text: 'reposted your farmers market tip', time: '1h ago' },
  { id: 'nt4', type: 'rsvp' as const, fromUser: 'mayalee', text: 'is attending Pop-Up Pottery Workshop', time: '2h ago' },
  { id: 'nt5', type: 'like' as const, fromUser: 'tom_builds', text: 'liked your comment about bike shops', time: '3h ago' },
  { id: 'nt6', type: 'comment' as const, fromUser: 'alex_c', text: 'replied: "Great idea — let\'s coordinate for next Saturday"', time: '4h ago' },
  { id: 'nt7', type: 'rsvp' as const, fromUser: 'djkimo', text: 'is attending Friday Night Live', time: '5h ago' },
  { id: 'nt8', type: 'like' as const, fromUser: 'screennam3', text: 'liked your trail photo', time: '6h ago' },
]

export const MOCK_MESSAGES: Record<string, MessageData[]> = {
  alex_c: [
    { id: 'm1', text: 'Hey! Are you coming to the garden cleanup Saturday?', time: '10:32am', isOutgoing: false, status: 'read' },
    { id: 'm2', text: 'Yes! I\'ll be there with gloves and extra seedlings.', time: '10:34am', isOutgoing: true, status: 'read' },
    { id: 'm3', text: 'Awesome, we need more volunteers for the compost area too.', time: '10:35am', isOutgoing: false, status: 'read' },
    { id: 'm4', text: 'I can help with that. See you at 9!', time: '10:36am', isOutgoing: true, status: 'delivered' },
  ],
  djkimo: [
    { id: 'm5', text: 'Friday\'s lineup is confirmed — you on the list?', time: '2:15pm', isOutgoing: false, status: 'read' },
    { id: 'm6', text: 'Wouldn\'t miss it. Who\'s opening?', time: '2:20pm', isOutgoing: true, status: 'read' },
    { id: 'm7', text: 'The Drifters then Luna Wave then me closing', time: '2:22pm', isOutgoing: false, status: 'read' },
    { id: 'm8', text: 'Love it. Will share the event.', time: '2:25pm', isOutgoing: true, status: 'sent' },
  ],
  sarah_oh: [
    { id: 'm9', text: 'Do you have any clay left from the last order?', time: '4:00pm', isOutgoing: false, status: 'read' },
    { id: 'm10', text: 'I think Tom has a few bags at the maker space.', time: '4:05pm', isOutgoing: true, status: 'read' },
    { id: 'm11', text: 'Perfect, I\'ll swing by tomorrow.', time: '4:06pm', isOutgoing: false, status: 'delivered' },
  ],
}

export const MOCK_LIKED = [
  { id: 'l1', type: 'post' as const, originalId: 'p3', text: 'Friday night lineup at The Basement just dropped 🔥', author: 'djkimo', time: '1h ago' },
  { id: 'l2', type: 'post' as const, originalId: 'p1', text: 'Just wrapped up the community garden cleanup.', author: 'alex_c', time: '2m ago' },
  { id: 'l3', type: 'post' as const, originalId: 'p6', text: 'Farmers market report: best heirloom tomatoes.', author: 'jenwren', time: '4h ago' },
]

export const MOCK_RESERVATIONS = [
  { id: 'r1', title: 'Pop-Up Pottery Workshop', date: 'Jun 22', time: '10:00am', status: 'confirmed' as const },
  { id: 'r2', title: 'Eastside 5K Fun Run', date: 'Jun 28', time: '7:30am', status: 'pending' as const },
]

export const MOCK_BOOKMARKS = [
  { id: 'b1', type: 'post' as const, originalId: 'p3', text: 'Friday night lineup at The Basement', author: 'djkimo', time: '1h ago' },
  { id: 'b2', type: 'event' as const, originalId: 'e2', text: 'Friday Night Live at The Basement', time: 'Jun 20' },
  { id: 'b3', type: 'post' as const, originalId: 'p10', text: 'Arduino-based irrigation controller for the community garden', author: 'tom_builds', time: '10h ago' },
]

export const MOCK_DRAFTS = [
  { id: 'd1', text: 'Thinking about starting a tool library at the maker space. Anyone interested?', time: 'Draft', visibility: 'public' as const },
  { id: 'd2', text: 'Bike-to-work week recap — averaged 4 days out of 5.', time: 'Draft', visibility: 'public' as const },
]

export const MOCK_ORDERS = [
  { id: 'o1', item: 'Handmade Ceramic Planter', price: '$28', status: 'shipped' as const, date: 'Jun 5', seller: 'sarah_oh' },
  { id: 'o2', item: 'Organic Seedling Variety Pack', price: '$8', status: 'delivered' as const, date: 'Jun 2', seller: 'alex_c' },
]

export const MOCK_LANGUAGES = [
  { id: 'lang1', label: 'English', code: 'en', selected: true },
  { id: 'lang2', label: 'Español', code: 'es', selected: false },
  { id: 'lang3', label: 'Français', code: 'fr', selected: false },
  { id: 'lang4', label: 'Deutsch', code: 'de', selected: false },
  { id: 'lang5', label: '日本語', code: 'ja', selected: false },
  { id: 'lang6', label: '中文', code: 'zh', selected: false },
]

export const MOCK_FAQ = [
  { id: 'faq1', question: 'How do I join a community?', answer: 'Tap on any community from the Groups tab and press "Join Group." Your request will be approved by a community admin.' },
  { id: 'faq2', question: 'How do I create a post?', answer: 'Tap the compose button (pen icon) in the top right, or swipe the action drawer up from the bottom nav. You can add media, links, and schedule posts.' },
  { id: 'faq3', question: 'What are vaults?', answer: 'Vaults are community-specific spaces. Each vault has its own feed, members, and events. You can switch vaults from the top bar.' },
  { id: 'faq4', question: 'How do I change my accent color?', answer: 'Open the menu drawer and tap the colored circle icon. Choose from 10 accent colors that personalize your app experience.' },
  { id: 'faq5', question: 'Is my data stored locally?', answer: 'Yes — Interproto is local-first. Your posts, bookmarks, and preferences are stored on your device as markdown files.' },
]
import type { ImageMetadata } from 'astro';
import wesHuff from '../assets/faith/wes-huff.jpg';
import capturingChristianity from '../assets/faith/capturing-christianity.jpg';
import bibleMemoryGoal from '../assets/faith/bible-memory-goal.jpg';
import thumbProdigal from '../assets/faith/thumb-IsfYANKSWPo.jpg';
import thumbGospels from '../assets/faith/thumb-Z_eCCb3uTB4.jpg';
import thumbHistoricalTell from '../assets/faith/thumb-aXPH9SSGFjE.jpg';
import thumbJoni from '../assets/faith/thumb-u9p8ze8zBcg.jpg';
import type { Photo } from './photos';

// Content for /faith-based-communicators/. What GLS did on each video comes
// from Jake (11 October 2026). Channel names and logos are shown with the
// creators' permission. View counts are a snapshot from 11 October 2026.
//
// Note: the Wes Huff channel's subscriber count is context for the work, not
// a GLS result, so it appears only in his channel's description.

export interface FaithVideo {
  id: string;
  title: string;
  views: number;
  /** What GLS did on this video. */
  note?: string;
  /** Small line above the title, e.g. "The Historical Tell · Episode 1". */
  label?: string;
}

export interface Channel {
  name: string;
  logo: ImageMetadata;
  url: string;
  /** One or two sentences on the relationship and the work. */
  about: string;
  /** Optional short quote from the creator, shown with the channel. */
  pullQuote?: { text: string; by: string };
  videos: FaithVideo[];
  /** Shorts, each with a local vertical poster. */
  shorts?: (FaithVideo & { poster: ImageMetadata })[];
  /** Heading over the Shorts in the side layout. Defaults to "Shorts". */
  shortsLabel?: string;
  /** 'wide': text across the top, then scrolling rows of videos and Shorts.
      For channels with more videos than fit beside the text. */
  layout?: 'side' | 'wide';
}

// Shorts posters (vertical, from YouTube), keyed by video id.
const shortPoster = (id: string) => {
  const m = import.meta.glob<{ default: ImageMetadata }>('../assets/faith/shorts/*.jpg', { eager: true })[
    `../assets/faith/shorts/${id}.jpg`
  ];
  if (!m) throw new Error(`faith.ts: no Shorts poster for ${id}`);
  return m.default;
};
const short = (id: string, title: string, views: number) => ({ id, title, views, poster: shortPoster(id) });

export const CHANNELS: Channel[] = [
  {
    name: 'Wes Huff',
    logo: wesHuff,
    url: 'https://www.youtube.com/@WesHuff',
    about: "We work with Wes Huff on his channel, which has more than a million subscribers.",
    videos: [
      {
        id: 'IsfYANKSWPo',
        title: "The Real Prodigal was the FATHER | looking at Jesus's parable",
        views: 705_006,
        note: 'We produced the video: the editing and all the visuals.',
      },
      {
        id: 'Z_eCCb3uTB4',
        title: 'Can the Gospels survive historical scrutiny?',
        views: 367_893,
        note: 'We did much of the scripting, then all the editing, visuals and sound design.',
      },
    ],
    // Cut from the Gospels video (views re-read 29 October 2026).
    shortsLabel: 'Shorts cut from the Gospels video',
    shorts: [
      short('RX849dOkd6Y', 'Odyssey? No. Acts has the better voyage historically', 129_452),
      short('TglYCa9OXQ0', 'How does Alexander the Great stack up?', 107_607),
      short('0hahR7M6pMs', 'Bible evidence changes minds', 78_681),
    ],
  },
  {
    name: 'Capturing Christianity',
    logo: capturingChristianity,
    url: 'https://www.youtube.com/@CapturingChristianity',
    layout: 'wide',
    about:
      "The Historical Tell: a five-part documentary series with historian Luuk van de Weghe, and a long project. We helped extensively with the scripting, created the visuals, and mapped out the themes: how best to communicate each concept, and how to engage critics and critical takes. The five episodes have drawn more than 260,000 views.",
    // Views read 11 October 2026.
    videos: [
      { id: 'dDBt5OftXHw', label: 'The Historical Tell · Episode 1', title: 'Do the Gospels Contain Eyewitness Testimony?', views: 59_006 },
      { id: 'd9CQvucEUqY', label: 'The Historical Tell · Episode 2', title: 'New Strong Evidence that Backs Up The Bible', views: 71_208 },
      { id: 'aXPH9SSGFjE', label: 'The Historical Tell · Episode 3', title: "Hidden Details in the Bible Accidentally Prove It's True", views: 100_770 },
      { id: 'cXipWj0m1fU', label: 'The Historical Tell · Episode 4', title: "The Surprising Truth Behind Luke's Gospel", views: 19_702 },
      { id: 'ei961GX_qpg', label: 'The Historical Tell · Episode 5', title: 'Unveiling The Verifiable Message Of Jesus', views: 11_160 },
      { id: 'b97z-uqZdoQ', title: 'Why The Shroud Of Turin Could Be The Authentic Burial Cloth Of Jesus', views: 235_350 },
    ],
    shorts: [
      short('DZFzQ2-AoSs', 'Stop Doing Apologetics!', 69_102),
      short('9oxCoo8nxH0', 'He Was SHOCKED When He Heard This at Church', 32_123),
      short('oXgLPUOSV08', 'Did the Disciples Make Up the Resurrection?', 11_891),
      short('fK3V0TD0ORs', 'Atheists CANNOT Explain This!', 11_717),
      short('E7bizC-VT-4', 'How He Exorcized His First Demon', 10_381),
      short('svFZBMYniqI', 'GAPS in History a Problem?', 9_255),
      short('Wywk4dWSNDw', 'Kids SHOULD Doubt Their Faith, BUT...', 7_753),
    ],
  },
  {
    name: 'Bible Memory Goal',
    logo: bibleMemoryGoal,
    url: 'https://www.youtube.com/@BibleMemoryGoal',
    about:
      "For about four years we've edited Josh Summers' interviews: more than 50 so far, with guests including Joni Eareckson Tada, David Platt and Tim Wildsmith. We edit each one from scratch and help shape the story, design the thumbnails, and cut short-form clips. Together they've drawn hundreds of thousands of views and helped grow the channel.",
    // From Josh's testimonial in Jake's "Client Testimonials" doc.
    pullQuote: {
      text: "At one point I received a design that wasn't particularly appealing to me, but I A/B tested it and it ended up driving a 10x increase in views for that project.",
      by: 'Josh Summers',
    },
    layout: 'wide',
    // The ten most-viewed interviews (plus Katie Davis Majors, below) in the channel's "Bible Memory Interviews"
    // playlist published since April 2024 (the last 2.5 years), excluding
    // Shorts. Views read 11 October 2026; Amy Hall's is YouTube's rounded 9.4K.
    videos: [
      { id: 'e6i7eNFdVg8', title: 'How He Memorized 1,189 Chapters of the Bible (an outline)', views: 110_363 },
      { id: 'u9p8ze8zBcg', title: 'How Joni Eareckson Tada memorizes Scripture (fast!)', views: 98_061 },
      { id: '_ZLEc0D5RSA', title: 'The ENTIRE New Testament Memorized (7,957 Bible verses!)', views: 79_776 },
      { id: 'whp-QedB178', title: 'Janet Pope on CONSISTENT Bible Memory (even at 70 yrs old)', views: 76_368 },
      // Published January 2024, just outside the window; kept at Jake's request.
      { id: 'HepPhHn0818', title: 'This Mom of 15 kids Memorizes the Bible! (w/ Katie Davis Majors)', views: 59_885 },
      { id: '0cId8ZejA1c', title: 'Best Bible Translation to Memorize or Study? (ft Tim Wildsmith)', views: 33_114 },
      { id: 'Za0oGVxScFE', title: 'Memorize an Outline of John in 10 min or less!', views: 30_106 },
      { id: 'X4nV_l3BC5E', title: 'No More Boring Bible Study (w/ Faith Womack)', views: 22_934 },
      { id: 'O_LFMliVGJA', title: 'She Memorized the Book of Job...in HEBREW?!', views: 11_216 },
      { id: 'mRQay59tQZk', title: "Christians DON'T Know The Bible Anymore...Here's What We Need to Do", views: 9_589 },
      { id: '5N5AfJtKkpE', title: 'How to Build a "Special Memory" as a Christian (w/ Amy Hall)', views: 9_400 },
    ],
    shorts: [
      short('Joo0wpg0oU0', 'How to Memorize Scripture in 10-15 minutes!', 67_387),
      short('YlL8pnII54I', 'This John Piper quote on Bible memory is INSPIRING!', 44_844),
      short('_cMUOtSwyTw', 'Memorizing the Bible is EASY! (said no one ever)', 5_798),
      short('wvO0q3KSFl0', 'How to memorize 1,189 chapters of the Bible', 2_212),
      short('t2FB_pCEiLY', 'the "20-2-24" method that WORKS', 2_054),
      short('cymDw90XgBI', 'STOP studying just 10% of the Bible!', 2_036),
    ],
  },
];

/** Hero mosaic, in display order. */
export const HERO_THUMBS = [
  { src: thumbProdigal, alt: 'Wes Huff video thumbnail: The Real Prodigal was the Father' },
  { src: thumbHistoricalTell, alt: 'The Historical Tell, Episode 3 thumbnail' },
  { src: thumbGospels, alt: 'Wes Huff video thumbnail: Can the Gospels survive historical scrutiny?' },
  { src: thumbJoni, alt: 'Bible Memory Goal thumbnail: Joni Eareckson Tada interview' },
];

export const SERVICES = [
  'Scripting and research',
  'Mapping themes and arguments',
  'Editing from scratch',
  'Visuals and motion graphics',
  'Sound design',
  'Thumbnails',
  'Short-form clips',
];

// ---------------------------------------------------------------------------
// Behind the work. Everything below comes from one project unless noted: Wes
// Huff's "Can the Gospels survive historical scrutiny?" (source files in
// E:\Clients\Luuk). Jake confirmed GLS designed the thumbnail concepts.
// ---------------------------------------------------------------------------
const img = import.meta.glob<{ default: ImageMetadata }>('../assets/faith/**/*.{jpg,png}', { eager: true });
const a = (path: string) => {
  const m = img[`../assets/faith/${path}`];
  if (!m) throw new Error(`faith.ts: missing asset ${path}`);
  return m.default;
};

export const GOSPELS_VIDEO = 'Can the Gospels survive historical scrutiny?';

export const PROCESS = [
  {
    step: 'Research',
    text: 'We build the script from the scholarship itself, here a peer-reviewed study cited on screen.',
    image: a('process/research.jpg'),
    alt: 'First page of a peer-reviewed journal article on name frequencies in the Gospels',
  },
  {
    step: 'Map the themes',
    text: 'We shape the argument into a structure viewers can follow: four tests, one cumulative case.',
    image: a('process/theme-map.png'),
    alt: 'Diagram of the T.R.U.E. framework: Timely, Reliable, Unparalleled, Eyewitness-based',
  },
  {
    step: 'Storyboard',
    text: 'Every visual is sketched first, so the idea is right before any design time is spent.',
    image: a('process/storyboard.png'),
    alt: 'Storyboard sketch: one obscure name expanding into hundreds of testable details',
  },
  {
    step: 'Finished visual',
    text: 'Then we design and animate it in a look built for the film.',
    image: a('process/finished.jpg'),
    alt: 'Finished frame: hundreds of testable details, styled on parchment',
  },
];

export const COMPARISONS = [
  {
    label: 'The eyewitness transmission chain',
    before: a('storyboard/transmission-chain-sketch.png'),
    after: a('storyboard/transmission-chain-final.jpg'),
  },
  {
    label: 'Name frequencies against the historical record',
    before: a('storyboard/name-frequencies-sketch.png'),
    after: a('storyboard/name-frequencies-final.jpg'),
  },
  {
    label: 'An undesigned coincidence: Luke 8:3 and Josephus',
    before: a('storyboard/undesigned-coincidence-sketch.png'),
    after: a('storyboard/undesigned-coincidence-final.jpg'),
  },
  {
    label: 'Mundane verisimilitude',
    before: a('storyboard/mundane-verisimilitude-sketch.png'),
    after: a('storyboard/mundane-verisimilitude-final.jpg'),
  },
];

/** 12 concepts; the first is the one that was published. */
export const THUMBNAIL_CONCEPTS = Array.from({ length: 12 }, (_, i) => ({
  image: a(`thumb-concepts/${String(i + 1).padStart(2, '0')}.jpg`),
  published: i === 0,
}));

/** Style gallery: the Gospels video (row 1) and the Prodigal video (row 2). */
export const GALLERY_ROWS: Photo[][] = [
  [
    { src: a('gallery/gospels-spread-map.jpg'), alt: 'Map: the spread of Christianity, c. AD 30' },
    { src: a('gallery/gospels-luuk.jpg'), alt: 'Interview with New Testament scholar Luuk van de Weghe' },
    { src: a('gallery/gospels-engraving.jpg'), alt: 'Classical engraving of the apostles in an ancient city' },
    { src: a('gallery/gospels-unparalleled.jpg'), alt: 'Title card: The Gospels were timely and reliable, but are they unparalleled?' },
    { src: a('gallery/gospels-chuza.jpg'), alt: 'Title card: Chuza' },
    { src: a('gallery/gospels-true.jpg'), alt: 'Wes Huff with an on-screen summary of the T.R.U.E. framework' },
    { src: a('gallery/gospels-table.jpg'), alt: 'Data table from a journal article, highlighted on parchment' },
    { src: a('gallery/gospels-matched.jpg'), alt: 'Comparison graphic: texts that did and did not match the historical pattern' },
    { src: a('gallery/gospels-intrinsic-worth.jpg'), alt: 'Wes Huff beside the title Intrinsic Worth' },
  ],
  [
    { src: a('gallery/prodigal-etching.jpg'), alt: 'Rembrandt etching of the return of the prodigal son' },
    { src: a('gallery/prodigal-compassion.jpg'), alt: 'Title card: compassion, with the Greek word and its meaning' },
    { src: a('gallery/prodigal-transfiguration.jpg'), alt: 'Painting of the Transfiguration' },
    { src: a('gallery/prodigal-expected.jpg'), alt: 'Line illustration: the expected response versus the father running' },
    { src: a('gallery/prodigal-painterly.jpg'), alt: 'Painterly scene of a figure arriving at a doorway' },
    { src: a('gallery/prodigal-the-father.jpg'), alt: 'Title card: The Father, a life divided' },
    { src: a('gallery/prodigal-candle.jpg'), alt: 'Candlelit painting of a woman searching' },
    { src: a('gallery/prodigal-divine-identity.jpg'), alt: 'Diagram linking themes of divine identity and seeking the lost to Jesus' },
    { src: a('gallery/prodigal-father-figure.jpg'), alt: 'Line illustration of the father with open arms' },
  ],
];


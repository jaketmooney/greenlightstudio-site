import type { ImageMetadata } from 'astro';
import wesHuff from '../assets/faith/wes-huff.jpg';
import capturingChristianity from '../assets/faith/capturing-christianity.jpg';
import bibleMemoryGoal from '../assets/faith/bible-memory-goal.jpg';
import thumbProdigal from '../assets/faith/thumb-IsfYANKSWPo.jpg';
import thumbGospels from '../assets/faith/thumb-Z_eCCb3uTB4.jpg';
import thumbHistoricalTell from '../assets/faith/thumb-aXPH9SSGFjE.jpg';
import thumbJoni from '../assets/faith/thumb-u9p8ze8zBcg.jpg';

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
}

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
        views: 580_283,
        note: 'We produced the video: the editing and all the visuals.',
      },
      {
        id: 'Z_eCCb3uTB4',
        title: 'Can the Gospels survive historical scrutiny?',
        views: 335_600,
        note: 'We did much of the scripting, then all the editing, visuals and sound design.',
      },
    ],
  },
  {
    name: 'Capturing Christianity',
    logo: capturingChristianity,
    url: 'https://www.youtube.com/@CapturingChristianity',
    about:
      'The Historical Tell: a five-part documentary series with historian Luuk van de Weghe. It was a long project; we helped shape it from start to finish.',
    videos: [
      {
        id: 'aXPH9SSGFjE',
        title: "Hidden Details in the Bible Accidentally Prove It's True | The Historical Tell | Episode 3",
        views: 100_768,
        note: 'Episode 3 of 5. We helped extensively with the scripting, created the visuals, and mapped out the themes: how best to communicate each concept and how to engage critics and critical takes.',
      },
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
    videos: [
      { id: 'u9p8ze8zBcg', title: 'How Joni Eareckson Tada memorizes Scripture (fast!)', views: 97_998 },
      { id: 'HepPhHn0818', title: 'This Mom of 15 kids Memorizes the Bible! (w/ Katie Davis Majors)', views: 59_885 },
      { id: 'O_LFMliVGJA', title: 'She Memorized the Book of Job...in HEBREW?!', views: 11_213 },
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

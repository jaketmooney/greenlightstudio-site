import type { ImageMetadata } from 'astro';
import orv8pXcEvXU from '../assets/videos/orv8pXcEvXU.jpg';
import yP4WlnHbyW0 from '../assets/videos/yP4WlnHbyW0.jpg';
import MwYFm8C0o4 from '../assets/videos/MwYFm8C-0o4.jpg';
import jnauXp4RTY from '../assets/videos/2jnauXp4RTY.jpg';
import NWtB6emBoJw from '../assets/videos/NWtB6emBoJw.jpg';

// Client videos shown under the case studies on the homepage, in the site
// owner's order. View counts are a snapshot, not live: they were read from
// YouTube on 10 October 2026 and will only change when edited here.
//
// Titles are the YouTube titles with hashtags removed.

export interface Video {
  id: string;
  title: string;
  client: string;
  views: number;
  /** Shorts only: the vertical thumbnail, saved locally so it can be resized. */
  poster?: ImageMetadata;
}

export const PRODUCED_VIDEOS: Video[] = [
  {
    id: 'SnTS2dSxKzM',
    title: 'Why Workers Mortgage Their Homes Just To Get A Job Here',
    client: 'ForestNet Media',
    views: 241_612,
  },
  {
    id: 'wMI4EIHFSyA',
    title: 'Cleaner Regrind Recycling: Kongskilde AirWash System at Highline Polycarbonate',
    client: 'Kongskilde Industries',
    views: 466,
  },
  {
    id: 'DCeuQ6CaUts',
    title: 'How John Deere Builds 80,000 lb Forestry Machines [Factory Tour]',
    client: 'ForestNet Media',
    views: 74_013,
  },
  {
    id: 'obZEBApZRbc',
    title: 'Automated PET Recycling: TOMRA Optical Sorting System at Novelplast',
    client: 'Kongskilde Industries',
    views: 405,
  },
  {
    id: 'Fdqrz5BNnpc',
    title: 'How To Scan Entire Forests Without Ever Touching Them | John Drew, Forsite',
    client: 'ForestNet Media',
    views: 261,
  },
];

export const SHORTS: Video[] = [
  {
    id: 'orv8pXcEvXU',
    title: 'Steep Slope Logging Is Wild!',
    client: 'ForestNet Media',
    views: 715_501,
    poster: orv8pXcEvXU,
  },
  {
    id: 'yP4WlnHbyW0',
    title: 'Your Product Is on the Floor',
    client: 'Kongskilde Industries',
    views: 472,
    poster: yP4WlnHbyW0,
  },
  {
    id: 'MwYFm8C-0o4',
    title: "We've Been Making Wildfires Worse For 100 Years",
    client: 'ForestNet Media',
    views: 337_803,
    poster: MwYFm8C0o4,
  },
  {
    id: '2jnauXp4RTY',
    title: 'What Happened When They Switched It On?',
    client: 'Kongskilde Industries',
    views: 204,
    poster: jnauXp4RTY,
  },
  {
    id: 'NWtB6emBoJw',
    title: 'The Toughest Machine In The Sawmill',
    client: 'ForestNet Media',
    views: 138_205,
    poster: NWtB6emBoJw,
  },
];

/** Counts below this are left off the cards: a few hundred views reads as weak
    next to six figures, so those videos show their title and client only. */
export const MIN_VIEWS_SHOWN = 10_000;

/** YouTube-style short count, rounded down so it never overstates: 241K, 1.9M. */
export function formatViews(n: number): string {
  if (n >= 1_000_000) return `${Math.floor(n / 100_000) / 10}M views`;
  if (n >= 1_000) return `${Math.floor(n / 1_000)}K views`;
  return `${n} views`;
}

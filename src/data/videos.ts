import type { ImageMetadata } from 'astro';
import orv8pXcEvXU from '../assets/videos/orv8pXcEvXU.jpg';
import yP4WlnHbyW0 from '../assets/videos/yP4WlnHbyW0.jpg';
import MwYFm8C0o4 from '../assets/videos/MwYFm8C-0o4.jpg';
import jnauXp4RTY from '../assets/videos/2jnauXp4RTY.jpg';
import NWtB6emBoJw from '../assets/videos/NWtB6emBoJw.jpg';
// Custom thumbnails Jake supplied, used instead of YouTube's.
import thumbCleanerRegrind from '../assets/videos/thumbs/wMI4EIHFSyA.jpg';
import thumbEchoAsia from '../assets/videos/thumbs/9cRRwpBZTJA.jpg';
import thumbLuxoGearChainsaw from '../assets/videos/thumbs/kdsfts3mblg.jpg';
import pQvQ4EBncJg from '../assets/videos/pQvQ4EBncJg.jpg';
import VVanL_csyI from '../assets/videos/7VVanL_csyI.jpg';
import T4rr44uMBpY from '../assets/videos/T4rr44uMBpY.jpg';
import gX3S3UgMwNo from '../assets/videos/gX3S3UgMwNo.jpg';

// Client videos shown under the case studies on the homepage, in the site
// owner's order. View counts are a snapshot, not live: they were read from
// YouTube on 10 October 2026 and will only change when edited here.
//
// Titles are the YouTube titles with hashtags removed. One VPS HiSpeed video
// has a Thai title on YouTube; it is shown here in English, marked "(in Thai)".

export interface Video {
  id: string;
  title: string;
  /** Optional: a few of Jake's own uploads have no client to name. */
  client?: string;
  views: number;
  /** A local thumbnail: required for Shorts (YouTube's are 4:3), optional
      elsewhere to replace YouTube's own. */
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
    poster: thumbCleanerRegrind,
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
  // Added 11 October 2026 (views read the same day).
  {
    id: 'kdsfts3mblg',
    title: 'LuxoGear ChainSaw Product Video For Amazon',
    client: 'LuxoGear',
    views: 8,
    poster: thumbLuxoGearChainsaw,
  },
  { id: '9cRRwpBZTJA', title: 'An Introduction to ECHO Asia', client: 'ECHO Asia', views: 933, poster: thumbEchoAsia },
  {
    id: 'yWfkjQP0JO8',
    title: 'Meet Digital Wood Carver | Making CNC Routers in the Hoosier State',
    client: 'Digital Wood Carver',
    views: 2_159,
  },
  { id: 'rHz5USDszOs', title: 'DWC1824 Hobbyist CNC Router | MADE IN USA', client: 'Digital Wood Carver', views: 3_491 },
  {
    id: 'CXdH5fqfV2M',
    title: 'Build a Free Website for Beginners, No Code Needed (in Thai)',
    client: 'VPS HiSpeed',
    views: 63_545,
  },
  { id: '443sdalkpfo', title: 'Premium Hosting in Thailand', client: 'VPS HiSpeed', views: 167 },
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
  // Added 11 October 2026; uploaded the day before, so no views yet.
  { id: 'pQvQ4EBncJg', title: 'Sawmill Reel', views: 0, poster: pQvQ4EBncJg },
  { id: '7VVanL_csyI', title: "What It's Like to Stutter", client: 'Shil Shanghavi', views: 0, poster: VVanL_csyI },
  { id: 'T4rr44uMBpY', title: 'Are People Listening?', client: 'Shil Shanghavi', views: 0, poster: T4rr44uMBpY },
  { id: 'gX3S3UgMwNo', title: 'Imposter Syndrome', client: 'Shil Shanghavi', views: 0, poster: gX3S3UgMwNo },
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

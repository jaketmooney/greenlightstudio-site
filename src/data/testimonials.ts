import type { ImageMetadata } from 'astro';
import burl from '../assets/home/testimonials/burl-tichenor.jpg';
import diederik from '../assets/home/testimonials/diederik-de-gee.jpg';
import patrick from '../assets/home/testimonials/patrick-trail.jpg';
import paulina from '../assets/home/testimonials/paulina-lewandowska.jpg';
import mareks from '../assets/home/testimonials/mareks-lomako.jpg';
import anthony from '../assets/home/testimonials/anthony-robinson.webp';
import jennifer from '../assets/home/testimonials/jennifer-alger.jpg';
import stefan from '../assets/home/testimonials/stefan-king.jpg';
import luxogearWork from '../content/case-studies/luxogear-amazon-ad-videos/6012f941.png';
import beth from '../assets/home/testimonials/beth-tichenor.jpg';
import daniel from '../assets/home/testimonials/daniel-senicar.webp';
import josh from '../assets/home/testimonials/josh-summers.jpg';
import luuk from '../assets/home/testimonials/luuk-van-de-weghe.jpg';
import bryan from '../assets/home/testimonials/bryan-alger.jpg';
import sallo from '../assets/home/testimonials/sallo-pollak.webp';
import shil from '../assets/home/testimonials/shil-shanghavi.jpg';

// Homepage testimonials, in order of how directly they speak to the target
// buyer (a marketing lead with too much to do and too small a team). Quotes
// are verbatim excerpts from the full testimonials in Jake's "Client
// Testimonials" doc; "…" marks where a passage was cut. Each stays under 80
// words. Skipped at Jake's request: James Wong, Allsteel, Greg Bacon, Janna
// Hanover, Steve Krupp, Scott Stoodley.

export interface Testimonial {
  name: string;
  /** Company, or the project when no company was given. */
  company: string;
  /** Year the client started working with GLS, where known. */
  since?: number;
  photo: ImageMetadata;
  /** CSS object-position for the photo's crop. */
  focus?: string;
  /** True when the image shows the client's work rather than the person. */
  workImage?: boolean;
  quote: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Burl Tichenor',
    company: 'Digital Wood Carver',
    since: 2020,
    photo: burl,
    focus: '50% 30%',
    quote:
      "Jake took over things I didn't have time for, while giving our website and campaigns a much-needed makeover. Now our social media accounts engage customers, newsletters go out on time, Google and Facebook ads bring in revenue, and the website is more effective in selling to both existing and new customers.",
  },
  {
    name: 'Diederik De Gee',
    company: 'VPS HiSpeed',
    photo: diederik,
    focus: '50% 30%',
    quote:
      'After our previous marketing lead stopped working for us, we had no complete marketing team. There was no one who came up with new marketing ideas. Company growth was limited during that time. … For continuous growth, marketing strategy for short term and long term is mandatory. We found both in Greenlight Studio.',
  },
  {
    name: 'Patrick Trail',
    company: 'ECHO Asia',
    photo: patrick,
    focus: '45% 35%',
    quote:
      "We've done video in the past in house, but results have been mixed at best and overly time-consuming at the very least. Working through GL studios allows us to put our staff resources where they are most needed, while leveraging the equipment and varied experience of an existing studio. … The overall quality of this project was very high and we have had fantastic feedback.",
  },
  {
    name: 'Paulina Lewandowska',
    company: 'Ziegler Group',
    since: 2021,
    photo: paulina,
    focus: '50% 30%',
    quote:
      "They're proactive, quick to respond, and always ready for anything. Unlike other agencies, they're straightforward and avoid unnecessary preparation. I'd recommend them for their versatility and open-mindedness.",
  },
  {
    name: 'Mareks Lomako',
    company: 'IT product showcase video',
    photo: mareks,
    focus: '50% 30%',
    quote:
      'Our primary challenge was a lack of dedicated in-house specialists to own a video project of this scope. Partnering with Green Light Studio allowed us to bypass this internal resource gap and execute the project efficiently. … Being able to provide a high-quality video to visually show off the product has made a substantial impact on our remote customer meetings.',
  },
  {
    name: 'Anthony Robinson',
    company: 'ForestNet Media',
    since: 2025,
    photo: anthony,
    focus: '50% 35%',
    quote:
      'Green Light Studio has been a great partner for Forestnet Media. The team has been incredibly accommodating to our often hectic and unpredictable schedule. In the media world, some months are extremely busy, and others are much quieter, so having a team that can adapt quickly while consistently delivering high-quality content has been very important to us.',
  },
  {
    name: 'Jennifer Alger',
    company: 'Ancestree.io',
    photo: jennifer,
    focus: '50% 15%',
    quote:
      "Jake's deep understanding of the wood industry was key to capturing and executing our vision. We're thrilled with the outcome and highly recommend their team for projects requiring industry insight and expert execution.",
  },
  {
    name: 'Stefan King',
    company: 'Namjai Village',
    photo: stefan,
    focus: '40% 35%',
    quote:
      'We lacked the marketing expertise and capacity to promote our project. As this was the main bottleneck at the time, we were stagnating. … GLS covered all the content and marketing-related gaps. … We were stuck on all these points, and you gave the mix of ideas and execution that moved Namjai Village forward.',
  },
  {
    name: 'David Mertens',
    company: 'LuxoGear',
    // No portrait supplied yet: the card shows LuxoGear's video work instead.
    photo: luxogearWork,
    workImage: true,
    quote:
      'Terrific, the collaboration with Jake immediately clicked; straightforward communication, action-oriented and great execution; quick turnaround, solid team on and behind the scenes. … Our Product Listing now has great video content showcasing the use of the gear and problem it solves for the customer in real-life situation, with improved conversion.',
  },
  {
    name: 'Beth Tichenor',
    company: 'Digital Wood Carver',
    since: 2020,
    photo: beth,
    focus: '50% 30%',
    quote:
      "I found Green Light Studio's staff to be friendly, knowledgeable, and efficient. Working with them is always great. I'd recommend them for their friendly staff who keep you in the loop and work quickly and efficiently.",
  },
  {
    name: 'Daniel Senicar',
    company: 'Bike Tour Asia',
    photo: daniel,
    focus: '35% 40%',
    quote:
      "We weren't taking full advantage of our communication channels. Jake quickly learned our business, worked within our budgets, and started moving us in the direction we wanted to go. Thanks to his creative vision and ability to put it into action, our branding and media finally do justice to the amazing experiences we offer!",
  },
  {
    name: 'Josh Summers',
    company: 'Go West Ventures',
    photo: josh,
    focus: '50% 25%',
    quote:
      "Working with GLS means I don't have to edit projects alone, saving me time and hassle. They surpassed my expectations with a thumbnail that generated over half a million extra views, continuing to perform well even a year later.",
  },
  {
    name: 'Luuk van de Weghe',
    company: 'Managed marketing',
    photo: luuk,
    focus: '50% 25%',
    quote:
      'My experience has been marked by great communication and terrific ideas. Compared to other marketers or agencies, they excel at accomplishing more within a similar budget and consistently provide top-notch ideas. I recommend GLS for their focus on collaboration, communication, creativity, and quality.',
  },
  {
    name: 'Bryan Alger',
    company: 'Alger Coaching',
    photo: bryan,
    focus: '50% 22%',
    quote:
      'At Green Light Studio, the team is kind, helpful, and knowledgeable and genuinely fun to talk with. They consistently deliver great work, earning my trust at a high level. I would, and have recommended them to others.',
  },
  {
    name: 'Sallo Pollak',
    company: 'Philanthropy Connections',
    photo: sallo,
    focus: '60% 20%',
    quote:
      'For more than two years, Jake increased the effectiveness of our communications with sponsors. During COVID-19, he helped get the word out about how people could help. We appreciate his energy, positivity, and team-player attitude.',
  },
  {
    name: 'Shil Shanghavi',
    company: 'Speaker',
    photo: shil,
    focus: '50% 35%',
    quote:
      "I had a vision. Jake and his team took the vision, put creativity and fabulous ideas into it, and they delivered my vision exactly how I wanted it. They're accommodating, they're supportive. They're kind. They're generous, and I'm so happy with the videos that I have.",
  },
];

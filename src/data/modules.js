// Training modules shown on the Learning Hub page.
//
// One video:      video: "LINK"
// Several parts:  videos: [ { title: "Part 1", url: "LINK" }, { title: "Part 2", url: "LINK" } ]
// YouTube (Unlisted), Google Drive ("Anyone with the link"), and Loom links all work.
// Leave links empty and the card shows "Video coming soon".

export const trainingModules = [
  {
    title: "Content Marketing",
    description: "How we plan, create, and distribute content that builds brands.",
    videos: [
      { title: "Part 1", url: "https://www.youtube.com/watch?v=CqLwfDMjjoU" },
      { title: "Part 2", url: "https://youtu.be/vDC2wiWz_Tw" },
    ],
  },
  {
    title: "Creator Partnerships",
    description: "Finding, onboarding, and working long-term with creators.",
    video: "",
  },
  {
    title: "Brand Partnerships",
    description: "How we pitch, close, and manage brand collaborations.",
    video: "",
  },
  {
    title: "Influencer Marketing",
    description: "Running influencer campaigns from brief to reporting.",
    video: "https://youtu.be/tze_uFtDf3w",
  },
  {
    title: "Meme Marketing",
    description: "Using meme pages and internet culture to drive reach.",
    video: "",
  },
  {
    title: "Show Marketing",
    description: "Promoting shows and series across digital platforms.",
    video: "",
  },
  {
    title: "Event Marketing",
    description: "Planning and amplifying events, on-ground and online.",
    video: "",
  },
];

// Returns the playable videos for a module (handles both `video` and `videos`).
export function getVideos(item) {
  const list = item.videos ?? (item.video ? [{ title: item.title, url: item.video }] : []);
  return list.filter((v) => v.url);
}

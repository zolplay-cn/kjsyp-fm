import { cache } from 'react'
import { parse } from 'rss-to-json'

/**
 * TODO: Add your podcast config here
 */
export const podcastConfig: PodcastConfig = {
  /**
   * Step 1. Add your podcast directories here
   * We support links from:
   *   Apple Podcasts, Google Podcasts, Spotify, Stitcher, Overcast,
   *   Pocket Casts Castro, 小宇宙, 哔哩哔哩, YouTube
   */
  directories: [
    'https://open.spotify.com/show/4vpLJCVh64qh4MOgvHwPeE',
    'https://podcasts.apple.com/us/podcast/%E7%A7%91%E6%8A%80%E5%8F%8C%E7%9C%BC%E5%95%A4/id1642252327',
    'https://podcasts.google.com/feed/aHR0cHM6Ly9ranN5cC5mbS9mZWVk',
  ],
  /**
   * Step 2. Add your podcast hosts here
   */
  hosts: [
    {
      name: 'Cali Castle',
      link: 'https://twitter.com/thecalicastle',
    },
    {
      name: 'Rather Jie',
      link: 'https://twitter.com/RatherJie',
    },
  ],
}

export const getPodcast = cache(async () => {
  const feed = await parse(process.env.NEXT_PUBLIC_PODCAST_RSS || '')
  const podcast: Podcast = {
    title: feed.title,
    description: feed.description,
    link: feed.link,
    coverArt: feed.image,
  }

  return podcast
})

export const getPodcastEpisodes = cache(async () => {
  const feed = await parse(process.env.NEXT_PUBLIC_PODCAST_RSS || '')
  const episodes: Episode[] = feed.items.map((item) => ({
    id: item.id.split('/').pop(),
    title: item.title,
    description: item.description,
    link: item.link,
    published: item.published,
    content: item.content,
    duration: item.itunes_duration,
    enclosure: item.enclosures[0],
    coverArt: item.itunes_image?.href,
  }))

  return episodes
})

export const getPodcastEpisode = cache(async (id: string) => {
  const episodes = await getPodcastEpisodes()
  return episodes.find((episode) => episode.id.endsWith(id))
})

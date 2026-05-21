import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'Priyanshu Singh — Writing',
    description:
      'Notes on capital, pipeline, and operating across London, Dubai, and Mumbai. By Priyanshu Singh.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      author: post.data.author,
      categories: post.data.tags,
      link: `/blog/${post.id}`,
    })),
    customData: '<language>en-gb</language>',
  });
}

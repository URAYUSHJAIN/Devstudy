import Parser from 'rss-parser';

export interface BlogPost {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
  creator: string;
  thumbnail?: string;
  categories?: string[];
}

export async function getMediumPosts(): Promise<BlogPost[]> {
  const parser = new Parser();
  try {
    const feed = await parser.parseURL('https://medium.com/feed/@urayushjain');
    return feed.items.map((item) => {
      // Extract first image from content
      const content = item['content:encoded'] || item.content || '';
      const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
      const thumbnail = imgMatch ? imgMatch[1] : undefined;

      return {
        title: item.title || 'Untitled',
        link: item.link || '#',
        pubDate: item.pubDate || '',
        contentSnippet: item.contentSnippet || '',
        creator: item.creator || 'Ayush Jain',
        thumbnail,
        categories: item.categories,
      };
    });
  } catch (error) {
    console.error('Error fetching Medium posts:', error);
    return [];
  }
}

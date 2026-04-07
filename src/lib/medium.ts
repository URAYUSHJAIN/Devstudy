import Parser from 'rss-parser';

type MediumItem = Parser.Item & {
  'content:encoded'?: string;
};

export interface BlogPost {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
  creator: string;
  thumbnail?: string;
  categories?: string[];
}

function toAbsoluteUrl(value?: string): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  if (trimmed.startsWith('/')) {
    return `https://medium.com${trimmed}`;
  }

  return null;
}

function resolveMediumLink(item: Parser.Item): string | null {
  const mediumItem = item as MediumItem;
  const content = mediumItem['content:encoded'] || item.content || '';
  const canonicalMatch = content.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  const hrefMatch = content.match(/<a[^>]+href=["']([^"']+)["'][^>]*>/i);

  const candidates = [
    item.link,
    item.guid,
    canonicalMatch?.[1],
    hrefMatch?.[1],
  ];

  for (const candidate of candidates) {
    const absolute = toAbsoluteUrl(candidate);
    if (absolute && absolute.includes('medium.com')) {
      return absolute;
    }
  }

  return null;
}

export async function getMediumPosts(): Promise<BlogPost[]> {
  const parser = new Parser();
  try {
    const feed = await parser.parseURL('https://medium.com/feed/@urayushjain');
    return feed.items.flatMap((item) => {
      const mediumItem = item as MediumItem;
      // Extract first image from content
      const content = mediumItem['content:encoded'] || item.content || '';
      const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
      const thumbnail = imgMatch ? imgMatch[1] : undefined;
      const link = resolveMediumLink(item);

      if (!link) {
        return [];
      }

      return [{
        title: item.title || 'Untitled',
        link,
        pubDate: item.pubDate || '',
        contentSnippet: item.contentSnippet || '',
        creator: item.creator || 'Ayush Jain',
        thumbnail,
        categories: item.categories,
      }];
    });
  } catch (error) {
    console.error('Error fetching Medium posts:', error);
    return [];
  }
}

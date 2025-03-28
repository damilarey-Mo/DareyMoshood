import { json } from '@remix-run/cloudflare';
import { Outlet, useLoaderData } from '@remix-run/react';

import { Post, postMarkdown } from '~/layouts/post';
import { baseMeta } from '~/utils/meta';
import config from '~/config.json';
import { formatTimecode, readingTime } from '~/utils/timecode';

export async function loader({ request }) {
  const slug = request.url.split('/').at(-1);

  const readTime = readingTime(text.default);
  const ogImage = `${config.url}/static/${slug}-og.jpg`;

  return json({
    ogImage,
    frontmatter: module.frontmatter,
    timecode: formatTimecode(readTime),
  });
}

export function meta({ data }) {
  const { title, abstract } = data.frontmatter;
  return baseMeta({ title, description: abstract, prefix: '', ogImage: data.ogImage });
}


import { NextRequest } from 'next/server';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');
    const prop = searchParams.get('prop');
    const blockId = searchParams.get('blockId');

    if (!pageId && !blockId) {
        return new Response('Missing ID', { status: 400 });
    }

    try {
        let imageUrl: string | undefined;

        if (blockId) {
            // Fetch fresh URL for a specific block
            const block = await notion.blocks.retrieve({ block_id: blockId }) as any;
            if (block.type === 'image') {
                imageUrl = block.image.type === 'external' ? block.image.external.url : block.image.file.url;
            } else if (block.type === 'video') {
                imageUrl = block.video.type === 'external' ? block.video.external.url : block.video.file.url;
            } else if (block.type === 'file') {
                imageUrl = block.file.type === 'external' ? block.file.external.url : block.file.file.url;
            }
        } else if (pageId && prop) {
            // Fetch fresh URL for a page property
            const page = await notion.pages.retrieve({ page_id: pageId }) as any;
            const property = page.properties[prop];

            if (property?.type === 'files') {
                const file = property.files[0];
                if (file) {
                    imageUrl = file.type === 'external' ? file.external.url : file.file.url;
                }
            } else if (prop === 'Cover' && page.cover) {
                imageUrl = page.cover.type === 'external' ? page.cover.external.url : page.cover.file.url;
            }
        }

        if (!imageUrl) {
            return new Response('Image not found', { status: 404 });
        }

        // Fetch the actual image data
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error('Failed to fetch from Notion S3');

        const blob = await response.blob();
        const headers = new Headers();
        headers.set('Content-Type', response.headers.get('Content-Type') || 'image/jpeg');
        // Cache for 1 month
        headers.set('Cache-Control', 'public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=86400');

        return new Response(blob, { headers });
    } catch (error) {
        console.error('Image proxy error:', error);
        return new Response('Error proxying image', { status: 500 });
    }
}

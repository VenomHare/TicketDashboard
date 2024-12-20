import { NextApiRequest, NextApiResponse } from 'next';
import ogs from 'open-graph-scraper';
import { OpenGraphScraperOptions } from 'open-graph-scraper/types';

export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const { url } = req.query;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }
    const uri = Array.isArray(url) ? url[0] : url
    try {
        const options : OpenGraphScraperOptions = { url: uri };
        const { result } = await ogs(options);
        res.status(200).json(result);
    } catch  {
        res.status(500).json({ error: 'Failed to fetch Open Graph data' });
    }
}
export type OpenGraphData = {
    ogTitle?: string; // The title of the page
    ogDescription?: string; // The description of the page
    ogImage?: {
        url: string; // The URL of the image
        width?: string | number; // Optional width of the image
        height?: string | number; // Optional height of the image
        type?: string; // Optional MIME type (e.g., "image/jpeg")
    };
    ogUrl?: string; // The URL of the page
    ogType?: string; // Type of Open Graph object (e.g., "website", "article")
    [key: string]: any; // To account for any additional Open Graph metadata
};

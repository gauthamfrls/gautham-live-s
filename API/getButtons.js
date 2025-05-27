import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    const buttons = await kv.get('customButtons');
    res.status(200).json(buttons || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch buttons' });
  }
}

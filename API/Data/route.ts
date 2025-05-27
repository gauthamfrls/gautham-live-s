import { kv } from '@vercel/kv'

export async function GET() {
  const data = await kv.get('data-blob')
  return new Response(JSON.stringify(data || {}), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

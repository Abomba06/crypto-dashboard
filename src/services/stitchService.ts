const STITCH_BASE_URL = import.meta.env.VITE_STITCH_URL ?? '';
const STITCH_API_KEY = import.meta.env.VITE_STITCH_API_KEY ?? '';

export async function loadStitchScreen(screenKey: string): Promise<unknown> {
  if (!STITCH_BASE_URL) {
    throw new Error('Missing VITE_STITCH_URL environment variable');
  }
  if (!STITCH_API_KEY) {
    throw new Error('Missing VITE_STITCH_API_KEY environment variable');
  }

  const response = await fetch(STITCH_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': STITCH_API_KEY,
    },
    body: JSON.stringify({ screenKey }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Stitch API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
}

export async function onRequestPost({ request }) {
  try {
    const data = await request.json();

    // Basic validation
    if (!data.name || !data.secret) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Build the notification message
    const title = `🔮 Secret from ${data.name}`;
    const body = [
      `Name: ${data.name}`,
      `Mood: ${data.mood || '—'}`,
      `Time: ${data.time || new Date().toISOString()}`,
      '',
      `Secret: ${data.secret}`
    ].join('\n');

    // Send to ntfy.sh
    const ntfyRes = await fetch('https://ntfy.sh/secret-quiz-a7f3b9c2d1e4f5', {
      method: 'POST',
      headers: {
        'Title': title,
        'Priority': 'high',
        'Tags': 'crystal_ball'
      },
      body: body
    });

    if (!ntfyRes.ok) {
      const text = await ntfyRes.text();
      return new Response(JSON.stringify({ error: 'ntfy failed', detail: text }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
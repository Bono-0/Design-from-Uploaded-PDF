const allowedTypes = new Set(['Portrait', 'Lifestyle', 'Event', 'Editorial', 'Brand', 'Other'])

function clean(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] || character)
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  let body: any
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}
  } catch {
    return res.status(400).json({ error: 'Invalid request.' })
  }
  const name = clean(body.name, 120)
  const email = clean(body.email, 254)
  const phone = clean(body.phone, 40)
  const type = clean(body.type, 40)
  const date = clean(body.date, 80)
  const location = clean(body.location, 160)
  const message = clean(body.message, 3000)

  if (!name || !/^\S+@\S+\.\S+$/.test(email) || !allowedTypes.has(type)) {
    return res.status(400).json({ error: 'Please complete the required fields.' })
  }
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL || !process.env.CONTACT_TO_EMAIL) {
    return res.status(503).json({ error: 'Email service is not configured.' })
  }

  const details = [
    ['Name', name], ['Email', email], ['Phone', phone || 'Not provided'],
    ['Type of shoot', type], ['Preferred date', date || 'Not provided'],
    ['Location', location || 'Not provided'], ['Message', message || 'Not provided'],
  ]
    .map(([label, value]) => `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>`)
    .join('')

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL,
      to: [process.env.CONTACT_TO_EMAIL],
      reply_to: email,
      subject: `New ${type.toLowerCase()} enquiry from ${name}`,
      html: `<h2>New Still Essence enquiry</h2>${details}`,
    }),
  })

  if (!response.ok) return res.status(502).json({ error: 'Email service failed.' })
  return res.status(200).json({ ok: true })
}

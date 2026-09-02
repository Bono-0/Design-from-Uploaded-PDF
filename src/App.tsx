import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Image constants ──────────────────────────────────────────────────────────
const IMG = {
  hero:      'https://images.unsplash.com/photo-1541519481457-763224276691?w=1920&h=1080&fit=crop&auto=format&q=80',
  portrait1: 'https://images.unsplash.com/photo-1620122303020-87ec826cf70d?w=800&h=1100&fit=crop&auto=format&q=80',
  portrait2: 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=800&h=1000&fit=crop&auto=format&q=80',
  portrait3: 'https://images.unsplash.com/photo-1518611540400-6b85a0704342?w=700&h=950&fit=crop&auto=format&q=80',
  portrait4: 'https://images.unsplash.com/photo-1578741837908-b9cfb8a0c60c?w=700&h=900&fit=crop&auto=format&q=80',
  portrait5: 'https://images.unsplash.com/photo-1533392151650-269f96231f65?w=800&h=1100&fit=crop&auto=format&q=80',
  couple1:   'https://images.unsplash.com/photo-1783816297320-f0f33b6833e6?w=1000&h=700&fit=crop&auto=format&q=80',
  couple2:   'https://images.unsplash.com/photo-1769566025603-2e694fb2ff68?w=900&h=700&fit=crop&auto=format&q=80',
  couple3:   'https://images.unsplash.com/photo-1781387068277-67c99af7efec?w=900&h=600&fit=crop&auto=format&q=80',
  event1:    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1000&h=700&fit=crop&auto=format&q=80',
  event2:    'https://images.unsplash.com/photo-1523521803700-b3bcaeab0150?w=900&h=600&fit=crop&auto=format&q=80',
  event3:    'https://images.unsplash.com/photo-1699730185428-d11054059c7f?w=900&h=700&fit=crop&auto=format&q=80',
  city:      'https://images.unsplash.com/photo-1579772238266-8abd7531fea2?w=1920&h=700&fit=crop&auto=format&q=80',
  editorial: 'https://images.unsplash.com/photo-1508186225823-0963cf9ab0de?w=800&h=1000&fit=crop&auto=format&q=80',
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="9" fill="#0D1B2A"/>
      <path
        d="M20 5 L21.8 16.2 L33 18 L21.8 19.8 L20 31 L18.2 19.8 L7 18 L18.2 16.2 Z"
        fill="white"
      />
      <circle cx="27" cy="11" r="3" fill="#C72A09"/>
      <path
        d="M10 27 L10.7 30.3 L14 31 L10.7 31.7 L10 35 L9.3 31.7 L6 31 L9.3 30.3 Z"
        fill="white"
        opacity="0.45"
      />
    </svg>
  )
}

// ─── Grain overlay ────────────────────────────────────────────────────────────
function Grain() {
  return (
    <>
      <svg style={{ position: 'fixed', width: 0, height: 0 }}>
        <defs>
          <filter id="grain-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
            <feColorMatrix type="saturate" values="0"/>
          </filter>
        </defs>
      </svg>
      <div
        className="grain"
        style={{
          backgroundImage: 'url(#grain)',
          filter: 'url(#grain-filter)',
          width: '100%',
          height: '100%',
        }}
      />
    </>
  )
}

// ─── Custom cursor ────────────────────────────────────────────────────────────
function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const [isHoveringImg, setIsHoveringImg] = useState(false)

  useEffect(() => {
    let x = 0, y = 0
    const move = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
      if (dotRef.current) {
        dotRef.current.style.left = x + 'px'
        dotRef.current.style.top = y + 'px'
      }
      if (ringRef.current) {
        ringRef.current.style.left = x + 'px'
        ringRef.current.style.top = y + 'px'
      }
      if (labelRef.current) {
        labelRef.current.style.left = x + 'px'
        labelRef.current.style.top = y + 'px'
      }
      const el = document.elementFromPoint(x, y) as HTMLElement
      const onImg = el?.closest('[data-cursor="view"]')
      setIsHoveringImg(!!onImg)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        style={{ position: 'fixed', pointerEvents: 'none', zIndex: 9999 }}
      >
        <svg width="20" height="24" viewBox="0 0 20 24" fill="none" style={{ transform: 'translate(-2px, -2px)', mixBlendMode: 'difference' }}>
          <path d="M2 2L2 18L6.5 13.5L9.5 21L12 20L9 13H15L2 2Z" fill="white" stroke="black" strokeWidth="1"/>
        </svg>
      </div>
      {!isHoveringImg && <div ref={ringRef} style={{ display: 'none' }} />}
      {isHoveringImg && (
        <div
          ref={labelRef}
          className="cursor cursor-label"
          style={{ position: 'fixed', pointerEvents: 'none', zIndex: 9999, display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          VIEW ↗
        </div>
      )}
    </>
  )
}

// ─── Reveal hook ─────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav({ page, setPage }: { page: string; setPage: (p: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const nav = (p: string) => { setPage(p); setMenuOpen(false); window.scrollTo(0, 0) }

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '0 40px',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled ? 'rgba(13,13,13,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(240,237,232,0.08)' : 'none',
          transition: 'background 0.4s ease, border-color 0.4s ease',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => nav('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'none', border: 'none', cursor: 'none' }}
        >
          <Logo size={34} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', letterSpacing: '0.06em', color: 'var(--fg)' }}>
            STILL ESSENCE
          </span>
        </button>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '36px' }} className="hidden-mobile">
          {['WORK', 'ABOUT', 'SERVICES'].map(p => (
            <button
              key={p}
              onClick={() => nav(p.toLowerCase())}
              className={`nav-link ${page === p.toLowerCase() ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', cursor: 'none' }}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => nav('book')}
            className="btn-red"
            style={{ padding: '10px 22px', fontSize: '11px' }}
          >
            BOOK ↗
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'none', color: 'var(--fg)' }}
          className="show-mobile"
        >
          <div style={{ width: '24px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <span style={{ height: '1px', background: menuOpen ? 'transparent' : 'var(--fg)', transition: '0.2s' }} />
            <span style={{ height: '1px', background: 'var(--fg)' }} />
            <span style={{ height: '1px', background: menuOpen ? 'transparent' : 'var(--fg)', transition: '0.2s' }} />
          </div>
        </button>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: '#0d0d0d',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'flex-start',
          padding: '0 48px',
        }}>
          <button onClick={() => setMenuOpen(false)} style={{ position: 'absolute', top: '24px', right: '40px', background: 'none', border: 'none', cursor: 'none', color: 'var(--fg)', fontSize: '28px' }}>×</button>
          {['WORK', 'ABOUT', 'SERVICES', 'BOOK', 'CONTACT'].map(p => (
            <button
              key={p}
              onClick={() => nav(p.toLowerCase())}
              style={{
                background: 'none', border: 'none', cursor: 'none',
                fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: 'clamp(48px, 10vw, 80px)',
                letterSpacing: '-0.02em',
                color: 'var(--fg)',
                lineHeight: 1,
                marginBottom: '12px',
                opacity: 0.85,
                textAlign: 'left',
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ setPage }: { setPage: (p: string) => void }) {
  const nav = (p: string) => { setPage(p); window.scrollTo(0, 0) }
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '80px 60px 48px', position: 'relative' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '60px', marginBottom: '80px' }} className="footer-grid">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Logo size={32} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', letterSpacing: '0.06em' }}>STILL ESSENCE</span>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', opacity: 0.5, lineHeight: 1.7, maxWidth: '260px' }}>
            Photography that holds a moment.
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', opacity: 0.35, letterSpacing: '0.15em', marginTop: '16px' }}>
            JOHANNESBURG / SOUTH AFRICA
          </p>
        </div>

        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', opacity: 0.35, letterSpacing: '0.2em', marginBottom: '24px' }}>NAVIGATION</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {['WORK', 'ABOUT', 'SERVICES', 'BOOK', 'CONTACT'].map(p => (
              <button key={p} onClick={() => nav(p.toLowerCase())}
                className="editorial-link"
                style={{ background: 'none', border: 'none', cursor: 'none', textAlign: 'left', display: 'inline-flex', width: 'fit-content' }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', opacity: 0.35, letterSpacing: '0.2em', marginBottom: '24px' }}>CONTACT</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <a href="mailto:StillEssence.jhb@gmail.com" className="editorial-link" style={{ opacity: 0.7, fontSize: '13px' }}>
              StillEssence.jhb@gmail.com
            </a>
            <a href="https://wa.me/27760755270" className="editorial-link" style={{ opacity: 0.7, fontSize: '13px' }}>
              076 075 5270
            </a>
            <a href="https://instagram.com/stillessence.jhb" rel="noreferrer" target="_blank" className="editorial-link" style={{ opacity: 0.7, fontSize: '13px' }}>
              Instagram ↗
            </a>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', opacity: 0.3, letterSpacing: '0.12em' }}>
          © 2026 STILL ESSENCE PHOTOGRAPHY
        </p>
        <div style={{ display: 'flex', gap: '24px' }}>
          {['PRIVACY', 'TERMS'].map(t => (
            <a key={t} href="mailto:StillEssence.jhb@gmail.com" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', opacity: 0.3, letterSpacing: '0.12em', textDecoration: 'none', color: 'var(--fg)' }}>{t}</a>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr !important; gap: 40px !important; } }
      `}</style>
    </footer>
  )
}

// ─── Work card ────────────────────────────────────────────────────────────────
function WorkCard({ index, title, category, location, year, img, tall }: {
  index: string; title: string; category: string; location: string; year: string; img: string; tall?: boolean
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      data-cursor="view"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        aspectRatio: tall ? '3/4' : '4/3',
        background: '#1a1a1a',
        cursor: 'none',
      }}
    >
      <img
        src={img}
        alt={title}
        style={{
          width: '100%', height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)',
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          filter: 'grayscale(30%) contrast(1.05)',
        }}
      />
      {/* Metadata always visible */}
      <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--fg)', opacity: 0.5 }}>{index}</span>
      </div>
      {/* Hover overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(13,13,13,0.9) 0%, transparent 50%)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.4s ease',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--neon)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--neon)' }}>{category}</span>
        </div>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px', letterSpacing: '-0.01em', color: 'var(--fg)', margin: 0 }}>{title}</p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', opacity: 0.4, marginTop: '4px' }}>{location} — {year}</p>
      </div>
    </div>
  )
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function Home({ setPage }: { setPage: (p: string) => void }) {
  const nav = (p: string) => { setPage(p); window.scrollTo(0, 0) }
  const introRef = useReveal()
  const philRef = useReveal()
  const servRef = useReveal()
  const ctaRef = useReveal()

  const workItems = [
    { index: '01', title: 'Quiet Presence', category: 'PORTRAIT', location: 'JHB', year: '2026', img: IMG.portrait1, tall: true },
    { index: '02', title: 'Golden Hour', category: 'LIFESTYLE', location: 'JHB', year: '2026', img: IMG.couple1 },
    { index: '03', title: 'Raw Expression', category: 'EDITORIAL', location: 'JHB', year: '2026', img: IMG.editorial, tall: true },
    { index: '04', title: 'The Celebration', category: 'EVENTS', location: 'JHB', year: '2026', img: IMG.event1 },
    { index: '05', title: 'Shore Light', category: 'LIFESTYLE', location: 'JHB', year: '2026', img: IMG.couple2, tall: true },
    { index: '06', title: 'Still Frame', category: 'PORTRAIT', location: 'JHB', year: '2026', img: IMG.portrait4 },
  ]

  return (
    <div>
      {/* Hero */}
      <section style={{ position: 'relative', height: '100vh', minHeight: '600px', overflow: 'hidden' }}>
        <img src={IMG.hero} alt="Hero editorial portrait" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%) contrast(1.1)', objectPosition: 'center 20%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(13,13,13,0.75) 0%, rgba(13,13,13,0.3) 60%, rgba(13,13,13,0.6) 100%)' }} />

        {/* Vertical side label */}
        <div style={{ position: 'absolute', left: '24px', bottom: '120px', display: 'flex', alignItems: 'center' }}>
          <span className="vertical-label">JOHANNESBURG / SOUTH AFRICA</span>
        </div>

        {/* Hero text */}
        <div style={{ position: 'absolute', bottom: '80px', left: '60px', right: '60px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', opacity: 0.45, marginBottom: '16px' }}>EST. 2024  STILL ESSENCE</p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 'clamp(72px, 14vw, 180px)',
            letterSpacing: '-0.04em',
            lineHeight: 0.85,
            color: 'var(--fg)',
            margin: '0 0 20px 0',
          }}>
            STILL<br />
            <span style={{ color: 'var(--fg)', WebkitTextStroke: '1px rgba(240,237,232,0.4)', WebkitTextFillColor: 'transparent' }}>ESSENCE</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(14px, 2vw, 18px)', opacity: 0.6, maxWidth: '400px', marginBottom: '36px', lineHeight: 1.5 }}>
            Photography that holds a moment.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button onClick={() => nav('work')} className="btn-red">VIEW WORK ↗</button>
            <button onClick={() => nav('book')} className="btn-ghost">BOOK A SESSION ↗</button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '32px', right: '60px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', opacity: 0.3, letterSpacing: '0.15em' }}>SCROLL</span>
          <div style={{ width: '1px', height: '40px', background: 'rgba(240,237,232,0.2)' }} />
        </div>
      </section>

      {/* Introduction */}
      <section ref={introRef} className="reveal" style={{ padding: 'clamp(80px, 12vw, 160px) 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }} className="intro-grid">
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', opacity: 0.35, marginBottom: '32px' }}>001 / STUDIO</p>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 'clamp(52px, 7vw, 88px)',
              letterSpacing: '-0.04em', lineHeight: 0.88,
              margin: 0,
            }}>
              THE MOMENT<br />
              <span style={{ color: 'var(--red)' }}>MATTERS.</span>
            </h2>
          </div>
          <div style={{ paddingTop: '24px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', opacity: 0.65, lineHeight: 1.8, maxWidth: '380px' }}>
              Still Essence is a Johannesburg-based photography studio capturing people, places and moments through portraits, lifestyle, events and creative imagery.
            </p>
            <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {[['250+', 'Sessions'], ['4', 'Specialisms'], ['2024', 'Est.']].map(([n, l]) => (
                  <div key={l}>
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '42px', letterSpacing: '-0.03em', color: 'var(--red)', margin: 0, lineHeight: 1 }}>{n}</p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', opacity: 0.35, letterSpacing: '0.15em', marginTop: '4px' }}>{l.toUpperCase()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style>{`@media (max-width: 768px) { .intro-grid { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* Selected Work */}
      <section style={{ padding: '0 0 120px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 60px', marginBottom: '48px' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', opacity: 0.35, marginBottom: '12px' }}>002 / WORK</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(44px, 6vw, 72px)', letterSpacing: '-0.04em', lineHeight: 0.9, margin: 0, border: 'none' }}>
              SELECTED<br />WORK
            </h2>
          </div>
          <button onClick={() => nav('work')} className="editorial-link" style={{ background: 'none', border: 'none', cursor: 'none' }}>
            VIEW ALL WORK ↗
          </button>
        </div>

        {/* Asymmetric grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 0 }}>
          <div style={{ gridColumn: '1 / 5' }}>
            <WorkCard {...workItems[0]} />
          </div>
          <div style={{ gridColumn: '5 / 9', display: 'flex', flexDirection: 'column' }}>
            <WorkCard {...workItems[1]} tall />
          </div>
          <div style={{ gridColumn: '9 / 13' }}>
            <WorkCard {...workItems[2]} />
          </div>
          <div style={{ gridColumn: '1 / 6', marginTop: '2px' }}>
            <WorkCard {...workItems[3]} />
          </div>
          <div style={{ gridColumn: '6 / 10', marginTop: '2px' }}>
            <WorkCard {...workItems[4]} />
          </div>
          <div style={{ gridColumn: '10 / 13', marginTop: '2px' }}>
            <WorkCard {...workItems[5]} />
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section ref={philRef} className="reveal" style={{ padding: 'clamp(80px, 10vw, 140px) 60px', borderTop: '1px solid var(--border)' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', opacity: 0.35, marginBottom: '48px' }}>003 / PHILOSOPHY</p>
        <div style={{ maxWidth: '1100px' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 'clamp(44px, 8vw, 110px)',
            letterSpacing: '-0.04em', lineHeight: 0.85,
            margin: 0,
          }}>
            PHOTOGRAPHS SHOULD<br />
            NOT JUST SHOW<br />
            <span style={{ color: 'var(--red)' }}>A MOMENT.</span>
          </h2>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 'clamp(44px, 8vw, 110px)',
            letterSpacing: '-0.04em', lineHeight: 0.85,
            margin: '16px 0 0 0',
            WebkitTextStroke: '1px rgba(240,237,232,0.25)',
            WebkitTextFillColor: 'transparent',
          }}>
            THEY SHOULD BRING<br />YOU BACK TO IT.
          </h2>
        </div>
      </section>

      {/* Services Preview */}
      <section ref={servRef} className="reveal" style={{ padding: '0 0 clamp(80px, 10vw, 140px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 60px', marginBottom: '60px' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', opacity: 0.35, marginBottom: '12px' }}>004 / SERVICES</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(44px, 6vw, 72px)', letterSpacing: '-0.04em', lineHeight: 0.9, margin: 0 }}>
              WHAT WE DO
            </h2>
          </div>
          <button onClick={() => nav('services')} className="editorial-link" style={{ background: 'none', border: 'none', cursor: 'none' }}>
            EXPLORE SERVICES ↗
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px' }} className="services-grid">
          {[
            { n: '01', title: 'PORTRAITS', desc: 'Personal, creative and professional portrait photography.', img: IMG.portrait2 },
            { n: '02', title: 'LIFESTYLE', desc: 'Natural imagery built around people, environments and atmosphere.', img: IMG.couple3 },
            { n: '03', title: 'EVENTS', desc: 'Documenting the people, energy and moments that make an event memorable.', img: IMG.event2 },
            { n: '04', title: 'EDITORIAL', desc: 'Photography for brands, artists, musicians, fashion and creative projects.', img: IMG.portrait5 },
          ].map(s => (
            <div key={s.n} style={{ position: 'relative', overflow: 'hidden', cursor: 'none' }} className="service-card">
              <div style={{ aspectRatio: '3/4', background: '#1a1a1a', overflow: 'hidden' }}>
                <img src={s.img} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%) contrast(1.1)', transition: 'transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                />
              </div>
              <div style={{ padding: '24px 24px 32px' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', opacity: 0.35, letterSpacing: '0.15em', marginBottom: '8px' }}>{s.n}</p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '28px', letterSpacing: '-0.01em', margin: '0 0 10px 0' }}>{s.title}</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', opacity: 0.55, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <style>{`@media (max-width: 900px) { .services-grid { grid-template-columns: 1fr 1fr !important; } } @media (max-width: 600px) { .services-grid { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* Final CTA */}
      <section ref={ctaRef} className="reveal" style={{ position: 'relative', overflow: 'hidden', minHeight: '520px' }}>
        <img src={IMG.city} alt="Johannesburg cityscape" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(60%) contrast(1.2)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,13,13,0.78)' }} />
        <div style={{ position: 'relative', padding: 'clamp(80px, 12vw, 140px) 60px', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 'clamp(44px, 8vw, 100px)',
            letterSpacing: '-0.04em', lineHeight: 0.85,
            margin: '0 auto 40px',
            maxWidth: '900px',
          }}>
            LET'S CREATE SOMETHING<br />
            <span style={{ color: 'var(--red)' }}>WORTH REMEMBERING.</span>
          </h2>
          <button onClick={() => nav('book')} className="btn-red" style={{ fontSize: '12px', padding: '18px 40px' }}>
            BOOK A SESSION ↗
          </button>
        </div>
      </section>
    </div>
  )
}

// ─── WORK PAGE ────────────────────────────────────────────────────────────────
function Work() {
  const [filter, setFilter] = useState('ALL')
  const filters = ['ALL', 'PORTRAITS', 'LIFESTYLE', 'EVENTS', 'EDITORIAL']

  const all = [
    { index: '001', title: 'Quiet Presence', category: 'PORTRAITS', location: 'JHB', year: '2026', img: IMG.portrait1, tall: true },
    { index: '002', title: 'Golden Hour', category: 'LIFESTYLE', location: 'JHB', year: '2026', img: IMG.couple1, tall: true },
    { index: '003', title: 'Raw Expression', category: 'EDITORIAL', location: 'JHB', year: '2026', img: IMG.editorial, tall: true },
    { index: '004', title: 'The Celebration', category: 'EVENTS', location: 'JHB', year: '2026', img: IMG.event1, tall: true },
    { index: '005', title: 'Shore Light', category: 'LIFESTYLE', location: 'JHB', year: '2026', img: IMG.couple2, tall: true },
    { index: '006', title: 'Still Frame', category: 'PORTRAITS', location: 'JHB', year: '2026', img: IMG.portrait4, tall: true },
    { index: '007', title: 'Dusk Walk', category: 'LIFESTYLE', location: 'JHB', year: '2026', img: IMG.couple3, tall: true },
    { index: '008', title: 'The Toast', category: 'EVENTS', location: 'JHB', year: '2026', img: IMG.event2, tall: true },
    { index: '009', title: 'Confetti', category: 'EVENTS', location: 'JHB', year: '2026', img: IMG.event3, tall: true },
    { index: '010', title: 'Introspection', category: 'PORTRAITS', location: 'JHB', year: '2026', img: IMG.portrait5, tall: true },
    { index: '011', title: 'Forest Session', category: 'LIFESTYLE', location: 'JHB', year: '2026', img: IMG.portrait3 },
    { index: '012', title: 'Editorial No. 1', category: 'EDITORIAL', location: 'JHB', year: '2026', img: IMG.portrait2 },
  ]

  const visible = filter === 'ALL' ? all : all.filter(i => i.category === filter)

  return (
    <div style={{ paddingTop: '120px' }}>
      <div style={{ padding: '0 60px 60px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', opacity: 0.35, marginBottom: '16px' }}>PORTFOLIO</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(60px, 10vw, 130px)', letterSpacing: '-0.04em', lineHeight: 0.85, margin: '0 0 12px 0' }}>
          SELECTED<br />WORK
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', opacity: 0.4, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          PEOPLE / PLACES / MOMENTS
        </p>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '4px', marginTop: '48px', flexWrap: 'wrap' }}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? 'var(--fg)' : 'transparent',
                color: filter === f ? 'var(--bg)' : 'var(--fg)',
                border: '1px solid rgba(240,237,232,0.2)',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.15em',
                padding: '8px 20px',
                cursor: 'none',
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }} className="work-grid">
        {visible.map(item => (
          <WorkCard key={item.index} {...item} />
        ))}
      </div>
      <style>{`@media (max-width: 900px) { .work-grid { grid-template-columns: 1fr 1fr !important; } } @media (max-width: 600px) { .work-grid { grid-template-columns: 1fr !important; } }`}</style>
      <div style={{ height: '120px' }} />
    </div>
  )
}

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────
function About() {
  const introRef = useReveal()
  const approachRef = useReveal()
  const stmtRef = useReveal()

  return (
    <div style={{ paddingTop: '120px' }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: '70vh', minHeight: '480px', overflow: 'hidden', marginBottom: '120px' }}>
        <img src={IMG.portrait3} alt="Photographer at work" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', filter: 'grayscale(30%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(13,13,13,0.9) 40%, rgba(13,13,13,0.2))' }} />
        <div style={{ position: 'absolute', bottom: '60px', left: '60px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', opacity: 0.35, marginBottom: '16px' }}>JOHANNESBURG / 2026</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(60px, 10vw, 120px)', letterSpacing: '-0.04em', lineHeight: 0.85, margin: 0 }}>
            ABOUT<br /><span style={{ color: 'var(--red)' }}>STILL</span><br />ESSENCE
          </h1>
        </div>
      </div>

      {/* Intro */}
      <div ref={introRef} className="reveal about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', padding: '0 60px 120px', alignItems: 'start' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', opacity: 0.35, marginBottom: '32px' }}>THE STUDIO</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '18px', lineHeight: 1.85, opacity: 0.75 }}>
            Still Essence exists because every person, every event, every moment deserves to be seen exactly as it was. Not posed. Not constructed. Just honest.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, opacity: 0.55, marginTop: '24px' }}>
            Based in Johannesburg, we work with individuals, couples, families, brands and artists — anyone who wants their moment captured with intention and craft. Our approach is rooted in authenticity, atmosphere and connection.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, opacity: 0.55, marginTop: '24px' }}>
            We believe a photograph should do more than document. It should transport you back to exactly how something felt.
          </p>
        </div>
        <div>
          <div style={{ aspectRatio: '4/5', overflow: 'hidden', background: '#1a1a1a' }}>
            <img src={IMG.portrait2} alt="Studio photography" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%)' }} />
          </div>
          <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
            <div style={{ flex: 1, aspectRatio: '1', overflow: 'hidden', background: '#1a1a1a' }}>
              <img src={IMG.couple1} alt="Lifestyle photography" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(30%)' }} />
            </div>
            <div style={{ flex: 1, aspectRatio: '1', overflow: 'hidden', background: '#1a1a1a' }}>
              <img src={IMG.event2} alt="Event photography" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%)' }} />
            </div>
          </div>
        </div>
        <style>{`@media (max-width: 900px) { .about-grid { grid-template-columns: 1fr !important; } }`}</style>
      </div>

      {/* The Approach */}
      <section ref={approachRef} className="reveal" style={{ padding: '80px 60px 120px', borderTop: '1px solid var(--border)' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', opacity: 0.35, marginBottom: '48px' }}>THE APPROACH</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px' }} className="approach-grid">
          {[
            { n: '01', title: 'AUTHENTICITY', desc: 'Real expressions over forced poses. We create an environment where people can be themselves.' },
            { n: '02', title: 'ATMOSPHERE', desc: 'Using light, location and composition to create feeling that transcends the frame.' },
            { n: '03', title: 'INTENTION', desc: 'Every frame should have a reason for existing. We shoot with purpose, not volume.' },
            { n: '04', title: 'CONNECTION', desc: 'The relationship between photographer and subject is what makes great images possible.' },
          ].map(a => (
            <div key={a.n} style={{ padding: '40px 32px', border: '1px solid var(--border)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', opacity: 0.3, letterSpacing: '0.15em', marginBottom: '20px' }}>{a.n}</p>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '24px', letterSpacing: '0.02em', margin: '0 0 16px 0', color: 'var(--red)' }}>{a.title}</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', opacity: 0.55, lineHeight: 1.75, margin: 0 }}>{a.desc}</p>
            </div>
          ))}
        </div>
        <style>{`@media (max-width: 900px) { .approach-grid { grid-template-columns: 1fr 1fr !important; } } @media (max-width: 600px) { .approach-grid { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* Closing statement */}
      <section ref={stmtRef} className="reveal" style={{ padding: 'clamp(80px, 10vw, 140px) 60px', background: '#0a0a0a' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 'clamp(44px, 7vw, 96px)',
          letterSpacing: '-0.04em', lineHeight: 0.85,
          margin: 0, maxWidth: '1000px',
        }}>
          THE BEST PHOTOGRAPHS<br />
          DON'T JUST SHOW A MOMENT.<br />
          <span style={{ WebkitTextStroke: '1px rgba(240,237,232,0.25)', WebkitTextFillColor: 'transparent' }}>
            THEY BRING YOU BACK TO IT.
          </span>
        </h2>
      </section>
    </div>
  )
}

// ─── SERVICES PAGE ────────────────────────────────────────────────────────────
function Services({ setPage }: { setPage: (p: string) => void }) {
  const nav = (p: string) => { setPage(p); window.scrollTo(0, 0) }

  const services = [
    {
      n: '01', title: 'PORTRAITS', sub: 'Personal / Creative / Professional',
      items: ['Personal portraits', 'Creative portraits', 'Professional portraits', 'Graduation portraits', 'Couple portraits'],
      img: IMG.portrait1, cta: 'BOOK A PORTRAIT SESSION ↗',
    },
    {
      n: '02', title: 'LIFESTYLE', sub: 'Natural / Authentic / Atmospheric',
      items: ['Personal lifestyle', 'Couple photography', 'Creative lifestyle', 'Social media imagery'],
      img: IMG.couple2, cta: 'BOOK LIFESTYLE ↗',
    },
    {
      n: '03', title: 'EVENTS', sub: 'Private / Corporate / Creative',
      items: ['Private events', 'Birthdays & graduations', 'Product launches', 'Creative events', 'Corporate events'],
      img: IMG.event1, cta: 'ENQUIRE ABOUT AN EVENT ↗',
    },
    {
      n: '04', title: 'EDITORIAL', sub: 'Brand / Artist / Campaign',
      items: ['Brand photography', 'Artist & musician sessions', 'Fashion editorial', 'Campaigns', 'Creative projects'],
      img: IMG.editorial, cta: 'START A CREATIVE PROJECT ↗',
    },
  ]

  return (
    <div style={{ paddingTop: '120px' }}>
      <div style={{ padding: '0 60px 80px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', opacity: 0.35, marginBottom: '16px' }}>WHAT WE OFFER</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(60px, 10vw, 130px)', letterSpacing: '-0.04em', lineHeight: 0.85, margin: '0 0 16px 0' }}>
          SERVICES
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', opacity: 0.4, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          Photography for moments worth keeping.
        </p>
      </div>

      {services.map((s, i) => (
        <section key={s.n} style={{
          display: 'grid',
          gridTemplateColumns: i % 2 === 0 ? '1fr 1fr' : '1fr 1fr',
          gap: '2px',
          borderTop: '1px solid var(--border)',
          minHeight: '540px',
        }} className="service-row">
          <div style={{ order: i % 2 === 0 ? 0 : 1, overflow: 'hidden', background: '#1a1a1a', minHeight: '400px' }}>
            <img src={s.img} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(25%) contrast(1.05)', transition: 'transform 0.8s ease' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            />
          </div>
          <div style={{ order: i % 2 === 0 ? 1 : 0, padding: 'clamp(40px, 6vw, 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', opacity: 0.3, letterSpacing: '0.2em', marginBottom: '16px' }}>{s.n} / {s.sub.toUpperCase()}</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(44px, 6vw, 72px)', letterSpacing: '-0.03em', lineHeight: 0.85, margin: '0 0 32px 0' }}>
              {s.title}
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {s.items.map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-body)', fontSize: '14px', opacity: 0.6 }}>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--red)', flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>
            <button onClick={() => nav('book')} className="editorial-link" style={{ background: 'none', border: 'none', cursor: 'none', textAlign: 'left', width: 'fit-content' }}>
              {s.cta}
            </button>
          </div>
          <style>{`@media (max-width: 768px) { .service-row { grid-template-columns: 1fr !important; } .service-row > div { order: unset !important; } }`}</style>
        </section>
      ))}

      {/* Packages */}
      <section style={{ padding: 'clamp(80px, 10vw, 120px) 60px', borderTop: '1px solid var(--border)', background: '#0a0a0a' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }} className="pkg-grid">
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', opacity: 0.35, letterSpacing: '0.2em', marginBottom: '20px' }}>PRICING</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(48px, 7vw, 80px)', letterSpacing: '-0.04em', lineHeight: 0.88, margin: '0 0 32px 0' }}>
              PACKAGES
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', opacity: 0.6, lineHeight: 1.8, maxWidth: '400px' }}>
              Photography packages are tailored according to the type of shoot, duration, location, number of final photographs and production requirements.
            </p>
            <button onClick={() => nav('book')} className="btn-red" style={{ marginTop: '40px' }}>REQUEST A QUOTE ↗</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {['TYPE OF SHOOT', 'DURATION', 'LOCATION', 'FINAL PHOTOGRAPHS', 'PRODUCTION REQUIREMENTS'].map(f => (
              <div key={f} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', opacity: 0.5, letterSpacing: '0.12em' }}>{f}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', opacity: 0.3 }}>TAILORED</span>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media (max-width: 768px) { .pkg-grid { grid-template-columns: 1fr !important; } }`}</style>
      </section>
    </div>
  )
}

// ─── BOOK PAGE ────────────────────────────────────────────────────────────────
type BookingForm = { name: string; email: string; phone: string; type: string; date: string; location: string; message: string }

function Book() {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<BookingForm>({ name: '', email: '', phone: '', type: '', date: '', location: '', message: '' })
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!response.ok) throw new Error('Unable to send enquiry')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please email StillEssence.jhb@gmail.com directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px' }}>
        <div>
          <div style={{ width: '48px', height: '2px', background: 'var(--neon)', margin: '0 auto 40px' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(48px, 8vw, 88px)', letterSpacing: '-0.04em', lineHeight: 0.85, margin: '0 0 20px 0' }}>
            ENQUIRY<br /><span style={{ color: 'var(--red)' }}>RECEIVED.</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', opacity: 0.5, marginTop: '24px' }}>
            Thank you. I'll be in touch shortly.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: '120px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 120px)' }} className="book-grid">
        {/* Image side */}
        <div style={{ position: 'relative', overflow: 'hidden', minHeight: '500px' }}>
          <img src={IMG.portrait5} alt="Photography session" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(13,13,13,0.2), rgba(13,13,13,0.7))' }} />
          <div style={{ position: 'absolute', bottom: '60px', left: '48px', right: '48px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', opacity: 0.4, letterSpacing: '0.2em', marginBottom: '12px' }}>JOHANNESBURG — 2026</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(40px, 5vw, 60px)', letterSpacing: '-0.03em', lineHeight: 0.88, margin: 0 }}>
              LET'S<br />MAKE<br /><span style={{ color: 'var(--red)' }}>SOMETHING.</span>
            </h2>
          </div>
        </div>

        {/* Form side */}
        <div style={{ padding: 'clamp(60px, 8vw, 100px) clamp(40px, 6vw, 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', opacity: 0.35, letterSpacing: '0.2em', marginBottom: '16px' }}>BOOK / ENQUIRE</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', opacity: 0.5, marginBottom: '48px', lineHeight: 1.7 }}>
            Tell me a little about what you're looking for.
          </p>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { k: 'name', label: 'NAME', type: 'text' },
              { k: 'email', label: 'EMAIL', type: 'email' },
              { k: 'phone', label: 'PHONE', type: 'tel' },
            ].map(({ k, label, type }) => (
              <input
                key={k}
                type={type}
                placeholder={label}
                value={form[k as keyof typeof form]}
                onChange={set(k)}
                className="form-input"
                required={k !== 'phone'}
              />
            ))}

            <select
              value={form.type}
              onChange={set('type')}
              className="form-input form-select"
              required
              style={{ background: 'transparent', color: form.type ? 'var(--fg)' : 'rgba(240,237,232,0.3)', fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}
            >
              <option value="" disabled>TYPE OF SHOOT</option>
              {['Portrait', 'Lifestyle', 'Event', 'Editorial', 'Brand', 'Other'].map(o => (
                <option key={o} value={o} style={{ background: '#1a1a1a', color: 'var(--fg)' }}>{o}</option>
              ))}
            </select>

            {[
              { k: 'date', label: 'PREFERRED DATE' },
              { k: 'location', label: 'LOCATION' },
            ].map(({ k, label }) => (
              <input
                key={k}
                type="text"
                placeholder={label}
                value={form[k as keyof typeof form]}
                onChange={set(k)}
                className="form-input"
              />
            ))}

            <textarea
              placeholder="TELL ME ABOUT YOUR SHOOT"
              value={form.message}
              onChange={set('message')}
              className="form-input"
              rows={4}
              style={{ resize: 'none', fontFamily: 'var(--font-body)', fontSize: '15px' }}
            />

            {error && <p role="alert" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--red)', margin: '12px 0 0' }}>{error}</p>}

            <button type="submit" className="btn-red" disabled={isSubmitting} style={{ marginTop: '24px', justifyContent: 'center', fontSize: '12px', opacity: isSubmitting ? 0.6 : 1 }}>
              {isSubmitting ? 'SENDING...' : 'SEND ENQUIRY ↗'}
            </button>
          </form>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .book-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────
function Contact({ setPage }: { setPage: (p: string) => void }) {
  return (
    <div style={{ paddingTop: '120px', minHeight: '100vh' }}>
      <div style={{ padding: '0 60px 80px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', opacity: 0.35, marginBottom: '16px' }}>REACH OUT</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(60px, 10vw, 130px)', letterSpacing: '-0.04em', lineHeight: 0.85, margin: 0 }}>
          GET IN<br /><span style={{ color: 'var(--red)' }}>TOUCH</span>
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', padding: '0 60px', marginBottom: '80px' }} className="contact-grid">
        {[
          { label: 'EMAIL', value: 'StillEssence.jhb@gmail.com', href: 'mailto:StillEssence.jhb@gmail.com' },
          { label: 'WHATSAPP', value: '076 075 5270', href: 'https://wa.me/27760755270' },
          { label: 'INSTAGRAM', value: '@stillessence.jhb', href: '#' },
          { label: 'LOCATION', value: 'Johannesburg, South Africa', href: null },
        ].map(c => (
          <div key={c.label} style={{ padding: '40px 0', borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', opacity: 0.3, letterSpacing: '0.2em', marginBottom: '16px' }}>{c.label}</p>
            {c.href ? (
              <a href={c.href} className="editorial-link" style={{ fontSize: '18px', opacity: 0.8 }}>{c.value}</a>
            ) : (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '18px', opacity: 0.8, margin: 0 }}>{c.value}</p>
            )}
          </div>
        ))}
      </div>

      <div style={{ padding: '0 60px 120px', display: 'flex', alignItems: 'center', gap: '24px' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', opacity: 0.5, margin: 0 }}>
          Ready to book a session?
        </p>
        <button onClick={() => { setPage('book'); window.scrollTo(0, 0) }} className="btn-red">
          GO TO BOOK PAGE ↗
        </button>
      </div>
      <style>{`@media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr !important; padding: 0 32px !important; } }`}</style>
    </div>
  )
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const validPages = ['home', 'work', 'about', 'services', 'book', 'contact']
  const initialPage = window.location.hash.replace('#', '')
  const [page, setPage] = useState(validPages.includes(initialPage) ? initialPage : 'home')

  useEffect(() => {
    const onHashChange = () => {
      const nextPage = window.location.hash.replace('#', '')
      setPage(validPages.includes(nextPage) ? nextPage : 'home')
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = (nextPage: string) => {
    setPage(nextPage)
    window.history.pushState({}, '', nextPage === 'home' ? window.location.pathname : `#${nextPage}`)
  }

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh' }}>
      <Grain />
      <Cursor />
      <Nav page={page} setPage={navigate} />

      <main>
        {page === 'home'     && <Home setPage={navigate} />}
        {page === 'work'     && <Work />}
        {page === 'about'    && <About />}
        {page === 'services' && <Services setPage={navigate} />}

        {page === 'book'     && <Book />}
        {page === 'contact'  && <Contact setPage={navigate} />}
      </main>

      <Footer setPage={navigate} />
    </div>
  )
}

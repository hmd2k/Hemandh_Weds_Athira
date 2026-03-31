import React, { useEffect, useRef } from 'react';
import './index.css';

/* ═══════════════════════════════════════════════════════════════
   URL PARAMETER LOGIC
   Usage:
     ?invite=both       (default) show both events
     ?invite=wedding    show wedding only
     ?invite=reception  show reception only
     ?name=Rajan%20Nair add personalised banner
═══════════════════════════════════════════════════════════════ */
function useGuestParams() {
  const p = new URLSearchParams(window.location.search);
  const invite = (p.get('invite') || 'both').toLowerCase().trim();
  const name = p.get('name') ? decodeURIComponent(p.get('name')) : '';
  return { invite, name };
}

/* ═══════════════════════════════════════════════════════════════
   SCROLL REVEAL HOOK
═══════════════════════════════════════════════════════════════ */
function useScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('on'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.rv').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ═══════════════════════════════════════════════════════════════
   PETAL CANVAS HOOK
═══════════════════════════════════════════════════════════════ */
function usePetalCanvas(canvasRef) {
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    let W, H, animId;

    const resize = () => { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const COLS = ['#D4AF37','#0A1931','#FFD700','#FF8C00','#F7ECCB','#182C51'];
    const pts = Array.from({ length: 46 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 2.5 + Math.random() * 5,
      vx: (Math.random() - .5) * .7,
      vy: .35 + Math.random() * .75,
      a: Math.random() * Math.PI * 2,
      s: (Math.random() - .5) * .05,
      c: COLS[Math.floor(Math.random() * COLS.length)],
      o: .1 + Math.random() * .26,
      t: Math.random() > .45 ? 'p' : 'c',
    }));

    function drawPt(p) {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a);
      ctx.globalAlpha = p.o; ctx.fillStyle = p.c;
      if (p.t === 'p') {
        ctx.beginPath(); ctx.ellipse(0, 0, p.r * .55, p.r * 1.7, 0, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.beginPath(); ctx.arc(0, 0, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      pts.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.a += p.s;
        if (p.y > H + 20) { p.y = -20; p.x = Math.random() * W; }
        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;
        drawPt(p);
      });
      animId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [canvasRef]);
}

/* ═══════════════════════════════════════════════════════════════
   CUSTOM CURSOR HOOK
═══════════════════════════════════════════════════════════════ */
function useCustomCursor(cursorRef, ringRef) {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return;
    const cur = cursorRef.current;
    const ring = ringRef.current;
    if (!cur || !ring) return;

    const onMove = (e) => {
      const x = e.clientX, y = e.clientY;
      cur.style.left = x + 'px';
      cur.style.top  = y + 'px';
      setTimeout(() => {
        ring.style.left = x + 'px';
        ring.style.top  = y + 'px';
      }, 95);
    };
    document.addEventListener('mousemove', onMove);
    return () => document.removeEventListener('mousemove', onMove);
  }, [cursorRef, ringRef]);
}

/* ═══════════════════════════════════════════════════════════════
   PARALLAX MANDALA HOOK
═══════════════════════════════════════════════════════════════ */
function useParallaxMandala(heroRef) {
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const onScroll = () => {
      const sy = window.scrollY;
      const mC  = hero.querySelector('.mnd-center');
      const mTL = hero.querySelector('.mnd-tl');
      const mBR = hero.querySelector('.mnd-br');
      if (mC)  mC.style.transform  = `translate(-50%,calc(-50% + ${sy * .06}px)) rotate(${sy * .018}deg)`;
      if (mTL) mTL.style.transform = `translateY(${sy * .13}px) rotate(-18deg)`;
      if (mBR) mBR.style.transform = `translateY(${sy * .13}px) rotate(22deg)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [heroRef]);
}

/* ═══════════════════════════════════════════════════════════════
   SECTION COMPONENTS
═══════════════════════════════════════════════════════════════ */

function HeroSection({ heroRef }) {
  return (
    <section className="hero" id="hero" ref={heroRef}>
      {/* Spinning center mandala */}
      <svg className="mnd mnd-center" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke="#C9A84C" strokeWidth=".7">
          <circle cx="300" cy="300" r="280" />
          <circle cx="300" cy="300" r="245" />
          <circle cx="300" cy="300" r="208" />
          <circle cx="300" cy="300" r="168" />
          <circle cx="300" cy="300" r="128" />
          <circle cx="300" cy="300" r="88" />
          <circle cx="300" cy="300" r="48" />
          <ellipse cx="300" cy="88" rx="14" ry="36" />
          <ellipse cx="300" cy="88" rx="14" ry="36" transform="rotate(30  300 300)" />
          <ellipse cx="300" cy="88" rx="14" ry="36" transform="rotate(60  300 300)" />
          <ellipse cx="300" cy="88" rx="14" ry="36" transform="rotate(90  300 300)" />
          <ellipse cx="300" cy="88" rx="14" ry="36" transform="rotate(120 300 300)" />
          <ellipse cx="300" cy="88" rx="14" ry="36" transform="rotate(150 300 300)" />
          <ellipse cx="300" cy="88" rx="14" ry="36" transform="rotate(180 300 300)" />
          <ellipse cx="300" cy="88" rx="14" ry="36" transform="rotate(210 300 300)" />
          <ellipse cx="300" cy="88" rx="14" ry="36" transform="rotate(240 300 300)" />
          <ellipse cx="300" cy="88" rx="14" ry="36" transform="rotate(270 300 300)" />
          <ellipse cx="300" cy="88" rx="14" ry="36" transform="rotate(300 300 300)" />
          <ellipse cx="300" cy="88" rx="14" ry="36" transform="rotate(330 300 300)" />
          <line x1="300" y1="12" x2="300" y2="588" />
          <line x1="12" y1="300" x2="588" y2="300" />
          <line x1="300" y1="12" x2="300" y2="588" transform="rotate(45  300 300)" />
          <line x1="12" y1="300" x2="588" y2="300" transform="rotate(45  300 300)" />
        </g>
      </svg>

      {/* Corner mandalas */}
      <svg className="mnd mnd-tl" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke="#C9A84C" strokeWidth=".8">
          <circle cx="200" cy="200" r="185" />
          <circle cx="200" cy="200" r="148" />
          <circle cx="200" cy="200" r="110" />
          <circle cx="200" cy="200" r="72" />
          <ellipse cx="200" cy="78" rx="12" ry="30" />
          <ellipse cx="200" cy="78" rx="12" ry="30" transform="rotate(45  200 200)" />
          <ellipse cx="200" cy="78" rx="12" ry="30" transform="rotate(90  200 200)" />
          <ellipse cx="200" cy="78" rx="12" ry="30" transform="rotate(135 200 200)" />
          <ellipse cx="200" cy="78" rx="12" ry="30" transform="rotate(180 200 200)" />
          <ellipse cx="200" cy="78" rx="12" ry="30" transform="rotate(225 200 200)" />
          <ellipse cx="200" cy="78" rx="12" ry="30" transform="rotate(270 200 200)" />
          <ellipse cx="200" cy="78" rx="12" ry="30" transform="rotate(315 200 200)" />
        </g>
      </svg>
      <svg className="mnd mnd-br" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke="#C9A84C" strokeWidth=".8">
          <circle cx="200" cy="200" r="185" />
          <circle cx="200" cy="200" r="145" />
          <circle cx="200" cy="200" r="105" />
          <circle cx="200" cy="200" r="65" />
          <ellipse cx="200" cy="72" rx="13" ry="32" transform="rotate(0   200 200)" />
          <ellipse cx="200" cy="72" rx="13" ry="32" transform="rotate(36  200 200)" />
          <ellipse cx="200" cy="72" rx="13" ry="32" transform="rotate(72  200 200)" />
          <ellipse cx="200" cy="72" rx="13" ry="32" transform="rotate(108 200 200)" />
          <ellipse cx="200" cy="72" rx="13" ry="32" transform="rotate(144 200 200)" />
          <ellipse cx="200" cy="72" rx="13" ry="32" transform="rotate(180 200 200)" />
          <ellipse cx="200" cy="72" rx="13" ry="32" transform="rotate(216 200 200)" />
          <ellipse cx="200" cy="72" rx="13" ry="32" transform="rotate(252 200 200)" />
          <ellipse cx="200" cy="72" rx="13" ry="32" transform="rotate(288 200 200)" />
          <ellipse cx="200" cy="72" rx="13" ry="32" transform="rotate(324 200 200)" />
        </g>
      </svg>

      {/* Text */}
      <div className="h-sub">A Sacred Union</div>
      <div className="h-om">ॐ</div>
      <div className="h-line"></div>

      {/* Illustrated Couple */}
      <div className="couple-wrap">
        {/* Groom */}
        <div className="fig" style={{ transform: 'translateX(9px)' }}>
          <svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="60" cy="64" rx="24" ry="26" fill="#C8865A" />
            <rect x="35" y="30" width="50" height="18" rx="9" fill="#0A1931" />
            <ellipse cx="60" cy="30" rx="25" ry="9" fill="#020814" />
            <path d="M36 37 Q60 45 84 37" fill="#0A1931" />
            <circle cx="60" cy="30" r="5.5" fill="#C9A84C" />
            <circle cx="60" cy="30" r="2.8" fill="#FFD700" />
            <ellipse cx="51.5" cy="64" rx="3.5" ry="4.5" fill="#1A0505" opacity=".78" />
            <ellipse cx="68.5" cy="64" rx="3.5" ry="4.5" fill="#1A0505" opacity=".78" />
            <path d="M52 74 Q60 81 68 74" stroke="#B06040" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <rect x="28" y="88" width="64" height="80" rx="8" fill="#0A1931" />
            <rect x="28" y="88" width="64" height="26" rx="4" fill="#020814" />
            <line x1="60" y1="88" x2="60" y2="166" stroke="#C9A84C" strokeWidth="1.3" />
            <circle cx="60" cy="98" r="2.6" fill="#C9A84C" />
            <circle cx="60" cy="110" r="2.6" fill="#C9A84C" />
            <circle cx="60" cy="122" r="2.6" fill="#C9A84C" />
            <circle cx="60" cy="134" r="2.6" fill="#C9A84C" />
            <path d="M35 90 Q60 104 85 90" stroke="#C9A84C" strokeWidth="1.5" fill="none" />
            <rect x="13" y="90" width="17" height="56" rx="8" fill="#0A1931" />
            <rect x="90" y="90" width="17" height="56" rx="8" fill="#0A1931" />
            <ellipse cx="21.5" cy="149" rx="8.5" ry="6.5" fill="#C8865A" />
            <ellipse cx="98.5" cy="149" rx="8.5" ry="6.5" fill="#C8865A" />
            <rect x="32" y="166" width="22" height="32" rx="4" fill="#C9A84C" opacity=".88" />
            <rect x="66" y="166" width="22" height="32" rx="4" fill="#C9A84C" opacity=".88" />
          </svg>
        </div>

        {/* Bride */}
        <div className="fig" style={{ transform: 'translateX(-9px)' }}>
          <svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="19" r="12" fill="#180606" />
            <circle cx="50" cy="17" r="5.5" fill="#C9A84C" />
            <circle cx="50" cy="17" r="2.8" fill="#FFD700" />
            <ellipse cx="60" cy="57" rx="23" ry="25" fill="#C8865A" />
            <path d="M37 46 Q60 21 83 46 Q86 63 82 73 Q72 50 60 51 Q48 50 38 73 Q34 63 37 46Z" fill="#180606" />
            <line x1="60" y1="19" x2="60" y2="41" stroke="#C9A84C" strokeWidth="1.2" />
            <circle cx="60" cy="42" r="3.8" fill="#C9A84C" />
            <circle cx="60" cy="42" r="2" fill="#FFD700" />
            <circle cx="60" cy="47" r="2.8" fill="#0A1931" />
            <ellipse cx="51.5" cy="57" rx="3.6" ry="4.4" fill="#180606" opacity=".85" />
            <ellipse cx="68.5" cy="57" rx="3.6" ry="4.4" fill="#180606" opacity=".85" />
            <path d="M50 67 Q60 75 70 67" stroke="#B06040" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <circle cx="37" cy="61" r="3" fill="#C9A84C" />
            <line x1="37" y1="64" x2="37" y2="74" stroke="#C9A84C" strokeWidth="1.5" />
            <ellipse cx="37" cy="76" rx="3" ry="4" fill="#C9A84C" />
            <rect x="33" y="80" width="54" height="34" rx="6" fill="#020814" />
            <path d="M39 86 Q60 101 81 86" stroke="#C9A84C" strokeWidth="2" fill="none" />
            <circle cx="60" cy="98" r="3.8" fill="#C9A84C" />
            <ellipse cx="60" cy="147" rx="37" ry="52" fill="#0A1931" />
            <path d="M23 133 Q42 117 60 133 Q78 150 97 133" stroke="#C9A84C" strokeWidth="1.3" fill="none" />
            <path d="M27 153 Q45 138 60 153 Q75 168 93 153" stroke="rgba(201,168,76,.35)" strokeWidth="1" fill="none" />
            <path d="M81 84 Q95 118 92 177" stroke="#C9A84C" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity=".6" />
            <rect x="15" y="84" width="20" height="48" rx="9" fill="#020814" />
            <rect x="85" y="84" width="20" height="48" rx="9" fill="#020814" />
            <rect x="13" y="115" width="24" height="5" rx="2.5" fill="#C9A84C" />
            <rect x="13" y="122" width="24" height="5" rx="2.5" fill="#FFD700" />
            <rect x="83" y="115" width="24" height="5" rx="2.5" fill="#C9A84C" />
            <ellipse cx="25" cy="135" rx="9.5" ry="6.5" fill="#C8865A" />
            <ellipse cx="95" cy="135" rx="9.5" ry="6.5" fill="#C8865A" />
          </svg>
        </div>

        {/* Garland */}
        <svg className="garland-arc" viewBox="0 0 80 28" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6 Q20 24 40 12 Q60 24 76 6" stroke="#C9A84C" strokeWidth="1.5" fill="none" />
          <circle cx="13" cy="19" r="4" fill="#FFD700" opacity=".82" />
          <circle cx="27" cy="13" r="3.5" fill="#FF8C00" opacity=".82" />
          <circle cx="40" cy="10" r="4" fill="#FFD700" opacity=".88" />
          <circle cx="53" cy="14" r="3.5" fill="#FF8C00" opacity=".82" />
          <circle cx="67" cy="19" r="4" fill="#FFD700" opacity=".82" />
        </svg>
      </div>

      <div className="h-names">
        <div className="h-name">Hemandh P M</div>
        <span className="h-amp">&amp;</span>
        <div className="h-name">Athira Prakash</div>
      </div>

      <div className="h-date">Sunday · May 3 · 2026</div>
      <div className="h-scroll">↓ &nbsp; scroll</div>
    </section>
  );
}

function InviteSection() {
  return (
    <section className="invite-sec">
      <div className="inner">
        <div className="eyebrow rv d1">With Joy &amp; Blessings</div>
        <h2 className="ttl rv d2">You Are Invited</h2>
        <div className="orn rv d3"></div>

        <p className="invite-text rv d3">
          We request the honour of your presence with family<br />
          to grace the auspicious occasion of the marriage of<br /><br />
          <strong>Hemandh P M</strong> &amp; <strong>Athira Prakash</strong>
        </p>

        <div className="parents-grid rv d4">
          <div className="p-card">
            <div className="p-label">Groom's Parents</div>
            <div className="p-name">
              Mr. Mahilal P R
              <span className="amp">&amp;</span>
              Mrs. Sreelekha Sudhan
            </div>
            <div className="p-addr">Indheevaram, Panayappilly<br />Kochi — 682002</div>
          </div>
          <div className="p-card">
            <div className="p-label">Bride's Parents</div>
            <div className="p-name">
              Mr. Prakash M K
              <span className="amp">&amp;</span>
              Mrs. Bindu Prakash
            </div>
            <div className="p-addr">Marukattumuppathil, Veloor<br />Kottayam</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CelebSection({ invite }) {
  const hideWedding = invite === 'reception';
  const hideReception = invite === 'wedding';

  return (
    <section className="celeb-sec">
      <div className="inner">
        <div className="eyebrow lt rv d1">Mark Your Calendars</div>
        <h2 className="ttl lt rv d2">Celebrations</h2>
        <div className="orn lt rv d3"></div>
        <p className="body-txt lt rv d3">
          Two families, one destiny —<br />
          join us across two days of love, rituals &amp; togetherness.
        </p>

        <div className="events-wrap">
          {/* WEDDING */}
          <div className={`ev-block rv d4${hideWedding ? ' hide-ev' : ''}`} id="ev-wedding">
            <div className="ev-diya">🪔</div>
            <span className="ev-icon">🪔</span>
            <div className="ev-type">The Wedding</div>
            <div className="ev-title">Vivah Ceremony</div>
            <div className="ev-row"><span className="ev-ico">📅</span><span className="ev-txt">Sunday, 3rd May 2026</span></div>
            <div className="ev-row"><span className="ev-ico">⏰</span><span className="ev-txt">12:15 PM</span></div>
            <div className="ev-row">
              <span className="ev-ico">📍</span>
              <span className="ev-txt">V G D M Hall,<br />Alummood, Kottayam</span>
            </div>
            <div className="ev-qr">
              <img src="/qr_images/wedding_qr.png" alt="Wedding Location QR Code" />
              <span>Scan for Location</span>
            </div>
          </div>

          {/* RECEPTION */}
          <div className={`ev-block rv d5${hideReception ? ' hide-ev' : ''}`} id="ev-reception">
            <div className="ev-diya">✨</div>
            <span className="ev-icon">✨</span>
            <div className="ev-type">The Reception</div>
            <div className="ev-title">Wedding Reception</div>
            <div className="ev-row"><span className="ev-ico">📅</span><span className="ev-txt">Monday, 4th May 2026</span></div>
            <div className="ev-row"><span className="ev-ico">⏰</span><span className="ev-txt">6:00 PM — 9:00 PM</span></div>
            <div className="ev-row">
              <span className="ev-ico">📍</span>
              <span className="ev-txt">Shamiana Convention Centre<br />Panayappilly, Kochi — 682002</span>
            </div>
            <div className="ev-qr">
              <img src="/qr_images/reception_qr.png" alt="Reception Location QR Code" />
              <span>Scan for Location</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineSection({ invite }) {
  const hideWedding = invite === 'reception';
  const hideReception = invite === 'wedding';

  return (
    <section className="tl-sec">
      <div className="inner">
        <div className="eyebrow rv d1">Day by Day</div>
        <h2 className="ttl rv d2">Celebration Timeline</h2>
        <div className="orn rv d3"></div>

        <div className="timeline">
          <div className={`tl-item rv d3${hideWedding ? ' hide-ev' : ''}`} id="tl-w1">
            <div className="tl-l">
              <div className="tl-time">May 3 · 12:15 PM</div>
              <div className="tl-ev">Vivah Muhurtham</div>
              <div className="tl-desc">The sacred union under the blessing of the stars</div>
            </div>
            <div className="tl-mid">
              <div className="tl-dot"></div>
              <div className="tl-con"></div>
            </div>
            <div className="tl-r">
              <div className="tl-time">Kottayam</div>
              <div className="tl-desc">V G D M Hall, Alummood</div>
            </div>
          </div>

          <div className={`tl-item rv d4${hideWedding ? ' hide-ev' : ''}`} id="tl-w2">
            <div className="tl-l">
              <div className="tl-time">May 3 · Afternoon</div>
              <div className="tl-ev">Wedding Feast</div>
              <div className="tl-desc">A sadhya celebrating the union of two families</div>
            </div>
            <div className="tl-mid">
              <div className="tl-dot"></div>
              <div className="tl-con"></div>
            </div>
            <div className="tl-r">
              <div className="tl-time">Kottayam</div>
              <div className="tl-desc">Following the ceremony</div>
            </div>
          </div>

          <div className={`tl-item rv d5${hideReception ? ' hide-ev' : ''}`} id="tl-r1">
            <div className="tl-l">
              <div className="tl-time">May 4 · 6–9 PM</div>
              <div className="tl-ev">Wedding Reception</div>
              <div className="tl-desc">An evening of joy, music &amp; togetherness</div>
            </div>
            <div className="tl-mid">
              <div className="tl-dot"></div>
            </div>
            <div className="tl-r">
              <div className="tl-time">Kochi</div>
              <div className="tl-desc">Shamiana Convention Centre<br />Panayappilly</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RsvpSection() {
  return (
    <section className="rsvp-sec">
      <div className="inner">
        <h2 className="ttl rv d2">With best compliments</h2>
        <div className="orn wide rv d3"></div>
        <div className="eyebrow rv d1" style={{ fontSize: '1rem', color: 'var(--wine)' }}>Anvi Akshay</div>
        <div className="eyebrow rv d1" style={{ fontSize: '1rem', color: 'var(--wine)' }}>Akshay P M</div>
        <div className="eyebrow rv d1" style={{ fontSize: '1rem', color: 'var(--wine)' }}>Anargha Santhosh</div>
        <div className="orn wide rv d3"></div>
        <p className="rsvp-body rv d4">
          We would be deeply honoured to have you and your family celebrate with us.<br />
        </p>
        <div className="rsvp-deco rv d5">✦</div>
        <p
          className="rv d5"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: 'var(--text-med)',
            fontStyle: 'italic',
            lineHeight: 1.9,
          }}
        >
          For directions, assistance, or any queries<br />
          please reach out to us — we are here to help.
        </p>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="contact-sec">
      <div className="inner">
        <div className="eyebrow lt rv d1">Get in Touch</div>
        <h2 className="ttl lt rv d2">Contact Us</h2>
        <div className="orn rv d3"></div>

        <div className="contact-list rv d4">
          <div className="c-row">
            <div className="c-person">Mahilal P R</div>
            <div className="c-num"><a href="tel:8921477653">89214 77653</a></div>
          </div>
          <div className="c-row">
            <div className="c-person">Akshay P M</div>
            <div className="c-num"><a href="tel:9946655193">99466 55193</a></div>
          </div>
          <div className="c-row">
            <div className="c-person">Hemandh P M</div>
            <div className="c-num"><a href="tel:9446521711">94465 21711</a></div>
          </div>
        </div>

        <div className="closing rv d5">
          "We look forward to celebrating this most auspicious occasion<br />
          with you and your beloved family."
        </div>

        <div className="footer-names rv d6">
          Hemandh &amp; Athira
          <div className="footer-sub">3rd May 2026</div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GUEST BANNER COMPONENT
═══════════════════════════════════════════════════════════════ */
function GuestBanner({ invite, name }) {
  const show = name || invite !== 'both';
  if (!show) return null;

  let msg = '';
  if (name) msg += `Dear ${name} — `;
  if (invite === 'wedding')        msg += 'We cordially invite you to the wedding ceremony of Hemandh & Athira and request the pleasure of your presence on this auspicious occasion · 3rd May';
  else if (invite === 'reception') msg += 'We warmly invite you to join us for the wedding reception of Hemandh & Athira and celebrate this joyous occasion with us · 4th May';
  else                             msg += 'We request the honor of your presence at the wedding and reception of Hemandh & Athira as we celebrate the beginning of our new journey together';

  return (
    <div id="guest-banner" className="show">
      <span id="banner-text">{msg}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════ */
export default function App() {
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);
  const ringRef   = useRef(null);
  const heroRef   = useRef(null);

  const { invite, name } = useGuestParams();
  const hasBanner = !!(name || invite !== 'both');

  useScrollReveal();
  usePetalCanvas(canvasRef);
  useCustomCursor(cursorRef, ringRef);
  useParallaxMandala(heroRef);

  // Apply body class for banner offset
  useEffect(() => {
    if (hasBanner) document.body.classList.add('has-banner');
    return () => document.body.classList.remove('has-banner');
  }, [hasBanner]);

  return (
    <>
      {/* Custom cursor */}
      <div id="cursor" ref={cursorRef}></div>
      <div id="cursor-ring" ref={ringRef}></div>

      {/* Floating petal canvas */}
      <canvas id="petal-canvas" ref={canvasRef}></canvas>

      {/* Personalised guest banner */}
      <GuestBanner invite={invite} name={name} />

      {/* Sections */}
      <HeroSection heroRef={heroRef} />
      <InviteSection />
      <CelebSection invite={invite} />
      <TimelineSection invite={invite} />
      <RsvpSection />
      <ContactSection />
    </>
  );
}

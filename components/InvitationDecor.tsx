'use client';

/**
 * InvitationDecor — ornamental framing for the opening invitation card.
 * Purely decorative (aria-hidden, pointer-events:none): soft botanical
 * shadows on the ivory ground, thin gold flourish lines that "draw on"
 * with the reveal, engraved side labels, and a slow drift of rose petals.
 *
 * Entrance of the flourishes + side labels is driven by OpeningSequence's
 * GSAP timeline (selectors `.flourish-path` and `.invitation-aside`); the
 * ambient sway/drift is CSS and respects prefers-reduced-motion.
 */

const PETALS = [
  { left: 12, size: 16, delay: 0, dur: 15, drift: 40, tint: ['#FBE3E8', '#D98B98'] },
  { left: 22, size: 12, delay: 6, dur: 19, drift: -30, tint: ['#F7D6DE', '#C77E8C'] },
  { left: 34, size: 14, delay: 11, dur: 17, drift: 26, tint: ['#FFFFFF', '#EBCAD0'] },
  { left: 63, size: 13, delay: 3, dur: 20, drift: -34, tint: ['#F1C6D0', '#9C6B78'] },
  { left: 74, size: 17, delay: 9, dur: 16, drift: 36, tint: ['#FBE3E8', '#D98B98'] },
  { left: 85, size: 11, delay: 14, dur: 21, drift: -22, tint: ['#F7D6DE', '#C77E8C'] },
  { left: 46, size: 12, delay: 17, dur: 18, drift: 30, tint: ['#FFFFFF', '#EBCAD0'] },
  { left: 92, size: 13, delay: 7, dur: 22, drift: -28, tint: ['#F1C6D0', '#9C6B78'] },
];

function Sprig() {
  // A small watercolor-style branch used, heavily blurred, as a light shadow.
  return (
    <svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M100 250 C100 200 96 150 100 96"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {[
        [100, 170, -40, 20],
        [100, 140, 42, 22],
        [100, 118, -38, 16],
        [100, 96, 30, 14],
      ].map(([cx, cy, dx, dy], i) => (
        <ellipse
          key={i}
          cx={cx + dx}
          cy={cy - Math.abs(dy)}
          rx={Math.abs(dx) * 0.7}
          ry={dy + 14}
          transform={`rotate(${dx > 0 ? 32 : -32} ${cx + dx} ${cy - Math.abs(dy)})`}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

export default function InvitationDecor() {
  return (
    <>
      <div className="invitation-botanical invitation-botanical-l" aria-hidden>
        <Sprig />
      </div>
      <div className="invitation-botanical invitation-botanical-r" aria-hidden>
        <Sprig />
      </div>

      <svg
        className="invitation-flourish"
        viewBox="0 0 1440 820"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        {/* left sweep toward the arch */}
        <path
          className="flourish-path"
          pathLength={1}
          d="M -30 500 C 210 452 330 336 452 262 C 500 232 520 214 528 190"
        />
        {/* right sweep toward the arch */}
        <path
          className="flourish-path"
          pathLength={1}
          d="M 1470 330 C 1226 300 1104 430 1000 512 C 958 545 940 566 936 592"
        />
      </svg>

      <div className="invitation-aside invitation-aside-left" aria-hidden>
        <span className="invitation-aside-tick" />
        <p>
          A&nbsp;beautiful
          <br />
          chapter
          <br />
          begins
        </p>
      </div>
      <div className="invitation-aside invitation-aside-right" aria-hidden>
        <span className="invitation-aside-tick" />
        <p>
          Same&nbsp;people
          <br />
          new
          <br />
          adventures
        </p>
      </div>

      <div className="invitation-petals" aria-hidden>
        {PETALS.map((p, i) => (
          <span
            key={i}
            className="invitation-petal"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size * 0.72}px`,
              background: `radial-gradient(circle at 32% 28%, ${p.tint[0]} 0%, ${p.tint[1]} 100%)`,
              // per-petal timing + horizontal sway distance
              ['--pd' as string]: `${p.dur}s`,
              ['--pdelay' as string]: `${p.delay}s`,
              ['--pdrift' as string]: `${p.drift}px`,
            }}
          />
        ))}
      </div>
    </>
  );
}

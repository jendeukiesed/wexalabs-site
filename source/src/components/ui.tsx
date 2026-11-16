import type { ReactNode } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'

export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function WaIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2.2A9.8 9.8 0 0 0 3.6 17l-1.4 4.9 5-1.3A9.8 9.8 0 1 0 12 2.2zm0 17.8a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3 1 2.5c.1.2 1.7 2.6 4.1 3.6 1.5.7 2.1.7 2.9.6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.4-.3z" />
    </svg>
  )
}

export function Button({ href, children, variant = 'primary', onClick }: { href?: string; children: ReactNode; variant?: 'primary' | 'secondary' | 'light'; onClick?: () => void }) {
  const base = 'group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
  const styles = {
    primary: 'bg-ink text-white hover:bg-[#2A2A2D]',
    secondary: 'border border-line bg-white text-ink hover:border-[#C9C9C3]',
    light: 'bg-white text-ink hover:bg-[#EDEDE8]',
  }[variant]
  return href ? (
    <a href={href} className={`${base} ${styles}`} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{children}</a>
  ) : (
    <button type="submit" onClick={onClick} className={`${base} ${styles}`}>{children}</button>
  )
}

export function Arrow() {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" className="transition-transform group-hover:translate-x-0.5">
      <path d="M2 7h10M8 3l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function SectionLabel({ n, children, dark = false }: { n: string; children: ReactNode; dark?: boolean }) {
  return (
    <p className={`flex items-center gap-3 text-[13px] font-medium ${dark ? 'text-white/60' : 'text-muted'}`}>
      <span className={`font-mono ${dark ? 'text-white' : 'text-ink'}`}>{n}</span>
      <span className={`h-px w-8 ${dark ? 'bg-white/25' : 'bg-line'}`} />
      {children}
    </p>
  )
}

/** Headline that reveals word by word when scrolled into view (or on load with `onLoad`). */
export function Words({ parts, className = '', as = 'h2', onLoad = false, delay = 0 }: {
  parts: { text: string; className?: string; br?: boolean }[]
  className?: string
  as?: 'h1' | 'h2'
  onLoad?: boolean
  delay?: number
}) {
  const Tag = as === 'h1' ? motion.h1 : motion.h2
  let n = 0
  const trigger = onLoad ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, margin: '-60px' } }
  return (
    <Tag initial="hide" {...trigger} className={className} transition={{ staggerChildren: 0.045, delayChildren: delay }}>
      {parts.map((p, pi) => (
        <span key={pi} className={p.className}>
          {p.br && <br />}
          {p.text.split(' ').filter(Boolean).map((w) => {
            n++
            return (
              <span key={`${pi}-${n}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  className="inline-block"
                  variants={{ hide: { y: '105%', opacity: 0 }, show: { y: '0%', opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
                >
                  {w}&nbsp;
                </motion.span>
              </span>
            )
          })}
        </span>
      ))}
    </Tag>
  )
}

/** Card with a soft light that follows the cursor. */
export function Spotlight({ children, className = '', dark = false }: { children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <div
      className={`group/spot relative overflow-hidden ${className}`}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
        e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{ background: `radial-gradient(260px circle at var(--x) var(--y), ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(11,122,90,0.07)'}, transparent 70%)` }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30 })
  return <motion.div aria-hidden="true" style={{ scaleX }} className="fixed top-16 right-0 left-0 z-50 h-[2px] origin-left bg-ink/80" />
}

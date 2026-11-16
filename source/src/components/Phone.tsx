import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCopy } from '../i18n'

export type Msg = {
  from: 'customer' | 'business'
  text: string
  buttons?: string[]
  card?: ReactNode
  time?: string
}

/** Plays a chat script message by message, with a typing indicator before business replies. */
export function useChatPlayer(
  script: Msg[],
  opts: { active?: boolean; loop?: boolean; onDone?: () => void } = {},
) {
  const { active = true, loop = true, onDone } = opts
  const reduce = useReducedMotion()
  const [count, setCount] = useState(0)
  const [typing, setTyping] = useState(false)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    if (reduce) { setCount(script.length); setTyping(false); return }
    if (!active) return
    let i = 0
    let cancelled = false
    const timers: number[] = []
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(() => !cancelled && fn(), ms))
    setCount(0)
    setTyping(false)

    const step = () => {
      if (i >= script.length) {
        later(() => {
          if (doneRef.current) doneRef.current()
          else if (loop) { i = 0; setCount(0); later(step, 500) }
        }, 3800)
        return
      }
      const m = script[i]
      if (m.from === 'business') {
        later(() => setTyping(true), 350)
        later(() => { setTyping(false); i++; setCount(i); later(step, 650) }, 1500)
      } else {
        later(() => { i++; setCount(i); step() }, i === 0 ? 600 : 1300)
      }
    }
    step()
    return () => { cancelled = true; timers.forEach(clearTimeout) }
  }, [script, active, loop, reduce])

  return { visible: script.slice(0, count), typing, finished: count >= script.length }
}

function Ticks() {
  return (
    <svg aria-hidden="true" width="16" height="11" viewBox="0 0 16 11" className="inline-block ml-1 -mb-px">
      <path d="M1 6l3 3 6-7M6 9l1 1 6-8" fill="none" stroke="#53BDEB" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Bubble({ m, onPick }: { m: Msg; onPick?: (b: string) => void }) {
  const out = m.from === 'customer'
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      className={`flex flex-col ${out ? 'items-end' : 'items-start'}`}
    >
      <div
        className={`max-w-[84%] rounded-lg px-2.5 pt-1.5 pb-1 text-[13.5px] leading-snug text-[#111B21] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] ${
          out ? 'bg-wa-out rounded-tr-none' : 'bg-white rounded-tl-none'
        }`}
      >
        {m.card}
        <span className="whitespace-pre-line">{m.text}</span>
        <span className="float-right ml-2 mt-1.5 text-[10.5px] text-[#667781] leading-none">
          {m.time ?? '14:02'}
          {out && <Ticks />}
        </span>
      </div>
      {m.buttons && (
        <div className="mt-1 grid w-[84%] gap-1" style={{ gridTemplateColumns: `repeat(${Math.min(m.buttons.length, 3)}, minmax(0,1fr))` }}>
          {m.buttons.map((b) =>
            onPick ? (
              <motion.button
                key={b}
                type="button"
                onClick={() => onPick(b)}
                whileTap={{ scale: 0.96 }}
                className="min-h-9 rounded-lg bg-white px-1 py-1.5 text-center text-[13px] font-medium text-[#027EB5] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] ring-[#027EB5]/40 transition hover:bg-[#F5FBFF] hover:ring-1"
              >
                {b}
              </motion.button>
            ) : (
              <span key={b} className="rounded-lg bg-white py-1.5 text-center text-[13px] font-medium text-[#027EB5] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]">
                {b}
              </span>
            ),
          )}
        </div>
      )}
    </motion.div>
  )
}

function Typing() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex w-fit gap-1 rounded-lg rounded-tl-none bg-white px-3 py-2.5 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]"
      aria-hidden="true"
    >
      {[0, 1, 2].map((d) => (
        <motion.span
          key={d}
          className="size-1.5 rounded-full bg-[#8696A0]"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: d * 0.18 }}
        />
      ))}
    </motion.div>
  )
}

export function Phone({
  name,
  initials,
  color = '#0B7A5A',
  script,
  active = true,
  loop = true,
  onDone,
  className = '',
  label,
}: {
  name: string
  initials: string
  color?: string
  script: Msg[]
  active?: boolean
  loop?: boolean
  onDone?: () => void
  className?: string
  label: string
}) {
  const { visible, typing } = useChatPlayer(script, { active, loop, onDone })
  return <PhoneFrame {...{ name, initials, color, className, label, visible, typing }} />
}

export function PhoneFrame({
  name, initials, color = '#0B7A5A', className = '', label, visible, typing, onPick, overlay, interactive = false,
}: {
  name: string; initials: string; color?: string; className?: string; label: string; visible: Msg[]; typing: boolean
  onPick?: (b: string) => void; overlay?: ReactNode; interactive?: boolean
}) {
  const t = useCopy({ en: { biz: 'Business account', typing: 'typing…', msg: 'Message' }, tr: { biz: 'İşletme hesabı', typing: 'yazıyor…', msg: 'Mesaj' } })
  const lastIdx = visible.length - 1
  return (
    <div role={interactive ? 'group' : 'img'} aria-label={label} className={`relative w-[300px] shrink-0 rounded-[46px] bg-ink p-[9px] shadow-[0_40px_80px_-30px_rgba(11,11,12,0.45)] ${className}`}>
      <div className="relative overflow-hidden rounded-[38px] bg-wa-bg">
        {overlay}
        <div className="flex items-center gap-2.5 bg-[#F0F2F5] px-3 pt-7 pb-2.5">
          <svg aria-hidden="true" width="10" height="16" viewBox="0 0 10 16"><path d="M8 2L2 8l6 6" fill="none" stroke="#54656F" strokeWidth="2" strokeLinecap="round" /></svg>
          <div className="grid size-8 place-items-center rounded-full text-[12px] font-semibold text-white" style={{ background: color }}>
            {initials}
          </div>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-[14px] font-medium text-[#111B21]">{name}</span>
            <span className="text-[11px] text-[#667781]">{typing ? t.typing : t.biz}</span>
          </div>
        </div>
        <div
          className="flex h-[440px] flex-col justify-end gap-1.5 overflow-hidden px-2.5 py-3"
          style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.035) 1px, transparent 1px)', backgroundSize: '14px 14px' }}
        >
          <AnimatePresence initial={false}>
            {visible.map((m, i) => <Bubble key={`${name}-${i}`} m={m} onPick={i === lastIdx && !typing ? onPick : undefined} />)}
            {typing && <Typing key="typing" />}
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-2 bg-[#F0F2F5] px-2.5 pt-2 pb-5">
          <div className="flex-1 rounded-full bg-white px-3.5 py-2 text-[13px] text-[#8696A0]">{t.msg}</div>
          <div className="grid size-9 place-items-center rounded-full bg-[#00A884]">
            <svg aria-hidden="true" width="14" height="18" viewBox="0 0 14 18"><rect x="4" y="1" width="6" height="10" rx="3" fill="#fff" /><path d="M1.5 8.5a5.5 5.5 0 0 0 11 0M7 14v3" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </div>
        </div>
      </div>
    </div>
  )
}

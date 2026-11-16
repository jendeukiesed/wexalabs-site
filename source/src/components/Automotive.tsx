import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { PhoneFrame, useChatPlayer, type Msg } from './Phone'
import { Arrow, Button, Reveal, SectionLabel, Spotlight, WaIcon, Words } from './ui'
import { useCopy, useLang } from '../i18n'

type Car = { name: string; year: number; km: string; fuel: string; gear: string; price: string; tint: string; body: 'suv' | 'hatch' | 'sedan' }

// Demo inventory for the mockup only
const cars: Car[] = [
  { name: 'Toyota C-HR', year: 2019, km: '68,000 km', fuel: 'Hybrid', gear: 'Auto', price: '£14,950', tint: '#D9DDE3', body: 'suv' },
  { name: 'Honda Fit', year: 2018, km: '54,000 km', fuel: 'Petrol', gear: 'Auto', price: '£8,750', tint: '#E6DED3', body: 'hatch' },
  { name: 'Mercedes C200', year: 2017, km: '81,000 km', fuel: 'Petrol', gear: 'Auto', price: '£18,500', tint: '#D5D8D2', body: 'sedan' },
  { name: 'Nissan Note', year: 2020, km: '39,000 km', fuel: 'e-Power', gear: 'Auto', price: '£9,900', tint: '#DCE3E6', body: 'hatch' },
  { name: 'Mazda CX-5', year: 2018, km: '72,000 km', fuel: 'Diesel', gear: 'Auto', price: '£16,250', tint: '#E3DCDC', body: 'suv' },
  { name: 'BMW 320i', year: 2016, km: '96,000 km', fuel: 'Petrol', gear: 'Auto', price: '£13,400', tint: '#D8DCE0', body: 'sedan' },
]

function CarShape({ body }: { body: Car['body'] }) {
  const v = {
    sedan: { b: 'M10 74 Q10 64 22 62 L52 58 L74 44 Q80 40 90 40 L124 40 Q134 40 142 48 L154 58 L180 62 Q190 64 190 72 L190 80 L10 80 Z', w: 'M82 46 L122 46 Q130 46 135 51 L141 58 L70 58 Z', r: [50, 152] },
    suv: { b: 'M12 72 Q12 60 24 58 L42 56 L58 38 Q63 33 72 33 L140 33 Q150 33 156 42 L166 56 L182 59 Q190 61 190 70 L190 80 L12 80 Z', w: 'M66 40 L139 40 Q146 40 150 46 L156 55 L53 55 Z', r: [50, 154] },
    hatch: { b: 'M18 72 Q18 62 30 60 L52 57 L70 40 Q75 36 84 36 L142 36 Q152 36 158 44 L170 62 Q180 66 180 74 L180 80 L18 80 Z', w: 'M76 42 L140 42 Q148 42 152 48 L158 57 L62 57 Z', r: [52, 148] },
  }[body]
  return (
    <svg viewBox="0 0 200 100" className="h-full w-full" aria-hidden="true">
      <ellipse cx="100" cy="86" rx="86" ry="5" fill="rgba(0,0,0,0.12)" />
      <path d={v.b} fill="#2B2E33" />
      <path d={v.w} fill="#A9BACB" opacity="0.8" />
      {v.r.map((x) => (
        <g key={x}><circle cx={x} cy="80" r="12" fill="#17181B" /><circle cx={x} cy="80" r="5.5" fill="#8A8F96" /></g>
      ))}
    </svg>
  )
}

function CarCard({ car, highlight, ask }: { car: Car; highlight: boolean; ask: string }) {
  return (
    <motion.div
      animate={{ y: highlight ? -4 : 0, boxShadow: highlight ? '0 16px 30px -18px rgba(0,0,0,0.45)' : '0 0 0 rgba(0,0,0,0)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className={`overflow-hidden rounded-xl border bg-white ${highlight ? 'border-ink' : 'border-[#E8E8E4]'}`}
    >
      <div className="h-[78px] px-3 pt-2" style={{ background: car.tint }}>
        <CarShape body={car.body} />
      </div>
      <div className="p-2.5">
        <p className="text-[12px] font-semibold text-ink">{car.year} {car.name}</p>
        <p className="mt-0.5 text-[10.5px] text-muted">{car.km} · {car.fuel} · {car.gear}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[13px] font-semibold text-ink">{car.price}</span>
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium ${highlight ? 'bg-[#00A884] text-white' : 'bg-[#EEF7F3] text-[#0B7A5A]'}`}>
            <WaIcon className="size-3" /> {ask}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

const carChip = (ref: string) => (
  <span className="mb-1.5 flex items-center gap-2 rounded-md bg-black/5 p-1.5">
    <span className="h-9 w-12 shrink-0 rounded" style={{ background: '#D9DDE3' }}><CarShape body="suv" /></span>
    <span className="text-[11.5px] leading-tight"><b className="font-semibold">2019 Toyota C-HR</b><br /><span className="text-[#667781]">{ref} W-1024 · £14,950</span></span>
  </span>
)

const copy = {
  en: {
    label: 'Automotive Digital Sales',
    h2a: 'Your own website,', h2b: 'built to sell every car on your lot.',
    sub: 'For car dealerships in North Cyprus. We build your dealership a fast, branded website, promote your cars with Reels and ads, and route every interested buyer straight into WhatsApp.',
    handle: '@yourdealership', reelCta: 'Ask on WhatsApp', ago: 'Sponsored · Gazimağusa',
    dealer: 'Your Dealership', city: 'Gazimağusa', stock: 'In stock now', ask: 'Ask', heroLine: 'Find your next car in Gazimağusa', search: 'Search make, model or type', results: 'results', nav: ['Cars', 'Finance', 'About', 'Contact'],
    filters: ['All', 'SUV', 'Hatchback', 'Sedan', 'Hybrid'],
    stages: [
      ['Your dealership website', 'Your brand, your full stock, clean photos, specs and prices. Buyers search and filter on any phone, and find you on Google.'],
      ['Reels & ads that bring buyers', 'Short vertical videos of every car, posted on a schedule and boosted with ads. Each one ends with “Ask on WhatsApp”.'],
      ['Straight into WhatsApp', 'One tap opens a chat with the car already attached. The viewing is booked in minutes.'],
    ],
    feats: [
      ['Branded website', 'Your logo, your colours, your stock. Fast on every phone and easy for you to update.'],
      ['Content every week', 'Reels, TikTok videos and ads on a steady schedule, so your stock keeps reaching new buyers.'],
      ['Lead tracking', 'See which car every enquiry is about, and never lose a buyer in your chat history.'],
      ['Live in 7 days', 'Website, WhatsApp flow and first videos ready within a week.'],
    ],
    cta: 'Get a free audit for your dealership',
    labels: { reel: 'Demo: a short vehicle video ending with an Ask on WhatsApp button', catalog: 'Demo: a dealership website where a buyer searches for an SUV and the stock filters instantly', chat: 'Demo: a buyer asks about a listed car and books a viewing over WhatsApp' },
    script: [
      { from: 'customer', time: '20:14', card: carChip('Ref'), text: 'Hi, is this car still available?' },
      { from: 'business', text: 'Hi! Yes, the 2019 C-HR is available. Would you like to see it in person?', buttons: ['Book a viewing', 'More photos'], time: '20:14' },
      { from: 'customer', text: 'Book a viewing', time: '20:15' },
      { from: 'business', text: 'Great. Is tomorrow at 11:00 or 16:00 better for you?', buttons: ['11:00', '16:00'], time: '20:15' },
      { from: 'customer', text: '11:00', time: '20:15' },
      { from: 'business', text: 'Booked: tomorrow 11:00. We’ll send you the location. See you at the showroom!', time: '20:15' },
    ] as Msg[],
  },
  tr: {
    label: 'Otomotiv Dijital Satış',
    h2a: 'Galerinize özel web sitesi,', h2b: 'stoktaki her aracı satmak için.',
    sub: 'KKTC’deki oto galeriler için. Galerinize özel hızlı bir web sitesi kuruyor, araçlarınızı Reels ve reklamlarla tanıtıyor, ilgilenen her alıcıyı doğrudan WhatsApp’a yönlendiriyoruz.',
    handle: '@galeriniz', reelCta: 'WhatsApp’tan sor', ago: 'Sponsorlu · Gazimağusa',
    dealer: 'Galeriniz', city: 'Gazimağusa', stock: 'Stoktaki araçlar', ask: 'Sor', heroLine: 'Gazimağusa’da bir sonraki aracınızı bulun', search: 'Marka, model veya tip arayın', results: 'sonuç', nav: ['Araçlar', 'Finansman', 'Hakkımızda', 'İletişim'],
    filters: ['Tümü', 'SUV', 'Hatchback', 'Sedan', 'Hibrit'],
    stages: [
      ['Galerinize özel web sitesi', 'Sizin markanız, tüm stoğunuz; temiz fotoğraf, bilgiler ve fiyatlar. Alıcılar her telefonda arar, filtreler ve sizi Google’da bulur.'],
      ['Alıcı getiren Reels ve reklam', 'Her araç için düzenli yayınlanan, reklamla desteklenen kısa dikey videolar. Her biri “WhatsApp’tan sor” ile biter.'],
      ['Doğrudan WhatsApp’a', 'Tek dokunuşla araç bilgisi ekli bir sohbet açılır. Görme randevusu dakikalar içinde alınır.'],
    ],
    feats: [
      ['Markanıza özel site', 'Logonuz, renkleriniz, stoğunuz. Her telefonda hızlı, sizin için güncellemesi kolay.'],
      ['Her hafta içerik', 'Düzenli Reels, TikTok videoları ve reklamlar; stoğunuz sürekli yeni alıcılara ulaşır.'],
      ['Talep takibi', 'Her sorunun hangi araç için geldiğini görün, hiçbir alıcı sohbet geçmişinde kaybolmasın.'],
      ['7 günde yayında', 'Web sitesi, WhatsApp akışı ve ilk videolar bir hafta içinde hazır.'],
    ],
    cta: 'Galeriniz için ücretsiz analiz alın',
    labels: { reel: 'Demo: WhatsApp’tan sor butonuyla biten kısa araç videosu', catalog: 'Demo: alıcının SUV aradığı ve stoğun anında filtrelendiği bir galeri web sitesi', chat: 'Demo: bir alıcı ilandaki aracı sorup WhatsApp’tan görme randevusu alıyor' },
    script: [
      { from: 'customer', time: '20:14', card: carChip('Ref'), text: 'Merhaba, bu araç hâlâ satılık mı?' },
      { from: 'business', text: 'Merhaba! Evet, 2019 C-HR satılık. Gelip görmek ister misiniz?', buttons: ['Randevu al', 'Daha fazla foto'], time: '20:14' },
      { from: 'customer', text: 'Randevu al', time: '20:15' },
      { from: 'business', text: 'Harika. Yarın 11:00 mi 16:00 mı daha uygun?', buttons: ['11:00', '16:00'], time: '20:15' },
      { from: 'customer', text: '11:00', time: '20:15' },
      { from: 'business', text: 'Randevunuz alındı: yarın 11:00. Konumu gönderiyoruz. Galeride görüşmek üzere!', time: '20:15' },
    ] as Msg[],
  },
}

function useIsDesktop() {
  const q = '(min-width: 1024px) and (min-height: 700px)'
  const [d, setD] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q)
    const on = () => setD(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return d
}

function useCycle(n: number, ms: number, active: boolean) {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (!active || reduce) return
    const t = setInterval(() => setI((x) => (x + 1) % n), ms)
    return () => clearInterval(t)
  }, [n, ms, active, reduce])
  return i
}

const reelCars = [cars[0], cars[2], cars[4]]

function Reel({ active }: { active: boolean }) {
  const t = useCopy(copy)
  const i = useCycle(reelCars.length, 2800, active)
  const car = reelCars[i]
  return (
    <div role="img" aria-label={t.labels.reel} className="w-[232px] shrink-0 rounded-[40px] bg-[#1C1C1F] p-[8px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
      <div className="relative h-[452px] overflow-hidden rounded-[33px] bg-[#111214]">
        <AnimatePresence initial={false}>
          <motion.div
            key={i}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ background: `radial-gradient(120% 70% at 50% 45%, ${car.tint} 0%, #3A3D42 55%, #121316 100%)` }}
          >
            <motion.div
              className="absolute top-[150px] left-[-30px] w-[290px]"
              initial={{ scale: 1.05, x: 18 }}
              animate={active ? { scale: 1.22, x: -18 } : {}}
              transition={{ duration: 2.8, ease: 'linear' }}
            >
              <CarShape body={car.body} />
            </motion.div>
          </motion.div>
        </AnimatePresence>
        {/* progress segments */}
        <div className="absolute top-3 right-3 left-3 flex gap-1" aria-hidden="true">
          {reelCars.map((_, k) => (
            <span key={k} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
              {k < i && <span className="block h-full w-full bg-white" />}
              {k === i && <motion.span key={`p${i}`} className="block h-full bg-white" initial={{ width: '0%' }} animate={{ width: active ? '100%' : '0%' }} transition={{ duration: 2.8, ease: 'linear' }} />}
            </span>
          ))}
        </div>
        <div className="absolute top-7 left-3 flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-full bg-white text-[10px] font-bold text-ink">YD</span>
          <span className="leading-tight">
            <span className="block text-[12px] font-semibold text-white">{t.handle}</span>
            <span className="block text-[10px] text-white/70">{t.ago}</span>
          </span>
        </div>
        {/* side actions */}
        <div className="absolute right-3 bottom-[118px] flex flex-col gap-4 text-white" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" strokeLinejoin="round" /></svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12z" strokeLinejoin="round" /></svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 3L10 14M21 3l-7 18-4-7-7-4 18-7z" strokeLinejoin="round" /></svg>
        </div>
        {/* caption */}
        <div className="absolute right-3 bottom-3 left-3 flex flex-col gap-2">
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35 }}>
              <p className="text-[15px] font-semibold text-white">{car.year} {car.name}</p>
              <p className="text-[11.5px] text-white/75">{car.km} · {car.fuel} · <span className="font-semibold text-white">{car.price}</span></p>
            </motion.div>
          </AnimatePresence>
          <motion.span
            animate={active ? { scale: [1, 1.04, 1] } : { scale: 1 }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] py-2.5 text-[13px] font-semibold text-[#06231A]"
          >
            <WaIcon className="size-4" /> {t.reelCta}
          </motion.span>
        </div>
      </div>
    </div>
  )
}

const kind = (c: Car) => c.body

function Website({ active }: { active: boolean }) {
  const t = useCopy(copy)
  const reduce = useReducedMotion()
  const [typed, setTyped] = useState('')
  const [hi, setHi] = useState(-1)
  useEffect(() => {
    if (!active || reduce) { setTyped(''); setHi(-1); return }
    const timers: number[] = []
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms))
    const run = () => {
      setTyped(''); setHi(-1)
      'SUV'.split('').forEach((_, k) => at(900 + k * 220, () => setTyped('SUV'.slice(0, k + 1))))
      at(2000, () => setHi(0))
      at(3100, () => setHi(1))
      at(5200, run)
    }
    run()
    return () => timers.forEach(clearTimeout)
  }, [active, reduce])
  const shown = typed === 'SUV' ? cars.filter((c) => kind(c) === 'suv') : cars
  return (
    <div role="img" aria-label={t.labels.catalog} className="w-[560px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-paper text-ink shadow-[0_40px_100px_-40px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-3 border-b border-line bg-white px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#E4E4DF]" /><span className="size-2.5 rounded-full bg-[#E4E4DF]" /><span className="size-2.5 rounded-full bg-[#E4E4DF]" />
        </div>
        <div className="mx-auto flex w-full max-w-[260px] items-center justify-center gap-1.5 rounded-md bg-paper px-3 py-1 text-[11.5px] text-muted">
          <svg aria-hidden="true" width="9" height="11" viewBox="0 0 9 11"><rect x="0.5" y="4.5" width="8" height="6" rx="1.5" fill="currentColor" /><path d="M2.5 4.5V3a2 2 0 0 1 4 0v1.5" fill="none" stroke="currentColor" /></svg>
          yourdealership.com
        </div>
      </div>
      {/* site header */}
      <div className="flex items-center justify-between bg-white px-5 py-3">
        <span className="flex items-center gap-2 text-[13px] font-semibold"><span className="grid size-6 place-items-center rounded-md bg-ink text-[9px] font-bold text-white">YD</span>{t.dealer}</span>
        <span className="flex gap-4 text-[11px] text-muted">{t.nav.map((n) => <span key={n}>{n}</span>)}</span>
      </div>
      {/* hero band */}
      <div className="relative overflow-hidden bg-ink px-5 py-5 text-white">
        <motion.div
          aria-hidden="true"
          className="absolute -right-6 bottom-[-18px] w-[230px] opacity-90"
          animate={active && !reduce ? { x: [30, 0], opacity: [0, 0.9] } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="[&_path:first-of-type]:fill-[#4A4E55]"><CarShape body="sedan" /></div>
        </motion.div>
        <p className="relative max-w-[260px] text-[19px] leading-tight font-semibold tracking-tight">{t.heroLine}</p>
        <div className="relative mt-3 flex w-[300px] items-center gap-2 rounded-lg bg-white px-3 py-2 text-[12px] text-ink">
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12"><circle cx="5" cy="5" r="3.8" fill="none" stroke="#5C6066" strokeWidth="1.4" /><path d="M8 8l3 3" stroke="#5C6066" strokeWidth="1.4" strokeLinecap="round" /></svg>
          {typed ? <span className="font-medium">{typed}</span> : <span className="text-muted">{t.search}</span>}
          {active && !reduce && typed.length < 3 && <motion.span className="h-3.5 w-px bg-ink" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.9, repeat: Infinity }} />}
          <span className="ml-auto text-[11px] text-muted">{shown.length} {t.results}</span>
        </div>
      </div>
      {/* stock grid */}
      <div className="h-[316px] p-4">
        <motion.div layout className="grid grid-cols-3 gap-2.5">
          <AnimatePresence mode="popLayout">
            {shown.map((c, i) => (
              <motion.div
                key={c.name}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0, transition: { delay: active ? i * 0.06 : 0, type: 'spring', stiffness: 260, damping: 24 } }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              >
                <CarCard car={c} highlight={active && i === hi} ask={t.ask} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

function Chat({ active }: { active: boolean }) {
  const t = useCopy(copy)
  const { visible, typing } = useChatPlayer(t.script, { active, loop: true })
  return (
    <PhoneFrame
      name={t.dealer}
      initials="YD"
      color="#0B0B0C"
      visible={active ? visible : t.script.slice(0, 1)}
      typing={active && typing}
      label={t.labels.chat}
    />
  )
}

function Header({ compact = false }: { compact?: boolean }) {
  const t = useCopy(copy)
  return (
    <div className="flex max-w-[640px] flex-col gap-4">
      <SectionLabel n="01" dark>{t.label}</SectionLabel>
      <Words className={`leading-[1.04] font-semibold tracking-[-0.03em] ${compact ? 'text-[40px]' : 'text-[34px] sm:text-[46px]'}`} parts={[{ text: t.h2a }, { text: t.h2b, className: 'text-white/50' }]} />
      <p className={`leading-relaxed text-white/65 ${compact ? 'text-[15px] [@media(max-height:820px)]:hidden' : 'text-[16px] sm:text-[17px]'}`}>{t.sub}</p>
    </div>
  )
}

function Features() {
  const t = useCopy(copy)
  return (
    <div className="mx-auto max-w-[1200px] px-6 pb-28">
      <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
        {t.feats.map(([a, d], i) => (
          <Reveal key={a} delay={i * 0.06} className="bg-ink">
            <Spotlight dark className="h-full p-6">
              <p className="text-[15px] font-semibold">{a}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-white/60">{d}</p>
            </Spotlight>
          </Reveal>
        ))}
      </div>
      <div className="mt-10 flex justify-center">
        <Button variant="light" href="#contact">{t.cta} <Arrow /></Button>
      </div>
    </div>
  )
}

function StageTabs({ stage }: { stage: number }) {
  const t = useCopy(copy)
  return (
    <ol className="flex w-full max-w-[420px] flex-col">
      {t.stages.map(([title, body], i) => {
        const on = i === stage
        return (
          <li key={title} className="relative border-t border-white/12 py-3.5">
            <motion.span className="absolute top-[-1px] left-0 h-px bg-white" initial={false} animate={{ width: i < stage ? '100%' : on ? '100%' : '0%' }} transition={{ duration: on ? 0.6 : 0.2 }} />
            <div className="flex items-baseline gap-3">
              <span className={`font-mono text-[12px] ${on ? 'text-[#25D366]' : 'text-white/40'}`}>0{i + 1}</span>
              <span className={`text-[17px] font-semibold transition-colors ${on ? 'text-white' : 'text-white/40'}`}>{title}</span>
            </div>
            <motion.p
              initial={false}
              animate={{ height: on ? 'auto' : 0, opacity: on ? 1 : 0 }}
              transition={{ duration: 0.35 }}
              className="overflow-hidden pl-8 text-[14px] leading-relaxed text-white/60"
            >
              <span className="block pt-1.5">{body}</span>
            </motion.p>
          </li>
        )
      })}
    </ol>
  )
}

function Dim({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <motion.div initial={false} animate={{ opacity: on ? 1 : 0.32, scale: on ? 1 : 0.95, filter: on ? 'blur(0px)' : 'blur(1px)' }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

const ROW_H = 520

function PinnedStory() {
  const ref = useRef<HTMLDivElement>(null)
  const [stage, setStage] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => setStage(Math.min(2, Math.floor(v * 3 * 0.999))))
  // scale the device row to whatever height is left under the header
  const rowBox = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState(1)
  useEffect(() => {
    const calc = () => {
      const el = rowBox.current
      if (!el) return
      const free = window.innerHeight - el.getBoundingClientRect().top + (ref.current ? 0 : 0)
      const sticky = el.closest('[data-sticky]') as HTMLElement | null
      const box = sticky?.getBoundingClientRect()
      const avail = box ? box.bottom - el.getBoundingClientRect().top - 28 : free - 28
      setFit(Math.max(0.6, Math.min(1, avail / ROW_H, (window.innerWidth - 48) / 1220)))
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])
  return (
    <div ref={ref} className="relative h-[330vh]">
      <div data-sticky className="sticky top-16 flex h-[calc(100svh-4rem)] flex-col justify-start overflow-hidden pt-8">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-6">
          <div className="flex items-end justify-between gap-10">
            <Header compact />
            <StageTabs stage={stage} />
          </div>
          <div ref={rowBox} style={{ height: ROW_H * fit }} className="relative">
            <div className="absolute top-0 left-1/2 flex w-[1220px] items-center justify-between gap-6" style={{ height: ROW_H, transform: `translateX(-50%) scale(${fit})`, transformOrigin: 'top center' }}>
              <Dim on={stage === 0}><Website active={stage === 0} /></Dim>
              <svg aria-hidden="true" width="40" height="12" viewBox="0 0 40 12" className="shrink-0 text-white/30"><path d="M0 6h36M31 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
              <Dim on={stage === 1}><Reel active={stage === 1} /></Dim>
              <svg aria-hidden="true" width="40" height="12" viewBox="0 0 40 12" className="shrink-0 text-white/30"><path d="M0 6h36M31 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
              <Dim on={stage === 2}><div className="h-[500px] w-[252px]"><div className="w-[300px] origin-top-left scale-[0.84]"><Chat active={stage === 2} /></div></div></Dim>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FitWidth({ w, h, children }: { w: number; h: number; children: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null)
  const [k, setK] = useState(1)
  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(() => setK(Math.min(1, el.clientWidth / w)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [w])
  return (
    <div ref={box} className="w-full" style={{ height: h * k }}>
      <div className="origin-top-left" style={{ width: w, transform: `scale(${k})` }}>{children}</div>
    </div>
  )
}

function StackedStory() {
  const t = useCopy(copy)
  const blocks = [<FitWidth key="c" w={560} h={520}><Website active /></FitWidth>, <Reel key="r" active />, <Chat key="w" active />]
  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-16 px-6 py-24">
      <Header />
      {t.stages.map(([title, body], i) => (
        <Reveal key={title} className="flex flex-col items-center gap-6">
          <div className="w-full">
            <p className="font-mono text-[12px] text-[#25D366]">0{i + 1}</p>
            <p className="mt-1 text-[22px] font-semibold">{title}</p>
            <p className="mt-1 text-[15px] leading-relaxed text-white/60">{body}</p>
          </div>
          {blocks[i]}
        </Reveal>
      ))}
    </div>
  )
}

export function AutomotiveSection() {
  const desktop = useIsDesktop()
  const { lang } = useLang()
  return (
    <section id="automotive" className="scroll-mt-16 bg-ink text-white" key={lang}>
      {desktop ? <PinnedStory /> : <StackedStory />}
      <Features />
    </section>
  )
}

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { PhoneFrame, type Msg } from './Phone'
import { Arrow, Button, WaIcon, Words } from './ui'
import { SITE, waLink } from '../config'
import { LangToggle, useCopy } from '../i18n'

const copy = {
  en: {
    nav: ['How it works', 'Car dealerships', 'WhatsApp Automation', 'Try it', 'FAQ'],
    dealerQ: 'Run a car dealership?', dealerA: 'See your own dealership website, Reels and WhatsApp sales',
    navCta: 'Free audit',
    eyebrow: 'WexaLabs · WhatsApp Automation & Digital Sales Systems',
    h1a: 'Every customer answered.',
    h1b: 'Every lead captured.',
    sub: 'We help businesses automate customer conversations and turn digital interactions into sales.',
    cta1: 'Get a free WhatsApp audit',
    cta2: 'Chat on WhatsApp',
    waHello: 'Hi WexaLabs, I would like to learn more.',
    based: `Based in ${SITE.city}. Live in 7 days.`,
    scroll: 'Scroll to watch one conversation',
    steps: [
      ['21:47', 'A customer writes after closing.', 'Your staff has gone home. Normally this message waits until morning, or the customer books somewhere else.'],
      ['21:47 · 3 seconds later', 'The assistant replies instantly.', 'It knows your hours, services and free slots, and offers real options with one-tap buttons.'],
      ['21:48', 'The customer picks a time and a service.', 'No back-and-forth. Every answer moves the customer one step closer to a booking.'],
      ['21:48', 'Booked. Nobody lifted a finger.', 'The appointment lands in your calendar, and the customer’s name and number are saved.'],
      ['Next day · 13:30', 'A reminder goes out on its own.', 'Fewer no-shows. Your team only steps in when a person is really needed.'],
    ],
    inbox: 'Your WexaLabs inbox',
    rows: [['New booking', 'Haircut · Tomorrow 15:30'], ['Lead saved', 'Name + WhatsApp number'], ['Reminder', 'Tomorrow 13:30']],
    status: { confirmed: 'Confirmed', saved: 'Saved', scheduled: 'Scheduled', sent: 'Sent' },
    phoneLabel: 'Demo: a customer books a haircut over WhatsApp after closing time and gets an instant automated confirmation',
    script: [
      { from: 'customer', text: 'Hi, do you have anything tomorrow afternoon?', time: '21:47' },
      { from: 'business', text: 'Hi! Tomorrow we have three free slots. Which one suits you?', buttons: ['14:00', '15:30', '17:00'], time: '21:47' },
      { from: 'customer', text: '15:30', time: '21:48' },
      { from: 'business', text: 'Great, 15:30 is yours. Which service?', buttons: ['Haircut', 'Colour', 'Blow-dry'], time: '21:48' },
      { from: 'customer', text: 'Haircut', time: '21:48' },
      { from: 'business', text: 'Confirmed: Haircut, tomorrow at 15:30. See you then!', time: '21:48' },
      { from: 'business', text: 'Reminder: your haircut is today at 15:30. Reply 1 to confirm, 2 to reschedule.', time: '13:30' },
    ] as Msg[],
  },
  tr: {
    nav: ['Nasıl çalışır', 'Oto galeriler', 'WhatsApp Otomasyonu', 'Dene', 'SSS'],
    dealerQ: 'Oto galeriniz mi var?', dealerA: 'Galerinize özel web sitesi, Reels ve WhatsApp satışı',
    navCta: 'Ücretsiz analiz',
    eyebrow: 'WexaLabs · WhatsApp Otomasyonu ve Dijital Satış Sistemleri',
    h1a: 'Her müşteriye cevap.',
    h1b: 'Her talep kayıt altında.',
    sub: 'İşletmelerin müşteri konuşmalarını otomatikleştiriyor, dijital etkileşimleri satışa dönüştürüyoruz.',
    cta1: 'Ücretsiz WhatsApp analizi al',
    cta2: 'WhatsApp’tan yaz',
    waHello: 'Merhaba WexaLabs, daha fazla bilgi almak istiyorum.',
    based: `${SITE.city.replace('North Cyprus', 'KKTC')} merkezli. 7 günde yayında.`,
    scroll: 'Bir konuşmayı izlemek için kaydır',
    steps: [
      ['21:47', 'Müşteri kapanıştan sonra yazıyor.', 'Personel evde. Normalde bu mesaj sabaha kadar bekler ya da müşteri başka yere gider.'],
      ['21:47 · 3 saniye sonra', 'Asistan anında cevap veriyor.', 'Çalışma saatlerinizi, hizmetlerinizi ve boş saatlerinizi bilir; tek dokunuşla seçilen butonlar sunar.'],
      ['21:48', 'Müşteri saati ve hizmeti seçiyor.', 'Gidip gelen mesaj yok. Her cevap müşteriyi randevuya bir adım daha yaklaştırır.'],
      ['21:48', 'Randevu alındı. Kimse parmağını kıpırdatmadı.', 'Randevu takviminize düşer, müşterinin adı ve numarası kaydedilir.'],
      ['Ertesi gün · 13:30', 'Hatırlatma kendiliğinden gidiyor.', 'Daha az gelmeyen müşteri. Ekibiniz sadece gerçekten bir insan gerektiğinde devreye girer.'],
    ],
    inbox: 'WexaLabs gelen kutunuz',
    rows: [['Yeni randevu', 'Saç kesimi · Yarın 15:30'], ['Müşteri kaydedildi', 'İsim + WhatsApp numarası'], ['Hatırlatma', 'Yarın 13:30']],
    status: { confirmed: 'Onaylandı', saved: 'Kaydedildi', scheduled: 'Planlandı', sent: 'Gönderildi' },
    phoneLabel: 'Demo: bir müşteri kapanış saatinden sonra WhatsApp’tan saç kesimi randevusu alıyor ve anında otomatik onay alıyor',
    script: [
      { from: 'customer', text: 'Merhaba, yarın öğleden sonra boş yeriniz var mı?', time: '21:47' },
      { from: 'business', text: 'Merhaba! Yarın üç boş saatimiz var. Hangisi size uyar?', buttons: ['14:00', '15:30', '17:00'], time: '21:47' },
      { from: 'customer', text: '15:30', time: '21:48' },
      { from: 'business', text: 'Harika, 15:30 sizin. Hangi hizmet?', buttons: ['Saç kesimi', 'Boya', 'Fön'], time: '21:48' },
      { from: 'customer', text: 'Saç kesimi', time: '21:48' },
      { from: 'business', text: 'Onaylandı: Saç kesimi, yarın 15:30. Görüşmek üzere!', time: '21:48' },
      { from: 'business', text: 'Hatırlatma: saç kesiminiz bugün 15:30’da. Onay için 1, değiştirmek için 2 yazın.', time: '13:30' },
    ] as Msg[],
  },
}

// how many messages are visible at each scroll step (step 0 = hero)
const COUNT_AT = [1, 1, 2, 4, 6, 7]
const STEPS = COUNT_AT.length

export function Nav() {
  const t = useCopy(copy)
  const ids = ['story', 'automotive', 'whatsapp', 'try', 'faq']
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-5 sm:px-6">
        <a href="#top" className="flex items-center gap-2 text-[17px] font-semibold tracking-tight">
          <svg aria-hidden="true" viewBox="0 0 32 32" className="size-7"><rect width="32" height="32" rx="8" fill="#0B0B0C" /><path d="M7 10l3.2 12L13.6 13l2.4 9 2.4-9 3.4 9L25 10" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          WexaLabs
        </a>
        <nav aria-label="Main" className="hidden items-center gap-7 text-[14px] text-muted lg:flex">
          {t.nav.map((n, i) => <a key={n} href={`#${ids[i]}`} className="hover:text-ink">{n}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <LangToggle />
          <a href="#contact" className="hidden min-h-10 items-center rounded-full bg-ink px-4 text-[14px] font-medium text-white hover:bg-[#2A2A2D] sm:inline-flex">
            {t.navCta}
          </a>
        </div>
      </div>
    </header>
  )
}

/** Reveal messages up to `target`, showing a typing indicator before each business reply. */
function useScrollChat(script: Msg[], target: number) {
  const [shown, setShown] = useState(target)
  const [typing, setTyping] = useState(false)
  const shownRef = useRef(shown)
  shownRef.current = shown
  useEffect(() => {
    let cancelled = false
    const timers: number[] = []
    if (target <= shownRef.current) { setTyping(false); setShown(target); return }
    const advance = () => {
      if (cancelled) return
      const n = shownRef.current
      if (n >= target) { setTyping(false); return }
      if (script[n].from === 'business') {
        setTyping(true)
        timers.push(window.setTimeout(() => { if (cancelled) return; setTyping(false); shownRef.current = n + 1; setShown(n + 1); timers.push(window.setTimeout(advance, 120)) }, 550))
      } else {
        shownRef.current = n + 1; setShown(n + 1)
        timers.push(window.setTimeout(advance, 250))
      }
    }
    advance()
    return () => { cancelled = true; timers.forEach(clearTimeout) }
  }, [target, script])
  return { visible: script.slice(0, shown), typing }
}

function Inbox({ step }: { step: number }) {
  const t = useCopy(copy)
  const status = [
    step >= 4 ? t.status.confirmed : null,
    step >= 4 ? t.status.saved : null,
    step >= 5 ? t.status.sent : step >= 4 ? t.status.scheduled : null,
  ]
  return (
    <motion.div
      initial={false}
      animate={{ opacity: step >= 4 ? 1 : 0.35, y: step >= 4 ? 0 : 12 }}
      transition={{ type: 'spring', stiffness: 200, damping: 26 }}
      className="w-[290px] rounded-2xl border border-line bg-white p-4 shadow-[0_24px_60px_-30px_rgba(11,11,12,0.35)]"
    >
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold">{t.inbox}</p>
        <span className="flex items-center gap-1.5 text-[11px] text-muted">
          <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-[#25D366] opacity-60" /><span className="relative inline-flex size-2 rounded-full bg-[#25D366]" /></span>
          Live
        </span>
      </div>
      <div className="mt-3 flex flex-col">
        {t.rows.map(([title, sub], i) => (
          <div key={title} className="flex items-center justify-between gap-3 border-t border-line py-2.5">
            <div className="min-w-0">
              <p className="text-[13px] font-medium">{title}</p>
              <p className="truncate text-[12px] text-muted">{sub}</p>
            </div>
            <AnimatePresence mode="wait">
              {status[i] ? (
                <motion.span
                  key={status[i]}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1, transition: { delay: i * 0.15 } }}
                  exit={{ opacity: 0 }}
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${status[i] === t.status.scheduled ? 'bg-[#F1F1EC] text-muted' : 'bg-[#E7F4EF] text-accent'}`}
                >
                  {status[i]}
                </motion.span>
              ) : (
                <motion.span key="empty" className="h-4 w-14 shrink-0 rounded-full bg-[#F1F1EC]" />
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export function ScrollHero() {
  const t = useCopy(copy)
  const ref = useRef<HTMLElement>(null)
  const [step, setStep] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => setStep(Math.min(STEPS - 1, Math.floor(v * STEPS * 0.999))))
  const { visible, typing } = useScrollChat(t.script, COUNT_AT[step])

  return (
    <section ref={ref} id="top" className="relative" style={{ height: `${STEPS * 85}vh` }}>
      <span id="story" className="absolute top-[85vh]" aria-hidden="true" />
      <div className="sticky top-16 flex h-[calc(100svh-4rem)] items-start overflow-hidden pt-6 lg:items-center lg:pt-0">
        <div className="mx-auto grid w-full max-w-[1200px] items-center gap-6 px-5 sm:px-6 lg:grid-cols-[1fr_300px] lg:gap-14 xl:grid-cols-[1fr_300px_290px]">
          {/* Left: hero copy, then the story captions */}
          <div className="relative min-h-[200px] lg:min-h-[420px]">
            <AnimatePresence mode="wait">
              {step === 0 ? (
                <motion.div
                  key="hero"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-5 lg:gap-7"
                >
                  <p className="text-[13px] font-medium text-muted sm:text-[14px]">{t.eyebrow}</p>
                  <Words
                    as="h1"
                    onLoad
                    delay={0.1}
                    className="text-[40px] leading-[1.02] font-semibold tracking-[-0.035em] sm:text-[56px] lg:text-[64px]"
                    parts={[{ text: t.h1a }, { text: t.h1b, className: 'text-muted', br: true }]}
                  />
                  <p className="max-w-[500px] text-[16px] leading-relaxed text-muted sm:text-[18px]">{t.sub}</p>
                  <div className="flex flex-wrap gap-3">
                    <Button href="#contact">{t.cta1} <Arrow /></Button>
                    <Button variant="secondary" href={waLink(t.waHello)}>
                      <WaIcon className="size-[18px] text-[#00A884]" /> {t.cta2}
                    </Button>
                  </div>
                  <a href="#automotive" className="group flex max-w-[460px] items-center gap-3 rounded-2xl border border-line bg-white p-3 pr-4 transition-colors hover:border-ink">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ink text-white">
                      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 15v-3l2.2-4.4A2 2 0 0 1 7 6.5h10a2 2 0 0 1 1.8 1.1L21 12v3a1 1 0 0 1-1 1h-1M5 16H4a1 1 0 0 1-1-1M3 12h18" /><circle cx="7.5" cy="16" r="1.8" /><circle cx="16.5" cy="16" r="1.8" /></svg>
                    </span>
                    <span className="min-w-0 flex-1 leading-tight">
                      <span className="block text-[14px] font-semibold">{t.dealerQ}</span>
                      <span className="block text-[13px] text-muted">{t.dealerA}</span>
                    </span>
                    <Arrow />
                  </a>
                  <p className="hidden text-[13px] text-muted sm:block">{t.based}</p>
                </motion.div>
              ) : (
                <motion.div
                  key={`step-${step}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-3 lg:gap-5"
                >
                  <p className="font-mono text-[13px] text-accent">{t.steps[step - 1][0]}</p>
                  <h2 className="text-[30px] leading-[1.05] font-semibold tracking-[-0.03em] sm:text-[44px] lg:text-[52px]">{t.steps[step - 1][1]}</h2>
                  <p className="max-w-[460px] text-[15px] leading-relaxed text-muted sm:text-[17px]">{t.steps[step - 1][2]}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Center: the phone */}
          <div className="flex h-[430px] justify-center sm:h-[505px] lg:h-auto">
            <div className="origin-top scale-[0.72] sm:scale-[0.85] lg:scale-100">
              <PhoneFrame name="Studio Mira" initials="SM" color="#B4566B" visible={visible} typing={typing} label={t.phoneLabel} />
            </div>
          </div>

          {/* Right: inbox (wide screens) */}
          <div className="hidden xl:block">
            <Inbox step={step} />
          </div>
        </div>

        {/* Progress */}
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3">
          <AnimatePresence>
            {step === 0 && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hidden text-[12px] text-muted sm:inline">
                {t.scroll}
              </motion.span>
            )}
          </AnimatePresence>
          <div className="flex gap-1.5" aria-hidden="true">
            {Array.from({ length: STEPS }).map((_, i) => (
              <motion.span key={i} animate={{ width: i === step ? 22 : 6, backgroundColor: i <= step ? '#0B0B0C' : '#D6D6D0' }} className="h-1.5 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

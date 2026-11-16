import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Arrow, Button, Reveal, SectionLabel, WaIcon, Words } from './ui'
import { SITE, waLink } from '../config'
import { LangToggle, useCopy } from '../i18n'

const processCopy = {
  en: {
    label: 'Process', h2: 'From first call to live system in 7 days.',
    steps: [
      ['Day 1', 'Free audit', 'We message your business like a customer, see how fast you reply, and show you where sales slip through.'],
      ['Days 2–5', 'Build', 'We set up your system around your business: your menu, services, prices or inventory.'],
      ['Days 6–7', 'Launch', 'We test it with you, go live, and show your team how to step into any conversation.'],
      ['Every month', 'Improve', 'We review real conversations, fix what customers struggle with, and keep it sharp.'],
    ],
  },
  tr: {
    label: 'Süreç', h2: 'İlk görüşmeden canlı sisteme 7 gün.',
    steps: [
      ['1. gün', 'Ücretsiz analiz', 'İşletmenize müşteri gibi yazıyor, ne kadar hızlı cevap verdiğinize bakıyor ve satışın nerede kaçtığını gösteriyoruz.'],
      ['2–5. gün', 'Kurulum', 'Sistemi işletmenize göre kuruyoruz: menünüz, hizmetleriniz, fiyatlarınız ya da stoğunuz.'],
      ['6–7. gün', 'Yayın', 'Sizinle birlikte test ediyor, yayına alıyor ve ekibinize konuşmalara nasıl dahil olacağını gösteriyoruz.'],
      ['Her ay', 'İyileştirme', 'Gerçek konuşmaları inceliyor, müşterilerin takıldığı yerleri düzeltiyor ve sistemi keskin tutuyoruz.'],
    ],
  },
}

export function Process() {
  const t = useCopy(processCopy)
  return (
    <section id="process" className="mx-auto max-w-[1200px] scroll-mt-20 px-6 py-28">
      <Reveal className="flex max-w-[760px] flex-col gap-5">
        <SectionLabel n="04">{t.label}</SectionLabel>
        <Words className="text-[36px] leading-[1.05] font-semibold tracking-[-0.03em] sm:text-[52px]" parts={[{ text: t.h2 }]} />
      </Reveal>
      <div className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
        <div className="absolute top-[7px] right-0 left-0 hidden h-px bg-line md:block" />
        <motion.div
          className="absolute top-[7px] left-0 hidden h-px origin-left bg-ink md:block"
          initial={{ width: '0%' }}
          whileInView={{ width: '100%' }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
        {t.steps.map(([when, title, d], i) => (
          <Reveal key={title} delay={0.15 + i * 0.25} className="relative flex flex-col gap-3">
            <span className="relative z-10 size-[15px] rounded-full border-2 border-ink bg-paper" />
            <p className="mt-3 font-mono text-[13px] text-accent">{when}</p>
            <p className="text-[22px] font-semibold tracking-tight">{title}</p>
            <p className="text-[15px] leading-relaxed text-muted">{d}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

const faqCopy = {
  en: {
    label: 'FAQ', h2: 'Questions, answered.', more: 'Something else on your mind?', ask: 'Ask us directly.',
    items: [
      ['Will my customers know they’re talking to an AI?', 'Yes, and that’s how it should be. The assistant introduces itself as your business’s assistant, and any customer can ask for a person at any time.'],
      ['Can it say something wrong or make things up?', 'It only answers from information you approve: your services, prices, hours and policies. Anything it can’t confirm, like a special discount, is passed to your team instead of guessed.'],
      ['How long does setup take?', 'Seven days from the first call to going live. You’ll need about an hour of your time in total.'],
      ['Can I keep my current WhatsApp number?', 'We review your current setup and recommend the simplest way to keep the number your customers already use.'],
      ['Which languages does it speak?', 'Turkish and English as standard. Each customer gets an answer in the language they write in.'],
      ['How much does it cost?', 'Every business is different. After the free audit we send you a clear, fixed proposal. No surprises.'],
      ['Do you work outside Gazimağusa?', 'Yes. We work with businesses and dealerships across North Cyprus.'],
    ],
  },
  tr: {
    label: 'SSS', h2: 'Aklınızdaki sorular.', more: 'Başka bir sorunuz mu var?', ask: 'Bize doğrudan sorun.',
    items: [
      ['Müşterilerim yapay zekayla konuştuğunu anlar mı?', 'Evet, doğrusu da bu. Asistan kendini işletmenizin asistanı olarak tanıtır ve her müşteri istediği an bir insanla görüşmek isteyebilir.'],
      ['Yanlış bir şey söyler ya da uydurur mu?', 'Sadece sizin onayladığınız bilgilerden cevap verir: hizmetleriniz, fiyatlarınız, saatleriniz ve kurallarınız. Onaylayamadığı bir şeyi, örneğin özel bir indirimi, tahmin etmek yerine ekibinize devreder.'],
      ['Kurulum ne kadar sürer?', 'İlk görüşmeden yayına 7 gün. Toplamda sizden yaklaşık bir saat zaman ister.'],
      ['Mevcut WhatsApp numaramı kullanabilir miyim?', 'Mevcut kurulumunuzu inceliyor ve müşterilerinizin zaten bildiği numarayı korumanın en kolay yolunu öneriyoruz.'],
      ['Hangi dillerde konuşur?', 'Standart olarak Türkçe ve İngilizce. Her müşteriye yazdığı dilde cevap verir.'],
      ['Ne kadar tutar?', 'Her işletme farklı. Ücretsiz analizden sonra size net ve sabit bir teklif gönderiyoruz. Sürpriz yok.'],
      ['Gazimağusa dışında çalışıyor musunuz?', 'Evet. KKTC genelinde işletmeler ve galerilerle çalışıyoruz.'],
    ],
  },
}

export function FAQ() {
  const t = useCopy(faqCopy)
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="scroll-mt-16 border-t border-line bg-white">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-28 lg:grid-cols-[1fr_1.4fr]">
        <Reveal className="flex flex-col gap-5">
          <SectionLabel n="05">{t.label}</SectionLabel>
          <Words className="text-[36px] leading-[1.05] font-semibold tracking-[-0.03em] sm:text-[46px]" parts={[{ text: t.h2 }]} />
          <p className="text-[16px] text-muted">{t.more} <a href="#contact" className="text-ink underline underline-offset-4">{t.ask}</a></p>
        </Reveal>
        <div className="border-b border-line">
          {t.items.map(([q, a], i) => {
            const on = open === i
            return (
              <div key={i} className="border-t border-line">
                <button aria-expanded={on} onClick={() => setOpen(on ? null : i)} className="flex w-full items-center justify-between gap-6 py-5 text-left text-[17px] font-medium">
                  {q}
                  <motion.svg animate={{ rotate: on ? 45 : 0 }} aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" className="shrink-0">
                    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </motion.svg>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <p className="max-w-[600px] pb-6 text-[15.5px] leading-relaxed text-muted">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const contactCopy = {
  en: {
    h2a: 'Get a free', h2b: 'WhatsApp audit.',
    sub: 'We’ll message your business like a real customer, measure how fast you reply, and show you exactly where sales are slipping. No cost, no obligation.',
    wa: 'Message us on WhatsApp', orEmail: 'Or email',
    form: 'Request your free audit', name: 'Your name', namePh: 'Ayşe Demir', business: 'Business', businessPh: 'Business name',
    interest: 'I’m interested in', services: ['WhatsApp Automation', 'Automotive Digital Sales'],
    note: 'Anything we should know? (optional)', send: 'Send via WhatsApp',
    msgIntro: 'Hi WexaLabs, I’d like a free WhatsApp audit.', msgName: 'Name', msgBiz: 'Business', msgInt: 'Interested in', msgNote: 'Note',
    waHello: 'Hi WexaLabs, I’d like a free WhatsApp audit.',
    footer: ['WhatsApp Automation', 'Automotive'], city: 'Gazimağusa, North Cyprus',
  },
  tr: {
    h2a: 'Ücretsiz', h2b: 'WhatsApp analizi.',
    sub: 'İşletmenize gerçek bir müşteri gibi yazıyor, ne kadar hızlı cevap verdiğinizi ölçüyor ve satışın tam olarak nerede kaçtığını gösteriyoruz. Ücretsiz, bağlayıcı değil.',
    wa: 'WhatsApp’tan yazın', orEmail: 'Ya da e-posta',
    form: 'Ücretsiz analiz talep et', name: 'Adınız', namePh: 'Ayşe Demir', business: 'İşletme', businessPh: 'İşletme adı',
    interest: 'İlgilendiğim hizmet', services: ['WhatsApp Otomasyonu', 'Otomotiv Dijital Satış'],
    note: 'Bilmemiz gereken bir şey var mı? (isteğe bağlı)', send: 'WhatsApp ile gönder',
    msgIntro: 'Merhaba WexaLabs, ücretsiz WhatsApp analizi istiyorum.', msgName: 'Ad', msgBiz: 'İşletme', msgInt: 'İlgilendiğim hizmet', msgNote: 'Not',
    waHello: 'Merhaba WexaLabs, ücretsiz WhatsApp analizi istiyorum.',
    footer: ['WhatsApp Otomasyonu', 'Otomotiv'], city: 'Gazimağusa, KKTC',
  },
}

export function Contact() {
  const t = useCopy(contactCopy)
  const [svc, setSvc] = useState(0)
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const text = `${t.msgIntro}\n${t.msgName}: ${f.get('name')}\n${t.msgBiz}: ${f.get('business')}\n${t.msgInt}: ${t.services[svc]}${f.get('note') ? `\n${t.msgNote}: ${f.get('note')}` : ''}`
    window.open(waLink(text), '_blank')
  }
  const field = 'w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-[15px] text-white placeholder:text-white/35 focus:border-white/50 focus:outline-none'
  return (
    <section id="contact" className="scroll-mt-16 bg-ink text-white">
      <div className="mx-auto grid max-w-[1200px] gap-14 px-6 py-28 lg:grid-cols-[1.1fr_1fr]">
        <Reveal className="flex flex-col gap-6">
          <Words className="text-[42px] leading-[1.02] font-semibold tracking-[-0.035em] sm:text-[64px]" parts={[{ text: t.h2a }, { text: t.h2b, br: true }]} />
          <p className="max-w-[460px] text-[17px] leading-relaxed text-white/65">{t.sub}</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="light" href={waLink(t.waHello)}>
              <WaIcon className="size-[18px] text-[#00A884]" /> {t.wa}
            </Button>
          </div>
          {SITE.email && (
            <p className="text-[14px] text-white/50">
              {t.orEmail} <a href={`mailto:${SITE.email}`} className="text-white underline underline-offset-4">{SITE.email}</a>
            </p>
          )}
        </Reveal>
        <Reveal delay={0.1}>
          <form onSubmit={submit} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <p className="text-[17px] font-semibold">{t.form}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-[13px] text-white/60">{t.name}<input required name="name" className={field} placeholder={t.namePh} /></label>
              <label className="flex flex-col gap-2 text-[13px] text-white/60">{t.business}<input required name="business" className={field} placeholder={t.businessPh} /></label>
            </div>
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-[13px] text-white/60">{t.interest}</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {t.services.map((s, i) => (
                  <label key={s} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-[14px] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-white ${svc === i ? 'border-white bg-white text-ink' : 'border-white/15 text-white/80'}`}>
                    <input type="radio" name="service" value={s} checked={svc === i} onChange={() => setSvc(i)} className="sr-only" />
                    {s}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="flex flex-col gap-2 text-[13px] text-white/60">{t.note}<textarea name="note" rows={3} className={field} /></label>
            <div className="pt-2"><Button variant="light">{t.send} <Arrow /></Button></div>
          </form>
        </Reveal>
      </div>
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-6 py-8 text-[13px] text-white/45">
          <p>© {new Date().getFullYear()} WexaLabs · {t.city}</p>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#whatsapp" className="hover:text-white">{t.footer[0]}</a>
            <a href="#automotive" className="hover:text-white">{t.footer[1]}</a>
            {SITE.email && <a href={`mailto:${SITE.email}`} className="hover:text-white">{SITE.email}</a>}
            <a href={SITE.instagram} target="_blank" rel="noreferrer" className="hover:text-white">Instagram</a>
            <LangToggle dark />
          </div>
        </div>
      </footer>
    </section>
  )
}

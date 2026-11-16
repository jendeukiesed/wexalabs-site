import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Phone, type Msg } from './Phone'
import { Reveal, SectionLabel, Spotlight, Words } from './ui'
import { useCopy, useLang } from '../i18n'

const indCopy = {
  en: { lead: 'Built for businesses that live on WhatsApp', items: ['Car dealerships', 'Restaurants', 'Cafés', 'Barbers', 'Beauty salons', 'Real estate', 'Hotels', 'Clinics & studios'] },
  tr: { lead: 'WhatsApp’ta yaşayan işletmeler için', items: ['Oto galeriler', 'Restoranlar', 'Kafeler', 'Berberler', 'Güzellik merkezleri', 'Emlak', 'Oteller', 'Klinik ve stüdyolar'] },
}

export function Industries() {
  const t = useCopy(indCopy)
  const row = [...t.items, ...t.items]
  return (
    <section aria-label={t.lead} className="border-y border-line bg-white py-6">
      <div className="mx-auto flex max-w-[1200px] items-center gap-8 px-6">
        <p className="hidden shrink-0 text-[13px] text-muted sm:block">{t.lead}</p>
        <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
          <div className="marquee flex w-max gap-10">
            {row.map((x, i) => (
              <span key={i} className="text-[15px] font-medium whitespace-nowrap text-ink/80" aria-hidden={i >= t.items.length}>{x}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

type Scenario = { id: string; tab: string; title: string; body: string; business: string; initials: string; color: string; script: Msg[] }

const copy: { en: { label: string; h2a: string; h2b: string; sub: string; feats: string[][]; scenarios: Scenario[] }; tr: { label: string; h2a: string; h2b: string; sub: string; feats: string[][]; scenarios: Scenario[] } } = {
  en: {
    label: 'WhatsApp Automation',
    h2a: 'An assistant that sells for you,',
    h2b: 'day and night.',
    sub: 'AI-powered WhatsApp systems for restaurants, barbers, beauty salons, real estate agents and hotels. Set up around your business, handed over to your team whenever a person is needed.',
    feats: [
      ['Replies in seconds', 'Including evenings, weekends and holidays.'],
      ['Human handover', 'Your team can step into any conversation.'],
      ['Every lead saved', 'Name, number and request, in one place.'],
      ['Turkish & English', 'Answers each customer in their own language.'],
    ],
    scenarios: [
      {
        id: 'answers', tab: 'Instant answers', business: 'Lagoon Hotel', initials: 'LH', color: '#2F6FB0',
        title: 'The questions you answer 50 times a day, answered for you.',
        body: 'Prices, hours, location, availability. The assistant knows your business and replies in seconds.',
        script: [
          { from: 'customer', text: 'Hello, is breakfast included? And do you have parking?', time: '07:12' },
          { from: 'business', text: 'Good morning! Yes, breakfast is included, served 07:30–10:30. Free private parking is available on site.', time: '07:12' },
          { from: 'customer', text: 'Perfect. Any sea view rooms for 12–15 June?', time: '07:13' },
          { from: 'business', text: 'We have 2 sea view doubles for those dates. Shall I hold one for you?', buttons: ['Yes, hold it', 'Call me'], time: '07:13' },
        ],
      },
      {
        id: 'orders', tab: 'Orders', business: 'Kumsal Kitchen', initials: 'KK', color: '#C2622D',
        title: 'Take orders on WhatsApp without picking up the phone.',
        body: 'Your menu, sent on request. Orders collected step by step and passed to your kitchen.',
        script: [
          { from: 'customer', text: 'Can I see the menu?', time: '19:30' },
          { from: 'business', text: 'Of course! What are you in the mood for?', buttons: ['Wraps', 'Burgers', 'Salads'], time: '19:30' },
          { from: 'customer', text: '2 chicken wraps please, for pickup', time: '19:31' },
          { from: 'business', text: 'Got it: 2 × Chicken Wrap, pickup. Ready at 19:50. Your order number is #214.', time: '19:31' },
        ],
      },
      {
        id: 'bookings', tab: 'Appointments', business: 'Old Town Barbers', initials: 'OB', color: '#3A3A3D',
        title: 'Appointments booked while you’re busy cutting.',
        body: 'Customers pick a free slot and a service. The booking lands in your calendar, and a reminder goes out automatically.',
        script: [
          { from: 'customer', text: 'Any free slot today?', time: '11:05' },
          { from: 'business', text: 'Today we have:', buttons: ['13:00', '16:30', '18:00'], time: '11:05' },
          { from: 'customer', text: '16:30', time: '11:06' },
          { from: 'business', text: 'Booked for 16:30 today. Haircut and beard as usual?', buttons: ['Yes', 'Just haircut'], time: '11:06' },
        ],
      },
      {
        id: 'leads', tab: 'Lead capture', business: 'Bay Properties', initials: 'BP', color: '#0B7A5A',
        title: 'Every enquiry becomes a lead your team can call.',
        body: 'The assistant asks the right questions (budget, timing, name) and sends a clean summary to your team.',
        script: [
          { from: 'customer', text: 'Is the 2+1 in Long Beach still available?', time: '23:18' },
          { from: 'business', text: 'Yes, it is! Is it for living or investment?', buttons: ['Living', 'Investment'], time: '23:18' },
          { from: 'customer', text: 'Investment', time: '23:19' },
          { from: 'business', text: 'Thanks! An agent will call you tomorrow morning with the details. May I have your name?', time: '23:19' },
        ],
      },
    ],
  },
  tr: {
    label: 'WhatsApp Otomasyonu',
    h2a: 'Sizin yerinize satan bir asistan,',
    h2b: 'gece gündüz.',
    sub: 'Restoranlar, berberler, güzellik merkezleri, emlakçılar ve oteller için yapay zeka destekli WhatsApp sistemleri. İşletmenize göre kurulur, bir insana ihtiyaç olduğunda konuşmayı ekibinize devreder.',
    feats: [
      ['Saniyeler içinde cevap', 'Akşamlar, hafta sonları ve tatiller dahil.'],
      ['İnsana devir', 'Ekibiniz istediği konuşmaya dahil olabilir.'],
      ['Her talep kayıtlı', 'İsim, numara ve talep tek yerde.'],
      ['Türkçe ve İngilizce', 'Her müşteriye kendi dilinde cevap verir.'],
    ],
    scenarios: [
      {
        id: 'answers', tab: 'Anında cevap', business: 'Lagoon Hotel', initials: 'LH', color: '#2F6FB0',
        title: 'Günde 50 kez cevapladığınız sorular, sizin yerinize cevaplanır.',
        body: 'Fiyatlar, saatler, konum, müsaitlik. Asistan işletmenizi tanır ve saniyeler içinde cevap verir.',
        script: [
          { from: 'customer', text: 'Merhaba, kahvaltı dahil mi? Otopark var mı?', time: '07:12' },
          { from: 'business', text: 'Günaydın! Evet, kahvaltı dahil, 07:30–10:30 arası. Tesiste ücretsiz özel otopark var.', time: '07:12' },
          { from: 'customer', text: 'Süper. 12–15 Haziran için deniz manzaralı oda var mı?', time: '07:13' },
          { from: 'business', text: 'Bu tarihler için 2 deniz manzaralı çift kişilik odamız var. Birini sizin için ayırayım mı?', buttons: ['Evet, ayır', 'Beni arayın'], time: '07:13' },
        ],
      },
      {
        id: 'orders', tab: 'Sipariş', business: 'Kumsal Kitchen', initials: 'KK', color: '#C2622D',
        title: 'Telefonu açmadan WhatsApp’tan sipariş alın.',
        body: 'Menünüz istendiği an gönderilir. Sipariş adım adım alınır ve mutfağınıza iletilir.',
        script: [
          { from: 'customer', text: 'Menüyü görebilir miyim?', time: '19:30' },
          { from: 'business', text: 'Tabii! Canınız ne çekiyor?', buttons: ['Dürüm', 'Burger', 'Salata'], time: '19:30' },
          { from: 'customer', text: '2 tavuk dürüm, gel-al olsun', time: '19:31' },
          { from: 'business', text: 'Tamamdır: 2 × Tavuk Dürüm, gel-al. 19:50’de hazır. Sipariş numaranız #214.', time: '19:31' },
        ],
      },
      {
        id: 'bookings', tab: 'Randevu', business: 'Old Town Barbers', initials: 'OB', color: '#3A3A3D',
        title: 'Siz saç keserken randevular alınır.',
        body: 'Müşteri boş saati ve hizmeti seçer. Randevu takviminize düşer, hatırlatma otomatik gider.',
        script: [
          { from: 'customer', text: 'Bugün boş saat var mı?', time: '11:05' },
          { from: 'business', text: 'Bugün şu saatler boş:', buttons: ['13:00', '16:30', '18:00'], time: '11:05' },
          { from: 'customer', text: '16:30', time: '11:06' },
          { from: 'business', text: 'Bugün 16:30’a yazdım. Her zamanki gibi saç ve sakal mı?', buttons: ['Evet', 'Sadece saç'], time: '11:06' },
        ],
      },
      {
        id: 'leads', tab: 'Müşteri toplama', business: 'Bay Properties', initials: 'BP', color: '#0B7A5A',
        title: 'Her soru, ekibinizin arayabileceği bir müşteriye dönüşür.',
        body: 'Asistan doğru soruları sorar (bütçe, zaman, isim) ve ekibinize temiz bir özet gönderir.',
        script: [
          { from: 'customer', text: 'Long Beach’teki 2+1 hâlâ satılık mı?', time: '23:18' },
          { from: 'business', text: 'Evet, satılık! Oturmak için mi, yatırım için mi?', buttons: ['Oturmak', 'Yatırım'], time: '23:18' },
          { from: 'customer', text: 'Yatırım', time: '23:19' },
          { from: 'business', text: 'Teşekkürler! Danışmanımız yarın sabah detaylarla sizi arayacak. Adınızı alabilir miyim?', time: '23:19' },
        ],
      },
    ],
  },
}

export function WhatsAppSection() {
  const t = useCopy(copy)
  const { lang } = useLang()
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()
  const s = t.scenarios[active]
  const next = () => setActive((a) => (a + 1) % t.scenarios.length)

  return (
    <section id="whatsapp" className="mx-auto max-w-[1200px] scroll-mt-20 px-6 py-28">
      <Reveal className="flex max-w-[760px] flex-col gap-5">
        <SectionLabel n="02">{t.label}</SectionLabel>
        <Words className="text-[36px] leading-[1.05] font-semibold tracking-[-0.03em] sm:text-[52px]" parts={[{ text: t.h2a }, { text: t.h2b, className: 'text-muted' }]} />
        <p className="max-w-[600px] text-[17px] leading-relaxed text-muted">{t.sub}</p>
      </Reveal>

      <div className="mt-16 grid items-start gap-12 lg:grid-cols-[1fr_auto]">
        <div className="flex flex-col">
          <div role="tablist" aria-label={t.label} className="flex flex-col">
            {t.scenarios.map((sc, i) => {
              const on = i === active
              return (
                <button
                  key={sc.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(i)}
                  className={`relative border-t border-line py-6 text-left transition-colors last:border-b ${on ? '' : 'hover:bg-white/60'}`}
                >
                  <div className="flex items-baseline gap-4">
                    <span className={`font-mono text-[13px] ${on ? 'text-ink' : 'text-muted'}`}>0{i + 1}</span>
                    <span className={`text-[20px] font-semibold tracking-tight ${on ? 'text-ink' : 'text-ink/45'}`}>{sc.tab}</span>
                  </div>
                  <motion.div
                    initial={false}
                    animate={{ height: on ? 'auto' : 0, opacity: on ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden pl-9"
                  >
                    <p className="pt-3 text-[17px] font-medium">{sc.title}</p>
                    <p className="pt-2 text-[15px] leading-relaxed text-muted">{sc.body}</p>
                  </motion.div>
                  {on && !reduce && (
                    <motion.span
                      key={`bar-${active}-${lang}`}
                      className="absolute top-[-1px] left-0 h-px bg-ink"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 11, ease: 'linear' }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          <Reveal className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {t.feats.map(([a, b]) => (
              <Spotlight key={a} className="bg-white p-5">
                <p className="text-[15px] font-semibold">{a}</p>
                <p className="mt-1 text-[14px] text-muted">{b}</p>
              </Spotlight>
            ))}
          </Reveal>
        </div>

        <div className="flex justify-center lg:sticky lg:top-24">
          <Phone
            key={`${s.id}-${lang}`}
            name={s.business}
            initials={s.initials}
            color={s.color}
            script={s.script}
            loop={false}
            onDone={next}
            label={`${s.business}: ${s.tab}`}
          />
        </div>
      </div>
    </section>
  )
}

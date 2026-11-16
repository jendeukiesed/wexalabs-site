import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { PhoneFrame, type Msg } from './Phone'
import { Arrow, Button, Reveal, SectionLabel, Words } from './ui'
import { useCopy, useLang } from '../i18n'

type Node = { bot: string; options?: [label: string, next: string][] }
type Biz = { id: string; chip: string; name: string; initials: string; color: string; nodes: Record<string, Node> }

const copy: Record<'en' | 'tr', { label: string; h2: string; sub: string; pick: string; endTitle: string; endBody: string; endCta: string; restart: string; hint: string; biz: Biz[] }> = {
  en: {
    label: 'Try it yourself',
    h2: 'Don’t take our word for it. Tap through a conversation.',
    sub: 'Pick a business, then answer like a customer would. This is the same experience your customers would get on WhatsApp.',
    pick: 'Choose a business',
    hint: 'Tap the blue buttons in the chat',
    endTitle: 'That’s the whole flow.',
    endBody: 'Yours would be built around your own services, prices and schedule, and live within 7 days.',
    endCta: 'Get a free WhatsApp audit',
    restart: 'Start again',
    biz: [
      {
        id: 'restaurant', chip: 'Restaurant', name: 'Kumsal Kitchen', initials: 'KK', color: '#C2622D',
        nodes: {
          start: { bot: 'Hi! Welcome to Kumsal Kitchen. How can I help?', options: [['See the menu', 'menu'], ['Book a table', 'table'], ['Opening hours', 'hours']] },
          menu: { bot: 'Today’s favourites: Chicken Wrap, Halloumi Burger and Greek Salad. Would you like to order?', options: [['Pickup', 'pickup'], ['Delivery', 'delivery']] },
          table: { bot: 'Lovely! For how many people?', options: [['2', 'slot'], ['4', 'slot'], ['6+', 'slot']] },
          slot: { bot: 'Tonight we have a table at 20:00 or 21:30. Which one?', options: [['20:00', 'tableDone'], ['21:30', 'tableDone']] },
          tableDone: { bot: 'Your table is booked. We’ll send you a reminder 2 hours before. See you tonight!' },
          hours: { bot: 'We’re open every day 11:00–23:00. The kitchen closes at 22:30.', options: [['Book a table', 'table'], ['See the menu', 'menu']] },
          pickup: { bot: 'Great! Write your order here and it will be ready in about 20 minutes. Our team will confirm the total.' },
          delivery: { bot: 'We deliver within Gazimağusa. Share your location and order, and our team will confirm the time.' },
        },
      },
      {
        id: 'barber', chip: 'Barber', name: 'Old Town Barbers', initials: 'OB', color: '#3A3A3D',
        nodes: {
          start: { bot: 'Hi! Want to book an appointment?', options: [['Today', 'today'], ['Tomorrow', 'tomorrow'], ['Price list', 'prices']] },
          today: { bot: 'Free slots today:', options: [['13:00', 'service'], ['16:30', 'service'], ['18:00', 'service']] },
          tomorrow: { bot: 'Free slots tomorrow:', options: [['10:00', 'service'], ['14:30', 'service'], ['17:00', 'service']] },
          prices: { bot: 'I’ve sent our price list as a photo. Shall I find you a free slot?', options: [['Today', 'today'], ['Tomorrow', 'tomorrow']] },
          service: { bot: 'Which service?', options: [['Haircut', 'done'], ['Haircut + beard', 'done'], ['Beard', 'done']] },
          done: { bot: 'You’re booked! You’ll get a reminder 2 hours before. Need to change it? Just write here.' },
        },
      },
      {
        id: 'hotel', chip: 'Hotel', name: 'Lagoon Hotel', initials: 'LH', color: '#2F6FB0',
        nodes: {
          start: { bot: 'Welcome to Lagoon Hotel! What would you like to know?', options: [['Availability', 'dates'], ['Breakfast & parking', 'info'], ['Airport transfer', 'transfer']] },
          dates: { bot: 'When would you like to stay?', options: [['This weekend', 'room'], ['Next week', 'room'], ['Other dates', 'other']] },
          room: { bot: 'Good news, we have rooms available. Which type?', options: [['Standard double', 'roomDone'], ['Sea view', 'roomDone']] },
          roomDone: { bot: 'I’ve held the room for you for 24 hours. A team member will confirm the price and details shortly.' },
          other: { bot: 'Just type your dates here and I’ll check right away.' },
          info: { bot: 'Breakfast is included, 07:30–10:30. Free private parking on site.', options: [['Check availability', 'dates']] },
          transfer: { bot: 'Yes, we arrange transfers from Ercan airport. Send your flight time and our team will confirm.' },
        },
      },
      {
        id: 'dealer', chip: 'Car dealership', name: 'Your Dealership', initials: 'YD', color: '#0B0B0C',
        nodes: {
          start: { bot: 'Hi! Looking for a car? What type are you after?', options: [['SUV', 'budget'], ['Hatchback', 'budget'], ['Sedan', 'budget']] },
          budget: { bot: 'And your budget?', options: [['Under £10k', 'match'], ['£10k–15k', 'match'], ['£15k+', 'match']] },
          match: { bot: 'I found 3 cars that match. Want photos, or shall we book a viewing?', options: [['Send photos', 'photos'], ['Book a viewing', 'viewing']] },
          photos: { bot: 'Sending photos and details now. Ask me anything about any of them.' },
          viewing: { bot: 'When suits you?', options: [['Tomorrow 11:00', 'vdone'], ['Tomorrow 16:00', 'vdone'], ['Saturday', 'vdone']] },
          vdone: { bot: 'Viewing booked. We’ll send you the location and a reminder. See you at the showroom!' },
        },
      },
    ],
  },
  tr: {
    label: 'Kendin dene',
    h2: 'Bize inanmak zorunda değilsin. Bir konuşmayı kendin dene.',
    sub: 'Bir işletme seç, sonra müşteri gibi cevap ver. Müşterilerinin WhatsApp’ta yaşayacağı deneyimin aynısı.',
    pick: 'Bir işletme seç',
    hint: 'Sohbetteki mavi butonlara dokun',
    endTitle: 'Akışın tamamı bu.',
    endBody: 'Seninki kendi hizmetlerin, fiyatların ve takvimine göre kurulur ve 7 gün içinde yayında olur.',
    endCta: 'Ücretsiz WhatsApp analizi al',
    restart: 'Baştan başla',
    biz: [
      {
        id: 'restaurant', chip: 'Restoran', name: 'Kumsal Kitchen', initials: 'KK', color: '#C2622D',
        nodes: {
          start: { bot: 'Merhaba! Kumsal Kitchen’a hoş geldiniz. Nasıl yardımcı olabilirim?', options: [['Menüyü gör', 'menu'], ['Masa ayırt', 'table'], ['Çalışma saatleri', 'hours']] },
          menu: { bot: 'Bugünün favorileri: Tavuk Dürüm, Hellim Burger ve Çoban Salata. Sipariş vermek ister misiniz?', options: [['Gel-al', 'pickup'], ['Paket servis', 'delivery']] },
          table: { bot: 'Harika! Kaç kişi olacaksınız?', options: [['2', 'slot'], ['4', 'slot'], ['6+', 'slot']] },
          slot: { bot: 'Bu akşam 20:00 veya 21:30’da masamız var. Hangisi?', options: [['20:00', 'tableDone'], ['21:30', 'tableDone']] },
          tableDone: { bot: 'Masanız ayrıldı. 2 saat önce hatırlatma göndereceğiz. Akşam görüşmek üzere!' },
          hours: { bot: 'Her gün 11:00–23:00 arası açığız. Mutfak 22:30’da kapanıyor.', options: [['Masa ayırt', 'table'], ['Menüyü gör', 'menu']] },
          pickup: { bot: 'Süper! Siparişinizi buraya yazın, yaklaşık 20 dakikada hazır olur. Ekibimiz tutarı onaylayacak.' },
          delivery: { bot: 'Gazimağusa içine paket servisimiz var. Konumunuzu ve siparişinizi gönderin, ekibimiz saati onaylasın.' },
        },
      },
      {
        id: 'barber', chip: 'Berber', name: 'Old Town Barbers', initials: 'OB', color: '#3A3A3D',
        nodes: {
          start: { bot: 'Merhaba! Randevu almak ister misiniz?', options: [['Bugün', 'today'], ['Yarın', 'tomorrow'], ['Fiyat listesi', 'prices']] },
          today: { bot: 'Bugün boş saatler:', options: [['13:00', 'service'], ['16:30', 'service'], ['18:00', 'service']] },
          tomorrow: { bot: 'Yarın boş saatler:', options: [['10:00', 'service'], ['14:30', 'service'], ['17:00', 'service']] },
          prices: { bot: 'Fiyat listemizi fotoğraf olarak gönderdim. Size boş bir saat bulayım mı?', options: [['Bugün', 'today'], ['Yarın', 'tomorrow']] },
          service: { bot: 'Hangi hizmet?', options: [['Saç', 'done'], ['Saç + sakal', 'done'], ['Sakal', 'done']] },
          done: { bot: 'Randevunuz alındı! 2 saat önce hatırlatma gelecek. Değiştirmek isterseniz buraya yazmanız yeterli.' },
        },
      },
      {
        id: 'hotel', chip: 'Otel', name: 'Lagoon Hotel', initials: 'LH', color: '#2F6FB0',
        nodes: {
          start: { bot: 'Lagoon Hotel’e hoş geldiniz! Ne öğrenmek istersiniz?', options: [['Müsaitlik', 'dates'], ['Kahvaltı ve otopark', 'info'], ['Havalimanı transferi', 'transfer']] },
          dates: { bot: 'Hangi tarihlerde kalmak istersiniz?', options: [['Bu hafta sonu', 'room'], ['Gelecek hafta', 'room'], ['Başka tarih', 'other']] },
          room: { bot: 'Müjde, boş odamız var. Hangi oda tipi?', options: [['Standart çift', 'roomDone'], ['Deniz manzaralı', 'roomDone']] },
          roomDone: { bot: 'Odayı 24 saatliğine sizin için ayırdım. Ekibimiz birazdan fiyatı ve detayları onaylayacak.' },
          other: { bot: 'Tarihlerinizi buraya yazın, hemen kontrol edeyim.' },
          info: { bot: 'Kahvaltı dahil, 07:30–10:30 arası. Tesiste ücretsiz özel otopark var.', options: [['Müsaitliğe bak', 'dates']] },
          transfer: { bot: 'Evet, Ercan havalimanından transfer ayarlıyoruz. Uçuş saatinizi gönderin, ekibimiz onaylasın.' },
        },
      },
      {
        id: 'dealer', chip: 'Oto galeri', name: 'Galeriniz', initials: 'YD', color: '#0B0B0C',
        nodes: {
          start: { bot: 'Merhaba! Araç mı bakıyorsunuz? Ne tür bir araç?', options: [['SUV', 'budget'], ['Hatchback', 'budget'], ['Sedan', 'budget']] },
          budget: { bot: 'Bütçeniz nedir?', options: [['£10k altı', 'match'], ['£10k–15k', 'match'], ['£15k üstü', 'match']] },
          match: { bot: 'Size uyan 3 araç buldum. Fotoğraf göndereyim mi, yoksa görmeye mi gelmek istersiniz?', options: [['Fotoğraf gönder', 'photos'], ['Randevu al', 'viewing']] },
          photos: { bot: 'Fotoğrafları ve detayları şimdi gönderiyorum. Herhangi biri hakkında istediğinizi sorun.' },
          viewing: { bot: 'Ne zaman uygunsunuz?', options: [['Yarın 11:00', 'vdone'], ['Yarın 16:00', 'vdone'], ['Cumartesi', 'vdone']] },
          vdone: { bot: 'Randevunuz alındı. Konum ve hatırlatma göndereceğiz. Galeride görüşmek üzere!' },
        },
      },
    ],
  },
}

const now = () => {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function TryIt() {
  const t = useCopy(copy)
  const { lang } = useLang()
  const [bizIdx, setBizIdx] = useState(0)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [typing, setTyping] = useState(false)
  const [ended, setEnded] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const biz = t.biz[bizIdx]

  const botMsg = (key: string): Msg => {
    const n = biz.nodes[key]
    return { from: 'business', text: n.bot, buttons: n.options?.map((o) => o[0]), time: now() }
  }

  // start (or restart) the chat whenever the business or language changes
  const start = () => {
    window.clearTimeout(timer.current)
    setEnded(false)
    setMsgs([])
    setTyping(true)
    timer.current = window.setTimeout(() => { setTyping(false); setMsgs([botMsg('start')]) }, 700)
  }
  useEffect(() => { start(); return () => window.clearTimeout(timer.current) }, [bizIdx, lang]) // eslint-disable-line react-hooks/exhaustive-deps

  const nodeOf = (m: Msg) => Object.entries(biz.nodes).find(([, n]) => n.bot === m.text)?.[1]

  const pick = (label: string) => {
    const last = msgs[msgs.length - 1]
    const next = nodeOf(last)?.options?.find((o) => o[0] === label)?.[1]
    if (!next) return
    const lastBot: Msg = { ...last, buttons: undefined }
    setMsgs((m) => [...m.slice(0, -1), lastBot, { from: 'customer', text: label, time: now() }])
    setTyping(true)
    timer.current = window.setTimeout(() => {
      setTyping(false)
      setMsgs((m) => [...m, botMsg(next)])
      if (!biz.nodes[next].options) setEnded(true)
    }, 900)
  }

  const endArea = (
            <AnimatePresence mode="wait">
              {ended ? (
                <motion.div
                  key="end"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="max-w-[460px] rounded-2xl border border-line bg-paper p-6"
                >
                  <p className="text-[18px] font-semibold">{t.endTitle}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{t.endBody}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button href="#contact">{t.endCta} <Arrow /></Button>
                    <button type="button" onClick={start} className="min-h-11 rounded-full px-4 text-[15px] font-medium text-muted hover:text-ink">{t.restart}</button>
                  </div>
                </motion.div>
              ) : (
                <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-[14px] text-muted">
                  <motion.span animate={{ x: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.4 }} aria-hidden="true">→</motion.span>
                  {t.hint}
                </motion.p>
              )}
            </AnimatePresence>
  )

  return (
    <section id="try" className="scroll-mt-16 border-t border-line bg-white">
      <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-6 py-28 lg:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-8">
          <Reveal className="flex flex-col gap-5">
            <SectionLabel n="03">{t.label}</SectionLabel>
            <Words className="max-w-[640px] text-[36px] leading-[1.05] font-semibold tracking-[-0.03em] sm:text-[50px]" parts={[{ text: t.h2 }]} />
            <p className="max-w-[540px] text-[17px] leading-relaxed text-muted">{t.sub}</p>
          </Reveal>
          <div>
            <p className="mb-3 text-[13px] text-muted">{t.pick}</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label={t.pick}>
              {t.biz.map((b, i) => (
                <button
                  key={b.id}
                  type="button"
                  aria-pressed={i === bizIdx}
                  onClick={() => setBizIdx(i)}
                  className={`min-h-11 rounded-full border px-5 text-[15px] font-medium transition-colors ${i === bizIdx ? 'border-ink bg-ink text-white' : 'border-line bg-paper text-ink hover:border-[#C9C9C3]'}`}
                >
                  {b.chip}
                </button>
              ))}
            </div>
          </div>
          <div className="hidden min-h-[150px] lg:block">{endArea}</div>
        </div>
        <div className="flex justify-center">
          <PhoneFrame
            interactive
            name={biz.name}
            initials={biz.initials}
            color={biz.color}
            visible={msgs}
            typing={typing}
            onPick={pick}
            label={`${t.label}: ${biz.name}`}
          />
        </div>
        <div className="lg:hidden">{endArea}</div>
      </div>
    </section>
  )
}

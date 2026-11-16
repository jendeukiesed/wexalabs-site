import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Lang = 'en' | 'tr'

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: 'en', setLang: () => {} })

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem('wexa-lang')
    if (saved === 'en' || saved === 'tr') return saved
  } catch { /* storage unavailable */ }
  return typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('tr') ? 'tr' : 'en'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)
  const setLang = (l: Lang) => {
    setLangState(l)
    try { localStorage.setItem('wexa-lang', l) } catch { /* ignore */ }
  }
  useEffect(() => {
    document.documentElement.lang = lang
    document.title = lang === 'tr'
      ? 'WexaLabs — WhatsApp Otomasyonu ve Dijital Satış Sistemleri'
      : 'WexaLabs — WhatsApp Automation & Digital Sales Systems'
  }, [lang])
  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>
}

export const useLang = () => useContext(LangCtx)

/** Pick the current language's version of a copy object: useCopy({ en: {...}, tr: {...} }) */
export function useCopy<T>(copy: { en: T; tr: T }): T {
  return copy[useLang().lang]
}

export function LangToggle({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useLang()
  return (
    <div role="group" aria-label="Language" className={`flex rounded-full border p-0.5 text-[12.5px] font-medium ${dark ? 'border-white/15' : 'border-line bg-white'}`}>
      {(['tr', 'en'] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={lang === l}
          onClick={() => setLang(l)}
          className={`min-h-8 rounded-full px-2.5 uppercase transition-colors ${lang === l ? (dark ? 'bg-white text-ink' : 'bg-ink text-white') : dark ? 'text-white/55 hover:text-white' : 'text-muted hover:text-ink'}`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

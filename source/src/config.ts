// Fill these in before going live.
export const SITE = {
  // International format, digits only, e.g. 905331234567
  whatsappNumber: '905391214406',
  // Leave empty until the domain mailbox exists; email links are hidden when empty
  email: '',
  instagram: 'https://instagram.com/wexalabs',
  city: 'Gazimağusa, North Cyprus',
}

export const waLink = (text: string) =>
  `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`

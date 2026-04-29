'use client';

// ── Play Store Download Link ──────────────────────────────
const APP_DOWNLOAD_LINK = 'https://bit.ly/myprayertowerapp';
const SITE_URL = 'https://www.myprayertower.com';

// ── Content Types ─────────────────────────────────────────
export type ShareContentType = 'prayer' | 'saint' | 'reading' | 'candle' | 'memorial' | 'rosary' | 'novena' | 'general';

// ── Emotional Templates ───────────────────────────────────
const EMOTIONAL_TEMPLATES: Record<ShareContentType, string[]> = {
  prayer: [
    '🙏 This powerful prayer touched my heart deeply. May it bring you the same peace and comfort.',
    '🙏 I prayed this today and felt God\'s presence. Sharing it with you in faith and love.',
    '🙏 Words that lift the soul to Heaven. I hope this prayer blesses your day.',
  ],
  saint: [
    '⭐ The inspiring life of this saint reminds us that holiness is possible for everyone.',
    '✝️ What an incredible story of faith! This saint\'s life is a beacon of hope for all of us.',
    '🌟 Saints show us the way to God. Read about this beautiful soul and be inspired.',
  ],
  reading: [
    '📖 Today\'s Word from God spoke directly to my heart. Read it and be blessed.',
    '📖 The Scripture for today is so powerful. Let God speak to you through His Word.',
    '📖 I found such comfort in today\'s readings. Sharing this grace with you.',
  ],
  candle: [
    '🕯️ I just lit a virtual candle and prayed for my intentions. You can light one too.',
    '🕯️ A candle burns for a prayer close to my heart. Join me in this beautiful tradition.',
  ],
  memorial: [
    '🕊️ Remembering a beautiful soul with love and prayers. May they rest in eternal peace.',
    '🕊️ Some lives touch us forever. This memorial is a testament to undying love.',
  ],
  rosary: [
    '📿 The Holy Rosary brings such peace to my soul. Pray it with me today.',
    '📿 Mother Mary intercedes for us all. I just prayed the Rosary — join me in devotion.',
  ],
  novena: [
    '🙏 Day by day, prayer by prayer — this novena is strengthening my faith. Pray with me.',
    '🙏 Nine days of powerful prayer. Join this novena and experience God\'s grace.',
  ],
  general: [
    '✝️ This beautiful Catholic resource is blessing my spiritual journey. Sharing it with you in love.',
    '✝️ Faith grows when it\'s shared. I found something beautiful — may it bless you too.',
  ],
};

// ── Get a random emotional intro ──────────────────────────
function getEmotionalIntro(type: ShareContentType): string {
  const templates = EMOTIONAL_TEMPLATES[type] || EMOTIONAL_TEMPLATES.general;
  return templates[Math.floor(Math.random() * templates.length)];
}

// ── Build share text ──────────────────────────────────────
export function buildShareText({
  title,
  description,
  type = 'general',
  url,
  includeEmotionalIntro = true,
}: {
  title: string;
  description?: string;
  type?: ShareContentType;
  url: string;
  includeEmotionalIntro?: boolean;
}): string {
  const fullUrl = url.startsWith('http') ? url : `${SITE_URL}${url}`;
  const intro = includeEmotionalIntro ? getEmotionalIntro(type) : '';

  const parts = [
    intro,
    '',
    `✨ ${title}`,
    description ? `\n${description.slice(0, 200)}${description.length > 200 ? '...' : ''}` : '',
    '',
    `🔗 ${fullUrl}`,
    '',
    `📲 Download My Prayer Tower App: ${APP_DOWNLOAD_LINK}`,
    '— Your Daily Catholic Companion ✝️',
  ].filter(Boolean);

  return parts.join('\n');
}

// ── Share Link Generators ─────────────────────────────────
export interface SharePlatform {
  id: string;
  name: string;
  icon: string; // emoji fallback
  color: string;
  hoverColor: string;
  getUrl: (text: string, url: string, title: string) => string;
}

export function getSharePlatforms(text: string, url: string, title: string): SharePlatform[] {
  const fullUrl = url.startsWith('http') ? url : `${SITE_URL}${url}`;
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);

  return [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: '💬',
      color: 'bg-[#25D366]',
      hoverColor: 'hover:bg-[#20BD5A]',
      getUrl: () => `https://wa.me/?text=${encodedText}`,
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: '✈️',
      color: 'bg-[#0088CC]',
      hoverColor: 'hover:bg-[#006FA8]',
      getUrl: () => `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: '📘',
      color: 'bg-[#1877F2]',
      hoverColor: 'hover:bg-[#166FE5]',
      getUrl: () => `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      icon: '🐦',
      color: 'bg-[#1DA1F2]',
      hoverColor: 'hover:bg-[#1A94DA]',
      getUrl: () => `https://twitter.com/intent/tweet?text=${encodedText}`,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: '💼',
      color: 'bg-[#0A66C2]',
      hoverColor: 'hover:bg-[#004182]',
      getUrl: () => `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      icon: '📌',
      color: 'bg-[#E60023]',
      hoverColor: 'hover:bg-[#C8001E]',
      getUrl: () => `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`,
    },
    {
      id: 'reddit',
      name: 'Reddit',
      icon: '🔴',
      color: 'bg-[#FF4500]',
      hoverColor: 'hover:bg-[#E03D00]',
      getUrl: () => `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    },
    {
      id: 'email',
      name: 'Email',
      icon: '📧',
      color: 'bg-gray-600',
      hoverColor: 'hover:bg-gray-700',
      getUrl: () => `mailto:?subject=${encodedTitle}&body=${encodedText}`,
    },
    {
      id: 'sms',
      name: 'SMS',
      icon: '💬',
      color: 'bg-green-600',
      hoverColor: 'hover:bg-green-700',
      getUrl: () => `sms:?body=${encodedText}`,
    },
  ];
}

// ── Native Share API ──────────────────────────────────────
export async function triggerNativeShare({
  title,
  description,
  type = 'general',
  url,
}: {
  title: string;
  description?: string;
  type?: ShareContentType;
  url: string;
}): Promise<boolean> {
  const fullUrl = url.startsWith('http') ? url : `${SITE_URL}${url}`;
  const shareText = buildShareText({ title, description, type, url });

  if ('share' in navigator) {
    try {
      await navigator.share({
        title,
        text: shareText,
        url: fullUrl,
      });
      return true;
    } catch (error) {
      if ((error as Error).name === 'AbortError') return false;
    }
  }
  return false;
}

// ── Copy to clipboard ─────────────────────────────────────
export async function copyShareText({
  title,
  description,
  type = 'general',
  url,
}: {
  title: string;
  description?: string;
  type?: ShareContentType;
  url: string;
}): Promise<boolean> {
  const text = buildShareText({ title, description, type, url });
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  }
}

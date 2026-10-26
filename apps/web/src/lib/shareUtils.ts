'use client';

// ── Play Store Download Link (Branded Short Link) ──────────────────────────────
const APP_DOWNLOAD_LINK = 'https://www.myprayertower.com/app';
const SITE_URL = 'https://www.myprayertower.com';

// ── Content Types ─────────────────────────────────────────
export type ShareContentType = 'prayer' | 'saint' | 'reading' | 'candle' | 'memorial' | 'rosary' | 'novena' | 'general';

// ── Emotional Templates ───────────────────────────────────
const EMOTIONAL_TEMPLATES: Record<ShareContentType, string[]> = {
  prayer: [
    '🙏 This powerful prayer brought profound peace to my soul today. Sharing it with you in faith and love.',
    '🙏 I prayed this today and felt God\'s grace and strength. May it bless your heart as well.',
    '🙏 Words that lift the soul directly to Heaven. Sharing this sacred prayer with you.',
  ],
  saint: [
    '⭐ The inspiring life of this saint reminds us that holiness and miracles are possible today.',
    '✝️ What an incredible testament of faith! Read about this saint\'s holy life and patronage.',
    '🌟 Saints show us the path to Christ. Be inspired by this holy journey.',
  ],
  reading: [
    '📖 Today\'s Scripture spoke directly to my life. Read God\'s Word and be filled with hope.',
    '📖 The Holy Word of God for today. Let it illuminate your path and bring wisdom.',
    '📖 Such comforting Scripture today. Sharing this daily reading with you.',
  ],
  candle: [
    '🕯️ I just lit a perpetual candle of hope and intercession on MyPrayerTower. Join me in prayer.',
    '🕯️ A sacred candle burns for a special intention close to my heart. Light yours in solidarity.',
  ],
  memorial: [
    '🕊️ Remembering a beloved soul with holy prayers. May perpetual light shine upon them.',
    '🕊️ In loving memory and prayer. Pray with us for the eternal repose of this soul.',
  ],
  rosary: [
    '📿 The Holy Rosary brings deep serenity and protection. Pray today\'s mysteries with me.',
    '📿 I just completed the Holy Rosary on MyPrayerTower with the virtual decade tracker. Join me in prayer.',
  ],
  novena: [
    '🙏 Day by day, prayer by prayer — this 9-day novena is strengthening our family\'s faith.',
    '🙏 Nine days of focused prayer for an urgent intention. Join this novena with us.',
  ],
  general: [
    '✝️ This sacred Catholic & Christian treasury is enriching my prayer life. Sharing it with love.',
    '✝️ A sanctuary of over 3,900+ traditional prayers for every occasion, crisis, and moment in life.',
  ],
};

// ── Get a random emotional intro ──────────────────────────
function getEmotionalIntro(type: ShareContentType): string {
  const templates = EMOTIONAL_TEMPLATES[type] || EMOTIONAL_TEMPLATES.general;
  return templates[Math.floor(Math.random() * templates.length)];
}

// ── Build share text with Watermark & Attribution ─────────
export function buildShareText({
  title,
  description,
  fullText,
  type = 'general',
  url,
  includeEmotionalIntro = true,
}: {
  title: string;
  description?: string;
  fullText?: string;
  type?: ShareContentType;
  url: string;
  includeEmotionalIntro?: boolean;
}): string {
  const fullUrl = url.startsWith('http') ? url : `${SITE_URL}${url}`;
  const intro = includeEmotionalIntro ? getEmotionalIntro(type) : '';

  let body = '';
  if (fullText) {
    const cleanFull = fullText.replace(/#+\s+/g, '').trim();
    // Cap at 1500 chars for sharing platforms to prevent truncation errors
    body = cleanFull.length > 1500 
      ? `\n${cleanFull.slice(0, 1500)}...\n\n[Read complete prayer & reflections on website]` 
      : `\n${cleanFull}\n`;
  } else if (description) {
    body = `\n${description.slice(0, 400)}${description.length > 400 ? '...' : ''}\n`;
  }

  const parts = [
    intro,
    '',
    `✨ *${title}*`,
    body,
    '🕊️ ——————————————————————————————',
    '🙏 *Prayed via MyPrayerTower* — The Universal Treasury of Prayers',
    '📖 Over 4,000+ prayers for every occasion, crisis, function & moment in life:',
    `🔗 ${fullUrl}`,
    '🕊️ ——————————————————————————————',
    `📲 Android App: ${APP_DOWNLOAD_LINK}`,
    `💬 Join Daily Prayers on Telegram: https://t.me/myprayertower`,
  ].filter(Boolean);

  return parts.join('\n');
}

// ── Share Link Generators ─────────────────────────────────
export interface SharePlatform {
  id: string;
  name: string;
  icon: string;
  color: string;
  hoverColor: string;
  getUrl: (text: string, url: string, title: string) => string;
}

export function getSharePlatforms(text: string, url: string, title: string): SharePlatform[] {
  const fullUrl = url.startsWith('http') ? url : `${SITE_URL}${url}`;
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);

  // Short version for character-limited platforms like X (Twitter)
  const shortTwitterText = encodeURIComponent(
    `🙏 "${title}"\n\nPrayed via @MyPrayerTower — Universal Catholic & Christian Prayers:\n${fullUrl}`
  );

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
      getUrl: () => `https://twitter.com/intent/tweet?text=${shortTwitterText}`,
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
  fullText,
  type = 'general',
  url,
}: {
  title: string;
  description?: string;
  fullText?: string;
  type?: ShareContentType;
  url: string;
}): Promise<boolean> {
  const fullUrl = url.startsWith('http') ? url : `${SITE_URL}${url}`;
  const shareText = buildShareText({ title, description, fullText, type, url });

  if (typeof navigator !== 'undefined' && 'share' in navigator) {
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

// ── Copy to clipboard with Watermark ──────────────────────
export async function copyShareText({
  title,
  description,
  fullText,
  type = 'general',
  url,
}: {
  title: string;
  description?: string;
  fullText?: string;
  type?: ShareContentType;
  url: string;
}): Promise<boolean> {
  const text = buildShareText({ title, description, fullText, type, url });
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    throw new Error('Clipboard API unavailable');
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

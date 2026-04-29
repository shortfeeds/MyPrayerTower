'use client';

import { useState } from 'react';
import { Share2, Copy, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  buildShareText,
  getSharePlatforms,
  triggerNativeShare,
  copyShareText,
  type ShareContentType,
} from '@/lib/shareUtils';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  contentType?: ShareContentType;
  /** Button label */
  label?: string;
  /** Compact = single icon, full = labeled button */
  variant?: 'compact' | 'full' | 'cta';
  className?: string;
}

/**
 * Universal Social Share Component
 * Supports 10 platforms with emotional CTA and Play Store link
 */
export function ShareButtons({
  url,
  title,
  description = '',
  contentType = 'general',
  label = 'Share',
  variant = 'full',
  className = '',
}: ShareButtonsProps) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareText = buildShareText({ title, description, type: contentType, url });
  const platforms = getSharePlatforms(shareText, url, title);

  const handleShare = async () => {
    const shared = await triggerNativeShare({ title, description, type: contentType, url });
    if (!shared) {
      setShowModal(true);
    }
  };

  const handleCopy = async () => {
    await copyShareText({ title, description, type: contentType, url });
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // ── CTA Variant (emotional, large) ──
  if (variant === 'cta') {
    return (
      <>
        <button
          onClick={handleShare}
          className={`group flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-[#d4af37] to-amber-500 text-[#0a0612] font-black rounded-2xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 active:scale-95 transition-all ${className}`}
        >
          <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span>{label}</span>
        </button>
        <ShareModal
          show={showModal}
          onClose={() => setShowModal(false)}
          platforms={platforms}
          shareText={shareText}
          title={title}
          contentType={contentType}
          onCopy={handleCopy}
          copied={copied}
        />
      </>
    );
  }

  // ── Compact Variant (icon only) ──
  if (variant === 'compact') {
    return (
      <>
        <button
          onClick={handleShare}
          className={`p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all active:scale-90 ${className}`}
          aria-label="Share"
        >
          <Share2 size={18} />
        </button>
        <ShareModal
          show={showModal}
          onClose={() => setShowModal(false)}
          platforms={platforms}
          shareText={shareText}
          title={title}
          contentType={contentType}
          onCopy={handleCopy}
          copied={copied}
        />
      </>
    );
  }

  // ── Full Variant (default) ──
  return (
    <>
      <button
        onClick={handleShare}
        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 ${className}`}
      >
        <Share2 size={16} />
        {label}
      </button>
      <ShareModal
        show={showModal}
        onClose={() => setShowModal(false)}
        platforms={platforms}
        shareText={shareText}
        title={title}
        contentType={contentType}
        onCopy={handleCopy}
        copied={copied}
      />
    </>
  );
}

// ── Share Modal ───────────────────────────────────────────
function ShareModal({
  show,
  onClose,
  platforms,
  shareText,
  title,
  contentType,
  onCopy,
  copied,
}: {
  show: boolean;
  onClose: () => void;
  platforms: ReturnType<typeof getSharePlatforms>;
  shareText: string;
  title: string;
  contentType: ShareContentType;
  onCopy: () => void;
  copied: boolean;
}) {
  const ctaMessages: Record<ShareContentType, string> = {
    prayer: 'Share this prayer and spread God\'s love 🙏',
    saint: 'Inspire others with this saint\'s story ✝️',
    reading: 'Share today\'s Word of God 📖',
    candle: 'Invite others to light a candle 🕯️',
    memorial: 'Share this loving tribute 🕊️',
    rosary: 'Invite someone to pray the Rosary 📿',
    novena: 'Invite others to join this novena 🙏',
    general: 'Spread the faith — share with someone you love ❤️',
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-gray-900 w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#d4af37] to-amber-500 p-5 text-center relative">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-1.5 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-[#0a0612]" />
              </button>
              <p className="text-[#0a0612] font-black text-lg">
                {ctaMessages[contentType]}
              </p>
            </div>

            {/* Platforms Grid */}
            <div className="p-5">
              <div className="grid grid-cols-3 gap-3 mb-5">
                {platforms.map((platform) => (
                  <a
                    key={platform.id}
                    href={platform.getUrl(shareText, '', title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className={`flex flex-col items-center gap-2 p-4 ${platform.color} ${platform.hoverColor} text-white rounded-2xl transition-all active:scale-90 shadow-md`}
                  >
                    <span className="text-2xl">{platform.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">{platform.name}</span>
                  </a>
                ))}

                {/* Copy Button */}
                <button
                  onClick={onCopy}
                  className="flex flex-col items-center gap-2 p-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-2xl transition-all active:scale-90 shadow-md"
                >
                  <span className="text-2xl">{copied ? '✅' : '📋'}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {copied ? 'Copied!' : 'Copy'}
                  </span>
                </button>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 max-h-32 overflow-y-auto">
                <p className="text-[11px] text-gray-500 dark:text-gray-400 whitespace-pre-line leading-relaxed">
                  {shareText.slice(0, 300)}...
                </p>
              </div>

              {/* Download Link Reminder */}
              <p className="text-center text-[10px] text-gray-400 mt-3 font-medium">
                📲 Every share includes your app download link
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Simple share trigger (for headers/navbars)
 */
export function ShareTrigger({
  url,
  title,
  description,
  contentType = 'general',
  className = '',
}: {
  url: string;
  title: string;
  description?: string;
  contentType?: ShareContentType;
  className?: string;
}) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareText = buildShareText({ title, description, type: contentType, url });
  const platforms = getSharePlatforms(shareText, url, title);

  const handleShare = async () => {
    const shared = await triggerNativeShare({ title, description, type: contentType, url });
    if (!shared) setShowModal(true);
  };

  const handleCopy = async () => {
    await copyShareText({ title, description, type: contentType, url });
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <button
        onClick={handleShare}
        className={`inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors ${className}`}
      >
        <Share2 size={16} />
        <span>Share</span>
      </button>
      <ShareModal
        show={showModal}
        onClose={() => setShowModal(false)}
        platforms={platforms}
        shareText={shareText}
        title={title}
        contentType={contentType}
        onCopy={handleCopy}
        copied={copied}
      />
    </>
  );
}

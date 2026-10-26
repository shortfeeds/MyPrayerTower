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
  type SharePlatform,
} from '@/lib/shareUtils';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  fullText?: string;
  contentType?: ShareContentType;
  /** Button label */
  label?: string;
  /** Compact = single icon, full = labeled button, cta = high-impact multi-button */
  variant?: 'compact' | 'full' | 'cta';
  className?: string;
}

/**
 * Universal Social Share Component
 * Supports direct WhatsApp, Instagram/Telegram/FB, and clipboard copy
 */
export function ShareButtons({
  url,
  title,
  description = '',
  fullText,
  contentType = 'general',
  label = 'Share Prayer',
  variant = 'full',
  className = '',
}: ShareButtonsProps) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareText = buildShareText({ title, description, fullText, type: contentType, url });
  const platforms = getSharePlatforms(shareText, url, title);
  const whatsappPlatform = platforms.find((p) => p.id === 'whatsapp');

  const handleShare = async () => {
    const shared = await triggerNativeShare({ title, description, fullText, type: contentType, url });
    if (!shared) {
      setShowModal(true);
    }
  };

  const handleWhatsApp = () => {
    if (whatsappPlatform) {
      window.open(whatsappPlatform.getUrl(shareText, url, title), '_blank');
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  const handleCopy = async () => {
    await copyShareText({ title, description, fullText, type: contentType, url });
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // ── CTA Variant (for Prayer Pages, Novenas, Saints) ──
  if (variant === 'cta') {
    return (
      <>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Direct 1-Click WhatsApp Share */}
          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-2.5 px-6 py-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95 text-sm"
            title="Share to WhatsApp Prayer Groups"
          >
            <span className="text-base">💬</span>
            <span>Share on WhatsApp</span>
          </button>

          {/* Universal Share Button */}
          <button
            onClick={handleShare}
            className={`group flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-gold-500 to-amber-500 text-sacred-950 font-bold rounded-2xl shadow-md hover:shadow-lg active:scale-95 transition-all text-sm ${className}`}
          >
            <Share2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span>{label}</span>
          </button>

          {/* Copy Prayer Text */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-5 py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-2xl transition-all active:scale-95 text-sm border border-gray-200 dark:border-gray-700"
            title="Copy prayer text with reference link"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Prayer'}</span>
          </button>
        </div>

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

/**
 * Enhanced Share Modal with Platform Buttons
 */
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
  platforms: SharePlatform[];
  shareText: string;
  title: string;
  contentType: ShareContentType;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white dark:bg-[#120d1c] border border-gray-100 dark:border-white/10 rounded-3xl p-6 shadow-2xl relative"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <span className="text-2xl mb-2 block">🕊️</span>
              <h3 className="text-lg font-serif font-bold text-gray-900 dark:text-white">
                Share this {contentType}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                {title}
              </p>
            </div>

            {/* Platforms Grid */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {platforms.map((p) => (
                <a
                  key={p.id}
                  href={p.getUrl(shareText, '', title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-center group active:scale-95"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">
                    {p.icon}
                  </span>
                  <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">
                    {p.name}
                  </span>
                </a>
              ))}
            </div>

            {/* Copy Link Section */}
            <div className="border-t border-gray-100 dark:border-white/10 pt-4">
              <button
                onClick={onCopy}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors text-sm shadow-md"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Prayer Text & Link'}</span>
              </button>
              <p className="text-center text-[10px] text-gray-400 mt-3 font-medium">
                📲 Every share includes a direct prayer link and app download
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

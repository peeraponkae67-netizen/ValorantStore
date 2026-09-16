'use client';

import React, { useState, useEffect } from 'react';
import { SkinOffer } from '@/types/valorant';
import { X, Search, Bookmark, Trash2, Bell, Check, Sparkles, Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: SkinOffer[];
  onRemoveFromWishlist: (uuid: string) => void;
  onAddToWishlist: (skin: any) => void;
  storeSkinUuids: string[];
  player?: {
    name: string;
    tag: string;
    region: string;
  };
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onAddToWishlist,
  storeSkinUuids,
  player,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Discord Webhook state
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookEnabled, setWebhookEnabled] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookFeedback, setWebhookFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    try {
      const savedUrl = localStorage.getItem('vlr_discord_webhook') || '';
      const savedEnabled = localStorage.getItem('vlr_discord_webhook_enabled') === 'true';
      setWebhookUrl(savedUrl);
      setWebhookEnabled(savedEnabled);
    } catch (e) {
      console.warn('Failed to load webhook config', e);
    }
  }, []);

  const handleSaveWebhook = (url: string, enabled: boolean) => {
    setWebhookUrl(url);
    setWebhookEnabled(enabled);
    try {
      localStorage.setItem('vlr_discord_webhook', url.trim());
      localStorage.setItem('vlr_discord_webhook_enabled', enabled ? 'true' : 'false');
    } catch (e) {
      console.warn('Failed to save webhook config', e);
    }
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl.trim()) {
      setWebhookFeedback({ type: 'error', message: 'กรุณากรอก Discord Webhook URL ก่อนทดสอบ' });
      return;
    }
    setIsTestingWebhook(true);
    setWebhookFeedback(null);
    try {
      const res = await fetch('/api/discord/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl: webhookUrl.trim(),
          testOnly: true,
          player,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setWebhookFeedback({ type: 'success', message: 'ส่งข้อความทดสอบเข้า Discord สำเร็จแล้ว!' });
      } else {
        setWebhookFeedback({ type: 'error', message: data.error || 'ส่งไม่สำเร็จ ตรวจสอบ URL อีกครั้ง' });
      }
    } catch (err: any) {
      setWebhookFeedback({ type: 'error', message: err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ' });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/valorant/skins?q=${encodeURIComponent(searchQuery)}`);
        const json = await res.json();
        if (json.success) {
          setSearchResults(json.skins || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0F1923] border border-[#23303d] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#23303d] bg-[#0b1015]/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#ff4655]/15 text-[#ff4655] rounded-lg">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase text-white font-mono">
                Skin Wishlist & Alerts
              </h3>
              <p className="text-xs text-[#8b978f]">
                Track your dream skins. Get highlighted when they hit your Daily Store.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#8b978f] hover:text-white bg-[#15222E] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6 border-b border-[#23303d] bg-[#121c26]">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b978f]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Valorant skins to add (e.g. Kuronami, Prime, Reaver)..."
              className="w-full bg-[#0b1015] border border-[#23303d] focus:border-[#ff4655] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#8b978f] outline-none transition-colors"
            />
          </div>

          {/* Search Dropdown / Results */}
          {searchQuery && (
            <div className="mt-3 max-h-48 overflow-y-auto space-y-1 rounded-xl bg-[#0b1015] border border-[#23303d] p-2">
              {isSearching ? (
                <div className="p-3 text-center text-xs text-[#8b978f]">Searching skins...</div>
              ) : searchResults.length === 0 ? (
                <div className="p-3 text-center text-xs text-[#8b978f]">No skins found.</div>
              ) : (
                searchResults.map((skin) => {
                  const alreadyInList = wishlist.some((w) => w.uuid === skin.uuid);
                  return (
                    <div
                      key={skin.uuid}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-[#15222e] transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {skin.displayIcon && (
                          <img
                            src={skin.displayIcon}
                            alt={skin.displayName}
                            className="w-10 h-6 object-contain flex-shrink-0"
                          />
                        )}
                        <span className="text-xs font-semibold text-white truncate">
                          {skin.displayName}
                        </span>
                      </div>

                      <button
                        onClick={() => onAddToWishlist(skin)}
                        disabled={alreadyInList}
                        className={`px-3 py-1 rounded text-xs font-bold uppercase transition-all ${
                          alreadyInList
                            ? 'bg-emerald-500/20 text-emerald-300 cursor-default'
                            : 'bg-[#ff4655] hover:bg-[#e03645] text-white'
                        }`}
                      >
                        {alreadyInList ? 'Tracked' : '+ Add'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Current Wishlist Items */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#8b978f]">
              Active Tracked Skins ({wishlist.length})
            </span>
          </div>

          {wishlist.length === 0 ? (
            <div className="py-6 text-center text-sm text-[#8b978f]">
              No skins in your wishlist yet. Search above to track your favorite weapons!
            </div>
          ) : (
            wishlist.map((skin) => {
              const inStoreToday = storeSkinUuids.includes(skin.uuid);
              return (
                <div
                  key={skin.uuid}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    inStoreToday
                      ? 'bg-[#ff4655]/10 border-[#ff4655] shadow-[0_0_12px_rgba(255,70,85,0.2)]'
                      : 'bg-[#14202c] border-[#23303d]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={skin.displayIcon}
                      alt={skin.displayName}
                      className="w-14 h-8 object-contain flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white truncate">
                          {skin.displayName}
                        </span>
                        {inStoreToday && (
                          <span className="px-1.5 py-0.5 rounded bg-[#ff4655] text-white text-[10px] font-extrabold uppercase animate-pulse">
                            IN STORE TODAY!
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#8b978f] font-mono">
                        {skin.price ? `${skin.price.toLocaleString()} VP` : 'Weapon Skin'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveFromWishlist(skin.uuid)}
                    className="p-2 text-[#8b978f] hover:text-[#ff4655] hover:bg-[#ff4655]/10 rounded-lg transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Discord Webhook Settings Card */}
        <div className="p-4 sm:p-5 bg-[#0b1015] border-t border-[#23303d] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#5865F2]/20 flex items-center justify-center text-[#5865F2]">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                การแจ้งเตือน Discord (Discord Webhook Alert)
              </h4>
            </div>

            {/* Toggle switch */}
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <span className="text-[#8b978f] font-medium hidden sm:inline">แจ้งเตือนอัตโนมัติ</span>
              <input
                type="checkbox"
                checked={webhookEnabled}
                onChange={(e) => handleSaveWebhook(webhookUrl, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[#23303d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5865F2] relative"></div>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => handleSaveWebhook(e.target.value, webhookEnabled)}
              placeholder="https://discord.com/api/webhooks/..."
              className="flex-1 bg-[#121c26] border border-[#23303d] focus:border-[#5865F2] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#5e6c79] outline-none transition-colors font-mono"
            />
            <button
              type="button"
              onClick={handleTestWebhook}
              disabled={isTestingWebhook}
              className="px-3.5 py-2 bg-[#5865F2] hover:bg-[#4752c4] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 flex-shrink-0 shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isTestingWebhook ? 'กำลังส่ง...' : 'ทดสอบส่ง'}</span>
            </button>
          </div>

          {webhookFeedback && (
            <div
              className={`flex items-center gap-2 p-2 rounded-lg text-xs animate-in fade-in ${
                webhookFeedback.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/10 text-red-400 border border-red-500/30'
              }`}
            >
              {webhookFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{webhookFeedback.message}</span>
            </div>
          )}

          <p className="text-[11px] text-[#8b978f] leading-normal">
            💡 <strong className="text-white">วิธีรับลิงก์:</strong> ใน Discord คลิกตั้งค่าห้อง (Edit Channel) &gt; Integrations &gt; Webhooks &gt; New Webhook &gt; Copy Webhook URL แล้วนำมาวางที่นี่
          </p>
        </div>
      </div>
    </div>
  );
};

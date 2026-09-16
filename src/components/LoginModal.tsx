'use client';

import React, { useState, useEffect } from 'react';
import { Region, RiotSession, SavedAccount } from '@/types/valorant';
import { REGION_SHARDS, VALORANT_CURRENCIES } from '@/lib/constants';
import {
  AlertCircle,
  ArrowRight,
  ExternalLink,
  ClipboardPaste,
  Sparkles,
  Play,
  Users,
  UserPlus,
  Trash2,
  LogIn,
  Shield,
  ChevronLeft,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TutorialModal } from '@/components/TutorialModal';
import Image from 'next/image';

interface LoginModalProps {
  onLoginSuccess: (
    session: RiotSession | null,
    isDemo: boolean,
    demoConfig?: { name: string; tag: string; region: Region }
  ) => void;
  isLoading: boolean;
  externalError?: string;
  savedAccounts?: SavedAccount[];
  onSelectAccount?: (account: SavedAccount) => void;
  onDeleteAccount?: (puuid: string) => void;
  isAddingNewAccount?: boolean;
  onToggleAddNewAccount?: (show: boolean) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  onLoginSuccess,
  isLoading,
  externalError,
  savedAccounts = [],
  onSelectAccount,
  onDeleteAccount,
  isAddingNewAccount = false,
  onToggleAddNewAccount,
}) => {
  const { language, t } = useLanguage();

  const [tokenInput, setTokenInput] = useState('');
  const [region, setRegion] = useState<Region>('ap');
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [confirmDeletePuuid, setConfirmDeletePuuid] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Sync external error
  useEffect(() => {
    if (externalError) {
      setErrorMessage(externalError);
    }
  }, [externalError]);

  const riotAuthUrl =
    'https://auth.riotgames.com/authorize?redirect_uri=https%3A%2F%2Fplayvalorant.com%2Fopt_in&client_id=play-valorant-web-prod&response_type=token%20id_token&nonce=1&scope=account%20openid&prompt=login';

  // Direct Token Submit
  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let token = tokenInput.trim();
    if (!token) {
      setErrorMessage(language === 'th' ? 'กรุณาวางลิงก์หรือโทเค็นก่อนครับ' : 'Please provide a link or token');
      return;
    }

    if (token.includes('access_token=')) {
      const match = token.match(/access_token=([^&]+)/);
      if (match && match[1]) {
        token = match[1];
      }
    }

    // Validate token format
    if (!token.startsWith('ey') || token.includes(' ') || token.includes('\n') || token.length < 50) {
      setErrorMessage(
        language === 'th'
          ? 'ข้อความที่วางไม่ใช่โทเค็นของ Riot ครับ! กรุณากดปุ่มเปิดหน้าล็อกอิน Riot ด้านบน ล็อกอินให้เสร็จ แล้วคัดลอก URL จากแถบที่อยู่ของเบราว์เซอร์ (https://playvalorant.com/opt_in#access_token=...)'
          : 'The text is not a valid Riot token. Please copy the full URL from the official Riot page.'
      );
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    setStatusMessage(language === 'th' ? 'กำลังเชื่อมต่อบัญชี Riot...' : 'Connecting to Riot account...');

    try {
      const res = await fetch('/api/riot/token-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: token, region }),
      });

      const data = await res.json();
      if (data.success && data.session) {
        onLoginSuccess(data.session, false);
      } else {
        setErrorMessage(data.error || 'Failed to initialize session with provided token.');
        setStatusMessage('');
      }
    } catch {
      setErrorMessage('Network error during token login.');
      setStatusMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasteFromClipboard = async () => {
    setErrorMessage('');
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setTokenInput(text.trim());
          return;
        }
      }
    } catch (e) {
      console.warn('Clipboard read error', e);
    }
  };

  const hasSavedAccounts = savedAccounts.length > 0;
  const showSavedAccountsView = hasSavedAccounts && !isAddingNewAccount;

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-lg bg-[#0F1923] border border-[#23303d] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="relative p-6 sm:p-7 bg-gradient-to-b from-[#15222E] to-[#0F1923] border-b border-[#23303d] text-center">
          <div className="mx-auto relative w-16 h-16 mb-3">
            <Image
              src="/logo.jpg"
              alt="Valorant Logo"
              fill
              priority
              className="object-cover rounded-full shadow-[0_0_25px_rgba(255,70,85,0.45)]"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wider">
            {showSavedAccountsView
              ? (language === 'th' ? 'เลือกบัญชีผู้ใช้' : 'Select Account')
              : t.login.title}
          </h2>
          <p className="text-xs text-[#8b978f] mt-1 max-w-sm mx-auto leading-relaxed">
            {showSavedAccountsView
              ? (language === 'th'
                  ? `พบบัญชีที่เคยเข้าใช้งาน ${savedAccounts.length} บัญชีในเครื่องนี้ คลิกเพื่อเข้าสู่ระบบทันที`
                  : `Found ${savedAccounts.length} saved accounts on this device. Click to log in.`)
              : t.login.subtitle}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-8 space-y-4">
          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-[#ff4655]/15 border border-[#ff4655]/40 text-xs text-[#ff4655] flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Status Message */}
          {statusMessage && (
            <div className="p-3.5 rounded-xl bg-[#00ffcc]/10 border border-[#00ffcc]/30 text-xs text-[#00ffcc] flex items-center gap-2.5 animate-in fade-in">
              <Sparkles className="w-4 h-4 animate-spin flex-shrink-0" />
              <span className="font-semibold">{statusMessage}</span>
            </div>
          )}

          {/* VIEW 1: SAVED ACCOUNTS SELECTION */}
          {showSavedAccountsView ? (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#8b978f] uppercase font-mono px-1">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#ff4655]" />
                  {language === 'th' ? 'บัญชีที่บันทึกไว้' : 'Saved Accounts'} ({savedAccounts.length})
                </span>
                <span className="text-[11px] text-[#5c6974] font-normal lowercase">1-click login</span>
              </div>

              {/* Accounts list */}
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-0.5">
                {savedAccounts.map((acc) => {
                  const isConfirming = confirmDeletePuuid === acc.puuid;

                  return (
                    <div
                      key={acc.puuid}
                      className="group relative p-3.5 rounded-2xl border border-[#23303d] bg-[#131d27] hover:border-[#ff4655]/50 hover:bg-[#162330] transition-all flex items-center justify-between gap-3 shadow-md"
                    >
                      {/* Left: Avatar + Details */}
                      <button
                        type="button"
                        onClick={() => onSelectAccount && onSelectAccount(acc)}
                        disabled={isLoading}
                        className="flex items-center gap-3.5 min-w-0 flex-1 text-left cursor-pointer"
                      >
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#2a3848] flex-shrink-0 bg-[#0d151c] group-hover:border-[#ff4655]/60 transition-colors shadow">
                          {acc.playerCard ? (
                            <img
                              src={acc.playerCard}
                              alt={acc.gameName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-black text-white/50 text-sm">
                              {acc.gameName.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-white truncate group-hover:text-[#ff4655] transition-colors">
                              {acc.gameName}
                            </span>
                            <span className="text-xs text-[#8b978f] font-mono">
                              #{acc.tagLine}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 bg-[#0b1015] text-[#8b978f] rounded border border-[#1e2a36]">
                              {acc.region.toUpperCase()}
                            </span>
                            {acc.level && (
                              <span className="text-[10px] font-mono text-[#f1b82d] font-bold">
                                LV. {acc.level}
                              </span>
                            )}
                            {acc.cachedStore?.wallet?.vp !== undefined && (
                              <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#ece8e1]">
                                <img
                                  src={VALORANT_CURRENCIES.VP.icon}
                                  alt="VP"
                                  className="w-3 h-3 object-contain"
                                />
                                <span>{acc.cachedStore.wallet.vp.toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </button>

                      {/* Right: Action Buttons */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {isConfirming ? (
                          <div className="flex items-center gap-1 animate-in fade-in">
                            <button
                              type="button"
                              onClick={() => {
                                if (onDeleteAccount) onDeleteAccount(acc.puuid);
                                setConfirmDeletePuuid(null);
                              }}
                              className="px-2.5 py-1.5 bg-[#ff4655] hover:bg-[#ff5865] text-white rounded-lg text-xs font-bold transition-colors"
                            >
                              {language === 'th' ? 'ลบ' : 'Del'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeletePuuid(null)}
                              className="px-2 py-1.5 bg-[#1f2e3d] hover:bg-[#2b3d4f] text-[#8b978f] hover:text-white rounded-lg text-xs transition-colors"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => onSelectAccount && onSelectAccount(acc)}
                              disabled={isLoading}
                              className="px-3.5 py-2 rounded-xl bg-[#ff4655]/15 hover:bg-[#ff4655] text-[#ff4655] hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-[#ff4655]/30 hover:shadow-[0_0_12px_rgba(255,70,85,0.4)]"
                            >
                              <LogIn className="w-3.5 h-3.5" />
                              <span>{language === 'th' ? 'เข้าสู่ระบบ' : 'Login'}</span>
                            </button>

                            {onDeleteAccount && (
                              <button
                                type="button"
                                onClick={() => setConfirmDeletePuuid(acc.puuid)}
                                className="p-2 text-[#5c6974] hover:text-[#ff4655] hover:bg-[#1f2c39] rounded-lg transition-colors cursor-pointer"
                                title="ลบบัญชีออกจากเครื่องนี้"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add / Login New Account Button */}
              <button
                type="button"
                onClick={() => onToggleAddNewAccount && onToggleAddNewAccount(true)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#15222E] hover:bg-[#1a2b3b] border border-[#23303d] hover:border-[#ff4655]/50 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm mt-1"
              >
                <UserPlus className="w-4 h-4 text-[#ff4655]" />
                <span>{language === 'th' ? 'เข้าสู่ระบบด้วยบัญชีอื่น / กรอก Token ใหม่' : 'Login with Another Account / New Token'}</span>
              </button>

              {/* Tutorial Video Banner Button */}
              <button
                type="button"
                onClick={() => setIsTutorialOpen(true)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#111a22] hover:bg-[#15222E] border border-[#23303d] hover:border-[#ff4655]/60 text-white transition-all group cursor-pointer shadow-md mt-2"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-[#ff4655]/20 text-[#ff4655] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#ff4655] group-hover:text-white transition-all shadow-sm">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold font-mono tracking-wide text-white group-hover:text-[#ff4655] transition-colors">
                      {language === 'th' ? '🎬 ดูคลิปสอนวิธีเข้าสู่ระบบ' : '🎬 Watch Login Video Tutorial'}
                    </div>
                    <p className="text-[10px] text-[#8b978f]">
                      {language === 'th' ? 'กดดูคลิปวิดีโอสอนล็อกอินและรับ Token ง่ายๆ' : 'Click to watch how to log in step-by-step'}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#ff4655] group-hover:translate-x-1 transition-transform font-mono">
                  {language === 'th' ? 'ดูคลิป ➔' : 'Play ➔'}
                </span>
              </button>
            </div>
          ) : (
            /* VIEW 2: NEW ACCOUNT / TOKEN FORM */
            <form onSubmit={handleTokenSubmit} className="space-y-4">
              {/* Back to Saved Accounts button if accounts exist */}
              {hasSavedAccounts && (
                <button
                  type="button"
                  onClick={() => onToggleAddNewAccount && onToggleAddNewAccount(false)}
                  className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#ff4655] hover:underline cursor-pointer mb-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>
                    {language === 'th'
                      ? `กลับไปเลือกบัญชีที่บันทึกไว้ (${savedAccounts.length} บัญชี)`
                      : `Back to Saved Accounts (${savedAccounts.length})`}
                  </span>
                </button>
              )}

              {/* Step 1: Open Riot Login */}
              <div className="p-4 bg-[#15222E] border border-[#23303d] rounded-2xl space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase font-mono">
                  <span className="w-5 h-5 rounded-full bg-[#ff4655] text-white flex items-center justify-center text-[11px] font-bold">
                    1
                  </span>
                  <span>{t.login.step1Title}</span>
                </div>
                <p className="text-[11px] sm:text-xs text-[#8b978f] leading-relaxed">
                  {t.login.step1Desc}
                </p>
                <a
                  href={riotAuthUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#ff4655] hover:bg-[#ff5865] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(255,70,85,0.35)] cursor-pointer"
                >
                  <span>{t.login.step1Btn}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Step 2: Paste URL in Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-white uppercase font-mono">
                    <span className="w-5 h-5 rounded-full bg-[#ff4655] text-white flex items-center justify-center text-[11px] font-bold">
                      2
                    </span>
                    <span>{t.login.step2Title}</span>
                  </div>

                  {/* Quick Paste Button */}
                  <button
                    type="button"
                    onClick={handlePasteFromClipboard}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#00ffcc] hover:text-[#33ffd6] bg-[#00ffcc]/10 hover:bg-[#00ffcc]/20 border border-[#00ffcc]/30 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                    title="วางจากคลิปบอร์ด"
                  >
                    <ClipboardPaste className="w-3 h-3" />
                    <span>{language === 'th' ? 'วางทันที' : 'Paste'}</span>
                  </button>
                </div>

                <textarea
                  rows={3}
                  required
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder={t.login.step2Placeholder}
                  className="w-full bg-[#0b1015] border border-[#23303d] focus:border-[#ff4655] rounded-xl p-3 text-xs text-white font-mono placeholder-[#5d6c77] outline-none resize-none leading-relaxed"
                />

                <p className="text-[11px] text-[#8b978f] leading-relaxed">
                  {t.login.step2Note}
                </p>
              </div>

              {/* Region Selection */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8b978f] mb-1.5">
                  {t.login.regionLabel}
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value as Region)}
                  className="w-full bg-[#0b1015] border border-[#23303d] focus:border-[#ff4655] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white outline-none capitalize cursor-pointer"
                >
                  {Object.entries(REGION_SHARDS).map(([key, info]) => (
                    <option key={key} value={key} className="bg-[#0b1015]">
                      {key.toUpperCase()} - {info.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full btn-valorant py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-2 disabled:opacity-50"
              >
                {isSubmitting || isLoading ? (
                  <span>{t.login.loadingBtn}</span>
                ) : (
                  <>
                    <span>{t.login.loginBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Tutorial Video Banner Button */}
              <button
                type="button"
                onClick={() => setIsTutorialOpen(true)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#111a22] hover:bg-[#15222E] border border-[#23303d] hover:border-[#ff4655]/60 text-white transition-all group cursor-pointer shadow-md mt-2"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-[#ff4655]/20 text-[#ff4655] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#ff4655] group-hover:text-white transition-all shadow-sm">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold font-mono tracking-wide text-white group-hover:text-[#ff4655] transition-colors">
                      {language === 'th' ? '🎬 ดูคลิปสอนวิธีเข้าสู่ระบบ' : '🎬 Watch Login Video Tutorial'}
                    </div>
                    <p className="text-[10px] text-[#8b978f]">
                      {language === 'th' ? 'กดดูคลิปวิดีโอสอนล็อกอินและรับ Token ง่ายๆ' : 'Click to watch how to log in step-by-step'}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#ff4655] group-hover:translate-x-1 transition-transform font-mono">
                  {language === 'th' ? 'ดูคลิป ➔' : 'Play ➔'}
                </span>
              </button>
            </form>
          )}
        </div>

        {/* Security / Footer */}
        <div className="p-4 bg-[#080c10] border-t border-[#23303d] text-[11px] text-[#8b978f] flex items-center justify-between">
          <span>Non-commercial client</span>
          <a
            href="https://www.instagram.com/peerap0nn_/"
            target="_blank"
            rel="noreferrer"
            className="text-[#ff4655] font-semibold hover:underline"
          >
            by @peerap0nn_
          </a>
        </div>
      </div>

      {/* Video Tutorial Modal */}
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />
    </div>
  );
};

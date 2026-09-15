'use client';

import React, { useState } from 'react';
import { Region, RiotSession } from '@/types/valorant';
import { REGION_SHARDS } from '@/lib/constants';
import { Lock, User, Key, Globe, ShieldAlert, Sparkles, AlertCircle, ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react';

import { useLanguage } from '@/contexts/LanguageContext';

import Image from 'next/image';

interface LoginModalProps {
  onLoginSuccess: (session: RiotSession | null, isDemo: boolean, demoConfig?: { name: string; tag: string; region: Region }) => void;
  isLoading: boolean;
  externalError?: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLoginSuccess, isLoading, externalError }) => {
  const { t } = useLanguage();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync external error
  React.useEffect(() => {
    if (externalError) {
      setErrorMessage(externalError);
    }
  }, [externalError]);

  // Token login state
  const [tokenInput, setTokenInput] = useState('');
  const [region, setRegion] = useState<Region>('ap');

  // Direct Token Submit
  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      let token = tokenInput.trim();

      // If user pasted full redirect URL, automatically extract access_token
      if (token.includes('access_token=')) {
        const match = token.match(/access_token=([^&]+)/);
        if (match && match[1]) {
          token = match[1];
        }
      }

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
      }
    } catch {
      setErrorMessage('Network error during token login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const riotAuthUrl =
    'https://auth.riotgames.com/authorize?redirect_uri=https%3A%2F%2Fplayvalorant.com%2Fopt_in&client_id=play-valorant-web-prod&response_type=token%20id_token&nonce=1&scope=account%20openid&prompt=login';

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg bg-[#0F1923] border border-[#23303d] rounded-2xl shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-b from-[#15222E] to-[#0F1923] border-b border-[#23303d] text-center">
          <div className="mx-auto relative w-16 h-16 mb-4">
            <Image src="/logo.jpg" alt="Valorant Logo" fill priority className="object-cover rounded-full shadow-[0_0_20px_rgba(255,70,85,0.4)]" />
          </div>
          <h2 className="text-2xl font-black uppercase text-white font-mono tracking-wider">
            {t.login.title}
          </h2>
          <p className="text-xs text-[#8b978f] mt-1 max-w-sm mx-auto">
            {t.login.subtitle}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-[#ff4655]/15 border border-[#ff4655]/40 text-xs text-[#ff4655] flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Direct Token */}
          <form onSubmit={handleTokenSubmit} className="space-y-4">
              <div className="p-3.5 bg-[#15222E] border border-[#23303d] rounded-xl space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase font-mono">
                  <span className="w-5 h-5 rounded-full bg-[#ff4655] text-white flex items-center justify-center text-[11px]">
                    1
                  </span>
                  <span>{t.login.step1Title}</span>
                </div>
                <p className="text-[11px] text-[#8b978f]">
                  {t.login.step1Desc}
                </p>
                <a
                  href={riotAuthUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#ff4655]/15 hover:bg-[#ff4655]/25 border border-[#ff4655]/40 text-[#ff4655] font-bold text-xs rounded-lg transition-colors"
                >
                  <span>{t.login.step1Btn}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase font-mono mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#ff4655] text-white flex items-center justify-center text-[11px]">
                    2
                  </span>
                  <span>{t.login.step2Title}</span>
                </div>
                <textarea
                  rows={3}
                  required
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder={t.login.step2Placeholder}
                  className="w-full bg-[#0b1015] border border-[#23303d] focus:border-[#ff4655] rounded-xl p-3 text-xs text-white font-mono placeholder-[#5d6c77] outline-none resize-none"
                />
                <p className="text-[11px] text-[#8b978f] leading-relaxed">
                  {t.login.step2Note}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8b978f] mb-1.5">
                  {t.login.regionLabel}
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value as Region)}
                  className="w-full bg-[#0b1015] border border-[#23303d] focus:border-[#ff4655] rounded-xl px-4 py-2.5 text-sm text-white outline-none capitalize"
                >
                  {Object.entries(REGION_SHARDS).map(([key, info]) => (
                    <option key={key} value={key} className="bg-[#0b1015]">
                      {key.toUpperCase()} - {info.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-valorant py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>{t.login.loadingBtn}</span>
                ) : (
                  <>
                    <span>{t.login.loginBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>


        </div>

        {/* Security / Open Source Footer */}
        <div className="p-4 bg-[#080c10] border-t border-[#23303d] text-[11px] text-[#8b978f] flex items-center justify-between">
          <span>Non-commercial client</span>
          <a href="https://www.instagram.com/peerap0nn_/" target="_blank" rel="noreferrer" className="text-[#ff4655] font-semibold hover:underline">
            by @peerap0nn_
          </a>
        </div>
      </div>
    </div>
  );
};

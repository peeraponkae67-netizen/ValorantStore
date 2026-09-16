'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Film, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc?: string;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  videoSrc = '/videos/tutorial.mp4',
}) => {
  const { language } = useLanguage();
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Set default volume to 50% (ครึ่งนึง) whenever modal opens
  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.volume = 0.5;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#0F1923] border border-[#23303d] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#23303d] bg-[#0b1015]/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#ff4655]/15 text-[#ff4655] rounded-xl">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-mono">
                {language === 'th' ? 'วิดีโอสอนวิธีเข้าสู่ระบบ' : 'Login Tutorial Video'}
              </h3>
              <p className="text-[10px] sm:text-xs text-[#8b978f]">
                {language === 'th'
                  ? 'ดูขั้นตอนการล็อกอินและรับ Token ง่ายๆ ใน 1 นาที'
                  : 'Quick step-by-step tutorial on how to get your token'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-[#8b978f] hover:text-white bg-[#15222E] hover:bg-[#1f2e3d] border border-[#23303d] rounded-xl transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Video Area */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-[#23303d] shadow-inner flex items-center justify-center">
            {!hasError ? (
              <video
                ref={videoRef}
                src={videoSrc}
                controls
                autoPlay
                playsInline
                onLoadedMetadata={(e) => {
                  e.currentTarget.volume = 0.5;
                }}
                className="w-full h-full object-contain"
                onError={() => setHasError(true)}
              />
            ) : (
              <div className="text-center p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#ff4655]/10 border border-[#ff4655]/30 flex items-center justify-center mx-auto text-[#ff4655]">
                  <Film className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white font-mono">
                    {language === 'th' ? 'รอเพิ่มไฟล์วิดีโอ' : 'Video file not added yet'}
                  </p>
                  <p className="text-xs text-[#8b978f] max-w-sm mx-auto leading-relaxed">
                    {language === 'th'
                      ? 'นำไฟล์วิดีโอมาวางไว้ที่โฟลเดอร์ public/videos/tutorial.mp4 เพื่อให้วิดีโอแสดงที่นี่ทันที'
                      : 'Please place your video file at public/videos/tutorial.mp4'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Steps Recap */}
          <div className="p-3.5 sm:p-4 bg-[#111a22] border border-[#23303d] rounded-2xl space-y-2 text-xs">
            <h4 className="font-bold text-white font-mono uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-[#ff4655]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'th' ? 'สรุปขั้นตอนสั้นๆ' : 'Quick Steps'}</span>
            </h4>
            <ul className="space-y-1.5 text-[#8b978f] text-[11px] sm:text-xs leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-[#1e2c3a] text-white flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">
                  1
                </span>
                <span>
                  {language === 'th'
                    ? 'กดปุ่ม "เข้าสู่ระบบผ่านเว็บ Riot Games" เพื่อเปิดหน้าล็อกอินทางการของ Riot'
                    : 'Click "Open Riot Games Login" to open official Riot login.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-[#1e2c3a] text-white flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">
                  2
                </span>
                <span>
                  {language === 'th'
                    ? 'ล็อกอินบัญชีของคุณให้เสร็จสิ้น หน้าเว็บจะเปลี่ยนไปเป็น playvalorant.com'
                    : 'Complete login. The page will redirect to playvalorant.com.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-[#1e2c3a] text-white flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">
                  3
                </span>
                <span>
                  {language === 'th'
                    ? 'คัดลอกลิงก์ทั้งหมดจากแถบที่อยู่ (URL) แล้วกลับมาวางในช่องและกดเข้าสู่ระบบ'
                    : 'Copy the full URL from the address bar, paste into the box, and submit.'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useRef, useState } from 'react';
import { DailyStoreData } from '@/types/valorant';
import { VALORANT_CURRENCIES } from '@/lib/constants';
import { toPng, toBlob } from 'html-to-image';
import { X, Download, Copy, Check, Sparkles, Share2, Camera, Loader2 } from 'lucide-react';

interface ShareStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeData: DailyStoreData | null;
}

export const ShareStoreModal: React.FC<ShareStoreModalProps> = ({
  isOpen,
  onClose,
  storeData,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !storeData) return null;

  const todayDate = new Date().toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const totalVp = storeData.offers.reduce((acc, cur) => acc + cur.price, 0);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    setErrorMessage(null);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2, // High resolution
        quality: 0.95,
      });

      const link = document.createElement('a');
      link.download = `valorant-store-${storeData.player.name}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err: any) {
      console.error('Failed to export image', err);
      setErrorMessage('ไม่สามารถส่งออกรูปภาพได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopy = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    setErrorMessage(null);
    try {
      const blob = await toBlob(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

      if (!blob) throw new Error('Blob generation failed');

      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } else {
        throw new Error('ClipboardItem is not supported on this browser');
      }
    } catch (err: any) {
      console.error('Failed to copy to clipboard', err);
      // Fallback to download
      handleDownload();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0F1923] border border-[#23303d] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#23303d] bg-[#0b1015]/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#ff4655]/15 text-[#ff4655] rounded-lg">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase text-white font-mono tracking-wider">
                บันทึกรูปภาพเพื่อแชร์ (Export Store Card)
              </h3>
              <p className="text-[11px] text-[#8b978f]">
                พร้อมโพสต์ลง Discord, Instagram Story หรือ X ได้ทันที
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8b978f] hover:text-white bg-[#15222E] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Container with Preview */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-[#090d12]">
          {/* Card Preview (Captured Target) */}
          <div
            ref={cardRef}
            className="w-full max-w-[650px] bg-gradient-to-br from-[#121c26] via-[#0b1015] to-[#151c24] border-2 border-[#2b3a4a] rounded-2xl p-5 sm:p-6 text-white shadow-2xl relative overflow-hidden"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff4655] via-[#f1b82d] to-[#00e5ff]" />

            {/* Valorant Watermark Pattern */}
            <div className="absolute top-3 right-4 opacity-10 text-6xl font-black font-mono select-none pointer-events-none">
              VLR
            </div>

            {/* Header: Player Profile + Date */}
            <div className="flex items-center justify-between gap-3 border-b border-[#23303d] pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#ff4655]/50 flex-shrink-0 bg-[#070b0e]">
                  <img
                    src={storeData.player.playerCard}
                    alt={storeData.player.name}
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover scale-150"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-white tracking-wide">
                      {storeData.player.name}
                    </span>
                    <span className="text-xs text-[#8b978f] font-mono">
                      #{storeData.player.tag}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#8b978f] mt-0.5">
                    <span className="px-1.5 py-0.2 bg-[#ff4655]/20 text-[#ff4655] font-bold rounded text-[10px] uppercase">
                      {storeData.player.region}
                    </span>
                    <span>•</span>
                    <span>Level {storeData.player.level}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] uppercase font-mono tracking-widest text-[#ff4655] font-bold">
                  DAILY STORE
                </div>
                <div className="text-xs font-mono font-semibold text-[#ece8e1]">
                  {todayDate}
                </div>
              </div>
            </div>

            {/* 4 Offers Grid (2x2) */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {storeData.offers.map((offer, idx) => {
                const tierColor = offer.tier?.color || '#F1B82D';
                return (
                  <div
                    key={offer.uuid || idx}
                    className="relative bg-[#162330]/80 border border-[#263748] rounded-xl p-3 flex flex-col justify-between overflow-hidden group shadow-md"
                  >
                    {/* Tier top glow strip */}
                    <div
                      className="absolute top-0 inset-x-0 h-0.5"
                      style={{ backgroundColor: tierColor }}
                    />

                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="text-[9px] font-mono font-bold uppercase tracking-wider truncate max-w-[120px]"
                        style={{ color: tierColor }}
                      >
                        {offer.tier?.name || 'Edition'}
                      </span>
                      {offer.tier?.icon && (
                        <img
                          src={offer.tier.icon}
                          alt=""
                          crossOrigin="anonymous"
                          className="w-3.5 h-3.5 object-contain opacity-80"
                        />
                      )}
                    </div>

                    {/* Weapon Image */}
                    <div className="h-20 sm:h-24 w-full flex items-center justify-center my-1">
                      {(() => {
                        const rawIcon = offer.displayIcon;
                        const isBroken = !rawIcon || rawIcon.includes('7122d78b-4e60-eb4d-5f65-738d7c1ce9ae');
                        const offerImage = isBroken
                          ? offer.chromas?.[0]?.displayIcon ||
                            offer.chromas?.[0]?.fullRender ||
                            offer.levels?.[0]?.displayIcon ||
                            'https://media.valorant-api.com/weaponskinchromas/df1786b2-4f3d-f207-b92c-0780f4dffb79/displayicon.png'
                          : rawIcon;

                        return (
                          <img
                            src={offerImage}
                            alt={offer.displayName}
                            crossOrigin="anonymous"
                            className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.6)]"
                          />
                        );
                      })()}
                    </div>

                    {/* Weapon Name & Price */}
                    <div className="mt-1 pt-1.5 border-t border-[#23303d]/60 flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-[#ece8e1] truncate">
                        {offer.displayName}
                      </span>
                      <div className="flex items-center gap-1 font-mono font-bold text-xs text-white flex-shrink-0">
                        <img
                          src={VALORANT_CURRENCIES.VP.icon}
                          alt="VP"
                          crossOrigin="anonymous"
                          className="w-3.5 h-3.5 object-contain"
                        />
                        <span>{offer.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Summary: Total VP & Watermark */}
            <div className="flex items-center justify-between pt-3 border-t border-[#23303d] text-[11px] text-[#8b978f]">
              <div className="flex items-center gap-3">
                <span className="font-mono">
                  รวมมูลค่า: <strong className="text-white font-bold">{totalVp.toLocaleString()} VP</strong>
                </span>
                <span>•</span>
                <span className="font-mono">
                  VP คงเหลือ: <strong className="text-[#f1b82d] font-bold">{storeData.wallet.vp.toLocaleString()} VP</strong>
                </span>
              </div>
              <div className="text-[10px] font-mono text-[#5e6c79] flex items-center gap-1">
                <span>VALORANT Store by</span>
                <span className="text-[#ff4655] font-bold">@peerap0nn_</span>
              </div>
            </div>
          </div>

          {errorMessage && (
            <p className="text-xs text-red-400 mt-3">{errorMessage}</p>
          )}
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-[#0b1015] border-t border-[#23303d] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#8b978f] hidden sm:block">
            ✨ เรนเดอร์เป็นภาพความละเอียดสูง 2x รองรับการแปะบน Discord / IG
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopy}
              disabled={isExporting}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#162330] hover:bg-[#203244] border border-[#2e3f52] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">คัดลอกลงคลิปบอร์ดแล้ว!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#00e5ff]" />
                  <span>คัดลอกรูปภาพ</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={isExporting}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-[#ff4655] hover:bg-[#e03645] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#ff4655]/20"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>กำลังบันทึก...</span>
                </>
              ) : downloaded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>ดาวน์โหลดเสร็จแล้ว!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>ดาวน์โหลดรูปภาพ</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

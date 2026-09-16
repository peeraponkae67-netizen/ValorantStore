'use client';

import React, { useState, useEffect } from 'react';
import { FeaturedBundleData, SkinOffer } from '@/types/valorant';
import { VALORANT_CURRENCIES } from '@/lib/constants';
import { X, Sparkles, ShoppingBag, Check, Layers, Clock, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BundleModalProps {
  isOpen: boolean;
  onClose: () => void;
  bundle: FeaturedBundleData | null;
  onInspectSkin?: (skin: SkinOffer) => void;
}

export const BundleModal: React.FC<BundleModalProps> = ({
  isOpen,
  onClose,
  bundle,
  onInspectSkin,
}) => {
  const [purchased, setPurchased] = useState(false);
  const [diffInSec, setDiffInSec] = useState<number>(bundle?.remainingDuration || 0);

  useEffect(() => {
    setDiffInSec(bundle?.remainingDuration || 0);
    const timer = setInterval(() => {
      setDiffInSec((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [bundle?.remainingDuration]);

  if (!isOpen || !bundle) return null;

  const discount = bundle.originalPrice > bundle.price
    ? Math.round(((bundle.originalPrice - bundle.price) / bundle.originalPrice) * 100)
    : 0;

  const days = Math.floor(diffInSec / 86400);
  const hours = Math.floor((diffInSec % 86400) / 3600);
  const minutes = Math.floor((diffInSec % 3600) / 60);
  const seconds = diffInSec % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');

  const handleSimulatePurchase = () => {
    setPurchased(true);
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ff4655', '#f1b82d', '#00e5ff', '#ffffff'],
    });
    setTimeout(() => setPurchased(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0F1923] border border-[#23303d] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top gold line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#f1b82d] via-[#ff4655] to-[#f1b82d]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#23303d] bg-[#0b1015]/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#f1b82d]/15 text-[#f1b82d] rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-[#f1b82d] tracking-widest">
                  Featured Bundle Collection
                </span>
                {discount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.2 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                    Save {discount}%
                  </span>
                )}
                {diffInSec > 0 && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#0b1015] text-[#f1b82d] rounded-full border border-[#23303d] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#ff4655]" />
                    {days > 0 ? `${days} วัน ` : ''}{pad(hours)}:{pad(minutes)}:{pad(seconds)}
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wide">
                {bundle.displayName}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#8b978f] hover:text-white bg-[#15222E] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Big Hero Banner */}
          <div className="relative w-full h-48 sm:h-72 rounded-2xl overflow-hidden border border-[#23303d] bg-gradient-to-r from-[#0b1015] to-[#14202c] shadow-lg group flex items-center justify-center">
            <img
              src={bundle.displayIcon}
              alt={bundle.displayName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1923] via-transparent to-transparent" />

            <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
              <div>
                <span className="text-xs font-mono font-bold uppercase text-[#f1b82d] tracking-widest">
                  LIMITED TIME CAPSULE / BUNDLE
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight drop-shadow-md">
                  {bundle.displayName}
                </h3>
              </div>
            </div>
          </div>

          {/* Collection Items Header */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8b978f] font-mono">
                ไอเทมทั้งหมดในคอลเลกชัน ({bundle.items?.length || 0} ชิ้น)
              </h4>
              <span className="text-xs text-[#8b978f]">
                {bundle.items?.length > 0 ? 'คลิกที่ไอเทมเพื่อตรวจดูรายละเอียด' : 'ไอเทมทั้งหมดขายรวมเป็นเซ็ต'}
              </span>
            </div>

            {/* Items Grid */}
            {bundle.items && bundle.items.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {bundle.items.map((item, idx) => {
                  return (
                    <div
                      key={item.uuid || idx}
                      onClick={() => {
                        if (onInspectSkin) onInspectSkin(item);
                      }}
                      className="relative p-3.5 rounded-xl border transition-all flex flex-col justify-between bg-[#121c26] border-[#23303d] hover:border-[#ff4655] hover:bg-[#162330] cursor-pointer group hover:shadow-[0_0_15px_rgba(255,70,85,0.15)]"
                    >
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="text-[10px] font-mono uppercase font-bold text-[#8b978f] group-hover:text-[#ff4655] px-1.5 py-0.5 bg-[#0b1015] rounded border border-[#23303d] transition-colors truncate">
                          {item.weaponType || 'Accessory'}
                        </span>
                        {item.originalPrice && item.price < item.originalPrice && (
                          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.2 rounded">
                            FREE / SALE
                          </span>
                        )}
                      </div>

                      {/* Display Image */}
                      <div className="h-24 w-full flex items-center justify-center my-2">
                        <img
                          src={item.displayIcon}
                          alt={item.displayName}
                          className="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform"
                        />
                      </div>

                      {/* Title & Price */}
                      <div className="mt-2 pt-2 border-t border-[#1e2a36] flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white truncate" title={item.displayName}>
                          {item.displayName}
                        </span>

                        <div className="flex items-center gap-1 font-mono text-xs font-bold text-[#ece8e1] flex-shrink-0">
                          <img
                            src={VALORANT_CURRENCIES.VP.icon}
                            alt="VP"
                            className="w-3.5 h-3.5 object-contain"
                          />
                          <span>{item.price ? item.price.toLocaleString() : 'Bundle'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-[#121c26] border border-[#23303d] rounded-2xl text-[#8b978f] space-y-2">
                <p className="text-sm text-white font-bold">ชุดแคปซูลพิเศษ (Limited-Edition Capsule)</p>
                <p className="text-xs">
                  ประกอบด้วย Gun Buddy น้องหมา, ฉายา, สเปรย์ และการ์ดผู้เล่นแบบเอ็กซ์คลูซีฟเฉพาะเซ็ตนี้เท่านั้น ซื้อรวมกันได้ในราคาสุดคุ้ม
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer: Price & Purchase */}
        <div className="p-5 bg-[#0b1015] border-t border-[#23303d] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[11px] text-[#8b978f] uppercase font-mono">Bundle Cost</span>
              <div className="flex items-center gap-2">
                <img
                  src={VALORANT_CURRENCIES.VP.icon}
                  alt="VP"
                  className="w-6 h-6 object-contain"
                />
                <span className="text-2xl font-black text-white font-mono">
                  {bundle.price.toLocaleString()}
                </span>
                {bundle.originalPrice > bundle.price && (
                  <span className="text-xs text-[#8b978f] line-through font-mono pl-1">
                    {bundle.originalPrice.toLocaleString()} VP
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulatePurchase}
              className={`px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all ${
                purchased
                  ? 'bg-emerald-600 text-white'
                  : 'btn-valorant'
              }`}
            >
              {purchased ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Purchased Bundle!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Simulate Purchase Bundle</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

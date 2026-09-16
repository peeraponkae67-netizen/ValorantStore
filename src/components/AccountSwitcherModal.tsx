'use client';

import React, { useState } from 'react';
import { SavedAccount } from '@/types/valorant';
import { VALORANT_CURRENCIES } from '@/lib/constants';
import { X, Users, Check, Trash2, UserPlus, ArrowRight, Shield } from 'lucide-react';

interface AccountSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: SavedAccount[];
  currentPuuid: string | null;
  onSelectAccount: (account: SavedAccount) => void;
  onAddNewAccount: () => void;
  onDeleteAccount: (puuid: string) => void;
}

export const AccountSwitcherModal: React.FC<AccountSwitcherModalProps> = ({
  isOpen,
  onClose,
  accounts,
  currentPuuid,
  onSelectAccount,
  onAddNewAccount,
  onDeleteAccount,
}) => {
  const [confirmDeletePuuid, setConfirmDeletePuuid] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0F1923] border border-[#23303d] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header decoration */}
        <div className="h-1 w-full bg-gradient-to-r from-[#ff4655] via-[#f1b82d] to-[#ff4655]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#23303d] bg-[#0b1015]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ff4655]/15 border border-[#ff4655]/30 flex items-center justify-center text-[#ff4655]">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                สลับบัญชี (Account Switcher)
              </h2>
              <p className="text-xs text-[#8b978f]">
                บันทึกไว้ {accounts.length} บัญชีในเครื่องนี้
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8b978f] hover:text-white bg-[#15222E] hover:bg-[#1f2e3d] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Account List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {accounts.length === 0 ? (
            <div className="text-center py-8 text-[#8b978f]">
              <Shield className="w-10 h-10 mx-auto mb-2 opacity-30 text-[#ff4655]" />
              <p className="text-sm">ยังไม่มีบัญชีที่บันทึกไว้</p>
            </div>
          ) : (
            accounts.map((acc) => {
              const isCurrent = acc.puuid === currentPuuid;
              const isConfirming = confirmDeletePuuid === acc.puuid;

              return (
                <div
                  key={acc.puuid}
                  className={`relative p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-[#ff4655]/10 border-[#ff4655]/60 shadow-[0_0_15px_rgba(255,70,85,0.15)]'
                      : 'bg-[#14202c] border-[#23303d] hover:border-[#384a5c] hover:bg-[#182635]'
                  }`}
                >
                  {/* Account Info Left */}
                  <div
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                    onClick={() => {
                      if (!isCurrent) onSelectAccount(acc);
                    }}
                  >
                    {/* Player Card Avatar */}
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#2e3e4e] flex-shrink-0 bg-[#0d151c]">
                      {acc.playerCard ? (
                        <img
                          src={acc.playerCard}
                          alt={acc.gameName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-black text-white/50 text-sm">
                          {acc.gameName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      {acc.level && (
                        <div className="absolute bottom-0 inset-x-0 bg-black/80 text-center text-[9px] font-mono font-bold text-[#ece8e1] py-0.5">
                          Lv.{acc.level}
                        </div>
                      )}
                    </div>

                    {/* Names & Badges */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm truncate">
                          {acc.gameName}
                        </span>
                        <span className="text-xs text-[#8b978f] font-mono">
                          #{acc.tagLine}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff4655] text-white flex items-center gap-1 shadow-sm">
                            <Check className="w-3 h-3" /> ใช้งานอยู่
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-xs text-[#8b978f]">
                        <span className="px-1.5 py-0.5 bg-[#0b1015] border border-[#23303d] rounded text-[10px] font-mono uppercase font-bold text-[#ece8e1]">
                          {acc.region}
                        </span>

                        {acc.cachedStore?.wallet && (
                          <div className="flex items-center gap-1 font-mono text-[#f1b82d] text-xs">
                            <img
                              src={VALORANT_CURRENCIES.VP.icon}
                              alt="VP"
                              className="w-3.5 h-3.5 object-contain"
                            />
                            <span>{acc.cachedStore.wallet.vp.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Right */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {!isCurrent && (
                      <button
                        type="button"
                        onClick={() => onSelectAccount(acc)}
                        className="px-3 py-1.5 bg-[#1c2c3b] hover:bg-[#ff4655] hover:text-white text-[#8b978f] text-xs font-bold rounded-lg border border-[#2a3c4f] transition-all flex items-center gap-1"
                      >
                        <span>สลับ</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {isConfirming ? (
                      <div className="flex items-center gap-1 animate-in fade-in">
                        <button
                          type="button"
                          onClick={() => onDeleteAccount(acc.puuid)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded"
                        >
                          ลบ
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeletePuuid(null)}
                          className="px-2 py-1 bg-[#23303d] text-[#8b978f] text-[11px] rounded"
                        >
                          ยกเลิก
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeletePuuid(acc.puuid)}
                        title="ลบบัญชีนี้ออกจากเครื่อง"
                        className="p-1.5 text-[#5e6c79] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer: Add Account */}
        <div className="p-4 bg-[#0b1015] border-t border-[#23303d] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onAddNewAccount}
            className="w-full py-2.5 px-4 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 bg-[#1c2c3b] hover:bg-[#ff4655] text-white border border-[#2d4052] hover:border-[#ff4655] transition-all shadow-md"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ เพิ่มบัญชีใหม่ (Add Account)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

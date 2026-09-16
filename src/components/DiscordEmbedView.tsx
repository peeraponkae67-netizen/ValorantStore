'use client';

import React from 'react';
import { DailyStoreData, SkinOffer } from '@/types/valorant';
import { VALORANT_CURRENCIES } from '@/lib/constants';
import { Bot, ExternalLink, Sparkles } from 'lucide-react';

interface DiscordEmbedViewProps {
  storeData: DailyStoreData;
  onInspectSkin: (skin: SkinOffer) => void;
}

export const DiscordEmbedView: React.FC<DiscordEmbedViewProps> = ({
  storeData,
  onInspectSkin,
}) => {
  const hours = Math.floor(storeData.remainingDuration / 3600);
  const minutes = Math.floor((storeData.remainingDuration % 3600) / 60);

  return (
    <div className="max-w-3xl mx-auto my-8 bg-[#313338] border border-[#202225] rounded-xl p-4 sm:p-6 text-[#dbdee1] font-sans shadow-2xl">
      {/* Discord Bot Message Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#ff4655] flex items-center justify-center flex-shrink-0 text-white font-black text-lg shadow-md">
          V
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white text-sm">Valorant Bot</span>
            <span className="bg-[#5865f2] text-white text-[10px] font-bold px-1 py-0.5 rounded uppercase tracking-wider">
              BOT
            </span>
            <span className="text-xs text-[#949ba4]">Today at 07:00 AM</span>
          </div>

          <div className="text-xs text-[#949ba4] mt-0.5 flex items-center gap-1 font-mono">
            <span>used</span>
            <span className="text-[#00a8fc] font-semibold">/store</span>
            <span>(temporary login)</span>
          </div>
        </div>
      </div>

      {/* Main Bot Embed 1: Header */}
      <div className="ml-0 sm:ml-14 space-y-3">
        <div className="border-l-4 border-[#ff4655] bg-[#2b2d31] p-4 rounded-r-lg shadow">
          <p className="text-sm font-medium text-[#f2f3f5] leading-relaxed">
            Daily store for <strong className="text-white font-bold">{storeData.player.name}#{storeData.player.tag}</strong>
            <br />
            Resets <span className="text-[#00a8fc]">in {hours} hours, {minutes} minutes</span>
          </p>
        </div>

        {/* Giorgio's 4 Weapon Skin Embeds */}
        <div className="space-y-2.5">
          {storeData.offers.map((skin) => {
            const tierColor = skin.tier.color || '#5865F2';
            return (
              <div
                key={skin.uuid}
                onClick={() => onInspectSkin(skin)}
                className="group border-l-4 bg-[#2b2d31] hover:bg-[#35373c] p-3 sm:p-4 rounded-r-lg transition-all flex items-center justify-between gap-4 cursor-pointer shadow hover:shadow-md"
                style={{ borderLeftColor: tierColor }}
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {skin.tier.icon && (
                      <img
                        src={skin.tier.icon}
                        alt={skin.tier.name}
                        className="w-4 h-4 object-contain flex-shrink-0"
                      />
                    )}
                    <span className="text-sm font-bold text-white group-hover:text-[#ff4655] transition-colors truncate">
                      {skin.displayName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#b5bac1] font-mono">
                    <img
                      src={VALORANT_CURRENCIES.VP.icon}
                      alt="VP"
                      className="w-3.5 h-3.5 object-contain inline"
                    />
                    <span className="font-semibold text-white">{skin.price.toLocaleString()}</span>
                    <span className="text-[#949ba4]">• {skin.tier.name}</span>
                  </div>
                </div>

                {/* Right thumbnail as in Discord embed */}
                <div className="w-24 h-14 flex items-center justify-center flex-shrink-0 bg-[#232428] rounded p-1">
                  {(() => {
                    const raw = skin.displayIcon;
                    const isBroken = !raw || raw.includes('7122d78b-4e60-eb4d-5f65-738d7c1ce9ae');
                    const icon = isBroken
                      ? skin.chromas?.[0]?.displayIcon ||
                        skin.chromas?.[0]?.fullRender ||
                        skin.levels?.[0]?.displayIcon ||
                        'https://media.valorant-api.com/weaponskinchromas/df1786b2-4f3d-f207-b92c-0780f4dffb79/displayicon.png'
                      : raw;
                    return (
                      <img
                        src={icon}
                        alt={skin.displayName}
                        className="max-h-full max-w-full object-contain filter drop-shadow group-hover:scale-105 transition-transform"
                      />
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Discord Footer note */}
        <div className="text-[11px] text-[#949ba4] flex items-center justify-between pt-1">
          <span>Embed design inspired by Giorgio (staciax/valorant-discord-bot)</span>
          <span className="text-[#00a8fc] font-mono">VALORANT-API.COM</span>
        </div>
      </div>
    </div>
  );
};

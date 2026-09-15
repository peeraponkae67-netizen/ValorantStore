'use client';

import React, { useState, useEffect } from 'react';
import { SkinOffer } from '@/types/valorant';
import { X, Search, Bookmark, Trash2, Bell, Check, Sparkles } from 'lucide-react';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: SkinOffer[];
  onRemoveFromWishlist: (uuid: string) => void;
  onAddToWishlist: (skin: any) => void;
  storeSkinUuids: string[];
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onAddToWishlist,
  storeSkinUuids,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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
            <div className="py-12 text-center text-sm text-[#8b978f]">
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
      </div>
    </div>
  );
};

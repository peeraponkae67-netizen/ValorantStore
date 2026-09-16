import { DailyStoreData, RiotSession, SavedAccount } from '@/types/valorant';

const ACCOUNTS_STORAGE_KEY = 'vlr_saved_accounts';
const CURRENT_ACCOUNT_KEY = 'vlr_current_puuid';

export function getSavedAccounts(): SavedAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse saved accounts', e);
    return [];
  }
}

export function saveAccount(account: SavedAccount): void {
  if (typeof window === 'undefined') return;
  try {
    const accounts = getSavedAccounts();
    const existingIdx = accounts.findIndex((a) => a.puuid === account.puuid);
    if (existingIdx >= 0) {
      accounts[existingIdx] = {
        ...accounts[existingIdx],
        ...account,
        lastActive: Date.now(),
      };
    } else {
      accounts.push({
        ...account,
        lastActive: Date.now(),
      });
    }
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    localStorage.setItem(CURRENT_ACCOUNT_KEY, account.puuid);
  } catch (e) {
    console.error('Failed to save account', e);
  }
}

export function removeAccount(puuid: string): SavedAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    const accounts = getSavedAccounts().filter((a) => a.puuid !== puuid);
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    
    // If we removed current active account, clear or point to next
    const current = getCurrentAccountPuuid();
    if (current === puuid) {
      if (accounts.length > 0) {
        localStorage.setItem(CURRENT_ACCOUNT_KEY, accounts[0].puuid);
      } else {
        localStorage.removeItem(CURRENT_ACCOUNT_KEY);
      }
    }
    return accounts;
  } catch (e) {
    console.error('Failed to remove account', e);
    return [];
  }
}

export function getCurrentAccountPuuid(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CURRENT_ACCOUNT_KEY);
}

export function setCurrentAccountPuuid(puuid: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CURRENT_ACCOUNT_KEY, puuid);
}

export function updateAccountStoreCache(puuid: string, store: DailyStoreData): void {
  if (typeof window === 'undefined') return;
  try {
    const accounts = getSavedAccounts();
    const idx = accounts.findIndex((a) => a.puuid === puuid);
    if (idx >= 0) {
      accounts[idx].cachedStore = store;
      accounts[idx].level = store.player?.level;
      accounts[idx].playerCard = store.player?.playerCard;
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    }
  } catch (e) {
    console.error('Failed to update account store cache', e);
  }
}

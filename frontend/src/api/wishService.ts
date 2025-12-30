import type { PityCounters, WishItem } from '../../../shared/types';
import axios from './axiosInstance';

type UserWishesResponse = {
  success: boolean;
  data: WishItem[];
}

type UserPityStatsResponse = {
  success: boolean;
  data: PityCounters[];
}

type ImportWishesResponse = {
  success: boolean;
  data: {
    imported: number;
    skipped: number;
    failed: number;
    banners: Record<string, number>;
  };
}

export const getUserWishes = async (gameName: string, userGameId: string) => {
  const response = await axios.get<UserWishesResponse>(`/api/${gameName}/wishes/${userGameId}`);
  return response.data;
};

export const getUserPityStats = async (gameName: string, userGameId: string) => {
  const response = await axios.get<UserPityStatsResponse>(`/api/${gameName}/wishes/${userGameId}/pityStats`);
  return response.data;
}

export const importWishes = async (gameName: string, userGameId: string, importUrl: string) => {
  const response = await axios.post<ImportWishesResponse>(`/api/${gameName}/wishes/${userGameId}/import`, {
    importUrl: importUrl.trim()
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    }
  });
  return response.data;
};
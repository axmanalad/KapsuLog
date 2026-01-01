import type { GameAPIStats } from '../types';
import axios from './axiosInstance';

type GameIdResponse = {
  success: boolean;
  data: {
    gameId: string;
  };
};

type BannerIdResponse = {
  success: boolean;
  data: {
    bannerId: string;
  };
};

type GameAPI = {
  id: string;
  name: string;
  title: string;
  userGameId: string;
}

type UserGamesResponse = {
  success: boolean;
  data: {
    games: GameAPI[];
  };
}

type AddGameResponse = {
  success: boolean;
  message: string;
  data?: GameAPI;
}

type RemoveGameResponse = {
  success: boolean;
  message: string;
}

type GameStatsResponse = {
  success: boolean;
  data: GameAPIStats;
}

export const getGameIdByName = async (gameName: string) => {
  const response = await axios.get<GameIdResponse>(`/api/games/${gameName}/game-id-name`);
  return response.data.success ? response.data.data.gameId : null;
}

export const getGameIdByUGID = async (userGameId: string) => {
  const response = await axios.get<GameIdResponse>(`/api/games/${userGameId}/game-id-ugid`);
  return response.data.success ? response.data.data.gameId : null;
}

export const getBannerId = async (gameId: string, banner: string) => {
  const response = await axios.get<BannerIdResponse>(`/api/games/${gameId}/${banner.toLowerCase()}`)
  return response.data.success ? response.data.data.bannerId : null;
}

export const getUserGames = async (userId: string) => {
  const response = await axios.get<UserGamesResponse>(`/api/games/user/${userId}`);
  return response.data.success ? response.data.data.games : null;
};

export const addGameToUser = async (userId: string, gameId: string) => {
  const response = await axios.post<AddGameResponse>(`/api/games/user/${userId}`, { gameId });
  return response.data;
};

export const removeGameFromUser = async (userId: string, gameId: string) => {
  const response = await axios.delete<RemoveGameResponse>(`/api/games/user/${userId}/${gameId}`);
  return response.data;
};

export const fetchHoyoLabGameData = async (gameName: string, ltuid: number, ltokenv2: string, uid: number) => {
  const params = {
    ltuid: ltuid,
    ltokenv2: ltokenv2,
    uid: uid
  }
  const response = await axios.get<GameStatsResponse>(`/api/games/${gameName}/full-user-stats`, { params });
  return response.data;
}
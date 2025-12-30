import axios from 'axios';
import { PrismaClient } from '@prisma';
import { calculateWishStats } from '../utils/wishStatCalculation';
import { DebugLog as log } from '../utils/debugLog';
import { WishItem } from '../../../shared/types/wish';

const prisma = new PrismaClient();

interface GenshinWishResponse {
  retcode: number;
  message: string;
  data: {
    page: string;
    size: string;
    total: string;
    list: GenshinWishApiResponse[];
  }
}

interface GenshinWishApiResponse {
  id: string,
  gacha_type: string
  time: string,
  name: string,
  lang: string,
  item_type: string,
  rank_type: string,
}

interface GenshinBanner {
  id: string;
  gameId: string;
  name: string;
  type: string;
  gachaType: string;
  maxPity: number;
  softPity: number;
  isActive: boolean;
}

interface GenshinWish extends WishItem {
  lang: string;
}

interface GenshinPityCounters {
  userGameId: string;
  gachaType: string;
  current: number;
  max: number;
  guaranteed: boolean;
}

export class GenshinService {
  /**
   * Imports wishes from a Genshin Impact API endpoint.
   * @param userGameId The ID of the user's game
   * @param importUrl The URL to import wishes from
   * @returns The result of the import operation
   */
  static async importWishes(userGameId: string, importUrl: string) {
    try {
      log.info(`Importing wishes for user game ID: ${userGameId}`);

      const results = {
        imported: 0,
        skipped: 0,
        failed: 0,
        banners: {} as Record<string, number>
      }

      const userGame = await prisma.userGame.findUnique({
        where: { id: userGameId },
        include: {
          game: {
            include: { banners: true }
          }
        }
      });

      if (!userGame) {
        throw new Error(`User game with ID ${userGameId} not found`);
      }

      // Import each banner type
      for (const banner of userGame.game.banners) {
        log.info(`\nImporting wishes for banner: ${banner.name}`);

        let page = 1;
        let hasMore = true;
        let previousResponse: GenshinWishResponse | undefined;
        let endId = '0';

        // Loops through all pages of wishes for the current banner
        while (hasMore) {
          log.info(`Fetching page ${page}...`);
          if (page > 1 && previousResponse) {
            endId = previousResponse.data.list[previousResponse.data.list.length - 1].id;
          }

          const response = await this.fetchWishPage(importUrl, banner.gachaType, page, endId);

          if (response.retcode !== 0) {
            log.error(`API error: ${response.message}`);
            break;
          }

          const wishes = response.data.list;
          if (wishes.length === 0) {
            hasMore = false;
            break;
          }

          for (const apiWish of wishes) {
            try {
              const existingWish = await prisma.wish.findUnique({
                where: {
                  userGameId_gameWishId: {
                    userGameId,
                    gameWishId: apiWish.id
                  }
                }
              });

              // Since the wish history starts descendingly, we can stop if we find an existing wish
              if (existingWish) {
                log.info(`Wish ID ${apiWish.id} already exists, skipping all subsequent wishes for this banner.`);
                results.skipped++;
                hasMore = false;
                break;
              }

              const isWin = this.determineWinLoss(apiWish, banner.type);

              const wish: GenshinWish = {
                bannerId: banner.id,
                gameWishId: apiWish.id,
                gachaType: apiWish.gacha_type,
                rarity: apiWish.rank_type,
                time: new Date(apiWish.time),
                name: apiWish.name,
                lang: apiWish.lang,
                itemType: apiWish.item_type,
                pityCount: -1,
                isGuaranteed: null,
                isWin,
                wishNumber: -1
              }

              await prisma.wish.create({
                data: {
                  userGameId,
                  bannerId: banner.id,
                  ...wish
                }
              });

              results.imported++;
              results.banners[banner.name] = (results.banners[banner.name] || 0) + 1;
            } catch (err) {
              results.failed++;
              log.error(`Error importing wish ${apiWish.id}:`, err);
            }
          }
          previousResponse = response;
          page++;
          // Rate limit
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      await this.updateWishFields(userGameId, userGame.game.banners);
      await this.updatePityCounters(userGameId);
      await prisma.userGame.update({
        where: { id: userGameId },
        data: { lastImport: new Date() }
      });

      log.info('Import completed:', results);
      
      log.info('Updating user wish stats...');
      try {
        await this.updateUserWishStats(userGameId, userGame.game.banners);
        log.info('User wish stats updated successfully.');
      } catch (err) {
        log.error('Error updating user wish stats:', err);
      }
      return results;
    } catch (err) {
      log.error('Import failed:', err);
      throw err;
    }
  }

  /**
   * Fetches a page of wishes from the Genshin Impact API.
   * @param url The base URL for the API request.
   * @param gachaType The type of gacha (wish) to fetch.
   * @param page The page number to fetch.
   * @param endId The ID to end the fetch at (for pagination).
   * @returns The response data from the API.
  */
  private static async fetchWishPage(url: string, gachaType: string, page: number = 1, endId: string = '0') {
    // Adds game_biz depending on the region to the end of url.
    // If sg, use global, otherwise the default is cn.
    let preApiUrl: string;
    if (url.includes('hk4e-sg')) {
      preApiUrl = url + 'hk4e_global';
    } else {
      preApiUrl = url + 'hk4e_cn';
    }

    const params = new URLSearchParams(new URL(preApiUrl).search);
    params.set('gacha_type', gachaType);
    params.set('page', page.toString());
    params.set('size', '20');
    params.set('end_id', endId);

    // NOTE: The url should already have a few params included.
    // URL Example: https://public-operation-hk4e-sg.hoyoverse.com/gacha_info/api/getGachaLog?win_mode=fullscreen&...end_id=0
    const apiUrl = new URL(`${preApiUrl}&${params.toString()}`);
    const response = await axios.get<GenshinWishResponse>(apiUrl.toString(), {
      headers: { 'User-Agent': 'KapsuLog/1.0' }
    });
    return response.data;
  }

  /**
   * Determines if a wish is a win or loss based on the wish details.
   * @param wish The wish object.
   * @param bannerType The type of banner.
   * @returns True if win, false if loss, null if not applicable.
   */
  private static determineWinLoss(wish: GenshinWishApiResponse, bannerType: string): boolean | null {
    if (wish.rank_type !== '5') {
      return null;
    }

    switch (bannerType) {
      case 'CHARACTER': {
        const standardCharacters = ['Dehya', 'Diluc', 'Jean', 'Keqing', 'Mona', 'Qiqi', 'Tighnari', 'Yumemizuki Mizuki'];
        return !standardCharacters.includes(wish.name);
      }
      case 'WEAPON': {
        const standardWeapons = [
          'Aquila Favonia',
          'Primordial Jade Winged-Spear',
          'Wolf\'s Gravestone',
          'Amos\' Bow',
          'Lost Prayer to the Sacred Winds',
          'Skyward Blade',
          'Skyward Harp',
          'Skyward Pride',
          'Skyward Atlas',
          'Skyward Spine'
        ];
        return !standardWeapons.includes(wish.name);
      }
      default:
        return null;
    }
  }

  /**
   * Updates the pity and wish number for all wishes of a user.
   * @param userGameId The ID of the user's game.
   * @param banners The banners to update.
   */
  private static async updateWishFields(userGameId: string, banners: GenshinBanner[]) {
    await this.updateAllWishNumber(userGameId, banners);
    await this.updateAllWishPity(userGameId, banners);
    await this.updateAllWishGuarantee(userGameId, banners);
  }

  /**
   * Calculates the pity count for all wishes per banner.
   * @param userGameId The ID of the user's game.
   * @param bannerId The ID of the banner.
   * @param wish The wish object.
   * @returns The pity count.
   */
  private static async updateAllWishPity(userGameId: string, banners: GenshinBanner[]) {
    for (const banner of banners) {
      let pity = 0;

      const wishes = await prisma.wish.findMany({
        where: { userGameId, bannerId: banner.id },
        orderBy: { wishNumber: 'asc' }
      });

      // For each wish, calculate the pity and update it
      for (const wish of wishes) {
        // Skips update if pity is already calculated
        if (wish.pityCount !== -1) continue;

        pity++;
        await prisma.wish.update({
          where: { id: wish.id },
          data: { pityCount: pity }
        });
        
        // Before next wish, reset pity if 5-star
        if (wish.rarity === '5') {
          pity = 0;
        }
      }
    }
  }

  /**
   * Updates the wish number for all wishes corresponding to each banner.
   * @param userGameId The ID of the user's game.
   * @param banners The banners to update.
   */
  private static async updateAllWishNumber(userGameId: string, banners: GenshinBanner[]) {
    for (const banner of banners) {
      // Check if there are any wishes not numbered.
      const checkNumbered = await prisma.wish.count({
        where: { 
          userGameId, 
          bannerId: banner.id,
          wishNumber: -1 // wishNumber > 0 means it's been assigned
        }
      }) > 0;

      if (!checkNumbered) {
        log.info(`Wish numbers already assigned for banner ${banner.name}, skipping...`);
        continue;
      }

      const currentMax = await prisma.wish.findFirst({
        where: { userGameId, bannerId: banner.id },
        orderBy: { wishNumber: 'desc' }
      });

      const newWishes = await prisma.wish.findMany({
        where: { userGameId, bannerId: banner.id, wishNumber: -1 },
        orderBy: { importedAt: 'desc' }
      });

      let wishNumber = currentMax && currentMax.wishNumber !== -1 ? currentMax.wishNumber + 1 : 1;
      for (const wish of newWishes) {
        await prisma.wish.update({
          where: { id: wish.id },
          data: { wishNumber }
        });
        wishNumber++;
      }

      log.info(`Assigned wish numbers for ${newWishes.length} wishes in banner ${banner.name}`);
    }
  }

  /**
   * Determines if a wish is a guaranteed limited five star based on the user's previous five star.
   * @param userGameId The ID of the user's game.
   * @param bannerId The ID of the banner.
   * @param wish The wish object.
   * @returns True if guaranteed, false otherwise.
   */
  private static async updateAllWishGuarantee(userGameId: string, banners: GenshinBanner[]) {

    const standardItems = [
      'Dehya', 'Diluc', 'Jean', 'Keqing', 'Mona', 'Qiqi', 
      'Tighnari', 'Yumemizuki Mizuki', 'Aquila Favonia',
      'Primordial Jade Winged-Spear','Wolf\'s Gravestone',
      'Amos\' Bow', 'Lost Prayer to the Sacred Winds',
      'Skyward Blade', 'Skyward Harp', 'Skyward Pride',
      'Skyward Atlas', 'Skyward Spine'
    ];

    for (const banner of banners) {
      const wishes = await prisma.wish.findMany({
        where: { userGameId, bannerId: banner.id },
        orderBy: { wishNumber: 'asc' }
      });

      let guaranteeActive = false;
      for (const wish of wishes) {
        // Guarantees do not apply to non-5-star wishes
        if (wish.rarity !== '5') {
          continue;
        }

        let guaranteed = false;
        // Retrieve the last five star wish in the same banner.
        const lastFiveStar = await prisma.wish.findFirst({
          where: {
            userGameId,
            bannerId: banner.id,
            rarity: '5',
            wishNumber: { lt: wish.wishNumber }
          },
        });
        // If there is no last five star wish (current wish is the first five star), assume the current wish is not guranteed, but set guaranteeActive if it is a standard item.
        if (!lastFiveStar) {
          if (banner.type !== 'STANDARD' && !wish.isWin && standardItems.includes(wish.name)) {
            guaranteeActive = true;
          }
        } else {
          // Determine if the current wish is guaranteed based on the last five star wish
          // Note: Guarantees do not apply to standard banners
          if (banner.type === 'STANDARD') {
            guaranteed = false;
          } else if (guaranteeActive) {
            guaranteed = true;
            guaranteeActive = false; // Reset guarantee after use
          } else {
            if (!wish.isWin && standardItems.includes(wish.name)) {
              guaranteeActive = true;
            }
          }
        }
        await prisma.wish.update({
          where: { id: wish.id },
          data: { isGuaranteed: guaranteed }
        });
      }
    }
  }

  /**
   * Updates the pity counters for a given user game.
   * @param userGameId The ID of the user's game.
   */
  private static async updatePityCounters(userGameId: string) {
    const userGame = await prisma.userGame.findUnique({
      where: {id: userGameId },
      include: {
        game: { include: { banners: true } }
      }
    });

    if (!userGame) return;

    for (const banner of userGame.game.banners) {
      const lastFiveStar = await prisma.wish.findFirst({
        where: {
          userGameId,
          bannerId: banner.id,
          rarity: '5'
        },
        orderBy: { wishNumber: 'desc' }
      });

      // If a five star exists, get the wishes after it; else, assume that the user has no five stars in their wish history
      const futureWishes = await prisma.wish.count({
        where: {
          userGameId,
          bannerId: banner.id,
          wishNumber: lastFiveStar ? { gt: lastFiveStar.wishNumber } : { gt: 0 }
        },
      });

      const guaranteed = lastFiveStar?.isWin === false;

      await prisma.pityCounter.upsert({
        where: {
          userGameId_bannerId: {
            userGameId,
            bannerId: banner.id
          }
        },
        update: {
          current: futureWishes,
          guaranteed,
          lastFiveStar: lastFiveStar?.time
        },
        create: {
          userGameId,
          bannerId: banner.id,
          current: futureWishes,
          max: banner.maxPity,
          guaranteed,
          lastFiveStar: lastFiveStar?.time
        }
      });
    }
  }

  private static async updateUserWishStats(userGameId: string, banners: GenshinBanner[]) {
    for (const banner of banners) {
      const wishes: GenshinWish[] = await prisma.wish.findMany({
        where: { userGameId, bannerId: banner.id },
        orderBy: { wishNumber: 'asc' }
      });

      const fiveStarWishes = wishes.filter(wish => wish.rarity === '5');
      const fourStarWishes = wishes.filter(wish => wish.rarity === '4');

      const stats = calculateWishStats(wishes, fiveStarWishes, fourStarWishes);

      await prisma.userWishStats.upsert({
        where: { userGameId_bannerId: { userGameId, bannerId: banner.id } },
        update: {
          ...stats,
          fiveStarCount: fiveStarWishes.length,
          fourStarCount: fourStarWishes.length,
        },
        create: {
          userGameId,
          bannerId: banner.id,
          ...stats,
          fiveStarCount: fiveStarWishes.length,
          fourStarCount: fourStarWishes.length,
        }
      });
    }
  }

  /*
    Get Requests
  */
  /**
   * Gets the user's wishes for Genshin Impact
   * @param userGameId The ID of the user's game
   */
  static async getUserWishes(userGameId: string): Promise<GenshinWish[]> {
    return await prisma.wish.findMany({
      where: { userGameId },
      orderBy: { time: 'desc' }
    });
  }

  static async getUserPityCounters(userGameId: string) {
    const counters = await prisma.pityCounter.findMany({
      where: { userGameId },
      include: {
        banner: true
      }
    });

    return counters.map(counter => ({
      userGameId: counter.userGameId,
      gachaType: counter.banner.type,
      current: counter.current,
      max: counter.max,
      guaranteed: counter.guaranteed
    })) as GenshinPityCounters[];
  }
}
import { Request, Response } from "express";
import { GenshinService } from "../services/genshin.service";
import { PityCounters, WishItem } from "../../../shared/types";

export const importWishes = async (req: Request, res: Response) => {
  try {
    const { importUrl } = req.body as { importUrl: string };
    const { userGameId } = req.params;

    if (!userGameId || !importUrl) {
      return res.status(400).json({
        success: false,
        message: 'userGameId and importUrl are required'
      });
    }

    if (!importUrl.includes('webview_gacha') || !importUrl.includes('/gacha_info/api/getGachaLog')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid wish history URL'
      });
    }

    let results: { imported: number; skipped: number; failed: number; banners: Record<string, number> };
    if (req.baseUrl.includes('genshin-impact')) {
      results = await GenshinService.importWishes(userGameId, importUrl);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid game specified'
      });
    }
    res.json({
      success: true,
      data: results,
      message: `Successfully imported ${results.imported} wishes`
    });
    
  } catch (err) {
    console.error('Import error:', err);
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : 'Failed to import wishes'
    });
  }
};

export const getUserWishes = async (req: Request, res: Response) => {
  try {
    const { userGameId } = req.params;

    let wishes: WishItem[];
    if (req.baseUrl.includes('genshin-impact')){
      wishes = await GenshinService.getUserWishes(userGameId);
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid game specified'
      });
    }
    res.json({
      success: true,
      data: wishes
    });
  } catch (err) {
    console.error('Error fetching user wishes:', err);
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : 'Failed to fetch user wishes'
    });
  }
};

export const getUserPityStats = async (req: Request, res: Response) => {
  try {
    const { userGameId } = req.params;
    let pityStats: PityCounters[];
    if (req.baseUrl.includes('genshin-impact')) {
      pityStats = await GenshinService.getUserPityCounters(userGameId);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid game specified'
      });
    }
    res.json({
      succes: true,
      data: pityStats
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : 'Failed to fetch pity stats'
    });
  }
}
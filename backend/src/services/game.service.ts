import { Prisma, PrismaClient } from '@prisma';
import { PrismaPg } from '@prisma/adapter-pg'
import { env } from '@prisma/config'


const adapter = new PrismaPg({
  connectionString: env('DATABASE_URL')
});
const prisma = new PrismaClient({ adapter });

/**
 * Service for managing games.
 */
export class GameService {
  /**
   * Get the ID of a game by its name.
   * @param gameName The name of the game.
   * @returns The ID of the game, or an empty string if not found.
   */
  static async getGameIdByName(gameName: string): Promise<string> {
    const game = await prisma.game.findUnique({
      where: { name: gameName }
    });
    return game ? game.id : '';
  }

  /**
   * Get the ID of a game by the user game ID.
   * @param userGameId The user game ID.
   * @returns The ID of the game, or an empty string if not found.
   */
  static async getGameIdByUserGameId(userGameId: string): Promise<string> {
    const game = await prisma.userGame.findFirst({
      where: { id: userGameId }
    });
    return game ? game.gameId : '';
  }

  /**
   * Get the ID of a user game record.
   * @param userId The ID of the user.
   * @param gameId The ID of the game.
   * @returns The ID of the user game record, or an empty string if not found.
   */
  static async getUserGameId(userId: string, gameId: string): Promise<string> {
    const userGame = await prisma.userGame.findUnique({
      where: { userId_gameId: { userId, gameId } }
    });
    return userGame ? userGame.id : ''
  }

  /**
   * Get the ID of a banner by its game ID and gacha type.
   * @param gameId The ID of the game.
   * @param gachaType The type of gacha.
   * @returns The ID of the banner, or an empty string if not found.
   */
  static async getBannerId(gameId: string, type: string): Promise<string> {
    const banner = await prisma.banner.findUnique({
      where: { gameId_type: { gameId, type } }
    });
    return banner ? banner.id : '';
  }

  /**
   * Get all games for a specific user
   * @param userId The ID of the user
   * @returns Array of game with user game information
   */
  static async getUserGames(userId: string) {
    const userGames = await prisma.userGame.findMany({
      where: { userId },
      include: {
        game: true
      }
    });

    return userGames.map(userGame => ({
      id: userGame.game.id,
      name: userGame.game.name,
      title: userGame.game.title,
      userGameId: userGame.id
    }));
  }

  /**
   * Add a game to a user's collection
   * @param userId The ID of the user
   * @param gameId The ID of the game
   * @returns The created user game record
   */
  static async addGameToUser(userId: string, gameId: string) {
    const game = await prisma.game.findUnique({
      where: { id: gameId }
    });

    if (!game) {
      throw new Error('Game not found');
    }

    const existingUserGame = await prisma.userGame.findUnique({
      where: { userId_gameId: { userId, gameId }}
    });

    if (existingUserGame) {
      return {
        success: true,
        message: 'Game already in user database, skipping database addition'
      }
    }

    const userGame = await prisma.userGame.create({
      data: { userId, gameId },
      include: { game: true }
    });

    return {
      success: true,
      data: {
        id: userGame.id,
        name: userGame.game.name,
        title: userGame.game.title,
        gameId: userGame.game.id,
      }
    };
  }

  /**
   * Remove a game form a user's collection
   * @param userId The ID of the user
   * @param gameId The ID of the game
   * @returns The deleted user game record
   */
  static async removeGameFromUser(userId: string, gameId: string) {
    const deletedUserGame = await prisma.userGame.delete({
      where: { userId_gameId: { userId, gameId } }
    });

    if (!deletedUserGame) {
      throw new Error('User game not found');
    }

    return deletedUserGame;
  }
}
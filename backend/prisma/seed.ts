import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Create user
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      username: 'testuser',
      password: 'hash_password'
    }
  });
  console.log("User created:", user);

  // Create game
  const genshin = await prisma.game.create({
    data: {
      name: 'genshin-impact',
      title: 'Genshin Impact',
      author: 'miHoYo',
      releaseDate: new Date('2020-09-28'),
      imageUrl: 'https://cdn1.epicgames.com/offer/879b0d8776ab46a59a129983ba78f0ce/genshintall_1200x1600-4a5697be3925e8cb1f59725a9830cafc',
      bgImageUrl: 'https://webstatic.hoyoverse.com/upload/op-public/2022/02/09/ed2254c48c92ded2ef674f31ac03d03e_6731728942134874166.jpeg',
      websiteUrl: 'https://genshin.hoyoverse.com/en/home',
      isAvailable: true
    }
  });
  console.log("Game created:", genshin.title);
  
  // Create banners
  const banners = await Promise.all([
    prisma.banner.create({
      data: {
        gameId: genshin.id,
        name: 'Character Event Wish',
        type: 'CHARACTER',
        gachaType: '301',
        maxPity: 90
      }
    }),
    prisma.banner.create({
      data: {
        gameId: genshin.id,
        name: 'Weapon Event Wish',
        type: 'WEAPON',
        gachaType: '302',
        maxPity: 80,
      }
    }),
    prisma.banner.create({
      data: {
        gameId: genshin.id,
        name: 'Chronicled Wish',
        type: 'CHRONICLED',
        gachaType: '500',
        maxPity: 90,
      }
    }),
    prisma.banner.create({
      data: {
        gameId: genshin.id,
        name: 'Standard Wish',
        type: 'STANDARD',
        gachaType: '200',
        maxPity: 90,
      }
    })
  ]);
  console.log('Created banners:', banners.length);

  // Create user-game relationship
  const userGame = await prisma.userGame.create({
    data: {
      userId: user.id,
      gameId: genshin.id,
      nickname: 'TestTraveler',
      server: 'America',
      uid: '123456789'
    }
  });
  console.log('Created user-game relationship');

  // Create sample wishes
  const characterBanner = banners[0];
  const sampleWishes = [
    {
      gameWishId: '1234567890123456789',
      wishNumber: 1,
      gachaType: '301',
      time: new Date('2024-01-15T10:30:00Z'),
      name: 'Diluc',
      lang: 'en',
      itemType: 'Character',
      rarity: '5',
      pityCount: 76,
      isWin: true
    },
    {
      gameWishId: '1234567890123456790',
      wishNumber: 2,
      gachaType: '301',
      time: new Date('2024-01-15T10:25:00Z'),
      name: 'Bennett',
      lang: 'en',
      itemType: 'Character',
      rarity: '4',
      pityCount: 8,
      isWin: null
    },
    {
      gameWishId: '1234567890123456791',
      wishNumber: 3,
      gachaType: '301',
      time: new Date('2024-01-15T10:20:00Z'),
      name: 'Cool Steel',
      lang: 'en',
      itemType: 'Weapon',
      rarity: '3',
      pityCount: 7,
      isWin: null
    }
  ];

  for (const wish of sampleWishes) {
    await prisma.wish.create({
      data: {
        userGameId: userGame.id,
        bannerId: characterBanner.id,
        gameWishId: wish.gameWishId,
        wishNumber: wish.wishNumber,
        gachaType: wish.gachaType,
        time: wish.time,
        name: wish.name,
        lang: wish.lang,
        itemType: wish.itemType,
        rarity: wish.rarity,
        pityCount: wish.pityCount,
        isWin: wish.isWin
      }
    });
  }
  console.log('Created sample wishes:', sampleWishes.length);

  // Create pity counters
  for (const banner of banners) {
    await prisma.pityCounter.create({
      data: {
        userGameId: userGame.id,
        bannerId: banner.id,
        current: banner.gachaType === '301' ? 14 : 0, // 14 since last 5-star
        max: banner.maxPity,
        guaranteed: false
      }
    });
  }
  console.log('Created pity counters');

  // Create stats
  for (const banner of banners) {
    await prisma.userWishStats.create({
      data: {
        userGameId: userGame.id,
        bannerId: banner.id,
        totalWishes: 3,
        fiveStarCount: 1,
        fourStarCount: 1,
        avgFiveStarPity: 76.0,
        avgFourStarPity: 8.0,
        fiveStarWLRatio: [1, 0, 1.0],
        currentWinStreak: 1,
        currentLossStreak: 0,
      }
    });
  }
  console.log('Created user wish stats');

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
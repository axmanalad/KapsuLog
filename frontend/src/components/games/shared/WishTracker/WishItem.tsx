import type React from "react";
import type { WishItemProps } from "../../../../types";
import { convertDate } from "../../../../utils/convertDate";
import { getBannerDisplayName } from "../../../../utils/bannerUtils";
import "../../../../styles/components/games/shared/WishTracker/wish-items.css";
import type { ReactNode } from "react";


const WishItem: React.FC<WishItemProps> = ({ wish, compact = false, gameName }) => {
  const getWLGuaranteeClass = (isWin: boolean, isGuarantee: boolean): [string, ReactNode] => {
    if (wish.rarity === '5' && getBannerDisplayName(wish.gachaType, gameName) !== 'Standard') {
      if (isGuarantee) {
        return ['wlg-guaranteed', <span key="guaranteed">Guaranteed</span>];
      }
      return isWin ? ['wlg-win', <span key="win">Win</span>] : ['wlg-loss', <span key="loss">Loss</span>];
    }
    return ['', null];
  }

  const [wlClass, wlText] = getWLGuaranteeClass(wish.isWin ?? false, wish.isGuaranteed ?? false);

  const getWishIcon = (wish: WishItemProps['wish'], gameName: string | undefined): string => {
    const name = wish.name.replace(/ /g, '_');
    let basePath = `${gameName?.toLowerCase()}`
    if (wish.itemType === 'Character')
      basePath += `/characters/icons/${encodeURIComponent(name)}_Icon.webp`;
    else if (wish.itemType === 'Weapon')
      basePath += `/weapons/icons/${wish.rarity}/Weapon_${encodeURIComponent(name)}.webp`;

    return `https://cdn.kapsulog.com/${basePath}`;
  };

  const getWishArt = (wish: WishItemProps['wish'], gameName: string | undefined): string => {
    const name = wish.name.replace(/ /g, '_');

    const basePath = `${gameName?.toLowerCase()}/characters/splash-art/${encodeURIComponent(name)}_Wish.webp`;

    return `https://cdn.kapsulog.com/${basePath}`;
  };

  return (
    <div className={`wish-item ${compact ? 'compact' : 'detailed'}`}>
      <div className="wish-item-info">
        <div className={`wish-item-rarity rarity-${String(wish.rarity)}`}></div>
        <img src={getWishIcon(wish, gameName)} alt='' className="wish-item-image"/>
        <div className={"wish-details"}>
          <div className="flex flex-row gap-2 items-center">
            <div className="wish-item-name">{wish.name}</div>
            <div className="wish-item-number">#{wish.wishNumber}</div>
            {!compact && (
              <div className={`wish-item-WLG ${wlClass}`}>{wlText}</div>
            )}
          </div>
          <div className="wish-item-meta">
            <span className="wish-item-type">{wish.itemType}</span>
            <span className="wish-item-pity">Pity: {wish.pityCount}</span>
            {!compact && (
              <div className="flex gap-2">
                <span className="wish-item-rarity-text">{wish.rarity}★</span>
              </div>
            )}
            <span className="wish-item-gacha-type">{`${getBannerDisplayName(wish.gachaType, gameName)} Banner`}</span>
          </div>
        </div>
      </div>
      {wish.itemType === 'Character' && (
        <img src={getWishArt(wish, gameName)} alt='' className="wish-item-art"/>
      )}
      <div className="wish-item-date">{convertDate(new Date(wish.time))}</div>
    </div>
  );
};

export default WishItem;
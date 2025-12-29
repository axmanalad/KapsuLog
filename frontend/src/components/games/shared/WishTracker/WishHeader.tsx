import React, { useState } from "react";
import type { WishHeaderProps } from "../../../../types";
import WishImportModal from './WishImportModal';
import "../../../../styles/components/games/shared/WishTracker/import-modal.css";
import "../../../../styles/components/games/shared/WishTracker/view-controls.css";

const WishHeader: React.FC<WishHeaderProps> = ({
  currentView,
  onViewChange,
  totalWishes,
  userGameId,
  gameName,
  onRefreshWishes
}) => {
  const [showImportModal, setShowImportModal] = useState(false);

  return (
    <>
      <div className="wish-tracker-header">
        <div className="wish-header-title">
          <h2>Wish Tracker</h2>

          <div className="view-toggle">
            <button
              type="button"
              className={`view-toggle-btn ${currentView === 'recent' ? 'active' : ''}`}
              onClick={() => {onViewChange('recent')}}
            >
              Recent
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${currentView === 'full' ? 'active' : ''}`}
              onClick={() => {onViewChange('full')}}
            >
              Full History {totalWishes > 0 && `(${String(totalWishes)})`}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {setShowImportModal(true)}}
          >
            Add New Wish
          </button>
        </div>
      </div>

      <WishImportModal
        isOpen={showImportModal}
        onClose={(isRefreshable) => {
          setShowImportModal(false)
          if (isRefreshable) { void onRefreshWishes(); }
        }}
        userGameId={userGameId}
        gameName={gameName}
      />
    </>
  );
};

export default WishHeader;
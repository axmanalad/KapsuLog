import React, { useEffect, useState } from 'react';
import { wishImportData } from '../../../../data/wishStats';
import type { WishImportInstructionsProps, WishImportResults } from '../../../../types';
import StepCard from '../StepCard';
import { importWishes } from '../../../../api/wishService';

const WishImportModal: React.FC<WishImportInstructionsProps> = ({ isOpen, onClose, userGameId, gameName }) => {
  const [importUrl, setImportUrl] = useState('');
  const [step, setStep] = useState(1);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [isImportFailure, setIsImportFailure] = useState(false);
  const [hasImported, setHasImported] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const [importResults, setImportResults] = useState<WishImportResults | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsImporting(false);
      setHasImported(false);
      document.body.classList.add('modal-open');
      return () => {
        document.body.classList.remove('modal-open');
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getGameInstructions = ( gameName: string ) => {
    return wishImportData[gameName];
  };

  const gameInstructions = getGameInstructions(gameName);
  const handleImport = async () => {
    try {
      setIsImporting(true);
      const response = await importWishes(gameName, userGameId, importUrl);
      setIsImporting(false);
      setIsImportFailure((Object.values(response.data).slice(0, 3)).every(val => val === 0));
      setImportResults(response.data);
      setStep(4);
      setHasImported(true);
    } catch (err) {
      console.error('Import failed:', err);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('copied');
      setTimeout(() => {
        setCopyStatus('idle');
      }, 2000); // Reset status after 2 seconds
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content wish-import-modal">
        <div className="modal-header">
          <h2>Import Wish History</h2>
          <button type="button" onClick={() => { 
            onClose(hasImported);
            setStep(1);
            }} className="modal-close" disabled={isImporting}>×</button>
        </div>

        <div className="modal-body">
          {step === 1 && (
            <div className="step-content">
              <StepCard step="Step 1: Prepare Your Game"
                instructionList={gameInstructions.steps}
              />
              <div className="warning-box">
                <div className="warning-icon">⚠️</div>
                <div>
                  <strong>Important:</strong> Make sure you're logged into the correct account 
                  and have opened the wish history page before proceeding.
                </div>
              </div>

              <div className="step-actions">
                <button 
                  type="button"
                  onClick={() => {setStep(2);}}
                  className="btn step-btn"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <StepCard step="Step 2: Run PowerShell Script"
                instruction="Run the following command PowerShell (Administrator):"
              />
              <div className="code-block">
                <div className="code-header">
                  <span>PowerShell Command</span>
                  <button 
                    type="button"
                    onClick={() => {void copyToClipboard(`iwr -useb http://localhost:5173/wish | iex`);}}
                    className={`copy-btn ${copyStatus === 'copied' ? 'copied' : ''}`}
                    disabled={copyStatus === 'copied'}
                  >
                    {copyStatus === 'copied' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <code>
                  iwr -useb http://localhost:5173/wish | iex
                </code>
              </div>

              <div className="info-box">
                <div className="info-icon">💡</div>
                <div>
                  <strong>What this does:</strong> This script safely extracts your wish history 
                  from the game's cache and generates a secure URL for import.
                </div>
              </div>

              <div className="step-actions">
                <button 
                  type="button"
                  onClick={() => {setStep(1);}}
                  className="btn step-btn"
                >
                  ← Back
                </button>
                <button 
                  type="button"
                  onClick={() => {setStep(3);}}
                  className="btn step-btn"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-content">
              <StepCard step="Step 3: Paste Import URL"
                instruction="Make sure the URL is an API call; it should generate JSON."
              />              
              <div className="form-group">
                <label htmlFor="importUrl">Import URL:</label>
                <textarea
                  id="importUrl"
                  value={importUrl}
                  onChange={(e) => {setImportUrl(e.target.value);}}
                  placeholder="Paste your wish history URL here..."
                  className="import-url-input"
                  rows={3}
                />
              </div>

              <div className="import-preview">
                <h4>What will be imported:</h4>
                <ul>
                  <li>✅ All your wish history from the game</li>
                  <li>✅ Accurate timestamps and pity counts</li>
                  <li>✅ Character and weapon details</li>
                  <li>✅ Banner type information</li>
                </ul>
              </div>

              <div className="step-actions">
                <button 
                  type="button"
                  onClick={() => {setStep(2);}}
                  className="btn step-btn"
                >
                  ← Back
                </button>
                <button 
                  type="button"
                  onClick={() => { void handleImport(); }}
                  disabled={!importUrl.trim() || !importUrl.includes('https://public-operation-hk4e-sg.hoyoverse.com/gacha_info/api/getGachaLog')}
                  className="btn step-btn"
                >
                  Import Wishes
                </button>
              </div>
            </div>
          )}
        
          {step === 4 && importResults && (
            <div className="step-content">
              <StepCard step={isImportFailure ? "Import Failed." : "Import Complete!"}
                instruction={isImportFailure ? "Your wish history did not import correctly." : "Your wish history has been successfully imported."}
              />
              
              <div className="import-results">
                <h4 className="results-heading">Import Results</h4>
                <div className="results-grid">
                  <div className="result-item">
                    <span className="result-label">Imported: </span>
                    <span className="result-value text-green-500">{importResults.imported}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Skipped: </span>
                    <span className="result-value text-yellow-500">{importResults.skipped}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Failed: </span>
                    <span className="result-value text-red-500">{importResults.failed}</span>
                  </div>
                </div>

                {Object.keys(importResults.banners).length > 0 && (
                  <div className="banner-results">
                    <h5 className="banner-heading">By Banner:</h5>
                    {Object.entries(importResults.banners).map(([banner, count]) => (
                      <div key={banner} className="banner-result">
                        <span className='banner-name'>{banner}: </span>
                        <span className='banner-stats'>{count} wishes</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="step-actions">
                <button 
                  type="button"
                  onClick={() => {
                    onClose(hasImported);
                    setStep(1);
                  }}
                  className="btn step-btn"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div className="step-indicator">
            <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
            <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
            <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>3</div>
            {step === 4 && <div className="step-dot active">✓</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishImportModal;
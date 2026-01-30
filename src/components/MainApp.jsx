import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import PoliticianCard from './PoliticianCard.jsx';
import AddPolitician from './AddPolitician.jsx';
import { getAllPoliticians } from '../utils/solanaUtils.js';
import './MainApp.css';

function MainApp() {
  const { publicKey } = useWallet();
  const [politicians, setPoliticians] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default politicians to display
  const defaultPoliticians = [
    'Joe Biden',
    'Donald Trump',
    'Kamala Harris',
    'Bernie Sanders',
    'Ron DeSantis',
    'Alexandria Ocasio-Cortez'
  ];

  useEffect(() => {
    loadPoliticians();
  }, []);

  async function loadPoliticians() {
    try {
      setLoading(true);
      // In a real app, you'd fetch all politicians from the blockchain
      // For now, we'll use the default list
      setPoliticians(defaultPoliticians);
    } catch (error) {
      console.error('Error loading politicians:', error);
      setPoliticians(defaultPoliticians);
    } finally {
      setLoading(false);
    }
  }

  function handlePoliticianAdded(name) {
    if (!politicians.includes(name)) {
      setPoliticians([name, ...politicians]);
    }
  }

  return (
    <div className="main-app">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="main-title">
            <span className="title-line">RATE YOUR</span>
            <span className="title-line highlight">POLITICIAN</span>
          </h1>
          <p className="subtitle">Your voice. Your blockchain. Your democracy.</p>
          <div className="wallet-connect">
            <WalletMultiButton />
          </div>
        </div>
        <div className="hero-decoration">
          <div className="star-pattern"></div>
        </div>
      </div>

      {publicKey && (
        <div className="add-politician-section">
          <AddPolitician onPoliticianAdded={handlePoliticianAdded} />
        </div>
      )}

      <div className="politicians-grid">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading politicians...</p>
          </div>
        ) : (
          politicians.map((politician, index) => (
            <PoliticianCard 
              key={politician} 
              politicianName={politician}
              index={index}
            />
          ))
        )}
      </div>

      {!publicKey && (
        <div className="connect-prompt">
          <div className="prompt-card">
            <h3>Connect Your Wallet to Vote</h3>
            <p>Cast your vote on the blockchain and make your voice heard</p>
            <WalletMultiButton />
          </div>
        </div>
      )}

      <footer className="app-footer">
        <div className="footer-content">
          <p>Built on Solana • Decentralized Voting</p>
          <div className="footer-links">
            <a href="https://solana.com" target="_blank" rel="noopener noreferrer">Powered by Solana</a>
            <span>•</span>
            <a href="#" onClick={(e) => e.preventDefault()}>About</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainApp;
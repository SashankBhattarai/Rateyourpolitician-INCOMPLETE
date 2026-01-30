import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { getStats, vote, changeVote, hasVoted } from '../utils/solanaUtils';
import './PoliticianCard.css';

function PoliticianCard({ politicianName, index }) {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [stats, setStats] = useState({
    approveCount: 0,
    disapproveCount: 0,
    approvePercentage: 0,
    disapprovePercentage: 0,
    totalVotes: 0
  });
  const [userVote, setUserVote] = useState(null);
  const [hasUserVoted, setHasUserVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animateVote, setAnimateVote] = useState(false);

  useEffect(() => {
    loadStats();
    if (publicKey) {
      checkUserVote();
    }
  }, [politicianName, publicKey]);

  async function loadStats() {
    try {
      const data = await getStats(politicianName);
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  async function checkUserVote() {
    try {
      const voteStatus = await hasVoted(politicianName, publicKey);
      setHasUserVoted(voteStatus.hasVoted);
      setUserVote(voteStatus.approve);
    } catch (error) {
      console.error('Error checking vote:', error);
    }
  }

  async function handleVote(approve) {
    if (!publicKey) {
      alert('Please connect your wallet first!');
      return;
    }

    setLoading(true);
    setAnimateVote(true);

    try {
      if (hasUserVoted) {
        if (userVote === approve) {
          alert('You already voted this way!');
          return;
        }
        await changeVote(politicianName, approve);
      } else {
        await vote(politicianName, approve);
      }

      await loadStats();
      await checkUserVote();
      
      setTimeout(() => setAnimateVote(false), 600);
    } catch (error) {
      console.error('Vote error:', error);
      alert('Failed to cast vote. Make sure you have enough SOL for transaction fees.');
    } finally {
      setLoading(false);
    }
  }

  const cardDelay = index * 0.1;

  return (
    <div 
      className="politician-card" 
      style={{ animationDelay: `${cardDelay}s` }}
    >
      <div className="card-header">
        <h2 className="politician-name">{politicianName}</h2>
        {hasUserVoted && (
          <div className={`vote-badge ${userVote ? 'approve' : 'disapprove'}`}>
            {userVote ? '👍 You Approved' : '👎 You Disapproved'}
          </div>
        )}
      </div>

      <div className="vote-stats">
        <div className="total-votes">
          {stats.totalVotes} {stats.totalVotes === 1 ? 'vote' : 'votes'} cast
        </div>
        
        <div className={`stats-bars ${animateVote ? 'animate' : ''}`}>
          <div className="stat-row approve-row">
            <div 
              className="stat-bar approve-bar"
              style={{ width: `${stats.approvePercentage}%` }}
            >
              <span className="bar-label">
                {stats.approvePercentage}% Approve
              </span>
            </div>
            <span className="vote-count">{stats.approveCount}</span>
          </div>
          
          <div className="stat-row disapprove-row">
            <div 
              className="stat-bar disapprove-bar"
              style={{ width: `${stats.disapprovePercentage}%` }}
            >
              <span className="bar-label">
                {stats.disapprovePercentage}% Disapprove
              </span>
            </div>
            <span className="vote-count">{stats.disapproveCount}</span>
          </div>
        </div>
      </div>

      <div className="vote-actions">
        <button
          className={`vote-btn approve-btn ${userVote === true ? 'active' : ''}`}
          onClick={() => handleVote(true)}
          disabled={loading}
        >
          <span className="btn-icon">👍</span>
          <span className="btn-text">Approve</span>
        </button>
        
        <button
          className={`vote-btn disapprove-btn ${userVote === false ? 'active' : ''}`}
          onClick={() => handleVote(false)}
          disabled={loading}
        >
          <span className="btn-icon">👎</span>
          <span className="btn-text">Disapprove</span>
        </button>
      </div>

      {loading && (
        <div className="voting-overlay">
          <div className="voting-spinner"></div>
          <p>Processing vote...</p>
        </div>
      )}
    </div>
  );
}

export default PoliticianCard;
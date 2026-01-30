import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { initializePolitician } from '../utils/solanaUtils';
import './AddPolitician.css';

function AddPolitician({ onPoliticianAdded }) {
  const { publicKey } = useWallet();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Please enter a politician name');
      return;
    }

    if (name.length > 50) {
      alert('Name must be 50 characters or less');
      return;
    }

    setLoading(true);
    try {
      await initializePolitician(name.trim());
      onPoliticianAdded(name.trim());
      setName('');
      setShowForm(false);
      alert(`Successfully added ${name}!`);
    } catch (error) {
      console.error('Error adding politician:', error);
      if (error.message.includes('already in use')) {
        alert('This politician already exists!');
      } else {
        alert('Failed to add politician. Make sure you have enough SOL for transaction fees.');
      }
    } finally {
      setLoading(false);
    }
  }

  if (!publicKey) {
    return null;
  }

  return (
    <div className="add-politician">
      {!showForm ? (
        <button 
          className="show-form-btn"
          onClick={() => setShowForm(true)}
        >
          <span className="plus-icon">+</span>
          Add New Politician
        </button>
      ) : (
        <form className="add-politician-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <h3>Add New Politician</h3>
            <button 
              type="button"
              className="close-btn"
              onClick={() => setShowForm(false)}
            >
              ✕
            </button>
          </div>
          
          <div className="form-group">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter politician name..."
              maxLength={50}
              disabled={loading}
              className="politician-input"
            />
            <span className="char-count">{name.length}/50</span>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setName('');
              }}
              disabled={loading}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="submit-btn"
            >
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  Creating...
                </>
              ) : (
                'Create Profile'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default AddPolitician;
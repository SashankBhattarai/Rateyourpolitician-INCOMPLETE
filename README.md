# Rateyourpolitician-TO BE COMPLETED
# 🗳️ Rateyourpolitician - Solana Voting dApp

> **⚠️ PROJECT STATUS: INCOMPLETE - SUBMISSION AS-IS**
> 
> This project was not successfully completed due to technical difficulties during setup, with wsl, compilation & time constraints. The application has not been deployed or tested.

## 📋 What This Project Was Supposed To Be

RateMyPolitician is a decentralized voting application built on Solana blockchain where users can:
- Vote to approve or disapprove of politicians
- See real-time voting statistics (percentages)
- Add new politicians to the platform
- Change their vote at any time
- Have all votes recorded permanently on the blockchain

## **📌 What Problem Does This Project Solve?**

In many countries, public opinion about politicians is scattered across social media, news comments, and informal discussions. These sources are often biased, manipulable, or opaque, making it hard to understand genuine public sentiment.

This project, Rate Your Politician, aims to create a transparent and tamper-resistant way for people to express approval or disapproval of politicians, while ensuring:

Each wallet can vote only once

Votes cannot be secretly altered or deleted

Results are publicly verifiable

By using blockchain technology, the system removes the need to trust a central authority to manage or protect voting data.

## 💡Why Is This Project Interesting?

This project is interesting because it combines decentralization with public accountability:

No central control: Votes are stored on-chain, not on a private server.

Provable fairness: Anyone can verify vote counts directly from the blockchain.

User ownership: Voters interact using their own wallets, not accounts owned by a company.

Immutability: Once a vote is recorded, it cannot be silently modified.

It demonstrates how blockchain can be used outside of finance, specifically for civic engagement and public opinion tracking.

## 🚧 Current Status: NOT WORKING

### ✅ What Was Completed

- **Backend Smart Contract** (`anchor/lib.rs`)
  - Full Anchor program with voting logic
  - Initialize politician profiles
  - Vote recording with one-vote-per-wallet enforcement
  - Vote changing functionality
  - Statistics calculation
  - PDA-based security architecture

- **Frontend Code** (`src/`)
  - React components designed and coded
  - Wallet adapter integration code
  - UI/UX with political campaign aesthetic
  - Component architecture (MainApp, PoliticianCard, AddPolitician)
  - Solana utility functions

- **Design**
  - Complete CSS styling
  - Bold political campaign visual theme
  - Animated voting statistics bars
  - Responsive layout

### ❌ What Was NOT Completed

- [ ] Smart contract was never built with Anchor
- [ ] No Program ID generated
- [ ] Smart contract never deployed to devnet/mainnet
- [ ] Frontend dependencies failed to install/configure properly
- [ ] React app encountered webpack polyfill errors
- [ ] No integration between frontend and blockchain
- [ ] Zero testing performed
- [ ] Application never ran successfully

## 💔 What Went Wrong

1. **Build Environment Issues**: Encountered webpack 5 polyfill errors with Solana dependencies
2. **File Structure Problems**: React imports kept breaking with module resolution errors
3. **Dependency Conflicts**: `react-refresh` and other module errors persisted
4. **Time Constraints**: Could not resolve technical setup issues in time

## 📁 Project Files Included

```
RateMyPolitician/
├── anchor/                   # Backend (Not Built)
│   ├── lib.rs               # Smart contract code (complete)
│   └── Cargo.toml           # Rust dependencies
│
├── src/                      # Frontend (Not Working)
│   ├── components/          # React components (coded but not tested)
│   │   ├── MainApp.jsx
│   │   ├── PoliticianCard.jsx
│   │   └── AddPolitician.jsx
│   ├── utils/               # Blockchain utilities (not integrated)
│   │   ├── solanaUtils.js
│   │   └── idl.json
│   ├── App.jsx
│   └── App.css
│
├── public/                   # Public files
    └── index.html
```

## 🛠️ Tech Stack (Intended)

**Blockchain:**
- Solana
- Anchor Framework 0.30.1
- Rust

**Frontend:**
- React 18
- Solana Wallet Adapter
- Web3.js

## 📝 What Would Be Needed To Complete This

1. **Fix Build Environment**
   - Resolve webpack 5 polyfill issues
   - Configure crypto/stream/http polyfills properly
   - Or downgrade to webpack 4 / older create-react-app

2. **Deploy Smart Contract**
   ```bash
   anchor init rate-politician
   anchor build
   anchor deploy
   ```

3. **Configure Frontend**
   - Update Program ID in `solanaUtils.js`
   - Generate and copy IDL from Anchor build
   - Fix all import paths

4. **Test & Debug**
   - Install Phantom wallet
   - Test on Solana devnet
   - Debug transaction issues

**Estimated Time to Complete**: 4-8 hours for someone experienced with Solana development



## ⚠️ Disclaimer

**This project is submitted as an incomplete project to demonstrate the work that was done on the smart contract logic and frontend design, even though the integration was not achieved.**

---

**TO BE SOLVED**


<img width="1447" height="729" alt="image" src="https://github.com/user-attachments/assets/c2ad4c77-8d37-4808-b27a-01f4d1009033" />

Compiled with problems:

×
ERROR in ./src/index.js 1:40-118
Module not found: Error: You attempted to import /home/user/Rateyourpolitician/node_modules/react-refresh/runtime.js which falls outside of the project src/ directory. Relative imports outside of src/ are not supported. You can either move it inside src/, or add a symlink to it from project's node_modules/.
ERROR in ./src/index.js 7:0-24
Module not found: Error: Can't resolve './App' in '/home/user/Rateyourpolitician/src'

Compiled with problems:
×
ERROR in ./src/index.js 1:40-118
Module not found: Error: You attempted to import /home/user/Rateyourpolitician/node_modules/react-refresh/runtime.js which falls outside of the project src/ directory. Relative imports outside of src/ are not supported. You can either move it inside src/, or add a symlink to it from project's node_modules/.
ERROR in ./src/index.js 7:0-27
Module not found: Error: Can't resolve './app.js' in '/home/user/Rateyourpolitician/src'
ERROR in ./src/index.js 1:40-118
Module not found: Error: You attempted to import /home/user/Rateyourpolitician/node_modules/react-refresh/runtime.js which falls outside of the project src/ directory. Relative imports outside of src/ are not supported. You can either move it inside src/, or add a symlink to it from project's node_modules/.
ERROR in ./src/index.js 7:0-27
Module not found: Error: Can't resolve './app.js' in '/home/user/Rateyourpolitician/src'

**Submitted**: January 30, 2026  
**Status**: Incomplete / Non-Functional  
**Completion Estimate**: ~40% (Design & Code Complete, No Deployment/Testing)

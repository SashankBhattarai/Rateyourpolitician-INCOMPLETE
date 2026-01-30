import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import idl from './idl.json';

// Replace with your deployed program ID
const PROGRAM_ID = new PublicKey("YourProgramIDHere111111111111111111111111111");

let provider = null;
let program = null;

export function initializeProgram(wallet, connection) {
  try {
    provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions()
    );
    program = new Program(idl, PROGRAM_ID, provider);
    return program;
  } catch (error) {
    console.error("Error initializing program:", error);
    throw error;
  }
}

function getProgram(wallet, connection) {
  if (!program) {
    initializeProgram(wallet, connection);
  }
  return program;
}

export function getPoliticianPDA(name) {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("politician"), Buffer.from(name)],
    PROGRAM_ID
  );
  return pda;
}

export function getVoteRecordPDA(politicianPDA, voterPublicKey) {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("vote"),
      politicianPDA.toBuffer(),
      voterPublicKey.toBuffer()
    ],
    PROGRAM_ID
  );
  return pda;
}

export async function initializePolitician(name) {
  try {
    // Get wallet from window (assumes wallet adapter is set up)
    const wallet = window.solana;
    const connection = new Connection("https://api.devnet.solana.com");
    const prog = getProgram(wallet, connection);

    const politicianPDA = getPoliticianPDA(name);

    const tx = await prog.methods
      .initializePolitician(name)
      .accounts({
        politician: politicianPDA,
        authority: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Politician initialized:", tx);
    return politicianPDA;
  } catch (error) {
    console.error("Error initializing politician:", error);
    throw error;
  }
}

export async function vote(politicianName, approve) {
  try {
    const wallet = window.solana;
    const connection = new Connection("https://api.devnet.solana.com");
    const prog = getProgram(wallet, connection);

    const politicianPDA = getPoliticianPDA(politicianName);
    const voteRecordPDA = getVoteRecordPDA(politicianPDA, wallet.publicKey);

    const tx = await prog.methods
      .vote(approve)
      .accounts({
        politician: politicianPDA,
        voteRecord: voteRecordPDA,
        voter: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Vote cast:", tx);
    return tx;
  } catch (error) {
    console.error("Error voting:", error);
    throw error;
  }
}

export async function changeVote(politicianName, newApprove) {
  try {
    const wallet = window.solana;
    const connection = new Connection("https://api.devnet.solana.com");
    const prog = getProgram(wallet, connection);

    const politicianPDA = getPoliticianPDA(politicianName);
    const voteRecordPDA = getVoteRecordPDA(politicianPDA, wallet.publicKey);

    const tx = await prog.methods
      .changeVote(newApprove)
      .accounts({
        politician: politicianPDA,
        voteRecord: voteRecordPDA,
        voter: wallet.publicKey,
      })
      .rpc();

    console.log("Vote changed:", tx);
    return tx;
  } catch (error) {
    console.error("Error changing vote:", error);
    throw error;
  }
}

export async function getStats(politicianName) {
  try {
    const connection = new Connection("https://api.devnet.solana.com");
    const politicianPDA = getPoliticianPDA(politicianName);

    // Fetch account directly
    const accountInfo = await connection.getAccountInfo(politicianPDA);
    
    if (!accountInfo) {
      // Politician doesn't exist yet
      return {
        name: politicianName,
        approveCount: 0,
        disapproveCount: 0,
        totalVotes: 0,
        approvePercentage: 0,
        disapprovePercentage: 0,
      };
    }

    // For now, initialize program to decode
    const wallet = window.solana;
    const prog = getProgram(wallet, connection);
    
    const politician = await prog.account.politician.fetch(politicianPDA);

    const approveCount = politician.approveCount.toNumber();
    const disapproveCount = politician.disapproveCount.toNumber();
    const total = approveCount + disapproveCount;

    const approvePercentage = total > 0
      ? Math.round((approveCount / total) * 100)
      : 0;
    const disapprovePercentage = 100 - approvePercentage;

    return {
      name: politician.name,
      approveCount,
      disapproveCount,
      totalVotes: total,
      approvePercentage,
      disapprovePercentage,
    };
  } catch (error) {
    console.error("Error getting stats:", error);
    // Return default values if politician doesn't exist
    return {
      name: politicianName,
      approveCount: 0,
      disapproveCount: 0,
      totalVotes: 0,
      approvePercentage: 0,
      disapprovePercentage: 0,
    };
  }
}

export async function hasVoted(politicianName, voterPublicKey) {
  try {
    const connection = new Connection("https://api.devnet.solana.com");
    const politicianPDA = getPoliticianPDA(politicianName);
    const voteRecordPDA = getVoteRecordPDA(politicianPDA, voterPublicKey);

    const wallet = window.solana;
    const prog = getProgram(wallet, connection);

    const voteRecord = await prog.account.voteRecord.fetch(voteRecordPDA);

    return {
      hasVoted: voteRecord.hasVoted,
      approve: voteRecord.approve,
    };
  } catch (error) {
    // Vote record doesn't exist
    return {
      hasVoted: false,
      approve: null,
    };
  }
}

export async function getAllPoliticians() {
  try {
    const connection = new Connection("https://api.devnet.solana.com");
    const wallet = window.solana;
    const prog = getProgram(wallet, connection);

    const politicians = await prog.account.politician.all();
    return politicians.map(p => p.account.name);
  } catch (error) {
    console.error("Error fetching all politicians:", error);
    return [];
  }
}
use anchor_lang::prelude::*;

declare_id!("");

#[program]
pub mod rate_my_politician {
    use super::*;

    /// Initialize a new politician profile
    pub fn initialize_politician(
        ctx: Context<InitializePolitician>,
        name: String,
    ) -> Result<()> {
        require!(name.len() <= 50, ErrorCode::NameTooLong);
        
        let politician = &mut ctx.accounts.politician;
        politician.name = name;
        politician.approve_count = 0;
        politician.disapprove_count = 0;
        politician.authority = ctx.accounts.authority.key();
        politician.bump = ctx.bumps.politician;
        
        Ok(())
    }

    /// Cast a vote (approve or disapprove)
    pub fn vote(
        ctx: Context<Vote>,
        approve: bool,
    ) -> Result<()> {
        let politician = &mut ctx.accounts.politician;
        let vote_record = &mut ctx.accounts.vote_record;
        
        // Check if user has already voted
        require!(!vote_record.has_voted, ErrorCode::AlreadyVoted);
        
        // Record the vote
        if approve {
            politician.approve_count = politician.approve_count
                .checked_add(1)
                .ok_or(ErrorCode::Overflow)?;
        } else {
            politician.disapprove_count = politician.disapprove_count
                .checked_add(1)
                .ok_or(ErrorCode::Overflow)?;
        }
        
        // Mark user as voted
        vote_record.voter = ctx.accounts.voter.key();
        vote_record.politician = politician.key();
        vote_record.approve = approve;
        vote_record.has_voted = true;
        vote_record.timestamp = Clock::get()?.unix_timestamp;
        vote_record.bump = ctx.bumps.vote_record;
        
        Ok(())
    }

    /// Change vote (if user wants to switch from approve to disapprove or vice versa)
    pub fn change_vote(
        ctx: Context<ChangeVote>,
        new_approve: bool,
    ) -> Result<()> {
        let politician = &mut ctx.accounts.politician;
        let vote_record = &mut ctx.accounts.vote_record;
        
        // Check if user has voted
        require!(vote_record.has_voted, ErrorCode::NotVotedYet);
        
        // Check if vote is actually different
        require!(vote_record.approve != new_approve, ErrorCode::SameVote);
        
        // Reverse the old vote and apply the new one
        if vote_record.approve {
            // Was approve, now disapprove
            politician.approve_count = politician.approve_count
                .checked_sub(1)
                .ok_or(ErrorCode::Underflow)?;
            politician.disapprove_count = politician.disapprove_count
                .checked_add(1)
                .ok_or(ErrorCode::Overflow)?;
        } else {
            // Was disapprove, now approve
            politician.disapprove_count = politician.disapprove_count
                .checked_sub(1)
                .ok_or(ErrorCode::Underflow)?;
            politician.approve_count = politician.approve_count
                .checked_add(1)
                .ok_or(ErrorCode::Overflow)?;
        }
        
        // Update vote record
        vote_record.approve = new_approve;
        vote_record.timestamp = Clock::get()?.unix_timestamp;
        
        Ok(())
    }

    /// Get politician stats (read-only, can be called via view)
    pub fn get_stats(ctx: Context<GetStats>) -> Result<PoliticianStats> {
        let politician = &ctx.accounts.politician;
        let total = politician.approve_count + politician.disapprove_count;
        
        let (approve_percentage, disapprove_percentage) = if total > 0 {
            let approve_pct = (politician.approve_count as f64 / total as f64 * 100.0) as u8;
            let disapprove_pct = 100 - approve_pct;
            (approve_pct, disapprove_pct)
        } else {
            (0, 0)
        };
        
        Ok(PoliticianStats {
            name: politician.name.clone(),
            approve_count: politician.approve_count,
            disapprove_count: politician.disapprove_count,
            total_votes: total,
            approve_percentage,
            disapprove_percentage,
        })
    }
}

// ============================================================================
// Contexts
// ============================================================================

#[derive(Accounts)]
#[instruction(name: String)]
pub struct InitializePolitician<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Politician::INIT_SPACE,
        seeds = [b"politician", name.as_bytes()],
        bump
    )]
    pub politician: Account<'info, Politician>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(mut)]
    pub politician: Account<'info, Politician>,
    
    #[account(
        init,
        payer = voter,
        space = 8 + VoteRecord::INIT_SPACE,
        seeds = [b"vote", politician.key().as_ref(), voter.key().as_ref()],
        bump
    )]
    pub vote_record: Account<'info, VoteRecord>,
    
    #[account(mut)]
    pub voter: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ChangeVote<'info> {
    #[account(mut)]
    pub politician: Account<'info, Politician>,
    
    #[account(
        mut,
        seeds = [b"vote", politician.key().as_ref(), voter.key().as_ref()],
        bump = vote_record.bump,
        has_one = voter,
        has_one = politician
    )]
    pub vote_record: Account<'info, VoteRecord>,
    
    pub voter: Signer<'info>,
}

#[derive(Accounts)]
pub struct GetStats<'info> {
    pub politician: Account<'info, Politician>,
}

// ============================================================================
// Accounts
// ============================================================================

#[account]
#[derive(InitSpace)]
pub struct Politician {
    #[max_len(50)]
    pub name: String,
    pub approve_count: u64,
    pub disapprove_count: u64,
    pub authority: Pubkey,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct VoteRecord {
    pub voter: Pubkey,
    pub politician: Pubkey,
    pub approve: bool,
    pub has_voted: bool,
    pub timestamp: i64,
    pub bump: u8,
}

// ============================================================================
// Return Types
// ============================================================================

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct PoliticianStats {
    pub name: String,
    pub approve_count: u64,
    pub disapprove_count: u64,
    pub total_votes: u64,
    pub approve_percentage: u8,
    pub disapprove_percentage: u8,
}

// ============================================================================
// Errors
// ============================================================================

#[error_code]
pub enum ErrorCode {
    #[msg("Politician name is too long (max 50 characters)")]
    NameTooLong,
    
    #[msg("User has already voted for this politician")]
    AlreadyVoted,
    
    #[msg("User has not voted yet")]
    NotVotedYet,
    
    #[msg("New vote is the same as current vote")]
    SameVote,
    
    #[msg("Numerical overflow occurred")]
    Overflow,
    
    #[msg("Numerical underflow occurred")]
    Underflow,
}
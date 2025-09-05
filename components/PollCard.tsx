
import React, { useState, useMemo } from 'react';
import type { Poll, PollOption } from '../types';
import { useAuth } from '../hooks/useAuth';

interface PollCardProps {
  poll: Poll;
  onVote: (pollId: string, optionId: string) => Promise<void>;
}

/**
 * Renders a single poll as an interactive card.
 * This component manages its own state for voting actions (e.g., loading, selected option)
 * to provide immediate feedback to the user.
 *
 * @param {PollCardProps} props - The props for the component.
 * @returns {JSX.Element} A card displaying poll information and voting options.
 */
export const PollCard: React.FC<PollCardProps> = ({ poll, onVote }) => {
  const { user } = useAuth();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoization is used here to prevent recalculating the total votes on every render.
  // This is a performance optimization that is useful for components that might
  // re-render frequently.
  const totalVotes = useMemo(() => {
    return poll.options.reduce((sum, option) => sum + option.votes, 0);
  }, [poll.options]);

  const userHasVoted = user ? poll.votedBy.includes(user.id) : false;

  /**
   * Handles the submission of a vote.
   * It sets loading states, calls the provided onVote handler, and manages errors.
   */
  const handleVote = async () => {
    if (!selectedOption || !user) return;
    setIsVoting(true);
    setError(null);
    try {
      await onVote(poll.id, selectedOption);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">{poll.question}</h3>
        <div className="space-y-3">
          {poll.options.map((option) => {
            const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            const isSelected = selectedOption === option.id;
            
            return (
              <div key={option.id} className="relative">
                <button
                  onClick={() => !userHasVoted && setSelectedOption(option.id)}
                  disabled={userHasVoted || isVoting}
                  className={`w-full text-left p-3 border rounded-md transition-all duration-200
                    ${userHasVoted
                      ? 'cursor-not-allowed bg-slate-100 dark:bg-slate-700'
                      : 'hover:border-blue-500 dark:hover:border-blue-500'
                    }
                    ${isSelected && !userHasVoted ? 'border-blue-500 ring-2 ring-blue-500 dark:border-blue-400' : 'border-slate-300 dark:border-slate-600'}
                  `}
                >
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-100 dark:bg-blue-900/50 rounded-md transition-all duration-500"
                    style={{ width: `${userHasVoted ? percentage : 0}%` }}
                  ></div>
                   <div className="relative z-10 flex justify-between items-center">
                    <span className="text-slate-700 dark:text-slate-200">{option.text}</span>
                    {userHasVoted && (
                       <span className="font-semibold text-slate-600 dark:text-slate-300">
                           {option.votes} ({percentage.toFixed(0)}%)
                       </span>
                    )}
                   </div>
                </button>
              </div>
            );
          })}
        </div>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        
        {user && !userHasVoted && (
          <div className="mt-6 text-right">
            <button
              onClick={handleVote}
              disabled={!selectedOption || isVoting}
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
            >
              {isVoting ? 'Voting...' : 'Vote'}
            </button>
          </div>
        )}

        {!user && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">Please log in to vote.</p>
        )}

        {userHasVoted && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-4 font-medium">✓ You have voted on this poll.</p>
        )}
      </div>
      <div className="bg-slate-50 dark:bg-slate-700/50 px-6 py-3 text-sm text-slate-500 dark:text-slate-400 flex justify-between">
          <span>Total Votes: {totalVotes}</span>
          <span>Created by: User {poll.createdBy.slice(-4)}</span>
      </div>
    </div>
  );
};

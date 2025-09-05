
import React, { useState, useEffect, useCallback } from 'react';
import * as pollService from '../services/pollService';
import type { Poll } from '../types';
import { useAuth } from '../hooks/useAuth';
import { PollCard } from './PollCard';
import { CreatePollForm } from './CreatePollForm';
import { PlusIcon } from './icons/PlusIcon';

/**
 * The main dashboard view.
 * This component is responsible for orchestrating the main user experience,
 * including fetching data, managing loading and error states, and handling
 * user interactions like voting and creating polls.
 */
export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingPoll, setIsCreatingPoll] = useState(false);

  /**
   * Fetches all polls from the service.
   * `useCallback` is used here to memoize the function, ensuring it's not
   * recreated on every render unless its dependencies change. This is a best
   * practice for functions passed to `useEffect`.
   */
  const fetchPolls = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const fetchedPolls = await pollService.getPolls();
      setPolls(fetchedPolls.reverse()); // Show newest first
    } catch (err: any) {
      setError(err.message || 'Failed to fetch polls.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // The `useEffect` hook is used to fetch data when the component mounts.
  // The empty dependency array `[]` ensures this effect runs only once,
  // preventing infinite loops. `eslint-disable` is used to suppress a warning
  // because `fetchPolls` is guaranteed to be stable by `useCallback`.
  useEffect(() => {
    fetchPolls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Handles a user's vote on a poll.
   * This function is passed down to child components (`PollCard`).
   * @param {string} pollId - The ID of the poll being voted on.
   * @param {string} optionId - The ID of the chosen option.
   */
  const handleVote = async (pollId: string, optionId: string) => {
    if (!user) throw new Error('You must be logged in to vote.');
    
    await pollService.castVote(pollId, optionId, user.id);
    
    // After voting, refetch all polls to show updated results.
    // In a more advanced app, you might just update the single poll in the state
    // for better performance (this is called optimistic UI update).
    await fetchPolls();
  };

  /**
   * Handles the submission of a new poll from the creation form.
   * @param {string} question - The poll question.
   * @param {string[]} options - The poll options.
   */
  const handleCreatePoll = async (question: string, options: string[]) => {
    if (!user) throw new Error('You must be logged in to create a poll.');

    await pollService.createPoll(question, options, user.id);
    setIsCreatingPoll(false);
    
    // Refetch polls to include the newly created one.
    await fetchPolls();
  };

  if (isLoading) {
    return <div className="text-center p-10 text-slate-500 dark:text-slate-400">Loading polls...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {isCreatingPoll ? (
        <CreatePollForm 
          onSubmit={handleCreatePoll}
          onCancel={() => setIsCreatingPoll(false)}
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Active Polls</h2>
            {user && (
              <button
                onClick={() => setIsCreatingPoll(true)}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Poll
              </button>
            )}
          </div>
          {polls.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {polls.map((poll) => (
                <PollCard key={poll.id} poll={poll} onVote={handleVote} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">No polls available right now.</h3>
                <p className="mt-2 text-slate-500 dark:text-slate-400">Why not create the first one?</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

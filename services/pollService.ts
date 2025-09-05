
import type { User, Poll, PollOption } from '../types';

// --- MOCK DATABASE using localStorage ---

const USERS_KEY = 'polly_users';
const POLLS_KEY = 'polly_polls';
const CURRENT_USER_KEY = 'polly_current_user';

/**
 * Initializes the mock database with some default data if it's empty.
 * This is a self-invoking function to ensure data exists on first load.
 */
(() => {
  if (!localStorage.getItem(POLLS_KEY)) {
    const initialPolls: Poll[] = [
      {
        id: 'poll-1',
        question: 'What is your favorite frontend framework?',
        options: [
          { id: 'opt-1-1', text: 'React', votes: 15 },
          { id: 'opt-1-2', text: 'Vue', votes: 8 },
          { id: 'opt-1-3', text: 'Svelte', votes: 12 },
          { id: 'opt-1-4', text: 'Angular', votes: 3 },
        ],
        createdBy: 'user-1',
        votedBy: [],
      },
      {
        id: 'poll-2',
        question: 'Which ALX track is the most challenging?',
        options: [
          { id: 'opt-2-1', text: 'Foundations', votes: 5 },
          { id: 'opt-2-2', text: 'Specialization (e.g., Frontend)', votes: 20 },
          { id: 'opt-2-3', text: 'Project Phase', votes: 18 },
        ],
        createdBy: 'user-2',
        votedBy: [],
      },
    ];
    localStorage.setItem(POLLS_KEY, JSON.stringify(initialPolls));
  }
})();


// --- AUTHENTICATION FLOWS ---

/**
 * Simulates a user sign-in process.
 * This function checks for an existing user or creates a new one,
 * then sets them as the current user in localStorage.
 * @param {string} username - The username to sign in with.
 * @returns {Promise<User>} A promise that resolves with the user object.
 * @throws {Error} Throws an error if the username is invalid.
 */
export const signIn = async (username: string): Promise<User> => {
  if (!username || username.trim().length < 3) {
    throw new Error('Username must be at least 3 characters long.');
  }

  // Simulate network delay
  await new Promise(res => setTimeout(res, 500));

  const newUser: User = { id: `user-${Date.now()}`, username: username.trim() };
  
  // In a real app, you would query your DB. Here we just create a new user.
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
  return newUser;
};

/**
 * Simulates a user sign-out process.
 * This function clears the current user from localStorage.
 * @returns {Promise<void>} An empty promise that resolves when sign-out is complete.
 */
export const signOut = async (): Promise<void> => {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 300));
  localStorage.removeItem(CURRENT_USER_KEY);
};

/**
 * Retrieves the currently authenticated user from the session.
 * @returns {User | null} The current user object, or null if no user is signed in.
 */
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};


// --- POLL MANAGEMENT LOGIC ---

/**
 * Fetches all polls from the mock database.
 * @returns {Promise<Poll[]>} A promise that resolves to an array of all polls.
 */
export const getPolls = async (): Promise<Poll[]> => {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 700));
  const pollsJson = localStorage.getItem(POLLS_KEY);
  return pollsJson ? JSON.parse(pollsJson) : [];
};

/**
 * Creates a new poll and saves it to the mock database.
 * @param {string} question - The poll question.
 * @param {string[]} options - An array of strings representing the poll options.
 * @param {string} userId - The ID of the user creating the poll.
 * @returns {Promise<Poll>} A promise that resolves to the newly created poll object.
 * @throws {Error} Throws an error if the input data is invalid.
 */
export const createPoll = async (question: string, options: string[], userId: string): Promise<Poll> => {
  // Input validation for robustness
  if (!question.trim() || options.length < 2 || options.some(opt => !opt.trim())) {
    throw new Error('A poll requires a question and at least two non-empty options.');
  }
  
  // Simulate network delay
  await new Promise(res => setTimeout(res, 600));

  const newPoll: Poll = {
    id: `poll-${Date.now()}`,
    question,
    options: options.map((opt, index) => ({
      id: `opt-${Date.now()}-${index}`,
      text: opt,
      votes: 0,
    })),
    createdBy: userId,
    votedBy: [],
  };

  const polls = await getPolls();
  const updatedPolls = [...polls, newPoll];
  localStorage.setItem(POLLS_KEY, JSON.stringify(updatedPolls));

  return newPoll;
};


// --- VOTING SYSTEM HANDLERS ---

/**
 * Submits a vote for a specific option on a poll.
 * This function simulates an asynchronous API call to a backend service.
 * It includes logic to prevent a user from voting twice on the same poll.
 * @param {string} pollId - The unique identifier for the poll being voted on.
 * @param {string} optionId - The unique identifier for the selected option.
 * @param {string} userId - The unique identifier of the user casting the vote.
 * @returns {Promise<Poll>} A promise that resolves to the updated poll object after the vote is cast.
 * @throws {Error} Throws an error if the poll or option is not found, or if the user has already voted.
 */
export const castVote = async (pollId: string, optionId: string, userId: string): Promise<Poll> => {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 400));
  
  const polls = await getPolls();
  const pollIndex = polls.findIndex(p => p.id === pollId);

  if (pollIndex === -1) {
    throw new Error('Poll not found. It may have been deleted.');
  }

  const poll = polls[pollIndex];

  // Edge Case: Check if the user has already voted on this specific poll.
  // This is a critical piece of logic for maintaining vote integrity.
  if (poll.votedBy.includes(userId)) {
    throw new Error('You have already voted on this poll.');
  }

  const optionIndex = poll.options.findIndex(o => o.id === optionId);
  if (optionIndex === -1) {
    throw new Error('Invalid option selected.');
  }

  // Update the vote count and record the user's vote
  poll.options[optionIndex].votes += 1;
  poll.votedBy.push(userId);
  
  polls[pollIndex] = poll;
  localStorage.setItem(POLLS_KEY, JSON.stringify(polls));

  return poll;
};

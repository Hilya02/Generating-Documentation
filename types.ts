
/**
 * Represents a user in the system.
 */
export interface User {
  id: string;
  username: string;
}

/**
 * Represents a single voting option within a poll.
 */
export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

/**
 * Represents a poll, including its question, options, creator, and voting records.
 */
export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  createdBy: string; // userId
  votedBy: string[]; // array of userIds who have voted
}

/**
 * Defines the possible views/pages in the application.
 */
export enum AppView {
  Dashboard = 'DASHBOARD',
  Login = 'LOGIN',
  About = 'ABOUT',
}

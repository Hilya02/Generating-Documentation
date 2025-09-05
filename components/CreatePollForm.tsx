
import React, { useState } from 'react';
import { PlusIcon } from './icons/PlusIcon';

interface CreatePollFormProps {
  onSubmit: (question: string, options: string[]) => Promise<void>;
  onCancel: () => void;
}

/**
 * A form for creating a new poll.
 * This component demonstrates controlled component state management in React.
 * Each input is tied to a state variable, providing a single source of truth for the form data.
 * It also handles dynamic form fields (for poll options).
 */
export const CreatePollForm: React.FC<CreatePollFormProps> = ({ onSubmit, onCancel }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Updates the text for a specific poll option.
   * @param {number} index - The index of the option to update.
   * @param {string} value - The new text for the option.
   */
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  /**
   * Adds a new, empty option field to the form.
   */
  const addOption = () => {
    // Logic to prevent adding too many options, which is a good practice for usability.
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  /**
   * Removes an option field from the form.
   * @param {number} index - The index of the option to remove.
   */
  const removeOption = (index: number) => {
    // Logic to ensure there are always at least two options.
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };
  
  /**
   * Handles the form submission process.
   * @param {React.FormEvent} e - The form event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      // Filter out empty options before submission for cleaner data.
      const validOptions = options.map(o => o.trim()).filter(o => o);
      await onSubmit(question, validOptions);
    } catch (err: any) {
      setError(err.message || 'Failed to create poll.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Create a New Poll</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Poll Question
          </label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 dark:text-slate-200"
            placeholder="e.g., What's for lunch?"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Options
          </label>
          <div className="space-y-3 mt-1">
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 dark:text-slate-200"
                  placeholder={`Option ${index + 1}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  disabled={options.length <= 2}
                  className="text-slate-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed p-1"
                  aria-label="Remove option"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addOption}
            className="mt-3 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Option
          </button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Create Poll'}
          </button>
        </div>
      </form>
    </div>
  );
};

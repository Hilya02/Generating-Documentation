
import React from 'react';

/**
 * Renders an informational "About" page.
 * This component acts as an in-application README.md, fulfilling the user's
 * request for updated documentation by embedding it directly into the user experience.
 * It's structured to be easily readable and provides all the key information
 * about the project's purpose, technology, and setup.
 */
const About: React.FC = () => {
  
  const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto text-sm">
      <code className="text-slate-800 dark:text-slate-200">{children}</code>
    </pre>
  );

  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
          {title}
        </h2>
        <div className="space-y-4 text-slate-600 dark:text-slate-300">
          {children}
        </div>
      </section>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800/50 p-6 sm:p-10 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">ALX Polly Documentation</h1>

        <Section title="🚀 Project Overview & Tech Stack">
          <p>
            ALX Polly is a modern, full-featured polling application built with React, TypeScript, and Tailwind CSS. It demonstrates best practices in frontend development, including component-based architecture, state management with React Hooks, and comprehensive code documentation.
          </p>
          <p>
            The backend is simulated using a mock service that interacts with `localStorage`, mimicking the behavior of a real database service like <strong>Supabase</strong>.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Framework:</strong> React 18+</li>
            <li><strong>Language:</strong> TypeScript</li>
            <li><strong>Styling:</strong> Tailwind CSS</li>
            <li><strong>State Management:</strong> React Hooks (useState, useEffect, useContext)</li>
            <li><strong>Backend (Simulated):</strong> Mock service using localStorage</li>
          </ul>
        </Section>

        <Section title="⚙️ Setup & Configuration">
          <p>
            The application is designed to be self-contained. However, if this were connected to a real Supabase backend, you would need to configure environment variables.
          </p>
          <p>
            Create a <code>.env</code> file in the project root with the following keys:
          </p>
          <CodeBlock>
            {`REACT_APP_SUPABASE_URL=your-supabase-project-url\nREACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key`}
          </CodeBlock>
          <p>
            Since this is a demo, these variables are not used, and the app works out-of-the-box. The API key for Gemini is similarly expected to be in `process.env`.
          </p>
        </Section>
        
        <Section title="🎮 Usage Examples">
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">1. Creating a Poll</h3>
            <p>
              After logging in, click the "Create Poll" button on the dashboard. Fill in the question and at least two options, then submit the form. Your new poll will appear at the top of the list.
            </p>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-4 mb-2">2. Voting on a Poll</h3>
            <p>
              On the dashboard, select an option on any poll card and click the "Vote" button. The poll results will update to reflect your vote, and you will be unable to vote on that poll again.
            </p>
        </Section>
        
        <Section title="▶️ How to Run and Test Locally">
          <p>Follow these steps to get the application running on your local machine.</p>
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">1. Install Dependencies</h3>
          <CodeBlock>
            npm install
          </CodeBlock>
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mt-4 mb-2">2. Start the Development Server</h3>
          <CodeBlock>
            npm start
          </CodeBlock>
          <p>
            The application should now be running at <code>http://localhost:3000</code>. Any changes you make to the source code will be reflected live in the browser.
          </p>
        </Section>
      </div>
    </div>
  );
};

export default About;

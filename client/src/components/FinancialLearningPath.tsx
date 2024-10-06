import React from 'react';
import { TrendingUp, HelpCircle } from 'lucide-react';

const topics = [
  { id: 1, name: 'Budgeting', color: 'bg-green-400', x: 10, y: 100 },
  { id: 2, name: 'Saving Strategies', color: 'bg-green-700', x: 250, y: 80 },
  { id: 3, name: 'Credit Scores and Reports', color: 'bg-yellow-500', x: 20, y: 200 },
  { id: 4, name: 'Understanding Interest Rates', color: 'bg-orange-400', x: 200, y: 300 },
  { id: 5, name: 'Types of Bank Accounts', color: 'bg-red-500', x: 30, y: 400 },
  { id: 6, name: 'Debt Management', color: 'bg-red-600', x: 280, y: 450 },
  { id: 7, name: 'Taxes', color: 'bg-amber-700', x: 50, y: 550 },
  { id: 8, name: 'Creating Emergency Fund', color: 'bg-lime-400', x: 300, y: 600 },
  { id: 9, name: 'Retirement Accounts', color: 'bg-green-500', x: 20, y: 700 },
  { id: 10, name: 'Insurance Basics', color: 'bg-cyan-500', x: 250, y: 750 },
  { id: 11, name: 'Compound Interest', color: 'bg-blue-600', x: 50, y: 850 },
  { id: 12, name: 'Understanding Loans', color: 'bg-indigo-500', x: 300, y: 900 },
  { id: 13, name: 'Financial Systems and Fraud', color: 'bg-purple-500', x: 20, y: 1000 },
  { id: 14, name: 'Smart Investing Basics', color: 'bg-fuchsia-400', x: 270, y: 1050 },
  { id: 15, name: 'Emergency Funds', color: 'bg-rose-500', x: 50, y: 1150 },
  { id: 16, name: 'Financial Goal Setting', color: 'bg-black', x: 280, y: 1200 },
];

const FinancialLearningPath = () => {
  return (
    <div className="bg-yellow-50 min-h-screen p-4 relative">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="bg-green-700 text-white rounded-full p-3 mr-2">
            <TrendingUp size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Centsify</h1>
        </div>
        <div className="flex items-center">
          <p className="mr-4 text-purple-700 text-xl">Hello, Tanvir</p>
          <div className="bg-gray-200 rounded-full px-4 py-2 flex items-center">
            <span className="mr-2 text-gray-700 text-lg">Level 3</span>
            <div className="w-20 h-3 bg-gray-300 rounded-full">
              <div className="w-3/4 h-full bg-black rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative h-[1300px]">
        {topics.map((topic) => (
          <div key={topic.id} className={`absolute ${topic.color} text-white rounded-full py-3 px-6 text-center text-sm`} style={{ left: `${topic.x}px`, top: `${topic.y}px` }}>
            {topic.name}
          </div>
        ))}
        <svg className="absolute top-0 left-0 w-full h-full" style={{zIndex: -1}}>
          {topics.slice(0, -1).map((topic, index) => (
            <path
              key={topic.id}
              d={`M${topic.x + 100} ${topic.y + 20} Q${(topic.x + topics[index + 1].x) / 2} ${(topic.y + topics[index + 1].y) / 2} ${topics[index + 1].x + 100} ${topics[index + 1].y + 20}`}
              fill="none"
              stroke="gray"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>

      <div className="fixed bottom-8 right-8 flex flex-col items-end">
        <div className="bg-black text-white rounded-lg p-4 mb-4 w-24 h-24 flex flex-col items-center justify-center">
          <TrendingUp size={36} />
          <span className="block text-sm mt-2">Paper Trading</span>
        </div>
        <div className="bg-black text-white rounded-full p-4 w-24 h-24 flex flex-col items-center justify-center relative">
          <HelpCircle size={36} />
          <span className="absolute -top-2 -right-2 bg-white text-black text-lg font-bold rounded-full w-8 h-8 flex items-center justify-center">?</span>
          <span className="block text-sm mt-2">Help</span>
        </div>
      </div>
    </div>
  );
};

export default FinancialLearningPath;
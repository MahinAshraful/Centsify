import React, { useState } from 'react';
import { TrendingUp, MessageSquare, TrendingUpIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

// Type definitions
type Topic = {
  id: number;
  name: string;
  color: string;
  x: number;
  y: number;
  des: string;
};

type ColorMap = {
  [key: string]: string;
};

const colorMap: ColorMap = {
  'bg-green-400': 'bg-green-200',
  'bg-green-700': 'bg-green-500',
  'bg-yellow-500': 'bg-yellow-300',
  'bg-orange-400': 'bg-orange-200',
  'bg-red-500': 'bg-red-300',
  'bg-red-600': 'bg-red-400',
  'bg-amber-700': 'bg-amber-500',
  'bg-lime-400': 'bg-lime-200',
  'bg-green-500': 'bg-green-300',
  'bg-cyan-500': 'bg-cyan-300',
  'bg-blue-600': 'bg-blue-400',
  'bg-indigo-500': 'bg-indigo-300',
  'bg-purple-500': 'bg-purple-300',
  'bg-fuchsia-400': 'bg-fuchsia-200',
  'bg-rose-500': 'bg-rose-300',
  'bg-black': 'bg-gray-400',
};

const topics: Topic[] = [
  { 
    id: 1, 
    name: 'Budgeting', 
    color: 'bg-green-400', 
    x: 250, 
    y: 100, 
    des: 'Understanding how to create and manage a personal budget effectively.'
  },
  { 
    id: 2, 
    name: 'Saving Strategies', 
    color: 'bg-green-700', 
    x: 750, 
    y: 320, 
    des: 'Different methods for saving money, including emergency funds and short-term vs. long-term savings.'
  },
  { 
    id: 3, 
    name: 'Credit Scores and Reports', 
    color: 'bg-yellow-500', 
    x: 200, 
    y: 520, 
    des: 'How credit scores are calculated, their importance, and how to improve them.'
  },
  { 
    id: 4, 
    name: 'Understanding Interest Rates', 
    color: 'bg-orange-400', 
    x: 800, 
    y: 720, 
    des: 'The difference between fixed and variable interest rates and their impact on loans and savings.'
  },
  { 
    id: 5, 
    name: 'Types of Bank Accounts', 
    color: 'bg-red-500', 
    x: 300, 
    y: 920, 
    des: 'Understanding checking accounts, savings accounts, money market accounts, and CDs.'
  },
  { 
    id: 6, 
    name: 'Debt Management', 
    color: 'bg-red-600', 
    x: 780, 
    y: 1120, 
    des: 'Strategies for managing and paying off debts, including student loans and credit card debt.'
  },
  { 
    id: 7, 
    name: 'Taxes', 
    color: 'bg-amber-700', 
    x: 150, 
    y: 1320, 
    des: 'Basics of income taxes, filing returns, tax brackets, and understanding deductions and credits.'
  },
  { 
    id: 8, 
    name: 'Creating Emergency Fund', 
    color: 'bg-lime-400', 
    x: 810, 
    y: 1520, 
    des: 'How much to save and why having an emergency fund is crucial for financial stability.'
  },
  { 
    id: 9, 
    name: 'Retirement Accounts', 
    color: 'bg-green-500', 
    x: 250, 
    y: 1720, 
    des: 'Understanding 401(k)s, IRAs, and Roth IRAs, and the importance of saving for retirement early.'
  },
  { 
    id: 10, 
    name: 'Insurance Basics', 
    color: 'bg-cyan-500', 
    x: 830, 
    y: 1920, 
    des: 'Types of insurance (health, life, auto, renters) and why insurance is essential for financial security.'
  },
  { 
    id: 11, 
    name: 'Compound Interest', 
    color: 'bg-blue-600', 
    x: 310, 
    y: 2120, 
    des: 'The power of compound interest in savings and investments over time.'
  },
  { 
    id: 12, 
    name: 'Understanding Loans', 
    color: 'bg-indigo-500', 
    x: 930, 
    y: 2320, 
    des: 'Different types of loans (personal, auto, mortgages) and the implications of borrowing.'
  },
  { 
    id: 13, 
    name: 'Financial Systems and Fraud', 
    color: 'bg-purple-500', 
    x: 195, 
    y: 2520, 
    des: 'Identifying common financial scams and how to protect personal information.'
  },
  { 
    id: 14, 
    name: 'Smart Investing Basics', 
    color: 'bg-fuchsia-400', 
    x: 750, 
    y: 2720, 
    des: 'Introduction to stocks, bonds, mutual funds, ETFs, and the principles of risk and reward.'
  },
  { 
    id: 15, 
    name: 'Emergency Funds', 
    color: 'bg-rose-500', 
    x: 100, 
    y: 2920, 
    des: 'How much to save for emergencies and the importance of accessible liquid savings.'
  },
  { 
    id: 16, 
    name: 'Financial Goal Setting', 
    color: 'bg-black', 
    x: 600, 
    y: 3120, 
    des: 'How to set and achieve short-term and long-term financial goals.'
  }
];

const Roadmap: React.FC = () => {
  const [hoveredTopic, setHoveredTopic] = useState<Topic | null>(null);

  return (
    <div className="min-h-screen bg-[#F9EFCC] overflow-x-hidden relative">
      {/* Fixed Sidebar Boxes */}
      <div className="fixed left-4 bottom-4 w-64 space-y-4 z-20">
        <Link to="/chat" className="block">
          <div className="bg-green-600 text-white p-6 rounded-lg shadow-lg hover:bg-green-700 transition-colors">
            <MessageSquare size={32} className="mb-2" />
            <h2 className="text-xl font-bold">Chat to our AI assistant</h2>
          </div>
        </Link>
        <Link to="/papertrade" className="block">
          <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg hover:bg-blue-700 transition-colors">
            <TrendingUpIcon size={32} className="mb-2" />
            <h2 className="text-xl font-bold">Try our paper trading simulator</h2>
          </div>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pl-72">
        <header className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <div className="bg-green-700 text-white rounded-full p-3 mr-2">
              <TrendingUp size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Centsify</h1>
          </div>
          <div className="flex items-center">
            <p className="mr-4 text-purple-700 text-3xl">Hello, Mahin</p>
            <div className="bg-gray-200 rounded-full px-4 py-2 flex items-center">
              <span className="mr-2 text-gray-700 text-lg">Level 1</span>
              <div className="w-20 h-3 bg-gray-300 rounded-full">
                <div className="w-3/4 h-full bg-black rounded-full"></div>
              </div>
            </div>
          </div>
        </header>

        <div className="relative w-full" style={{ height: '3300px' }}>
          <svg className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full" style={{ maxWidth: '1000px' }}>
            {topics.slice(0, -1).map((topic, index) => {
              const nextTopic = topics[index + 1];
              const midX = (topic.x + nextTopic.x) / 2;
              const midY = (topic.y + nextTopic.y) / 2;
              return (
                <path
                  key={`${topic.id}-${nextTopic.id}`}
                  d={`M${topic.x + 100} ${topic.y + 50} Q${midX} ${midY} ${nextTopic.x + 100} ${nextTopic.y + 50}`}
                  fill="none"
                  stroke="gray"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
          {topics.map((topic) => (
            <div 
              key={topic.id} 
              className={`absolute ${topic.color} text-white w-[20rem] h-[10rem] text-4xl flex justify-center items-center rounded-full py-3 px-6 text-center cursor-pointer p-4`} 
              style={{ left: `calc(50% + ${topic.x - 500}px)`, top: `${topic.y}px` }}
              onMouseEnter={() => setHoveredTopic(topic)}
              onMouseLeave={() => setHoveredTopic(null)}
            >
              {topic.name}
            </div>
          ))}

          {hoveredTopic && (
            <div
              className={`absolute p-4 rounded-lg shadow-lg text-gray-800 border border-gray-200 ${colorMap[hoveredTopic.color] || 'bg-gray-200'}`} 
              style={{
                left: `calc(50% + ${hoveredTopic.x > 400 ? hoveredTopic.x - 750 : hoveredTopic.x - 350}px)`,
                top: hoveredTopic.y + 20, 
                zIndex: 10,
                maxWidth: '250px',
              }}
            >
              <h3 className="text-xl font-semibold mb-2">{hoveredTopic.name}</h3>
              <p className="text-sm">{hoveredTopic.des}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
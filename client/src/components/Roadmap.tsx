import React, { useState, useEffect } from 'react';
import { TrendingUp, MessageSquare, TrendingUpIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, } from './ui/button';
import { Dialog, DialogFooter, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { CheckCircle, XCircle, X } from 'lucide-react';

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

type Question = {
  questionText: string;
  answerOptions: {
    answerText: string;
    isCorrect: boolean;
  }[];
};

type QuizModalProps = {
  isOpen: boolean;
  onClose: () => void;
  topic: Topic;
  onQuizComplete: (topicId: number) => void;
};

type Quizzes = {
  [key: string]: Question[];
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



const quizzes: Quizzes = {
  'Budgeting': [
    {
      questionText: "What is the primary purpose of creating a budget?",
      answerOptions: [
        { answerText: "To restrict spending", isCorrect: false },
        { answerText: "To track income and expenses", isCorrect: true },
        { answerText: "To increase debt", isCorrect: false },
        { answerText: "To impress others", isCorrect: false }
      ]
    },
    {
      questionText: "Which of the following is NOT typically included in a personal budget?",
      answerOptions: [
        { answerText: "Rent/Mortgage", isCorrect: false },
        { answerText: "Groceries", isCorrect: false },
        { answerText: "Stock market predictions", isCorrect: true },
        { answerText: "Utilities", isCorrect: false }
      ]
    },
    // Additional questions for Budgeting...
  ],
  'Saving Strategies': [
    {
      questionText: "What is the '50/30/20' budgeting rule?",
      answerOptions: [
        { answerText: "50% needs, 30% wants, 20% savings", isCorrect: true },
        { answerText: "50% savings, 30% needs, 20% wants", isCorrect: false },
        { answerText: "50% wants, 30% needs, 20% savings", isCorrect: false },
        { answerText: "50% needs, 30% savings, 20% wants", isCorrect: false }
      ]
    },
    {
      questionText: "Which saving strategy involves automatically transferring money to savings?",
      answerOptions: [
        { answerText: "Manual saving", isCorrect: false },
        { answerText: "Impulse saving", isCorrect: false },
        { answerText: "Automated saving", isCorrect: true },
        { answerText: "Delayed saving", isCorrect: false }
      ]
    },
    // Additional questions for Saving Strategies...
  ],
  'Credit Scores and Reports': [
    {
      questionText: "What is a credit score used for?",
      answerOptions: [
        { answerText: "To calculate savings", isCorrect: false },
        { answerText: "To determine loan eligibility", isCorrect: true },
        { answerText: "To predict future spending", isCorrect: false },
        { answerText: "To track bank account balances", isCorrect: false }
      ]
    },
    {
      questionText: "Which of the following is NOT a factor in calculating credit scores?",
      answerOptions: [
        { answerText: "Payment history", isCorrect: false },
        { answerText: "Length of credit history", isCorrect: false },
        { answerText: "Age", isCorrect: true },
        { answerText: "Types of credit", isCorrect: false }
      ]
    }
  ],
  'Understanding Interest Rates': [
    {
      questionText: "What is the difference between fixed and variable interest rates?",
      answerOptions: [
        { answerText: "Fixed rates never change, variable rates can fluctuate", isCorrect: true },
        { answerText: "Variable rates are always lower", isCorrect: false },
        { answerText: "Fixed rates are unpredictable", isCorrect: false },
        { answerText: "Variable rates never change", isCorrect: false }
      ]
    },
    {
      questionText: "What is an APR?",
      answerOptions: [
        { answerText: "Annual Payment Rate", isCorrect: false },
        { answerText: "Average Principal Rate", isCorrect: false },
        { answerText: "Annual Percentage Rate", isCorrect: true },
        { answerText: "Annual Purchase Rate", isCorrect: false }
      ]
    }
  ],
  'Types of Bank Accounts': [
    {
      questionText: "Which type of account typically earns more interest?",
      answerOptions: [
        { answerText: "Checking account", isCorrect: false },
        { answerText: "Savings account", isCorrect: true },
        { answerText: "Credit card account", isCorrect: false },
        { answerText: "Mortgage account", isCorrect: false }
      ]
    },
    {
      questionText: "Which account type is best for everyday transactions?",
      answerOptions: [
        { answerText: "Money market account", isCorrect: false },
        { answerText: "Certificate of deposit", isCorrect: false },
        { answerText: "Checking account", isCorrect: true },
        { answerText: "Savings account", isCorrect: false }
      ]
    }
  ],
  'Debt Management': [
    {
      questionText: "Which is the best way to manage multiple debts?",
      answerOptions: [
        { answerText: "Ignore the debts", isCorrect: false },
        { answerText: "Pay the minimum on all debts", isCorrect: false },
        { answerText: "Focus on paying off high-interest debts first", isCorrect: true },
        { answerText: "Take out more loans to pay debts", isCorrect: false }
      ]
    },
    {
      questionText: "What is debt consolidation?",
      answerOptions: [
        { answerText: "Borrowing money to increase savings", isCorrect: false },
        { answerText: "Combining multiple debts into one loan", isCorrect: true },
        { answerText: "Opening new credit cards", isCorrect: false },
        { answerText: "Ignoring creditors", isCorrect: false }
      ]
    }
  ],
  'Taxes': [
    {
      questionText: "What is the purpose of filing a tax return?",
      answerOptions: [
        { answerText: "To apply for a loan", isCorrect: false },
        { answerText: "To report income and taxes paid", isCorrect: true },
        { answerText: "To increase credit score", isCorrect: false },
        { answerText: "To decrease interest rates", isCorrect: false }
      ]
    },
    {
      questionText: "Which of the following is a tax deduction?",
      answerOptions: [
        { answerText: "Health insurance premiums", isCorrect: true },
        { answerText: "Grocery expenses", isCorrect: false },
        { answerText: "Entertainment expenses", isCorrect: false },
        { answerText: "Vacation costs", isCorrect: false }
      ]
    }
  ],
  'Creating Emergency Fund': [
    {
      questionText: "What is the recommended amount for an emergency fund?",
      answerOptions: [
        { answerText: "1 month of living expenses", isCorrect: false },
        { answerText: "3-6 months of living expenses", isCorrect: true },
        { answerText: "12 months of salary", isCorrect: false },
        { answerText: "No emergency fund is necessary", isCorrect: false }
      ]
    },
    {
      questionText: "Why is having an emergency fund important?",
      answerOptions: [
        { answerText: "To pay for vacations", isCorrect: false },
        { answerText: "To handle unexpected financial setbacks", isCorrect: true },
        { answerText: "To invest in stocks", isCorrect: false },
        { answerText: "To increase credit score", isCorrect: false }
      ]
    }
  ],
  'Retirement Accounts': [
    {
      questionText: "What is a 401(k)?",
      answerOptions: [
        { answerText: "A savings account", isCorrect: false },
        { answerText: "An employer-sponsored retirement plan", isCorrect: true },
        { answerText: "A government loan program", isCorrect: false },
        { answerText: "An insurance policy", isCorrect: false }
      ]
    },
    {
      questionText: "At what age can you start withdrawing from an IRA without penalty?",
      answerOptions: [
        { answerText: "50", isCorrect: false },
        { answerText: "59 1/2", isCorrect: true },
        { answerText: "65", isCorrect: false },
        { answerText: "70", isCorrect: false }
      ]
    }
  ],
  'Insurance Basics': [
    {
      questionText: "Which type of insurance covers medical expenses?",
      answerOptions: [
        { answerText: "Life insurance", isCorrect: false },
        { answerText: "Health insurance", isCorrect: true },
        { answerText: "Home insurance", isCorrect: false },
        { answerText: "Auto insurance", isCorrect: false }
      ]
    },
    {
      questionText: "What does renters insurance cover?",
      answerOptions: [
        { answerText: "Life insurance", isCorrect: false },
        { answerText: "Personal property in a rented space", isCorrect: true },
        { answerText: "Car damage", isCorrect: false },
        { answerText: "Health issues", isCorrect: false }
      ]
    }
  ],
  'Compound Interest': [
    {
      questionText: "What is compound interest?",
      answerOptions: [
        { answerText: "Interest earned only on the initial amount", isCorrect: false },
        { answerText: "Interest earned on both the principal and interest accumulated", isCorrect: true },
        { answerText: "A type of loan", isCorrect: false },
        { answerText: "A method to avoid interest", isCorrect: false }
      ]
    },
    {
      questionText: "Which of the following grows the fastest with compound interest?",
      answerOptions: [
        { answerText: "Simple interest", isCorrect: false },
        { answerText: "Compound interest", isCorrect: true },
        { answerText: "No interest", isCorrect: false },
        { answerText: "Loan interest", isCorrect: false }
      ]
    }
  ],
  'Investing Basics': [
    {
      questionText: "Which of the following is a low-risk investment?",
      answerOptions: [
        { answerText: "Stocks", isCorrect: false },
        { answerText: "Bonds", isCorrect: true },
        { answerText: "Cryptocurrency", isCorrect: false },
        { answerText: "Real estate", isCorrect: false }
      ]
    },
    {
      questionText: "What does 'diversification' mean in investing?",
      answerOptions: [
        { answerText: "Investing in a single stock", isCorrect: false },
        { answerText: "Spreading investments across different assets", isCorrect: true },
        { answerText: "Only investing in bonds", isCorrect: false },
        { answerText: "Avoiding all risky investments", isCorrect: false }
      ]
    }
  ],
  'Mortgages': [
    {
      questionText: "What is a mortgage?",
      answerOptions: [
        { answerText: "A type of credit card", isCorrect: false },
        { answerText: "A loan used to buy a home", isCorrect: true },
        { answerText: "An investment plan", isCorrect: false },
        { answerText: "A retirement account", isCorrect: false }
      ]
    },
    {
      questionText: "What is a down payment?",
      answerOptions: [
        { answerText: "A tax deduction", isCorrect: false },
        { answerText: "A portion of the home price paid upfront", isCorrect: true },
        { answerText: "A monthly mortgage payment", isCorrect: false },
        { answerText: "A fee for insurance", isCorrect: false }
      ]
    }
  ],
  'Renting vs. Buying': [
    {
      questionText: "Which is generally a benefit of renting a home?",
      answerOptions: [
        { answerText: "Building equity", isCorrect: false },
        { answerText: "Lower maintenance responsibilities", isCorrect: true },
        { answerText: "Fixed mortgage payments", isCorrect: false },
        { answerText: "Owning the property", isCorrect: false }
      ]
    },
    {
      questionText: "What is a key benefit of buying a home over renting?",
      answerOptions: [
        { answerText: "More flexibility in moving", isCorrect: false },
        { answerText: "Building equity", isCorrect: true },
        { answerText: "No upfront costs", isCorrect: false },
        { answerText: "Lower initial costs", isCorrect: false }
      ]
    }
  ]
};


const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, topic, onQuizComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const questions: Question[] = quizzes[topic.name] || [];

  const handleQuizCompletion = () => {
    setShowScore(true);
    onQuizComplete(topic.id);
  };

  const handleAnswerOptionClick = (index: number, isCorrect: boolean) => {
    setSelectedAnswer(index);
    setIsCorrect(isCorrect);

    setTimeout(() => {
      if (isCorrect) {
        setScore(score + 1);
      }

      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        handleQuizCompletion();
      }
    }, 1000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  if (questions.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] bg-[#F9EFCC] text-[#1A1A1A]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Quiz Not Available</DialogTitle>
          </DialogHeader>
          <div className="text-center text-lg">
            Sorry, the quiz for {topic.name} is not available at the moment.
          </div>
          <div className="mt-6">
            <Button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700 text-white">Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] bg-[#F9EFCC] text-[#1A1A1A] p-0 overflow-hidden">
        <DialogHeader className="bg-green-600 text-white p-6 relative">
          <DialogTitle className="text-3xl font-bold">{topic.name} Quiz</DialogTitle>
          <Button 
            onClick={onClose} 
            className="absolute top-2 right-2 text-white hover:bg-green-700 rounded-full p-2"
          >
            <X size={24} />
          </Button>
        </DialogHeader>
        {showScore ? (
          <div className="text-center py-8">
            <h2 className="text-3xl font-bold mb-4">Quiz Completed!</h2>
            <p className="text-2xl mb-6">You scored {score} out of {questions.length}</p>
            <Button onClick={resetQuiz} className="px-6 py-3 text-lg bg-green-600 hover:bg-green-700 text-white">
              Retry Quiz
            </Button>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
              <span className="text-xl font-semibold">Question {currentQuestion + 1}/{questions.length}</span>
              <span className="text-lg">Score: {score}</span>
            </div>
            <div className="mb-8 text-2xl font-bold">{questions[currentQuestion].questionText}</div>
            <div className="space-y-4">
              {questions[currentQuestion].answerOptions.map((answerOption, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswerOptionClick(index, answerOption.isCorrect)}
                  className={`w-full text-left justify-start text-lg p-4 rounded-lg transition-colors ${
                    selectedAnswer === index
                      ? answerOption.isCorrect
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-white hover:bg-gray-100 text-[#1A1A1A] border border-gray-300'
                  } ${selectedAnswer !== null ? 'cursor-not-allowed' : ''}`}
                  disabled={selectedAnswer !== null}
                >
                  <span className="mr-2">{String.fromCharCode(65 + index)}.</span>
                  {answerOption.answerText}
                  {selectedAnswer === index && (
                    <span className="ml-auto">
                      {answerOption.isCorrect ? (
                        <CheckCircle className="text-white" size={24} />
                      ) : (
                        <XCircle className="text-white" size={24} />
                      )}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const Roadmap: React.FC = () => {
  const [hoveredTopic, setHoveredTopic] = useState<Topic | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [completedTopics, setCompletedTopics] = useState<number[]>([]);

  useEffect(() => {
    const savedCompletedTopics = localStorage.getItem('completedTopics');
    if (savedCompletedTopics) {
      setCompletedTopics(JSON.parse(savedCompletedTopics));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('completedTopics', JSON.stringify(completedTopics));
  }, [completedTopics]);

  const handleTopicClick = (topic: Topic) => {
    if (isTopicUnlocked(topic.id)) {
      setSelectedTopic(topic);
    }
  };

  const isTopicUnlocked = (topicId: number) => {
    if (topicId === 1) return true; // First topic is always unlocked
    return completedTopics.includes(topicId - 1);
  };

  const handleQuizCompletion = (topicId: number) => {
    if (!completedTopics.includes(topicId)) {
      setCompletedTopics([...completedTopics, topicId]);
    }
    setSelectedTopic(null);
  };

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
              className={`absolute ${topic.color} text-white w-[20rem] h-[10rem] text-4xl flex justify-center items-center rounded-full py-3 px-6 text-center cursor-pointer p-4 ${
                isTopicUnlocked(topic.id) ? 'opacity-100' : 'opacity-50 cursor-not-allowed'
              }`} 
              style={{ left: `calc(50% + ${topic.x - 500}px)`, top: `${topic.y}px` }}
              onMouseEnter={() => setHoveredTopic(topic)}
              onMouseLeave={() => setHoveredTopic(null)}
              onClick={() => handleTopicClick(topic)}
            >
              {topic.name}
              {completedTopics.includes(topic.id) && (
                <CheckCircle className="absolute top-2 right-2 text-green-300" size={24} />
              )}
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
              {!isTopicUnlocked(hoveredTopic.id) && (
                <p className="text-sm mt-2 text-red-500">Complete the previous topic to unlock this one.</p>
              )}
            </div>
          )}

          {selectedTopic && (
            <QuizModal
              isOpen={!!selectedTopic}
              onClose={() => setSelectedTopic(null)}
              topic={selectedTopic}
              onQuizComplete={handleQuizCompletion}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
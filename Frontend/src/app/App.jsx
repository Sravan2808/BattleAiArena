import React, { useState } from 'react';
import { ChatList } from '../components/ChatList';
import axios from 'axios';

// Dummy data for simulation
const  generateDummyResponse = (problem,result) => {
  return {
    problem,
    solution_1:result.solution_1,
    solution_2: result.solution_2,
    judge: {
      solution_1_score: result.judge.solution_1_score,
      solution_2_score: result.judge.solution_2_score,
      solution_1_feedback: result.judge.solution_1_feedback,
      solution_2_feedback: result.judge.solution_2_feedback
    }
  };
};

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newProblem = inputValue.trim();
    setInputValue('');
    
    // Add pending problem
    setMessages(prev => [...prev, { problem: newProblem }]);
    setIsTyping(true);

    try {
      const response = await axios.post("http://localhost:3000/invoke", {
        input: newProblem
      });

      const data = response.data;
      console.log(data.result);

      const finalResponse = generateDummyResponse(newProblem, data.result);
      setMessages(prev => {
        const newMessages = [...prev];
        // replace the last pending message with full response
        newMessages[newMessages.length - 1] = finalResponse;
        return newMessages;
      });
    } catch (error) {
      console.error("Error fetching comparison:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0b0f19] text-slate-200 font-['Inter',sans-serif]">
      {/* Sidebar - Optional but adds to 'Desktop App' feel */}
      <div className="w-64 bg-[#131b26] border-r border-[#1e293b] hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold font-['Manrope'] text-white">Arena</h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Ethereal Dialogue</p>
        </div>
        <div className="flex-1 px-4">
          <button 
             className="w-full text-left px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors mb-6 shadow-[0_2px_10px_rgba(37,99,235,0.2)]"
             onClick={() => setMessages([])}
          >
            + New Session
          </button>
          
          <div className="text-sm font-semibold text-slate-500 mb-3 px-2">RECENT</div>
          <div className="space-y-1">
             <div className="px-3 py-2 bg-[#1e293b] text-slate-300 rounded-md text-sm font-medium border border-slate-700 cursor-pointer shadow-sm">Current Session</div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <ChatList messages={messages} />
        
        {/* Sticky Input Area */}
        <div className="bg-[#0b0f19]/80 backdrop-blur-xl border-t border-[#1e293b] p-4 md:p-6 pb-6 w-full z-10 sticky bottom-0">
           <form onSubmit={handleSend} className="max-w-4xl mx-auto w-full relative group">
             <input
               type="text"
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}
               placeholder="Type a problem to evaluate..."
               className="w-full bg-[#131b26] text-white border border-[#334155] focus:border-blue-500 rounded-xl px-6 py-4 pr-16 shadow-[0_4px_20px_rgba(0,0,0,0.5)] focus:shadow-[0_4px_20px_rgba(37,99,235,0.15)] outline-none transition-all duration-200 placeholder:text-slate-500"
               disabled={isTyping}
             />
             <button
               type="submit"
               disabled={!inputValue.trim() || isTyping}
               className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg p-2 transition-colors focus:outline-none shadow-md"
             >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
               </svg>
             </button>
           </form>
           {isTyping && (
             <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 text-sm text-slate-400 animate-pulse bg-[#131b26]/90 px-4 py-1 rounded-full border border-slate-700 shadow-xl">
               Evaluating solutions...
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

export default App;
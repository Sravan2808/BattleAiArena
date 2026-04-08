import React, { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';

export const ChatList = ({ messages }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 md:py-12 bg-transparent scroll-smooth w-full">
      <div className="flex flex-col max-w-6xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center mt-20">
            <h2 className="text-3xl font-bold text-slate-200 mb-4 font-['Manrope']">Start a new session</h2>
            <p className="text-slate-400 max-w-md">
              Ask any question to the AI Judge. It will compare two different models' answers and provide a detailed recommendation.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <ChatMessage
              key={idx}
              problem={msg.problem}
              solution_1={msg.solution_1}
              solution_2={msg.solution_2}
              judge={msg.judge}
            />
          ))
        )}
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
};

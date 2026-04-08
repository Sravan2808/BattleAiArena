import React from 'react';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import remarkGfm from 'remark-gfm';

const MarkdownRenderer = ({ content }) => {
  return (
    <ReactMarkdown
      components={{
        code({node, inline, className, children, ...props}) {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <SyntaxHighlighter
              style={atomOneDark}
              language={match[1]}
              PreTag="div"
              className="rounded-lg !my-4 !bg-[#0b0f19] border border-slate-800 text-sm"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-md text-sm font-mono" {...props}>
              {children}
            </code>
          )
        },
        h1: ({node, ...props}) => <h1 className="text-xl font-semibold mt-6 mb-4 text-white" {...props} />,
        h2: ({node, ...props}) => <h2 className="text-lg font-medium mt-5 mb-3 text-white" {...props} />,
        h3: ({node, ...props}) => <h3 className="text-md font-medium mt-4 mb-2 text-white" {...props} />,
        p: ({node, ...props}) => <p className="leading-relaxed mb-4 text-slate-300" {...props} />,
        ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 text-slate-300 space-y-1" {...props} />,
        ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 text-slate-300 space-y-1" {...props} />,
        a: ({node, ...props}) => <a className="text-blue-400 hover:text-blue-300 underline underline-offset-2" {...props} />,
        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-slate-700 pl-4 py-1 italic text-slate-400 mb-4 bg-slate-800/50 rounded-r-lg" {...props} />
      }}
      remarkPlugins={[remarkGfm]}
    >
      {content}
    </ReactMarkdown>
  );
};

export const ChatMessage = ({ problem, solution_1, solution_2, judge }) => {
  return (
    <div className="flex flex-col mb-12 gap-6 w-full max-w-5xl mx-auto">
      {/* Problem Section - Right aligned bubble */}
      <div className="flex justify-end w-full">
        <div className="bg-[#1a2332] border border-slate-700 shadow-xl shadow-black/20 rounded-2xl rounded-tr-sm px-6 py-4 max-w-[80%] text-slate-200">
          <p className="whitespace-pre-wrap leading-relaxed">{problem}</p>
        </div>
      </div>

      {/* Solutions & Judge Array - dual layout */}
      {solution_1 && solution_2 && (
        <div className="bg-[#111827] rounded-3xl p-6 lg:p-10 border border-slate-800 shadow-xl shadow-black/20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
            {/* Solution 1 */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-semibold text-xs tracking-wide">
                  S1
                </div>
                <h3 className="font-medium text-slate-300 text-sm uppercase tracking-wider">Solution 1</h3>
              </div>
              <div className="bg-[#1a2332] p-6 md:p-8 rounded-2xl border border-slate-700/60 shadow-lg text-sm overflow-x-auto">
                <MarkdownRenderer content={solution_1} />
              </div>
            </div>

            {/* Solution 2 */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-semibold text-xs tracking-wide">
                  S2
                </div>
                <h3 className="font-medium text-slate-300 text-sm uppercase tracking-wider">Solution 2</h3>
              </div>
              <div className="bg-[#1a2332] p-6 md:p-8 rounded-2xl border border-slate-700/60 shadow-lg text-sm overflow-x-auto">
                <MarkdownRenderer content={solution_2} />
              </div>
            </div>
          </div>

          {/* Judge Recommendation Panel */}
          {judge && (
            <div className="mt-10 pt-10 border-t border-slate-800/80">
              <div className="flex items-center gap-3 mb-6">
                 <div className="h-8 w-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center font-bold text-xs">
                  JD
                 </div>
                 <h3 className="font-semibold text-white text-lg">Judge Recommendation</h3>
              </div>
              
              <div className="bg-[#1a2332] border border-slate-700/60 shadow-lg rounded-2xl overflow-hidden flex flex-col md:flex-row">
                {/* Judge S1 */}
                <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-700/80">
                   <div className="flex justify-between items-center mb-6">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Score 1</span>
                      <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold px-4 py-1.5 rounded-full text-sm">
                        {judge.solution_1_score}/10
                      </span>
                   </div>
                   <p className="text-slate-300 text-sm leading-relaxed">{judge.solution_1_feedback}</p>
                </div>

                {/* Judge S2 */}
                <div className="flex-1 p-6 md:p-8">
                   <div className="flex justify-between items-center mb-6">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Score 2</span>
                      <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold px-4 py-1.5 rounded-full text-sm">
                        {judge.solution_2_score}/10
                      </span>
                   </div>
                   <p className="text-slate-300 text-sm leading-relaxed">{judge.solution_2_feedback}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

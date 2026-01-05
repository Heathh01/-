import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, EyeOff, Eye, Play, MessageSquare, Send, RotateCcw } from 'lucide-react';
import { SYSTEM_PROMPTS } from '../../constants';
import { ChatMessage, TrainingScript } from '../../types';

interface TrainingViewProps {
  trainingScript: TrainingScript;
  trainingMode: string;
  callAI: (systemPrompt: string, userPrompt: string, jsonMode: boolean) => Promise<any>;
}

const TrainingView: React.FC<TrainingViewProps> = ({ trainingScript, trainingMode, callAI }) => {
  const [maskMode, setMaskMode] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([{ role: 'ai', text: '你好！我是你的 AI 面试官。请根据左侧的内容，简要介绍一下这段经历。' }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', text: input }];
    setChatHistory(newHistory);
    setInput('');
    setIsTyping(true);
    const contextMessages = newHistory.map(m => `${m.role === 'user' ? '候选人' : '面试官'}: ${m.text}`).join('\n');
    try {
      const aiResponse = await callAI(SYSTEM_PROMPTS.interviewer, contextMessages, false);
      setIsTyping(false);
      if (aiResponse) {
        let text = aiResponse;
        let analysis = false;
        if (typeof text === 'string' && text.includes('{"analysis": true}')) {
           analysis = true;
           text = text.replace('{"analysis": true}', '').trim();
        }
        setChatHistory(prev => [...prev, { role: 'ai', text, analysis }]);
      } else {
        setTimeout(() => { setChatHistory(prev => [...prev, { role: 'ai', text: '（未配置 API Key）模拟反馈：回答逻辑清晰。请继续。', analysis: true }]); }, 1000);
      }
    } catch (e) { setIsTyping(false); }
  };

  const handleRestart = () => {
    if(confirm("确定要重新开始模拟面试吗？当前对话将清空。")) {
      setChatHistory([{ role: 'ai', text: '你好！我是你的 AI 面试官。请根据左侧的内容，简要介绍一下这段经历。' }]);
    }
  }

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-0 divide-x divide-slate-200 bg-slate-50">
      <div className="p-6 overflow-y-auto hidden lg:block">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center"><BookOpen className="mr-2" size={20} /> {trainingMode === 'refined' ? '重构话术演练' : 'STAR 剧本'}</h2>
          <button onClick={() => setMaskMode(!maskMode)} className={`flex items-center px-3 py-1.5 rounded-lg text-sm transition ${maskMode ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>{maskMode ? <EyeOff size={16} className="mr-2"/> : <Eye size={16} className="mr-2"/>}{maskMode ? '背诵模式开启' : '开启遮挡背诵'}</button>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-indigo-50 rounded-lg text-sm text-indigo-800 mb-4 flex items-center"><Play size={16} className="mr-2" /> 当前演练内容：{trainingScript.S.substring(0, 30)}...</div>
          {Object.entries(trainingScript).map(([key, value]) => (
            <div key={key} className={`bg-white p-4 rounded-lg border border-slate-200 transition-all ${maskMode ? 'blur-sm select-none hover:blur-0' : ''}`}>
               <span className="font-bold text-indigo-600 mr-2">{key}:</span> <span className="text-slate-700">{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col h-full bg-white">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
          <h3 className="font-bold text-slate-800 flex items-center"><MessageSquare className="mr-2 text-indigo-600" size={18} /> AI 模拟面试</h3>
          <div className="flex space-x-2 items-center">
            <button onClick={handleRestart} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition" title="重新开始"><RotateCcw size={16} /></button>
            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center"><div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></div> Online</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : msg.analysis ? 'bg-orange-50 border border-orange-100 text-slate-800 rounded-tl-none' : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'}`}>{msg.analysis && <div className="text-orange-600 font-bold text-xs mb-1 uppercase tracking-wide">AI Feedback</div>}{msg.text}</div></div>
          ))}
          {isTyping && <div className="flex justify-start"><div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex space-x-1"><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div></div></div>}
          <div ref={chatEndRef}></div>
        </div>
        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="relative"><input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="输入你的回答..." className="w-full pl-4 pr-12 py-3 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700" /><button onClick={handleSend} disabled={isTyping} className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:bg-slate-300"><Send size={18} /></button></div>
        </div>
      </div>
    </div>
  );
};

export default TrainingView;

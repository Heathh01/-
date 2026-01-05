import React, { useState } from 'react';
import { Settings, Loader2, Wand2, AlertCircle, ArrowRight, Save, Check } from 'lucide-react';
import { MOCK_REFINED_DATA, SYSTEM_PROMPTS } from '../../constants';
import { RefinedData, RefinedVersion, TrainingScript } from '../../types';
import { contentToString } from '../../utils';
import KeywordTooltip from '../KeywordTooltip';

interface RefinerViewProps {
  callAI: (systemPrompt: string, userPrompt: string, jsonMode: boolean) => Promise<any>;
  setTrainingScript: (script: TrainingScript) => void;
  setTrainingMode: (mode: string) => void;
  setActiveTab: (tab: string) => void;
  onSaveRefinedData: (data: RefinedVersion, title: string, role: string) => void;
}

const RefinerView: React.FC<RefinerViewProps> = ({ 
  callAI, 
  setTrainingScript, 
  setTrainingMode, 
  setActiveTab,
  onSaveRefinedData 
}) => {
  const [version, setVersion] = useState<'stable' | 'aggressive' | 'management'>('stable');
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState({
    company: 'ABC科技有限公司',
    role: '财务助理实习生',
    targetRole: '财务专员',
    desc: '我主要负责整理发票，算一下成本，然后用Excel做表格，最后帮大家报税，感觉效率提高了一些。'
  });
  const [refinedData, setRefinedData] = useState<RefinedData>(MOCK_REFINED_DATA);

  const handleRefine = async () => {
    setLoading(true);
    const prompt = `公司：${inputData.company}\n当前职位：${inputData.role}\n目标职位：${inputData.targetRole}\n工作描述：${inputData.desc}`;
    try {
      const result = await callAI(SYSTEM_PROMPTS.refiner, prompt, true);
      if (result) setRefinedData(result);
      else setRefinedData(MOCK_REFINED_DATA); // Fallback
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handlePractice = () => {
    const currentContent = contentToString(refinedData[version].content);
    setTrainingScript({
      S: "（来自经历重构）" + inputData.company + " - " + inputData.role,
      T: "目标岗位：" + inputData.targetRole,
      A: currentContent,
      R: "（请根据重构内容补充量化结果）"
    });
    setTrainingMode('refined');
    setActiveTab('training');
  };

  const handleSave = () => {
    const title = `${inputData.company} - ${inputData.role} (${refinedData[version].title})`;
    onSaveRefinedData(refinedData[version], title, inputData.targetRole || inputData.role);
  };
  
  return (
    <div className="h-full flex flex-col md:flex-row bg-slate-50">
      <div className="w-full md:w-1/3 bg-white border-r border-slate-200 p-8 overflow-y-auto">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center"><Settings className="mr-2" size={20} /> 基础信息录入</h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">公司名称</label>
            <input type="text" className="w-full p-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow shadow-sm" value={inputData.company} onChange={e => setInputData({...inputData, company: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">您的职位</label>
            <input type="text" className="w-full p-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow shadow-sm" value={inputData.role} onChange={e => setInputData({...inputData, role: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">目标岗位 (自定义)</label>
            <input type="text" className="w-full p-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow shadow-sm" placeholder="例如：财务专员" value={inputData.targetRole} onChange={e => setInputData({...inputData, targetRole: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">核心工作 (简单描述)</label>
            <textarea className="w-full p-3 bg-white border border-slate-300 rounded-xl h-36 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-shadow shadow-sm leading-relaxed" value={inputData.desc} onChange={e => setInputData({...inputData, desc: e.target.value})}></textarea>
          </div>
          <button 
            onClick={handleRefine} 
            disabled={loading} 
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 active:scale-[0.98] transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 mt-2"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Wand2 size={20} className="mr-2" />} 
            {loading ? 'AI 正在精修...' : '一键专业化重构'}
          </button>
        </div>
      </div>
      <div className="flex-1 p-6 md:p-10 bg-slate-50 overflow-y-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-2xl font-bold text-slate-800">AI 重构车间</h2>
          <div className="flex bg-white p-1.5 rounded-xl shadow-sm border border-slate-200">
            {(['stable', 'aggressive', 'management'] as const).map((v) => (
              <button 
                key={v} 
                onClick={() => setVersion(v)} 
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  version === v 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {v === 'stable' ? '稳健型' : v === 'aggressive' ? '进取型' : '管理型'}
              </button>
            ))}
          </div>
        </div>
        
        <div key={version} className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 min-h-[400px] animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600"></div>
          <div className="mb-6">
            <span className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wide border border-indigo-100">
              <Wand2 size={12} className="mr-1" />
              {refinedData[version]?.title || "Loading..."}
            </span>
          </div>
          <div className="text-lg leading-loose text-slate-700 font-medium">
            {refinedData[version]?.content.map((item, idx) => (
              item.type === 'keyword' 
                ? <KeywordTooltip key={idx} text={item.text} desc={item.desc} /> 
                : <span key={idx}>{item.text}</span>
            ))}
          </div>
          
          <div className="mt-10 p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-100 rounded-xl flex items-start">
            <AlertCircle className="text-orange-500 mt-0.5 mr-3 flex-shrink-0" size={20} />
            <div className="text-sm text-orange-800 leading-relaxed">
              <strong>AI 建议：</strong> 此版本重点突出了{version === 'stable' ? '执行力和规范性' : version === 'aggressive' ? '结果导向和数据思维' : '团队管理和流程建设'}，非常适合投递{version === 'stable' ? '大型国企或财务合规类' : version === 'aggressive' ? '互联网或成长型企业' : '管理岗或项目负责'}岗位。
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end space-x-3">
           <button 
             onClick={handleSave}
             className="px-6 py-4 rounded-xl border border-slate-300 text-slate-700 font-bold flex items-center hover:bg-white hover:border-slate-400 transition shadow-sm"
           >
             <Save size={20} className="mr-2" /> 保存此版本
           </button>
           <button 
             onClick={handlePractice} 
             className="group bg-white text-indigo-600 border-2 border-indigo-100 px-8 py-4 rounded-xl shadow-sm hover:border-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300 font-bold flex items-center"
           >
             去演练这段话术 
             <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>
    </div>
  );
};

export default RefinerView;

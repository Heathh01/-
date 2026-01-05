import React, { useState } from 'react';
import { Loader2, Wand2, Download, FileText, MessageSquare, Save, Target, Zap, AlertTriangle, Layers, Briefcase, ChevronDown, CheckCircle2 } from 'lucide-react';
import { MOCK_VIRTUAL_DATA_TEMPLATE, SYSTEM_PROMPTS } from '../../constants';
import { Project, VirtualData } from '../../types';

interface VirtualGeneratorViewProps {
  currentProjectData: VirtualData | null;
  setCurrentProjectData: (data: VirtualData | null) => void;
  callAI: (systemPrompt: string, userPrompt: string, jsonMode: boolean) => Promise<any>;
  setActiveTab: (tab: string) => void;
  onSaveVirtualProject: (data: VirtualData, title: string, role: string) => void;
}

// Simple SVG Radar Chart Component
const RadarChart = ({ data }: { data: { dimension: string; value: number; label: string }[] }) => {
  const size = 300;
  const center = size / 2;
  const radius = size * 0.35;
  const angleSlice = (Math.PI * 2) / data.length;

  const getPoint = (value: number, index: number) => {
    const angle = index * angleSlice - Math.PI / 2;
    return {
      x: center + (radius * (value / 100)) * Math.cos(angle),
      y: center + (radius * (value / 100)) * Math.sin(angle)
    };
  };

  const points = data.map((d, i) => getPoint(d.value, i)).map(p => `${p.x},${p.y}`).join(' ');
  const fullPoints = data.map((d, i) => getPoint(100, i)).map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="relative flex justify-center items-center py-4">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grid */}
        {[20, 40, 60, 80, 100].map(level => (
          <polygon 
            key={level} 
            points={data.map((_, i) => getPoint(level, i)).map(p => `${p.x},${p.y}`).join(' ')} 
            fill="none" 
            stroke="#e2e8f0" 
            strokeWidth="1" 
          />
        ))}
        {/* Axes */}
        {data.map((_, i) => {
          const p = getPoint(100, i);
          return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="#e2e8f0" strokeWidth="1" />;
        })}
        {/* Data Area */}
        <polygon points={points} fill="rgba(79, 70, 229, 0.2)" stroke="#4f46e5" strokeWidth="2" />
        {/* Labels */}
        {data.map((d, i) => {
          const p = getPoint(115, i);
          return (
            <g key={i}>
              <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" className="text-xs font-bold fill-slate-600">
                {d.dimension}
              </text>
              <text x={p.x} y={p.y + 14} textAnchor="middle" dominantBaseline="middle" className="text-[10px] fill-indigo-500 font-medium">
                {d.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const VirtualGeneratorView: React.FC<VirtualGeneratorViewProps> = ({ 
  currentProjectData, 
  setCurrentProjectData, 
  callAI, 
  setActiveTab,
  onSaveVirtualProject
}) => {
  const [step, setStep] = useState(currentProjectData ? 2 : 1);
  const [loading, setLoading] = useState(false);
  const [detailTab, setDetailTab] = useState<'background' | 'timeline' | 'competency'>('background');
  const [formData, setFormData] = useState({ industry: '', role: '', type: '' });
  
  const industries = ['互联网', '金融', '快消', '制造业', '医疗健康'];
  const roles = ['产品经理', 'Java开发', '数据分析', '新媒体运营', '行政助理'];

  const handleGenerate = async () => {
    setLoading(true);
    const prompt = `行业：${formData.industry}\n岗位：${formData.role}\n项目类型：${formData.type}`;
    try {
      const result = await callAI(SYSTEM_PROMPTS.generator, prompt, true);
      const finalData: VirtualData = result || MOCK_VIRTUAL_DATA_TEMPLATE; 
      
      setCurrentProjectData(finalData);
      setStep(2);
    } catch (e) {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (currentProjectData) {
      onSaveVirtualProject(
        currentProjectData, 
        formData.type || '未命名项目', 
        formData.role || '通用岗位'
      );
    }
  };

  if (step === 1 && !currentProjectData) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-50 p-6">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-10 animate-scale-in border border-slate-100">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">场景定制向导</h2>
          <p className="text-slate-500 mb-8 text-lg">三步生成符合行业标准的虚拟实习项目全案。</p>
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">1. 选择或输入行业</label>
              <div className="flex gap-3 flex-wrap mb-3">{industries.map(ind => (<button key={ind} onClick={() => setFormData({...formData, industry: ind})} className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${formData.industry === ind ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}>{ind}</button>))}</div>
              <input type="text" className="w-full p-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-shadow" placeholder="其他行业（手动输入）" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">2. 选择或输入目标岗位</label>
              <div className="flex gap-3 flex-wrap mb-3">{roles.map(role => (<button key={role} onClick={() => setFormData({...formData, role: role})} className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${formData.role === role ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}>{role}</button>))}</div>
              <input type="text" className="w-full p-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-shadow" placeholder="其他岗位（手动输入）" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
            </div>
            <div><label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">3. 输入项目关键词</label><input type="text" className="w-full p-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" placeholder="例如：双11大促活动、企业后台管理系统重构" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} /></div>
            <div className="pt-4"><button onClick={handleGenerate} disabled={loading || !formData.industry || !formData.role} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-95">{loading ? <Loader2 className="animate-spin mr-2" /> : <Wand2 className="mr-2" />} {loading ? 'AI 正在生成全案...' : '生成虚拟项目'}</button></div>
          </div>
        </div>
      </div>
    );
  }

  // Force use global data if available
  const displayData = currentProjectData || MOCK_VIRTUAL_DATA_TEMPLATE;

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm z-10">
        <div><h1 className="text-xl font-bold text-slate-800">虚拟项目概览</h1><p className="text-xs text-slate-500 mt-1">Generated by CareerAI</p></div>
        <div className="flex space-x-2">
          <button onClick={() => { setCurrentProjectData(null); setStep(1); }} className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">重新定制</button>
          <button onClick={handleSave} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm hover:bg-slate-50 shadow-sm flex items-center transition-colors"><Save size={16} className="mr-2" /> 保存到工作台</button>
          <button onClick={() => setActiveTab('profile')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 shadow-sm flex items-center transition-colors"><Download size={16} className="mr-2" /> 导出档案</button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-8">
        <div className="flex space-x-8 border-b border-slate-200 mb-8">
          {(['background', 'timeline', 'competency'] as const).map(tab => (
            <button key={tab} onClick={() => setDetailTab(tab)} className={`pb-4 text-sm font-bold tracking-wide transition-all relative ${detailTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
              {tab === 'background' ? '项目立项书' : tab === 'timeline' ? '执行流与SOP' : '面试竞争力分析'}
              {detailTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></div>}
            </button>
          ))}
        </div>
        <div className="animate-fade-in pb-10">
          
          {/* TAB 1: Background */}
          {detailTab === 'background' && (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 animate-fade-in-up">
                <div className="flex items-start mb-6">
                  <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600 mr-4"><Target size={24} /></div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">项目核心定义</h3>
                    <p className="text-slate-600 mt-2 leading-relaxed">{displayData.background.target}</p>
                  </div>
                </div>
                <div className="pl-[68px]">
                   <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Your Role</span>
                     <p className="text-slate-800 font-medium">{displayData.background.roleDefinition}</p>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                   <h4 className="text-base font-bold text-slate-800 mb-4 flex items-center"><Zap size={18} className="mr-2 text-yellow-500"/> 商业/业务价值</h4>
                   <p className="text-sm text-slate-600 leading-relaxed bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                     {displayData.background.businessValue}
                   </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                   <h4 className="text-base font-bold text-slate-800 mb-4 flex items-center"><AlertTriangle size={18} className="mr-2 text-red-500"/> 核心挑战 (Story Point)</h4>
                   <p className="text-sm text-slate-600 leading-relaxed bg-red-50 p-4 rounded-lg border border-red-100">
                     {displayData.background.coreChallenges}
                   </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <h4 className="text-base font-bold text-slate-800 mb-4 flex items-center"><Layers size={18} className="mr-2 text-blue-500"/> 技术与工具栈</h4>
                <div className="flex flex-wrap gap-2">
                  {displayData.background.techStack.map((tech, i) => (
                    <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md text-sm font-medium border border-slate-200">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Timeline */}
          {detailTab === 'timeline' && (
            <div className="space-y-6 animate-fade-in-up">
              {displayData.timeline.map((phase, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                  <div className="md:w-48 bg-slate-50 p-6 flex-shrink-0 border-r border-slate-100 flex flex-col justify-center">
                    <span className="text-xs font-bold text-indigo-600 uppercase mb-2">{phase.duration}</span>
                    <h3 className="text-lg font-bold text-slate-800 leading-tight">{phase.phase}</h3>
                  </div>
                  <div className="flex-1 p-6 space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center"><CheckCircle2 size={16} className="mr-2 text-green-500"/> 关键动作 (Action Items)</h4>
                      <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 ml-1">
                        {phase.actionItems.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center"><FileText size={16} className="mr-2 text-blue-500"/> 交付产出物 (Deliverables)</h4>
                      <div className="flex flex-wrap gap-2">
                        {phase.deliverables.map((d, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100">{d}</span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mt-2">
                      <div className="flex items-start">
                        <MessageSquare size={16} className="text-indigo-600 mt-0.5 mr-2 flex-shrink-0"/>
                        <p className="text-xs text-indigo-800 italic"><strong>面试官视角：</strong>{phase.interviewFocus}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Competency (Replaces Data) */}
          {detailTab === 'competency' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
              {/* Left Col: Radar & Portfolio */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center">
                  <h4 className="text-base font-bold text-slate-800 mb-2 w-full text-left">能力维度雷达</h4>
                  <RadarChart data={displayData.competency.radar} />
                  <div className="text-xs text-slate-400 text-center mt-2">基于该项目经历的软硬技能评估</div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                   <h4 className="text-base font-bold text-slate-800 mb-4 flex items-center"><Briefcase size={18} className="mr-2 text-slate-500"/> 建议作品集素材</h4>
                   <ul className="space-y-3">
                     {displayData.competency.portfolioAssets.map((asset, i) => (
                       <li key={i} className="flex items-center p-2 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-600">
                         <FileText size={16} className="mr-2 text-indigo-400 flex-shrink-0"/>
                         <span className="truncate">{asset}</span>
                       </li>
                     ))}
                   </ul>
                </div>
              </div>

              {/* Right Col: QA Strategy */}
              <div className="lg:col-span-2">
                <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                  <MessageSquare size={20} className="mr-2 text-indigo-600"/> 高频面试题对策
                </h4>
                <div className="space-y-4">
                  {displayData.competency.interviewQA.map((qa, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-start">
                         <h5 className="font-bold text-slate-800 text-sm flex-1 pr-4">Q: {qa.question}</h5>
                         <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] rounded-full uppercase font-bold tracking-wider">{qa.tag}</span>
                      </div>
                      <div className="p-5">
                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{qa.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VirtualGeneratorView;

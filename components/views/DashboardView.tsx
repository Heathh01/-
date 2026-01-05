import React, { useState } from 'react';
import { Settings, CheckCircle2, Plus, Wand2, TrendingUp, Briefcase, Trash2, FileText, ChevronRight } from 'lucide-react';
import { ApiConfig, Project, VirtualData } from '../../types';

interface DashboardViewProps {
  apiConfig: ApiConfig;
  setIsSettingsOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
  projects: Project[];
  setCurrentProjectData: (data: VirtualData) => void;
  onDeleteProject: (id: number) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ 
  apiConfig, 
  setIsSettingsOpen, 
  setActiveTab, 
  projects,
  setCurrentProjectData,
  onDeleteProject
}) => {
  const [filter, setFilter] = useState<'all' | 'virtual' | 'refined'>('all');

  const filteredProjects = projects.filter(p => {
    if (filter === 'all') return true;
    return p.type === filter || (!p.type && filter === 'virtual'); // Backward compatibility
  });

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">工作台</h1>
          <p className="text-slate-500">下午好，准备好开启今天的面试特训了吗？</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className={`border px-4 py-3 rounded-xl flex items-center transition ${apiConfig.apiKey ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {apiConfig.apiKey ? <CheckCircle2 size={20} className="mr-2"/> : <Settings size={20} className="mr-2" />}
            {apiConfig.apiKey ? 'API 已配置' : 'API 设置'}
          </button>
          <button onClick={() => setActiveTab('virtual')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl flex items-center shadow-lg transform transition active:scale-95">
            <Plus size={20} className="mr-2" /> 新建经历模拟
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg col-span-1 md:col-span-2 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-semibold mb-2">AI 简历诊断</h3>
            <p className="text-indigo-100 mb-6 max-w-md">您的上一份模拟经历在“数据支撑”方面略显薄弱，建议使用 STAR 法则增强 R (Result) 部分的描述。</p>
            <button onClick={() => setActiveTab('refiner')} className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50">立即优化</button>
          </div>
          <Wand2 className="absolute right-4 bottom-4 text-white opacity-20" size={120} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
           <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4"><TrendingUp size={32} /></div>
           <div className="text-3xl font-bold text-slate-800">85%</div>
           <div className="text-sm text-slate-500 mt-1">面试话术熟练度</div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-800">项目资产</h2>
          <div className="flex space-x-2 bg-white p-1 rounded-lg border border-slate-200">
            <button onClick={() => setFilter('all')} className={`px-3 py-1 text-xs rounded-md transition ${filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>全部</button>
            <button onClick={() => setFilter('virtual')} className={`px-3 py-1 text-xs rounded-md transition ${filter === 'virtual' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>虚拟实习</button>
            <button onClick={() => setFilter('refined')} className={`px-3 py-1 text-xs rounded-md transition ${filter === 'refined' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>话术重构</button>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <div className="inline-flex p-4 bg-slate-50 rounded-full mb-3"><Briefcase className="text-slate-400" size={24} /></div>
            <p className="text-slate-500">暂无项目，开始创建一个吧！</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.map(project => (
              <div 
                key={project.id} 
                className="bg-white p-5 rounded-xl border border-slate-100 hover:shadow-md transition group relative overflow-hidden"
              >
                <div 
                   onClick={() => {
                    if (project.data) {
                      setCurrentProjectData(project.data);
                      setActiveTab('virtual');
                    }
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className={`p-2 rounded-lg transition-colors ${project.type === 'refined' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                      {project.type === 'refined' ? <Wand2 size={20} /> : <Briefcase size={20} />}
                    </div>
                    <span className="text-xs text-slate-400">{project.date}</span>
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1 flex items-center">
                    {project.title}
                    {project.isExample && <span className="ml-2 text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">示例</span>}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">目标岗位：{project.role}</p>
                  
                  {project.type !== 'refined' && (
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${project.isExample ? 'bg-slate-300' : 'bg-indigo-500'}`} style={{ width: `${project.progress}%` }}></div>
                    </div>
                  )}
                  {project.type === 'refined' && (
                    <div className="flex items-center text-xs text-indigo-600 font-medium bg-indigo-50 w-fit px-2 py-1 rounded">
                      <FileText size={12} className="mr-1"/> 已生成 3 种话术版本
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeleteProject(project.id); }}
                  className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  title="删除项目"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <div onClick={() => setActiveTab('virtual')} className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition text-slate-400 hover:text-indigo-500 min-h-[160px]">
              <Plus size={32} className="mb-2" />
              <span className="font-medium">新建项目</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardView;

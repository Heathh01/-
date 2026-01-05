import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Wand2, 
  GraduationCap, 
  User, 
  Settings 
} from 'lucide-react';
import SidebarItem from './components/SidebarItem';
import SettingsModal from './components/SettingsModal';
import DashboardView from './components/views/DashboardView';
import RefinerView from './components/views/RefinerView';
import VirtualGeneratorView from './components/views/VirtualGeneratorView';
import TrainingView from './components/views/TrainingView';
import ProfileView from './components/views/ProfileView';

import { INITIAL_PROJECTS, DEFAULT_STAR_SCRIPT } from './constants';
import { callAI } from './services/api';
import { ApiConfig, Project, VirtualData, TrainingScript, RefinedVersion } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // --- Global State ---
  // Initialize from LocalStorage if available
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('careerai_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [currentProjectData, setCurrentProjectData] = useState<VirtualData | null>(null);
  const [trainingScript, setTrainingScript] = useState<TrainingScript>(DEFAULT_STAR_SCRIPT);
  const [trainingMode, setTrainingMode] = useState('virtual');

  const [apiConfig, setApiConfig] = useState<ApiConfig>(() => {
    const saved = localStorage.getItem('careerai_config');
    return saved ? JSON.parse(saved) : {
      provider: 'gemini',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
      apiKey: '',
      model: 'gemini-2.5-flash'
    };
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('careerai_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('careerai_config', JSON.stringify(apiConfig));
  }, [apiConfig]);

  const performAICall = async (systemPrompt: string, userPrompt: string, jsonMode = true) => {
    return callAI(apiConfig, systemPrompt, userPrompt, jsonMode);
  };

  // Actions
  const handleSaveProject = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
    alert("项目已保存至工作台！");
  };

  const handleDeleteProject = (id: number) => {
    if (confirm('确定要删除这个项目吗？此操作无法撤销。')) {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800">
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        config={apiConfig} 
        onSave={(newConfig) => { setApiConfig(newConfig); setIsSettingsOpen(false); alert("API 配置已保存！"); }} 
      />
      <div className="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col z-20 shadow-sm">
        <div className="p-6 flex items-center space-x-3 border-b border-slate-100"><div className="bg-indigo-600 p-2 rounded-lg text-white"><GraduationCap size={24} /></div><span className="text-lg font-bold text-slate-800 tracking-tight">Career<span className="text-indigo-600">AI</span></span></div>
        <nav className="flex-1 mt-6 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="工作台" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={Wand2} label="经历重构车间" active={activeTab === 'refiner'} onClick={() => setActiveTab('refiner')} />
          <SidebarItem icon={Briefcase} label="虚拟实习生成" active={activeTab === 'virtual'} onClick={() => setActiveTab('virtual')} />
          <SidebarItem icon={GraduationCap} label="面试演练中心" active={activeTab === 'training'} onClick={() => setActiveTab('training')} />
          <SidebarItem icon={User} label="个人中心" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </nav>
        <div className="p-4 border-t border-slate-100"><button onClick={() => setIsSettingsOpen(true)} className="w-full flex items-center justify-center p-2 text-sm text-slate-500 hover:text-indigo-600"><Settings size={14} className="mr-1"/> 配置接口</button></div>
      </div>
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="flex-1 overflow-auto bg-slate-100">
          {activeTab === 'dashboard' && <DashboardView 
            apiConfig={apiConfig} 
            setIsSettingsOpen={setIsSettingsOpen} 
            setActiveTab={setActiveTab} 
            projects={projects} 
            setCurrentProjectData={setCurrentProjectData} 
            onDeleteProject={handleDeleteProject}
          />}
          {activeTab === 'refiner' && <RefinerView 
            callAI={performAICall}
            setTrainingScript={setTrainingScript}
            setTrainingMode={setTrainingMode}
            setActiveTab={setActiveTab}
            onSaveRefinedData={(data, title, role) => handleSaveProject({
              id: Date.now(),
              type: 'refined',
              title: title,
              role: role,
              progress: 100,
              date: new Date().toLocaleDateString(),
              isExample: false,
              refinedData: data
            })}
          />}
          {activeTab === 'virtual' && <VirtualGeneratorView 
            currentProjectData={currentProjectData}
            setCurrentProjectData={setCurrentProjectData}
            callAI={performAICall}
            setActiveTab={setActiveTab}
            onSaveVirtualProject={(data, title, role) => handleSaveProject({
              id: Date.now(),
              type: 'virtual',
              title: title,
              role: role,
              progress: 20,
              date: new Date().toLocaleDateString(),
              isExample: false,
              data: data
            })}
          />}
          {activeTab === 'training' && <TrainingView 
            trainingScript={trainingScript}
            trainingMode={trainingMode}
            callAI={performAICall}
          />}
          {activeTab === 'profile' && <ProfileView projects={projects} />}
        </div>
      </div>
    </div>
  );
}

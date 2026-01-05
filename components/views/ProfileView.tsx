import React from 'react';
import { Download, Briefcase, FileText } from 'lucide-react';
import { Project } from '../../types';

interface ProfileViewProps {
  projects: Project[];
}

const ProfileView: React.FC<ProfileViewProps> = ({ projects }) => {
  const handleExport = () => {
    const printContent = `
      <html><head><title>CareerAI 档案</title><style>body{font-family:sans-serif;padding:40px;max-width:800px;margin:0 auto;}h1{border-bottom:2px solid #4f46e5;color:#4f46e5;padding-bottom:10px}.section-title{margin-top:30px;font-size:16px;color:#333;font-weight:bold;border-bottom:1px solid #eee;padding-bottom:5px;}.project{margin-bottom:20px;padding-left:15px;border-left:4px solid #e2e8f0;}.title{font-weight:bold;font-size:18px}.meta{color:#666;font-size:14px;margin-bottom:5px;}</style></head>
      <body><h1>面试辅导档案</h1><p>生成日期: ${new Date().toLocaleDateString()}</p>
      
      <div class="section-title">虚拟实习经历</div>
      ${projects.filter(p => !p.type || p.type === 'virtual').map(p => `<div class="project"><div class="title">${p.title}</div><div class="meta">${p.role} · ${p.date}</div><div>${p.data ? p.data.background.target : ''}</div></div>`).join('')}
      
      <div class="section-title">简历话术重构</div>
      ${projects.filter(p => p.type === 'refined').map(p => `<div class="project"><div class="title">${p.title}</div><div class="meta">${p.role} · ${p.date}</div></div>`).join('')}
      
      <script>window.onload=function(){window.print();}</script></body></html>`;
    const win = window.open('','_blank'); if(win){win.document.write(printContent);win.document.close();}else{alert("请允许弹窗");}
  };

  const virtualProjects = projects.filter(p => !p.type || p.type === 'virtual');
  const refinedProjects = projects.filter(p => p.type === 'refined');

  return (
    <div className="h-full flex flex-col p-8 overflow-y-auto">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row mb-8">
        <div className="w-full md:w-1/2 p-10 bg-indigo-600 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">档案准备就绪</h2>
            <p className="text-indigo-100 opacity-90 mb-4">随时随地导出您的职业资产。</p>
            <div className="space-y-2">
               <div className="flex justify-between border-b border-indigo-500 pb-2"><span>虚拟实习项目</span><span className="font-bold">{virtualProjects.length}</span></div>
               <div className="flex justify-between border-b border-indigo-500 pb-2"><span>话术重构版本</span><span className="font-bold">{refinedProjects.length}</span></div>
            </div>
          </div>
          <button onClick={handleExport} className="bg-white text-indigo-600 font-bold py-3 rounded-lg flex items-center justify-center hover:bg-indigo-50 transition mt-6"><Download className="mr-2" size={20}/> 导出/打印 PDF</button>
        </div>
        <div className="w-full md:w-1/2 bg-slate-100 p-8 flex items-center justify-center relative">
          <div className="bg-white w-48 h-64 shadow-xl rounded-sm transform rotate-[-3deg] absolute z-10 border border-slate-200 flex flex-col p-4">
             <div className="w-8 h-8 rounded-full bg-indigo-100 mb-2"></div>
             <div className="h-2 w-20 bg-slate-100 mb-4 rounded"></div>
             <div className="space-y-2">
               <div className="h-1.5 w-full bg-slate-100 rounded"></div>
               <div className="h-1.5 w-full bg-slate-100 rounded"></div>
               <div className="h-1.5 w-3/4 bg-slate-100 rounded"></div>
             </div>
          </div>
          <div className="bg-white w-48 h-64 shadow-md rounded-sm transform rotate-[5deg] absolute z-0 border border-slate-200"></div>
        </div>
      </div>

      <div className="max-w-4xl w-full mx-auto space-y-6">
        {virtualProjects.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center"><Briefcase size={20} className="mr-2 text-indigo-600"/> 虚拟实习项目</h3>
            <div className="grid grid-cols-1 gap-3">
              {virtualProjects.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-800">{p.title}</div>
                    <div className="text-sm text-slate-500">{p.role} · {p.date}</div>
                  </div>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full font-medium">Virtual</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {refinedProjects.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center"><FileText size={20} className="mr-2 text-purple-600"/> 话术重构版本</h3>
            <div className="grid grid-cols-1 gap-3">
              {refinedProjects.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-800">{p.title}</div>
                    <div className="text-sm text-slate-500">{p.role} · {p.date}</div>
                  </div>
                  <span className="px-3 py-1 bg-purple-50 text-purple-600 text-xs rounded-full font-medium">Refined</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;

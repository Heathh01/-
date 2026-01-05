import React, { useState, useEffect } from 'react';
import { Settings, X, Zap, Loader2, Check, XCircle, Save } from 'lucide-react';
import { ApiConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ApiConfig;
  onSave: (config: ApiConfig) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, config, onSave }) => {
  const [localConfig, setLocalConfig] = useState<ApiConfig>(config);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLocalConfig(config);
      setTestStatus('idle');
      setTestMessage('');
    }
  }, [isOpen, config]);

  const handleProviderChange = (provider: 'gemini' | 'openai') => {
    if (provider === 'gemini') {
      setLocalConfig({
        ...localConfig,
        provider: 'gemini',
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models', 
        model: 'gemini-2.5-flash'
      });
    } else {
      setLocalConfig({
        ...localConfig,
        provider: 'openai',
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-3.5-turbo'
      });
    }
  };

  const testConnection = async () => {
    if (!localConfig.apiKey) {
      setTestStatus('error');
      setTestMessage('请输入 API Key');
      return;
    }
    setTestStatus('testing');
    setTestMessage('正在连接 API...');
    try {
      let success = false;
      if (localConfig.provider === 'gemini') {
        const url = `${localConfig.baseUrl}/${localConfig.model}:generateContent?key=${localConfig.apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: "Hello" }] }] })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        if (data.candidates?.[0]?.content) success = true;
      } else {
        const response = await fetch(`${localConfig.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localConfig.apiKey}` },
          body: JSON.stringify({ model: localConfig.model, messages: [{ role: "user", content: "Hello" }], max_tokens: 5 })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        if (data.choices?.[0]) success = true;
      }
      if (success) {
        setTestStatus('success');
        setTestMessage('连接成功！API 工作正常。');
      } else throw new Error('未收到有效响应');
    } catch (error: any) {
      setTestStatus('error');
      setTestMessage(`连接失败: ${error.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-scale-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <Settings className="mr-2" size={20} /> API 配置
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">选择模型服务商</label>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => handleProviderChange('gemini')} className={`p-3 rounded-xl border flex items-center justify-center transition ${localConfig.provider === 'gemini' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}><Zap size={18} className="mr-2" /> Google Gemini</button>
              <button onClick={() => handleProviderChange('openai')} className={`p-3 rounded-xl border flex items-center justify-center transition ${localConfig.provider === 'openai' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}><div className="w-4 h-4 bg-current rounded-full mr-2 opacity-50" /> OpenAI Compatible</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">API Key</label>
            <input type="password" className="w-full p-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder={localConfig.provider === 'gemini' ? "AIza..." : "sk-..."} value={localConfig.apiKey} onChange={e => setLocalConfig({...localConfig, apiKey: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Model Name</label>
            <input type="text" className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="gemini-2.5-flash" value={localConfig.model} onChange={e => setLocalConfig({...localConfig, model: e.target.value})} />
          </div>
          {localConfig.provider === 'openai' && (
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Base URL</label><input type="text" className="w-full p-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={localConfig.baseUrl} onChange={e => setLocalConfig({...localConfig, baseUrl: e.target.value})} /></div>
          )}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
             <div className="flex items-center text-sm">
                {testStatus === 'testing' && <Loader2 className="animate-spin text-indigo-600 mr-2" size={16} />}
                {testStatus === 'success' && <Check className="text-green-500 mr-2" size={16} />}
                {testStatus === 'error' && <XCircle className="text-red-500 mr-2" size={16} />}
                <span className={`${testStatus === 'error' ? 'text-red-600' : testStatus === 'success' ? 'text-green-600' : 'text-slate-600'}`}>{testMessage || '配置完成后，请测试连接'}</span>
             </div>
             <button onClick={testConnection} disabled={testStatus === 'testing'} className="text-xs bg-white border border-slate-300 px-3 py-1.5 rounded-md font-medium text-slate-700 hover:bg-slate-100 transition disabled:opacity-50">🔗 测试连接</button>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm">取消</button>
          <button onClick={() => onSave(localConfig)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 flex items-center shadow-sm"><Save size={16} className="mr-1" /> 保存配置</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
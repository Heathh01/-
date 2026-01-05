export interface ApiConfig {
  provider: 'gemini' | 'openai';
  baseUrl: string;
  apiKey: string;
  model: string;
}

export interface VirtualData {
  background: {
    target: string; // 项目目标
    roleDefinition: string; // 你的具体角色定义
    businessValue: string; // 商业价值 (Why we do this)
    techStack: string[]; // 技术/工具栈 (Hard Skills)
    coreChallenges: string; // 核心难点 (The Story)
  };
  timeline: {
    phase: string;
    duration: string;
    actionItems: string[]; // 具体做了什么
    deliverables: string[]; // 产出物 (可用于作品集)
    interviewFocus: string; // 面试官考察点
  }[];
  competency: {
    radar: { dimension: string; value: number; label: string }[]; // 能力雷达
    interviewQA: { question: string; answer: string; tag: string }[]; // 模拟QA
    portfolioAssets: string[]; // 建议放入作品集的素材
  };
}

export interface Project {
  id: number;
  type: 'virtual' | 'refined'; // Distinct project types
  title: string;
  role: string;
  progress: number;
  date: string;
  isExample: boolean;
  data?: VirtualData; // For Virtual Internships
  refinedData?: RefinedVersion; // For Refined Experiences
}

export interface RefinedContentItem {
  text: string;
  type: 'text' | 'keyword';
  desc?: string;
}

export interface RefinedVersion {
  title: string;
  content: RefinedContentItem[];
}

export interface RefinedData {
  stable: RefinedVersion;
  aggressive: RefinedVersion;
  management: RefinedVersion;
}

export interface TrainingScript {
  S: string;
  T: string;
  A: string;
  R: string;
  [key: string]: string;
}

export interface ChatMessage {
  role: 'ai' | 'user';
  text: string;
  analysis?: boolean;
}

import { RefinedData, TrainingScript, VirtualData } from './types';

export const SYSTEM_PROMPTS = {
  refiner: `你是一位资深职业规划师。请根据用户提供的简历信息，将其重构为三个版本：
  1. 稳健型 (Standard)：强调执行力、合规性、细心。
  2. 进取型 (Growth)：强调数据分析能力、优化思维、解决问题。
  3. 管理型 (Leadership)：强调统筹、SOP制定、培训新人。
  
  请严格返回合法的 JSON 格式，不要包含 Markdown 格式标记。不要输出代码块标记。
  JSON 结构示例：
  {
    "stable": { "title": "稳健型", "content": [{"text": "...", "type": "text"}, {"text": "关键词", "type": "keyword", "desc": "解释"}] },
    "aggressive": { ... },
    "management": { ... }
  }`,
  
  generator: `你是一位世界500强企业的核心业务负责人。请为候选人设计一个深度、逻辑闭环的虚拟实习项目，重点在于帮助候选人应对高难度的行为面试（Behavioral Interview）。

  请返回严格的 JSON 格式，不要包含 Markdown 标记。JSON 结构如下：
  {
    "background": {
      "target": "一句话项目定义",
      "roleDefinition": "候选人在项目中的具体角色和职责范围",
      "businessValue": "项目对公司的商业贡献（如：降本增效、用户增长、合规避险）",
      "techStack": ["工具1", "方法论2", "硬技能3"],
      "coreChallenges": "项目中遇到的最大困难（用于回答'你遇到的最大挑战'）"
    },
    "timeline": [
      {
        "phase": "阶段名称 (e.g. 需求调研)",
        "duration": "耗时",
        "actionItems": ["具体动作1", "具体动作2"],
        "deliverables": ["产出文档1", "产出图表2"],
        "interviewFocus": "面试官在这个阶段最喜欢问什么？"
      }
    ],
    "competency": {
      "radar": [
        {"dimension": "执行力", "value": 90, "label": "高效落地"},
        {"dimension": "思考力", "value": 85, "label": "逻辑闭环"},
        {"dimension": "沟通力", "value": 80, "label": "跨部门协作"},
        {"dimension": "专业力", "value": 95, "label": "工具流熟练"},
        {"dimension": "抗压力", "value": 75, "label": "应对Deadline"}
      ],
      "interviewQA": [
        {"question": "最刁钻的面试问题1", "answer": "STAR原则的高分回答思路", "tag": "考察抗压"},
        {"question": "最刁钻的面试问题2", "answer": "回答思路", "tag": "考察复盘"}
      ],
      "portfolioAssets": ["建议放入作品集的文件名称1", "建议放入作品集的文件名称2"]
    }
  }`,
  
  interviewer: `你是一位严厉但专业的面试官。请针对用户的项目经历进行 STAR 原则的深挖。请保持简短，每次只问一个核心问题。如果用户回答得不好，请在回复中包含 {"analysis": true} 的标记并给出简短建议。`
};

export const MOCK_VIRTUAL_DATA_TEMPLATE: VirtualData = {
  background: {
    target: "构建集团级全渠道实时竞价监控系统 (Real-time Pricing Monitor)",
    roleDefinition: "作为核心产品助理，负责从数据采集需求定义到可视化看板落地的全流程管理，协调后端与算法团队。",
    businessValue: "解决了过去人工比价滞后48小时的痛点，将价格响应速度提升至分钟级，直接帮助Q3季度GMV提升12%。",
    techStack: ["Python (Scrapy)", "SQL", "Tableau", "PRD撰写", "竞品分析"],
    coreChallenges: "面临反爬虫策略升级频繁导致数据断流的问题。解决方案是设计了动态IP池轮询机制，并建立了异常数据熔断报警SOP。"
  },
  timeline: [
    { 
      phase: "Week 1: 需求与定义", 
      duration: "5天", 
      actionItems: ["访谈运营部门核心痛点", "梳理TOP 100竞对名单", "制定数据采集字段字典"], 
      deliverables: ["《竞品数据采集需求文档 (BRD)》", "《字段映射表.xlsx》"], 
      interviewFocus: "考察点：你如何确定需求的优先级？如果运营提出的需求技术做不到怎么办？" 
    },
    { 
      phase: "Week 2-3: 方案与开发", 
      duration: "10天", 
      actionItems: ["绘制Axure高保真原型图", "参与数据库表结构评审", "跟进爬虫开发进度"], 
      deliverables: ["《监控看板PRD v1.0》", "《埋点需求文档》"], 
      interviewFocus: "考察点：开发过程中出现延期风险，你如何协调资源？" 
    },
    { 
      phase: "Week 4: 验证与复盘", 
      duration: "5天", 
      actionItems: ["进行数据准确性UAT测试", "撰写操作手册培训运营", "输出ROI分析报告"], 
      deliverables: ["《项目结项复盘报告.pptx》", "《UAT测试验收单》"], 
      interviewFocus: "考察点：用数据证明你的项目价值。你是如何清洗脏数据的？" 
    }
  ],
  competency: {
    radar: [
      { dimension: "数据思维", value: 90, label: "Data Driven" },
      { dimension: "项目统筹", value: 85, label: "Project Mgmt" },
      { dimension: "商业敏锐", value: 80, label: "Business Sense" },
      { dimension: "技术理解", value: 75, label: "Tech Savvy" },
      { dimension: "沟通协作", value: 88, label: "Communication" }
    ],
    interviewQA: [
      { 
        question: "在这个项目中，你遇到的最大分歧是什么？怎么解决的？", 
        answer: "【回答策略】描述运营部门想要全量数据但技术部门认为服务器压力过大的冲突。展示你如何通过'分级采集策略'（头部商品高频、长尾商品低频）达成折中方案。", 
        tag: "冲突解决" 
      },
      { 
        question: "如果竞对网站结构变了，数据抓不到了，你作为负责人怎么处理？", 
        answer: "【回答策略】1. 立即启动应急预案（人工抽检）；2. 评估修复工时；3. 向Stakeholder同步风险。强调你的风险意识和SOP机制。", 
        tag: "危机处理" 
      }
    ],
    portfolioAssets: [
      "竞品监控系统-PRD需求文档.pdf (脱敏版)",
      "竞对价格波动分析报告.xlsx (含透视表)",
      "项目复盘SOP流程图.png"
    ]
  }
};

export const INITIAL_PROJECTS = [
  { 
    id: 1, 
    title: '电商大促数据分析 (示例)', 
    role: '数据分析助理', 
    progress: 100, 
    date: '2023-10-24', 
    isExample: true,
    data: MOCK_VIRTUAL_DATA_TEMPLATE
  },
];

export const MOCK_REFINED_DATA: RefinedData = {
  stable: {
    title: "稳健型 (Standard)",
    content: [
      { text: "负责整理部门税务发票，协助进行", type: "text" },
      { text: "成本分摊", type: "keyword", desc: "精细化管理能力" },
      { text: "计算。通过Excel建立自动化台账。", type: "text" }
    ]
  },
  aggressive: {
    title: "进取型 (Growth)",
    content: [
      { text: "主导了部门", type: "text" },
      { text: "财务流程优化", type: "keyword", desc: "变革推动能力" },
      { text: "项目。", type: "text" }
    ]
  },
  management: {
    title: "管理型 (Leadership)",
    content: [
      { text: "统筹协调跨部门资源，推动了", type: "text" },
      { text: "ERP系统", type: "keyword", desc: "企业资源计划" },
      { text: "落地。", type: "text" }
    ]
  }
};

export const DEFAULT_STAR_SCRIPT: TrainingScript = {
  S: "点击左侧‘经历重构’或‘虚拟实习’生成内容后，此处将自动填充背景。",
  T: "任务目标...",
  A: "具体行动...",
  R: "最终结果..."
};

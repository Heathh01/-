import React, { useState } from 'react';

interface KeywordTooltipProps {
  text: string;
  desc?: string;
}

const KeywordTooltip: React.FC<KeywordTooltipProps> = ({ text, desc }) => {
  const [show, setShow] = useState(false);
  return (
    <span 
      className="relative inline-block cursor-help text-indigo-600 font-semibold border-b border-dashed border-indigo-400 mx-1"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={() => setShow(!show)}
    >
      {text}
      {show && (
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-indigo-950 text-white text-xs rounded shadow-xl z-50 animate-fade-in-up block text-left leading-normal border border-indigo-800">
          <span className="font-bold mb-1 text-indigo-200 block">术语解释</span>
          <span className="block text-indigo-50">{desc}</span>
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-indigo-950 border-r border-b border-indigo-800 rotate-45"></span>
        </span>
      )}
    </span>
  );
};

export default KeywordTooltip;
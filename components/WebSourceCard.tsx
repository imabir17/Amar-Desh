import React from 'react';
import { GroundingChunk } from '../types';

interface Props {
  chunk: GroundingChunk;
}

export const WebSourceCard: React.FC<Props> = ({ chunk }) => {
  if (!chunk.web) return null;

  const { title, uri } = chunk.web;

  return (
    <a 
      href={uri} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block bg-white border border-slate-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 hover:border-teal-400 group"
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="bg-teal-50 p-1 rounded-full">
            <svg className="w-3 h-3 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
        </div>
        <span className="text-xs text-slate-500 font-medium truncate w-full">Source</span>
      </div>
      <h4 className="font-medium text-slate-800 text-sm line-clamp-2 group-hover:text-teal-700">
        {title}
      </h4>
    </a>
  );
};

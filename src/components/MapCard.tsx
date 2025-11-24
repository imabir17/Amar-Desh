import React from 'react';
import { GroundingChunk } from '../types';

interface Props {
  chunk: GroundingChunk;
}

export const MapCard: React.FC<Props> = ({ chunk }) => {
  if (!chunk.maps) return null;

  const { title, uri, placeAnswerSources } = chunk.maps;
  const snippet = placeAnswerSources?.reviewSnippets?.[0]?.content;

  return (
    <a 
      href={uri} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 hover:border-teal-400"
    >
      <div className="flex items-start justify-between">
        <div>
            <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {title}
            </h4>
            {snippet && (
                <p className="text-sm text-slate-500 mt-2 line-clamp-2 italic">
                    "{snippet}"
                </p>
            )}
            <span className="text-xs text-teal-600 font-medium mt-3 inline-block">
                View on Google Maps &rarr;
            </span>
        </div>
      </div>
    </a>
  );
};

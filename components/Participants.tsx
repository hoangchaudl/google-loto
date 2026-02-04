
import React from 'react';
import { Participant } from '../types';

interface ParticipantsProps {
  participants: Participant[];
  currentUserId: string;
}

const Participants: React.FC<ParticipantsProps> = ({ participants, currentUserId }) => {
  // Sort by join time
  const sorted = [...participants].sort((a, b) => a.joinedAt - b.joinedAt);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 p-4 border-b flex justify-between items-center">
        <h3 className="font-bold text-slate-800">Participants</h3>
        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold ring-1 ring-green-200">
          {participants.length} Online
        </span>
      </div>
      <div className="max-h-64 overflow-y-auto p-2">
        {sorted.length === 0 ? (
          <p className="text-center py-4 text-slate-400 text-sm">Wait, where is everyone?</p>
        ) : (
          <ul className="space-y-1">
            {sorted.map(p => (
              <li 
                key={p.id}
                className={`
                  flex items-center justify-between p-2 rounded-lg text-sm
                  ${p.id === currentUserId ? 'bg-red-50 font-bold ring-1 ring-red-100' : 'hover:bg-slate-50'}
                `}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${p.id === currentUserId ? 'bg-red-500 animate-pulse' : 'bg-slate-300'}`}></div>
                  <span className={p.id === currentUserId ? 'text-red-700' : 'text-slate-700'}>
                    {p.name} {p.id === currentUserId && '(You)'}
                  </span>
                </div>
                {p.isHost && (
                  <span className="text-[10px] bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">
                    HOST
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Participants;

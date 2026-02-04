
import React, { useState } from 'react';

interface JoinFormProps {
  onJoin: (name: string, sessionId: string, isHost: boolean) => void;
}

const JoinForm: React.FC<JoinFormProps> = ({ onJoin }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [mode, setMode] = useState<'join' | 'host'>('join');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || (!room && mode === 'join')) return;
    
    const sid = mode === 'host' ? Math.random().toString(36).substr(2, 6).toUpperCase() : room.toUpperCase();
    onJoin(name, sid, mode === 'host');
  };

  return (
    <div className="min-h-screen bg-red-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bungee text-red-600 mb-2">LÔ TÔ LIVE</h1>
          <p className="text-slate-500 italic">Vui xuân - Chơi thật - Trúng lời khen</p>
        </div>

        <div className="flex mb-6 bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setMode('join')}
            className={`flex-1 py-2 rounded-md font-bold transition-all ${mode === 'join' ? 'bg-white shadow text-red-600' : 'text-slate-400'}`}
          >
            JOIN ROOM
          </button>
          <button 
            onClick={() => setMode('host')}
            className={`flex-1 py-2 rounded-md font-bold transition-all ${mode === 'host' ? 'bg-white shadow text-red-600' : 'text-slate-400'}`}
          >
            HOST GAME
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1 uppercase">Your Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Anh Bảy, Chị Tám..."
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-red-500 outline-none transition-all"
            />
          </div>

          {mode === 'join' && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1 uppercase">Room Code</label>
              <input 
                type="text" 
                required
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="ENTER 6-DIGIT CODE"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-red-500 outline-none transition-all font-mono text-center text-xl tracking-widest"
              />
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl shadow-lg transition-transform active:scale-95 text-lg"
          >
            {mode === 'host' ? 'CREATE LOBBY' : 'READY TO PLAY!'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-400">
          Tip: Open this app in another tab to test synchronization!
        </p>
      </div>
    </div>
  );
};

export default JoinForm;

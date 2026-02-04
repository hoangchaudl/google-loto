
import React from 'react';

interface CallerProps {
  currentNumber: number | null;
  isHost: boolean;
  onNext: () => void;
  onReset: () => void;
  rao?: string;
  isGameOver: boolean;
  isAutoMode: boolean;
  onToggleAuto: () => void;
}

const Caller: React.FC<CallerProps> = ({ 
  currentNumber, 
  isHost, 
  onNext, 
  onReset, 
  rao, 
  isGameOver, 
  isAutoMode, 
  onToggleAuto 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-b-4 border-red-600">
      <div className="bg-gradient-to-r from-red-600 to-red-500 p-8 text-center text-white relative">
        <div className="absolute top-4 right-4 flex gap-2">
          {isHost && (
            <button 
              onClick={onReset}
              title="Reset game for new round"
              className="text-xs bg-white text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-full font-bold shadow-md transition-all active:scale-95 border border-white/20"
            >
              RESET GAME
            </button>
          )}
        </div>

        <p className="text-sm font-bold tracking-widest uppercase opacity-80 mb-2">Con Số May Mắn</p>
        
        <div className="h-48 flex items-center justify-center">
          {currentNumber ? (
            <div key={currentNumber} className="animate-pop">
              <span className="text-9xl font-bungee drop-shadow-lg leading-none">
                {currentNumber}
              </span>
            </div>
          ) : (
            <div className="text-white/30 text-center">
              <div className="w-20 h-20 border-4 border-dashed border-white/20 rounded-full mx-auto mb-4 animate-pulse"></div>
              <p className="font-bold italic">Waiting for the first call...</p>
            </div>
          )}
        </div>

        {rao && (
          <div className="mt-4 animate-pop">
             <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 italic text-lg leading-relaxed border border-white/20 max-w-lg mx-auto">
              "{rao}"
            </div>
          </div>
        )}
      </div>

      {isHost && (
        <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
          <div className="flex items-center justify-center gap-6 mb-2">
            <label className="flex items-center cursor-pointer select-none group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={isAutoMode} 
                  onChange={onToggleAuto}
                />
                <div className={`block w-14 h-8 rounded-full transition-colors ${isAutoMode ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isAutoMode ? 'transform translate-x-6' : ''}`}></div>
              </div>
              <div className="ml-3 text-slate-700 font-bold">
                AUTO MODE <span className="text-xs font-normal opacity-60">(Every 7s)</span>
              </div>
            </label>
          </div>

          {isGameOver ? (
            <div className="text-center py-4">
              <p className="text-red-600 font-black mb-4 uppercase tracking-wider">Bingo! All numbers have been called.</p>
              <button 
                onClick={onReset}
                className="bg-slate-800 text-white px-12 py-4 rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-lg active:scale-95"
              >
                START NEW ROUND
              </button>
            </div>
          ) : (
            <button 
              onClick={onNext}
              disabled={isAutoMode}
              className={`w-full group p-5 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 ${isAutoMode ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'}`}
            >
              <span className="text-2xl font-black">{isAutoMode ? 'AUTO RUNNING...' : 'NEXT NUMBER'}</span>
              {!isAutoMode && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              )}
            </button>
          )}
        </div>
      )}

      {!isHost && !currentNumber && (
        <div className="p-12 text-center text-slate-400">
          <p className="animate-pulse">The Host will start the game soon. Grab your tickets!</p>
        </div>
      )}
      
      {!isHost && currentNumber && (
         <div className="p-4 bg-slate-50 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Listening for host calls...</p>
         </div>
      )}
    </div>
  );
};

export default Caller;

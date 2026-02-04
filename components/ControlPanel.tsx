
import React, { useState } from 'react';
import { GameState } from '../types';

interface ControlPanelProps {
  gameState: GameState;
  sessionId: string;
  isHost: boolean;
  isAutoMode: boolean;
  isVoiceOn: boolean;
  autoSpeed: number;
  timeLeft: number;
  onNext: () => void;
  onReset: () => void;
  onToggleAuto: () => void;
  onToggleVoice: () => void;
  onSpeedChange: (val: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  gameState,
  sessionId,
  isHost,
  isAutoMode,
  isVoiceOn,
  autoSpeed,
  timeLeft,
  onNext,
  onReset,
  onToggleAuto,
  onToggleVoice,
  onSpeedChange
}) => {
  const { currentNumber, numbers, lastRao } = gameState;
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sessionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 0. Mã Phòng (Session ID) */}
      <div className="bg-[#fdfcf6] rounded-2xl p-4 shadow-sm border border-[#e5e0d4] flex items-center justify-between group">
        <div>
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã phòng hiện tại</h4>
          <p className="text-xl font-mono font-black tracking-[0.2em] text-red-600">{sessionId}</p>
        </div>
        <button 
          onClick={handleCopyCode}
          className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:border-red-300 hover:text-red-500'}`}
        >
          {copied ? 'Đã chép!' : 'Chép mã'}
        </button>
      </div>

      {/* 1. Số Hiện Tại (Current Number Circular Display) */}
      <div className="bg-white rounded-2xl p-8 shadow-loto border border-[#e5e0d4] text-center relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-50 rounded-full opacity-50"></div>
        
        {/* Auto Mode Countdown Indicator */}
        {isAutoMode && isHost && (
          <div className="absolute top-4 right-4 z-20 flex flex-col items-center">
             <div className="w-10 h-10 rounded-full bg-red-600 text-white border-2 border-white shadow-lg flex items-center justify-center font-black animate-pulse transition-all">
               {Math.ceil(timeLeft)}
             </div>
             <span className="text-[10px] font-bold text-red-500 mt-1 uppercase">Giây</span>
          </div>
        )}
        
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 relative z-10">Số hiện tại</h3>
        <div className="relative mx-auto w-48 h-48 flex items-center justify-center z-10">
          <div className="absolute inset-0 rounded-full border-[10px] border-red-500 shadow-xl opacity-90"></div>
          <div className={`w-36 h-36 rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-300 flex items-center justify-center shadow-2xl relative z-10 ${currentNumber ? 'animate-pop' : ''}`}>
             <span className="text-7xl font-black text-red-700 leading-none">
               {currentNumber || '?'}
             </span>
          </div>
        </div>
        <p className="mt-6 text-sm font-bold text-slate-500">
          Còn lại: <span className="text-red-600 font-black">{90 - numbers.length}</span> / 90
        </p>
        {lastRao && (
          <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl italic text-red-800 text-sm animate-pop">
            "{lastRao}"
          </div>
        )}
      </div>

      {/* 2. Lịch Sử (History Box) */}
      <div className="bg-white rounded-2xl p-6 shadow-loto border border-[#e5e0d4] flex flex-col min-h-[180px]">
        <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-2">
          <h3 className="text-sm font-bold text-slate-400 uppercase">Lịch sử</h3>
          <span className="text-xs text-slate-300 font-bold">{numbers.length} số đã quay</span>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {numbers.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-300 text-sm italic py-4">
              Chưa có số nào được quay
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 py-2">
              {[...numbers].reverse().map((n, i) => (
                <div 
                  key={n} 
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-red-500 text-white animate-bounce shadow-md' : 'bg-[#efecdf] text-slate-600'}`}
                >
                  {n}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Controls */}
      <div className="bg-white rounded-2xl p-6 shadow-loto border border-[#e5e0d4] space-y-6">
        {isHost ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              {/* Quay Số (Red Button) */}
              <button 
                onClick={onNext}
                disabled={isAutoMode}
                className={`flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all active:scale-95 ${isAutoMode ? 'bg-slate-100 text-slate-300' : 'bg-red-600 hover:bg-red-700 text-white shadow-lg'}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 12L9.5 8.5v7l6-3.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                Quay số
              </button>
              
              {/* Tự Động (Beige Button) */}
              <button 
                onClick={onToggleAuto}
                className={`flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all active:scale-95 border border-[#e5e0d4] ${isAutoMode ? 'bg-green-600 text-white border-green-700 shadow-md' : 'bg-[#f8f4eb] text-slate-700 hover:bg-[#efe9d8]'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                {isAutoMode ? `Dừng lại` : 'Tự động'}
              </button>
            </div>

            {/* Speed Control */}
            <div className="space-y-3 px-1">
               <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                  <span>Tốc độ:</span>
                  <span className="text-red-600">{autoSpeed.toFixed(1)}s</span>
               </div>
               <input 
                 type="range" 
                 min="3" 
                 max="12" 
                 step="0.5" 
                 value={autoSpeed}
                 onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
               />
            </div>

            {/* Utility Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={onToggleVoice}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all border border-[#e5e0d4] ${isVoiceOn ? 'bg-[#f8f4eb] text-slate-700' : 'bg-slate-50 text-slate-400 italic'}`}
              >
                {isVoiceOn ? '🔊 Giọng nói' : '🔇 Tắt giọng'}
              </button>
              <button 
                onClick={onReset}
                className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all border border-[#e5e0d4] bg-[#f8f4eb] text-slate-700 hover:bg-[#efe9d8]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Chơi lại
              </button>
            </div>
            
            <div className="bg-[#fcfaf5] p-3 rounded-xl border border-[#e5e0d4] text-[11px] text-[#8c7e6c] text-center font-medium">
               💡 Chia sẻ <b>Mã Phòng</b> để bạn bè cùng chơi!
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="animate-pulse flex flex-col items-center gap-4">
               <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               </div>
               <p className="font-bold text-slate-400">Đang đợi chủ phòng gọi số...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;


import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { GameState, Participant } from './types';
import { createSocket } from './services/mockSocket';
import { getRaoVerse, speakText } from './services/geminiService';
import Board from './components/Board';
import ControlPanel from './components/ControlPanel';
import JoinForm from './components/JoinForm';

const App: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<Participant | null>(null);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [isVoiceOn, setIsVoiceOn] = useState(true);
  const [autoSpeed, setAutoSpeed] = useState(5.0); // Seconds
  const [timeLeft, setTimeLeft] = useState<number>(0);
  
  const [gameState, setGameState] = useState<GameState>({
    sessionId: '',
    numbers: [],
    currentNumber: null,
    participants: [],
    status: 'lobby'
  });

  const socket = useMemo(() => (sessionId ? createSocket(sessionId) : null), [sessionId]);

  const handleJoin = (name: string, sid: string, isHost: boolean) => {
    const user: Participant = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      isHost,
      joinedAt: Date.now()
    };
    setCurrentUser(user);
    setSessionId(sid);
  };

  useEffect(() => {
    if (!socket || !currentUser) return;

    socket.on('stateUpdate', (newState: GameState) => {
      setGameState(newState);
    });

    socket.on('participantJoined', (newParticipant: Participant) => {
      setGameState(prev => ({
        ...prev,
        participants: [...prev.participants.filter(p => p.id !== newParticipant.id), newParticipant]
      }));
    });

    socket.emit('participantJoined', currentUser);

    return () => socket.disconnect();
  }, [socket, currentUser]);

  // Handle TTS
  useEffect(() => {
    if (isVoiceOn && gameState.currentNumber) {
      // Only speak the number, ignore the rao verse for audio
      const textToSpeak = `Số ${gameState.currentNumber}!`;
      speakText(textToSpeak);
    }
  }, [gameState.currentNumber, isVoiceOn]);

  const generateNextNumber = useCallback(async () => {
    const available = Array.from({ length: 90 }, (_, i) => i + 1)
      .filter(n => !gameState.numbers.includes(n));

    if (available.length === 0) {
      setIsAutoMode(false);
      return;
    }

    const next = available[Math.floor(Math.random() * available.length)];
    const rao = await getRaoVerse(next);

    const newState: GameState = {
      ...gameState,
      numbers: [...gameState.numbers, next],
      currentNumber: next,
      lastRao: rao,
      status: 'playing'
    };

    socket?.emit('stateUpdate', newState);
  }, [gameState, socket]);

  // Auto Mode Countdown Logic
  useEffect(() => {
    if (!isAutoMode || !currentUser?.isHost) {
      setTimeLeft(0);
      return;
    }

    // Start with full duration
    setTimeLeft(autoSpeed);
    
    // Use a local variable to track approximate time for trigger logic
    let remaining = autoSpeed;

    const timer = setInterval(() => {
      remaining -= 0.1;
      // Update UI state (clamped to 0)
      setTimeLeft(Math.max(0, remaining));

      if (remaining <= 0) {
        // Trigger generation
        generateNextNumber();
        // Set remaining to high value to prevent double triggers 
        // while waiting for generateNextNumber to complete and reset this effect
        remaining = 9999;
      }
    }, 100);

    return () => clearInterval(timer);
  }, [isAutoMode, currentUser?.isHost, autoSpeed, generateNextNumber]);

  const resetGame = () => {
    if (!currentUser?.isHost || !socket) return;
    setIsAutoMode(false);
    setTimeLeft(0);
    const newState: GameState = {
      ...gameState,
      numbers: [],
      currentNumber: null,
      lastRao: undefined,
      status: 'lobby'
    };
    socket.emit('stateUpdate', newState);
  };

  if (!currentUser || !sessionId) {
    return <JoinForm onJoin={handleJoin} />;
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* Red Festive Header */}
      <header className="bg-red-700 text-white p-3 shadow-lg z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">🧧</span>
            <h1 className="text-2xl font-black italic tracking-tighter">Lô Tô</h1>
            <div className="bg-white/20 px-3 py-1 rounded-lg border border-white/20 flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold opacity-70">Mã Phòng:</span>
              <span className="text-sm font-mono font-black tracking-widest text-yellow-300 select-all">{sessionId}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm font-bold">
             <div className="bg-red-800/50 px-3 py-1 rounded-full flex items-center gap-2 border border-red-500/30">
                <span className="text-yellow-400">🧧</span>
                <span className="hidden sm:inline">Chúc Mừng Năm Mới</span> 🎉
             </div>
             <button 
                onClick={() => window.location.reload()}
                className="opacity-70 hover:opacity-100 transition-opacity bg-black/10 px-3 py-1 rounded"
              >
                Thoát
             </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 1-90 Board (takes 8 columns) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <Board 
            calledNumbers={gameState.numbers} 
            currentNumber={gameState.currentNumber} 
          />
          
          {/* Participants integrated as a small bar or side block */}
          <div className="bg-white/50 rounded-xl p-3 border border-slate-200 flex items-center gap-4 overflow-x-auto no-scrollbar shadow-sm">
             <span className="text-xs font-bold text-slate-400 uppercase shrink-0">Đang chơi ({gameState.participants.length}):</span>
             <div className="flex gap-4">
               {gameState.participants.map(p => (
                 <div key={p.id} className={`flex items-center gap-1 shrink-0 ${p.id === currentUser.id ? 'text-red-600 font-bold' : 'text-slate-600'} text-sm`}>
                   <div className={`w-2 h-2 rounded-full ${p.id === currentUser.id ? 'bg-red-500' : 'bg-slate-300'}`}></div>
                   {p.isHost && <span className="text-[10px] bg-yellow-400 text-yellow-900 px-1 rounded font-black mr-0.5">Host</span>}
                   {p.name}
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Right: Controls & Info (takes 4 columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <ControlPanel 
            gameState={gameState}
            sessionId={sessionId}
            isHost={currentUser.isHost}
            isAutoMode={isAutoMode}
            isVoiceOn={isVoiceOn}
            autoSpeed={autoSpeed}
            timeLeft={timeLeft}
            onNext={generateNextNumber}
            onReset={resetGame}
            onToggleAuto={() => setIsAutoMode(!isAutoMode)}
            onToggleVoice={() => setIsVoiceOn(!isVoiceOn)}
            onSpeedChange={(val) => setAutoSpeed(val)}
          />
        </div>
      </main>
      
      {/* Footer Info */}
      <footer className="text-center p-4 text-xs text-slate-400 font-medium">
        Lô Tô Live &copy; {new Date().getFullYear()} - Chúc mừng năm mới an khang thịnh vượng!
      </footer>
    </div>
  );
};

export default App;

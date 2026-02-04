
import React from 'react';

interface BoardProps {
  calledNumbers: number[];
  currentNumber: number | null;
}

const Board: React.FC<BoardProps> = ({ calledNumbers, currentNumber }) => {
  const numbers = Array.from({ length: 90 }, (_, i) => i + 1);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-loto border border-[#e5e0d4] flex-1">
      <div className="loto-grid">
        {numbers.map(num => {
          const isCalled = calledNumbers.includes(num);
          const isCurrent = currentNumber === num;
          
          return (
            <div 
              key={num}
              className={`
                aspect-square flex items-center justify-center text-base sm:text-lg font-black rounded-lg transition-all duration-300
                ${isCurrent 
                  ? 'bg-yellow-400 text-red-700 scale-110 shadow-lg ring-4 ring-yellow-200 z-10' 
                  : isCalled 
                    ? 'bg-red-600 text-white border border-red-700 shadow-inner' 
                    : 'bg-[#efecdf] text-[#8c7e6c] border border-[#e5e0d4] hover:bg-white hover:border-red-200 cursor-default'}
              `}
            >
              {num}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Board;

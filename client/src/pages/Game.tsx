import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";
import ScratchCard from "@/components/ScratchCard";

interface ScratchCard {
  id: number;
  isWinner: boolean;
  scratches: boolean[];
  prizes: string[];
  prizeValues: string[];
}

export default function Game() {
  const [, setLocation] = useLocation();
  const [cards, setCards] = useState<ScratchCard[]>([
    { 
      id: 1, 
      isWinner: false, 
      scratches: new Array(9).fill(false), 
      prizes: [
        "Free Standing Refrigerator", "Master Bathroom Sink", "Washer", 
        "Refrigerator New Water Line", "New Hot Water Valve & Line", "New Hot & Cold Water Lines",
        "Dishwasher New Water Valve", "Kitchen Sink New Cold Water", "Cooktop, Range, or Stove"
      ],
      prizeValues: ["$197", "$397", "$247", "$197", "$397", "$247", "$197", "$397", "$339"]
    },
    { 
      id: 2, 
      isWinner: true, 
      scratches: new Array(9).fill(false), 
      prizes: [
        "Dishwasher New Water Valve Installation", "Dishwasher New Water Valve Installation", "Dishwasher New Water Valve Installation",
        "Dishwasher New Water Valve Installation", "Dishwasher New Water Valve Installation", "Dishwasher New Water Valve Installation",
        "Dishwasher New Water Valve Installation", "Dishwasher New Water Valve Installation", "Dishwasher New Water Valve Installation"
      ],
      prizeValues: ["$197", "$197", "$197", "$197", "$197", "$197", "$197", "$197", "$197"]
    },
  ]);
  const [gameComplete, setGameComplete] = useState(false);

  const handleScratch = (cardId: number, index: number) => {
    setCards(prev => 
      prev.map(card => {
        if (card.id === cardId) {
          const newScratches = [...card.scratches];
          newScratches[index] = true;
          return { ...card, scratches: newScratches };
        }
        return card;
      })
    );
    
    // Check if all cards are fully scratched
    const allFullyScratched = cards.every(card => 
      card.id === cardId ? card.scratches.every((_, i) => i === index || card.scratches[i]) : 
      card.scratches.every(scratch => scratch)
    );
    
    if (allFullyScratched) {
      setTimeout(() => setGameComplete(true), 1000);
    }
  };

  const resetGame = () => {
    setCards([
      { 
        id: 1, 
        isWinner: false, 
        scratches: new Array(9).fill(false), 
        prizes: [
          "Free Standing Refrigerator", "Master Bathroom Sink", "Washer", 
          "Refrigerator New Water Line", "New Hot Water Valve & Line", "New Hot & Cold Water Lines",
          "Dishwasher New Water Valve", "Kitchen Sink New Cold Water", "Cooktop, Range, or Stove"
        ],
        prizeValues: ["$197", "$397", "$247", "$197", "$397", "$247", "$197", "$397", "$339"]
      },
      { 
        id: 2, 
        isWinner: true, 
        scratches: new Array(9).fill(false), 
        prizes: [
          "Dishwasher New Water Valve Installation", "Dishwasher New Water Valve Installation", "Dishwasher New Water Valve Installation",
          "Dishwasher New Water Valve Installation", "Dishwasher New Water Valve Installation", "Dishwasher New Water Valve Installation",
          "Dishwasher New Water Valve Installation", "Dishwasher New Water Valve Installation", "Dishwasher New Water Valve Installation"
        ],
        prizeValues: ["$197", "$197", "$197", "$197", "$197", "$197", "$197", "$197", "$197"]
      },
    ]);
    setGameComplete(false);
  };

  const isCardFullyScratched = (card: ScratchCard) => {
    return card.scratches.every(scratch => scratch);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section - Exact match to your design */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 px-4 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center">
            <img 
              src="/logo.png" 
              alt="Done For You Pros" 
              className="h-12 md:h-16 w-auto"
            />
          </div>
          <div className="text-white font-bold text-xl md:text-3xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <span className="text-white text-2xl md:text-4xl">$5 MILLION</span>
            <span className="text-black ml-2 text-lg md:text-xl">INSTANT PRIZES</span>
          </div>
        </div>
      </div>

      {/* Game Title Section */}
      <div className="bg-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-7xl font-bold text-orange-500 mb-2 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            IT'S TIME TO PLAY OUR SCRATCH &<br/>WIN GAME
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-blue-600 mt-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            2 CHANCES TO WIN AMAZING PRIZES!
          </h2>
        </div>
      </div>

      {/* Game Cards Section */}
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            {cards.map((card) => (
              <ScratchOffCard
                key={card.id}
                card={card}
                onScratch={handleScratch}
                isFullyScratched={isCardFullyScratched(card)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 py-2">
        <div className="bg-black text-white py-4 text-center">
          <p className="text-lg md:text-xl font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Our 20 Connection New Parts Installations Program
          </p>
          <p className="text-lg md:text-xl font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            is already Protecting 300,000+ Home Owners nationwide
          </p>
        </div>
      </div>

      {/* Navigation and Controls */}
      <div className="fixed bottom-4 left-4 right-4 flex justify-between items-center">
        <Button
          onClick={() => setLocation("/")}
          variant="outline"
          className="flex items-center space-x-2 bg-white"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Button>
        
        <Button
          onClick={resetGame}
          variant="outline"
          className="flex items-center space-x-2 bg-white"
        >
          <RotateCcw size={20} />
          <span>Reset Game</span>
        </Button>
      </div>

      {/* Winner Modal */}
      {gameComplete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg text-center max-w-md mx-4">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-4 text-green-600">Congratulations!</h3>
            <p className="text-lg mb-6">
              You won with the right card! You matched 3 "Dishwasher New Water Valve Installation" prizes!
            </p>
            <div className="flex space-x-4">
              <Button onClick={resetGame} className="flex-1">
                Play Again
              </Button>
              <Button onClick={() => setLocation("/")} variant="outline" className="flex-1">
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ScratchOffCardProps {
  card: ScratchCard;
  onScratch: (cardId: number, index: number) => void;
  isFullyScratched: boolean;
}

function ScratchOffCard({ card, onScratch, isFullyScratched }: ScratchOffCardProps) {
  const [scratchedCells, setScratchedCells] = useState<boolean[]>(card.scratches);
  
  const handleCellScratch = (index: number) => {
    const newScratched = [...scratchedCells];
    newScratched[index] = true;
    setScratchedCells(newScratched);
    onScratch(card.id, index);
  };

  useEffect(() => {
    setScratchedCells(card.scratches);
  }, [card.scratches]);

  return (
    <div className="flex justify-center">
      <div className="relative w-80 h-80 md:w-96 md:h-96 lg:w-[400px] lg:h-[400px]">
        {/* Colorful circular background - exact match to your design */}
        <div className="absolute inset-0 rounded-full" style={{
          background: `conic-gradient(from 0deg, 
            #ff6b35 0deg 45deg,
            #f7931e 45deg 90deg,
            #ffd700 90deg 135deg,
            #32cd32 135deg 180deg,
            #40e0d0 180deg 225deg,
            #4169e1 225deg 270deg,
            #8b00ff 270deg 315deg,
            #dc143c 315deg 360deg
          )`
        }}></div>

        {/* Inner content area */}
        <div className="absolute inset-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex flex-col items-center justify-center p-3 md:p-4">
          {/* Match 3 Header */}
          <div className="text-center mb-2 md:mb-3">
            <div className="flex items-center justify-center mb-1">
              <span className="text-white font-bold text-xl md:text-2xl lg:text-3xl mr-2" style={{ 
                fontFamily: 'Montserrat, sans-serif',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
              }}>
                MATCH
              </span>
              <div className="bg-yellow-400 rounded-full w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 flex items-center justify-center">
                <span className="text-white font-bold text-lg md:text-xl lg:text-2xl" style={{ 
                  fontFamily: 'Montserrat, sans-serif',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}>3</span>
              </div>
            </div>
            <p className="text-white font-bold text-sm md:text-lg lg:text-xl" style={{ 
              fontFamily: 'Montserrat, sans-serif',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}>
              & YOU WIN!
            </p>
          </div>

          {/* Scratch Grid */}
          <div className="grid grid-cols-3 gap-1 mb-3 md:mb-4">
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={index}
                className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 border-2 border-yellow-400 relative"
              >
                <ScratchCard
                  width={60}
                  height={60}
                  scratchPercent={25}
                  onScratchComplete={() => handleCellScratch(index)}
                  isScratched={scratchedCells[index]}
                >
                  <div className="w-full h-full bg-yellow-400 text-black flex items-center justify-center p-1">
                    <div className="text-center leading-tight w-full h-full flex flex-col justify-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      <div className="text-xs font-bold leading-tight">
                        {card.prizes[index].split(' ').slice(0, 2).join(' ')}
                      </div>
                      <div className="text-xs leading-tight">
                        {card.prizes[index].split(' ').slice(2, 4).join(' ')}
                      </div>
                      <div className="text-xs leading-tight">
                        {card.prizes[index].split(' ').slice(4).join(' ')}
                      </div>
                      <div className="text-xs font-bold">
                        {card.prizeValues[index]}
                      </div>
                    </div>
                  </div>
                </ScratchCard>
              </div>
            ))}
          </div>

          {/* Play Now Button */}
          <div className="bg-yellow-400 text-black font-bold py-2 px-4 md:px-6 rounded text-sm md:text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {isFullyScratched ? (card.isWinner ? 'WINNER!' : 'TRY AGAIN') : 'PLAY NOW'}
          </div>
        </div>
      </div>
    </div>
  );
}
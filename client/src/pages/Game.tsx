import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";

interface ScratchCard {
  id: number;
  isWinner: boolean;
  isScratched: boolean;
  prizes: string[];
}

export default function Game() {
  const [, setLocation] = useLocation();
  const [cards, setCards] = useState<ScratchCard[]>([
    { id: 1, isWinner: false, isScratched: false, prizes: [] },
    { id: 2, isWinner: true, isScratched: false, prizes: [
      "Dishwasher New Water Valve Installation",
      "Dishwasher New Water Valve Installation", 
      "Dishwasher New Water Valve Installation"
    ] },
  ]);
  const [gameComplete, setGameComplete] = useState(false);

  const handleScratch = (cardId: number) => {
    setCards(prev => 
      prev.map(card => 
        card.id === cardId 
          ? { ...card, isScratched: true }
          : card
      )
    );
    
    // Check if all cards are scratched
    const allScratched = cards.every(card => card.id === cardId || card.isScratched);
    if (allScratched) {
      setTimeout(() => setGameComplete(true), 1000);
    }
  };

  const resetGame = () => {
    setCards([
      { id: 1, isWinner: false, isScratched: false, prizes: [] },
      { id: 2, isWinner: true, isScratched: false, prizes: [
        "Dishwasher New Water Valve Installation",
        "Dishwasher New Water Valve Installation", 
        "Dishwasher New Water Valve Installation"
      ] },
    ]);
    setGameComplete(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section - Exact match to your design */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="text-white font-bold text-2xl md:text-3xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <span className="text-orange-600">DONE</span>
              <span className="text-blue-600 ml-2">FOR YOU PROS</span>
            </div>
          </div>
          <div className="text-white font-bold text-xl md:text-2xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <span className="text-white text-3xl md:text-4xl">$5 MILLION</span>
            <span className="text-black ml-2 text-xl">INSTANT PRIZES</span>
          </div>
        </div>
      </div>

      {/* Game Title Section */}
      <div className="bg-white py-6 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-orange-500 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            IT'S TIME TO PLAY OUR SCRATCH & WIN GAME
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-blue-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            2 CHANCES TO WIN AMAZING PRIZES!
          </h2>
        </div>
      </div>

      {/* Game Cards Section */}
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {cards.map((card) => (
              <ScratchOffCard
                key={card.id}
                card={card}
                onScratch={() => handleScratch(card.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 py-4">
        <div className="bg-black text-white py-3 text-center">
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
          className="flex items-center space-x-2"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Button>
        
        <Button
          onClick={resetGame}
          variant="outline"
          className="flex items-center space-x-2"
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
  onScratch: () => void;
}

function ScratchOffCard({ card, onScratch }: ScratchOffCardProps) {
  return (
    <div className="flex justify-center">
      <div className="relative w-80 h-80 md:w-96 md:h-96">
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
        <div className="absolute inset-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex flex-col items-center justify-center p-4">
          {/* Match 3 Header */}
          <div className="text-center mb-3">
            <div className="flex items-center justify-center mb-2">
              <span className="text-white font-bold text-3xl md:text-4xl mr-2" style={{ 
                fontFamily: 'Montserrat, sans-serif',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
              }}>
                MATCH
              </span>
              <div className="bg-yellow-400 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                <span className="text-white font-bold text-2xl md:text-3xl" style={{ 
                  fontFamily: 'Montserrat, sans-serif',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}>3</span>
              </div>
            </div>
            <p className="text-white font-bold text-xl md:text-2xl" style={{ 
              fontFamily: 'Montserrat, sans-serif',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}>
              & YOU WIN!
            </p>
          </div>

          {/* Scratch Grid */}
          <div className="grid grid-cols-3 gap-1 mb-4">
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={index}
                className={`w-14 h-14 md:w-16 md:h-16 border-2 border-yellow-400 flex items-center justify-center text-xs font-bold ${
                  card.isScratched 
                    ? (card.isWinner ? 'bg-yellow-400 text-black' : 'bg-gray-400 text-white')
                    : 'bg-gray-800 cursor-pointer hover:bg-gray-700'
                }`}
                style={{ fontFamily: 'Montserrat, sans-serif' }}
                onClick={!card.isScratched ? onScratch : undefined}
              >
                {card.isScratched && card.isWinner && (
                  <div className="text-center leading-tight p-1">
                    <div className="text-xs font-bold">Dishwasher</div>
                    <div className="text-xs">New Water Valve</div>
                    <div className="text-xs">Installation</div>
                    <div className="text-xs font-bold">$197</div>
                  </div>
                )}
                {card.isScratched && !card.isWinner && (
                  <div className="text-center leading-tight p-1">
                    <div className="text-xs font-bold">
                      {index % 3 === 0 ? 'Free Standing' : index % 3 === 1 ? 'Refrigerator' : 'Cooktop'}
                    </div>
                    <div className="text-xs">
                      {index % 3 === 0 ? 'Refrigerator' : index % 3 === 1 ? 'New Water Line' : 'Range Installation'}
                    </div>
                    <div className="text-xs">
                      {index % 3 === 0 ? 'New Water Line' : index % 3 === 1 ? 'Installation' : '$339'}
                    </div>
                    <div className="text-xs font-bold">
                      {index % 3 === 0 ? '$197' : index % 3 === 1 ? '$397' : 'value'}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Play Now Button */}
          <div className="bg-yellow-400 text-black font-bold py-2 px-6 rounded text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {card.isScratched ? (card.isWinner ? 'WINNER!' : 'TRY AGAIN') : 'PLAY NOW'}
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Trophy, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImage from "@assets/logo_1751279296203.png";

interface ScratchCard {
  id: number;
  isWinner: boolean;
  isScratched: boolean;
  prizes: string[];
}

export default function Game() {
  const [cards, setCards] = useState<ScratchCard[]>([
    {
      id: 1,
      isWinner: false,
      isScratched: false,
      prizes: []
    },
    {
      id: 2,
      isWinner: true,
      isScratched: false,
      prizes: [
        "Gas Dryer\nNew Gas Line\nInstallation\n$247 value",
        "Dishwasher\nNew Water Valve\nInstallation\n$197 value",
        "Dishwasher\nNew Water Valve\nInstallation\n$197 value"
      ]
    }
  ]);

  const [gameComplete, setGameComplete] = useState(false);

  const scratchCard = (cardId: number) => {
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isScratched: true } : card
    ));
    
    // Check if both cards are scratched
    const updatedCards = cards.map(card => 
      card.id === cardId ? { ...card, isScratched: true } : card
    );
    
    if (updatedCards.every(card => card.isScratched)) {
      setTimeout(() => setGameComplete(true), 1000);
    }
  };

  const resetGame = () => {
    setCards(prev => prev.map(card => ({ ...card, isScratched: false })));
    setGameComplete(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-yellow-400 to-orange-500">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-yellow-400 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <img src={logoImage} alt="Done For You Pros" className="h-12 w-auto" />
          <div className="text-right">
            <h1 className="text-2xl md:text-3xl font-black text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              $5 MILLION
            </h1>
            <p className="text-lg font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              INSTANT PRIZES
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Game Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            IT'S TIME TO PLAY OUR SCRATCH & WIN GAME
          </h2>
          <p className="text-xl md:text-2xl font-bold text-blue-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            2 CHANCES TO WIN AMAZING PRIZES!
          </p>
        </div>

        {/* Game Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-8">
          {cards.map((card) => (
            <ScratchOffCard
              key={card.id}
              card={card}
              onScratch={() => scratchCard(card.id)}
            />
          ))}
        </div>

        {/* Game Controls */}
        <div className="text-center space-y-4">
          {gameComplete && (
            <div className="bg-white rounded-xl p-6 max-w-2xl mx-auto shadow-2xl">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Trophy className="text-yellow-500" size={32} />
                <h3 className="text-2xl font-black text-green-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Congratulations!
                </h3>
                <Trophy className="text-yellow-500" size={32} />
              </div>
              <p className="text-lg text-gray-700 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {cards.some(card => card.isWinner && card.isScratched) 
                  ? "You won the New Dishwasher Water Valve Installation! We'll contact you soon to schedule your prize."
                  : "Thank you for playing! Better luck next time!"}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={resetGame}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <RotateCcw className="mr-2" size={20} />
              Play Again
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <Home className="mr-2" size={20} />
              Back to Home
            </Button>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-12 bg-black text-white py-6 rounded-xl">
          <p className="text-lg md:text-xl font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Our 20 Connection New Parts Installations Program<br />
            is already Protecting 300,000+ Home Owners nationwide
          </p>
        </div>
      </div>
    </div>
  );
}

interface ScratchOffCardProps {
  card: ScratchCard;
  onScratch: () => void;
}

function ScratchOffCard({ card, onScratch }: ScratchOffCardProps) {
  return (
    <div className="relative">
      {/* Card Background - Colorful Circle */}
      <div className="relative w-full aspect-square max-w-md mx-auto">
        {/* Colorful background circle */}
        <div className="absolute inset-0 rounded-full overflow-hidden shadow-2xl">
          {/* Color segments */}
          <div className="absolute inset-0 rounded-full" style={{
            background: `conic-gradient(
              from 0deg,
              #ff6b35 0deg 45deg,
              #ffd23f 45deg 90deg,
              #06ffa5 90deg 135deg,
              #4ecdc4 135deg 180deg,
              #45b7d1 180deg 225deg,
              #96ceb4 225deg 270deg,
              #feca57 270deg 315deg,
              #ff9ff3 315deg 360deg
            )`
          }}>
            {/* Inner purple/red gradient overlay */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-600 via-red-500 to-purple-800 flex flex-col items-center justify-center text-white">
              {/* Match 3 header */}
              <div className="text-center mb-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <h3 className="text-2xl md:text-3xl font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    MATCH
                  </h3>
                  <div className="bg-yellow-400 text-black rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-black text-xl">
                    3
                  </div>
                </div>
                <p className="text-lg md:text-xl font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  & YOU WIN!
                </p>
              </div>

              {/* Scratch area */}
              <div className="relative">
                {!card.isScratched ? (
                  /* Scratch overlay */
                  <div 
                    className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition-colors"
                    onClick={onScratch}
                  >
                    <div className="grid grid-cols-3 gap-1 mb-4">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="w-8 h-6 md:w-10 md:h-8 bg-gray-800 rounded border border-yellow-400"></div>
                      ))}
                    </div>
                    <Button 
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black py-2 text-sm md:text-base"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      PLAY NOW
                    </Button>
                  </div>
                ) : (
                  /* Revealed prizes */
                  <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg p-4 text-black">
                    {card.isWinner ? (
                      <div className="grid grid-cols-3 gap-1 mb-4">
                        {/* Winning prizes */}
                        <div className="text-xs p-1 bg-black text-white rounded text-center">
                          Free Standing<br/>Refrigerator<br/>New Water Line<br/>Installation<br/>$197 <span className="text-xs">value</span>
                        </div>
                        <div className="text-xs p-1 bg-black text-white rounded text-center">
                          Master<br/>Bathroom Sink<br/>New Hot Water<br/>Valve & Line<br/>Installation<br/>$397 <span className="text-xs">value</span>
                        </div>
                        <div className="text-xs p-1 bg-black text-white rounded text-center">
                          Washer<br/>New Hot & Cold<br/>Water Lines<br/>Installation<br/>$247 <span className="text-xs">value</span>
                        </div>
                        <div className="text-xs p-1 bg-black text-yellow-400 rounded text-center font-bold">
                          Gas Dryer<br/>New Gas Line<br/>Installation<br/>$247 <span className="text-xs">value</span>
                        </div>
                        <div className="text-xs p-1 bg-black text-yellow-400 rounded text-center font-bold">
                          Dishwasher<br/>New Water Valve<br/>Installation<br/>$197 <span className="text-xs">value</span>
                        </div>
                        <div className="text-xs p-1 bg-black text-yellow-400 rounded text-center font-bold">
                          Dishwasher<br/>New Water Valve<br/>Installation<br/>$197 <span className="text-xs">value</span>
                        </div>
                        <div className="text-xs p-1 bg-black text-white rounded text-center">
                          Master<br/>Bathroom Sink<br/>New Hot Water<br/>Valve & Line<br/>Installation<br/>$397 <span className="text-xs">value</span>
                        </div>
                        <div className="text-xs p-1 bg-black text-white rounded text-center">
                          Over The Range<br/>Microwave & Hood<br/>Venting Resized<br/>Pro Style<br/>$167 <span className="text-xs">value</span>
                        </div>
                        <div className="text-xs p-1 bg-black text-white rounded text-center">
                          New Water Valve<br/>Installation<br/>$197 <span className="text-xs">value</span>
                        </div>
                      </div>
                    ) : (
                      /* Non-winning prizes */
                      <div className="grid grid-cols-3 gap-1 mb-4">
                        {[...Array(9)].map((_, i) => (
                          <div key={i} className="text-xs p-1 bg-black text-white rounded text-center">
                            Various<br/>Services<br/>Available<br/>$197 <span className="text-xs">value</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="text-center">
                      <p className="font-black text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {card.isWinner ? "🎉 WINNER! 🎉" : "Try Again!"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
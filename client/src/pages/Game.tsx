import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import ScratchCard from "@/components/ScratchCard";
import logoPath from "@assets/logo_1751279296203.png";

interface ScratchCardData {
  id: number;
  isWinner: boolean;
  scratches: boolean[];
  prizes: string[];
  prizeValues: string[];
}

export default function Game() {
  // Add custom font style for game page
  const wayComeFontStyle = {
    fontFamily: "WayCome, sans-serif",
    fontWeight: "bold",
  };

  // Add font face to the page
  const fontFaceCSS = `
    @font-face {
      font-family: 'WayCome';
      src: url('/WayCome.otf') format('opentype');
      font-weight: normal;
      font-style: normal;
    }
  `;

  // Inject CSS
  if (typeof document !== "undefined") {
    const existingStyle = document.getElementById("way-come-font");
    if (!existingStyle) {
      const style = document.createElement("style");
      style.id = "way-come-font";
      style.textContent = fontFaceCSS;
      document.head.appendChild(style);
    }
  }
  
  const [, setLocation] = useLocation();
  const [gameStarted, setGameStarted] = useState(true); // Start game directly
  const [showConfetti, setShowConfetti] = useState(false);
  const [cards, setCards] = useState<ScratchCardData[]>([
    {
      id: 1,
      isWinner: false,
      scratches: new Array(9).fill(false),
      prizes: [
        "Free Standing Refrigerator New Water Line Installation",
        "Master Bathroom Sink New Hot Water Valve & Line Installation", 
        "Washer New Hot & Cold Water Lines Installation",
        "Dishwasher New Water Valve Installation",
        "Kitchen Sink New Hot Water Valve & Line Installation",
        "Cooktop, Range, or Stove New Gas Line Installation",
        "Garbage Disposal New Drain Hose Installation",
        "Dishwasher New Air Cap Installation",
        "Master Bathroom Sink New Cold Water Valve & Line Installation",
      ],
      prizeValues: [
        "$197value",
        "$397value", 
        "$247value",
        "$197value",
        "$397value",
        "$197value",
        "$147value",
        "$197value",
        "$397value",
      ],
    },
    {
      id: 2,
      isWinner: true,
      scratches: new Array(9).fill(false),
      prizes: [
        "Gas Dryer New Gas Line Installation",
        "Dishwasher New Water Valve Installation", 
        "Dishwasher New Water Valve Installation",
        "Master Bathroom Sink New Hot Water Valve & Line Installation",
        "Over The Range Microwave & Hood Venting Retaped Pro Style",
        "Dishwasher New Water Valve Installation",
        "Kitchen Sink New Cold Water Valve & Line Installation",
        "Washer New Hot & Cold Water Lines Installation",
        "Free Standing Refrigerator New Water Line Installation",
      ],
      prizeValues: [
        "$247value",
        "$197value",
        "$197value",
        "$397value",
        "$147value",
        "$197value",
        "$397value",
        "$247value",
        "$197value",
      ],
    },
  ]);
  const [gameComplete, setGameComplete] = useState(false);
  const [winnerCard, setWinnerCard] = useState<ScratchCardData | null>(null);

  // Confetti component
  const Confetti = () => {
    const confettiPieces = Array.from({ length: 100 }, (_, i) => {
      const colors = ['#2C5CDC', '#F76D46', '#FFD700', '#FF6B6B', '#4ECDC4'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 10 + 5;
      const leftPos = Math.random() * 100;
      const animationDelay = Math.random() * 3;
      const animationDuration = 3 + Math.random() * 2;
      
      return (
        <div
          key={i}
          className="absolute animate-bounce"
          style={{
            left: `${leftPos}%`,
            top: '-20px',
            backgroundColor: color,
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
            animationDelay: `${animationDelay}s`,
            animationDuration: `${animationDuration}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `confetti-fall ${animationDuration}s ease-out ${animationDelay}s forwards`,
          }}
        />
      );
    });
    
    return (
      <div className="fixed inset-0 pointer-events-none z-40">
        <style>{`
          @keyframes confetti-fall {
            0% {
              transform: translateY(-100vh) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
        `}</style>
        {confettiPieces}
      </div>
    );
  };



  const handleScratch = (cardId: number, index: number) => {
    setCards((prev) =>
      prev.map((card) => {
        if (card.id === cardId) {
          const newScratches = [...card.scratches];
          newScratches[index] = true;
          return { ...card, scratches: newScratches };
        }
        return card;
      }),
    );

    // Check if this specific card is fully scratched
    const updatedCard = cards.find(card => card.id === cardId);
    if (updatedCard) {
      const cardFullyScratched = updatedCard.scratches.every((_, i) => i === index || updatedCard.scratches[i]);
      
      // If it's the second card (winner card) and it's fully scratched
      if (cardId === 2 && cardFullyScratched) {
        // Check for three matching "Dishwasher" prizes
        const dishwasherCount = updatedCard.prizes.filter(prize => 
          prize.includes("Dishwasher New Water Valve Installation")
        ).length;
        
        if (dishwasherCount >= 3) {
          setWinnerCard(updatedCard);
          setShowConfetti(true);
          setTimeout(() => setGameComplete(true), 1000);
          // Stop confetti after 5 seconds
          setTimeout(() => setShowConfetti(false), 5000);
        }
      } else if (cardId === 1 && cardFullyScratched) {
        // First card is not a winner, check if both cards are done
        const bothCardsDone = cards.every(card => isCardFullyScratched(card));
        if (bothCardsDone) {
          setTimeout(() => setGameComplete(true), 1000);
        }
      }
    }
  };

  const handleCardScratchComplete = (cardId: number) => {
    const card = cards.find(c => c.id === cardId);
    if (card && card.isWinner) {
      setWinnerCard(card);
      setTimeout(() => setGameComplete(true), 500);
    }
  };

  const resetGame = () => {
    setCards([
      {
        id: 1,
        isWinner: false,
        scratches: new Array(9).fill(false),
        prizes: [
          "Free Standing Refrigerator New Water Line Installation",
          "Master Bathroom Sink New Hot Water Valve & Line Installation", 
          "Washer New Hot & Cold Water Lines Installation",
          "Dishwasher New Water Valve Installation",
          "Kitchen Sink New Hot Water Valve & Line Installation",
          "Cooktop, Range, or Stove New Gas Line Installation",
          "Garbage Disposal New Drain Hose Installation",
          "Dishwasher New Air Cap Installation",
          "Master Bathroom Sink New Cold Water Valve & Line Installation",
        ],
        prizeValues: [
          "$197value",
          "$397value", 
          "$247value",
          "$197value",
          "$397value",
          "$197value",
          "$147value",
          "$197value",
          "$397value",
        ],
      },
      {
        id: 2,
        isWinner: true,
        scratches: new Array(9).fill(false),
        prizes: [
          "Gas Dryer New Gas Line Installation",
          "Dishwasher New Water Valve Installation", 
          "Dishwasher New Water Valve Installation",
          "Master Bathroom Sink New Hot Water Valve & Line Installation",
          "Over The Range Microwave & Hood Venting Retaped Pro Style",
          "Dishwasher New Water Valve Installation",
          "Kitchen Sink New Cold Water Valve & Line Installation",
          "Washer New Hot & Cold Water Lines Installation",
          "Free Standing Refrigerator New Water Line Installation",
        ],
        prizeValues: [
          "$247value",
          "$197value",
          "$197value",
          "$397value",
          "$147value",
          "$197value",
          "$397value",
          "$247value",
          "$197value",
        ],
      },
    ]);
    setGameComplete(false);
    setWinnerCard(null);
  };

  const isCardFullyScratched = (card: ScratchCardData) => {
    return card.scratches.every((scratch) => scratch);
  };

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        /* Default desktop sizes */
        .prize-text-line1 {
          font-size: 6px;
        }
        .prize-text-line2, .prize-text-line3 {
          font-size: 5px;
        }
        .prize-text-value {
          font-size: 6px;
        }
        
        /* Mobile sizes - even smaller */
        @media (max-width: 768px) {
          .prize-text-line1 {
            font-size: 4px;
          }
          .prize-text-line2, .prize-text-line3 {
            font-size: 3px;
          }
          .prize-text-value {
            font-size: 4px;
          }
        }
        
        /* Extra small mobile */
        @media (max-width: 480px) {
          .prize-text-line1 {
            font-size: 3px;
          }
          .prize-text-line2, .prize-text-line3 {
            font-size: 2.5px;
          }
          .prize-text-value {
            font-size: 3px;
          }
        }
      `}</style>
      {/* Header Section with Logo */}
      <div className="px-4 py-4" style={{ backgroundColor: "#ffb22a" }}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center">
            <div className="bg-white p-2 rounded-lg">
              <img
                src={logoPath}
                alt="Done For You Pros"
                className="h-16 md:h-20 w-auto"
              />
            </div>
          </div>
          <div className="text-right">
            <h2
              className="text-lg md:text-2xl lg:text-3xl font-bold text-white"
              style={{
                ...wayComeFontStyle,
                textShadow: "3px 3px 6px rgba(0,0,0,0.7)",
                letterSpacing: "1px",
              }}
            >
              $5 MILLION <span style={{ color: "#000", textShadow: "2px 2px 4px rgba(255,255,255,0.8)" }}>INSTANT PRIZES</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Game Introduction Section */}
      <div className="text-center py-8 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2"
            style={{
              ...wayComeFontStyle,
              color: "#F76D46",
              letterSpacing: "2px",
              lineHeight: "1.1",
            }}
          >
            IT'S TIME TO PLAY OUR SCRATCH &
          </h1>
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            style={{
              ...wayComeFontStyle,
              color: "#F76D46",
              letterSpacing: "2px",
              lineHeight: "1.1",
            }}
          >
            WIN GAME
          </h1>
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold"
            style={{
              ...wayComeFontStyle,
              color: "#2C5CDC",
              letterSpacing: "1px",
            }}
          >
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
                onScratchComplete={() => handleCardScratchComplete(card.id)}
                isFullyScratched={isCardFullyScratched(card)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="py-2" style={{ backgroundColor: "#ffb22a" }}>
        <div className="bg-black text-white py-4 text-center">
          <p
            className="text-lg md:text-xl font-bold"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Our 20 Connection New Parts Installations Program
          </p>
          <p
            className="text-lg md:text-xl font-bold"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            is already Protecting 300,000+ Home Owners nationwide
          </p>
        </div>
      </div>

      {/* Winner Modal */}
      {gameComplete && winnerCard && (
        <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-blue-500 to-orange-500 p-4 rounded-3xl max-w-lg w-full mx-4 shadow-2xl">
            <div className="bg-white rounded-2xl p-6 text-center relative overflow-hidden">
              
              <div className="relative z-10">
                {/* Trophy and celebration */}
                <div className="text-6xl mb-4 animate-bounce">🏆</div>
                <div className="text-4xl mb-4">🎉 🎊 🎉</div>
                
                <h3 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-red-600" style={wayComeFontStyle}>
                  WINNER!
                </h3>
                
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl mb-6 shadow-inner border-2 border-green-200">
                  <h4 className="text-2xl font-bold mb-3 text-green-800" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    🎁 CONGRATULATIONS!
                  </h4>
                  <p className="text-xl font-semibold text-blue-600 mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    You matched 3 "Dishwasher New Water Valve Installation" prizes!
                  </p>
                  <p className="text-3xl font-bold text-green-600" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    TOTAL VALUE: $591
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl mb-6 shadow-lg">
                  <h4 className="text-2xl font-bold mb-3" style={wayComeFontStyle}>
                    🔥 CLAIM YOUR PRIZE NOW!
                  </h4>
                  <p className="text-lg mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    Call Done For You Pros immediately to schedule your FREE professional installation:
                  </p>
                  <a 
                    href="tel:+1234567890" 
                    className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl text-2xl transform transition-all duration-200 hover:scale-105 shadow-lg"
                    style={wayComeFontStyle}
                  >
                    📞 CALL NOW: (123) 456-7890
                  </a>
                  <p className="text-sm mt-3 text-blue-100" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    ⏰ Limited time offer - Call within 24 hours!
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={resetGame} 
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg text-lg border-2 border-yellow-600"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Play Again
                  </Button>
                  <Button
                    onClick={() => setLocation("/")}
                    variant="outline"
                    className="flex-1 border-2 border-gray-400 hover:border-gray-600 text-gray-700 hover:text-gray-900 font-bold py-3 px-6 rounded-lg text-lg"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Back to Home
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confetti */}
      {showConfetti && <Confetti />}

      {/* Non-Winner Modal */}
      {gameComplete && !winnerCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg text-center max-w-md mx-4">
            <div className="text-6xl mb-4">😢</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-600" style={wayComeFontStyle}>
              Try Again!
            </h3>
            <p className="text-lg mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
              No winning matches this time, but you can try again!
            </p>
            <div className="flex space-x-4">
              <Button onClick={resetGame} className="flex-1">
                Play Again
              </Button>
              <Button
                onClick={() => setLocation("/")}
                variant="outline"
                className="flex-1"
              >
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
  card: ScratchCardData;
  onScratch: (cardId: number, index: number) => void;
  onScratchComplete?: () => void;
  isFullyScratched: boolean;
}

function ScratchOffCard({
  card,
  onScratch,
  onScratchComplete,
  isFullyScratched,
}: ScratchOffCardProps) {
  // Add custom font style for game page
  const wayComeFontStyle = {
    fontFamily: "WayCome, sans-serif",
    fontWeight: "bold",
  };

  const [scratchedCells, setScratchedCells] = useState<boolean[]>(
    card.scratches,
  );

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
        {/* Colorful circular background - using your wheel image */}
        <div
          className="absolute inset-0 rounded-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/wheel-background.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        {/* Inner content area */}
        <div className="absolute inset-4  rounded-full flex flex-col items-center justify-center p-3 md:p-4">
          {/* Match 3 Header */}
          <div className="text-center mb-2 md:mb-3">
            <div className="flex items-center justify-center mb-1">
              <span
                className="text-white font-bold text-xl md:text-2xl lg:text-3xl mr-2"
                style={{
                  ...wayComeFontStyle,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                }}
              >
                MATCH
              </span>
              <div className="bg-yellow-400 rounded-full w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 flex items-center justify-center">
                <span
                  className="text-white font-bold text-lg md:text-xl lg:text-2xl"
                  style={{
                    ...wayComeFontStyle,
                    textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                  }}
                >
                  3
                </span>
              </div>
            </div>
            <p
              className="text-white font-bold text-sm md:text-lg lg:text-xl"
              style={{
                ...wayComeFontStyle,
                textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
              }}
            >
              & YOU WIN!
            </p>
          </div>

          {/* Scratch Grid */}
          <div className="grid grid-cols-3 gap-1 mb-3 md:mb-4">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 border-2 border-yellow-400 relative overflow-hidden">
                {scratchedCells[index] ? (
                  <div className="w-full h-full bg-yellow-400 text-black flex items-center justify-center p-0.5 overflow-hidden">
                    <div
                      className="text-center w-full h-full flex flex-col justify-center"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      <div className="text-center p-0.5 w-full h-full flex flex-col justify-center items-center">
                        <div className="prize-text-line1 font-bold leading-none mb-0.5 max-w-full break-words">
                          {card.prizes[index].split(' ').slice(0, 2).join(' ')}
                        </div>
                        <div className="prize-text-line2 leading-none mb-0.5 max-w-full break-words">
                          {card.prizes[index].split(' ').slice(2, 5).join(' ')}
                        </div>
                        <div className="prize-text-line3 leading-none mb-0.5 max-w-full break-words">
                          {card.prizes[index].split(' ').slice(5).join(' ')}
                        </div>
                        <div className="prize-text-value font-bold text-green-600 leading-none max-w-full">
                          {card.prizeValues[index]}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <ScratchCard
                    width={56} // w-14 = 56px
                    height={56}
                    scratchPercent={40}
                    onScratchComplete={() => handleCellScratch(index)}
                  >
                    <div className="w-full h-full bg-yellow-400 text-black flex items-center justify-center p-0.5 overflow-hidden">
                      <div
                        className="text-center w-full h-full flex flex-col justify-center"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        <div className="text-center p-0.5 w-full h-full flex flex-col justify-center items-center">
                          <div className="prize-text-line1 font-bold leading-none mb-0.5 max-w-full break-words">
                            {card.prizes[index].split(' ').slice(0, 2).join(' ')}
                          </div>
                          <div className="prize-text-line2 leading-none mb-0.5 max-w-full break-words">
                            {card.prizes[index].split(' ').slice(2, 5).join(' ')}
                          </div>
                          <div className="prize-text-line3 leading-none mb-0.5 max-w-full break-words">
                            {card.prizes[index].split(' ').slice(5).join(' ')}
                          </div>
                          <div className="prize-text-value font-bold text-green-600 leading-none max-w-full">
                            {card.prizeValues[index]}
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScratchCard>
                )}
              </div>
            ))}
          </div>

          {/* Play Now Button */}
          <div
            className="bg-yellow-400 text-black font-bold py-1 px-4 md:px-6 rounded text-sm md:text-lg"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {isFullyScratched
              ? card.isWinner
                ? "WINNER!"
                : "TRY AGAIN"
              : "PLAY NOW"}
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

interface ScratchCard {
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
  const [currentCard, setCurrentCard] = useState(0); // Track which card is currently playable
  const [cards, setCards] = useState<ScratchCard[]>([
    {
      id: 1,
      isWinner: false,
      scratches: new Array(9).fill(false),
      prizes: [
        "Free Standing Refrigerator",
        "Master Bathroom Sink",
        "Washer",
        "Refrigerator New Water Line",
        "New Hot Water Valve & Line",
        "New Hot & Cold Water Lines",
        "Dishwasher New Water Valve",
        "Kitchen Sink New Cold Water",
        "Cooktop, Range, or Stove",
      ],
      prizeValues: [
        "$197",
        "$397",
        "$247",
        "$197",
        "$397",
        "$247",
        "$197",
        "$397",
        "$339",
      ],
    },
    {
      id: 2,
      isWinner: true,
      scratches: new Array(9).fill(false),
      prizes: [
        "Dishwasher New Water Valve Installation",
        "Dishwasher New Water Valve Installation",
        "Dishwasher New Water Valve Installation",
        "Dishwasher New Water Valve Installation",
        "Dishwasher New Water Valve Installation",
        "Dishwasher New Water Valve Installation",
        "Dishwasher New Water Valve Installation",
        "Dishwasher New Water Valve Installation",
        "Dishwasher New Water Valve Installation",
      ],
      prizeValues: [
        "$197",
        "$197",
        "$197",
        "$197",
        "$197",
        "$197",
        "$197",
        "$197",
        "$197",
      ],
    },
  ]);
  const [gameComplete, setGameComplete] = useState(false);

  const handleScratch = (cardId: number, index: number) => {
    // Only allow scratching the current card
    if (cardId !== currentCard + 1) return;
    
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

    // Check if current card is fully scratched
    const currentCardData = cards.find(card => card.id === cardId);
    if (currentCardData) {
      const newScratches = [...currentCardData.scratches];
      newScratches[index] = true;
      const isCurrentCardComplete = newScratches.every(scratch => scratch);
      
      if (isCurrentCardComplete) {
        setTimeout(() => {
          if (currentCard === 0) {
            // Move to second card
            setCurrentCard(1);
          } else {
            // Both cards complete, show winner modal
            setGameComplete(true);
          }
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setCards([
      {
        id: 1,
        isWinner: false,
        scratches: new Array(9).fill(false),
        prizes: [
          "Free Standing Refrigerator",
          "Master Bathroom Sink",
          "Washer",
          "Refrigerator New Water Line",
          "New Hot Water Valve & Line",
          "New Hot & Cold Water Lines",
          "Dishwasher New Water Valve",
          "Kitchen Sink New Cold Water",
          "Cooktop, Range, or Stove",
        ],
        prizeValues: [
          "$197",
          "$397",
          "$247",
          "$197",
          "$397",
          "$247",
          "$197",
          "$397",
          "$339",
        ],
      },
      {
        id: 2,
        isWinner: true,
        scratches: new Array(9).fill(false),
        prizes: [
          "Dishwasher New Water Valve Installation",
          "Dishwasher New Water Valve Installation",
          "Dishwasher New Water Valve Installation",
          "Dishwasher New Water Valve Installation",
          "Dishwasher New Water Valve Installation",
          "Dishwasher New Water Valve Installation",
          "Dishwasher New Water Valve Installation",
          "Dishwasher New Water Valve Installation",
          "Dishwasher New Water Valve Installation",
        ],
        prizeValues: [
          "$197",
          "$197",
          "$197",
          "$197",
          "$197",
          "$197",
          "$197",
          "$197",
          "$197",
        ],
      },
    ]);
    setCurrentCard(0);
    setGameComplete(false);
  };

  const isCardFullyScratched = (card: ScratchCard) => {
    return card.scratches.every((scratch) => scratch);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section - Reduced height and responsive */}
      <div className="px-4 py-2 md:py-3" style={{ backgroundColor: "#ffb22a" }}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center">
            <div className="bg-white p-1 md:p-2 rounded-lg">
              <img
                src="/logo.png"
                alt="Done For You Pros"
                className="h-10 md:h-14 w-auto"
              />
            </div>
          </div>
          <div
            className="text-white font-bold flex flex-col md:flex-row items-center md:items-baseline"
            style={wayComeFontStyle}
          >
            <span className="text-white text-lg md:text-3xl">$5 MILLION</span>
            <span className="text-black md:ml-2 text-sm md:text-xl">
              INSTANT PRIZES
            </span>
          </div>
        </div>
      </div>

      {/* Game Title Section */}
      <div className="bg-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1
            className="text-3xl md:text-5xl font-bold mb-2 leading-tight"
            style={{ ...wayComeFontStyle, color: "#f76c46" }}
          >
            IT'S TIME TO PLAY OUR SCRATCH &<br />
            WIN GAME
          </h1>
          <h2
            className="text-2xl md:text-4xl font-bold mt-4"
            style={{ ...wayComeFontStyle, color: "#2b5bdc" }}
          >
            2 CHANCES TO WIN AMAZING PRIZES!
          </h2>
        </div>
      </div>

      {/* Game Cards Section */}
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            {cards.map((card, index) => (
              <ScratchOffCard
                key={card.id}
                card={card}
                onScratch={handleScratch}
                isFullyScratched={isCardFullyScratched(card)}
                isPlayable={index === currentCard}
                isNextCard={index === currentCard + 1}
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
      {gameComplete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg text-center max-w-md mx-4">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-4 text-green-600">
              Congratulations!
            </h3>
            <p className="text-lg mb-6">
              You won with the right card! You matched 3 "Dishwasher New Water
              Valve Installation" prizes!
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
  card: ScratchCard;
  onScratch: (cardId: number, index: number) => void;
  isFullyScratched: boolean;
  isPlayable: boolean;
  isNextCard: boolean;
}

function ScratchOffCard({
  card,
  onScratch,
  isFullyScratched,
  isPlayable,
  isNextCard,
}: ScratchOffCardProps) {
  // Add custom font style for game page
  const wayComeFontStyle = {
    fontFamily: "WayCome, sans-serif",
    fontWeight: "bold",
  };

  const [scratchedCells, setScratchedCells] = useState<boolean[]>(
    card.scratches,
  );
  const [isScratching, setIsScratching] = useState(false);

  const handleCellScratch = (index: number) => {
    if (!isPlayable) return;
    const newScratched = [...scratchedCells];
    newScratched[index] = true;
    setScratchedCells(newScratched);
    onScratch(card.id, index);
  };

  const handleMouseDown = (index: number) => {
    if (!isPlayable) return;
    setIsScratching(true);
    handleCellScratch(index);
  };

  const handleMouseEnter = (index: number) => {
    if (!isPlayable || !isScratching) return;
    handleCellScratch(index);
  };

  const handleMouseUp = () => {
    setIsScratching(false);
  };

  useEffect(() => {
    setScratchedCells(card.scratches);
  }, [card.scratches]);

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsScratching(false);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchend', handleGlobalMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, []);

  return (
    <div className="flex justify-center">
      <div className={`relative w-80 h-80 md:w-96 md:h-96 lg:w-[400px] lg:h-[400px] ${!isPlayable && !isFullyScratched ? 'opacity-50' : ''}`}>
        {/* Square background with border matching the square color */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg border-4 border-yellow-400"
          style={{
            backgroundImage: `url('/wheel-background.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        {/* Inner content area with square layout */}
        <div className="absolute inset-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex flex-col items-center justify-center p-3 md:p-4 border-2 border-yellow-400">
          {/* Match 3 Header */}
          <div className="text-center mb-2 md:mb-3">
            <div className="flex items-center justify-center mb-1">
              <span
                className="text-white font-bold text-lg md:text-2xl lg:text-3xl mr-2"
                style={{
                  ...wayComeFontStyle,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                }}
              >
                MATCH
              </span>
              <div className="bg-yellow-400 rounded-full w-7 h-7 md:w-10 md:h-10 lg:w-12 lg:h-12 flex items-center justify-center">
                <span
                  className="text-black font-bold text-base md:text-xl lg:text-2xl"
                  style={{
                    ...wayComeFontStyle,
                    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                  }}
                >
                  3
                </span>
              </div>
            </div>
            <p
              className="text-white font-bold text-xs md:text-lg lg:text-xl"
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
              <div
                key={index}
                className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 border-2 border-yellow-400 relative cursor-pointer"
                onClick={() => handleCellScratch(index)}
              >
                {scratchedCells[index] ? (
                  <div className="w-full h-full bg-yellow-400 text-black flex items-center justify-center p-1">
                    <div
                      className="text-center leading-tight w-full h-full flex flex-col justify-center"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {card.isWinner ? (
                        // Winner card shows same prize
                        <>
                          <div className="text-xs font-bold leading-tight">
                            Dishwasher
                          </div>
                          <div className="text-xs leading-tight">New Water</div>
                          <div className="text-xs leading-tight">
                            Valve Install
                          </div>
                          <div className="text-xs font-bold">
                            {card.prizeValues[index]}
                          </div>
                        </>
                      ) : (
                        // Non-winner card shows different prizes
                        <>
                          <div className="text-xs font-bold leading-tight">
                            {card.prizes[index]
                              .split(" ")
                              .slice(0, 2)
                              .join(" ")}
                          </div>
                          <div className="text-xs leading-tight">
                            {card.prizes[index]
                              .split(" ")
                              .slice(2, 4)
                              .join(" ")}
                          </div>
                          <div className="text-xs leading-tight">
                            {card.prizes[index].split(" ").slice(4).join(" ")}
                          </div>
                          <div className="text-xs font-bold">
                            {card.prizeValues[index]}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-800 hover:bg-gray-700 transition-colors"></div>
                )}
              </div>
            ))}
          </div>

          {/* Play Now Button */}
          <div
            className="bg-yellow-400 text-black font-bold py-2 px-4 md:px-6 rounded text-sm md:text-lg"
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

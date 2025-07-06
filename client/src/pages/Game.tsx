import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import ScratchCard from "@/components/ScratchCard";

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
  const [gameStarted, setGameStarted] = useState(false);
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
        "Kitchen Sink New Cold Water Valve & Line Installation",
        "Cooktop, Range, or Stove New Water Line Installation",
        "Garbage Disposal New Air Gap Installation",
        "Dishwasher New Water Valve Installation",
        "Master Bathroom Sink New Hot Water Valve & Line Installation",
      ],
      prizeValues: [
        "$197",
        "$397", 
        "$247",
        "$197",
        "$397",
        "$339",
        "$147",
        "$197",
        "$397",
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
  const [winnerCard, setWinnerCard] = useState<ScratchCardData | null>(null);

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

    // Check if all cards are fully scratched
    const allFullyScratched = cards.every((card) =>
      card.id === cardId
        ? card.scratches.every((_, i) => i === index || card.scratches[i])
        : card.scratches.every((scratch) => scratch),
    );

    if (allFullyScratched) {
      // Check if any card is a winner
      const winner = cards.find(card => card.isWinner && isCardFullyScratched(card));
      if (winner) {
        setWinnerCard(winner);
      }
      setTimeout(() => setGameComplete(true), 1000);
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
    setGameComplete(false);
  };

  const isCardFullyScratched = (card: ScratchCardData) => {
    return card.scratches.every((scratch) => scratch);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section - Exact match to your design */}
      <div className="px-4 py-4" style={{ backgroundColor: "#ffb22a" }}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center">
            <div className="bg-white p-2 rounded-lg">
              <img
                src="/logo.png"
                alt="Done For You Pros"
                className="h-16 md:h-20 w-auto"
              />
            </div>
          </div>
          <div
            className="text-white font-bold text-xl md:text-3xl"
            style={wayComeFontStyle}
          >
            <span className="text-white text-2xl md:text-4xl">$5 MILLION</span>
            <span className="text-black ml-2 text-lg md:text-xl">
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

      {/* Game Start Button or Game Cards Section */}
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {!gameStarted ? (
            <div className="text-center">
              <div className="mb-8">
                <h3 
                  className="text-2xl md:text-3xl font-bold mb-4"
                  style={{ ...wayComeFontStyle, color: "#2b5bdc" }}
                >
                  Ready to Play? Click to Start!
                </h3>
                <p className="text-lg text-gray-600 mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  Scratch off the cards to reveal amazing prizes worth up to $397!
                </p>
              </div>
              <Button
                onClick={() => setGameStarted(true)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-2xl py-6 px-12 rounded-lg"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                PLAY NOW
              </Button>
            </div>
          ) : (
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
          )}
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
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 p-1 rounded-3xl max-w-lg w-full animate-pulse">
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="text-8xl mb-4 animate-bounce">🎉</div>
              <h3 className="text-4xl font-bold mb-4 text-green-600" style={wayComeFontStyle}>
                🎊 CONGRATULATIONS! 🎊
              </h3>
              <p className="text-2xl font-bold mb-2 text-orange-600" style={wayComeFontStyle}>
                YOU WON!
              </p>
              <p className="text-lg mb-6 text-gray-700" style={{ fontFamily: "Montserrat, sans-serif" }}>
                You matched 3 "Dishwasher New Water Valve Installation" prizes worth $197 each!
              </p>
              <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-xl mb-6">
                <h4 className="text-2xl font-bold mb-2" style={wayComeFontStyle}>
                  CLAIM YOUR PRIZE NOW!
                </h4>
                <p className="text-lg mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  Call Done For You Pros to claim your prize:
                </p>
                <a 
                  href="tel:+1234567890" 
                  className="text-3xl font-bold underline hover:text-yellow-200 transition-colors"
                  style={wayComeFontStyle}
                >
                  📞 (123) 456-7890
                </a>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={resetGame} 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg"
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
      )}

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
              <div key={index} className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 border-2 border-yellow-400 relative">
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
                  <ScratchCard
                    width={56} // w-14 = 56px
                    height={56}
                    scratchPercent={40}
                    onScratchComplete={() => handleCellScratch(index)}
                  >
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
              : "SCRATCH TO WIN"}
          </div>
        </div>
      </div>
    </div>
  );
}

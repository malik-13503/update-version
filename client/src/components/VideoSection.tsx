import { useState, useRef, useEffect } from "react";
import { Play, PlayCircle } from "lucide-react";

interface VideoSectionProps {
  onVideoComplete: () => void;
}

export default function VideoSection({ onVideoComplete }: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const handlePlay = () => {
    setIsLoading(true);
    setIsPlaying(true);
    setIsLoading(false);
    
    // Start progress simulation for YouTube video
    // Since we can't directly track YouTube video progress, we'll simulate it
    startProgressSimulation();
  };

  const startProgressSimulation = () => {
    let currentProgress = 0;
    const duration = 120; // Assume 2 minutes video duration
    const interval = 1000; // Update every second
    
    progressInterval.current = setInterval(() => {
      currentProgress += (100 / duration);
      setProgress(currentProgress);
      
      // Enable form when video is 80% complete
      if (currentProgress >= 80 && !showComplete) {
        onVideoComplete();
        setShowComplete(true);
        setTimeout(() => setShowComplete(false), 3000);
      }
      
      // Stop at 100%
      if (currentProgress >= 100) {
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
        }
        if (!showComplete) {
          onVideoComplete();
          setShowComplete(true);
          setTimeout(() => setShowComplete(false), 3000);
        }
      }
    }, interval);
  };

  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Video Header */}
          <div className="bg-gradient-to-r from-[#F76D46] to-[#2C5CDC] text-white text-center py-4 md:py-6 rounded-t-lg shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-3 px-4">
              <PlayCircle className="animate-pulse flex-shrink-0" size={24} />
              <h2 className="text-base md:text-2xl font-bold text-center md:text-left" style={{ fontFamily: 'Montserrat, sans-serif' }}>CLICK BELOW TO WATCH THE VIDEO</h2>
            </div>
          </div>
          
          {/* Video Player */}
          <div className="relative bg-gray-900 rounded-b-lg shadow-2xl overflow-hidden">
            <div className="aspect-video relative">
              {/* YouTube video preview with play button */}
              {!isPlaying && (
                <div className="w-full h-full relative">
                  {/* YouTube thumbnail */}
                  <img 
                    src="https://img.youtube.com/vi/Lh6cT8kCo64/maxresdefault.jpg"
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Dark overlay for better button visibility */}
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  
                  {/* Play Button */}
                  <button 
                    onClick={handlePlay}
                    disabled={isLoading}
                    className="absolute inset-0 flex items-center justify-center z-10 bg-transparent hover:bg-black hover:bg-opacity-20 transition-all duration-300"
                  >
                    <div className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-6 transform hover:scale-110 transition-all duration-300 shadow-2xl">
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F76D46]"></div>
                      ) : (
                        <Play className="text-4xl text-[#F76D46] ml-1" size={48} />
                      )}
                    </div>
                  </button>
                </div>
              )}
              
              {/* YouTube iframe */}
              {isPlaying && (
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/Lh6cT8kCo64?autoplay=1&rel=0&modestbranding=1"
                  title="D4U Pros Scratch & Win Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              )}
              
              {/* Video Progress Indicator */}
              <div 
                className="absolute bottom-0 left-0 h-1 bg-[hsl(16,100%,64%)] transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
              
              {/* Video completion message */}
              {showComplete && (
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 bg-opacity-95 flex items-center justify-center">
                  <div className="text-center text-white">
                    <i className="fas fa-check-circle text-6xl mb-4 animate-bounce"></i>
                    <h3 className="text-2xl font-bold mb-2">Video Complete!</h3>
                    <p className="text-lg">You can now register to play the game!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
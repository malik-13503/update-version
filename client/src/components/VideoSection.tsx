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
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    setIsLoading(true);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play()
        .then(() => {
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      const currentProgress = (video.currentTime / video.duration) * 100;
      setProgress(currentProgress);

      // Enable form when video is 80% complete
      if (currentProgress >= 80) {
        onVideoComplete();
        setShowComplete(true);
        setTimeout(() => setShowComplete(false), 3000);
      }
    };

    const handleEnded = () => {
      onVideoComplete();
      setShowComplete(true);
      setTimeout(() => setShowComplete(false), 3000);
    };

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onVideoComplete]);

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
              {/* Video preview with play button */}
              {!isPlaying && (
                <div className="w-full h-full relative">
                  {/* Video thumbnail */}
                  <video 
                    className="w-full h-full object-cover"
                    preload="metadata"
                    muted
                    playsInline
                    poster=""
                  >
                    <source src="/videos/d4u-scratch-win-video.mp4#t=5" type="video/mp4" />
                  </video>
                  
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
              
              {/* Actual video element */}
              <video 
                ref={videoRef}
                className={`w-full h-full object-cover ${!isPlaying ? 'hidden' : ''}`}
                controls
                preload="metadata"
                playsInline
                onPlay={() => setIsPlaying(true)}
              >
                <source src="/videos/d4u-scratch-win-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
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

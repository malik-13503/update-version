import { useState, useRef, useEffect } from "react";
import { Play, PlayCircle } from "lucide-react";

interface VideoSectionProps {
  onVideoComplete: () => void;
}

export default function VideoSection({ onVideoComplete }: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play();
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
          <div className="bg-gradient-to-r from-[hsl(16,100%,64%)] to-[hsl(16,85%,69%)] text-white text-center py-4 rounded-t-lg shadow-lg">
            <div className="flex items-center justify-center space-x-2">
              <PlayCircle className="text-2xl animate-pulse" size={24} />
              <h2 className="text-xl md:text-2xl font-bold">CLICK BELOW TO WATCH THE VIDEO</h2>
            </div>
          </div>
          
          {/* Video Player */}
          <div className="relative bg-gray-900 rounded-b-lg shadow-2xl overflow-hidden">
            <div className="aspect-video relative">
              {/* Video placeholder with play button */}
              {!isPlaying && (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                  {/* Background particles effect */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-70 animate-float" style={{ top: '20%', left: '15%' }}></div>
                    <div className="absolute w-1 h-1 bg-orange-400 rounded-full opacity-60 animate-bounce-slow" style={{ top: '40%', left: '80%' }}></div>
                    <div className="absolute w-3 h-3 bg-blue-400 rounded-full opacity-50 animate-pulse" style={{ top: '60%', left: '25%' }}></div>
                    <div className="absolute w-1 h-1 bg-yellow-300 rounded-full opacity-80 animate-float" style={{ top: '80%', left: '70%' }}></div>
                    <div className="absolute w-2 h-2 bg-orange-300 rounded-full opacity-40 animate-bounce" style={{ top: '30%', left: '60%' }}></div>
                  </div>
                  
                  {/* Play Button */}
                  <button 
                    onClick={handlePlay}
                    className="relative z-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-6 transform hover:scale-110 transition-all duration-300 shadow-2xl"
                  >
                    <Play className="text-4xl text-[hsl(16,100%,64%)] ml-1" size={48} />
                  </button>
                </div>
              )}
              
              {/* Actual video element */}
              <video 
                ref={videoRef}
                className={`w-full h-full object-cover ${!isPlaying ? 'hidden' : ''}`}
                controls
                onPlay={() => setIsPlaying(true)}
              >
                <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4" />
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

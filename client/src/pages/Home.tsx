import Header from "@/components/Header";
import VideoSection from "@/components/VideoSection";
import GamePreview from "@/components/GamePreview";
import RegistrationForm from "@/components/RegistrationForm";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function Home() {
  const [videoWatched, setVideoWatched] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[hsl(16,100%,64%)] via-[hsl(16,85%,69%)] to-[hsl(227,100%,65%)] py-12 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
              DONE FOR YOU PROS 
              <span className="block text-3xl md:text-5xl font-bold text-yellow-300">IS DONE RIGHT!</span>
            </h1>
            <div className="flex justify-center mb-8">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fas fa-star text-yellow-300 text-2xl"></i>
                ))}
              </div>
            </div>
            <p className="text-xl md:text-2xl text-white font-semibold mb-8">
              Watch Our Video & Play Our Scratch & Win Game for a Chance to Win 
              <span className="text-yellow-300 font-black"> $5 MILLION</span> in Instant Prizes!
            </p>
          </div>
        </div>
      </section>

      <VideoSection onVideoComplete={() => setVideoWatched(true)} />
      <GamePreview />
      <RegistrationForm videoWatched={videoWatched} />
      <Footer />
    </div>
  );
}

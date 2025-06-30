import { Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[hsl(225,47%,32%)] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <span className="text-4xl font-black text-[hsl(16,100%,64%)]">D</span>
              <div className="flex items-center">
                <div className="w-4 h-8 bg-gradient-to-b from-[hsl(16,100%,64%)] to-[hsl(16,85%,69%)] rounded-full transform -skew-x-12 mx-1"></div>
                <span className="text-4xl font-black text-[hsl(227,100%,65%)]">NE</span>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-white font-bold text-lg tracking-wide">FOR YOU PROS</div>
              <div className="text-xs text-gray-300 font-medium">REPLACE WATER LINES & GAS VALVES ON ALL HOME APPLIANCES</div>
            </div>
          </div>
          
          {/* Copyright and Contact */}
          <div className="border-t border-gray-600 pt-8">
            <p className="text-gray-300 mb-4">
              All Rights Reserved © 2024 | Done For You Pros | 
              <a 
                href="tel:3102956355" 
                className="text-[hsl(16,100%,64%)] hover:text-[hsl(16,85%,69%)] transition-colors ml-2"
              >
                <Phone className="inline mr-1" size={16} />
                Call Now: (310) 295-6355
              </a>
            </p>
            <p className="text-sm text-gray-400">
              Licensed & Insured Professional Service Provider
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Phone } from "lucide-react";
import logoImage from "@assets/logo_1751279296203.png";

export default function Footer() {
  return (
    <footer className="bg-[hsl(225,47%,32%)] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src={logoImage} 
              alt="Done For You Pros" 
              className="h-16 w-auto object-contain filter brightness-0 invert"
            />
          </div>
          
          {/* Copyright and Contact */}
          <div className="border-t border-gray-600 pt-6">
            <p className="text-gray-300 mb-3">
              All Rights Reserved © 2024 | Done For You Pros | 
              <a 
                href="tel:3102956355" 
                className="text-[hsl(16,100%,64%)] hover:text-[hsl(16,85%,69%)] transition-colors ml-2"
              >
                <Phone className="inline mr-1" size={16} />
                Call Now: (310) 295-6355
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

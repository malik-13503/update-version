import { Phone, Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-4xl font-black text-[hsl(16,100%,64%)]">D</span>
              <div className="flex items-center">
                <div className="w-4 h-8 bg-gradient-to-b from-[hsl(16,100%,64%)] to-[hsl(16,85%,69%)] rounded-full transform -skew-x-12 mx-1"></div>
                <span className="text-4xl font-black text-[hsl(227,100%,65%)]">NE</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="text-[hsl(225,47%,32%)] font-bold text-lg tracking-wide">FOR YOU PROS</div>
              <div className="text-xs text-gray-600 font-medium">REPLACE WATER LINES & GAS VALVES ON ALL HOME APPLIANCES</div>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center text-[hsl(225,47%,32%)]">
              <Phone className="text-[hsl(16,100%,64%)] mr-2" size={18} />
              <span className="font-semibold">CALL NOW: (310) 295-6355</span>
            </div>
            <button className="md:hidden text-[hsl(225,47%,32%)] text-xl">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

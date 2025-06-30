import { useQuery } from "@tanstack/react-query";

export default function GamePreview() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  return (
    <section className="bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">$5 MILLION INSTANT PRIZES</h2>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">IT'S TIME TO PLAY OUR SCRATCH & WIN GAME</h3>
          <p className="text-xl font-bold text-white">2 CHANCES TO WIN AMAZING PRIZES!</p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Game Card 1 */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 rounded-xl p-6 mb-6">
                  <div className="text-center text-white mb-4">
                    <h4 className="text-2xl font-black mb-2">MATCH 3</h4>
                    <h4 className="text-xl font-bold">& YOU WIN!</h4>
                  </div>
                  
                  {/* Scratch Area Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="aspect-square bg-gray-800 rounded border-2 border-yellow-400"></div>
                    ))}
                  </div>
                  
                  <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                    PLAY NOW
                  </button>
                </div>
              </div>
            </div>
            
            {/* Game Card 2 */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500 rounded-xl p-6 mb-6">
                  <div className="text-center text-white mb-4">
                    <h4 className="text-2xl font-black mb-2">MATCH 3</h4>
                    <h4 className="text-xl font-bold">& YOU WIN!</h4>
                  </div>
                  
                  {/* Scratch Area Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="aspect-square bg-gray-800 rounded border-2 border-yellow-400"></div>
                    ))}
                  </div>
                  
                  <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                    PLAY NOW
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Trust Indicator */}
          <div className="text-center bg-white bg-opacity-90 rounded-xl p-6 max-w-4xl mx-auto">
            <p className="text-[hsl(225,47%,32%)] font-bold text-lg mb-2">
              Our 20 Connection New Parts Installations Program
            </p>
            <p className="text-[hsl(225,47%,32%)] font-semibold text-xl">
              is already Protecting <span className="text-[hsl(16,100%,64%)]">
                {stats?.registrationCount ? `${Math.max(300000, stats.registrationCount).toLocaleString()}+` : '300,000+'}
              </span> Home Owners nationwide
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

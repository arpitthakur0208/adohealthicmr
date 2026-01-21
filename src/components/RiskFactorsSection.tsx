"use client";

export default function RiskFactorsSection() {
  return (
    <section className="relative w-full px-6 md:px-8 py-8 md:py-12 overflow-hidden">
      {/* Darker Blue Background */}
      <div className="absolute inset-0 bg-blue-700"></div>
      
      {/* Subtle Decorative Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-900 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-yellow-500 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-black mb-3 sm:mb-4 px-4">
          The Big-7 Behavioral Risk Factors
        </h2>
        
        {/* Description */}
        <p className="text-base sm:text-lg text-black text-center mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
          Understanding and addressing the key lifestyle factors that contribute to Non-Communicable Diseases among adolescents.
        </p>

        {/* Risk Factors List */}
        <div className="space-y-4">
          {/* 1. Introduction to NCDs */}
          <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl hover:bg-white transition-all border border-blue-800 hover:scale-[1.01] sm:hover:scale-[1.02]">
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-orange-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-black mb-1 sm:mb-2">Introduction to Non-communicable Diseases</h3>
              <p className="text-sm sm:text-base text-black">
                This session introduces adolescents to Non-communicable Diseases. 
              </p>
            </div>
          </div>

          {/* 2. Tobacco & Alcohol */}
          <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl hover:bg-white transition-all border border-blue-800 hover:scale-[1.01] sm:hover:scale-[1.02]">
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-red-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                <line x1="7" y1="7" x2="17" y2="17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M9 10h6M10 12h4M11 14h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-black mb-1 sm:mb-2">Tobacco & Alcohol</h3>
              <p className="text-sm sm:text-base text-black">
                Understanding COTPA & PECA laws, resisting peer pressure, and making informed choices
              </p>
            </div>
          </div>

          {/* 3. Unhealthy Diet */}
          <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl hover:bg-white transition-all border border-blue-800 hover:scale-[1.01] sm:hover:scale-[1.02]">
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-green-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                <ellipse cx="12" cy="16" rx="8" ry="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-black mb-1 sm:mb-2">Unhealthy Diet</h3>
              <p className="text-sm sm:text-base text-black">
                Avoiding JUNCS foods and embracing balanced Punjabi meals for better health
              </p>
            </div>
          </div>

          {/* 4. Physical Inactivity */}
          <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl hover:bg-white transition-all border border-blue-800 hover:scale-[1.01] sm:hover:scale-[1.02]">
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" fill="currentColor"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-black mb-1 sm:mb-2">Physical Inactivity</h3>
              <p className="text-sm sm:text-base text-black">
                Promoting 60 minutes daily activity through traditional games and modern fitness
              </p>
            </div>
          </div>

          {/* 5. Sedentary Screen Time */}
          <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl hover:bg-white transition-all border border-blue-800 hover:scale-[1.01] sm:hover:scale-[1.02]">
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-black mb-1 sm:mb-2">Sedentary Screen Time</h3>
              <p className="text-sm sm:text-base text-black">
                Managing digital life with S.M.A.R.T. strategies to limit non-educational screen use
              </p>
            </div>
          </div>

          {/* 6. Poor Sleep Quality */}
          <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl hover:bg-white transition-all border border-blue-800 hover:scale-[1.01] sm:hover:scale-[1.02]">
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-yellow-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-black mb-1 sm:mb-2">Poor Sleep Quality</h3>
              <p className="text-sm sm:text-base text-black">
                Achieving 8-10 hours of quality sleep through better sleep hygiene practices
              </p>
            </div>
          </div>

          {/* 7. Stress */}
          <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl hover:bg-white transition-all border border-blue-800 hover:scale-[1.01] sm:hover:scale-[1.02]">
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-indigo-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-black mb-1 sm:mb-2">Stress</h3>
              <p className="text-sm sm:text-base text-black">
                Building resilience and learning coping strategies to master mood and mind
              </p>
            </div>
          </div>

         
        </div>
      </div>
    </section>
  );
}

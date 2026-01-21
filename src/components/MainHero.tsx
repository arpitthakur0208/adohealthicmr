"use client";

export default function MainHero() {
  return (
    <div className="relative w-full px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 overflow-hidden border-yellow-500">
      {/* Darker Blue Background */}
      <div className="absolute inset-0 bg-blue-900"></div>
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-blue-950 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 h-64 sm:w-96 sm:h-96 bg-yellow-500 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10 px-4">
        {/* Project Tag */}
        <div className="mb-6 sm:mb-8">
          <span className="inline-block px-4 py-2 sm:px-5 sm:py-2.5 bg-yellow-500 text-slate-900 text-xs sm:text-sm font-semibold rounded-full border-2 border-yellow-400 shadow-lg">
            ICMR Funded Project
          </span>
        </div>
        
        {/* Main Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2">
          <span className="text-white">Empowering</span>{" "}
          <span className="text-white">Punjab&apos;s</span>{" "}
          <span className="text-white">Youth</span>
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg md:text-xl text-white font-medium max-w-3xl mx-auto leading-relaxed px-2">
          Building healthy lifestyles today, preventing NCDs tomorrow. A
          school-based e-wellness initiative for adolescents of New Rupar,
          Punjab.
        </p>

        {/* Buttons */}
        {/* <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="group px-8 py-4 bg-yellow-500 text-slate-900 font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center gap-3 min-w-[220px] justify-center border-2 border-yellow-400 hover:bg-yellow-400 shadow-lg">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-slate-900"
            >
              <path
                d="M8 5v14l11-7z"
                fill="currentColor"
              />
            </svg>
            <span>Explore E-Wellness</span>
          </button>

          <button className="px-8 py-4 bg-slate-700 text-yellow-400 font-semibold rounded-xl border-2 border-yellow-500 transition-all duration-300 hover:bg-slate-600 hover:shadow-lg min-w-[220px] shadow-md">
            Learn More
          </button>
        </div> */}
      </div>
    </div>
  );
}

"use client";

export default function MainHero() {
  return (
    <div className="relative w-full px-6 md:px-8 py-12 md:py-16 overflow-hidden">
      {/* Light Background */}
      <div className="absolute inset-0 bg-blue-50"></div>
      
      {/* Animated Background Pattern */}
      <div className="">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Project Tag */}
        <div className="mb-6">
          <span className="inline-block px-4 py-2 bg-blue-100 backdrop-blur-sm text-blue-800 text-sm font-semibold rounded-full border border-blue-200 shadow-lg">
            ICMR Funded Project</span>
        </div>
        
        {/* Main Heading */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-800 drop-shadow-lg">
          Empowering{" "}
          <span className="text-orange-500">Punjab&apos;s</span> Youth
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
          Building healthy lifestyles today, preventing NCDs tomorrow. A
          school-based e-wellness initiative for adolescents of New Rupar,
          Punjab.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Explore E-Wellness Button */}
          <button className="group relative px-8 py-4 bg-white text-purple-600 font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center gap-3 min-w-[220px] justify-center border-2 border-purple-200">
            <div className="absolute inset-0 bg-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10 group-hover:text-white transition-colors"
            >
              <path
                d="M8 5v14l11-7z"
                fill="currentColor"
              />
            </svg>
            <span className="relative z-10 group-hover:text-white transition-colors">Explore E-Wellness</span>
          </button>

          {/* Learn More Button */}
          <button className="px-8 py-4 bg-transparent text-gray-800 font-bold rounded-xl border-2 border-gray-300 backdrop-blur-sm transition-all duration-300 hover:bg-gray-100 hover:border-gray-400 hover:shadow-xl min-w-[220px]">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

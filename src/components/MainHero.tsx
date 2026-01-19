"use client";

export default function MainHero() {
  return (
    <div className="relative w-full px-6 md:px-8 py-16 md:py-20 overflow-hidden">
      {/* Light Gradient Background with Darker Middle */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-300 to-pink-50"></div>
      
      {/* Subtle Background Pattern with Darker Middle */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Project Tag */}
        <div className="mb-8">
          <span className="inline-block px-5 py-2.5 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full border border-blue-100 shadow-sm">
            ICMR Funded Project
          </span>
        </div>
        
        {/* Main Heading */}
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-900 leading-tight">
          Empowering{" "}
          <span className="text-orange-600">Punjab&apos;s</span> Youth
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Building healthy lifestyles today, preventing NCDs tomorrow. A
          school-based e-wellness initiative for adolescents of New Rupar,
          Punjab.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Explore E-Wellness Button */}
          <button className="group px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center gap-3 min-w-[220px] justify-center border-2 border-blue-100 hover:border-blue-200">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-blue-600"
            >
              <path
                d="M8 5v14l11-7z"
                fill="currentColor"
              />
            </svg>
            <span>Explore E-Wellness</span>
          </button>

          {/* Learn More Button */}
          <button className="px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 transition-all duration-300 hover:bg-gray-200 hover:border-gray-300 hover:shadow-lg min-w-[220px]">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

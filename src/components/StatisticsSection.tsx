"use client";

export default function StatisticsSection() {
  return (
    <section className="relative w-full px-6 md:px-8 py-8 md:py-12 overflow-hidden">
      {/* Light Background */}
      <div className="absolute inset-0 bg-orange-500"></div>
      
      {/* Animated Background Elements */}
      <div className="">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stat 1: Wellness Initiative */}
          <div className="flex flex-col items-center text-center text-white p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:scale-105 shadow-xl">
            <div className="mb-4 p-4 bg-white/20 rounded-2xl">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h3 className="text-5xl md:text-6xl font-bold mb-2 drop-shadow-lg">63%</h3>
            <p className="text-sm md:text-base font-semibold opacity-95">OF WELLNESS INITIATIVE</p>
          </div>

          {/* Stat 2: Increase in Engagement */}
          <div className="flex flex-col items-center text-center text-white p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:scale-105 shadow-xl">
            <div className="mb-4 p-4 bg-white/20 rounded-2xl">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h3 className="text-5xl md:text-6xl font-bold mb-2 drop-shadow-lg">10.4%</h3>
            <p className="text-sm md:text-base font-semibold opacity-95">INCREASE IN ENGAGEMENT</p>
          </div>

          {/* Stat 3: Youth Reached */}
          <div className="flex flex-col items-center text-center text-white p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:scale-105 shadow-xl">
            <div className="mb-4 p-4 bg-white/20 rounded-2xl">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <circle
                  cx="9"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path
                  d="M23 21v-2a4 4 0 0 0-3-3.87"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path
                  d="M16 3.13a4 4 0 0 1 0 7.75"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
            <h3 className="text-5xl md:text-6xl font-bold mb-2 drop-shadow-lg">1.2L+</h3>
            <p className="text-sm md:text-base font-semibold opacity-95">YOUTH REACHED & ENGAGED</p>
          </div>

          {/* Stat 4: Districts Covered */}
          <div className="flex flex-col items-center text-center text-white p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:scale-105 shadow-xl">
            <div className="mb-4 p-4 bg-white/20 rounded-2xl">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <rect
                  x="3"
                  y="11"
                  width="18"
                  height="11"
                  rx="2"
                  ry="2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path
                  d="M7 11V7a5 5 0 0 1 10 0v4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
            <h3 className="text-5xl md:text-6xl font-bold mb-2 drop-shadow-lg">7</h3>
            <p className="text-sm md:text-base font-semibold opacity-95">DISTRICTS COVERED</p>
          </div>
        </div>
      </div>
    </section>
  );
}

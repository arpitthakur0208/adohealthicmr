"use client";

export default function StatisticsSection() {
  return (
    <section className="relative w-full px-6 md:px-8 py-16 md:py-20 overflow-hidden bg-gradient-to-br from-gray-50 via-blue-300 to-purple-50">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stat 1: Wellness Initiative */}
          <div className="flex flex-col items-center text-center p-8 bg-blue-50 rounded-2xl border border-blue-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="mb-6 p-4 bg-blue-100 rounded-2xl">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-blue-600"
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h3 className="text-5xl md:text-6xl font-bold mb-3 text-gray-900">63%</h3>
            <p className="text-sm md:text-base font-semibold text-gray-600">OF WELLNESS INITIATIVE</p>
          </div>

          {/* Stat 2: Increase in Engagement */}
          <div className="flex flex-col items-center text-center p-8 bg-orange-50 rounded-2xl border border-orange-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="mb-6 p-4 bg-orange-100 rounded-2xl">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-orange-600"
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
            <h3 className="text-5xl md:text-6xl font-bold mb-3 text-gray-900">10.4%</h3>
            <p className="text-sm md:text-base font-semibold text-gray-600">INCREASE IN ENGAGEMENT</p>
          </div>

          {/* Stat 3: Youth Reached */}
          <div className="flex flex-col items-center text-center p-8 bg-green-50 rounded-2xl border border-green-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="mb-6 p-4 bg-green-100 rounded-2xl">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-green-600"
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
            <h3 className="text-5xl md:text-6xl font-bold mb-3 text-gray-900">1.2L+</h3>
            <p className="text-sm md:text-base font-semibold text-gray-600">YOUTH REACHED & ENGAGED</p>
          </div>

          {/* Stat 4: Districts Covered */}
          <div className="flex flex-col items-center text-center p-8 bg-purple-50 rounded-2xl border border-purple-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="mb-6 p-4 bg-purple-100 rounded-2xl">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-purple-600"
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
            <h3 className="text-5xl md:text-6xl font-bold mb-3 text-gray-900">7</h3>
            <p className="text-sm md:text-base font-semibold text-gray-600">DISTRICTS COVERED</p>
          </div>
        </div>
      </div>
    </section>
  );
}

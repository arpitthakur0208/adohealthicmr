"use client";

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden border-t-2 border-yellow-500">
      {/* Darker Blue Background */}
      <div className="absolute inset-0 bg-blue-800"></div>
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-800 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 text-white py-8 sm:py-10 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-yellow-400">Contact Information</h3>
            <div className="space-y-2 sm:space-y-3">
              <p className="font-semibold text-base sm:text-lg">Dr. Amrit Kaur Virk, MD</p>
              <p className="text-gray-300 text-sm sm:text-base">Professor & Head, Department of Community Medicine</p>
              <p className="text-gray-300 text-sm sm:text-base">Dr BR Ambedkar State Institute of Medical Sciences (AIMS)</p>
              <p className="text-gray-300 text-sm sm:text-base">SAS Nagar, Mohali, Punjab</p>
              <div className="pt-2 space-y-2">
                <p className="text-gray-300 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <a href="tel:+919815140389" className="hover:text-yellow-400 transition-colors">+91-9815140389</a>
                </p>
                <p className="text-gray-300 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <a href="mailto:dramritvirk@gmail.com" className="hover:text-yellow-400 transition-colors">dramritvirk@gmail.com</a>
                </p>
              </div>
            </div>
          </div>

          {/* Funding Information */}
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-yellow-400">About</h3>
            <div className="space-y-3 sm:space-y-4">
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Funded by the Indian Council of Medical Research (ICMR) under the intermediate Grant-2024
              </p>
              <div className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-yellow-400"
                  >
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill="currentColor"
                    />
                  </svg>
                  <h4 className="text-lg sm:text-xl font-semibold">AdoHealth Initiative</h4>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Building healthy lifestyles today, preventing NCDs tomorrow.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/20 text-center">
          <p className="text-white/80 text-sm">
            © {new Date().getFullYear()} AdoHealth Initiative. All rights reserved.
          </p>
        </div>
        </div>
      </div>
    </footer>
  );
}

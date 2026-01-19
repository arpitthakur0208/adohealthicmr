"use client";

import Image from "next/image";
import icmrLogo from "../assets/Indian_Council_of_Medical_Research_Logo.svg.png";

interface HeaderProps {
  isUserLoggedIn: boolean;
  isAdmin: boolean;
  userName: string;
  onLoginClick: () => void;
  onLogout: () => void;
  onModulesClick?: () => void;
}

export default function Header({ isUserLoggedIn, isAdmin, userName, onLoginClick, onLogout, onModulesClick }: HeaderProps) {
  return (
    <header className="sticky top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0">
                <Image
                  src={icmrLogo}
                  alt="ICMR Logo - Indian Council of Medical Research"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className="text-xl font-bold text-gray-800">AdoHealth Initiative</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {onModulesClick && (isUserLoggedIn || isAdmin) && (
              <button
                onClick={onModulesClick}
                className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-semibold rounded-lg hover:bg-blue-100 border border-blue-100 transition-all duration-200 flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                Modules
              </button>
            )}
            {isUserLoggedIn || isAdmin ? (
              <>
                {isUserLoggedIn && (
                  <span className="text-sm text-gray-700 font-medium flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    {userName}
                  </span>
                )}
                {isAdmin && (
                  <span className="text-sm text-gray-700 font-medium flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-100">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                    Admin
                  </span>
                )}
                <button
                  onClick={onLogout}
                  className="px-4 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-100 border border-red-100 transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onLoginClick();
                }}
                className="px-5 py-2.5 bg-orange-50 text-orange-600 text-sm font-semibold rounded-lg hover:bg-orange-100 border border-orange-100 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer relative z-50"
                type="button"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

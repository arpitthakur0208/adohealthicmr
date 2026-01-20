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
    <header className="sticky top-0 left-0 right-0 z-[100] bg-slate-700 backdrop-blur-md border-b-2 border-yellow-500 shadow-lg">
      <div className="max-w-8xl mx-2 px-2 md:px-8 py-2">
      <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
                <Image
                  src={icmrLogo}
                  alt="ICMR Logo - Indian Council of Medical Research"
                  fill
                  className="object-contain"
                  priority
                  style={{ filter: 'brightness(2) contrast(1.3) invert(0)' }}
            />
              </div>
              <h1 className="text-lg md:text-xl font-bold text-yellow-400">AdoHealth Initiative</h1>
            </div>
        </div>
        <div className="flex items-center gap-3">
            {onModulesClick && (isUserLoggedIn || isAdmin) && (
              <div className="relative">
                <button
                  onClick={onModulesClick}
                  className="px-3 py-1.5 bg-yellow-500 text-slate-900 text-xs font-semibold rounded-lg hover:bg-yellow-400 border-2 border-yellow-400 transition-all duration-200 flex items-center gap-2 relative z-10 shadow-md hover:shadow-lg"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                  Modules
                </button>
              </div>
            )}
          {isUserLoggedIn || isAdmin ? (
            <>
              {isUserLoggedIn && (
                  <span className="text-xs text-yellow-400 font-medium flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-700 rounded-lg border-2 border-yellow-500 shadow-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  {userName}
                </span>
              )}
              {isAdmin && (
                  <span className="text-xs text-yellow-400 font-medium flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-700 rounded-lg border-2 border-yellow-500 shadow-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  Admin
                </span>
              )}
              <button
                onClick={onLogout}
                  className="px-3 py-1.5 bg-slate-700 text-yellow-400 text-xs font-semibold rounded-lg hover:bg-slate-600 border-2 border-slate-600 transition-all duration-200 shadow-md hover:shadow-lg"
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
                className="px-4 py-2 bg-yellow-500 text-slate-900 text-xs font-semibold rounded-lg hover:bg-yellow-400 border-2 border-yellow-400 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer relative z-50"
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

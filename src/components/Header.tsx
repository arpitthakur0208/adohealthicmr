"use client";

interface HeaderProps {
  isUserLoggedIn: boolean;
  isAdmin: boolean;
  userName: string;
  onLoginClick: () => void;
  onLogout: () => void;
}

export default function Header({ isUserLoggedIn, isAdmin, userName, onLoginClick, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-green-600"
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="currentColor"
            />
          </svg>
          <h1 className="text-xl font-semibold text-gray-900">AdoHealth Initiative</h1>
        </div>
        <div className="flex items-center gap-3">
          {isUserLoggedIn || isAdmin ? (
            <>
              {isUserLoggedIn && (
                <span className="text-sm text-blue-600 font-medium flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  {userName}
                </span>
              )}
              {isAdmin && (
                <span className="text-sm text-green-600 font-medium flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  Admin
                </span>
              )}
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={onLoginClick}
              className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

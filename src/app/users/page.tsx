"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";

interface UserRow {
  id: string;
  username: string;
  email: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function checkAuth() {
      try {
        const meRes = await fetch("/api/auth/me", { credentials: "include" });
        const meData = await meRes.json();
        if (!meRes.ok || !meData.user) {
          setError("Please log in as admin to view users.");
          setLoading(false);
          return;
        }
        if (meData.user.role !== "admin") {
          setError("Admin access required.");
          setLoading(false);
          return;
        }
        setIsAdmin(true);
        setUserName(meData.user.username || meData.user.email || "Admin");
      } catch {
        setError("Failed to verify authentication.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/users", { credentials: "include" });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || data.message || "Failed to load users.");
          setLoading(false);
          return;
        }
        setUsers(data.users || []);
      } catch (err) {
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    window.location.href = "/";
  };

  return (
    <main className="min-h-screen bg-blue-700">
      <Header
        isUserLoggedIn={false}
        isAdmin={isAdmin}
        userName={userName}
        onLoginClick={() => (window.location.href = "/")}
        onLogout={handleLogout}
        onLoginHistoryClick={() => (window.location.href = "/")}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-yellow-400">
            Users
          </h1>
          <Link
            href="/"
            className="px-4 py-2 bg-slate-600 text-gray-200 font-semibold rounded-lg hover:bg-slate-500 transition-all"
          >
            Back to Home
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-yellow-400">Loading users...</div>
        ) : error ? (
          <div className="p-4 bg-red-900 border-2 border-red-500 rounded-lg text-red-200">
            {error}
            <div className="mt-3">
              <Link href="/" className="text-yellow-400 underline">
                Go to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-blue-800 rounded-lg border-2 border-yellow-500 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm sm:text-base">
                <thead>
                  <tr className="bg-slate-700 border-b-2 border-yellow-500">
                    <th className="text-left px-4 py-3 text-yellow-400 font-semibold">
                      Email
                    </th>
                    <th className="text-left px-4 py-3 text-yellow-400 font-semibold">
                      Username
                    </th>
                    <th className="text-left px-4 py-3 text-yellow-400 font-semibold">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-8 text-center text-gray-400"
                      >
                        No users yet.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr
                        key={u.id}
                        className="border-b border-slate-600 hover:bg-slate-700/50"
                      >
                        <td className="px-4 py-3 text-white">{u.email}</td>
                        <td className="px-4 py-3 text-gray-300">{u.username}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              u.role === "admin"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-slate-600 text-gray-300"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

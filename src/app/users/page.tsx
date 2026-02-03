"use client";

import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import Header from "@/components/Header";

interface UserRow {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface SubmissionRow {
  userId: string;
  moduleId: number;
  moduleTitle: string;
  questionId: number;
  answer: string;
  isCorrect?: boolean;
  submittedAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  const [editModal, setEditModal] = useState<UserRow | null>(null);
  const [passwordModal, setPasswordModal] = useState<UserRow | null>(null);
  const [deleteModal, setDeleteModal] = useState<UserRow | null>(null);
  const [editForm, setEditForm] = useState({ email: "", username: "" });
  const [newPassword, setNewPassword] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [submissionsLoaded, setSubmissionsLoaded] = useState(false);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    const res = await fetch("/api/users", { credentials: "include" });
    const data = await res.json();
    if (res.ok) {
      setUsers(data.users || []);
      setError("");
    } else {
      setError(data.error || data.message || "Failed to load users.");
    }
  };

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
        await fetchUsers();
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

  const fetchSubmissions = async () => {
    if (submissionsLoaded) return;
    try {
      const res = await fetch("/api/submissions", { credentials: "include" });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmissions(data.submissions || []);
        setSubmissionsLoaded(true);
      }
    } catch {
      // Ignore; accordion will show "No submissions" or retry on expand
    }
  };

  const toggleUserAccordion = (userId: string) => {
    setExpandedUserId((prev) => (prev === userId ? null : userId));
    if (!submissionsLoaded) fetchSubmissions();
  };

  const getSubmissionsForUser = (userId: string) =>
    submissions.filter((s) => s.userId === userId);

  const handleEdit = (u: UserRow) => {
    setEditModal(u);
    setEditForm({ email: u.email, username: u.username });
    setActionError("");
  };

  const handleSaveEdit = async () => {
    if (!editModal) return;
    setActionLoading(true);
    setActionError("");
    try {
      const res = await fetch(`/api/users/${editModal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: editForm.email, username: editForm.username }),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || data.message || "Failed to update user");
        return;
      }
      setEditModal(null);
      await fetchUsers();
    } catch (err) {
      setActionError("Failed to update user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSetPassword = (u: UserRow) => {
    setPasswordModal(u);
    setNewPassword("");
    setActionError("");
  };

  const handleSavePassword = async () => {
    if (!passwordModal || !newPassword || newPassword.length < 6) {
      setActionError("Password must be at least 6 characters");
      return;
    }
    setActionLoading(true);
    setActionError("");
    try {
      const res = await fetch(`/api/users/${passwordModal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || data.message || "Failed to set password");
        return;
      }
      setPasswordModal(null);
      setNewPassword("");
    } catch (err) {
      setActionError("Failed to set password");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = (u: UserRow) => {
    setDeleteModal(u);
    setActionError("");
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal) return;
    setActionLoading(true);
    setActionError("");
    try {
      const res = await fetch(`/api/users/${deleteModal.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || data.message || "Failed to delete user");
        return;
      }
      setDeleteModal(null);
      await fetchUsers();
    } catch (err) {
      setActionError("Failed to delete user");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-blue-700">
      <Header
        isUserLoggedIn={false}
        isAdmin={isAdmin}
        userName={userName}
        onLoginClick={() => (window.location.href = "/")}
        onLogout={handleLogout}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
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
          <>
          <div className="bg-blue-800 rounded-lg border-2 border-yellow-500 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm sm:text-base">
                <thead>
                  <tr className="bg-slate-700 border-b-2 border-yellow-500">
                    <th className="w-8 px-2 py-3 text-yellow-400 font-semibold" aria-label="Expand" />
                    <th className="text-left px-4 py-3 text-yellow-400 font-semibold">
                      Email
                    </th>
                    <th className="text-left px-4 py-3 text-yellow-400 font-semibold">
                      Username
                    </th>
                    <th className="text-left px-4 py-3 text-yellow-400 font-semibold">
                      Role
                    </th>
                    <th className="text-right px-4 py-3 text-yellow-400 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-gray-400"
                      >
                        No users yet.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => {
                      const isExpanded = expandedUserId === u.id;
                      const userSubmissions = getSubmissionsForUser(u.id);
                      return (
                        <Fragment key={u.id}>
                          <tr
                            key={u.id}
                            className={`border-b border-slate-600 hover:bg-slate-700/50 cursor-pointer select-none ${isExpanded ? "bg-slate-700/70" : ""}`}
                            onClick={() => toggleUserAccordion(u.id)}
                          >
                            <td className="w-8 px-2 py-3 text-yellow-400">
                              <span
                                className={`inline-block transition-transform ${isExpanded ? "rotate-90" : ""}`}
                                aria-hidden
                              >
                                ▶
                              </span>
                            </td>
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
                            <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex gap-1 justify-end">
                                <button
                                  onClick={() => handleEdit(u)}
                                  className="px-2 py-1 text-xs bg-slate-600 text-gray-200 rounded hover:bg-slate-500"
                                  title="Edit user"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleSetPassword(u)}
                                  className="px-2 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-500"
                                  title="Set password"
                                >
                                  Password
                                </button>
                                <button
                                  onClick={() => handleDelete(u)}
                                  className="px-2 py-1 text-xs bg-red-700 text-white rounded hover:bg-red-600"
                                  title="Delete user"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr key={`${u.id}-submissions`} className="bg-slate-800/80">
                              <td colSpan={5} className="p-0">
                                <div className="px-4 pb-4 pt-1">
                                  <h3 className="text-sm font-semibold text-yellow-400 mb-2">
                                    User question & answer submissions
                                  </h3>
                                  {userSubmissions.length === 0 ? (
                                    <p className="text-gray-400 text-sm py-2">No submissions yet.</p>
                                  ) : (
                                    <div className="overflow-x-auto max-h-[40vh] overflow-y-auto rounded border border-slate-600">
                                      <table className="w-full text-sm">
                                        <thead className="bg-slate-700 sticky top-0">
                                          <tr>
                                            <th className="text-left px-3 py-2 text-yellow-400 font-semibold">Module</th>
                                            <th className="text-left px-3 py-2 text-yellow-400 font-semibold">Answer</th>
                                            <th className="text-left px-3 py-2 text-yellow-400 font-semibold">Correct</th>
                                            <th className="text-left px-3 py-2 text-yellow-400 font-semibold">Submitted</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {userSubmissions.map((s, i) => (
                                            <tr key={`${s.moduleId}-${s.questionId}-${i}`} className="border-b border-slate-600 hover:bg-slate-700/50">
                                              <td className="px-3 py-2 text-gray-300">{s.moduleTitle}</td>
                                              <td className="px-3 py-2 text-gray-300 max-w-xs truncate" title={s.answer}>{s.answer}</td>
                                              <td className="px-3 py-2">
                                                {s.isCorrect === true ? (
                                                  <span className="text-green-400">Yes</span>
                                                ) : s.isCorrect === false ? (
                                                  <span className="text-red-400">No</span>
                                                ) : (
                                                  <span className="text-gray-500">—</span>
                                                )}
                                              </td>
                                              <td className="px-3 py-2 text-gray-400 text-xs whitespace-nowrap">
                                                {new Date(s.submittedAt).toLocaleString()}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
          </>
        )}

        {/* Edit User Modal */}
        {editModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-blue-800 rounded-lg border-2 border-yellow-500 p-6 max-w-md w-full">
              <h2 className="text-xl font-bold text-yellow-400 mb-4">Edit User</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-yellow-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-700 border border-yellow-500 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-yellow-400 mb-1">Username</label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm((f) => ({ ...f, username: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-700 border border-yellow-500 rounded text-white"
                  />
                </div>
                {actionError && (
                  <p className="text-red-400 text-sm">{actionError}</p>
                )}
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setEditModal(null)}
                  className="flex-1 px-4 py-2 bg-slate-600 text-gray-200 rounded hover:bg-slate-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 bg-yellow-500 text-slate-900 font-semibold rounded hover:bg-yellow-400 disabled:opacity-50"
                >
                  {actionLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Set Password Modal */}
        {passwordModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-blue-800 rounded-lg border-2 border-yellow-500 p-6 max-w-md w-full">
              <h2 className="text-xl font-bold text-yellow-400 mb-4">
                Set Password for {passwordModal.email}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-yellow-400 mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3 py-2 bg-slate-700 border border-yellow-500 rounded text-white"
                  />
                </div>
                {actionError && (
                  <p className="text-red-400 text-sm">{actionError}</p>
                )}
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setPasswordModal(null)}
                  className="flex-1 px-4 py-2 bg-slate-600 text-gray-200 rounded hover:bg-slate-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePassword}
                  disabled={actionLoading || newPassword.length < 6}
                  className="flex-1 px-4 py-2 bg-yellow-500 text-slate-900 font-semibold rounded hover:bg-yellow-400 disabled:opacity-50"
                >
                  {actionLoading ? "Saving..." : "Set Password"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-blue-800 rounded-lg border-2 border-yellow-500 p-6 max-w-md w-full">
              <h2 className="text-xl font-bold text-yellow-400 mb-4">Delete User</h2>
              <p className="text-gray-300 mb-4">
                Are you sure you want to delete <strong>{deleteModal.email}</strong>? This cannot be undone.
              </p>
              {actionError && (
                <p className="text-red-400 text-sm mb-4">{actionError}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="flex-1 px-4 py-2 bg-slate-600 text-gray-200 rounded hover:bg-slate-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-500 disabled:opacity-50"
                >
                  {actionLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

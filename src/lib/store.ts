/**
 * In-memory data store (no MongoDB).
 * Modules & questions loaded from data/app-data.json; others in memory.
 */

import * as fs from 'fs';
import * as path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'app-data.json');

// --- Types ---
export interface ModuleRecord {
  id: number;
  title: string;
  description: string;
  color: string;
}

export interface QuestionRecord {
  id: number;
  moduleId: number;
  question: string;
  options: string[];
  correctAnswer?: number;
}

export interface AnswerRecord {
  userId: string;
  moduleId: number;
  questionId: number;
  answer: string;
  isCorrect?: boolean;
  submittedAt: Date;
}

export interface VideoRecord {
  moduleId: number;
  videoType: 'english' | 'punjabi' | 'hindi' | 'activity';
  videoId: number;
  preview: string;
  fileName: string;
  fileSize: number;
  fileUrl?: string;
  uploadedBy?: string;
}

export interface UserRecord {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
}

export interface LoginHistoryRecord {
  userId: string;
  username: string;
  email: string;
  role: string;
  loginAt: Date;
  ipAddress: string;
  userAgent: string;
}

// --- In-memory stores ---
let modules: ModuleRecord[] = [];
let questionsByModule: Record<string, QuestionRecord[]> = {};
const answersStore: AnswerRecord[] = [];
const videosStore: VideoRecord[] = [];
const usersStore = new Map<string, UserRecord>();
const loginHistoryStore: LoginHistoryRecord[] = [];

let dataLoaded = false;

function loadData() {
  if (dataLoaded) return;
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const data = JSON.parse(raw);
    modules = Array.isArray(data.modules) ? data.modules : [];
    const q = data.questions;
    if (q && typeof q === 'object') {
      questionsByModule = q;
    }
    // Default admin (password: Welcome@25) - bcrypt hash
    const bcrypt = require('bcryptjs');
    const defaultHash = bcrypt.hashSync('Welcome@25', 10);
    usersStore.set('adohealthicmr', {
      id: 'admin-1',
      username: 'adohealthicmr',
      email: 'admin@adohealthicmr.com',
      passwordHash: defaultHash,
      role: 'admin',
    });
  } catch (e) {
    console.warn('Store: could not load app-data.json', e);
    modules = [];
    questionsByModule = {};
    const bcrypt = require('bcryptjs');
    const defaultHash = bcrypt.hashSync('Welcome@25', 10);
    usersStore.set('adohealthicmr', {
      id: 'admin-1',
      username: 'adohealthicmr',
      email: 'admin@adohealthicmr.com',
      passwordHash: defaultHash,
      role: 'admin',
    });
  }
  dataLoaded = true;
}

// --- Modules ---
export function getModules(): ModuleRecord[] {
  loadData();
  return [...modules].sort((a, b) => a.id - b.id);
}

export function getModuleById(id: number): ModuleRecord | undefined {
  loadData();
  return modules.find((m) => m.id === id);
}

export function createModule(data: ModuleRecord): ModuleRecord {
  loadData();
  if (modules.some((m) => m.id === data.id)) throw new Error(`Module with ID ${data.id} already exists`);
  modules.push({ ...data });
  return data;
}

export function updateModule(id: number, updates: Partial<Omit<ModuleRecord, 'id'>>): ModuleRecord | null {
  loadData();
  const i = modules.findIndex((m) => m.id === id);
  if (i === -1) return null;
  modules[i] = { ...modules[i], ...updates };
  return modules[i];
}

export function deleteModule(id: number): boolean {
  loadData();
  const i = modules.findIndex((m) => m.id === id);
  if (i === -1) return false;
  modules.splice(i, 1);
  return true;
}

// --- Questions ---
export function getQuestions(moduleId?: number): QuestionRecord[] {
  loadData();
  if (moduleId != null) {
    const list = questionsByModule[String(moduleId)] || [];
    return list.map((q) => ({ ...q, moduleId }));
  }
  const all: QuestionRecord[] = [];
  for (const [modId, list] of Object.entries(questionsByModule)) {
    for (const q of list) {
      all.push({ ...q, moduleId: parseInt(modId, 10) });
    }
  }
  return all.sort((a, b) => a.moduleId - b.moduleId || a.id - b.id);
}

export function getQuestionById(id: number, moduleId: number): QuestionRecord | undefined {
  loadData();
  const list = questionsByModule[String(moduleId)] || [];
  const q = list.find((x) => x.id === id);
  return q ? { ...q, moduleId } : undefined;
}

export function createQuestion(data: QuestionRecord): QuestionRecord {
  loadData();
  const key = String(data.moduleId);
  if (!questionsByModule[key]) questionsByModule[key] = [];
  if (questionsByModule[key].some((q) => q.id === data.id)) throw new Error(`Question with ID ${data.id} already exists`);
  questionsByModule[key].push({ ...data });
  return data;
}

export function updateQuestion(id: number, moduleId: number, updates: Partial<Omit<QuestionRecord, 'id' | 'moduleId'>>): QuestionRecord | null {
  loadData();
  const list = questionsByModule[String(moduleId)] || [];
  const i = list.findIndex((q) => q.id === id);
  if (i === -1) return null;
  list[i] = { ...list[i], ...updates };
  return list[i];
}

export function deleteQuestion(id: number, moduleId: number): boolean {
  loadData();
  const list = questionsByModule[String(moduleId)] || [];
  const i = list.findIndex((q) => q.id === id);
  if (i === -1) return false;
  list.splice(i, 1);
  return true;
}

// --- Answers ---
export function getAnswers(userId: string, moduleId?: number): AnswerRecord[] {
  loadData();
  let list = answersStore.filter((a) => a.userId === userId);
  if (moduleId != null) list = list.filter((a) => a.moduleId === moduleId);
  return list;
}

/** All answers (for admin statistics). */
export function getAllAnswers(moduleId?: number): AnswerRecord[] {
  loadData();
  let list = [...answersStore];
  if (moduleId != null) list = list.filter((a) => a.moduleId === moduleId);
  return list;
}

export function upsertAnswer(data: { userId: string; moduleId: number; questionId: number; answer: string; isCorrect?: boolean }): AnswerRecord {
  loadData();
  const existing = answersStore.findIndex(
    (a) => a.userId === data.userId && a.moduleId === data.moduleId && a.questionId === data.questionId
  );
  const record: AnswerRecord = {
    ...data,
    submittedAt: new Date(),
  };
  if (existing >= 0) {
    answersStore[existing] = record;
    return record;
  }
  answersStore.push(record);
  return record;
}

// --- Videos ---
export function getVideos(moduleId?: number, videoType?: string): VideoRecord[] {
  loadData();
  let list = [...videosStore];
  if (moduleId != null) list = list.filter((v) => v.moduleId === moduleId);
  if (videoType) list = list.filter((v) => v.videoType === videoType);
  return list;
}

export function createVideo(data: VideoRecord): VideoRecord {
  loadData();
  videosStore.push({ ...data });
  return data;
}

export function updateVideo(
  moduleId: number,
  videoType: string,
  videoId: number,
  updates: Partial<Pick<VideoRecord, 'preview' | 'fileName' | 'fileSize' | 'fileUrl'>>
): VideoRecord | null {
  loadData();
  const i = videosStore.findIndex((v) => v.moduleId === moduleId && v.videoType === videoType && v.videoId === videoId);
  if (i === -1) return null;
  videosStore[i] = { ...videosStore[i], ...updates };
  return videosStore[i];
}

export function deleteVideo(moduleId: number, videoType: string, videoId: number): boolean {
  loadData();
  const i = videosStore.findIndex((v) => v.moduleId === moduleId && v.videoType === videoType && v.videoId === videoId);
  if (i === -1) return false;
  videosStore.splice(i, 1);
  return true;
}

export function getVideoById(moduleId: number, videoType: string, videoId: number): VideoRecord | undefined {
  loadData();
  return videosStore.find((v) => v.moduleId === moduleId && v.videoType === videoType && v.videoId === videoId);
}

// --- Users (for admin login) ---
export function getUserByUsername(username: string): UserRecord | undefined {
  loadData();
  return usersStore.get(username);
}

export function getUserById(id: string): UserRecord | undefined {
  loadData();
  return Array.from(usersStore.values()).find((u) => u.id === id);
}

export function getAllUsers(opts?: { role?: 'user' | 'admin'; search?: string }): UserRecord[] {
  loadData();
  let list = Array.from(usersStore.values());
  if (opts?.role) list = list.filter((u) => u.role === opts.role);
  if (opts?.search) {
    const s = opts.search.toLowerCase();
    list = list.filter((u) => u.username.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
  }
  return list;
}

export function createUser(data: Omit<UserRecord, 'passwordHash'> & { password: string }): UserRecord {
  loadData();
  const bcrypt = require('bcryptjs');
  const passwordHash = bcrypt.hashSync(data.password, 10);
  const record: UserRecord = {
    id: data.id,
    username: data.username,
    email: data.email,
    passwordHash,
    role: data.role,
  };
  if (usersStore.has(data.username)) throw new Error(`User ${data.username} already exists`);
  usersStore.set(data.username, record);
  return record;
}

export function verifyUserPassword(username: string, password: string): boolean {
  const user = getUserByUsername(username);
  if (!user) return false;
  const bcrypt = require('bcryptjs');
  return bcrypt.compareSync(password, user.passwordHash);
}

export function updateUserById(
  id: string,
  updates: Partial<Pick<UserRecord, 'username' | 'email' | 'role'> & { password?: string }>
): UserRecord | null {
  loadData();
  const user = getUserById(id);
  if (!user) return null;
  const oldUsername = user.username;
  const next: UserRecord = {
    id: user.id,
    username: updates.username ?? user.username,
    email: updates.email ?? user.email,
    role: updates.role ?? user.role,
    passwordHash: user.passwordHash,
  };
  if (updates.password) {
    const bcrypt = require('bcryptjs');
    next.passwordHash = bcrypt.hashSync(updates.password, 10);
  }
  usersStore.delete(oldUsername);
  usersStore.set(next.username, next);
  return next;
}

export function deleteUserById(id: string): boolean {
  loadData();
  const user = getUserById(id);
  if (!user) return false;
  usersStore.delete(user.username);
  return true;
}

// --- Login history ---
export function addLoginHistory(record: LoginHistoryRecord): void {
  loginHistoryStore.push(record);
  if (loginHistoryStore.length > 1000) loginHistoryStore.shift();
}

export function getLoginHistory(limit = 100): LoginHistoryRecord[] {
  return [...loginHistoryStore].reverse().slice(0, limit);
}

// --- Persist modules/questions to file (admin data/save) ---
export function replaceModulesAndQuestions(
  newModules: ModuleRecord[],
  newQuestionsByModule: Record<string, Omit<QuestionRecord, 'moduleId'>[]>
): void {
  modules.length = 0;
  modules.push(...newModules.map((m) => ({ ...m })));
  for (const key of Object.keys(questionsByModule)) delete questionsByModule[key];
  for (const [modId, list] of Object.entries(newQuestionsByModule)) {
    const moduleIdNum = parseInt(modId, 10);
    questionsByModule[modId] = (list || []).map((q) => ({ ...q, moduleId: moduleIdNum }));
  }
  persistData();
}

function persistData(): void {
  try {
    const questionsOut: Record<string, Array<Omit<QuestionRecord, 'moduleId'>>> = {};
    for (const [modId, list] of Object.entries(questionsByModule)) {
      questionsOut[modId] = list.map(({ moduleId: _, ...q }) => ({ ...q }));
    }
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify({ modules, questions: questionsOut }, null, 2),
      'utf8'
    );
  } catch (e) {
    console.warn('Store: could not persist app-data.json', e);
  }
}

// --- Health (no DB) ---
export function getStoreStatus(): { modules: number; questions: number; users: number } {
  loadData();
  let questionCount = 0;
  for (const list of Object.values(questionsByModule)) questionCount += list.length;
  return { modules: modules.length, questions: questionCount, users: usersStore.size };
}

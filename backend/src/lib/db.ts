import Database from 'better-sqlite3';
import { config } from './config.js';
import { defaultUserTypingConfig } from './defaultData.js';

export const db = new Database(config.db_path);

db.exec(`CREATE TABLE IF NOT EXISTS user (
  id TEXT NOT NULL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  typing_config DEFAULT '${JSON.stringify(defaultUserTypingConfig)}' 
)`);

db.exec(`CREATE TABLE IF NOT EXISTS user_fingers_statistics(
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  finger_map TEXT NOT NULL,
  default_fingers_position TEXT NOT NULL,
  fingers_statistics TEXT NOT NULL
)`);

db.exec(`CREATE TABLE IF NOT EXISTS session (
  id TEXT NOT NULL PRIMARY KEY,
  expires_at INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id)
)`);

db.exec(`CREATE TABLE IF NOT EXISTS TypingTest (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  typingMode TEXT NOT NULL,
  typingEndMode TEXT NOT NULL,
  errorCorrectionMode INTEGER NOT NULL,
  timeStarted DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  timeEnded DATETIME NOT NULL,
  timeTaken INTEGER NOT NULL,
  wpm REAL NOT NULL,
  accuracy REAL NOT NULL,
  targetText TEXT NOT NULL,
  FOREIGN KEY(user_id) REFERENCES user(id)
)`)

export interface DatabaseUser {
  id: string;
  username: string;
  password: string;
}

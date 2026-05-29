// src/database/client.ts
import * as SQLite from 'expo-sqlite';
import { createTablesQuery } from './schema.sql';

// Open or create the database file
export const db = SQLite.openDatabaseSync('devvault.db');

export const initializeDatabase = () => {
  try {
    // Run the schema creation
    db.execSync(createTablesQuery);
    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};
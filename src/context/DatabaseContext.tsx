import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { initializeDatabase } from '../database/client';

const DatabaseContext = createContext(false);

export const DatabaseProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SQLiteProvider databaseName="devvault.db" onInit={initializeDatabase}>
      <DatabaseInitializer>{children}</DatabaseInitializer>
    </SQLiteProvider>
  );
};

const DatabaseInitializer = ({ children }: { children: React.ReactNode }) => {
  const [isReady, setIsReady] = useState(false);
  const db = useSQLiteContext();

  useEffect(() => {
    const setup = async () => {
      try {
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize database context:', error);
      }
    };
    setup();
  }, [db]);

  if (!isReady) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <DatabaseContext.Provider value={isReady}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabaseReady = () => useContext(DatabaseContext);

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#090D16',
  },
});\n
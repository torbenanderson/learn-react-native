/**
 * Budget App TypeScript Type Definitions
 * 
 * This file contains all the TypeScript interfaces and types
 * for the envelope budgeting application.
 */

/**
 * Envelope (Budget Category)
 * Represents a single budget envelope where money is allocated
 */
export interface Envelope {
  id: string;
  name: string;
  icon: string;
  color: string;
  allocated: number;        // Money allocated this period
  spent: number;            // Money spent so far
  available: number;        // allocated - spent (calculated)
  rolloverEnabled: boolean; // Roll unused funds to next period?
  targetAmount?: number;    // Optional monthly target
  sortOrder: number;        // Display order
  createdAt: string;        // ISO date string
  updatedAt: string;        // ISO date string
}

/**
 * Transaction
 * Represents a single financial transaction (income, expense, or transfer)
 */
export interface Transaction {
  id: string;
  envelopeId: string;
  envelopeName: string;      // Denormalized for easy display
  amount: number;            // Negative for expenses, positive for income
  description: string;
  date: string;              // ISO date string
  type: 'expense' | 'income' | 'transfer';
  transferToEnvelopeId?: string;  // For envelope-to-envelope transfers
  transferToEnvelopeName?: string;
  notes?: string;
  recurring?: RecurringConfig;
  createdAt: string;
  updatedAt: string;
}

/**
 * Recurring Transaction Configuration
 */
export interface RecurringConfig {
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly';
  interval: number;          // Every X days/weeks/months
  startDate: string;         // ISO date string
  endDate?: string;          // Optional end date
  nextOccurrence: string;    // Next scheduled date
}

/**
 * Budget Period
 * Represents a budgeting time period (typically monthly)
 */
export interface BudgetPeriod {
  id: string;
  startDate: string;         // ISO date string
  endDate: string;           // ISO date string
  totalIncome: number;
  totalAllocated: number;
  totalSpent: number;
  unallocated: number;       // Income not yet assigned to envelopes
  isCurrent: boolean;        // Is this the active period?
  createdAt: string;
  updatedAt: string;
}

/**
 * Unallocated Funds
 * Tracks money that hasn't been assigned to envelopes yet
 */
export interface UnallocatedFunds {
  amount: number;
  lastIncomeDate?: string;
  readyToAllocate: boolean;
}

/**
 * Budget Summary
 * Overall budget statistics and health
 */
export interface BudgetSummary {
  totalIncome: number;
  totalAllocated: number;
  totalSpent: number;
  totalRemaining: number;
  unallocatedFunds: number;
  envelopeCount: number;
  transactionCount: number;
  percentAllocated: number;  // (totalAllocated / totalIncome) * 100
  percentSpent: number;      // (totalSpent / totalAllocated) * 100
}

/**
 * Envelope with Transactions
 * Extended envelope data including recent transactions
 */
export interface EnvelopeWithTransactions extends Envelope {
  transactions: Transaction[];
  transactionCount: number;
  lastTransactionDate?: string;
}

/**
 * Budget Store State
 * Main application state structure (for Zustand)
 */
export interface BudgetState {
  // Data
  envelopes: Envelope[];
  transactions: Transaction[];
  currentPeriod: BudgetPeriod;
  unallocatedFunds: number;
  
  // Computed/Derived Data (getters)
  getTotalIncome: () => number;
  getTotalAllocated: () => number;
  getTotalSpent: () => number;
  getBudgetSummary: () => BudgetSummary;
  getEnvelopeById: (id: string) => Envelope | undefined;
  getTransactionsByEnvelope: (envelopeId: string) => Transaction[];
  
  // Envelope Actions
  addEnvelope: (envelope: Omit<Envelope, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEnvelope: (id: string, updates: Partial<Envelope>) => void;
  deleteEnvelope: (id: string) => void;
  allocateToEnvelope: (envelopeId: string, amount: number) => void;
  
  // Transaction Actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  // Transfer Actions
  transferBetweenEnvelopes: (fromId: string, toId: string, amount: number) => void;
  
  // Income Actions
  addIncome: (amount: number, description?: string) => void;
  
  // Period Actions
  startNewPeriod: () => void;
  rolloverPeriod: () => void;
  
  // Utility Actions
  resetBudget: () => void;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}

/**
 * Form States
 */
export interface EnvelopeFormData {
  name: string;
  icon: string;
  color: string;
  targetAmount: string;
  rolloverEnabled: boolean;
}

export interface TransactionFormData {
  description: string;
  amount: string;
  envelopeId: string;
  envelopeName: string;
  date: string;
  notes: string;
  type: 'expense' | 'income' | 'transfer';
}

/**
 * Navigation Params
 */
export interface EnvelopeDetailParams {
  id: string;
  name: string;
  allocated: string;
  spent: string;
}

export interface TransactionDetailParams {
  id: string;
}

/**
 * Filter and Sort Options
 */
export type TransactionFilter = 'all' | 'income' | 'expense' | 'transfer';
export type TransactionSort = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';

/**
 * App Settings
 */
export interface AppSettings {
  currency: string;              // USD, EUR, GBP, etc.
  currencySymbol: string;        // $, €, £, etc.
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  biometricAuth: boolean;
  periodStartDay: number;        // 1-31, day of month budget period starts
  defaultView: 'dashboard' | 'envelopes' | 'transactions';
}

/**
 * User Profile (for Phase 4 - Authentication)
 */
export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
  lastLoginAt: string;
  settings: AppSettings;
}

/**
 * Sync Status (for Phase 4 - Cloud Sync)
 */
export interface SyncStatus {
  lastSyncAt?: string;
  isSyncing: boolean;
  syncError?: string;
  pendingChanges: number;
}

/**
 * Export/Import Data Structure
 */
export interface BudgetExportData {
  version: string;
  exportedAt: string;
  envelopes: Envelope[];
  transactions: Transaction[];
  periods: BudgetPeriod[];
  settings: AppSettings;
}


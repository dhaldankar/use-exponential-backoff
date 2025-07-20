export interface ExponentialBackoffConfig {
  /** Initial delay in milliseconds (default: 1000) */
  initialDelay?: number;
  /** Maximum delay in milliseconds (default: 30000) */
  maxDelay?: number;
  /** Delay multiplier for each retry (default: 2) */
  multiplier?: number;
  /** Maximum number of retries (default: 5) */
  maxRetries?: number;
  /** Random jitter factor 0-1 (default: 0.1) */
  jitter?: number;
}

export interface ExponentialBackoffState {
  /** Whether currently retrying */
  isRetrying: boolean;
  /** Current retry attempt number */
  retryCount: number;
  /** Last error encountered */
  lastError: Error | null;
}

export interface ExponentialBackoffReturn extends ExponentialBackoffState {
  /** Execute operation with backoff retry logic */
  executeWithBackoff: <T>(
    operation: (signal: AbortSignal) => Promise<T>,
    onSuccess?: (result: T) => void,
    onFailure?: (error: Error, attempts: number) => void,
  ) => Promise<T | void>;
  /** Cancel any ongoing retry operation */
  cancel: () => void;
  /** Reset the hook state */
  reset: () => void;
  /** Get the next retry delay */
  getNextDelay: () => number;
  /** Configuration (read-only) */
  config: Required<ExponentialBackoffConfig>;
}

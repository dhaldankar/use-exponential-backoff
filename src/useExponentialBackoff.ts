import { useState, useCallback, useRef, useEffect } from "react";
import type {
  ExponentialBackoffConfig,
  ExponentialBackoffReturn,
} from "./types";

/**
 * A React hook that provides exponential backoff functionality for retrying operations
 */
export const useExponentialBackoff = (
  config: ExponentialBackoffConfig = {},
): ExponentialBackoffReturn => {
  const {
    initialDelay = 1000,
    maxDelay = 30000,
    multiplier = 2,
    maxRetries = 5,
    jitter = 0.1,
  } = config;

  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<Error | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const calculateDelay = useCallback(
    (attempt: number): number => {
      const baseDelay = Math.min(
        initialDelay * Math.pow(multiplier, attempt),
        maxDelay,
      );

      // Add jitter to prevent thundering herd problem
      const jitterAmount = baseDelay * jitter * Math.random();
      const finalDelay = baseDelay + jitterAmount;

      return Math.floor(finalDelay);
    },
    [initialDelay, maxDelay, multiplier, jitter],
  );

  const executeWithBackoff = useCallback(
    async <T>(
      operation: (signal: AbortSignal) => Promise<T>,
      onSuccess?: (result: T) => void,
      onFailure?: (error: Error, attempts: number) => void,
    ): Promise<T | void> => {
      // Reset state
      setRetryCount(0);
      setLastError(null);
      setIsRetrying(false);

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Create new abort controller for this execution
      abortControllerRef.current = new AbortController();

      const attemptOperation = async (attempt = 0): Promise<T | void> => {
        try {
          const result = await operation(abortControllerRef.current!.signal);

          // Success - reset state and call success callback
          setIsRetrying(false);
          setRetryCount(0);
          setLastError(null);

          if (onSuccess) {
            onSuccess(result);
          }

          return result;
        } catch (error) {
          const err = error instanceof Error ? error : new Error(String(error));

          // Check if operation was aborted
          if (err.name === "AbortError") {
            return;
          }

          setLastError(err);
          setRetryCount(attempt + 1);

          // Check if we should retry
          if (attempt < maxRetries) {
            const delay = calculateDelay(attempt);
            setIsRetrying(true);

            // Wait for delay before retrying
            await new Promise<void>((resolve) => {
              timeoutRef.current = setTimeout(resolve, delay);
            });

            // Check if not aborted before retrying
            if (!abortControllerRef.current?.signal.aborted) {
              return attemptOperation(attempt + 1);
            }
          } else {
            // Max retries reached
            setIsRetrying(false);

            if (onFailure) {
              onFailure(err, attempt + 1);
            } else {
              throw err;
            }
          }
        }
      };

      return attemptOperation();
    },
    [maxRetries, calculateDelay],
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setIsRetrying(false);
    setRetryCount(0);
    setLastError(null);
  }, []);

  const reset = useCallback(() => {
    cancel();
  }, [cancel]);

  const getNextDelay = useCallback(() => {
    return calculateDelay(retryCount);
  }, [calculateDelay, retryCount]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return {
    // State
    isRetrying,
    retryCount,
    lastError,

    // Methods
    executeWithBackoff,
    cancel,
    reset,
    getNextDelay,

    // Configuration (read-only)
    config: {
      initialDelay,
      maxDelay,
      multiplier,
      maxRetries,
      jitter,
    },
  };
};

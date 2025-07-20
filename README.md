# useExponentialBackoff

A React hook for handling retries with exponential backoff strategy.

## Installation

```bash
npm install use-exponential-backoff
```


## Usage
```jsx
import { useExponentialBackoff } from 'use-exponential-backoff';

const MyComponent = () => {
  const { executeWithBackoff, isRetrying, retryCount } = useExponentialBackoff({
    initialDelay: 1000,
    maxRetries: 3,
    multiplier: 2
  });

  const fetchData = async (signal) => {
    const response = await fetch('/api/data', { signal });
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  };

  const handleFetch = () => {
    executeWithBackoff(
      fetchData,
      (data) => console.log('Success:', data),
      (error) => console.error('Failed:', error)
    );
  };

  return (
    <button onClick={handleFetch} disabled={isRetrying}>
      {isRetrying ? `Retrying... (${retryCount})` : 'Fetch Data'}
    </button>
  );
};
```

## API
### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `initialDelay` | number | 1000 | Initial delay in milliseconds |
| `maxDelay` | number | 30000 | Maximum delay cap in milliseconds |
| `multiplier` | number | 2 | Multiplier for delay growth |
| `maxRetries` | number | 5 | Maximum number of retry attempts |
| `jitter` | number | 0.1 | Random jitter factor (0-1) |

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `executeWithBackoff` | function | Execute operation with retry logic |
| `isRetrying` | boolean | Whether currently retrying |
| `retryCount` | number | Current retry attempt number |
| `lastError` | Error \| null | Most recent error encountered |
| `cancel` | function | Cancel ongoing retry operation |
| `reset` | function | Reset hook state |
| `getNextDelay` | function | Get next retry delay |
| `config` | object | Current configuration (read-only) |

## License
MIT

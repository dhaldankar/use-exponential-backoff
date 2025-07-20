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
[Add your API documentation here]

## License
MIT

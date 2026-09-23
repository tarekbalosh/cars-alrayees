'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
          <h2>Something went wrong!</h2>
          <p style={{ display: 'none' }}>{error.message}</p>
          <button onClick={() => reset()} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#000', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

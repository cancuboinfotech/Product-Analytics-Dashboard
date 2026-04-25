export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;

  return (
    <div style={{ padding: '2rem', color: 'white', backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Documentation Center
      </h1>
      
      <div style={{ padding: '1.5rem', borderRadius: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        {!slug ? (
          <div>
            <h2 style={{ color: '#e2e8f0' }}>Welcome to the Docs</h2>
            <p style={{ color: '#94a3b8' }}>This is an <strong>Optional Catch-all Segment</strong>. It matches the root <code>/docs</code> path.</p>
            <p style={{ color: '#94a3b8' }}>Try visiting:</p>
            <ul style={{ color: '#38bdf8' }}>
              <li><code>/docs/getting-started</code></li>
              <li><code>/docs/api/endpoints/products</code></li>
            </ul>
          </div>
        ) : (
          <div>
            <h2 style={{ color: '#e2e8f0' }}>Path: {slug.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' > ')}</h2>
            <p style={{ color: '#94a3b8' }}>This route was matched by <code>[[...slug]]</code>.</p>
            <div style={{ marginTop: '1rem' }}>
              <h3 style={{ color: '#e2e8f0' }}>Segments identified:</h3>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                {slug.map((segment, i) => (
                  <span key={i} style={{ padding: '0.25rem 0.75rem', backgroundColor: '#334155', borderRadius: '9999px', fontSize: '0.875rem' }}>
                    {segment}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

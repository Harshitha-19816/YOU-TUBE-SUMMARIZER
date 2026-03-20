export default function TestPage() {
  return (
    <div style={{ padding: '50px', background: 'white', color: 'black' }}>
      <h1>Aether OS Diagnostics</h1>
      <p>If you see this page, the server is running correctly.</p>
      <p>Time: {new Date().toISOString()}</p>
    </div>
  )
}

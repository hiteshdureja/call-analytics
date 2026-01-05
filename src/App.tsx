import { Analytics } from "@vercel/analytics/react"
import Dashboard from "./pages/Dashboard"

function App() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <Dashboard />
      <Analytics />
    </div>
  )
}

export default App

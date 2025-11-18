import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import WaterCorpsChart from './WaterCorpsChart'
import './index.css'

const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
    <div className="text-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto mb-4"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-indigo-200 rounded-full animate-pulse border-t-indigo-600 mx-auto"></div>
      </div>
      <h3 className="text-white/90 font-semibold text-lg mb-2">Loading Analytics Dashboard</h3>
      <p className="text-white/60 text-sm">Preparing your water cost insights...</p>
    </div>
  </div>
)

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    const handleError = () => setHasError(true)
    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-pink-900 to-rose-900 flex items-center justify-center p-8">
        <div className="text-center bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-2xl font-bold mb-4">Dashboard Error</h2>
          <p className="text-white/80 mb-6">Something went wrong loading the analytics dashboard. Please refresh the page.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-all duration-300"
          >
            Refresh Dashboard
          </button>
        </div>
      </div>
    )
  }

  return children
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <WaterCorpsChart />
      </Suspense>
    </ErrorBoundary>
  </React.StrictMode>,
)

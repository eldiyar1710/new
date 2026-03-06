import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Header from './components/Header'

const Universities = lazy(() => import('./pages/Universities'))

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Navigate to="/universities" replace />} />
            <Route path="/universities" element={<Universities />} />
            <Route path="*" element={<Navigate to="/universities" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}

export default App

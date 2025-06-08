import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import { Today } from './pages/Today'
import { Upcoming } from './pages/Upcoming'
import { Category } from './pages/Category'
import { TaskProvider } from './store/TaskContext'
import { LayoutProvider } from './contexts/LayoutContext'
import { ErrorBoundary } from './components/ErrorBoundary'

export function App() {
  console.log('App rendering')
  return (
    <ErrorBoundary>
      <LayoutProvider>
        <TaskProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Today />} />
                <Route path="upcoming" element={<Upcoming />} />
                <Route path="category/:categoryName" element={<Category />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TaskProvider>
      </LayoutProvider>
    </ErrorBoundary>
  )
}

export default App

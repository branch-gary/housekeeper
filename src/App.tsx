import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import { Today } from './pages/Today'
import { Upcoming } from './pages/Upcoming'
import { Category } from './pages/Category'
import { SearchResults } from './pages/SearchResults'
import { TaskProvider } from './store/TaskContext'
import { LayoutProvider } from './contexts/LayoutContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ToastProvider } from './components/Toast/ToastProvider'

export function App() {
  console.log('App rendering')
  return (
    <ErrorBoundary>
      <LayoutProvider>
        <TaskProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route index element={<Today />} />
                  <Route path="upcoming" element={<Upcoming />} />
                  <Route path="category/:categoryName" element={<Category />} />
                  <Route path="search" element={<SearchResults />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </TaskProvider>
      </LayoutProvider>
    </ErrorBoundary>
  )
}

export default App

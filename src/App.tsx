import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import { Today } from './pages/Today'
import { Upcoming } from './pages/Upcoming'
import { Category } from './pages/Category'
import { SearchResults } from './pages/SearchResults'
import { TaskProvider } from './store/TaskContext'
import { PlanProvider } from './store/PlanContext'
import { LayoutProvider } from './contexts/LayoutContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ToastProvider } from './components/Toast/ToastProvider'
import { OnboardingProvider, useOnboarding } from './store/OnboardingContext'
import { DebugMenu } from './components/DebugMenu/DebugMenu'
import Onboarding from './components/Onboarding/Onboarding'

function AppRoutes() {
  const { state } = useOnboarding()

  // Show onboarding for new users
  if (!state.hasCompletedOnboarding) {
    return <Onboarding />
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Today />} />
        <Route path="upcoming" element={<Upcoming />} />
        <Route path="category/:categoryName" element={<Category />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <LayoutProvider>
          <TaskProvider>
            <PlanProvider>
              <ToastProvider>
                <OnboardingProvider>
                  <AppRoutes />
                  <DebugMenu />
                </OnboardingProvider>
              </ToastProvider>
            </PlanProvider>
          </TaskProvider>
        </LayoutProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App

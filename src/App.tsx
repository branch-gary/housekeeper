import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import { Today } from './pages/Today'
import { Upcoming } from './pages/Upcoming'
import { TaskProvider } from './store/TaskContext'

export function App() {
  return (
    <TaskProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Today />} />
            <Route path="upcoming" element={<Upcoming />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TaskProvider>
  )
}

export default App

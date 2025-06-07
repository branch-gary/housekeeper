import { Routes, Route } from 'react-router-dom'
import Today from '../pages/Today'
import Upcoming from '../pages/Upcoming'
import styles from './MainView.module.scss'

const MainView = () => {
  return (
    <main className={styles.main}>
      <Routes>
        <Route path="/" element={<Today />} />
        <Route path="/upcoming" element={<Upcoming />} />
      </Routes>
    </main>
  )
}

export default MainView 
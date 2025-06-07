import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import styles from './Layout.module.scss'

export function Layout() {
  console.log('Layout: Rendering')
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout 
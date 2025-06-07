import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import styles from './Layout.module.scss'

const Layout = () => {
  console.log('Layout rendering')
  console.log('styles:', styles)

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
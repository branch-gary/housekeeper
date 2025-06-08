import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header/Header'
import { useLayout } from '../contexts/LayoutContext'
import styles from './Layout.module.scss'

export function Layout() {
  const { isMobileMenuOpen, closeMobileMenu } = useLayout()

  return (
    <div className={styles.layout}>
      {/* Header */}
      <Header />

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className={styles.overlay}
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Content wrapper */}
      <div className={styles.contentWrapper}>
        {/* Sidebar */}
        <div 
          className={`${styles.sidebarWrapper} ${isMobileMenuOpen ? styles.open : ''}`}
          role="navigation"
          aria-label="Main navigation"
        >
          <Sidebar onMobileClose={closeMobileMenu} />
        </div>

        {/* Main Content */}
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout 
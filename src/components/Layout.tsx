import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useLayout } from '../contexts/LayoutContext'
import styles from './Layout.module.scss'

export function Layout() {
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useLayout()

  return (
    <div className={styles.layout}>
      {/* Mobile Menu Button */}
      <button 
        className={styles.menuButton}
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
        aria-expanded={isMobileMenuOpen}
      >
        <span className={styles.menuIcon}>
          <span className={`${styles.menuBar} ${isMobileMenuOpen ? styles.open : ''}`} />
        </span>
      </button>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className={styles.overlay}
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

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
  )
}

export default Layout 
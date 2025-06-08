import { useLayout } from '../../contexts/LayoutContext'
import styles from './Header.module.scss'

export function Header() {
  const { isMobileMenuOpen, toggleMobileMenu } = useLayout()

  return (
    <header className={styles.header}>
      <button 
        className={styles.menuButton}
        onClick={toggleMobileMenu}
        aria-label="Toggle sidebar"
        aria-expanded={isMobileMenuOpen}
      >
        <div className={`${styles.menuIcon} ${isMobileMenuOpen ? styles.open : ''}`}>
          <span className={styles.menuBar}></span>
          <span className={styles.menuBar}></span>
          <span className={styles.menuBar}></span>
        </div>
      </button>
    </header>
  )
}

export default Header 
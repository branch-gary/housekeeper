import Sidebar from './Sidebar'
import MainView from './MainView'
import styles from './Layout.module.scss'

const Layout = () => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <MainView />
    </div>
  )
}

export default Layout 
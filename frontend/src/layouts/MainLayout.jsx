import { Outlet } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'
import Footer from '../components/common/Footer'

function MainLayout() {
  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '20px' }}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default MainLayout
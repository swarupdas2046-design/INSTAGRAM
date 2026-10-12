import React from 'react'
import { Outlet } from 'react-router'
import Navbar from '../features/shared/components/Navbar'

// ==============================================================================
// 🏗️ MAIN LAYOUT
// Hinglish: Yeh layout Navbar aur main content dono ko wrap karta hai.
// Desktop pe sidebar fixed hoti hai aur content area uske right side me aata hai.
// md:pl-[72px] = collapsed sidebar width
// ==============================================================================
const MainLayout = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      {/* Main content area - sidebar ke baad right side me render hoga */}
      <main className="md:pl-[72px] pb-16 md:pb-0">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
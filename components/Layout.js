import React from 'react'
import NavBar from './NavBar'

function Layout({children}) {
  return (
     <div style={{minHeight:'100%'}}>
     <header>
     <NavBar/>
     </header>
         <main style={{minHeight:'100%'}}>
    {children}
     </main> 
     <footer>
     </footer>

     </div>
  )
}

export default Layout
import { useState } from 'react'
import Navbar from './components/Navbar'
import Manager from './components/Manager'
import Footer from './components/Footer'
import './App.css'

function App() {
  // min-h-[85vh] is given to bring footer down and we can use calc() to get exact appropriate loc for footer
  return (
    <>
      <Navbar/>
      <div className='bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]'>
        <div>Hello</div>
      <Manager/>
      </div>
      <Footer/>
    </>
  )
}

export default App

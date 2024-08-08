import React from 'react'

const Navbar = () => {
  return (
    <nav className='bg-slate-700 text-white'>
        <div className="mycontainer flex justify-between items-center px-4 py-5 h-14">

        <div className="logo font-bold text-white text-2xl">
            <span className='text-blue-500'>&lt;</span>
            Pass
            <span className='text-blue-500'>OP/&gt;</span>
            </div>
        {/* <ul>
            <li className='flex gap-4'>
                <a className='hover:font-bold' href="/">Home</a>
                <a className='hover:font-bold' href="#">About</a>
                <a className='hover:font-bold' href="#">Contact</a>
            </li>
        </ul> */}
        <a className='text-white bg-blue-700 my-5 rounded-full flex justify-between items-center ring-white ring-1' href='https://github.com/'>
          <img className='invert w-10 p-1' src="/icons/github.svg" alt="github logo" />
          <span className='font-bold px-2' >Github</span>
        </a>
        </div>
    </nav>
  )
}

export default Navbar
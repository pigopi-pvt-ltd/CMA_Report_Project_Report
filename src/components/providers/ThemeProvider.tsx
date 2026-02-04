import React from 'react'
import { AnimatedThemeToggler } from '../theme-togglers/animated-theme-toggler'

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <AnimatedThemeToggler className='fixed top-4 right-4 z-10' />
    </>
  )
}

export default ThemeProvider
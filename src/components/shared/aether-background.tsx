'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'

export function AetherBackground() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring physics for smooth movement
  const springConfig = { damping: 50, stiffness: 200, mass: 1 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  // Mouse tilt effect multipliers
  const rotateX = useTransform(smoothY, [-500, 500], [15, -15])
  const rotateY = useTransform(smoothX, [-500, 500], [-15, 15])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const x = clientX - window.innerWidth / 2
      const y = clientY - window.innerHeight / 2
      mouseX.set(x)
      mouseY.set(y)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-obsidian">
      {/* Liquid Mesh Gradient Layers */}
      <motion.div 
        style={{ x: smoothX, y: smoothY, rotateX, rotateY }}
        className="absolute inset-[-20%] flex items-center justify-center"
      >
        <div className="absolute top-[10%] left-[10%] w-[60%] h-[60%] bg-[#78350f] blur-[150px] rounded-full opacity-30 mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] bg-[#451a03] blur-[180px] rounded-full opacity-40 mix-blend-screen" />
        <div className="absolute top-[40%] right-[20%] w-[40%] h-[40%] bg-[#9a3412] blur-[120px] rounded-full opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-radial from-transparent via-[#0c0a09]/50 to-[#0c0a09] pointer-events-none" />
      </motion.div>

      {/* Subtle overlay texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] blend-overlay" />
    </div>
  )
}

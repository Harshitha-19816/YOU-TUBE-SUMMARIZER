'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ReactNode, useRef } from 'react'

interface DockProps {
  items: {
    id: string
    icon: ReactNode
    label: string
    active: boolean
    onClick: () => void
  }[]
}

export function GravityDock({ items }: DockProps) {
  const mouseX = useMotionValue(Infinity)

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-end gap-2 sm:gap-4 px-3 sm:px-6 py-3 sm:py-4 rounded-2xl sm:rounded-3xl frosted-crystal border border-white/10 shadow-2xl"
    >
      {items.map((item) => (
        <DockIcon key={item.id} mouseX={mouseX} item={item} />
      ))}
    </motion.div>
  )
}

function DockIcon({ mouseX, item }: { mouseX: any; item: any }) {
  const ref = useRef<HTMLDivElement>(null)

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const widthSync = useTransform(distance, [-150, 0, 150], [48, 72, 48])
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 })

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className={`h-16 sm:h-20 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors relative group ${
        item.active ? 'bg-white/10 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
      }`}
      onClick={item.onClick}
      whileTap={{ scale: 0.9 }}
    >
      <span className="text-xl sm:text-2xl mb-1">{item.icon}</span>
      <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-wider text-white/40 group-hover:text-white/80 transition-colors">
        {item.id === 'none' ? 'Home' : item.id === 'notes' ? 'Notes' : item.id === 'youtube' ? 'YouTube' : 'Jobs'}
      </span>
      
      {/* Active Indicator */}
      {item.active && (
        <motion.div 
          layoutId="dock-dot"
          className="absolute -bottom-1 w-1 h-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
        />
      )}
    </motion.div>
  )
}

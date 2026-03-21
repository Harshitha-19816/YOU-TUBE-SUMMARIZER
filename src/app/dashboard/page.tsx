'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  History, 
  Command as CommandIcon,
  User,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Toaster } from 'sonner'
import { LogoutButton } from '@/components/logout-button'
import { AetherBackground } from '@/components/shared/aether-background'
import { GravityDock } from '@/components/shared/gravity-dock'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

// Workspace Panels
import { NotesPanel } from '@/components/workspace/notes-panel'
import { YouTubePanel } from '@/components/workspace/youtube-panel'
import { JobsPanel } from '@/components/workspace/jobs-panel'

type ActiveView = 'none' | 'notes' | 'youtube' | 'jobs'

interface Activity {
  type: string
  msg: string
  time: string
}

export default function WorkspacePage() {
  const [activeTab, setActiveTab] = useState<ActiveView>('none')
  const [command, setCommand] = useState('')
  const [mounted, setMounted] = useState(false)
  const [activities, setActivities] = useState<Activity[]>([
    { type: 'System Boot', msg: 'Aether OS initialized', time: 'Just now' }
  ])
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    // Client-side session check as extra safety
    const checkSession = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      }
    }
    checkSession()
  }, [router])

  const logActivity = useCallback((type: string, msg: string) => {
    setActivities(prev => [{ type, msg, time: 'Just now' }, ...prev.slice(0, 9)])
  }, [])

  if (!mounted) return null

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault()
    const cmd = command.toLowerCase()
    if (cmd.includes('note')) {
      setActiveTab('notes')
      logActivity('Neural Link', 'Requested Notes Workspace')
    } else if (cmd.includes('youtube') || cmd.includes('summary')) {
      setActiveTab('youtube')
      logActivity('Scanner', 'Requested YouTube Workspace')
    } else if (cmd.includes('job') || cmd.includes('hire')) {
      setActiveTab('jobs')
      logActivity('Market', 'Requested Job Workspace')
    }
    setCommand('')
  }

  const DOCK_ITEMS = [
    { id: 'notes', icon: '📝', label: 'Neural Mind', active: activeTab === 'notes', onClick: () => setActiveTab('notes') },
    { id: 'youtube', icon: '📺', label: 'Visual Intel', active: activeTab === 'youtube', onClick: () => setActiveTab('youtube') },
    { id: 'jobs', icon: '💼', label: 'Market Ops', active: activeTab === 'jobs', onClick: () => setActiveTab('jobs') },
    { id: 'none', icon: '🏠', label: 'Central', active: activeTab === 'none', onClick: () => setActiveTab('none') },
  ]

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans selection:bg-white/10 selection:text-white overflow-hidden">
      <Toaster position="top-right" richColors />
      
      <AetherBackground />

      {/* Top Header - Mobile Responsive */}
      <header className="px-4 sm:px-6 py-4 sm:py-8 relative z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              className="w-10 h-10 frosted-crystal flex items-center justify-center rounded-xl border-white/20 cursor-pointer hover:border-white/40 transition-all" 
              onClick={() => setActiveTab('none')}
            >
              <span className="text-xl font-black italic text-glow text-white">A</span>
            </button>
            <h1 className="text-sm font-black tracking-[0.3em] text-white/40 hidden md:block uppercase">Nexus AI</h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
             <div className="flex items-center gap-2 px-3 sm:px-4 py-2 frosted-crystal rounded-full border-white/5">
                <User size={14} className="text-orange-500" />
                <span className="text-[8px] sm:text-[10px] font-black text-emerald-400/60 uppercase tracking-widest hidden sm:inline">Intelligence Node</span>
             </div>
             <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Workspace - Mobile Responsive */}
      <main className={`flex-1 relative z-10 flex flex-col items-center px-3 sm:px-6 pb-28 sm:pb-32 ${activeTab === 'none' ? 'justify-center' : 'justify-start pt-4 sm:pt-12 md:pt-20'}`}>
        <div className="absolute inset-x-6 top-0 bottom-32 pointer-events-none border-x border-white/5 opacity-20 hidden sm:block" />
        
        <AnimatePresence mode="wait">
          {activeTab === 'none' && (
            <motion.div 
              key="central"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="flex flex-col items-center text-center space-y-8 sm:space-y-12 max-w-2xl px-4 sm:px-8"
            >
              {/* Central Command Bar */}
              <form onSubmit={handleCommand} className="relative w-full group">
                <div className="relative frosted-crystal p-2 sm:p-3 rounded-2xl border-white/10 shadow-2xl flex items-center gap-2 sm:gap-4 h-14 sm:h-16">
                  <div className="p-2 sm:p-3 bg-white/5 rounded-xl">
                    <CommandIcon size={20} className="text-white/40" />
                  </div>
                  <Input 
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    placeholder="Initialize mission..."
                    className="bg-transparent border-none focus-visible:ring-0 text-base sm:text-xl w-full placeholder:text-slate-700 font-medium tracking-tight"
                  />
                  <Button type="submit" size="icon" className="rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all w-10 h-10 sm:w-12 sm:h-12 flex-none">
                    <Zap size={18} />
                  </Button>
                </div>
              </form>

              <div className="space-y-4">
                <motion.div 
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-16 h-1 bg-white/10 mx-auto rounded-full"
                />
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
                  NEXUS <span className="text-white/20">AI</span>
                </h2>
                <p className="text-slate-500 text-sm sm:text-lg font-medium max-w-md mx-auto leading-relaxed">
                  Your cognitive workspace, materializing at the edge of intelligence.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab !== 'none' && (
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: 'spring', mass: 1, stiffness: 120, damping: 22 }}
              className="w-full max-w-6xl h-full min-h-[400px] sm:min-h-[500px] max-h-[80vh] sm:max-h-[85vh] frosted-crystal rounded-[24px] sm:rounded-[40px] border-white/10 p-4 sm:p-8 flex flex-col shadow-2xl relative"
            >
              <div className="flex-1 overflow-hidden relative flex flex-col">
                {activeTab === 'notes' && <NotesPanel logActivity={logActivity} />}
                {activeTab === 'youtube' && <YouTubePanel logActivity={logActivity} />}
                {activeTab === 'jobs' && <JobsPanel logActivity={logActivity} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Activity History - Hidden on mobile */}
        <div className="fixed right-8 top-1/2 -translate-y-1/2 w-8 space-y-4 hidden lg:flex flex-col items-center">
          <div className="h-20 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-white/20" />
          <AnimatePresence initial={false}>
            {activities.slice(0, 5).map((act, i) => (
              <motion.div 
                key={act.time + i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <div className="w-2 h-2 rounded-full bg-white/40 group-hover:bg-white transition-colors cursor-pointer shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 frosted-crystal px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  <div className="text-[8px] font-black uppercase text-white/40 tracking-widest">{act.type}</div>
                  <div className="text-[10px] font-bold text-white">{act.msg}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="h-20 w-[1px] bg-gradient-to-t from-transparent via-white/10 to-white/20" />
        </div>
      </main>

      {/* The Gravity Dock */}
      <GravityDock items={DOCK_ITEMS} />

      <style jsx global>{`
        .text-glow {
          text-shadow: 0 0 15px rgba(255, 255, 255, 0.4);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
      `}</style>
    </div>
  )
}

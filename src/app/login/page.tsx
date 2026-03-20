'use client'

import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Chrome, Sparkles } from 'lucide-react'
import { AetherBackground } from '@/components/shared/aether-background'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const supabase = createClient()

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          prompt: 'select_account',
        },
      },
    })
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <AetherBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="frosted-crystal iridescent-border rounded-[2.5rem] p-12 text-center shadow-2xl">
          <div className="mx-auto w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-10 border border-white/10 shadow-inner group transition-all hover:bg-white/10">
            <span className="text-4xl font-black text-white italic tracking-tighter uppercase text-glow">A</span>
          </div>
          
          <div className="space-y-4 mb-12">
            <h2 className="text-4xl font-black text-white italic tracking-tight uppercase">
              Aether <span className="text-white/20">OS</span>
            </h2>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
              Initialize Neural Session
            </p>
          </div>
          
          <Button 
            onClick={handleLogin}
            className="w-full h-16 bg-rust text-white font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 rounded-2xl shadow-xl shadow-rust/20 group border border-white/10"
          >
            <Chrome className="w-5 h-5 transition-transform group-hover:rotate-12" />
            Sign In with Google
          </Button>
          
          <div className="mt-12 flex items-center justify-center gap-2 opacity-20 group cursor-default">
            <Sparkles size={12} className="text-white" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em]">Neural Encryption Active</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

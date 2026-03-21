'use client'

import { motion } from 'framer-motion'
import { Sparkles, Brain, Youtube, Briefcase, ArrowRight, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { AetherBackground } from '@/components/shared/aether-background'
import { Button } from '@/components/ui/button'

export function AetherLanding() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden selection:bg-white/10 selection:text-white">
      <AetherBackground />
      
      {/* Floating UI Elements for Depth */}
      <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-violet-500/5 rounded-full blur-[120px] animate-pulse delay-700" />

      <main className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full frosted-crystal border-white/5 mb-12"
        >
          <Sparkles className="w-4 h-4 text-white/60" />
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Next Gen AI Workspace</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-6xl md:text-8xl font-black text-white italic tracking-tighter leading-[0.9] mb-8 text-glow"
        >
          NEXUS <span className="text-white/20">AI</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-2xl text-white/40 max-w-2xl mx-auto mb-12 font-medium tracking-tight"
        >
          A luxurious, liquid-motion workspace orchestrating your digital mind, visual intel, and market reach.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24"
        >
          <Link href="/login">
            <Button className="bg-rust text-white px-10 h-16 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-rust/20 group border border-white/10">
              Initialize Workspace
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <button className="text-white/40 hover:text-white transition-colors text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
            Explore Features <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { icon: Brain, title: 'Digital Mind', desc: 'Neural node archiving for your thoughts and creative assets.', color: 'emerald' },
            { icon: Youtube, title: 'Visual Intel', desc: 'Instant extraction of video intelligence through neural unfurling.', color: 'violet' },
            { icon: Briefcase, title: 'Market Reach', desc: 'Autonomous crawling of the global career marketplace.', color: 'cyan' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 + i * 0.1 }}
              className="frosted-crystal iridescent-border rounded-[2rem] p-8 text-left group hover:scale-[1.02] transition-all cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:bg-white/10 transition-colors">
                <feature.icon className="w-6 h-6 text-white/60" />
              </div>
              <h3 className="text-lg font-black text-white italic uppercase tracking-tighter mb-2">{feature.title}</h3>
              <p className="text-sm text-white/20 font-medium leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="absolute bottom-12 w-full text-center">
        <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.8em]">End of Transmission</p>
      </footer>
    </div>
  )
}

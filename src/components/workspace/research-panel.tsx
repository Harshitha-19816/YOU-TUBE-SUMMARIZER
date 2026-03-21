'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Loader2, BookOpen, Link as LinkIcon, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

interface Source {
  title: string
  url: string
}

interface ResearchResult {
  answer: string
  sources: Source[]
}

export function ResearchPanel({ logActivity }: { logActivity: (type: string, msg: string) => void }) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ResearchResult | null>(null)

  const handleResearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/ai/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })

      const data = await res.json()
      if (res.ok) {
        setResult(data)
        logActivity('Research', 'Deep web analysis completed')
        toast.success('Research completed')
      } else {
        toast.error(data.error || 'Failed to conduct research')
      }
    } catch (err) {
      toast.error('An error occurred during research')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Panel Header */}
      <div className="flex-none flex items-center justify-between mb-4 sm:mb-8">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
              <BookOpen className="text-white/60" size={24} />
           </div>
           <div>
             <h2 className="text-xl sm:text-2xl font-black text-white italic tracking-tighter uppercase text-glow">Deep Research</h2>
             <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Autonomous Node Scanning</p>
           </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-none mb-6 sm:mb-10">
        <div className="relative group">
          <div className="relative frosted-crystal p-3 rounded-2xl border-white/10 flex items-center gap-4 h-16 shadow-2xl">
            <div className="p-3 bg-white/5 rounded-xl">
              <Search size={20} className="text-white/40" />
            </div>
            <Input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleResearch()}
              placeholder="Ask a deep question to the network..."
              className="bg-transparent border-none focus-visible:ring-0 text-sm sm:text-lg h-10 w-full placeholder:text-slate-700 font-medium tracking-tight text-white"
            />
            <Button 
              onClick={handleResearch}
              disabled={loading || !query}
              className="bg-purple-600 text-white hover:bg-purple-500 border border-white/10 px-8 h-12 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-20 shadow-xl shadow-purple-900/20 flex-none"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "INVESTIGATE"}
            </Button>
          </div>
        </div>
      </div>

      {/* Results Workspace */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-4 custom-scrollbar">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center space-y-6"
            >
              <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden relative">
                 <motion.div 
                   animate={{ x: ['-100%', '100%'] }}
                   transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                   className="absolute inset-0 bg-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)] bg-purple-500" 
                 />
              </div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] animate-pulse italic">Scanning global nodes...</p>
            </motion.div>
          ) : result ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 100 }}
              className="space-y-6 pb-8"
            >
              <div className="frosted-crystal border-white/10 rounded-[32px] p-6 sm:p-8 relative">
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                   <div className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                     <Sparkles size={12} /> AI Synthesized
                   </div>
                </div>
                
                <h3 className="text-xl font-black text-white italic tracking-tighter mb-6">Research Findings</h3>
                
                <div className="prose prose-invert prose-purple max-w-none text-white/80 marker:text-purple-400 prose-a:text-purple-400 hover:prose-a:text-purple-300">
                  <ReactMarkdown>{result.answer}</ReactMarkdown>
                </div>

                {result.sources && result.sources.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/40 mb-4">
                      <LinkIcon size={14} /> Source Nodes
                    </h4>
                    <ul className="space-y-2">
                      {result.sources.map((s, i) => (
                        <li key={i}>
                          <a 
                            href={s.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs sm:text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2"
                          >
                            <span className="text-white/20">[{i + 1}]</span> {s.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center space-y-10"
            >
               <div className="relative">
                 <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl animate-pulse" />
                 <BookOpen size={80} className="text-white/5 relative z-10" />
               </div>
               <div className="space-y-2">
                 <p className="text-[12px] font-black text-white/10 uppercase tracking-[0.6em] italic">Awaiting Research Parameters</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

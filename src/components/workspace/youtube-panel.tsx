'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Youtube, Search, Loader2, ListChecks, Info, Lightbulb, Copy, Check, Sparkles, Save } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface Summary {
  explanation: string
  key_points: string[]
  bullet_summary: string[]
}

export function YouTubePanel({ logActivity }: { logActivity: (type: string, msg: string) => void }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)

  const saveToNotes = async () => {
    if (!summary) return
    setSaving(true)
    try {
      const text = `
Explanation: ${summary.explanation}

Key Points:
${summary.key_points.map(p => `- ${p}`).join('\n')}

Detailed Summary:
${summary.bullet_summary.map(p => `- ${p}`).join('\n')}
      `.trim()
      
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: `Video Intel Extracted`, content: text }),
      })
      
      if (res.ok) {
        toast.success('Saved to Notes!')
        logActivity('Scanner', 'Summary archived to Notes')
      } else {
        toast.error('Failed to save note')
      }
    } catch (err) {
      toast.error('An error occurred while saving')
    } finally {
      setSaving(false)
    }
  }

  const handleSummarize = async () => {
    if (!url.trim()) return
    setLoading(true)
    setSummary(null)

    try {
      const res = await fetch('/api/ai/youtube-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      const data = await res.json()
      if (res.ok) {
        setSummary(data)
        logActivity('Scanner', 'Video intelligence extracted')
        toast.success('Summary generated!')
      } else {
        toast.error(data.error || 'Failed to generate summary')
      }
    } catch (err) {
      toast.error('An error occurred during summarization')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (!summary) return
    const text = `
Explanation: ${summary.explanation}

Key Points:
${summary.key_points.map(p => `- ${p}`).join('\n')}

Detailed Summary:
${summary.bullet_summary.map(p => `- ${p}`).join('\n')}
    `.trim()
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Copied to clipboard')
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Panel Header */}
      <div className="flex-none flex items-center justify-between mb-4 sm:mb-8">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
              <Youtube className="text-white/60" size={24} />
           </div>
           <div>
             <h2 className="text-xl sm:text-2xl font-black text-white italic tracking-tighter uppercase text-glow">Visual Intel</h2>
             <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Neural Video Extraction</p>
           </div>
        </div>

        {summary && (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={saveToNotes}
              disabled={saving}
              className="text-white/40 hover:text-white hover:bg-white/5 gap-2 rounded-2xl font-black text-[10px] uppercase tracking-widest px-4 h-10 border border-white/5"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={16} />}
              Save Note
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={copyToClipboard}
              className="text-white/40 hover:text-white hover:bg-white/5 gap-2 rounded-2xl font-black text-[10px] uppercase tracking-widest px-4 h-10 border border-white/5"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={16} />}
              {copied ? 'Captured' : 'Extract Data'}
            </Button>
          </div>
        )}
      </div>

      {/* Input Area: The "Scanner" */}
      <div className="flex-none mb-6 sm:mb-10">
        <div className="relative group">
          <div className="relative frosted-crystal p-3 rounded-2xl border-white/10 flex items-center gap-4 h-16 shadow-2xl">
            <div className="p-3 bg-white/5 rounded-xl">
              <Search size={20} className="text-white/40" />
            </div>
            <Input 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSummarize()}
              placeholder="Paste YouTube URL..."
              className="bg-transparent border-none focus-visible:ring-0 text-sm sm:text-lg h-10 w-full placeholder:text-slate-700 font-medium tracking-tight"
            />
            <Button 
              onClick={handleSummarize}
              disabled={loading || !url}
              className="bg-rust text-white hover:bg-rust/90 border border-white/10 px-8 h-12 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-20 shadow-xl shadow-rust/20 flex-none"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "PROCEED"}
            </Button>
          </div>
        </div>
      </div>

      {/* Results Workspace: The "Unfurl" */}
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
                   className="absolute inset-0 bg-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
                 />
              </div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] animate-pulse italic">Analyzing Neural Pathways...</p>
            </motion.div>
          ) : summary ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 100 }}
              className="space-y-8 pb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Summary Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="frosted-crystal iridescent-border rounded-3xl p-6 group shadow-lg"
                >
                   <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <Lightbulb size={16} className="text-white/60" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Core Logic</span>
                   </div>
                   <p className="text-white/60 text-sm leading-relaxed font-medium">
                     {summary.explanation}
                   </p>
                </motion.div>

                {/* Key Points Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="frosted-crystal iridescent-border rounded-3xl p-6 group shadow-lg"
                >
                   <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <Sparkles size={16} className="text-white/60" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Key Nodes</span>
                   </div>
                   <ul className="space-y-3">
                     {summary.key_points.map((pt, i) => (
                       <li key={i} className="flex items-start gap-3 text-white/40 text-[11px] leading-snug font-medium">
                         <div className="w-1 h-1 rounded-full bg-white/60 mt-1.5 shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                         {pt}
                       </li>
                     ))}
                   </ul>
                </motion.div>

                {/* Detailed Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="md:col-span-2 frosted-crystal iridescent-border rounded-[40px] p-8 group shadow-2xl"
                >
                   <div className="flex items-center gap-4 mb-8">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                        <ListChecks size={20} className="text-white/60" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Sequence Breakdown</span>
                   </div>
                   <div className="space-y-8">
                      {summary.bullet_summary.map((pt, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className="flex gap-6 group/item"
                        >
                           <div className="flex flex-col items-center pt-1">
                              <div className="w-2 h-2 rounded-full border-2 border-white/20 group-hover/item:border-white/60 transition-colors shadow-[0_0_10px_rgba(255,255,255,0.1)]"></div>
                              <div className="w-[1px] h-full bg-gradient-to-b from-white/10 to-transparent mt-2"></div>
                           </div>
                           <p className="text-white/60 text-sm leading-relaxed pb-4 font-medium transition-colors group-hover/item:text-white/80">
                             {pt}
                           </p>
                        </motion.div>
                      ))}
                   </div>
                </motion.div>
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
                 <Youtube size={80} className="text-white/5 relative z-10" />
               </div>
               <div className="space-y-2">
                 <p className="text-[12px] font-black text-white/10 uppercase tracking-[0.6em] italic">Awaiting Input Source</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

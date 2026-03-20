'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Briefcase, Search, Loader2, MapPin, Building2, ExternalLink, Sparkles, Filter } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface Job {
  title: string
  company: string
  location: string
  link: string
}

export function JobsPanel({ logActivity }: { logActivity: (type: string, msg: string) => void }) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setJobs([])

    try {
      const res = await fetch('/api/ai/job-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })

      const data = await res.json()
      if (res.ok) {
        setJobs(data.jobs || [])
        logActivity('Market', `Found ${data.jobs?.length || 0} opportunities`)
        if (data.jobs?.length === 0) toast.info('No jobs found for this query')
        else toast.success(`Found ${data.jobs.length} jobs!`)
      } else {
        toast.error(data.error || 'Failed to search for jobs')
      }
    } catch (err) {
      toast.error('An error occurred during search')
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
              <Briefcase className="text-white/60" size={24} />
           </div>
           <div>
             <h2 className="text-xl sm:text-2xl font-black text-white italic tracking-tighter uppercase text-glow">Market Intel</h2>
             <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Neural Career Matching</p>
           </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 frosted-crystal rounded-full border-white/5">
           <Sparkles size={12} className="text-white/40" />
           <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Firecrawl V2</span>
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
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search roles or companies..."
              className="bg-transparent border-none focus-visible:ring-0 text-sm sm:text-lg h-10 w-full placeholder:text-slate-700 font-medium tracking-tight"
            />
            <Button 
              onClick={handleSearch}
              disabled={loading || !query}
              className="bg-rust text-white hover:bg-rust/90 border border-white/10 px-8 h-12 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-20 shadow-xl shadow-rust/20"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "PROCEED"}
            </Button>
          </div>
        </div>
      </div>

      {/* Results View: The "Staggered Cascade" */}
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
              <div className="relative w-20 h-20">
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                   className="absolute inset-0 border-2 border-white/5 rounded-full"
                 />
                 <motion.div 
                   animate={{ rotate: -360 }}
                   transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                   className="absolute inset-2 border-2 border-white/20 border-t-white/60 rounded-full"
                 />
              </div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] animate-pulse italic">Scanning Global Marketplace...</p>
            </motion.div>
          ) : jobs.length > 0 ? (
            <motion.div
              key="results"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className="grid grid-cols-1 gap-4 pb-8"
            >
              {jobs.map((job, i) => (
                <motion.div 
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.95 },
                    visible: { opacity: 1, y: 0, scale: 1 }
                  }}
                  transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                  className="group relative"
                >
                  <div className="frosted-crystal iridescent-border rounded-3xl p-6 group cursor-default transition-all hover:scale-[1.01]">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 border border-white/10 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
                          <Building2 size={28} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-black text-white text-base italic tracking-tight uppercase group-hover:text-white transition-colors font-medium">{job.title}</h4>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">{job.company}</span>
                            <div className="w-1 h-1 rounded-full bg-white/10" />
                            <span className="text-[10px] text-white/20 flex items-center gap-1.5 font-bold uppercase tracking-widest">
                              <MapPin size={12} className="text-white/40" /> {job.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        onClick={() => typeof window !== 'undefined' && window.open(job.link, '_blank')}
                        className="w-full md:w-auto bg-white/5 border border-white/10 text-white/40 font-black text-[10px] uppercase tracking-widest hover:border-white/40 hover:text-white hover:bg-white/10 h-12 rounded-2xl px-10 transition-all shadow-lg active:scale-95"
                      >
                        Secure Role
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
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
                 <Briefcase size={80} className="text-white/5 relative z-10" />
               </div>
               <p className="text-[12px] font-black text-white/10 uppercase tracking-[0.6em] italic">Market Feed Ready</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

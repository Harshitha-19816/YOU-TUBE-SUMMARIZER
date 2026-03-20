'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface Note {
  id?: string
  title: string
  content: string
}

interface NoteEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (note: { title: string; content: string; id?: string }) => void
  initialData?: Note | null
}

export function NoteEditor({ open, onOpenChange, onSave, initialData }: NoteEditorProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setContent(initialData.content)
    } else {
      setTitle('')
      setContent('')
    }
  }, [initialData, open])

  const handleSave = () => {
    if (!title.trim()) return
    onSave({ title, content, id: initialData?.id })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar frosted-crystal iridescent-border text-white shadow-3xl p-8 rounded-[40px] border-white/20">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-3xl font-black italic tracking-tighter uppercase text-white">
            {initialData ? 'Memory Revision' : 'Memory Initialization'}
          </DialogTitle>
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-1">Authorized Data Input</p>
        </DialogHeader>
        
        <div className="grid gap-10 py-4">
          <div className="grid gap-4">
            <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-orange-500/60 ml-2">Sector Label</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Input designation..."
              className="bg-white/5 border-white/10 focus:border-white/40 text-white h-14 text-xl px-6 rounded-2xl transition-all placeholder:text-white/5 font-medium tracking-tight"
            />
          </div>
          <div className="grid gap-4">
            <Label htmlFor="content" className="text-[10px] font-black uppercase tracking-widest text-orange-500/60 ml-2">Neural Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?..."
              className="min-h-[250px] bg-white/5 border-white/10 focus:border-white/40 text-white text-base p-6 rounded-3xl resize-none transition-all leading-relaxed placeholder:text-white/5 font-medium"
            />
          </div>
        </div>

        <DialogFooter className="mt-8 gap-4 sm:gap-0">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)} 
            className="text-white/40 hover:text-white hover:bg-white/5 rounded-2xl font-black text-[10px] uppercase tracking-widest px-8"
          >
            Abort
          </Button>
          <Button 
            onClick={handleSave} 
            className="bg-rust text-white font-black text-[10px] uppercase tracking-[0.2em] px-10 h-12 rounded-2xl shadow-xl shadow-rust/20 transition-all hover:bg-rust/90 hover:scale-[1.02] active:scale-[0.98] border border-white/10"
          >
            PROCEED
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

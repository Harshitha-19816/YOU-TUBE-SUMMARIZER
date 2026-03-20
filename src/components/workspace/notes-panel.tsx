'use client'

import { useState, useEffect } from 'react'
import { NoteCard } from '@/components/notes/note-card'
import { NoteEditor } from '@/components/notes/note-editor'
import { Button } from '@/components/ui/button'
import { Plus, Search, Loader2, StickyNote, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { AnimatePresence, motion } from 'framer-motion'

interface Note {
  id: string
  title: string
  content: string
  created_at: string
}

export function NotesPanel({ logActivity }: { logActivity: (type: string, msg: string) => void }) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes')
      const data = await res.json()
      if (res.ok) setNotes(data)
    } catch (err) {
      toast.error('Failed to fetch notes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const handleSaveNote = async (noteData: { title: string; content: string; id?: string }) => {
    const isEditing = !!noteData.id
    const method = isEditing ? 'PATCH' : 'POST'
    const url = isEditing ? `/api/notes/${noteData.id}` : '/api/notes'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData),
      })

      if (res.ok) {
        toast.success(isEditing ? 'Note updated' : 'Note created')
        logActivity('Neural Link', isEditing ? 'Memory record updated' : 'New memory initialized')
        fetchNotes()
      } else {
        toast.error('Failed to save note')
      }
    } catch (err) {
      toast.error('Error saving note')
    }
  }

  const handleDeleteNote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return

    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Note deleted')
        logActivity('Neural Link', 'Memory record purged')
        setNotes(notes.filter((n) => n.id !== id))
      } else {
        toast.error('Failed to delete note')
      }
    } catch (err) {
      toast.error('Error deleting note')
    }
  }

  const filteredNotes = notes.filter((n) => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.content.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Panel Header */}
      <div className="flex-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-8">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
              <StickyNote className="text-white/60" size={24} />
           </div>
           <div>
             <h2 className="text-xl sm:text-2xl font-black text-white italic tracking-tighter uppercase">Neural Mind</h2>
             <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Synaptic Data Stream</p>
           </div>
        </div>

        <div className="flex items-center gap-3 h-12">
          <div className="relative group h-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Query memory..." 
              className="pl-11 pr-4 w-64 bg-white/5 border-white/10 focus:border-white/30 text-white rounded-2xl h-full text-xs placeholder:text-white/10 transition-all font-medium" 
            />
          </div>
          <Button 
            onClick={() => { setEditingNote(null); setEditorOpen(true); }}
            className="bg-rust text-white h-full px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest gap-2 hover:bg-rust/90 hover:scale-[1.02] active:scale-[0.98] transition-all border border-white/10 shadow-xl shadow-rust/20"
          >
            <Plus size={14} />
            PROCEED
          </Button>
        </div>
      </div>

      {/* Panel Content */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-cyber-lime animate-spin opacity-50" />
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
            <StickyNote size={48} className="text-slate-700" />
            <p className="text-slate-500 text-sm font-medium tracking-wide">NO DATA RECORDED IN THIS SECTOR</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
            <AnimatePresence mode="popLayout">
              {filteredNotes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <NoteCard 
                    note={note} 
                    onEdit={(n) => { setEditingNote(n); setEditorOpen(true); }}
                    onDelete={handleDeleteNote}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <NoteEditor 
        open={editorOpen} 
        onOpenChange={setEditorOpen}
        initialData={editingNote}
        onSave={handleSaveNote}
      />
    </div>
  )
}
